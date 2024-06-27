import { BaseLogger, NoLogger } from "@chatally/logger";
import { EventEmitter } from "node:events";
import { isServer } from "./server.js";

/**
 * @typedef {import("./server.d.ts").Server} Server
 * @typedef {import("./request.d.ts").IRequest} IRequest
 * @typedef {import("./response.d.ts").IResponse} IResponse
 * @typedef {import("@chatally/logger").Logger} Logger
 * @typedef {import("@chatally/logger").Level} Level
 */

/**
 * @template {Record<string, unknown>} D
 * @typedef {import("./middleware.d.ts").Middleware<D>} Middleware
 */

/**
 * @template {Record<string, unknown>} D
 * @typedef {import("./middleware.d.ts").Context<D>} Context
 */

/**
 * ChatAlly Application that dispatches incoming requests from all registered
 * servers to all registered middleware.
 * @template {Record<string, unknown>} D
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
   * @type {Logger[]}
   */
  #middlewareLogs = [];

  /**
   * Data prototype, cloned for each callback before being dispatched
   * @type {D | undefined}
   */
  #data;

  /**
   * @param {import("./application.js").ApplicationOptions<D>} [options]
   */
  constructor(options = {}) {
    super();
    this.#data = options.data;
    if (options.log === undefined) {
      const level =
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        options.dev || process.env.NODE_ENV === "development"
          ? "debug"
          : "info";
      this.#log = new BaseLogger({ level, name: "@chatally/core" });
    } else {
      this.#log = options.log || new NoLogger();
    }
    this.#log.debug("Application logging level: %s", this.#log.level);
  }

  /**
   * @param {string} name
   * @param {Level} [level]
   */
  getLogger(name, level) {
    return this.#log.child({ name, level });
  }

  /**
   * @param {Middleware<D> | Server} module
   * @param {String} [name]
   */
  use(module, name) {
    name ??= module.name;
    if (!name) {
      name = "<unnamed>";
      this.#log.warn(`⚠️ For better traceability, prefer using named functions
   instead of arrow functions or provide an optional 
   'name' parameter when registering it with 'use'.`);
    }
    if (isServer(module)) {
      module.on("dispatch", this.dispatch.bind(this));
      if (module.log === undefined) {
        module.log = this.#log.child({ name: module.name });
      }
      this.#servers.push(module);
      this.#log.info("Registered server '%s'", name);
    } else if (typeof module === "function") {
      this.#middlewareLogs.push(this.#log.child({ name }));
      this.#middlewares.push(module);
      this.#log.info("Registered middleware '%s'", name);
    } else {
      throw new TypeError(`Ineffective application module '${name}'.
  Middleware must be a function, servers must provide a method 'listen' and a method 'on' to register an event callback.`);
    }
    return this;
  }

  /**
   * Dispatch the context to all middlewares.
   *
   * This asynchronous method is used internally to trigger handling the
   * "dispatch" events from registered servers. It decouples the servers' event
   * loop from message handling. The method resolves after the last middleware
   * finished, but a server could send responses earlier, by registering the
   * `on("write")` event on the response.
   *
   * The application creates a context from request and response and passes it
   * to each middleware. The application will handle all uncaught errors.
   *
   * The order of middleware execution is the order of registration.
   *
   * @param {IRequest} req
   * @param {IResponse} res
   */
  async dispatch(req, res) {
    const data = Object.assign(Object.create(this.#data || {}), this.#data);
    const log = this.#log;
    const context = { req, res, data, log };
    try {
      let current = 0;
      const next = async () => {
        while (current < this.#middlewares.length) {
          try {
            const log = this.#middlewareLogs[current];
            await this.#middlewares[current++]({ ...context, log, next });
          } catch (err) {
            this.#handleError(err, context);
          }
        }
      };
      await next();
      if (res.isWritable) {
        res.end();
      }
    } catch (err) {
      this.#handleError(err, context);
    }
  }

  /**
   * The default error handling will simply log the error.
   *
   * You can modify this behavior by registering a callback to the "error"
   * event. If you rethrow an error, this will end the dispatch loop and be
   * handed back to your error handler. If you rethrow it again, it will crash
   * the application.
   *
   * A typical scenario would be to wrap the error in another error to
   * interrupt dispatching this message and log the original error:
   *
   * ```js
   * .on("error", (err, { log }) => {
   *   if (err.message !== "STOP_DISPATCHING") {
   *     log.error(err);
   *     throw new Error("STOP_DISPATCHING");
   *   }
   * })
   * ```
   *
   * @param {unknown} err
   * @param {Omit<Context<D>, "next">} context
   */
  #handleError(err, context) {
    /** @param {unknown} err */
    function uncaught(err) {
      context.log.error("Uncaught", err);
    }
    if (err instanceof Error) {
      if (this.listenerCount("error") === 0) {
        uncaught(err);
      } else {
        this.emit("error", err, context);
      }
    } else {
      uncaught(err);
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
