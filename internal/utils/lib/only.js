/**
 * @template {Object} O
 * @template {Array<keyof O>} K
 * @param {O} obj
 * @param {K} keys
 * @returns {Partial<O>}
 */
export function only(obj, keys) {
  const filtered = {};
  for (let key of keys) {
    // @ts-ignore
    filtered[key] = obj[key];
  }
  // @ts-ignore
  return filtered;
}
