import type { GraphApi } from "./graph-api.d.ts";

/**
 * WhatsApp Media endpoint
 */
export declare class Media {
  constructor(config: MediaConfig);

  /**
   * Upload media through a POST call to /PHONE_NUMBER_ID/media.
   *
   * All media files sent through this endpoint are encrypted and persist for
   * 30 days, unless they are deleted earlier.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#upload-media
   *
   * @param file path to the local media file
   * @returns The media id that can be used to reference the uploaded media in
   *    messages
   */
  upload(file: string): Promise<string>;

  /**
   * Download a media asset to the downloadDir.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#download-media
   *
   * @param id The media id
   * @returns The downloaded file's path
   */
  download(id: string): Promise<string>;
}

export interface MediaConfig {
  /**
   * Facebook Graph API configuration
   */
  graphApi: GraphApi;

  /**
   * [Optional] Path to a directory where to store downloaded media assets
   * [default="media"]
   */
  downloadDir?: string;

  /**
   * [Optional] Path to the database to store media ids and their corresponding
   * paths.
   * [default="media.db"]
   */
  dbPath?: string;
}
