/**
 * @typedef {import('./index.d.ts').Logger} Logger
 * @class
 * @implements {Logger}
 */
export class NoLogger {
  name = 'NoLogger'
  data = undefined

  /**
   * @returns {import('./index.d.ts').Level} The logger's level (always silent).
   */
  get level() {
    return 'silent'
  }

  isLevel() {
    return false
  }

  child() {
    return this
  }

  trace() { }
  debug() { }
  info() { }
  warn() { }
  error() { }
}
