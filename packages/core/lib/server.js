import { EventEmitter } from 'node:events'
import { nanoid } from 'nanoid'
import { ChatResponse } from './chat-response.js'

/**
 * @typedef {import('./chat-request.d.ts').ChatRequest} ChatRequest
 * @typedef {import('./chat-message.d.ts').ChatMessage} ChatMessage
 */

/**
 * @typedef {import('./server.d.ts').Server} Server
 *
 * @class
 * @extends {EventEmitter<import('./server.d.ts').ServerEvents>}
 * @implements {Server}
 */
export class BaseServer extends EventEmitter {
  /** @type {import('@chatally/logger').Logger | undefined} */
  #log

  get log() {
    return this.#log
  }

  set log(log) {
    this.#log = log
  }

  /**
   * @param {string} name
   */
  constructor(name) {
    super()
    this.name = name
  }

  listen() {
    throw new Error(
      'The method `listen()` in BaseServer is abstract and must be overridden',
    )
  }

  /**
   * @param {string | ChatRequest} req
   * @param {object} callbacks
   * @param {((msg: ChatMessage) => void) | ((msg: ChatMessage) => Promise<void>)} [callbacks.onWrite]
   * @param {((res: ChatResponse) => void) | ((res: ChatResponse) => Promise<void>)} [callbacks.onFinished]
   */
  dispatch(req, { onWrite, onFinished }) {
    if (typeof req === 'string') {
      let [from, ...rest] = req.split(': ')
      let content = ''
      if (rest.length === 0) {
        content = from
        from = 'unknown'
      } else {
        content = rest.join(': ')
      }
      req = /** @type {ChatRequest} */ {
        type: 'text',
        source: this.name,
        id: nanoid(),
        timestamp: Date.now(),
        from,
        content,
      }
    }
    const res = new ChatResponse()
    if (onWrite) {
      res.on('write', async (msg) => {
        try {
          await onWrite(msg)
        } catch (err) {
          this.log?.error(err)
        }
      })
    }
    if (onFinished) {
      res.on('finished', async (res) => {
        try {
          await onFinished(res)
        } catch (err) {
          this.log?.error(err)
        }
      })
    }
    this.emit('dispatch', req, res)
  }

  /**
   * @param {string} _url
   */
  canDownload(_url) {
    return false
  }

  /**
   * @param {string} _url
   * @returns {Promise<Buffer>} Never returns, always throws an error
   */
  async download(_url) {
    throw new Error('Method not implemented')
  }
}

/**
 * @param {any} object
 * @returns {object is import('./index.d.ts').Server}
 *    True if the provided object is a ChatAlly server
 */
export function isServer(object) {
  if (!object)
    return false
  if (object instanceof BaseServer)
    return true

  if (typeof object.listen !== 'function')
    return false
  if (typeof object.on !== 'function')
    return false
  return true
}
