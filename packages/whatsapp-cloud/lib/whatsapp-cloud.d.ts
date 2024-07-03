import type { BaseServer, OutgoingMessage } from '@chatally/core'
import type { GraphApi, GraphApiConfig } from './graph-api.d.ts'
import type { MediaConfig } from './media.d.ts'
import type { MediaObject, Messages, MessagesConfig } from './messages.d.ts'
import type { Webhooks, WebhooksConfig } from './webhooks.d.ts'

/**
 * WhatsApp Cloud Server Class
 */
export declare class WhatsAppCloud extends BaseServer {
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
   * - `graphApi.phoneNumberId`/`WHATSAPP_CLOUD_GRAPHAPI_PHONE_NUMBER_ID`:
   *   The id of the registered WhatsApp number.
   * - `graphApi.accessToken`/`WHATSAPP_CLOUD_GRAPHAPI_ACCESS_TOKEN`:
   *   A cryptographic token used as `Authorization: Bearer` in each call to an
   *   endpoint. See the Facebook documentation on
   *   [how to create access tokens](https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#access-tokens).
   * - `webhooks.verifyToken`/`WHATSAPP_CLOUD_WEBHOOKS_VERIFY_TOKEN`:
   *   A shared secret used to
   *   [register the webhooks endpoint](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests)
   *   with your WhatsApp business account.
   * - `webhooks.secret`/`WHATSAPP_CLOUD_WEBHOOKS_SECRET`:
   *   A cryptographic token to verify the payload of received
   *   [event notifications](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#event-notifications)
   *   on the webhooks endpoint.
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
  constructor (configObj?: Partial<WhatsAppCloudConfig>)

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
  listen: (port?: number) => void

  /**
   * Indicate, whether messages should be delivered immediately (on write)
   * instead of on end.
   * [default=false]
   */
  immediate: boolean

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
  send (to: string, ...outgoing: OutgoingMessage[]): Promise<void>

  /**
   * Upload a local file to the Media endpoint.
   *
   * @param file
   * @returns the media id
   */
  upload (file: string): Promise<string>

  /**
   * Download a media asset from the Media endpoint to a local file.
   *
   * @param id the media id
   * @returns the file path to the downloaded file
   */
  download (id: string): Promise<string>
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
  file?: string | boolean

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
  env?: string | boolean

  /**
   * [Optional] Name of the server
   *
   * [default="WhatsAppCloud"]
   */
  name?: string

  /**
   * [Optional] Flag indicating, whether messages should be send before
   * `response.end()`
   *
   * [default=false]
   */
  immediate?: boolean

  /**
   * [Optional] Logger to use
   *
   * [default=undefined]
   */
  log?: import('@chatally/logger').Logger

  /**
   * [Optional] Webhooks instance or configuration.
   *
   * If not provided it must be available as configuration file or environment
   * variables.
   */
  webhooks?: Webhooks | WebhooksConfig

  /**
   * [Optional] GraphApi instance or configuration
   *
   * If not provided it must be available as configuration file or environment
   * variables.
   */
  graphApi: GraphApi | GraphApiConfig

  /**
   * [Optional] Messages instance or configuration
   *
   * If not provided it must be available as configuration file or environment
   * variables.
   */
  messages?: Messages | Omit<MessagesConfig, 'graphApi'>

  /**
   * [Optional] Media instance or configuration
   *
   * If not provided it must be available as configuration file or environment
   * variables.
   */
  media?: MediaObject | Omit<MediaConfig, 'graphApi'>
}
