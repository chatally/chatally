import { getLogger, getNoLogger } from "@chatally/logger";
import { EventEmitter } from "node:events";
import { Context, createContext } from "./context.js";

/**
 * @typedef {import("./types.d.ts").Request} Request
 * @typedef {import("./types.d.ts").Response} Response
 * @typedef {import("./types.d.ts").Callback} Callback
 */

/**
 * Create an application
 *
 * Configure the application by registering middleware with the `use` method,
 * registering event listeners with the `on` method and then use the callback
 * to handle requests and generate responses.
 *
 * @template [C = {}]
 * @param {import("./types.d.ts").ApplicationOptions<C>} [options]
 * @returns {import("./types.d.ts").Application<C>}
 */
export function createApplication(options = {}) {
  return new Application(options);
}

/**
 * @typedef {import("./types.d.ts").Application} IApplication
 * @implements {IApplication}
 * @extends {EventEmitter}
 */
class Application extends EventEmitter {
  /** @type {import("@chatally/logger").Logger} */
  log;

  /**
   * @type {import("./types.d.ts").Middleware[]}
   */
  #middlewares = [];
  /** @type { import("@chatally/logger").Logger[] } */
  #middlewareLogs = [];

  /**
   * Context prototype
   *
   * Cloned for each callback before being dispatched to the middlewares.
   *
   * @type {unknown}
   */
  #context;

  /**
   * @constructor
   * @param {import("./types.d.ts").ApplicationOptions} [options={}]
   */
  constructor(options = {}) {
    super();
    this.#context = options.context;
    if (options.log === true) {
      const level =
        options.dev || process.env.NODE_ENV === "development"
          ? "debug"
          : "info";
      this.log = getLogger({ level, name: "@chatally/core" });
    } else {
      this.log = options.log || getNoLogger();
    }
    this.log.debug("Application logging level: %s", this.log.level);
  }

  /**
   * @param {import("./types.d.ts").Middleware} fn
   * @param {String} [name]
   */
  use(fn, name) {
    if (typeof fn !== "function") {
      throw new TypeError("Application middleware must be a function");
    }
    if (!name) name = fn.name;
    if (!name) {
      name = "=>";
      this.log.warn(
        `
⚠️ For better traceability, prefer using named functions
   instead of arrow functions or provide an optional 
   'name' parameter.
`.trim()
      );
    }
    this.log.info("Registering middleware '%s'", name);

    this.#middlewares.push(fn);
    this.#middlewareLogs.push(this.log.child({ name }));

    return this;
  }

  /**
   * Callback
   *
   * Use this function to trigger handling of the request by the application.
   *
   * The application will create a fresh context from the request and response
   * and pass it to each middleware. The context is responsible for error
   * handling within a callback.
   *
   * @type {Callback}
   */
  get callback() {
    return async (/** @type {Request} */ req, /** @type {Response} */ res) => {
      this.log.info({ req }, "Incoming request");
      try {
        const ctx = createContext(req, res, this.#context);
        try {
          await this.#dispatch(ctx);
        } catch (err) {
          this.log.error(err);
          this.emit("error", err, ctx);
        }
      } catch (err) {
        this.log.error(err);
        this.emit("error", err, req, res);
      }
    };
  }

  /**
   * Dispatch the context to all middlewares
   *
   * The order is the order of registration. Middleware exceptions are
   * dispatched to the context. This method throws only, if the context throws.
   *
   * @param {Context} ctx
   */
  async #dispatch(ctx) {
    let current = 0;
    const next = async () => {
      while (current < this.#middlewares.length) {
        try {
          const log = this.#middlewareLogs[current];
          await this.#middlewares[current++](ctx, next, log);
        } catch (err) {
          ctx.handleError(err);
        }
      }
    };
    await next();
    if (ctx.res.writableFinished === false) {
      ctx.res.end();
    }
  }
}
