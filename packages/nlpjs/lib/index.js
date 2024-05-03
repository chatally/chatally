import { dockStart } from "@nlpjs/basic";
import { existsSync } from "node:fs";

/**
 * @typedef {import("@chatally/logger").Logger} Logger
 * @typedef {import("@chatally/core").Middleware<{}>} Middleware
 * @typedef {import("@chatally/core").Context<{}>} Context
 * @typedef {import("@nlpjs/basic").Nlp} Nlp
 * @typedef {import("@nlpjs/basic").Plugin} Plugin
 * @typedef {import("@nlpjs/basic").Configuration} Configuration
 */

/**
 * @typedef {Object} Options
 * @property {string[]} [options.corpora] Corpora to train the NLP on
 * @property {Logger} [options.logger] Optional logger to use
 */

/**
 * Create a trained nlp.js NLP (Natural Language Processing) module
 *
 * For better integration you should pass it a logger from your ChatAlly app as
 * first parameter.
 *
 * Otherwise it is best practice to provide your NLP configuration as file
 * 'conf.json' in your current working directory. See https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/03.config
 * for examples.
 *
 * For ease of use you can also provide a configuration object programmatically
 * or an array of strings with path names pointing to your training corpora.
 *
 * @param {Logger | Configuration | string[]} [logger]
 * @param {Configuration | string[]} [configuration]
 * @returns {Promise<Nlp>} The trained NLP module
 */
export async function trainNlp(logger, configuration) {
  if (!isLogger(logger)) {
    if (configuration) {
      throw new Error(
        "Parameter 'logger' does not implement the ChatAlly Logger interface"
      );
    }
    configuration = logger;
    logger = undefined;
  }
  if (Array.isArray(configuration)) {
    configuration = {
      use: ["Basic"],
      settings: {
        nlp: {
          corpora: configuration,
        },
      },
    };
  }
  if (!configuration && !existsSync("./conf.json")) {
    configuration = {
      use: ["Basic"],
      settings: {
        nlp: {
          corpora: ["./corpus.json"],
        },
      },
    };
  }
  const dock = await dockStart(configuration);

  const log = logger;
  if (log) {
    dock.getContainer().register("logger", {
      trace: (/** @type {string} */ msg) => log.debug(`[TRACE] ${msg}`),
      debug: (/** @type {string} */ msg) => log.debug(msg),
      info: (/** @type {string} */ msg) => log.info(msg),
      log: (/** @type {string} */ msg) => log.info(msg),
      warn: (/** @type {string} */ msg) => log.warn(msg),
      error: (/** @type {string} */ msg) => log.error(msg),
      fatal: (/** @type {string} */ msg) => log.error(`[FATAL] ${msg}`),
    });
  }
  const nlp = dock.get("nlp");
  await nlp.train();
  return nlp;
}

/**
 * @param {any} obj
 * @returns {obj is Logger}
 */
function isLogger(obj) {
  return !!obj && obj.level && typeof obj.child === "function";
}

/**
 * Create a ChatAlly middleware function for an nlp.js NLP module
 *
 * It will write the answer to the response only, if it is above the configured
 * threshold. It will not end the response.
 *
 * @param {Nlp} nlp The trained NLP module
 * @param {Object} [options] Options
 * @param {string} [options.name="nlp.js"] Optional name for the middleware
 *   function. Default is 'nlp.js'. NOTE: Result data from the NLP process will
 *   be put into the context under this name.
 * @param {boolean} [options.end] Indicates, whether an answer above the
 *   threshold should end the response
 * @returns {Middleware}
 */
export function nlpjsMiddleware(nlp, options) {
  const { name = "nlp.js", end = false } = options || {};
  const write = end //
    ? // @ts-ignore
      (res, msg) => res.end(msg)
    : // @ts-ignore
      (res, msg) => res.write(msg);

  const obj = {
    [name]: async function (/** @type {Context} */ { req, res, data }) {
      if (!res.isWritable) return;
      const result = await nlp.process("en", req.text);
      data[name] = result;
      if (result.answer) {
        write(res, result.answer);
      }
    },
  };
  return obj[name];
}
