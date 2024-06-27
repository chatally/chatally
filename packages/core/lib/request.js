import { nanoid } from "nanoid";
import { text } from "./text.js";

/**
 * @typedef {import("./message.d.ts").IncomingMessage} IncomingMessage
 */

/**
 * @type {import("./request.d.ts").Request}
 */
export class Request {
  /** @type {IncomingMessage} */
  #message;

  /** @param {IncomingMessage | string} message */
  constructor(message) {
    if (typeof message === "string") {
      let [from, text] = message.split(": ");
      if (!text) {
        text = from;
        from = "";
      }
      this.#message = {
        type: "text",
        text,
        timestamp: Date.now(),
        from,
        id: nanoid(),
      };
    } else {
      this.#message = message;
    }
  }

  get message() {
    return this.#message;
  }

  get text() {
    return text(this.#message);
  }
}
