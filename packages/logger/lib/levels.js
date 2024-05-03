/**
 * @typedef {import("./types.d.ts").Method} Method
 * @typedef {import("./types.d.ts").Level} Level
 * @typedef {import("./types.d.ts").Logger} Logger
 */

/** @type {Method[]} */
const methods = ["debug", "info", "warn", "error"];
const last = methods.length - 1;

/**
 * Get the textual representation of a numeric log level
 *
 * @param {number} numeric
 * @returns {Level} the textual level; "silent" for < 0, and maximum the
 *    highest level, e.g. "error"
 */
export function getLevel(numeric) {
  return methods[numeric] || (numeric < 0 ? "silent" : methods[last]);
}

/**
 * Get index of textual representation of the level
 *
 * @param {Level} level textual representation of the level, e.g. "debug"
 * @returns {number} index of level; -1 ("silent") for unknown levels
 */
export function getLevelIndex(level) {
  // @ts-ignore
  return methods.indexOf(level.toLowerCase());
}

export const levels = {
  text: getLevel,
  index: getLevelIndex,
};
