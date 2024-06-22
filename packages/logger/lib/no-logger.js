/**
 * @type {import("./index.d.ts").NoLogger}
 */
export class NoLogger {
  name = "NoLogger";
  data = undefined;

  constructor() {}

  /** @returns {import("./index.d.ts").Level} */
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
