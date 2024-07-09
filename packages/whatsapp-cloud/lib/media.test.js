import { nanoid } from 'nanoid'
// eslint-disable-next-line import/order
import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { GraphApi } from './graph-api.js'
import { Media } from './media.js'

const downloadUrl = 'https://download.here'

function newMedia() {
  /** @type {Array<{url: string, req: import('./graph-api.d.ts').GraphApiRequest, res: import('./graph-api.d.ts').GraphApiResponse}>} */
  const requests = []
  const graphApi = new GraphApi({
    phoneNumberId: '1234',
    accessToken: 'ABCD',
    _request: async (url, req) => {
      const reqKind = url.startsWith(downloadUrl)
        ? 'download'
        : req.method === 'POST'
          ? 'upload'
          : 'mediaQuery'
      const contentType
        = reqKind === 'download'
          ? 'image/jpeg'
          : 'text/javascript; charset=UTF-8'
      const result
        = reqKind === 'upload'
          ? { id: '12345678' }
          : reqKind === 'mediaQuery'
            ? { url: `${downloadUrl}/12345678` }
            : undefined
      const text = () => JSON.stringify(result)
      const json = () => ({})
      const arrayBuffer
        = reqKind === 'download'
          ? () => readFileSync('./testing/image.jpg').buffer
          : () => new ArrayBuffer(0)
      const res = {
        statusCode: 200,
        headers: { 'content-type': contentType },
        body: { text, json, arrayBuffer },
      }
      requests.push({ url, req, res })
      return res
    },
  })
  const downloadDir = `./testing/media-${nanoid()}`
  mkdirSync(downloadDir)
  const media = new Media({
    graphApi,
    downloadDir,
    dbPath: `${downloadDir}/ids.db`,
  })
  function cleanup() {
    rmSync(downloadDir, { recursive: true, force: true })
  }
  return { media, requests, cleanup }
}

const original = './testing/image.jpg'

describe('media', async () => {
  it('uploads media', async () => {
    const { media, cleanup } = newMedia()
    try {
      const id = await media.upload(original)
      expect(id).toEqual('12345678')
    } finally {
      cleanup()
    }
  })
})
