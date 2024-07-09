/**
 * Base error class that supports `instanceof` checks also for subclasses
 */
export class BaseError extends Error {
  /** @param {string} [message] */
  constructor(message) {
    const proto = new.target.prototype
    super(message)
    Object.setPrototypeOf(this, proto)
  }
}

export class HttpError extends BaseError {
  #status
  #description
  /**
   * Create an HttpError that carries an error status code, a user facing
   * message and an optional internal description.
   *
   * @param {number} status
   * @param {string} [message]
   * @param {string} [description]
   */
  constructor(status, message, description) {
    super(message)
    this.#status = status
    this.#description = description
  }

  /** The HTTP error status code */
  get status() {
    return this.#status
  }

  /** An internal description */
  get description() {
    return this.#description
  }
}
