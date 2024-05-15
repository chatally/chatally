import { nanoid } from "nanoid";
import { text } from "./text.js";

/**
 * Chat request with incoming message
 *
 * @typedef IRequest
 * @property {Readonly<IncomingMessage>} message Incoming message
 * @property {Readonly<string>} text Textual content of incoming message
 */

/**
 * Incoming message
 *
 * @typedef {(Incoming & import("./messages.d.ts").Message)} IncomingMessage
 *
 * @typedef {object} Incoming
 * @property {number} IncomingMessage.timestamp Arrival time of message
 * @property {string} IncomingMessage.id Id of message
 * @property {string} IncomingMessage.from Id of sender
 * @property {string} [IncomingMessage.replyTo] Id of message that this message
 *    is a reply to
 */

/**
 * Chat request with incoming message
 *
 * @class
 * @implements {IRequest}
 */
export class Request {
  /** @type {IncomingMessage} */
  #message;

  /**
   *
   * @param {IncomingMessage | string} message Fully typed message or a string
   *    that can optionally contain a "sender:" before a colon
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
        id: nanoid(),
      };
    }
    this.#message = message;
  }

  get message() {
    return this.#message;
  }

  get text() {
    return text(this.message);
  }
}
