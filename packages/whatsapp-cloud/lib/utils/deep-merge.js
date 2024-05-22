/**
 * @param {any[]} objects
 */
export function deepMerge(...objects) {
  /** @type {any} */
  const result = {};
  for (let obj of objects) {
    if (typeof obj !== "object") {
      throw new Error(
        `All items for 'deepMerge' must be of type "object", but found type "${typeof obj}".`
      );
    }
    for (let key of Object.keys(obj)) {
      const value = obj[key];
      if (value !== undefined) {
        if (typeof value === "object" && typeof result[key] === "object") {
          result[key] = deepMerge(result[key], value);
        } else {
          result[key] = value;
        }
      }
    }
  }
  return result;
}
