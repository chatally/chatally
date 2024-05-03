/**
 * Check if an object has a property, either own or from its prototype
 *
 * @param {unknown} o The object
 * @param {PropertyKey} p The property key
 * @param {Object} [c] Additional characteristics required for the property
 *   (AND logic)
 * @param {boolean} [c.enumerable] Property must be enumerable
 * @param {boolean} [c.writable] Property must be writable
 * @param {boolean} [c.configurable] Property must be configurable
 * @param {boolean} [c.get] Property must have a get accessor
 * @param {boolean} [c.set] Property must have a set accessor
 * @param {boolean} [c.settable] Property must be writable or have a set
 *   accessor
 * @returns {boolean}
 */
export function hasProperty(o, p, c) {
  if (!o) {
    return false;
  }
  const prop =
    Object.getOwnPropertyDescriptor(o, p) ||
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(o), p);
  if (!prop) {
    return false;
  }
  if (c) {
    if (c.writable !== undefined && c.writable !== prop.writable) {
      return false;
    }
    if (c.settable === true && (!prop.set || !prop.writable)) {
      return false;
    }
    if (c.settable === false && (!!prop.set || !!prop.writable)) {
      return false;
    }
    if (c.enumerable !== undefined && c.enumerable !== prop.enumerable) {
      return false;
    }
    if (c.set !== undefined && c.set !== !!prop.set) {
      return false;
    }
    if (c.configurable !== undefined && c.configurable !== prop.configurable) {
      return false;
    }
    if (c.get !== undefined && c.get !== !!prop.get) {
      return false;
    }
  }
  return true;
}
