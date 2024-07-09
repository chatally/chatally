import { EventEmitter } from 'node:events'

/**
 * @typedef {import('./chat-message.d.ts').ChatMessage} ChatMessage
 * @typedef {import('./chat-response.d.ts').ChatResponse} IChatResponse
 */

/**
 * @class
 * @extends {EventEmitter<import('./chat-response.d.ts').ChatResponseEvents>}
 * @implements {IChatResponse}
 */
export class ChatResponse extends EventEmitter {
  /** @type {ChatMessage[]} */
  #messages = []
  #finished = false

  get messages() {
    return this.#messages
  }

  get isWritable() {
    return !this.#finished
  }

  /** @param {string | ChatMessage} [msg] */
  end(msg) {
    this.write(msg)
    this.#finished = true
    this.emit('finished', this)
  }

  /** @param {string | ChatMessage} [msg] */
  write(msg) {
    if (!msg)
      return

    if (this.#finished) {
      throw new Error('Cannot write anymore, response is finished.')
    }
    if (typeof msg === 'string') {
      msg = { type: 'text', content: msg }
    }
    if (Array.isArray(msg)) {
      this.#messages.push(...msg)
    } else {
      this.#messages.push(msg)
    }
    this.emit('write', msg)
  }
}
