import Database from "better-sqlite3";
import fs from "node:fs/promises";
import { MediaError } from "./errors.js";
import {
  getMaxSizeFromMediaType,
  getMediaTypeFromSuffix,
  getSuffixFromMediaType,
} from "./media-types.js";

/**
 * @typedef MediaConfig
 * @property {import("./graph-api.js").GraphApi} graphApi
 *    Facebook Graph API configuration
 * @property {string} [downloadDir="media"]
 *    [Optional] Path to a directory where to store downloaded media assets
 *    [default="media"]
 * @property {string} [dbPath="media.db"]
 *    [Optional] Path to the database to store media ids and their
 *    corresponding paths.
 *    [default="media.db"]
 */

export class Media {
  /** @type {import("./index.d.ts").GraphApi} */
  #graphApi;
  /** @type {string} */
  #downloadDir;
  /** @type {import("better-sqlite3").Statement<string, {id: string}>} */
  #selectId;
  /** @type {import("better-sqlite3").Statement<string, {file: string}>} */
  #selectFile;
  /** @type {import("better-sqlite3").Statement<[string, string]>} */
  #insertId;
  /** @type {import("better-sqlite3").Statement<string>} */
  #deleteId;

  /**
   * @param {MediaConfig} config
   */
  constructor(config) {
    const { graphApi, downloadDir = "media", dbPath = "media.db" } = config;
    this.#graphApi = graphApi;
    this.#downloadDir = downloadDir;
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.exec(`
CREATE TABLE IF NOT EXISTS ids (
  'rowid' integer PRIMARY KEY AUTOINCREMENT,
  'id' varchar,
  'file' varchar
);
CREATE INDEX IF NOT EXISTS file_by_id ON ids(id);
CREATE INDEX IF NOT EXISTS id_by_file ON ids(file);
    `);
    this.#selectId = db.prepare("SELECT id FROM ids WHERE file = ?");
    this.#selectFile = db.prepare("SELECT file FROM ids WHERE id = ?");
    this.#insertId = db.prepare("INSERT INTO ids (id, file) VALUES (?, ?)");
    this.#deleteId = db.prepare("DELETE FROM ids WHERE id = ?");
  }

  /**
   * Upload media through a POST call to /PHONE_NUMBER_ID/media.
   *
   * All media files sent through this endpoint are encrypted and persist for
   * 30 days, unless they are deleted earlier.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#upload-media
   *
   * @param {string} file
   * @returns {Promise<string>}
   */
  async upload(file) {
    // Check, if we already have a valid id for this file
    const id = this.#selectId.get(file)?.id;
    if (id) {
      try {
        await this.#getUrl(id);
        return id;
      } catch (e) {
        this.#deleteId.run(id);
      }
    }
    try {
      // Create a blob that we can upload
      const { size } = await fs.stat(file);
      const mediaType = getMediaTypeFromSuffix(file);
      const maxSize = getMaxSizeFromMediaType(mediaType);
      if (size > maxSize) {
        throw new MediaError(
          `[Media] upload: File size exceeds limit of ${maxSize} bytes for content type '${mediaType}'`
        );
      }
      const buffer = await fs.readFile(file);
      const blob = new Blob([buffer], { type: mediaType });
      // Upload as multipart formdata
      const body = new FormData();
      body.append("type", mediaType);
      body.append("file", blob, file.split("/").pop() || file);
      const response = await this.#graphApi.post("media", body);
      const id = /** @type {string | undefined} */ (response.json?.id);
      if (!id) {
        throw new MediaError(`[Media] upload failed, unexpected response:
  ${JSON.stringify(response)}`);
      }
      this.#insertId.run(id, file);
      return id;
    } catch (e) {
      throw new MediaError(`Media upload failed for file '${file}':
  ${e}`);
    }
  }

  /**
   * @param {string} id
   * @returns {Promise<{url: string, mime_type: string}>}
   */
  async #getUrl(id) {
    const response = await this.#graphApi.get(id);
    const url = /** @type {string | undefined} */ (response.json?.url);
    if (!url || typeof url !== "string") {
      throw new MediaError(`[Media] Could not get URL for media id ${id}:
  Unexpected response ${JSON.stringify(response)}`);
    }
    return /** @type {{url: string, mime_type: string}} */ (response.json);
  }

  /**
   * Download a media asset to the downloadDir.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#download-media
   *
   * @param {string} id
   * @returns {Promise<string>} The downloaded file's path
   */
  async download(id) {
    let file = this.#selectFile.get(id)?.file;
    if (file) {
      try {
        await fs.stat(file);
        return file;
      } catch (e) {
        this.#deleteId.run(id);
      }
    }

    const { url } = await this.#getUrl(id);
    const response = await this.#graphApi.get(url);
    const buffer = response.buffer;
    if (!buffer) {
      const start = response.text?.indexOf("<h2") || 0;
      throw new Error(`Failed to download media with id '${id}': 
  ${response.text?.slice(start, start + 1000)}`);
    }
    const suffix = getSuffixFromMediaType(response.contentType);
    try {
      await fs.stat(this.#downloadDir);
    } catch (e) {
      fs.mkdir(this.#downloadDir);
    }
    file = `${this.#downloadDir}/${id}.${suffix}`;
    await fs.writeFile(file, Buffer.from(buffer));

    this.#insertId.run(id, file);
    // TODO: Implement quota for download directory
    return file;
  }

  /**
   * @param {string} id
   */
  async delete(id) {
    const response = await this.#graphApi.delete(id);
    const success = /** @type {boolean | undefined} */ response.json?.success;

    if (!success) {
      throw new MediaError(`[Media] delete media '${id}' failed:
  ${JSON.stringify(response)}`);
    }
    this.#deleteId.run(id);
    return success;
  }
}
