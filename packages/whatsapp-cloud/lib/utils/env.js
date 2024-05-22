/**
 * @param {string} name
 * @param {boolean} [defaultValue=false]
 * @returns {boolean}
 */
export function envBoolean(name, defaultValue = false) {
  const value = process.env[name]?.toLowerCase();
  if (value) {
    return Boolean(value);
  }
  return defaultValue;
}

/**
 * @template {number | undefined} N
 * @param {string} name
 * @param {N} [defaultValue]
 * @returns {N | number}
 */
export function envNumber(name, defaultValue) {
  const value = process.env[name];
  if (value) {
    return Number(value);
  }
  if (defaultValue) {
    return defaultValue;
  }
  // @ts-expect-error N is undefined in this case
  return undefined;
}
