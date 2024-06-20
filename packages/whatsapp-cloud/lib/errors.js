/**
 * Base error class that supports `instanceof` checks also for subclasses
 */
export class BaseError extends Error {
  /** @param {string} [message] */
  constructor(message) {
    const proto = new.target.prototype;
    super(message);
    Object.setPrototypeOf(this, proto);
  }
}

export class HttpError extends BaseError {
  #status;
  #description;
  /**
   * Create an HttpError that carries an error status code, a user facing
   * message and an optional internal description.
   *
   * @param {number} status
   * @param {string} [message]
   * @param {string} [description]
   */
  constructor(status, message, description) {
    super(message);
    this.#status = status;
    this.#description = description;
  }

  /** The HTTP error status code */
  get status() {
    return this.#status;
  }

  /** An internal description */
  get description() {
    return this.#description;
  }
}

/**
 * @typedef GraphApiErrorInit
 * @property {string} message
 * @property {string} type
 * @property {number} code
 * @property {number} error_subcode
 * @property {string} error_user_title
 * @property {string} error_user_msg
 * @property {string} fbtrace_id
 */

export class GraphApiError extends BaseError {
  /** @param {GraphApiErrorInit} init */
  constructor(init) {
    super(init.error_user_msg);
    this.message = init.message;
    this.type = init.type;
    this.code = init.code;
    this.error_subcode = init.error_subcode;
    this.error_user_title = init.error_user_title;
    this.error_user_msg = init.error_user_msg;
    this.fbtrace_id = init.fbtrace_id;
  }
}

export class MediaError extends BaseError {
  /** @type {unknown|undefined} */
  info;

  /**
   * @param {string | undefined} message
   * @param {undefined} [info]
   */
  constructor(message, info) {
    super(message);
    this.info = info;
  }
}
