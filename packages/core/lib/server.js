import { EventEmitter } from "node:events";
import { Request } from "./request.js";
import { Response } from "./response.js";

/**
 * @typedef {import("./message.d.ts").IncomingMessage} IncomingMessage
 * @typedef {import("./message.d.ts").OutgoingMessage} OutgoingMessage
 */

/**
 * @typedef {import("./server.d.ts").Server} Server
 *
 * @class
 * @extends {EventEmitter<import("./server.d.ts").ServerEvents>}
 * @implements {Server}
 */
export class BaseServer extends EventEmitter {
  /** @type {import("@chatally/logger").Logger | undefined} */
  #log;

  get log() {
    return this.#log;
  }

  set log(log) {
    this.#log = log;
  }

  /**
   * @param {string} name
   */
  constructor(name) {
    super();
    this.name = name;
  }

  listen() {
    throw new Error(
      "The method `listen()` in BaseServer is abstract and must be overridden"
    );
  }

  /**
   * @param {string | IncomingMessage} incoming
   * @param {object} callbacks
   * @param {((msg: OutgoingMessage) => void) | ((msg: OutgoingMessage) => Promise<void>)} [callbacks.onWrite]
   * @param {((res: Response) => void) | ((res: Response) => Promise<void>)} [callbacks.onFinished]
   */
  dispatch(incoming, { onWrite, onFinished }) {
    const req = new Request(incoming);
    const res = new Response();
    if (onWrite) {
      res.on("write", async (msg) => {
        try {
          await onWrite(msg);
        } catch (err) {
          this.log?.error(err);
        }
      });
    }
    if (onFinished) {
      res.on("finished", async (res) => {
        try {
          await onFinished(res);
        } catch (err) {
          this.log?.error(err);
        }
      });
    }
    this.emit("dispatch", req, res);
  }
}

/**
 * @param {any} object
 * @returns {object is import("./index.d.ts").Server}
 */
export function isServer(object) {
  if (!object) return false;
  if (object instanceof BaseServer) return true;

  if (typeof object.listen !== "function") return false;
  if (typeof object.on !== "function") return false;
  return true;
}
