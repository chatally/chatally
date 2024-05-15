/**
 * Default implementation of Logger interface with all no-ops.
 *
 * @typedef {import("./logger.d.ts").Logger} Logger
 * @implements {Logger}
 */
export class NoLogger {
  /**
   * @private
   */
  constructor() {}
  /**
   * Create a no-op logger implementation, that does nothing.
   *
   * This logger causes no overhead, as it does nothing.
   *
   * @returns {import("./logger.d.ts").Logger}
   */
  static create() {
    return new NoLogger();
  }

  /** @returns {import("./levels.js").Level} */
  get level() {
    return "silent";
  }

  isLevel() {
    return false;
  }

  child() {
    return this;
  }

  debug() {}
  info() {}
  warn() {}
  error() {}
}
