/**
 * Type definitions
 *
 * @typedef {import("./types.d.ts").Logger} Logger
 * @typedef {import("./types.d.ts").Level} Level
 */

/**
 * @class
 * @implements {Logger}
 */
export class NoLogger {
  /**
   * This loggers log level is always "silent"
   *
   * @type {Level}
   */
  get level() {
    return "silent";
  }

  /**
   * This logger is not active on any level
   *
   * @returns always false
   */
  isLevel() {
    return false;
  }

  /**
   * This logger does not create children
   * @returns always this
   */
  child() {
    return this;
  }

  /**
   * Never logs anything
   * @param {any[]} args
   */
  debug(...args) {}

  /**
   * Never logs anything
   */
  info() {}

  /**
   * Never logs anything
   */
  warn() {}

  /**
   * Never logs anything
   */
  error() {}
}
