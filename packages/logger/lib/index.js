import { NoLogger } from './no-logger.js'

export { BaseLogger } from './base-logger.js'
export { getLogger } from './get-logger.js'
export { isLogger } from './is-logger.js'
export { getLevel, getLevelIndex } from './levels.js'
export { NoLogger } from './no-logger.js'

export const noLogger = new NoLogger()
