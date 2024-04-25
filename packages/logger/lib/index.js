import { BaseLogger } from "./base-logger.js";
import { levels } from "./levels.js";

export { BaseLogger } from "./base-logger.js";

/** @type {import("./types.d.ts").getLogger} */
export function getLogger(options) {
  // @ts-ignore
  return new BaseLogger(options);
}

/** @type {import("./types.d.ts").getLogger} */
export function getNoLogger(options) {
  // @ts-ignore
  return new NoLogger();
}

function NoLogger() {
  this.level = "silent";
  this.child = function () {
    return this;
  };
}
levels.forEach((level) => {
  NoLogger.prototype[level] = noop;
});
function noop() {}
