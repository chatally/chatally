import fss from 'node:fs'
import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import Database from 'better-sqlite3'
import { BaseError } from './errors.js'
import {
  getMaxSizeFromMediaType,
  getMediaTypeFromSuffix,
} from './media-types.js'

const __cwd = new URL(`file://${process.cwd()}/`)

export class Media {
  /** @type {import('@chatally/logger').Logger | undefined} */
  log
  /** @type {import('./graph-api.d.ts').GraphApi} */
  #graphApi
  /** @type {import('better-sqlite3').Statement<string, {id: string}>} */
  #selectId
  /** @type {import('better-sqlite3').Statement<string, {file: string}>} */
  #selectFile
  /** @type {import('better-sqlite3').Statement<[string, string]>} */
  #insertId
  /** @type {import('better-sqlite3').Statement<string>} */
  #deleteId

  /**
   * @param {import('./media.d.ts').MediaConfig} config
   */
  constructor(config) {
    const {
      graphApi,
      dbPath = 'whatsapp-media-ids.db',
      log,
    } = config
    this.log = log
    this.#graphApi = graphApi
    fss.mkdirSync(dirname(dbPath), { recursive: true })

    try {
      const db = new Database(dbPath)
      db.pragma('journal_mode = WAL')
      db.exec(`
        CREATE TABLE IF NOT EXISTS ids (
        'rowid' integer PRIMARY KEY AUTOINCREMENT,
        'id' varchar,
        'file' varchar
        );
        CREATE INDEX IF NOT EXISTS file_by_id ON ids(id);
        CREATE INDEX IF NOT EXISTS id_by_file ON ids(file);
      `)
      this.#selectFile = db.prepare('SELECT file FROM ids WHERE id = ?')
      this.#selectId = db.prepare('SELECT id FROM ids WHERE file = ?')
      this.#insertId = db.prepare('INSERT INTO ids (id, file) VALUES (?, ?)')
      this.#deleteId = db.prepare('DELETE FROM ids WHERE id = ?')
    } catch (err) {
      throw new Error(`Failed to open media database at '${dbPath}'`)
    }

    this.log?.info(`
  Storing mediaIds in database ${dbPath}
  (${resolve(dbPath)}).`)
  }

  /**
   * @param {string} file
   * @returns {Promise<string>} The media id of the asset on the Meta server
   */
  async upload(file) {
    // Check, if we already have a valid id for this file
    const id = this.#selectId.get(file)?.id
    if (id) {
      try {
        await this.#getUrl(id)
        return id
      } catch (e) {
        this.#deleteId.run(id)
      }
    }
    try {
      const url = new URL(file, __cwd)
      // Create a blob that we can upload
      const { size } = await fs.stat(url)
      const mediaType = getMediaTypeFromSuffix(file)
      const maxSize = getMaxSizeFromMediaType(mediaType)
      if (size > maxSize) {
        throw new MediaError(
          `Upload failed: File size exceeds limit of ${maxSize} bytes for content type '${mediaType}'`,
        )
      }
      const buffer = await fs.readFile(url)
      const blob = new Blob([buffer], { type: mediaType })
      // Upload as multipart formdata
      const body = new FormData()
      body.append('type', mediaType)
      body.append('file', blob, file.split('/').pop() || file)
      const response = await this.#graphApi.post('media', body)
      const id = /** @type {string | undefined} */ (response.json?.id)
      if (!id) {
        throw new MediaError(`Upload failed: Unexpected response
  ${JSON.stringify(response)}`)
      }
      this.#insertId.run(id, file)
      this.log?.trace(`Uploaded '${file}' (${size} bytes) to media id '${id}'`)
      return id
    } catch (e) {
      throw new MediaError(`Upload failed for file '${file}':
  ${e}`)
    }
  }

  /**
   * @param {string} id
   * @returns {Promise<{url: string, mime_type: string}>}
   *    The download URL for the given media id (it is valid for 5 minutes)
   */
  async #getUrl(id) {
    const response = await this.#graphApi.get(id)
    const url = /** @type {string | undefined} */ (response.json?.url)
    if (!url || typeof url !== 'string') {
      throw new MediaError(`[Media] Could not get URL for media id ${id}:
  Unexpected response ${JSON.stringify(response)}`)
    }
    return /** @type {{url: string, mime_type: string}} */ (response.json)
  }

  /**
   * Download a media asset.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#download-media
   *
   * @param {string} id
   * @returns {Promise<Buffer>} The downloaded raw media data
   */
  async download(id) {
    const { url } = await this.#getUrl(id)
    const response = await this.#graphApi.get(url)
    const buffer = response.buffer
    if (!buffer) {
      const start = response.text?.indexOf('<h2') || 0
      throw new Error(`Failed to download media with id '${id}': 
    ${response.text?.slice(start, start + 1000)}`)
    }
    return Buffer.from(buffer)
  }

  /**
   * @param {string} id
   */
  async delete(id) {
    const response = await this.#graphApi.delete(id)
    const success = /** @type {boolean | undefined} */ response.json?.success

    if (!success) {
      throw new MediaError(`[Media] delete media '${id}' failed:
  ${JSON.stringify(response)}`)
    }
    this.#deleteId.run(id)
    return success
  }
}

export class MediaError extends BaseError {
  /** @type {unknown|undefined} */
  info

  /**
   * @param {string | undefined} message
   * @param {undefined} [info]
   */
  constructor(message, info) {
    super(message)
    this.info = info
  }
}
