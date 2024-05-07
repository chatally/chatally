/** @type {import("./types.d.ts").Method[]} */
const methods = ["debug", "info", "warn", "error"];
const last = methods.length - 1;

/**
 * Get the textual representation of a numeric log level
 *
 * @param {number} numeric
 * @returns {import("./index.js").Level}
 *   the textual level; "silent" for < 0, and maximum the highest level,
 *   e.g. "error"
 */
export function getLevel(numeric) {
  return methods[numeric] || (numeric < 0 ? "silent" : methods[last]);
}

/**
 * Get index of textual representation of the level
 *
 * @param {import("./index.js").Level} level
 *   textual representation of the level, e.g. "debug"
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
