import { nanoid } from 'nanoid'
import { GraphApi } from './graph-api.js'

export class GraphApiMock extends GraphApi {
  /** @type {Array<{url: string, req: import('./graph-api.d.ts').GraphApiRequest, res: import('./graph-api.d.ts').GraphApiResponse}>} */
  requests = []

  /**
   *
   * @param {import('./graph-api.js').GraphApiConfig} config
   */
  constructor(config) {
    super(config)
    this._request = _request(this)
  }
}

const downloadUrl = 'https://download.here'

/**
 * @param {GraphApiMock} $
 */
function _request($) {
  /**
   * @type {import('./graph-api.d.ts').RequestFn}
   */
  return async (url, req) => {
    let res
    if (req.method === 'POST' && isMessageEndpoint(url)) {
      const id = messageEndpoint(req)
      res = {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: {
          text: () => '',
          json: () => id,
          arrayBuffer: () => new ArrayBuffer(0),
        },
      }
    } else if (req.method === 'POST' && isUpload(url)) {
      const mediaId = upload(req)
      res = {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: {
          text: () => '',
          json: () => mediaId,
          arrayBuffer: () => new ArrayBuffer(0),
        },
      }
    } else if (req.method === 'GET' && isMediaQuery(url)) {
      const downloadUrl = mediaQuery(url)
      if (downloadUrl) {
        res = {
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          body: {
            text: () => '',
            json: () => downloadUrl,
            arrayBuffer: () => new ArrayBuffer(0),
          },
        }
      } else {
        res = {
          statusCode: 404,
          headers: { 'content-type': 'application/json' },
          body: {
            text: () => '',
            json: () => ({
              error: { error_user_msg: `Media asset ${url} not found` },
            }),
            arrayBuffer: () => new ArrayBuffer(0),
          },
        }
      }
    } else if (req.method === 'GET' && isDownload(url)) {
      const { type, file } = download(url)
      if (file) {
        const buffer = await file.arrayBuffer()
        res = {
          statusCode: 200,
          headers: { 'content-type': type },
          body: {
            text: () => '',
            json: () => ({}),
            arrayBuffer: () => buffer,
          },
        }
      } else {
        res = {
          statusCode: 404,
          headers: { 'content-type': 'application/json' },
          body: {
            text: () => '',
            json: () => ({
              error: { error_user_msg: `Media asset ${url} not found` },
            }),
            arrayBuffer: () => new ArrayBuffer(0),
          },
        }
      }
    } else {
      throw new Error(`Unhandled URL ${url}`)
    }
    const request = { url, req, res }
    $.log?.debug(request)
    $.requests.push(request)
    return res
  }
}

/** @param {string} url */
function isMessageEndpoint(url) {
  return url.endsWith('/messages')
}

/** @param {string} url */
function isUpload(url) {
  return url.endsWith('/media')
}

/** @param {string} url */
function isMediaQuery(url) {
  return !url.startsWith(downloadUrl)
}

/** @param {string} url */
function isDownload(url) {
  return url.startsWith(downloadUrl)
}

/** @param {import('./graph-api.js').GraphApiRequest} req */
function messageEndpoint(req) {
  const json = JSON.parse((req.body || '').toString())
  if (json.status === 'read') {
    return { success: true }
  }
  return { messages: [{ id: `WAMID-${nanoid()}` }] }
}

/** @type {Record<string, string | FormData | undefined>} */
const uploads = {}

/** @param {import('./graph-api.js').GraphApiRequest} req */
function upload(req) {
  const id = `MEDIA-${nanoid()}`
  uploads[id] = req.body
  return { id }
}

/** @param {string} url */
function mediaQuery(url) {
  const id = url.split('/').pop() || ''
  if (uploads[id]) {
    return { url: `${downloadUrl}/${id}` }
  }
  return undefined
}

/**
 * @param {string} url
 * @returns {{type: string, file: File | undefined}}
 *    The type and binary of the downloaded asset
 */
function download(url) {
  const id = url.split('/').pop() || ''
  const found = uploads[id]
  if (!found) {
    return { type: 'NOT_FOUND', file: undefined }
  } else if (typeof found === 'string') {
    return { type: found, file: undefined }
  } else {
    const type = /** @type {string} */ (found.get('type') || '*')
    const file = /** @type {File} */ (found.get('file') || undefined)
    return { type, file }
  }
}
