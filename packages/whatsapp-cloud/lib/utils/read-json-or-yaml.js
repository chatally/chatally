import { readFileSync } from 'node:fs'
import YAML from 'js-yaml'

/**
 * @param {string} path
 */
export function readJsonOrYamlFile(path) {
  try {
    const data = readFileSync(path, 'utf8')
    try {
      if (path.endsWith('.yaml') || path.endsWith('.yml')) {
        try {
          return parseYaml(data)
        } catch (_err) {
          return JSON.parse(data)
        }
      } else {
        try {
          return JSON.parse(data)
        } catch (_err) {
          return parseYaml(data)
        }
      }
    } catch (_err) {
      throw new Error('Failed to parse file as JSON or YAML')
    }
  } catch (fsErr) {
    // @ts-expect-error node:fs always throws Errors
    throw new Error(`Error reading file: ${fsErr.message}`)
  }
}

/**
 * @param {string} data
 */
function parseYaml(data) {
  const object = YAML.load(data)
  if (typeof object !== 'object') {
    throw new TypeError('File does not contain YAML')
  }
  return object
}
