import { Writable } from "node:stream";

/**
 * Basic logger implementation, that logs to the console by default.
 *
 * This logger is not optimized and should only be used for development.
 *
 * For test purposes, the output can be redirected to any `Writable` by setting
 * the `out` property. Also for test purposes you can turn off the timestamps,
 * by setting the `timestamps` property to false.
 */
export declare class BaseLogger implements Logger {
  /**
   * Create a basic logger implementation, that logs to the console by default.
   *
   * This logger is not optimized and should only be used for development.
   *
   * For test purposes, the output can be redirected to any `Writable` by
   * setting the `out` property. Also for test purposes you can turn off the
   * timestamps, by setting the `timestamps` property to false.
   *
   * @param options
   * @param levelsFn
   */
  constructor(options?: LoggerOptions, levelsFn?: LevelsFn);
  level: Level;
  name?: string | undefined;
  data?: unknown;
  isLevel(level: Level): boolean;
  child(options?: LoggerOptions | undefined): Logger;
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;

  /**
   * Output writable, default is the console.
   *
   * Override this for testing your logger.
   */
  out?: Writable;

  /**
   * Create a timestamp that will be included in the logged message. You can
   * also set it to `false` or `undefined` if you do not want timestamps.
   *
   * Default will return the time part of an ISO-formatted date
   * (without the date).
   */
  timestamp: (() => string) | false | undefined;
}

/**
 * Logger facade interface
 *
 * This is the common interface for a simple logger that you can use in your
 * library, that can easily be implemented with any logging framework.
 */
export interface Logger extends LogMethods {
  /**
   * Log level of this logger.
   */
  level: Level;

  /**
   * Optional name of this logger.
   */
  name?: string;

  /**
   * Optional data of this logger.
   */
  data?: unknown;

  /**
   * Check if this logger is active on the given level.
   *
   * @param level
   */
  isLevel(level: Level): boolean;

  /**
   * Create a child logger
   *
   * The child logger inherits all properties of the parent logger. Properties
   * can be overwritten by the options.
   *
   * @param options Override parent options
   */
  child(options?: LoggerOptions): Logger;
}

interface LoggerOptions {
  /** Initial log level of the logger */
  level?: Level;
  /** Optional name of the logger */
  name?: string;
  /** Additional data to log with each call to a log method */
  data?: unknown;
}

type LevelsFn = {
  index: (level: Level) => number;
  text: (level: number) => Level;
};

/**
 * All log levels, i.e. all log method names plus "silent".
 */
export type Level = "silent" | keyof LogMethods;

/**
 * All log methods.
 *
 * These are factored out, so we can automatically match them to log levels and
 * there index numbers, hence: order is relevant.
 *
 * See ./levels.js
 */
export type LogMethods = {
  /** Log a debug message. */
  debug: LogMethod;
  /** Log an info message. */
  info: LogMethod;
  /** Log a warn message. */
  warn: LogMethod;
  /** Log an error message. */
  error: LogMethod;
};

interface LogMethod {
  /** Log a simple message */
  (msg: string): void;
  /** Log a printf-like message template, with rest arguments. */
  (msg: string, ...args: unknown[]): void;
  /** Log data and a printf-like message template, with rest arguments. */
  (data: unknown, msg?: string, ...args: unknown[]): void;
}

/**
 * Default implementation of Logger interface with all no-ops.
 */
export declare class NoLogger implements Logger {
  /**
   * Create a no-op logger implementation, that does nothing.
   *
   * This logger causes no overhead, as it does nothing.
   */
  constructor();

  /**
   * Log level of this logger. Will always return `"silent"`.
   */
  level: Level;
  name?: string | undefined;
  data?: unknown;
  /**
   * Check if this logger is active. Will always return `false`.
   * @param level
   */
  isLevel(level: Level): boolean;
  /** Create a child logger. Will always return `this`. */
  child(options?: LoggerOptions | undefined): Logger;
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
}

/**
 * Get the textual representation of a numeric log level.
 *
 * @param numeric index of level
 * @returns the textual level; "silent" for < 0, and maximum the highest level,
 *   e.g. "error"
 */
export declare function getLevel(numeric: number): Level;

/**
 * Get index of textual representation of the level
 *
 * @param level
 *   textual representation of the level, e.g. "debug"
 * @returns index of level; -1 ("silent") for unknown levels
 */
export declare function getLevelIndex(level: Level): number;
