import { getMimeType } from './mime-type.js'
import { normalizeUrl } from './normalize-url.js'

/**
 * Helper to get a valid MIME type
 * @param {string} url
 * @param {string} type
 * @returns {{mimeType: string, url: string}} mimeType and normalized URL
 */
function normalize(url, type) {
  const mimeType = getMimeType(url) || `${type}/*`
  if (!mimeType.startsWith(`${type}/`)) {
    throw new Error(`Incompatible MIME type '${mimeType}' for ${type} message.`)
  }
  url = normalizeUrl(url)
  return { mimeType, url }
}

/**
 * @param {string} mediaUrl
 * @param {string} [caption]
 * @param {string} [description]
 * @returns {import("@chatally/core").Image} A Image chat message
 */
export function image(mediaUrl, caption, description) {
  const type = 'image'
  const { mimeType, url } = normalize(mediaUrl, type)
  return { type, mimeType, url, caption, description }
}

/**
 * @param {string} mediaUrl
 * @param {string} [caption]
 * @param {string} [transcript]
 * @returns {import("@chatally/core").Audio} A Audio chat message
 */
export function audio(mediaUrl, caption, transcript) {
  const type = 'audio'
  const { mimeType, url } = normalize(mediaUrl, type)
  return { type, mimeType, url, caption, transcript }
}

/**
 * @param {string} mediaUrl
 * @param {string} [caption]
 * @param {string} [transcript]
 * @returns {import("@chatally/core").Video} A Video chat message
 */
export function video(mediaUrl, caption, transcript) {
  const type = 'video'
  const { mimeType, url } = normalize(mediaUrl, type)
  return { type, mimeType, url, caption, transcript }
}

/**
 * @param {string} mediaUrl
 * @param {string} [caption]
 * @param {string} [description]
 * @param {string} [filename]
 * @returns {import("@chatally/core").Document} A Image chat message
 */
export function document(mediaUrl, caption, description, filename) {
  const type = 'document'
  const { mimeType, url } = normalize(mediaUrl, type)
  return { type, mimeType, url, caption, description, filename }
}
