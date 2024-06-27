import { format, formatWithOptions } from "node:util";
import { getLevel, getLevelIndex } from "./levels.js";

/** @type {import("./index.d.ts").Level} */
const DEFAULT_LEVEL = "info";
const TRACE = getLevelIndex("trace");
const DEBUG = getLevelIndex("debug");
const INFO = getLevelIndex("info");
const WARN = getLevelIndex("warn");
const ERROR = getLevelIndex("error");

/**
 * @typedef {import("./index.d.ts").Logger} Logger
 * @class
 * @implements {Logger}
 */
export class BaseLogger {
  /**
   * Output writable, default is the console
   *
   * @type {import("node:stream").Writable | undefined}
   */
  out = undefined;

  /** @type {undefined | false | (() => string)} Return the time part of an ISO-formatted date. */
  timestamp = () => {
    const iso = new Date().toISOString();
    return iso.split("T")[1].slice(0, -1);
  };

  /**
   * Numeric level of this logger
   *
   * @type {number}
   */
  _level = 1;

  /**
   * @typedef LevelsFn
   * @property {(level: import("./index.d.ts").Level) => number} index
   * @property {(level: number) => import("./index.d.ts").Level} text
   */

  /**
   * Protected constructor for subclasses, use `BaseLogger.create()` instead,
   * it gives you better typing.
   *
   * @constructor
   * @param {import("./index.d.ts").LoggerOptions} [options={}]
   * @param {LevelsFn} [levelsFn]
   */
  constructor(
    options = {},
    levelsFn = {
      index: getLevelIndex,
      text: getLevel,
    }
  ) {
    // because this is used in the following setters, we need to set it first
    this.levels = levelsFn;
    this.level = options.level || DEFAULT_LEVEL;
    this.name = options.name;
    /** @type {unknown} */
    this.data = options.data;
  }

  /** @returns {import("./index.d.ts").Level} */
  get level() {
    return this.levels.text(this._level);
  }

  /** @param {import("./index.d.ts").Level} level */
  set level(level) {
    this._level = this.levels.index(level);
  }

  /** @param {import("./index.d.ts").Level} level */
  isLevel(level) {
    return this._level >= this.levels.index(level);
  }

  /**
   * @param {import("./index.d.ts").LoggerOptions} [options={}]
   * @returns {import("./index.d.ts").Logger}
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

  // @ts-expect-error Implementing overriding method
  trace(...args) {
    this.log(TRACE, ...args);
  }

  // @ts-expect-error Implementing overriding method
  debug(...args) {
    this.log(DEBUG, ...args);
  }

  // @ts-expect-error Implementing overriding method
  info(data, msg, ...args) {
    this.log(INFO, data, msg, ...args);
  }

  // @ts-expect-error Implementing overriding method
  warn(data, msg, ...args) {
    this.log(WARN, data, msg, ...args);
  }

  // @ts-expect-error Implementing overriding method
  error(data, msg, ...args) {
    this.log(ERROR, data, msg, ...args);
  }

  /**
   * Implements the overloaded log methods for each level.
   *
   * Does parameter shifting for the overloading and finally calls `this._log()`
   * to generate and write a log message to `this.out`. Overwrite `this._log`
   * in your own logger.
   *
   * @param {import("./index.d.ts").Level | number} level
   *    The log level for the message
   * @param {unknown} [data] Optional data to log
   * @param {string} [msg] Message to log, optionally a format string
   * @param {any[]} args Arguments to use in the format string
   */
  log(level, data, msg, ...args) {
    // logger is "silent"
    if (this._level < 0) return;
    const nLevel = typeof level === "number" ? level : this.levels.index(level);
    // log level is smaller than logger's level
    if (nLevel < this._level) return;

    if (typeof data === "string") {
      // shift msg into args,...
      if (msg) {
        args = [msg, ...args];
      }
      // because data is the msg
      msg = data;
      // and there is no data
      data = this.data;
    } else {
      data = mergeData(this.data, data);
    }
    this._log(nLevel, data, msg, ...args);
  }

  /**
   * Generate the log string and send it to `this.out`. Called by `this.log()`.
   *
   * Overwrite in your own logger.
   *
   * @protected
   * @param {number} nLevel
   * @param {unknown} data
   * @param {string | undefined} msg
   * @param {unknown[]} args
   */
  _log(nLevel, data, msg, ...args) {
    if (!msg && data instanceof Error && Object.keys(data).length === 0) {
      msg = data.message;
      data = undefined;
    }
    const msg_ =
      !!msg && args && args.length > 0
        ? formatWithOptions({ depth: 3, colors: true }, msg || "", ...args)
        : msg || "";
    const sLevel = this.levels.text(nLevel).toUpperCase();
    let line = this.name
      ? format("%s (%s): %s", sLevel, this.name, msg_)
      : format("%s: %s", sLevel, msg_);

    if (this.timestamp) {
      line = `[${this.timestamp()}] ${line}`;
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
  // @ts-expect-error Making the error message enumerable
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
