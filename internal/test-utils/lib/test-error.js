/**
 * Error class, where you can assign arbitrary additional properties.
 *
 */
export class TestError extends Error {
  /**
   *
   * @param {string} message
   * @param {Object} [x]
   */
  constructor (message, x) {
    const proto = new.target.prototype
    super(message)
    Object.setPrototypeOf(this, proto)
    if (x) {
      Object.assign(this, x)
    }
  }
}
