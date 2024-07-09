/**
 * Merge multiple objects deeply.
 *
 * Only simple objects (record-like) are merged deeply, class instances are
 * treated as atomic values. Merged objects are new objects, simple values are
 * copied, class instances are referenced.
 *
 * @param {any[]} objects
 * @returns A new simple object with deeply merged property values
 */
export function deepMerge(...objects) {
  /** @type {any} */
  const result = {}
  for (const obj of objects) {
    if (!isSimpleObject(obj)) {
      const type = typeof obj === 'object' ? `${Object.getPrototypeOf(obj).constructor.name}` : typeof obj
      throw new TypeError(
        `All items for 'deepMerge' must be simple objects, but found type '${type}'.`,
      )
    }
    for (const key of Object.keys(obj)) {
      const value = obj[key]
      if (value !== undefined) {
        if (isSimpleObject(value) && isSimpleObject(result[key])) {
          result[key] = deepMerge(result[key], value)
        } else {
          result[key] = value
        }
      }
    }
  }
  return result
}

/**
 * @param {unknown} obj
 * @returns True if the value is a simple object, i.e. record-like
 */
function isSimpleObject(obj) {
  return !!obj
    && typeof obj === 'object'
    && Object.getPrototypeOf(obj).constructor.name === 'Object'
}
