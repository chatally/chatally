import type { Audio, Document, Image, Video } from '@chatally/core'

/**
 * Create an Image chat message.
 *
 * @param url
 *    An URL or path referencing the media asset. For paths (without protocol),
 *    'file://' is prepended. Relative paths are resolved against the current
 *    working directory (`process.cwd()`).
 * @param caption
 *    [Optional] caption for the media asset
 * @param description
 *    [Optional] description for the image asset
 * @returns An Image chat message
 */
export declare function image(url: string, caption?: string, description?: string): Image

/**
 * Create an Audio chat message.
 *
 * @param url
 *    An URL or path referencing the media asset. For paths (without protocol),
 *    'file://' is prepended. Relative paths are resolved against the current
 *    working directory (`process.cwd()`).
 * @param caption
 *    [Optional] caption for the media asset
 * @param transcript
 *    [Optional] transcript for the audio asset
 * @returns An Audio chat message
 */
export declare function audio(url: string, caption?: string, transcript?: string): Audio

/**
 * Create a Video chat message.
 *
 * @param url
 *    An URL or path referencing the media asset. For paths (without protocol),
 *    'file://' is prepended. Relative paths are resolved against the current
 *    working directory (`process.cwd()`).
 * @param caption
 *    [Optional] caption for the media asset
 * @param transcript
 *    [Optional] transcript for the video asset
 * @returns A Video chat message
 */
export declare function video(url: string, caption?: string, transcript?: string): Video

/**
 * Create a Document chat message.
 *
 * @param url
 *    An URL or path referencing the media asset. For paths (without protocol),
 *    'file://' is prepended. Relative paths are resolved against the current
 *    working directory (`process.cwd()`).
 * @param caption
 *    [Optional] caption for the media asset
 * @param description
 *    [Optional] description for the document asset
 * @param filename
 *    [Optional] original filename of the asset
 * @returns An Audio chat message
 */
export declare function document(url: string, caption?: string, description?: string, filename?: string): Document
