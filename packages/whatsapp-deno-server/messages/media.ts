/** Copyright (c) Christian Fuss */

/**
 * Media Object
 *
 * See [Get Media ID](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#get-media-id)
 * for information on how to get the ID of your media object. For information
 * about supported media types for Cloud API, see
 * [Supported Media Types](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types).
 *
 * For details see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#media-object
 */
export type Media = UploadedMedia | LinkedMedia;

/**
 * Uploaded media asset.
 */
export interface UploadedMedia {
  /** The media object ID. */
  id: string;
  /** Use id instead for uploaded media. */
  link?: never;
}

/**
 * Linked media asset.
 *
 * See [Media HTTP Caching](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#media-http-caching)
 * if you would like us to cache the media asset for future messages.
 *
 * When we request the media asset from your server you must indicate the
 * media's MIME type by including the Content-Type HTTP header. For example:
 * Content-Type: video/mp4. See Supported Media Types for a list of supported
 * media and their MIME types.
 */
export interface LinkedMedia {
  /** Use link instead for linked media. */
  id?: never;
  /** The protocol and URL of the media to be sent. */
  link: string;
}

/**
 * Audio content.
 *
 * Supported audio formats are:
 *   - audio/aac,
 *   - audio/mp4,
 *   - audio/mpeg,
 *   - audio/amr,
 *   - audio/ogg (only opus codecs, base audio/ogg is not supported).
 * Size limit is 16MB.
 *
 * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types
 */
export type Audio = Media;

export interface AudioMessage {
  type: "audio";
  audio: Audio;
}

/**
 * Document content.
 *
 * Supported document formats are:
 *   - text/plain,
 *   - application/pdf,
 *   - application/vnd.ms-powerpoint,
 *   - application/msword,
 *   - application/vnd.ms-excel,
 *   - application/vnd.openxmlformats-officedocument.wordprocessingml.document,
 *   - application/vnd.openxmlformats-officedocument.presentationml.presentation,
 *   - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.
 *
 * Only PDF documents are supported for media-based message templates.
 * Size limit is 100MB.
 */
export type Document = Media & {
  caption?: string;
  /** Describes the filename for the specific document. */
  filename?: string;
};

export interface DocumentMessage {
  type: "document";
  document: Document;
}

/**
 * Image content.
 *
 * Supported image formats are:
 *  - image/jpeg,
 *  - image/png
 *
 * Size limit is 5MB.
 */
export type Image = Media & {
  caption?: string;
};

export interface ImageMessage {
  type: "image";
  image: Image;
}

/**
 * Sticker content.
 *
 * Supported sticker formats are: image/webp.
 *
 * Size limit for static stickers is 100KB, for animated stickers is 500KB.
 */
export type Sticker = Media;

export interface StickerMessage {
  type: "sticker";
  sticker: Sticker;
}

/**
 * Video content.
 *
 * Supported video formats are:
 *  - video/mp4,
 *  - video/3gp
 *
 * Notes:
 *   - Only H.264 video codec and AAC audio codec is supported.
 *   - Only videos with a single audio stream or no audio stream are supported.
 *
 * Size limit is 16MB.
 */
export type Video = Media & {
  caption?: string;
};

export interface VideoMessage {
  type: "video";
  video: Video;
}
