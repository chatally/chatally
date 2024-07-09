import { fileURLToPath } from 'node:url'
import { basename } from 'node:path'

/** @param {string} url */
export function fileURLtoFileName(url) {
  try {
    const filename = fileURLToPath(url)
    return basename(filename)
  } catch (err) {
    return basename(url || '')
  }
}
