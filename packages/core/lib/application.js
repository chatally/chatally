import { getLogger, getNoLogger } from "@chatally/logger";
import { EventEmitter } from "node:events";

/**
 * @typedef {import("./types.d.ts").Request} Request
 * @typedef {import("./types.d.ts").Response} Response
 * @typedef {import("./types.d.ts").Dispatch} Dispatch
 */

/**
 * @template {Object} D
 * @typedef {import("./types.d.ts").Application<D>} IApplication<D>
 */

/**
 * @template {Object} D
 * @extends {EventEmitter}
 * @implements {IApplication<D>}
 */
export class Application extends EventEmitter {
  /** @type {import("@chatally/logger").Logger} */
  #log;
  /** @type {import("./types.d.ts").Middleware<D>[]} */
  #middlewares = [];
  /** @type { import("@chatally/logger").Logger[] } */
  #middlewareLogs = [];

  /**
   * Data prototype
   *
   * Cloned for each callback before being dispatched to the middlewares.
   *
   * @type {D | undefined}
   */
  #data;

  /**
   * @constructor
   * @param {import("./types.d.ts").ApplicationOptions<D>} [options={}]
   */
  constructor(options = {}) {
    super();
    this.#data = options.data;
    if (options.log === true) {
      const level =
        options.dev || process.env.NODE_ENV === "development"
          ? "debug"
          : "info";
      this.#log = getLogger({ level, name: "@chatally/core" });
    } else {
      this.#log = options.log || getNoLogger();
    }
    this.#log.debug("Application logging level: %s", this.#log.level);
  }

  /**
   * @param {import("./types.d.ts").Middleware<D>} fn
   * @param {String} [name]
   */
  use(fn, name) {
    if (typeof fn !== "function") {
      throw new TypeError("Application middleware must be a function");
    }
    if (!name) name = fn.name;
    if (!name) {
      name = "=>";
      this.#log.warn(
        `
⚠️ For better traceability, prefer using named functions
   instead of arrow functions or provide an optional 
   'name' parameter.
`.trim()
      );
    }
    this.#log.info("Registering middleware '%s'", name);

    this.#middlewares.push(fn);
    this.#middlewareLogs.push(this.#log.child({ name }));

    return this;
  }

  /**
   * Dispatch
   *
   * Use this function to trigger handling of the request by the application.
   *
   * The application will create a fresh context from the request and response
   * and pass it to each middleware. The context is responsible for error
   * handling within a callback.
   *
   * @type {Dispatch}
   */
  get dispatch() {
    return async (req, res) => {
      const data = Object.assign(Object.create(this.#data || {}), this.#data);
      const log = this.#log.child({ name: "dispatch" });
      try {
        await this.#dispatch(req, res, data, log);
      } catch (err) {
        this.#handleError(err, { req, res, data, log });
      }
    };
  }

  /**
   * Dispatch the context to all middlewares
   *
   * The order is the order of registration. Middleware exceptions are
   * dispatched to the context. This method throws only, if the context throws.
   *
   * @param {Request} req
   * @param {Response} res
   * @param {D} data
   * @param {import("@chatally/logger").Logger} log
   */
  async #dispatch(req, res, data, log) {
    let current = 0;
    const next = async () => {
      while (current < this.#middlewares.length) {
        try {
          const log = this.#middlewareLogs[current];
          await this.#middlewares[current++]({
            req,
            res,
            data,
            next,
            log,
          });
        } catch (err) {
          this.#handleError(err, { req, res, data, log });
        }
      }
    };
    await next();
    if (res.isWritable) {
      res.end();
    }
  }

  /**
   * @param {unknown} err
   * @param {import("./types.d.ts").ErrorContext<D>} context
   */
  #handleError(err, context) {
    try {
      if (!this.emit("error", err, context)) {
        context.log.error(err);
      }
    } catch (err) {
      context.log.error(err);
    }
  }
}
