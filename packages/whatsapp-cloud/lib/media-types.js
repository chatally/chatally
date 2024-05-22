const KB = 1024;
const MB = 1024 * 1024;

/**
 * @typedef MediaTypeDesc
 * @property {string} description
 * @property {string} suffix
 * @property {number} maxSize
 *
 * @typedef {"application/msword" |
 *   "application/pdf" |
 *   "application/vnd.ms-excel" |
 *   "application/vnd.ms-powerpoint" |
 *   "application/vnd.openxmlformats-officedocument.presentationml.presentation" |
 *   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" |
 *   "application/vnd.openxmlformats-officedocument.wordprocessingml.document" |
 *   "audio/aac" |
 *   "audio/amr" |
 *   "audio/mp4" |
 *   "audio/mpeg" |
 *   "audio/ogg" |
 *   "image/jpeg" |
 *   "image/png" |
 *   "image/webp.animated" |
 *   "image/webp" |
 *   "text/plain" |
 *   "video/3gp" |
 *   "video/mp4"
 * } MediaType
 */

/**
 * @type {Record<MediaType, MediaTypeDesc>}
 */
const mediaTypes = {
  "audio/aac": {
    description: "AAC",
    suffix: "aac",
    maxSize: 16 * MB,
  },
  "audio/amr": {
    description: "AMR",
    suffix: "amr",
    maxSize: 16 * MB,
  },
  "audio/mpeg": {
    description: "MP3",
    suffix: "mp3",
    maxSize: 16 * MB,
  },
  "audio/mp4": {
    description: "MP4 Audio",
    suffix: "m4a",
    maxSize: 16 * MB,
  },
  "audio/ogg": {
    description: "OGG Audio",
    suffix: "ogg",
    maxSize: 16 * MB,
  },
  "text/plain": {
    description: "Text",
    suffix: "txt",
    maxSize: 100 * MB,
  },
  "application/vnd.ms-excel": {
    description: "Microsoft Excel",
    suffix: "xls",
    maxSize: 100 * MB,
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    description: "Microsoft Excel",
    suffix: "xlsx",
    maxSize: 100 * MB,
  },
  "application/msword": {
    description: "Microsoft Word",
    suffix: "doc",
    maxSize: 100 * MB,
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    description: "Microsoft Word",
    suffix: "docx",
    maxSize: 100 * MB,
  },
  "application/vnd.ms-powerpoint": {
    description: "Microsoft PowerPoint",
    suffix: "ppt",
    maxSize: 100 * MB,
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    description: "Microsoft PowerPoint",
    suffix: "pptx",
    maxSize: 100 * MB,
  },
  "application/pdf": {
    description: "PDF",
    suffix: "pdf",
    maxSize: 100 * MB,
  },
  "image/jpeg": {
    description: "JPEG",
    suffix: "jpeg",
    maxSize: 5 * MB,
  },
  "image/png": {
    description: "PNG",
    suffix: "png",
    maxSize: 5 * MB,
  },
  "image/webp.animated": {
    description: "Animated sticker",
    suffix: "webp",
    maxSize: 500 * KB,
  },
  "image/webp": {
    description: "Static sticker",
    suffix: "webp",
    maxSize: 100 * KB,
  },
  "video/3gp": {
    description: "3GPP",
    suffix: "3gp",
    maxSize: 16 * MB,
  },
  "video/mp4": {
    description: "MP4 Video",
    suffix: "mp4",
    maxSize: 16 * MB,
  },
};

/**
 * @param {string|null} mediaType
 * @returns {string}
 */
export function getSuffixFromMediaType(mediaType) {
  // @ts-ignore
  return mediaTypes[mediaType]?.suffix || "unknown";
}

/**
 * @param {MediaType} mediaType
 * @returns {number}
 */
export function getMaxSizeFromMediaType(mediaType) {
  return mediaTypes[mediaType]?.maxSize || 100 * KB;
}

/** @type {Record<string, MediaType>} */
const mediaTypeFromSuffix = {
  "3gp": "video/3gp",
  aac: "audio/aac",
  amr: "audio/amr",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  ogg: "audio/ogg",
  pdf: "application/pdf",
  png: "image/png",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  webp: "image/webp",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

/**
 * @param {string} filePath
 * @returns {MediaType}
 */
export function getMediaTypeFromSuffix(filePath) {
  const suffix = filePath.split(".").pop() || filePath;
  const mimeType = mediaTypeFromSuffix[suffix];
  if (!mimeType) {
    throw new Error(`Unknown file type: ${suffix}`);
  }
  return mimeType;
}
