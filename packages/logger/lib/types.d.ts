/**
 * Names of all log methods (correspond to the log levels)
 */

import { Writable } from "./base-logger.js";

// @ts-ignore
export const methods = ["debug", "info", "warn", "error"] as const;

/**
 * String union type of all log method names
 */
export type Method = (typeof methods)[number];

/**
 * All log levels
 *
 * I.e. all log method names plus "silent".
 */
export type Level = Method | "silent";

/**
 * Logger facade interface
 *
 * This is the common interface for a simple logger that you can use in your
 * library, that can easily be implemented with any logging framework.
 */
export interface Logger extends Record<Method, LogMethod> {
  /**
   * Log level of this logger
   */
  level: Level;

  /**
   * Optional name of this logger
   */
  name?: string;

  /**
   * Optional data of this logger
   */
  data?: unknown;

  /**
   * Check if this logger is active on the given level
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
   * @param options Overriding parent options
   */
  child(options?: LoggerOptions): Logger;
}

interface LogMethod {
  /**
   * Log message
   *
   * The message can be a printf-like template, it will be formatted using the
   * rest arguments
   *
   * @param msg The message or printf-like template string
   * @param args Rest arguments to use as input to the template string
   */
  (msg: string, ...args: any[]): void;
  /**
   * Log message with additional data
   *
   * The message can be a printf-like template, it will be formatted using the
   * rest arguments. The data will be logged after the message.
   *
   * @param data Additional data to log
   * @param msg The message or printf-like template string
   * @param args Rest arguments to use as input to the template string
   */
  (data: unknown, msg?: string, ...args: any[]): void;
}

export interface LoggerOptions {
  /**
   * Initial log level of the logger
   */
  level?: Level;
  /**
   * Optional name of the logger
   */
  name?: string;
  /**
   * Additional data to log with each call to a log method
   */
  data?: unknown;
}

/**
 * Get a development logger
 *
 * This logger is not optimized for production use and outputs everything to
 * the console.
 *
 * For test purposes, you can redirect the output and log without timestamps.
 *
 * @param options
 */
export function getLogger(options?: LoggerOptions | "nologger"): Logger & {
  /** Redirect output to the writable instead of the console*/
  out?: Writable;
  /** Disable timestamps in output */
  timestamps: boolean;
};
