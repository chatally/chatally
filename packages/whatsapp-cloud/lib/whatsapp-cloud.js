import { BaseServer } from '@chatally/core'
import { GraphApi } from './graph-api.js'
import { Media } from './media.js'
import { Messages } from './messages.js'
import { toChatallyMessage } from './to-chatally-message.js'
import { toWhatsAppMessage } from './to-whatsapp-message.js'
import { deepMerge } from './utils/deep-merge.js'
import { envBoolean, envNumber } from './utils/env.js'
import { readJsonOrYamlFile } from './utils/read-json-or-yaml.js'
import { Webhooks } from './webhooks.js'

export class WhatsAppCloud extends BaseServer {
  /**
   * Indicate, whether messages should be delivered immediately (on write)
   * instead of on end.
   * [default=false]
   * @type {boolean}
   */
  immediate

  /** @type {import("./whatsapp-cloud.d.ts").WhatsAppCloudConfig} */
  #config
  /** @type {Webhooks} */
  #webhooks
  /** @type {GraphApi} */
  #graphApi
  /** @type {Messages} */
  #messages
  /** @type {Media} */
  #media

  /**
   * @param {Partial<import("./whatsapp-cloud.d.ts").WhatsAppCloudConfig>} [configObj]
   */
  constructor (configObj) {
    const config = readConfigs(configObj)
    super(config.name || 'WhatsAppCloud')
    this.#config = config
  }

  init () {
    const {
      immediate = false,
      webhooks,
      graphApi,
      messages,
      media
    } = this.#config
    const log = this.log || this.#config.log

    this.immediate = immediate

    if (webhooks instanceof Webhooks) {
      this.#webhooks = webhooks
    } else {
      this.#webhooks = new Webhooks({
        log: log?.child({ name: 'Webhooks' }),
        ...webhooks
      })
    }

    if (graphApi instanceof GraphApi) {
      this.#graphApi = graphApi
    } else {
      this.#graphApi = new GraphApi({
        log: log?.child({ name: 'GraphApi' }),
        ...graphApi
      })
    }

    if (messages instanceof Messages) {
      this.#messages = messages
    } else {
      this.#messages = new Messages({
        log: log?.child({ name: 'Messages' }),
        graphApi: this.#graphApi,
        ...messages
      })
    }

    if (media instanceof Media) {
      this.#media = media
    } else {
      this.#media = new Media({
        log: log?.child({ name: 'Media' }),
        graphApi: this.#graphApi,
        ...media
      })
    }
    this.log = log
  }

  /** @type {import("@chatally/logger").Logger | undefined} */
  #log

  get log () {
    return this.#log
  }

  /**
   * @param {import("@chatally/logger").Logger | undefined} log
   */
  set log (log) {
    this.#log = log
    if (this.#webhooks instanceof Webhooks) {
      this.#webhooks.log = log?.child({ name: 'Webhooks' })
    }
    if (this.#graphApi instanceof GraphApi) {
      this.#graphApi.log = log?.child({ name: 'GraphApi' })
    }
    if (this.#messages instanceof Messages) {
      this.#messages.log = log?.child({ name: 'Messages' })
    }
    if (this.#media instanceof Media) {
      this.#media.log = log?.child({ name: 'Media' })
    }
  }

  /** @param {number} [port] */
  listen (port) {
    this.init()
    this.#webhooks.on('notification', this.#handleNotification.bind(this))
    this.#webhooks.listen(port)
    this.#messages.waitForDelivered(this.#webhooks)
  }

  /** @param {import("./webhooks.d.ts").WebhooksNotification} notification */
  #handleNotification ({ messages }) {
    // TODO: Handle statuses and errors
    for (const message of messages) {
      this.log?.debug('Received message', message)
      this.#messages.markAsRead(message.id)
      const to = message.from
      const chatallyMessage = toChatallyMessage(message)
      if (this.immediate) {
        this.dispatch(chatallyMessage, {
          onWrite: async (msg) => await this.send(to, msg)
        })
      } else {
        this.dispatch(chatallyMessage, {
          onFinished: async (res) => await this.send(to, ...res.messages)
        })
      }
    }
  }

  /**
   * @param {string} to recipient
   * @param {...import("@chatally/core").OutgoingMessage} outgoing
   */
  async send (to, ...outgoing) {
    for (const message of outgoing) {
      const whatsAppMessage = toWhatsAppMessage(message)
      await this.#messages.send(to, whatsAppMessage)
      this.log?.debug('Sent message', { to, ...whatsAppMessage })
    }
  }

  /**
   * @param {string} file
   */
  async upload (file) {
    const mediaId = await this.#media.upload(file)
    this.log?.debug('Uploaded file', { file, mediaId })
    return mediaId
  }

  /**
   * @param {string} mediaId
   */
  async download (mediaId) {
    const file = await this.#media.download(mediaId)
    this.log?.debug('Downloaded file', { mediaId, file })
    return file
  }
}

/**
 * @param {Partial<import("./whatsapp-cloud.d.ts").WhatsAppCloudConfig>} [config = {}]
 * @returns {import("./whatsapp-cloud.d.ts").WhatsAppCloudConfig}
 */
function readConfigs (config = {}) {
  const file = readConfigFromFile(config.file)
  const env = readConfigFromEnv(config.env)
  return deepMerge(file, env, config)
}

/**
 * @param {string | boolean | undefined} path
 */
function readConfigFromFile (path) {
  if (path !== false) {
    if (typeof path === 'string') {
      return readJsonOrYamlFile(path)
    }
    for (const path of [
      'whatsapp-cloud.config',
      'whatsapp-cloud.config.json',
      'whatsapp-cloud.config.yaml',
      'whatsapp-cloud.config.yml'
    ]) {
      try {
        return readJsonOrYamlFile(path)
      } catch (_e) {
        // do nothing, try next
      }
    }
    if (path === true) {
      throw new Error(
        'No configuration file found for WhatsApp Cloud Server. If you do not want to load the configuration from a file, pass configuration parameter `file: false`.'
      )
    }
  }
  return {}
}

/**
 * @param {string | boolean | undefined} prefix
 * @returns {Partial<import("./whatsapp-cloud.d.ts").WhatsAppCloudConfig>}
 */
function readConfigFromEnv (prefix) {
  if (prefix !== false) {
    if (prefix === true || prefix === undefined) {
      prefix = 'WHATSAPP_CLOUD_'
    }
    /** @type {import("./whatsapp-cloud.d.ts").WhatsAppCloudConfig} */
    const config = {}
    const name = process.env[`${prefix}NAME`]
    if (name) config.name = name
    config.immediate = envBoolean(`${prefix}IMMEDIATE`)

    /** @type {import("./webhooks.d.ts").WebhooksConfig} */
    const webhooks = {}
    webhooks.port = envNumber(`${prefix}WEBHOOKS_PORT`)
    webhooks.verifyToken = process.env[`${prefix}WEBHOOKS_VERIFY_TOKEN`]
    webhooks.secret = process.env[`${prefix}WEBHOOKS_SECRET`]
    config.webhooks = webhooks

    /** @type {Partial<import("./graph-api.d.ts").GraphApiConfig>} */
    const graphApi = {}
    graphApi.phoneNumberId = process.env[`${prefix}GRAPHAPI_PHONE_NUMBER_ID`]
    graphApi.accessToken = process.env[`${prefix}GRAPHAPI_ACCESS_TOKEN`]
    graphApi.baseUrl = process.env[`${prefix}GRAPHAPI_BASE_URL`]
    graphApi.basePort = envNumber(`${prefix}GRAPHAPI_BASE_PORT`)
    graphApi.version = envNumber(`${prefix}GRAPHAPI_VERSION`)
    // @ts-expect-error Partial configurations are ok here
    config.graphApi = graphApi

    /** @type {import("./media.d.ts").MediaConfig} */
    const media = {}
    media.downloadDir = process.env[`${prefix}MEDIA_DOWNLOAD_DIR`]
    media.dbPath = process.env[`${prefix}MEDIA_DB_PATH`]
    config.media = media

    return config
  }
  return {}
}
