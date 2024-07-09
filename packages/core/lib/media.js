import fss from 'node:fs'
import fs from 'node:fs/promises'
import { NoLogger } from '@chatally/logger'
import { nanoid } from 'nanoid'
import NodeCache from 'node-cache'

const __cwd = new URL(`file://${process.cwd()}/`)

export class MediaServer {
  /** @type {import('@chatally/logger').Logger} */
  #log

  /** @type {string} */
  #dir

  /** @type {NodeCache | undefined} */
  #cache

  /** @type {number} */
  #ttl = 0

  /** @type {number} */
  #ttl2 = 0

  /** @type {import('./media.d.ts').Download[]} */
  #servers = []

  /**
   * @param {import('./media.d.ts').MediaOptions} [config]
   */
  constructor(config = {}) {
    this.#log = config.log || new NoLogger()
    this.#dir = config.dir || 'media-cache'
    fss.mkdirSync(this.#dir, { recursive: true })

    if (config.cache === false || (config.ttl === 0 && config.ttl2 === 0)) {
      this.#cache = undefined
    } else {
      this.#ttl = config.ttl ?? 0
      this.#ttl2 = config.ttl2 ?? 0
      this.#cache = new NodeCache({
        stdTTL: this.#ttl,
        checkperiod: this.#ttl * 1.2,
        useClones: false,
        deleteOnExpire: false,
      })
      this.#cache?.on('expired', async (key, value) => {
        if (value instanceof Buffer) {
          if (this.#ttl2 > 0) {
            const oldFile = this.#cache?.get(`---${key}`)
            if (oldFile) {
              this.#cache?.set(key, oldFile, this.#ttl2)
              this.#cache?.del(`---${key}`)
            } else {
              // Move buffer to second-level cache (file-system)
              const file = new URL(`${this.#dir}/${nanoid()}`, __cwd)
              try {
                await fs.writeFile(file, value)
                this.#cache?.set(key, file.toString(), this.#ttl2)
              } catch (e) {
                this.#log.error(e)
              }
            }
          } else {
            // Second-level cache deactivated
            this.#cache?.del(key)
          }
        } else {
          // Second-level cache expired
          this.#cache?.del(key)
          try {
            await fs.unlink(value)
          } catch (e) {
            this.#log.error(e)
          }
        }
      })
    }

    // Self-register for 'file:' protocol
    this.#servers.push(this)
  }

  /**
   *
   * @param {import('./media.d.ts').Download} server
   */
  addServer(server) {
    this.#servers.push(server)
  }

  /**
   * @param {string} url
   * @returns {boolean} True if this is a file URL
   */
  canDownload(url) {
    return url.startsWith('file:')
  }

  /**
   * @param {string} url
   * @returns {Promise<Buffer>} The raw data from the file
   */
  async download(url) {
    if (!this.canDownload(url)) {
      throw new Error(`Cannot read ${url.toString()}, only 'file:' protocol is supported by default.`)
    }
    return await fs.readFile(url)
  }

  /**
   * @param {import("./chat-message.d.ts").Media} media
   * @returns {Promise<Buffer>} The raw data
   */
  async load(media) {
    const key = media.url
    const cached = this.#cache?.get(key)
    if (cached instanceof Buffer) {
      // Refresh ttl
      this.#cache?.ttl(key, this.#ttl)
      // Refresh potential ttl2
      this.#cache?.ttl(`---${key}`, this.#ttl2)
      return cached
    } else if (typeof cached === 'string') {
      const value = await fs.readFile(cached)
      if (this.#ttl > 0) {
        // Move to first-level cache
        this.#cache?.set(key, value, this.#ttl)
        // Keep second cache entry for file
        this.#cache?.set(`---${key}`, cached, this.#ttl2)
      } else {
        // Refresh ttl2
        this.#cache?.ttl(key, this.#ttl2)
      }
      return value
    }

    const server = this.#servers.find(s => s.canDownload(key))
    if (!server) {
      throw new Error(`No server registered, which could download ${key}`)
    }
    const value = await server.download(key)
    if (this.#ttl) {
      this.#cache?.set(key, value, this.#ttl)
    } else if (this.#ttl2) {
      const file = new URL(`${this.#dir}/${nanoid()}`, __cwd)
      await fs.writeFile(file, value)
      this.#cache?.set(key, file.toString(), this.#ttl2)
    }
    return value
  }
}
