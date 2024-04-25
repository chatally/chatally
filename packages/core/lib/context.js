import { only } from "@internal/utils";
import { STATUS_CODES } from "node:http";
import util from "node:util";

/**
 * @typedef {import("./types.d.ts").Context} IContext
 * @typedef {import("./types.d.ts").Request} Request
 * @typedef {import("./types.d.ts").Response} Response
 */

/**
 * @template C
 * @param {import("./types.d.ts").Request} req
 * @param {import("./types.d.ts").Response} res
 * @param {C} [context = {}]
 * @returns {Context & C}
 */
export function createContext(req, res, context) {
  // @ts-ignore
  return new Context(req, res, context);
}

/**
 * @implements {IContext}
 */
export class Context {
  /** @type Request */
  req;
  /** @type Response */
  res;

  /**
   * @param {import("./types.d.ts").Request} req
   * @param {import("./types.d.ts").Response} res
   * @param {unknown} context
   */
  constructor(req, res, context) {
    this.req = req;
    this.res = res;
    if (context) {
      Object.assign(this, context);
    }
  }

  /**
   * @param {string} msg
   * @param {import("./types.d.ts").ContextErrorOptions=} opt
   */
  throw(msg, opt = {}) {
    // @ts-ignore
    throw new ContextError(msg, this, opt);
  }

  /**
   * Conditionally throw an error
   * @param {boolean} condition
   * @param {string} msg
   * @param {import("./types.d.ts").ContextErrorOptions=} options
   */
  assert(condition, msg, options = {}) {
    if (!condition) {
      this.throw(msg, options);
    }
  }

  /**
   *
   * @param {unknown} err
   */
  handleError(err) {
    if (err instanceof ContextError) {
      let statusCode;
      // ENOENT support
      if (err.code === "ENOENT") {
        statusCode = 404;
      } else {
        statusCode = Number(err.statusCode);
      }
      if (typeof statusCode !== "number" || !STATUS_CODES[statusCode]) {
        statusCode = 500;
      }
      err.statusCode = statusCode;
      this.res.error = err;
      if (err.expose) {
        this.res.write(err.message || STATUS_CODES[statusCode] || "ERROR");
      }
    } else {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "unknown";
      this.res.error = new ContextError(msg, this);
    }
    this.res.end();
  }

  /**
   * util.inspect() implementation, which
   * just returns the JSON output.
   *
   * @returns {Object}
   */
  [util.inspect.custom]() {
    return {
      req: only(this.req, ["messages"]),
      res: only(this.res, ["messages", "error"]),
    };
  }
}

/**
 * Error with context information
 * @template [C = {}]
 */
class ContextError extends Error {
  /**
   * @param {string} msg
   * @param {import("./types.d.ts").Ctx<C>} ctx
   * @param {import("./types.d.ts").ContextErrorOptions=} options
   */
  constructor(msg, ctx, options = {}) {
    super(msg);
    this.ctx = ctx;
    this.expose = options.expose || false;
    this.statusCode = options.statusCode;
    this.code = options.code;
  }

  [util.inspect.custom]() {
    return only(this, ["msg", "expose, statusCode, code"]);
  }
}
