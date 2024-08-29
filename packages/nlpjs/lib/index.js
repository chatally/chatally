import { existsSync } from 'node:fs'
import { content } from '@chatally/utils'
import { dockStart } from '@nlpjs/basic'

/**
 * @param {import('@chatally/logger').Logger
 *    | import('@nlpjs/basic').Configuration | string[]} [logger]
 * @param {import('@nlpjs/basic').Configuration | string[]} [configuration]
 * @returns {Promise<import('@nlpjs/basic').Nlp>}
 *    A trained nlp.js module
 */
export async function trainNlp(logger, configuration) {
  if (!isLogger(logger)) {
    if (configuration) {
      throw new Error(
        'Parameter \'logger\' does not implement the ChatAlly Logger interface',
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
          corpora: configuration,
        },
      },
    }
  }
  if (!configuration && !existsSync('./conf.json')) {
    configuration = {
      use: ['Basic'],
      settings: {
        nlp: {
          corpora: ['./corpus.json'],
        },
      },
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
      fatal: (/** @type {string} */ msg) => log.error(`[FATAL] ${msg}`),
    })
  }
  const nlp = dock.get('nlp')
  await nlp.train()
  return nlp
}

/**
 * @param {any} obj
 * @returns {obj is import('@chatally/logger').Logger}
 *    True if the object is a logger
 */
function isLogger(obj) {
  return !!obj && obj.level && typeof obj.child === 'function'
}

/**
 * Create a ChatAlly middleware function for an nlp.js NLP module
 *
 * It will write the answer to the response only, if it is above the configured
 * threshold. It will not end the response.
 *
 * @param {import('@nlpjs/basic').Nlp} nlp The trained NLP module
 * @param {import('./index.d.ts').Options} [options] Options
 * @returns {import('@chatally/core').Middleware<{}>}
 *    The trained nlp.js module wrapped in a ChatAlly middleware
 */
export function nlpjsMiddleware(nlp, options) {
  const {
    name = 'nlp.js',
    end = false,
    threshold = 0.8,
    onlyEmptyResponse = false,
  } = options || {}
  const write = end //
    // @ts-expect-error No typing required
    ? (res, msg) => res.end(msg)
    // @ts-expect-error No typing required
    : (res, msg) => res.write(msg)

  const obj = {
    /** @type {import('@chatally/core').Middleware<unknown>} */
    [name]: async ({ req, res, data }) => {
      if (!res.isWritable || (onlyEmptyResponse && res.messages.length > 0)) {
        return
      }
      const result = await nlp.process('en', content(req))
      data[name] = result
      if (result.answer && result.score >= threshold) {
        write(res, result.answer)
      }
    },
  }
  return obj[name]
}
