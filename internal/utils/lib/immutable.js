/**
 * @template {Array<*> | Object} T
 * @param {T} value
 * @returns {T}
 */
export function immutable(value) {
  const type = getType(value);
  const handler = getHandler(type);
  if (handler) {
    return new Proxy(value, handler);
  }
  return value;
}

/**
 * @param {unknown} value
 */
function getType(value) {
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
}

/**
 * @param {string} type
 */
function getHandler(type) {
  const disallowed = disallowedMethods[type];
  const get = disallowed
    ? (/** @type {any} */ target, /** @type {string} */ method) => {
        if (disallowed.includes(method)) {
          return disallow;
        } else {
          return target[method];
        }
      }
    : undefined;
  return {
    set: disallow,
    setPrototypeOf: disallow,
    preventExtensions: disallow,
    defineProperty: disallow,
    deleteProperty: disallow,
    get,
  };
}

/** @type {Record<string, string[]>} */
const disallowedMethods = {
  array: [
    "push",
    "pop",
    "splice",
    "shift",
    "unshift",
    "sort",
    "reverse",
    "copyWithin",
    "fill",
  ],
};

/**
 * Always throw an error, indicating that this object is immutable.
 *
 * @throws always
 * @returns {never}
 */
function disallow() {
  throw new Error("Object is immutable");
}
