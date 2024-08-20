import { BaseLogger } from './base-logger.js'
import { isLogger } from './index.js'

/**
 * @param {import("./index.js").LoggerInit} [init]
 * @returns {import('./index.d.ts').Logger} A logger instance
 */
export function getLogger(init = {}) {
  if (isLogger(init)) {
    return init
  }
  if (typeof init === 'string') {
    init = { name: init }
  }
  if (!init.name) {
    // Use modified error to get structured stack trace
    const restore = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => stack
    const { stack } = new Error('Stack')
    Error.prepareStackTrace = restore
    init.name = /** @type {any} */(stack)[1].getFileName()
  }
  return new BaseLogger(init)
}
