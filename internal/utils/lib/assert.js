/**
 * Assert that condition is truthy, otherwise throw an error.
 *
 * @param {boolean} condition
 * @param {string} msg
 */
export function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
  return;
}
