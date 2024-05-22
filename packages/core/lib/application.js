import { BaseLogger, NoLogger } from "@chatally/logger";
import { EventEmitter } from "node:events";
import { isServer } from "./server.js";

/**
 * ChatAlly Application that dispatches incoming requests from all registered
 * servers to all registered middleware.
 *
 * @template {Object} D
 * @extends {EventEmitter<{error: [Error & Record<string, unknown>, Omit<import("./middleware.d.ts").Context<D>, "next">]}>}
 */
export class Application extends EventEmitter {
  /**
   * Main logger for the application
   * @type {import("@chatally/logger").Logger} */
  #log;

  /**
   * Middlewares in order of registration
   * @type {import("./middleware.d.ts").Middleware<D>[]}
   */
  #middlewares = [];

  /**
   * Servers
   * @type {import("./server.js").Server[]}
   */
  #servers = [];

  /**
   * Child loggers, one for each middleware
   * @type {import("@chatally/logger").Logger[]}
   */
  #middlewareLogs = [];

  /**
   * Data prototype, cloned for each callback before being dispatched
   * @type {D | undefined}
   */
  #data;

  /**
   * Create an application that dispatches incoming chat requests from all
   * registered servers to all registered middleware.
   *
   * @param {Object} [options={}] Optional options
   * @param {D} [options.data]
   *    Arbitrary data to put into the context for each request
   * @param {import("@chatally/logger").Logger | boolean} [options.log]
   *    Your logger or flag if you want to use a default logger,
   *    default is the BaseLogger
   * @param {boolean} [options.dev]
   *    Run in development mode
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
   * @param {import("./middleware.d.ts").Middleware<D> | import("./server.js").Server} m
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
   * @type {import("./server.js").Dispatch}
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
   * @param {import("./request.js").IRequest} req
   * @param {import("./response.js").IResponse} res
   * @param {D & Record<string, unknown>} data
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
   * @param {Omit<import("./middleware.d.ts").Context<D>, "next">} context
   */
  #handleError(err, context) {
    try {
      if (err instanceof Error) {
        // @ts-expect-error For better DX, we pass down an error that behaves like "any"
        if (!this.emit("error", err, context)) {
          context.log.error(err);
        }
      } else {
        context.log.error(err);
      }
    } catch (err) {
      context.log.error(err);
      throw err;
    }
  }

  /**
   * Start all registered servers in parallel.
   */
  listen() {
    for (let server of this.#servers) {
      // overcome blocking `listen()` calls
      new Promise((res) => {
        server.listen();
        res(undefined);
        // TODO: Use this.#handleError instead
      }).catch((err) => this.#log.error(err));
    }
  }
}

/**
 * @param {boolean | import("@chatally/logger").Logger} [log]
 * @param {boolean} [dev]
 * @returns {import("@chatally/logger").Logger}
 */
function initLog(log, dev) {
  if (log === true) {
    const level =
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      dev || process.env.NODE_ENV === "development" ? "debug" : "info";
    return BaseLogger.create({ level, name: "@chatally/core" });
  } else {
    return log || NoLogger.create();
  }
}
