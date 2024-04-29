import { EventEmitter } from "node:events";
import { getMessageText } from "./messages.js";

/**
 * Response implementation
 *
 * @typedef {import("./types.d.ts").Response} IResponse
 * @typedef {import("./types.d.ts").OutgoingMessage} OutgoingMessage
 * @typedef {import("./types.d.ts").Msg} Msg
 *
 * @extends {EventEmitter}
 * @implements {IResponse}
 */
export class Response extends EventEmitter {
  /** @type OutgoingMessage[] */
  #messages = [];
  #finished = false;

  /**
   * Create a new response
   *
   * @param {((res: IResponse) => void)} [onFinished]
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
    return this.#messages.map(getMessageText);
  }

  /** @param {Msg} msg */
  end(msg) {
    this.write(msg);
    this.#finished = true;
    this.emit("finished", this);
  }

  /** @param {Msg} msg */
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
    this.emit("write", this, msg);
  }
}
