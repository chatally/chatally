import { dockStart } from '@nlpjs/basic'
import { existsSync } from 'node:fs'

/**
 * @param {import("@chatally/logger").Logger
 *    | import("@nlpjs/basic").Configuration | string[]} [logger]
 * @param {import("@nlpjs/basic").Configuration | string[]} [configuration]
 * @returns {Promise<import("@nlpjs/basic").Nlp>}
 */
export async function trainNlp (logger, configuration) {
  if (!isLogger(logger)) {
    if (configuration) {
      throw new Error(
        "Parameter 'logger' does not implement the ChatAlly Logger interface"
      )
    }
    configuration = logger
    logger = undefined
  }
  if (Array.isArray(configuration)) {
    configuration = {
      use: ['Basic'],
      settings: {
        nlp: {
          corpora: configuration
        }
      }
    }
  }
  if (!configuration && !existsSync('./conf.json')) {
    configuration = {
      use: ['Basic'],
      settings: {
        nlp: {
          corpora: ['./corpus.json']
        }
      }
    }
  }
  const dock = await dockStart(configuration)

  const log = logger
  if (log) {
    dock.getContainer().register('logger', {
      trace: (/** @type {string} */ msg) => log.trace(msg),
      debug: (/** @type {string} */ msg) => log.debug(msg),
      info: (/** @type {string} */ msg) => log.info(msg),
      log: (/** @type {string} */ msg) => log.info(msg),
      warn: (/** @type {string} */ msg) => log.warn(msg),
      error: (/** @type {string} */ msg) => log.error(msg),
      fatal: (/** @type {string} */ msg) => log.error(`[FATAL] ${msg}`)
    })
  }
  const nlp = dock.get('nlp')
  await nlp.train()
  return nlp
}

/**
 * @param {any} obj
 * @returns {obj is import("@chatally/logger").Logger}
 */
function isLogger (obj) {
  return !!obj && obj.level && typeof obj.child === 'function'
}

/**
 * Create a ChatAlly middleware function for an nlp.js NLP module
 *
 * It will write the answer to the response only, if it is above the configured
 * threshold. It will not end the response.
 *
 * @param {import("@nlpjs/basic").Nlp} nlp The trained NLP module
 * @param {Object} [options] Options
 * @param {string} [options.name="nlp.js"] Optional name for the middleware
 *   function. Default is 'nlp.js'. NOTE: Result data from the NLP process will
 *   be put into the context under this name.
 * @param {boolean} [options.end] Indicates, whether an answer above the
 *   threshold should end the response
 * @returns {import("@chatally/core").Middleware<{}>}
 */
export function nlpjsMiddleware (nlp, options) {
  const { name = 'nlp.js', end = false } = options || {}
  const write = end //
    // @ts-expect-error No typing required
    ? (res, msg) => res.end(msg)
    // @ts-expect-error No typing required
    : (res, msg) => res.write(msg)

  const obj = {
    /** @type {import("@chatally/core").Middleware<unknown>} */
    [name]: async function ({ req, res, data }) {
      if (!res.isWritable) return
      const result = await nlp.process('en', req.text)
      data[name] = result
      if (result.answer) {
        write(res, result.answer)
      }
    }
  }
  return obj[name]
}
