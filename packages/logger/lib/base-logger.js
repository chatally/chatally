import { getCurrentTime } from "@internal/utils";
import { format } from "node:util";
import { levels } from "./levels.js";

const DEFAULT_LEVEL = levels[Math.min(1, levels.length - 1)];

/**
 * @typedef {import("node:stream").Writable} Writable
 * @typedef {import("./types.d.ts").Logger} Logger
 * @typedef {import("./types.d.ts").LoggerOptions} LoggerOptions
 * @typedef {import("./types.d.ts").Level} Level
 */

/**
 * @class
 */
function LogMethods() {
  /** @type {Writable | undefined} */
  this.out = undefined;
  this.timestamps = true;

  /**
   * Numeric value of the level
   *
   * The index of the level in the `levels` array.
   *
   * Defaults to 1.
   */
  this._level = Math.min(1, levels.length - 1);

  /** @type {String | undefined} */
  this.name = undefined;

  /** @type {Object|undefined} */
  this.data = undefined;

  this._log = function (
    /** @type {Number} */ level,
    /** @type {Object | String} */ data,
    /** @type {String | undefined} */ msg,
    /** @type {any[]} */ ...args
  ) {
    if (this._level < 0 || level < this._level) {
      return;
    }
    if (typeof data === "string") {
      // no additional data to log
      if (!msg) {
        // no arguments for format string
        return this.log(level, undefined, data);
      }
      // msg is already the first argument for the format string
      return this.log(level, undefined, data, ...[msg, ...args]);
    }
    this.log(level, data, msg, ...args);
  };

  this.log = function (
    /** @type {Number} */ level,
    /** @type {Object | undefined} */ data,
    /** @type {String} */ msg = "",
    /** @type {any[]} */ ...args
  ) {
    const level_ = levels[level]?.toUpperCase() || "?????";
    const msg_ = format(msg, ...args);

    let line = this.name
      ? format("%s (%s): %s", level_, this.name, msg_)
      : format("%s: %s", level_, msg_);

    if (this.timestamps) {
      line = `[${getCurrentTime()}] ${line}`;
    }
    line = line.trim();

    if (this.data) {
      data = { ...this.data, ...data };
    }

    if (this.out) {
      this.out.write(line + "\n");
      if (data) {
        this.out.write(JSON.stringify(data, null, 2) + "\n");
      }
    } else {
      console.log(line);
      if (data) {
        console.log(data);
      }
    }
  };
}

/**
 * Add log functions for all levels
 */
for (let i = 0; i < levels.length; i++) {
  LogMethods.prototype[levels[i]] = function (
    /** @type {Object | String} */ data,
    /** @type {String | undefined} */ msg,
    /** @type {any} */ ...args
  ) {
    this._log(i, data, msg, ...args);
  };
}

/**
 * @class
 * @implements {Logger}
 */
// @ts-ignore
export class BaseLogger extends LogMethods {
  /** @param {LoggerOptions} [options={}] */
  constructor(options = {}) {
    super();
    this.level = options.level || DEFAULT_LEVEL;
    this.name = options.name;
    this.data = options.data;
  }

  /** @returns {Level} */
  get level() {
    return (
      levels[this._level] ||
      (this._level < 0 ? "silent" : levels[levels.length - 1])
    );
  }

  /** @param {Level} level */
  set level(level) {
    // @ts-ignore
    this._level = levels.indexOf(level);
  }

  /** @param {Level} level */
  isLevel(level) {
    // @ts-ignore
    return this._level >= levels.indexOf(level);
  }

  /**
   * @param {LoggerOptions} [options={}]
   * @returns {Logger}
   */
  child(options = {}) {
    let name = this.name;
    if (name && options.name) {
      name = `${name}/${options.name}`;
    } else {
      name = options.name;
    }
    let data = this.data;
    if (data && options.data) {
      data = { ...data, ...options.data };
    } else {
      data = options.data;
    }
    return Object.assign(Object.create(this), {
      ...this,
      ...options,
      name,
      data,
    });
  }
}

/**
 * @param {LoggerOptions | undefined} options
 * @returns {Logger & BaseLogger}
 */
export function newBaseLogger(options) {
  // @ts-ignore
  return new BaseLogger(options);
}
