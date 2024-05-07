/**
 * Default implementation of Logger interface with all no-ops.
 *
 * @class
 * @typedef {import("./types.js").Logger} Logger
 * @implements {Logger}
 */
export class NoLogger {
  /**
   * This loggers log level is always "silent"
   *
   * @type {import("./types.js").Level}
   */
  get level() {
    return "silent";
  }

  /**
   * This logger is not active on any level
   *
   * @param {import("./types.js").Level} level
   * @returns always false
   */
  isLevel(level) {
    return false;
  }

  /**
   * This logger does not create children
   *
   * @param {any} options
   * @returns always this
   */
  child(options) {
    return this;
  }

  /**
   * Never logs anything
   *
   * @param {any[]} args
   */
  debug(...args) {}

  /**
   * Never logs anything
   *
   * @param {any[]} args
   */
  info(...args) {}

  /**
   * Never logs anything
   *
   * @param {any[]} args
   */
  warn(...args) {}

  /**
   * Never logs anything
   *
   * @param {any[]} args
   */
  error(...args) {}
}
