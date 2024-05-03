import { BaseLogger } from "./base-logger.js";
import { NoLogger } from "./no-logger.js";

/**
 * @typedef {import("./base-logger.js").LoggerOptions} LoggerOptions
 */

/**
 * @param {LoggerOptions | "nologger"} options
 */
export function getLogger(options) {
  if (typeof options === "string") {
    if (options === "nologger") {
      return new NoLogger();
    }
    return new BaseLogger({ name: options });
  }
  return new BaseLogger(options);
}
