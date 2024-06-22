import { Dispatch, OutgoingMessage, Server } from "@chatally/core";
import { Logger } from "@chatally/logger";
import { Express } from "express-serve-static-core";
import { EventEmitter } from "node:events";
import { Message } from "./messages-types.js";
import { Error, IncomingMessage, Status } from "./webhooks-types.js";

export type * from "./messages-types.d.ts";

/**
 * WhatsApp Cloud Server Class
 */
export declare class WhatsAppCloud implements Server {
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
   */
  constructor(configObj?: Partial<WhatsAppCloudConfig>);

  /**
   * The server's name.
   * [default="WhatsAppCloud"]
   */
  name: string;
  set dispatch(d: Dispatch);
  log: boolean | Logger | undefined;

  /**
   * Start the underlying Webhooks API server.
   *
   * This call is long-running and will only return, once the server has
   * stopped. You must set `dispatch` before starting to listen, otherwise
   * notifications would have no effect.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks
   *
   * @param port [Optional] Port to listen on with the Webhooks server
   */
  listen: (port?: number) => void;

  /**
   * Indicate, whether messages should be delivered immediately (on write)
   * instead of on end.
   * [default=false]
   */
  immediate: boolean;

  /**
   * Asynchronously send message(s) to recipient.
   *
   * Messages are sent "in order" once the Webhooks server has been started
   * with a call to `listen()`, i.e. the next message to the same recipient is
   * only sent out, once a `delivered` status has been received.
   *
   * @param to recipient
   * @param outgoing one or more messages
   */
  send(to: string, ...outgoing: OutgoingMessage[]): Promise<void>;

  /**
   * Upload a local file to the Media endpoint.
   *
   * @param file
   * @returns the media id
   */
  upload(file: string): Promise<string>;

  /**
   * Download a media asset from the Media endpoint to a local file.
   *
   * @param id the media id
   * @returns the file path to the downloaded file
   */
  download(id: string): Promise<string>;
}

export interface WhatsAppCloudConfig {
  /**
   * [Optional] Use a file for server configuration.
   *
   * If a `string` is provided, it will be interpreted as path to a JSON or
   * YAML file, which will be read for configuration values.
   *
   * If `undefined` or `true`, the following paths are searched in the current
   * working directory in this order
   *
   * - `whatsapp-cloud.config`
   * - `whatsapp-cloud.config.json`
   * - `whatsapp-cloud.config.yaml`
   * - `whatsapp-cloud.config.yml`
   *
   * If `false`, no file will be read.
   *
   * [default=undefined]
   */
  file: string | boolean;

  /**
   * [Optional] Use environment variables for server configuration.
   *
   * If a string is provided, environment variables with this prefix will be
   * used for configuration.
   *
   * If `undefined` or `true`, environment variables with the prefix
   * `WHATSAPP_CLOUD_` will be used.
   *
   * If `false`, no environment variables will be read.
   *
   * [default=undefined]
   */
  env: string | boolean;

  /**
   * [Optional] Name of the server
   *
   * [default="WhatsAppCloud"]
   */
  name: string;

  /**
   * [Optional] Flag indicating, whether messages should be send before
   * `response.end()`
   *
   * [default=false]
   */
  immediate: boolean;

  /**
   * [Optional] Logger to use
   *
   * [default=undefined]
   */
  log: import("@chatally/logger").Logger | boolean;

  /**
   * Webhooks instance or configuration
   */
  webhooks: Webhooks | WebhooksConfig;

  /**
   * GraphApi instance or configuration
   */
  graphApi: GraphApi | GraphApiConfig;

  /**
   * Messages instance or configuration
   */
  messages: Messages | Omit<MessagesConfig, "graphApi">;

  /**
   * Media instance or configuration
   */
  media: Media | Omit<MediaConfig, "graphApi">;
}

/**
 * WhatsApp Webhooks Server Class
 */
export declare class Webhooks extends EventEmitter<WebhooksEvents> {
  /**
   * Access to the underlying express server for testing purposes or in derived
   * classes.
   */
  protected _server: Express;

  /**
   * Create a WhatsApp Webhooks server.
   *
   * The server implements EventEmitter, you can register the event
   * `notification`, it gives you notification with incoming messages,
   * statuses, and errors.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks
   *
   * @param config
   */
  constructor(config?: WebhooksConfig);

  /**
   * Start the server
   * @param port [Optional] Port to listen on [`default=3000`]
   */
  listen(port?: number): void;
}

type WebhooksEvents = {
  notification: WebhooksNotification[];
};

export interface WebhooksNotification {
  messages: IncomingMessage[];
  statuses: Status[];
  errors: Error[];
}

export interface WebhooksConfig {
  /**
   * [Optional] Logger to use instead of console
   * [`default=undefined`]
   */
  log?: Logger;

  /**
   * [Optional] Port to listen on
   * [`default=3000`]
   */
  port?: number;

  /**
   * [Optional] token to verify webhooks registration, if not provided webhooks
   * cannot be registered with WhatsApp business account
   * [`default=undefined`]
   */
  verifyToken?: string | undefined;

  /**
   * [Optional] secret to verify payload signatures, if not provided thet
   * payload is not verified
   * [`default=undefined`]
   */
  secret?: string;

  /**
   * [Optional] directory to static assets to be served at assetsPath
   * [`default=undefined`]
   */
  assetsDir?: string;

  /**
   * [Optional] path to access static assets, has no effect if assetsDir is not
   * set
   * [`default="/assets"`]
   */
  assetsPath?: string;
}

export declare class GraphApi {
  constructor(config: GraphApiConfig);
  post(
    endpoint: string,
    body: string | FormData | Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<GraphApiResult>;

  get(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<GraphApiResult>;

  delete(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<GraphApiResult>;
}

export interface GraphApiConfig {
  /**
   * Sender id, i.e. the phone number id of the WhatsApp business account
   */
  phoneNumberId: string;

  /**
   * Access token to use as authorization bearer
   */
  accessToken: string;

  /**
   * [Optional] Base URL for Meta GraphAPI
   *
   * [default="graph.facebook.com"]
   */
  baseUrl?: string;

  /**
   * [Optional] Port at which to reach Meta GraphAPI
   *
   * [default=undefined]
   */
  basePort?: number;

  /**
   * [Optional] Version of the Meta GraphAPI
   *
   * [default=20]
   */
  version?: number;

  /**
   * [Optional] Logger to use
   *
   * [default=undefined]
   */
  log?: Logger;

  /**
   * [Optional] Allows to override the internal HTTP request for testing
   *
   * [default=undici.request]
   */
  _request?: RequestFn;
}

export interface GraphApiResult {
  contentType: string;
  text?: string | undefined;
  json?: Record<string, unknown> | undefined;
  buffer?: ArrayBuffer | undefined;
}

export type RequestFn = (
  url: string,
  init: RequestInit
) => Promise<ResponseData>;

export interface RequestInit {
  method?: "GET" | "POST" | "DELETE";
  body?: string | FormData;
  headers?: Record<string, string | string[] | undefined>;
}

export interface ResponseData {
  statusCode: number;
  headers: Record<string, string | string[] | undefined>;
  body: Body;
}

interface Body {
  text: () => string | Promise<string>;
  json: () => unknown | Promise<unknown>;
  arrayBuffer: () => ArrayBuffer | Promise<ArrayBuffer>;
}

export declare class Messages {
  /**
   * Send WhatsApp messages using the Graph API. Abstracts the
   * `https://graph.facebook.com/<version>/PHONE_NUMBER_ID/messages` endpoint.
   *
   * Use it to send text, media, contacts, location, and interactive messages,
   * as well as message templates through WhatsApp. You can also mark incoming
   * messages as `read` through the Messages endpoint.
   *
   * [Learn more about the messages you can send](https://developers.facebook.com/docs/whatsapp/conversation-types).
   *
   * Messages are sent asynchronously. The API returns a 200 OK response with
   * the message's unique ID (WAMID) when the message is successfully queued for
   * delivery. The API does not return a response when the message is delivered.
   * There is no guarantee about the order of delivery, even when awaiting the
   * method call.
   */
  constructor(config: MessagesConfig);

  /**
   * Wait for `delivered` status of previous message before sending the next.
   * This requires notifications from the Webhooks API.
   *
   * @param webhooks Webhooks API
   * @param maxWait [Optional] Maximum time to wait for "delivered" status
   *    before sending the next message
   *    [default=-1 meaning forever]
   * @returns this
   */
  waitForDelivered(webhooks: Webhooks, maxWait?: number): this;

  /**
   * Wrapper around the Graph API request to send a message.
   *
   * It automatically sets the `messaging_product` and `recipient_type` fields,
   * as well as the correct headers. For full type-safety use the respective
   * send<Type> methods instead.
   *
   * @param to recipient phone number
   * @param message payload corresponding to the message type
   * @param replyTo [Optional] message id to reply to
   * @returns the message id from the WhatsApp server (WAMID)
   */
  send(to: string, message: Message, replyTo?: string): Promise<string>;

  /**
   * Mark a message as read.
   *
   * Send a POST request to the `/PHONE_NUMBER_ID/messages` endpoint with
   * messaging_product set to whatsapp, message_id set to the message ID and
   * status to read.
   *
   * For details, see
   * https://developers.facebook.com/docs/whatsapp/cloud-api/guides/mark-message-as-read
   *
   * @param message_id The WAMID of the message to mark as read.
   * @returns true, if the message was marked as read, false otherwise.
   */
  markAsRead(message_id: string): Promise<boolean>;
}

export interface MessagesConfig {
  /**
   * Access to Meta's Graph API
   */
  graphApi: GraphApi;

  /**
   * [Optional] logger to use
   * [default=undefined]
   */
  log?: Logger;
}

/**
 * WhatsApp Media endpoint
 */
export declare class Media {
  constructor(config: MediaConfig);

  /**
   * Upload media through a POST call to /PHONE_NUMBER_ID/media.
   *
   * All media files sent through this endpoint are encrypted and persist for
   * 30 days, unless they are deleted earlier.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#upload-media
   *
   * @param file path to the local media file
   * @returns The media id that can be used to reference the uploaded media in
   *    messages
   */
  upload(file: string): Promise<string>;

  /**
   * Download a media asset to the downloadDir.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#download-media
   *
   * @param id The media id
   * @returns The downloaded file's path
   */
  download(id: string): Promise<string>;
}

export interface MediaConfig {
  /**
   * Facebook Graph API configuration
   */
  graphApi: GraphApi;

  /**
   * [Optional] Path to a directory where to store downloaded media assets
   * [default="media"]
   */
  downloadDir?: string;

  /**
   * [Optional] Path to the database to store media ids and their corresponding
   * paths.
   * [default="media.db"]
   */
  dbPath?: string;
}
