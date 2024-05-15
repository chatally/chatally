import { methods } from "./methods.js";

/**
 * All log levels, i.e. all log method names plus "silent".
 * @typedef {"silent" | import("./methods.js").Method} Level
 */

/**
 * All log levels, i.e. all log method names plus "silent".
 * @type {Level[]}
 */
export const levels = ["silent", ...methods];

const last = methods.length - 1;

/**
 * Get the textual representation of a numeric log level.
 *
 * @param {number} numeric
 * @returns {Level}
 *   the textual level; "silent" for < 0, and maximum the highest level,
 *   e.g. "error"
 */
export function getLevel(numeric) {
  return methods[numeric] || (numeric < 0 ? "silent" : methods[last]);
}

/**
 * Get index of textual representation of the level
 *
 * @param {Level} level
 *   textual representation of the level, e.g. "debug"
 * @returns {number} index of level; -1 ("silent") for unknown levels
 */
export function getLevelIndex(level) {
  // @ts-expect-error Level is a string union type
  return methods.indexOf(level.toLowerCase());
}
