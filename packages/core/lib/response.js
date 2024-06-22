import { EventEmitter } from "node:events";
import { text } from "./text.js";

/** @type {import("./index.d.ts").Response} */
export class Response extends EventEmitter {
  /** @type {import("./index.d.ts").OutgoingMessage[]} */
  #messages = [];
  #finished = false;

  /** @param {((r: Response) => void)} [onFinished] */
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

  /** @param {string | import("./index.d.ts").OutgoingMessage} [msg] */
  end(msg) {
    this.write(msg);
    this.#finished = true;
    this.emit("finished", this);
  }

  /** @param {string | import("./index.d.ts").OutgoingMessage} [msg] */
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
