import {
  Request as ChatRequest,
  Response as ChatResponse,
} from "@chatally/core";
import { GraphApi, Media, Messages, Webhooks } from "./index.js";
import { toChatallyMessage } from "./to-chatally-message.js";
import { toWhatsAppMessage } from "./to-whatsapp-message.js";
import { deepMerge } from "./utils/deep-merge.js";
import { envBoolean, envNumber } from "./utils/env.js";
import { readJsonOrYamlFile } from "./utils/read-json-or-yaml.js";

/**
 * @typedef {import("@chatally/core").Server} Server
 * @implements {Server}
 */
export class WhatsAppCloud {
  /** @type {string} */
  name;

  /**
   * Indicate, whether messages should be delivered immediately (on write)
   * instead of on end.
   * [default=false]
   * @type {boolean}
   */
  immediate;

  /**
   * Logger to use during runtime. `false` means NoLogger, `true` or `undefined`
   * leave setting the logger to the parent application.
   * [default=undefined]
   * @type {import("@chatally/logger").Logger | boolean | undefined}
   */
  log;

  /** @type {Webhooks} */ #webhooks;
  /** @type {Messages} */ #messages;
  /** @type {Media} */ #media;
  /** @type {import("@chatally/core").Dispatch | undefined} */ #dispatch;

  /**
   * Dispatch method to generate a response
   *
   * [default: echoes the incoming text]
   * @param {import("@chatally/core").Dispatch} dispatch
   */
  set dispatch(dispatch) {
    if (typeof dispatch !== "function") {
      throw new Error(
        "Dispatch must be a function (sync or async) that takes a Request and a Response and returns void."
      );
    }
    this.#dispatch = dispatch;
  }

  /**
   * @param {Partial<import("./index.d.ts").WhatsAppCloudConfig>} [configObj]
   */
  constructor(configObj) {
    const config = readConfigs(configObj);
    const {
      name = "WhatsAppCloud",
      immediate = false,
      log,
      webhooks,
      messages,
      media,
    } = config;
    let { graphApi } = config;

    this.name = name;
    this.immediate = immediate;
    this.log = log;

    if (webhooks instanceof Webhooks) {
      this.#webhooks = webhooks;
    } else {
      this.#webhooks = new Webhooks(webhooks);
    }

    if (!(graphApi instanceof GraphApi)) {
      graphApi = new GraphApi(graphApi);
    }

    if (messages instanceof Messages) {
      this.#messages = messages;
    } else {
      this.#messages = new Messages({ graphApi, ...messages });
    }

    if (media instanceof Media) {
      this.#media = media;
    } else {
      this.#media = new Media({ graphApi, ...media });
    }
  }

  /** @param {number} [port] */
  listen(port) {
    if (!this.#dispatch) {
      throw new Error(
        "Dispatch is not set, so listen would not have any effect. Set `this.dispatch = ...` before listening to notifications."
      );
    }
    this.#webhooks.on("notification", this.#handleNotification.bind(this));
    this.#webhooks.listen(port);
    this.#messages.waitForDelivered(this.#webhooks);
  }

  /** @param {import("./index.d.ts").WebhooksNotification} n */
  async #handleNotification({ messages }) {
    if (!this.#dispatch) {
      throw new Error("Set this.dispatch before listening to notifications");
    }
    // TODO: Handle statuses and errors
    for (let incoming of messages.map(toChatallyMessage)) {
      if (!incoming) continue;
      try {
        const to = incoming.from;
        const chatResponse = new ChatResponse();
        if (this.immediate) {
          chatResponse.on(
            "write",
            async (outgoing) => await this.send(to, outgoing)
          );
        }
        await this.#messages.markAsRead(incoming.id);
        await this.#dispatch(new ChatRequest(incoming), chatResponse);
        if (!this.immediate) {
          await this.send(to, ...chatResponse.messages);
        }
      } catch (err) {
        if (this.log && this.log !== true) {
          this.log.error(err);
        }
      }
    }
  }

  /**
   * @param {string} to recipient
   * @param {...import("@chatally/core").OutgoingMessage} outgoing
   */
  async send(to, ...outgoing) {
    for (const message of outgoing.map(toWhatsAppMessage)) {
      await this.#messages.send(to, message);
    }
  }

  /**
   * @param {string} file
   */
  async upload(file) {
    return await this.#media.upload(file);
  }

  /**
   * @param {string} id
   */
  async download(id) {
    return await this.#media.download(id);
  }
}

/**
 * @param {Partial<import("./index.d.ts").WhatsAppCloudConfig>} [config = {}]
 * @returns {import("./index.d.ts").WhatsAppCloudConfig}
 */
function readConfigs(config = {}) {
  const file = readConfigFromFile(config.file);
  const env = readConfigFromEnv(config.env);
  return deepMerge(file, env, config);
}

/**
 * @param {string | boolean | undefined} path
 */
function readConfigFromFile(path) {
  if (path !== false) {
    if (typeof path === "string") {
      return readJsonOrYamlFile(path);
    }
    for (let path of [
      "whatsapp-cloud.config",
      "whatsapp-cloud.config.json",
      "whatsapp-cloud.config.yaml",
      "whatsapp-cloud.config.yml",
    ]) {
      try {
        return readJsonOrYamlFile(path);
      } catch (_e) {
        // do nothing, try next
      }
    }
    if (path === true) {
      throw new Error(
        "No configuration file found for WhatsApp Cloud Server. If you do not want to load the configuration from a file, pass configuration parameter `file: false`."
      );
    }
  }
  return {};
}

/**
 * @param {string | boolean | undefined} prefix
 * @returns {Partial<import("./index.d.ts").WhatsAppCloudConfig>}
 */
function readConfigFromEnv(prefix) {
  if (prefix !== false) {
    if (prefix === true || prefix === undefined) {
      prefix = "WHATSAPP_CLOUD_";
    }
    /** @type {import("./index.d.ts").WhatsAppCloudConfig} */
    const config = {};
    const name = process.env[`${prefix}NAME`];
    if (name) config.name = name;
    config.immediate = envBoolean(`${prefix}IMMEDIATE`);

    /** @type {import("./index.d.ts").WebhooksConfig} */
    const webhooks = {};
    webhooks.port = envNumber(`${prefix}WEBHOOKS_PORT`);
    webhooks.verifyToken = process.env[`${prefix}WEBHOOKS_VERIFY_TOKEN`];
    webhooks.secret = process.env[`${prefix}WEBHOOKS_SECRET`];
    webhooks.assetsDir = process.env[`${prefix}WEBHOOKS_ASSETS_DIR`];
    webhooks.assetsPath = process.env[`${prefix}WEBHOOKS_ASSETS_PATH`];
    config.webhooks = webhooks;

    /** @type {Partial<import("./index.d.ts").GraphApiConfig>} */
    const graphApi = {};
    graphApi.phoneNumberId = process.env[`${prefix}GRAPHAPI_PHONE_NUMBER_ID`];
    graphApi.accessToken = process.env[`${prefix}GRAPHAPI_ACCESS_TOKEN`];
    graphApi.baseUrl = process.env[`${prefix}GRAPHAPI_BASE_URL`];
    graphApi.basePort = envNumber(`${prefix}GRAPHAPI_BASE_PORT`);
    graphApi.version = envNumber(`${prefix}GRAPHAPI_VERSION`);
    // @ts-expect-error Partial configurations are ok here
    config.graphApi = graphApi;

    /** @type {import("./index.d.ts").MediaConfig} */
    const media = {};
    media.downloadDir = process.env[`${prefix}MEDIA_DOWNLOAD_DIR`];
    media.dbPath = process.env[`${prefix}MEDIA_DB_PATH`];
    config.media = media;

    return config;
  }
  return {};
}
