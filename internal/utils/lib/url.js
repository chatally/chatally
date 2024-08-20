import { basename } from 'node:path'
import { fileURLToPath } from 'node:url'

/** @param {string} url */
export function fileURLtoFileName(url) {
  try {
    const filename = fileURLToPath(url)
    return basename(filename)
  } catch (_e) {
    return basename(url || '')
  }
}
