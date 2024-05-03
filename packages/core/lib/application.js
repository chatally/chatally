import { getLogger } from "@chatally/logger";
import { hasProperty } from "@internal/utils";
import { EventEmitter } from "node:events";

/**
 * @typedef {import("./types.d.ts").Request} Request
 * @typedef {import("./types.d.ts").Response} Response
 * @typedef {import("./types.d.ts").Dispatch} Dispatch
 * @typedef {import("./types.d.ts").Server} Server
 * @typedef {import("@chatally/logger").Logger} Logger
 */

/**
 * @template {Object} D
 * @typedef {import("./types.d.ts").Middleware<D>} Middleware<D>
 */

/**
 * @template {Object} D
 * @typedef {import("./types.d.ts").ErrorContext<D>} ErrorContext<D>
 */

/**
 * @template {Object} D
 * @typedef {{error: [Error & Record<string, unknown>, ErrorContext<D>]}} ApplicationEvents<D>
 */

/**
 * @template {Object} D
 * @extends {EventEmitter<ApplicationEvents<D>>}
 */
export class Application extends EventEmitter {
  /**
   * Main logger for the application
   * @type {Logger} */
  #log;

  /**
   * Middlewares in order of registration
   * @type {Middleware<D>[]}
   */
  #middlewares = [];

  /**
   * Servers
   * @type {Server[]}
   */
  #servers = [];

  /**
   * Child loggers, one for each middleware
   * @type { Logger[] } */
  #middlewareLogs = [];

  /**
   * Data prototype, cloned for each callback before being dispatched
   * @type {D | undefined}
   */
  #data;

  /**
   * @constructor
   * @param {Object} [options={}]
   * @param {D} [options.data]
   * @param {Logger | boolean} [options.log]
   * @param {boolean} [options.dev]
   */
  constructor(options = {}) {
    super();
    this.#data = options.data;
    this.#log = initLog(options.log, options.dev);
    this.#log.debug("Application logging level: %s", this.#log.level);
  }

  /**
   * @param {string} name
   * @param {import("@chatally/logger").Level} [level]
   */
  getLogger(name, level) {
    return this.#log.child({ name, level });
  }

  /**
   * Register a middleware function
   *
   * Middlewares are executed in order of registration, but can `await next()`
   * to wait for the following middlewares to finish.
   *
   * It is preferrable to use a named function over an arrow function, because
   * the name is used to identify child loggers. Optionally, you can provide a
   * name for the middleware.
   *
   * @param {Middleware<D> | Server} m
   * @param {String} [name]
   */
  use(m, name) {
    if (!name) name = m.name;
    if (isServer(m)) {
      m.dispatch = this.dispatch;
      this.#servers.push(m);
      this.#log.info("Registered server '%s'", name);
    } else if (typeof m === "function") {
      if (!name) {
        name = "=>";
        this.#log.warn(
          `
⚠️ For better traceability, prefer using named functions
   instead of arrow functions or provide an optional 
   'name' parameter when registering it with 'use'.
`.trim()
        );
      }
      this.#middlewareLogs.push(this.#log.child({ name }));
      this.#middlewares.push(m);
      this.#log.info("Registered middleware '%s'", name);
    } else {
      throw new TypeError(
        `Ineffective application module '${name}'. Middleware must be a function, servers must provide a writable property 'dispatch' and a method 'listen'`
      );
    }
    return this;
  }

  /**
   * Use this asynchronous method to trigger handling of the request by the
   * application.
   *
   * The application will pass request and response as context to each
   * middleware. The application will handle all uncaught errors within a
   * callback. The callback will resolve after the last middleware finished,
   * but a server could send responses earlier, by registering the
   * `on("finish")` event on the response.
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
   * @param {D & Record<string, unknown>} data
   * @param {Logger} log
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
   * @param {ErrorContext<D>} context
   */
  #handleError(err, context) {
    try {
      if (err instanceof Error) {
        // @ts-ignore
        if (!this.emit("error", err, context)) {
          context.log.error(err);
        }
      } else {
        context.log.error(err);
      }
    } catch (err) {
      context.log.error(err);
    }
  }

  listen() {
    for (let server of this.#servers) {
      new Promise((res, rej) => {
        server.listen();
        res(undefined);
      }).catch((reason) => this.#log.error(reason));
    }
  }
}

/**
 * @param {boolean | Logger} [log]
 * @param {boolean} [dev]
 */
function initLog(log, dev) {
  if (log === true) {
    const level =
      dev || process.env.NODE_ENV === "development" ? "debug" : "info";
    return getLogger({ level, name: "@chatally/core" });
  } else {
    return log || getLogger("nologger");
  }
}

/**
 * @param {any} object
 * @returns {object is Server}
 */
function isServer(object) {
  if (!object) return false;
  return (
    hasProperty(object, "dispatch", { settable: true }) &&
    typeof object.listen === "function"
  );
}
