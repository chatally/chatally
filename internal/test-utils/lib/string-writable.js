import { Writable } from 'node:stream'
import { StringDecoder } from 'node:string_decoder'

export class StringWritable extends Writable {
  data = ''
  /**
   * @param {import('node:stream').WritableOptions} [options]
   */
  constructor(options) {
    super(options)
    this._decoder = new StringDecoder(options?.defaultEncoding)
  }

  /**
   * @param {Buffer} chunk
   * @param {string} encoding
   * @param {() => void} callback
   */
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      this.data += this._decoder.write(chunk)
    } else {
      this.data += chunk.toString()
    }
    callback()
  }

  /**
   * @param {() => void} callback
   */
  _final(callback) {
    this.data += this._decoder.end()
    callback()
  }
}
