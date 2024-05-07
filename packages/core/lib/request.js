import { randomId } from "@internal/utils";
import { getMessageText } from "./messages.js";

/**
 * Request with incoming message
 *
 * @class
 * @typedef {import("./types.d.ts").Request} IRequest
 * @implements {IRequest}
 */
export class Request {
  /** @type {import("./types.d.ts").IncomingMessage} */
  #message;

  /**
   *
   * @param {import("./types.d.ts").IncomingMessage | String} message
   */
  constructor(message) {
    if (typeof message === "string") {
      let [from, text] = message.split(": ");
      if (!text) {
        text = from;
        from = "";
      }
      message = {
        type: "text",
        text,
        timestamp: Date.now(),
        from,
        id: randomId(),
      };
    }
    this.#message = message;
  }

  get message() {
    return this.#message;
  }

  get text() {
    return getMessageText(this.message);
  }
}
