import {
  Request as ChatRequest,
  Response as ChatResponse,
} from "@chatally/core";
import { GraphApi } from "./graph-api.js";
import { Media } from "./media.js";
import { Messages } from "./messages.js";
import { toChatallyMessage } from "./to-chatally-message.js";
import { toWhatsAppMessage } from "./to-whatsapp-message.js";
import { deepMerge } from "./utils/deep-merge.js";
import { envBoolean, envNumber } from "./utils/env.js";
import { readJsonOrYamlFile } from "./utils/read-json-or-yaml.js";
import { Webhooks } from "./webhooks.js";

/**
 * @typedef WhatsAppCloudConfig
 * @property {string|boolean} [file]
 *    [Optional] Use a file for server configuration.
 *
 *    If a `string` is provided, it will be interpreted as path to a JSON or
 *    YAML file, which will be read for configuration values.
 *
 *    If `undefined` or `true`, the following paths are searched in the current
 *    working directory in this order
 *
 *    - `whatsapp-cloud.config`
 *    - `whatsapp-cloud.config.json`
 *    - `whatsapp-cloud.config.yaml`
 *    - `whatsapp-cloud.config.yml`
 *
 *    If `false`, no file will be read.
 *
 *    [default=undefined]
 * @property {string|boolean} [env]
 *    [Optional] Use environment variables for server configuration.
 *
 *    If a string is provided, environment variables with this prefix will be
 *    used for configuration.
 *
 *    If `undefined` or `true`, environment variables with the prefix
 *    `WHATSAPP_CLOUD_` will be used.
 *
 *    If `false`, no environment variables will be read.
 *
 *    [default=undefined]
 * @property {string} [name="WhatsAppCloud"]
 *    [Optional] Name of the server
 *
 *    [default="WhatsAppCloud"]
 * @property {boolean} [immediate=false]
 *    [Optional] Flag indicating, whether messages should be send before
 *    `response.end()`
 *
 *    [default=false]
 * @property {import("@chatally/logger").Logger | boolean} [log]
 *    [Optional] Logger to use
 *
 *    [default=undefined]
 * @property {Webhooks | import("./webhooks.js").WebhooksConfig} [webhooks]
 *    Webhooks instance or configuration
 * @property {GraphApi | import("./graph-api.js").GraphApiConfig} graphApi
 *    GraphApi instance or configuration
 * @property {Messages | import("./messages.js").MessagesConfig} [messages]
 *    Messages instance or configuration
 * @property {Media | import("./media.js").MediaConfig} [media]
 *    Media instance or configuration
 */

/**
 * WhatsApp Cloud Server
 *
 * @typedef {import("@chatally/core").Server} Server
 * @implements {Server}
 */
export class WhatsAppCloud {
  /**
   * Name of this server
   * [default="WhatsAppCloud"]
   * @type {string}
   */
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
   * [🌐 *Read the docs*](https://chatally.org/reference/servers/whatsapp-cloud/)
   *
   * Create a WhatsApp Cloud server that integrates the WhatsApp endpoints
   * [Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks),
   * [Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages) and
   * [Media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media).
   *
   * You must provide some configuration, either explicitly as a Javascript
   * object, a configuration file, environment variables or a combination of it.
   * A minimal configuration must contain:
   *
   * - `graphApi.phoneNumberId`: The id of the registered WhatsApp number.
   * - `graphApi.accessToken`: A cryptographic token used as
   *   `Authorization: Bearer` in each call to an endpoint. See the Facebook documentation on [how to create access tokens](https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#access-tokens).
   * - `webhooks.verifyToken`: A shared secret used to
   *   [register the webhooks endpoint](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests)
   *   with your WhatsApp business account.
   * - `webhooks.secret`: A cryptographic token to verify the payload of
   *   received [event notifications](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#event-notifications) on the webhooks
   *   endpoint.
   *
   * `use(...)` the WhatsApp cloud server as a
   * [server](https://chatally.org/reference/core/servers) in your ChatAlly
   * application and hence connect it with your response-generating middleware.
   * The ChatAlly application will be calling the method `listen(...)` to start
   * the integrated Webhooks endpoint. Once this is started, you can
   * [register your WhatsApp business account](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks)
   * to receive notifications, whenever your WhatsApp phone number receives a
   * message or a status update. Registration is only required once.
   *
   * You can also use some functionality of the integrated endpoints explicitly:
   *
   * - Send messages using the Messages API by calling `send(...)`.
   * - Upload and download media files to the Meta servers by calling
   *   `upload(...)` and `download(...)`.
   *
   * **Cloud API**
   *
   * - https://developers.facebook.com/docs/whatsapp/cloud-api
   *
   * **Webhooks**
   * - https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
   * - https://developers.facebook.com/docs/graph-api/webhooks
   * - https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-whatsapp
   *
   * **Messages**
   * - https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
   * - https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
   *
   * **Media**
   * - https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media
   *
   * @param {Partial<WhatsAppCloudConfig>} [configObj]
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

  /**
   * Start the underlying Webhooks API server.
   *
   * This call is long-running and will only return, once the server has
   * stopped. You must set `dispatch` before starting to listen, otherwise
   * notifications would have no effect.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks
   *
   * @param {number} [port]
   *    [Optional] Port to listen on with the Webhooks server
   */
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

  /**
   * @param {object} n
   * @param {import("./webhooks-types.js").Error[]} n.errors
   * @param {import("./webhooks-types.js").Status[]} n.statuses
   * @param {import("./webhooks-types.js").IncomingMessage[]} n.messages
   */
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
   * Send message(s) to recipient.
   *
   * Messages are sent "in order" once the Webhooks server has been started
   * with a call to `listen()`, i.e. the next message to the same recipient is
   * only sent out, once a `delivered` status has been received.
   *
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
 * @param {Partial<WhatsAppCloudConfig>} [config = {}]
 * @returns {WhatsAppCloudConfig}
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
 * @returns {Partial<WhatsAppCloudConfig>}
 */
function readConfigFromEnv(prefix) {
  if (prefix !== false) {
    if (prefix === true || prefix === undefined) {
      prefix = "WHATSAPP_CLOUD_";
    }
    /** @type {WhatsAppCloudConfig} */
    const config = {};
    config.name = process.env[`${prefix}NAME`];
    config.immediate = envBoolean(`${prefix}IMMEDIATE`);

    /** @type {import("./webhooks.js").WebhooksConfig} */
    const webhooks = {};
    webhooks.port = envNumber(`${prefix}WEBHOOKS_PORT`);
    webhooks.verifyToken = process.env[`${prefix}WEBHOOKS_VERIFY_TOKEN`];
    webhooks.secret = process.env[`${prefix}WEBHOOKS_SECRET`];
    webhooks.assetsDir = process.env[`${prefix}WEBHOOKS_ASSETS_DIR`];
    webhooks.assetsPath = process.env[`${prefix}WEBHOOKS_ASSETS_PATH`];
    config.webhooks = webhooks;

    /** @type {Partial<import("./graph-api.js").GraphApiConfig>} */
    const graphApi = {};
    graphApi.phoneNumberId = process.env[`${prefix}GRAPHAPI_PHONE_NUMBER_ID`];
    graphApi.accessToken = process.env[`${prefix}GRAPHAPI_ACCESS_TOKEN`];
    graphApi.baseUrl = process.env[`${prefix}GRAPHAPI_BASE_URL`];
    graphApi.basePort = envNumber(`${prefix}GRAPHAPI_BASE_PORT`);
    graphApi.version = envNumber(`${prefix}GRAPHAPI_VERSION`);
    // @ts-ignore
    config.graphApi = graphApi;

    /** @type {import("./media.js").MediaConfig} */
    const media = {};
    media.downloadDir = process.env[`${prefix}MEDIA_DOWNLOAD_DIR`];
    media.dbPath = process.env[`${prefix}MEDIA_DB_PATH`];
    config.media = media;

    return config;
  }
  return {};
}
