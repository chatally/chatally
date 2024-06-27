import { EventEmitter } from "node:events";
import { text } from "./text.js";

/**
 * @typedef {import("./message.d.ts").OutgoingMessage} OutgoingMessage
 */

/** @type {import("./response.d.ts").Response} */
export class Response extends EventEmitter {
  /** @type {OutgoingMessage[]} */
  #messages = [];
  #finished = false;

  constructor() {
    super();
  }

  get messages() {
    return this.#messages;
  }

  get isWritable() {
    return !this.#finished;
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

  get text() {
    return this.#messages.map(text);
  }
}
