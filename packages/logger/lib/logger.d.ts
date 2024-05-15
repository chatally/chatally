import { Level } from "./levels.js";
import { Method } from "./methods.js";

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

export interface LogMethod {
  /** Log a simple message */
  (msg: string): void;
  /** Log a printf-like message template, with rest arguments. */
  (msg: string, ...args: unknown[]): void;
  /** Log data and a printf-like message template, with rest arguments. */
  (data: unknown, msg?: string, ...args: unknown[]): void;
}

export interface LoggerOptions {
  /** Initial log level of the logger */
  level?: Level;
  /** Optional name of the logger */
  name?: string;
  /** Additional data to log with each call to a log method */
  data?: unknown;
}
