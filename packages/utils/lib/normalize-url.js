const __cwd = new URL(`file://${process.cwd()}/`)

/**
 * @param {string} input
 * @returns A normalized URL
 */
export function normalizeUrl(input) {
  input = input.trim()
  if (input.startsWith('file://')) {
    input = input.substring(7)
  }
  /** @type {URL} */
  let url
  try {
    url = new URL(input)
  } catch (e) {
    url = new URL(input, __cwd)
  }
  return url.toString()
}
