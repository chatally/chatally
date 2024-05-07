import { getCurrentTime } from "@internal/utils";
import { format } from "node:util";
import { getLevelIndex, levels } from "./levels.js";

/** @type {import("./index.js").Level} */
const DEFAULT_LEVEL = "info";
const DEBUG = getLevelIndex("debug");
const INFO = getLevelIndex("info");
const WARN = getLevelIndex("warn");
const ERROR = getLevelIndex("error");

/**
 * @typedef {(data: unknown, msg?: string, ...args: any[]) => void} LogMethod
 */

/**
 * Basic logger implementation, that logs to the console by default.
 *
 * This logger is not optimized and should only be used for development.
 *
 * For test purposes, the output can be redirected to any `Writable` by setting
 * the `out` property. Also for test purposes you can turn off the timestamps,
 * by setting the `timestamps` property to false.
 *
 * @class
 * @typedef {import("./types.js").Logger} Logger
 * @implements {Logger}
 */
export class BaseLogger {
  /**
   * Output writable, default is the console
   *
   * @type {import("node:stream").Writable | undefined}
   */
  out = undefined;

  /**
   * Print timestamps
   */
  timestamps = true;

  /**
   * Numeric level of this logger
   *
   * @type {number}
   */
  _level = 1;

  /**
   * @param {import("./index.js").LoggerOptions} [options={}]
   */
  constructor(options = {}, levelMethods = levels) {
    // because this is used in the following setters, we need to set it first
    this.levels = levelMethods;
    this.level = options.level || DEFAULT_LEVEL;
    this.name = options.name;
    /** @type {unknown} */
    this.data = options.data;
  }

  /** @returns {import("./index.js").Level} */
  get level() {
    return this.levels.text(this._level);
  }

  /** @param {import("./index.js").Level} level */
  set level(level) {
    this._level = this.levels.index(level);
  }

  /** @param {import("./index.js").Level} level */
  isLevel(level) {
    return this._level >= this.levels.index(level);
  }

  /**
   * @param {import("./index.js").LoggerOptions} [options={}]
   * @returns {import("./types.js").Logger}
   */
  child(options = {}) {
    let name = this.name;
    if (name && options.name) {
      name = `${name}/${options.name}`;
    } else {
      name = options.name;
    }
    return Object.assign(Object.create(this), {
      ...this,
      ...options,
      name,
      data: mergeData(this.data, options.data),
    });
  }

  /** @type {LogMethod} */
  debug(data, msg, ...args) {
    this.log(DEBUG, data, msg, ...args);
  }

  /** @type {LogMethod} */
  info(data, msg, ...args) {
    this.log(INFO, data, msg, ...args);
  }

  /** @type {LogMethod} */
  warn(data, msg, ...args) {
    this.log(WARN, data, msg, ...args);
  }

  /** @type {LogMethod} */
  error(data, msg, ...args) {
    this.log(ERROR, data, msg, ...args);
  }

  /**
   * @param {import("./index.js").Level | number} level
   * @param {unknown} [data]
   * @param {string} [msg]
   * @param {any[]} args
   */
  log(level, data, msg, ...args) {
    if (this._level < 0) {
      return;
    }
    /** @type {number} */
    let nLevel;
    if (typeof level === "number") {
      if (level < this._level) {
        return;
      }
      nLevel = level;
    } else {
      nLevel = this.levels.index(level);
      if (nLevel < this._level) {
        return;
      }
    }
    if (typeof data === "string") {
      // data is the message
      if (msg) {
        args = [msg, ...args];
      }
      msg = data;
      data = undefined;
    }
    this._log(nLevel, data, msg, ...args);
  }

  /**
   * @param {number} nLevel
   * @param {unknown} data
   * @param {string | undefined} msg
   * @param {any[]} args
   */
  _log(nLevel, data, msg, ...args) {
    data = mergeData(this.data, data);
    if (!msg && data instanceof Error && Object.keys(data).length === 0) {
      msg = data.message;
      data = undefined;
    }
    const msg_ = format(msg || "", ...args);
    const sLevel = this.levels.text(nLevel).toUpperCase();
    let line = this.name
      ? format("%s (%s): %s", sLevel, this.name, msg_)
      : format("%s: %s", sLevel, msg_);

    if (this.timestamps) {
      line = `[${getCurrentTime()}] ${line}`;
    }
    line = line.trim();

    if (this.out) {
      this.out.write(line + "\n");
      if (data) {
        this.out.write(JSON.stringify(data, stringifyError, 2) + "\n");
      }
    } else {
      console.log(line);
      if (data) {
        console.log(data);
      }
    }
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
function stringifyError(key, value) {
  // @ts-ignore
  return value instanceof Error ? { message: value.message, ...value } : value;
}

/**
 * @param {unknown} a
 * @param {unknown} b
 */
function mergeData(a, b) {
  if (!a) return b;
  if (!b) return a;
  if (a instanceof Error) {
    if (typeof b === "object") {
      return { error: a, ...b };
    }
  } else if (typeof a === "object") {
    if (b instanceof Error) {
      return { ...a, error: b };
    }
    if (typeof b === "object") {
      return { ...a, ...b };
    }
  }
  return [a, b];
}
