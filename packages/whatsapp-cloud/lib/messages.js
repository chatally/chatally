export class Messages {
  /** @type {import("./index.d.ts").GraphApi} */
  #graphApi;

  /** @type {import("@chatally/logger").Logger | undefined} */
  #log;

  /** @param {import("./index.d.ts").MessagesConfig} config */
  constructor(config) {
    this.#log = config.log;
    this.#graphApi = config.graphApi;
  }

  /**
   * @param {import("./webhooks.js").Webhooks} webhooks
   * @param {number} [maxWait]
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
    return this;
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
   * @param {string} to
   * @param {import("./messages-types.js").Message} message
   * @param {string} [replyTo]
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
   * @typedef SendMessageBody
   * @property {"individual"} recipient_type
   * @property {string} to
   * @property {{message_id: string}} [context]
   */

  /** @param {Waiting} $ */
  async #send({ to, message, replyTo }) {
    /** @type {SendMessageBody} */
    const body = {
      recipient_type: "individual",
      to,
      ...message,
    };
    if (replyTo) {
      body.context = { message_id: replyTo };
    }
    const response = await this.#graphApi.post("messages", body);
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
   * @param {string} message_id
   */
  async markAsRead(message_id) {
    /** @type {MarkAsRead} */
    const body = {
      status: "read",
      message_id,
    };
    const response = await this.#graphApi.post("messages", body);
    return !!response.json?.success;
  }
}
