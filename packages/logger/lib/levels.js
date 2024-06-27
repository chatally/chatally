/**
 * Helper object that detects missing proerties and typos with respect to the
 * type defining all log methods
 * @type {Record<keyof import("./index.d.ts").LogMethods, undefined>}
 */
const logMethods = {
  trace: undefined,
  debug: undefined,
  info: undefined,
  warn: undefined,
  error: undefined,
};

/**
 * Names of all log methods (correspond to the log levels)
 * @type {import("./index.d.ts").Level[]}
 */
// @ts-expect-error This will always contain all log methods
const logMethodNames = Object.keys(logMethods);
const last = logMethodNames.length - 1;

/**
 * Get the textual representation of a numeric log level.
 *
 * @param {number} numeric
 * @returns {import("./index.d.ts").Level}
 *   the textual level; "silent" for < 0, and maximum the highest level,
 *   e.g. "error"
 */
export function getLevel(numeric) {
  if (numeric < 0) return "silent";
  return logMethodNames[Math.min(numeric, last)];
}

/**
 * Get index of textual representation of the level
 *
 * @param {import("./index.d.ts").Level} level
 *   textual representation of the level, e.g. "debug"
 * @returns {number} index of level; -1 ("silent") for unknown levels
 */
export function getLevelIndex(level) {
  // @ts-expect-error Just make the level more error-proof for users not using
  // Typescript
  return logMethodNames.indexOf(level.toLowerCase());
}
