import type { Logger } from '@chatally/logger'

export interface IMediaServer {
  /**
   * Load a media asset and provide it's raw data as Buffer
   *
   * @param media Media meta-data that contains a URL.
   * @returns The raw data
   */
  load: (media: { url: string }) => Promise<Buffer>
}

export declare class MediaServer implements IMediaServer {
  constructor(options?: MediaOptions)
  load: (media: { url: string }) => Promise<Buffer>
  addServer(d: Download): void
}

export interface Download {
  canDownload: (url: string) => boolean
  download: (url: string) => Promise<Buffer>
}

export interface MediaOptions {
  log?: Logger
  cache?: false
  dir?: string
  ttl?: number
  ttl2?: number
}
