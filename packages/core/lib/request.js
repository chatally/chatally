import { randomId } from "@internal/utils";
import { getMessageText } from "./messages.js";

/**
 * Create a request from the message(s)
 *
 * @typedef {import("./types.d.ts").Request} IRequest
 * @typedef {import("./types.d.ts").IncomingMessage} Message
 * @class
 * @param {Message | String} message
 * @implements {IRequest}
 */
export class Request {
  /** @type {Message} */
  #message;

  /**
   *
   * @param {Message|String} message
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
