/**
 * @param {unknown} object
 * @returns {object is Logger}
 *    True if the given object implements the Logger interface
 */
export function isLogger(object) {
  if (!object) return false

  const logger = /** @type {import('./index.d.ts').Logger} */ (object)
  if (!logger.level) return false
  if (typeof logger.isLevel !== 'function') return false
  if (typeof logger.child !== 'function') return false
  if (typeof logger.trace !== 'function') return false
  if (typeof logger.debug !== 'function') return false
  if (typeof logger.info !== 'function') return false
  if (typeof logger.warn !== 'function') return false
  if (typeof logger.error !== 'function') return false
  return true
}
