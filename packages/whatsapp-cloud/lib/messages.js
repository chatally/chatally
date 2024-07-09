export class Messages {
  /** @type {import('./graph-api.d.ts').GraphApi} */
  #graphApi

  /** @type {import('@chatally/logger').Logger | undefined} */
  log

  /** @param {import('./messages.d.ts').MessagesConfig} config */
  constructor(config) {
    this.log = config.log
    this.#graphApi = config.graphApi
    if (config.sequential !== false) {
      this.sequential
        = (/** @type {import('./webhooks.js').Webhooks} */ webhooks) => {
          webhooks.on('notification', ({ statuses }) => {
            for (const status of statuses) {
              const value = status.status
              if (value === 'delivered' || value === 'read' || value === 'failed') {
                this.#sendNext(status)
              }
            }
          })
          return this
        }
    }
  }

  /**
   * Map of waiting messages, meant to be used in tests or subclasses only.
   * @protected
   * @type {Record<string, (import('./messages.d.ts').Waiting[] | undefined)>}
   */
  _waiting = {}

  /**
   * @param {import('./webhooks.d.ts').Status} status
   */
  async #sendNext(status) {
    const waiting = this._waiting[status.recipient_id]
    if (!waiting) return

    const previous = waiting.shift()
    if (previous && previous.message.id !== status.id) {
      this.log?.warn(`Received delivery status for unexpected message,
expected ${previous.message.id}
received ${status.id}.`)
    }
    if (waiting.length > 0) {
      const request = waiting[0]
      request.message.id = await this.#send(request)
    } else {
      this._waiting[status.recipient_id] = undefined
    }
  }

  /**
   * @param {string} to
   * @param {import('./messages.js').Message} message
   * @param {string} [replyTo]
   */
  async send(to, message, replyTo) {
    const request = { to, message, replyTo }
    if (this.sequential) {
      if (this._waiting[to]) {
        this._waiting[to]?.push(request)
        message.id = '<waiting>'
        return message.id
      }

      this._waiting[to] = [request]
    }
    return await this.#send(request)
  }

  /**
   * @typedef SendMessageBody
   * @property {'individual'} recipient_type
   *    Type of WhatsApp recipient, must be `individual`
   * @property {string} to
   *    Id of the recipient (international phone number without `+`)
   * @property {{message_id: string}} [context]
   *    Context, i.e. WAMID of message, if this is a reply to an older message
   */

  /** @param {import('./messages.d.ts').Waiting} $ */
  async #send({ to, message, replyTo }) {
    /** @type {SendMessageBody} */
    const body = {
      recipient_type: 'individual',
      to,
      ...message,
    }
    if (replyTo) {
      body.context = { message_id: replyTo }
    }
    const response = await this.#graphApi.post('messages', body)
    const messages = /** @type {Array<{id: string}>} */ (
      response.json?.messages
    )
    if (!messages || messages.length === 0) {
      throw new Error(
        `Message was not sent, server responded with
${JSON.stringify(response, null, 2)}`,
      )
    }
    message.id = messages[0].id
    return message.id
  }

  /**
   * @typedef MarkAsRead
   * @property {'read'} status
   *    Status value, always 'read'
   * @property {string} message_id
   *    WAMID of the message, where the status shall be set to 'read'
   */

  /**
   * @param {string} wamid
   */
  async markAsRead(wamid) {
    /** @type {MarkAsRead} */
    const body = {
      status: 'read',
      message_id: wamid,
    }
    const response = await this.#graphApi.post('messages', body)
    return !!response.json?.success
  }
}
