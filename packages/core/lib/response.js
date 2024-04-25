import { EventEmitter } from "node:events";

/**
 * Create a request from the message(s)
 *
 * @typedef {import("./types.d.ts").OutgoingMessage} OutgoingMessage
 * @returns {import("./types.d.ts").Response}
 */
export function createResponse() {
  return new Response();
}

/**
 * Response
 *
 * @extends EventEmitter
 */
class Response extends EventEmitter {
  #finished = false;
  /** @type OutgoingMessage[] */
  #messages = [];

  /** @type import("./types.d.ts").ContextError | undefined */
  error = undefined;

  get writableFinished() {
    return this.#finished;
  }

  /**
   * @param {OutgoingMessage} data
   */
  end(data) {
    this.write(data);
    this.#finished = true;
  }

  /**
   * @param {OutgoingMessage} data
   */
  write(data) {
    if (data) {
      if (this.#finished) {
        throw new Error("Cannot write anymore, response is finished.");
      }
      this.#messages.push(data);
    }
  }

  get messages() {
    return this.#messages;
  }
}
