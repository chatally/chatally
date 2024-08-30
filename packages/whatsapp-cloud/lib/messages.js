import { runIn } from '@chatally/utils'

export class Messages {
  /** @type {import('./graph-api.d.ts').GraphApi} */
  #graphApi

  /** @type {import('@chatally/logger').Logger | undefined} */
  log

  /** @type {number|undefined} */
  #timeout

  /** @param {import('./messages.d.ts').MessagesConfig} config */
  constructor(config) {
    this.log = config.log
    this.#graphApi = config.graphApi
    if (config.sequential !== false) {
      if (typeof config.sequential === 'number') {
        this.#timeout = config.sequential
      }
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
   * Map of waiting messages.
   *
   * The map contains a queue per recipient_id. Each queue starts with the
   * previous message being sent, until we receive a status that it has been
   * delivered.
   *
   * Published only for tests or subclasses.
   * @protected
   * @type {Record<string, (import('./messages.d.ts').Waiting[] | undefined)>}
   */
  _queues = {}

  /**
   * @param {import('./webhooks.d.ts').Status} status
   */
  async #sendNext(status) {
    const queue = this._queues[status.recipient_id]
    if (!queue || queue.length === 0) return

    const previous = queue[0]
    if (previous && previous.message.id !== status.id) {
      if (status.timestamp !== 'timeout') {
        this.log?.warn(`Ignoring delivery status for unexpected message,
  expected ${previous.message.id}
  received ${status.id}.`)
      }
      return
    }

    if (queue.length > 1) {
      queue.shift()
      const request = queue[0]
      request.message.id = await this.#send(request)
    } else {
      this._queues[status.recipient_id] = undefined
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
      if (this._queues[to]) {
        this._queues[to]?.push(request)
        message.waitingSince = Date.now()
        return undefined
      }

      this._queues[to] = [request]
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
    if (this.#timeout) {
      /** @type {import('./webhooks.js').Status} */
      const status = {
        id: messages[0].id,
        recipient_id: to,
        status: 'delivered',
        timestamp: 'timeout',
      }
      runIn(this.#timeout, () => this.#sendNext(status))
    }
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
