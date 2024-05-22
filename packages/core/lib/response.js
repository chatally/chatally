import { EventEmitter } from "node:events";
import { text } from "./text.js";

/**
 * Chat response
 * @typedef IResponse
 * @property {OutgoingMessage[]} messages Messages to send as response
 * @property {Readonly<boolean>} isWritable True if no middleware called end
 * @property {Readonly<string[]>} text Textual representation of all messages
 * @property {(msg: string | OutgoingMessage) => void} write Write a message
 * @property {(msg?: string | OutgoingMessage) => void} end
 *    End the response, optionally with a message
 * @template {keyof Events} E
 * @property {(event: E, listener: Events[E]) => IResponse} on
 *
 * @typedef {object} Events
 * @property {[Response]} finished
 * @property {[OutgoingMessage]} write
 */

/**
 * Outgoing message
 * @typedef {(Outgoing & import("./messages.d.ts").Message)} OutgoingMessage
 *
 * @typedef {object} Outgoing
 * @property {string} [OutgoingMessage.replyTo]
 *    id of message that this message is a reply to
 */

/**
 * Chat response
 *
 * @class
 * @extends {EventEmitter<Events>}
 * @implements {IResponse}
 */
export class Response extends EventEmitter {
  /** @type {OutgoingMessage[]} */
  #messages = [];
  #finished = false;

  /**
   * Create a new response
   *
   * @param {(() => void)} [onFinished]
   *   optional handler to be called, when response `end()` is called
   */
  constructor(onFinished) {
    super();
    if (onFinished) {
      this.on("finished", onFinished);
    }
  }

  get messages() {
    return this.#messages;
  }

  get isWritable() {
    return !this.#finished;
  }

  get text() {
    return this.#messages.map(text);
  }

  /** @param {string | OutgoingMessage} [msg] */
  end(msg) {
    this.write(msg);
    this.#finished = true;
    this.emit("finished", this);
  }

  /** @param {string | OutgoingMessage} [msg] */
  write(msg) {
    if (!msg) return;

    if (this.#finished) {
      throw new Error("Cannot write anymore, response is finished.");
    }
    if (typeof msg === "string") {
      msg = { type: "text", text: msg };
    }
    if (Array.isArray(msg)) {
      this.#messages.push(...msg);
    } else {
      this.#messages.push(msg);
    }
    this.emit("write", msg);
  }
}
