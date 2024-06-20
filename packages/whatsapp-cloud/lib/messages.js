import { GraphApi } from "./graph-api.js";

/**
 * @typedef MessagesConfig
 * @property {GraphApi} graphApi
 *    Access to Meta's Graph API
 * @property {import("@chatally/logger").Logger} [log]
 *    [Optional] logger to use
 *    [default=undefined]
 */

export class Messages {
  /** @type {GraphApi} */
  #graphApi;

  /** @type {import("@chatally/logger").Logger | undefined} */
  #log;

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
   * @param {MessagesConfig} config
   */
  constructor(config) {
    this.#log = config.log;
    this.#graphApi = config.graphApi;
  }

  /**
   * Wait for `delivered` status of previous message before sending the next.
   * This requires notifications from the Webhooks API.
   * @param {import("./webhooks.js").Webhooks} webhooks Webhooks API
   * @param {number} [maxWait] Maximum time to wait for "delivered" status
   *    before sending the next message
   *    [default=-1 meaning forever]
   */
  waitForDelivered(webhooks, maxWait = -1) {
    webhooks.on("notification", ({ statuses }) => {
      for (const status of statuses) {
        const value = status.status;
        if (value === "delivered" || value === "read" || value === "failed") {
          this.#sendNext(status);
        }
      }
    });
    // TODO: Implement max waiting for sending next message
    this.#waitForDelivered = maxWait;
  }

  /**
   * Maximum seconds to wait before delivering the next message, even if no
   * "delivered" status has been received
   * [default=undefined] Meaning no waiting at all, if you want to wait
   * forever, set this to -1
   * @type {number | undefined}
   */
  #waitForDelivered = undefined;

  /**
   * @typedef Waiting
   * @property {string} to
   * @property {import("./messages-types.js").Message} message
   * @property {string} [replyTo]
   */

  /**
   * Map of waiting messages, meant to be used in tests or subclasses only.
   * @protected
   * @type {Record<string, (Waiting[] | undefined)>}
   */
  _waiting = {};

  /**
   * @param {import("./webhooks-types.js").Status} status
   */
  async #sendNext(status) {
    const waiting = this._waiting[status.recipient_id];
    if (!waiting) return;

    const previous = waiting.shift();
    if (previous && previous.message.id !== status.id) {
      this.#log?.warn(`Received delivery status for unexpected message,
expected ${previous.message.id}
received ${status.id}.`);
    }

    if (waiting.length > 0) {
      const request = waiting[0];
      request.message.id = await this.#send(request);
    } else {
      this._waiting[status.recipient_id] = undefined;
    }
  }

  /**
   * Wrapper around the Graph API request to send a message.
   *
   * It automatically sets the `messaging_product` and `recipient_type` fields,
   * as well as the correct headers. For full type-safety use the respective
   * send<Type> methods instead.
   *
   * @param {string} to recipient phone number
   * @param {import("./messages-types.js").Message} message payload corresponding to the message type
   * @param {string} [replyTo] optional message id to reply to
   * @returns the response from the WhatsApp server, including the message id
   *          (WAMID) of the sent message
   */
  async send(to, message, replyTo) {
    const request = { to, message, replyTo };
    if (this.#waitForDelivered !== undefined) {
      if (this._waiting[to]) {
        this._waiting[to]?.push(request);
        message.id = "<waiting>";
        return message.id;
      }
      this._waiting[to] = [request];
    }
    await this.#send(request);
    return message.id;
  }

  /**
   * @typedef Send
   * @property {"individual"} recipient_type
   * @property {string} to
   * @property {{message_id: string}} [context]
   */

  /** @param {Waiting} $ */
  async #send({ to, message, replyTo }) {
    /** @type {Send} */
    const request = {
      recipient_type: "individual",
      to,
      ...message,
    };
    if (replyTo) {
      request.context = { message_id: replyTo };
    }
    const response = await this.#graphApi.post(request, "messages");
    const messages = /** @type {Array<{id: string}>}*/ (
      response.json?.messages
    );
    if (!messages || messages.length === 0) {
      throw new Error(
        `Message was not sent: ${JSON.stringify(response, null, 2)}`
      );
    }
    message.id = messages[0].id;
    this.#log?.info("Sent message %s to %s", message.id, to);
    return message.id;
  }

  /**
   * @typedef MarkAsRead
   * @property {"read"} status
   * @property {string} message_id
   */

  /**
   * Mark a message as read.
   *
   * Send a POST request to the `/PHONE_NUMBER_ID/messages` endpoint with
   * messaging_product set to whatsapp, message_id set to the message ID and
   * status to read.
   *
   * For details, see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/mark-message-as-read
   *
   * @param {string} message_id The WAMID of the message to mark as read.
   * @returns {Promise<boolean>}
   *    true if the message was marked as read, false otherwise.
   */
  async markAsRead(message_id) {
    /** @type {MarkAsRead} */
    const request = {
      status: "read",
      message_id,
    };
    const response = await this.#graphApi.post(request, "messages");
    return !!response.json?.success;
  }
}
