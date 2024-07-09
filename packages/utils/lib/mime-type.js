/** @type {Record<string, string>} */
const mimeTypes = {
  // Application specific/documents
  '.7z': 'application/x-7z-compressed', // 7-zip archive
  '.abw': 'application/x-abiword', // AbiWord document
  '.arc': 'application/x-freearc', // Archive document (multiple files embedded)
  '.azw': 'application/vnd.amazon.ebook', // Amazon Kindle eBook format
  '.bin': 'application/octet-stream', // Any kind of binary data
  '.bz': 'application/x-bzip', // BZip archive
  '.bz2': 'application/x-bzip2', // BZip2 archive
  '.cda': 'application/x-cdf', // CD audio
  '.csh': 'application/x-csh', // C-Shell script
  '.doc': 'application/msword', // Microsoft Word
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Microsoft Word (OpenXML)
  '.eot': 'application/vnd.ms-fontobject', // MS Embedded OpenType fonts
  '.epub': 'application/epub+zip', // Electronic publication (EPUB)
  '.gz': 'application/gzip', // GZip Compressed Archive
  '.jar': 'application/java-archive', // Java Archive (JAR)
  '.json': 'application/json', // JSON format
  '.jsonld': 'application/ld+json', // JSON-LD format
  '.mpkg': 'application/vnd.apple.installer+xml', // Apple Installer Package
  '.odp': 'application/vnd.oasis.opendocument.presentation', // OpenDocument presentation document
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet', // OpenDocument spreadsheet document
  '.odt': 'application/vnd.oasis.opendocument.text', // OpenDocument text document
  '.ogx': 'application/ogg', // Ogg
  '.pdf': 'application/pdf', // Adobe Portable Document Format (PDF)
  '.php': 'application/x-httpd-php', // Hypertext Preprocessor (Personal Home Page)
  '.ppt': 'application/vnd.ms-powerpoint', // Microsoft PowerPoint
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // Microsoft PowerPoint (OpenXML)
  '.rar': 'application/vnd.rar', // RAR archive
  '.rtf': 'application/rtf', // Rich Text Format (RTF)
  '.sh': 'application/x-sh', // Bourne shell script
  '.tar': 'application/x-tar', // Tape Archive (TAR)
  '.vsd': 'application/vnd.visio', // Microsoft Visio
  '.xhtml': 'application/xhtml+xml', // XHTML
  '.xls': 'application/vnd.ms-excel', // Microsoft Excel
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Microsoft Excel (OpenXML)
  '.xml': 'application/xml is recommended as of RFC 7303 (section 4.1), but text/xml is still used sometimes. You can assign a specific MIME type to a file with .xml extension depending on how its contents are meant to be interpreted. For instance, an Atom feed is application/atom+xml, but application/xml serves as a valid default.', // XML
  '.xul': 'application/vnd.mozilla.xul+xml', // XUL
  '.zip': 'application/zip is the standard, but beware that Windows uploads .zip with MIME type application/x-zip-compressed.', // ZIP archive:

  // Audio
  '.aac': 'audio/aac', // AAC audio
  '.flac': 'audio/flac', // FLAC audio
  '.m4a': 'audio/mp4', // MP4 audio
  '.mid': 'audio/x-midi', // Musical Instrument Digital Interface (MIDI): audio/midi,
  '.midi': 'audio/x-midi', // Musical Instrument Digital Interface (MIDI): audio/midi,
  '.mp3': 'audio/mpeg', // MP3 audio
  '.oga': 'audio/ogg', // Ogg audio
  '.ogg': 'audio/ogg', // Ogg audio
  '.opus': 'audio/ogg', // Opus audio in Ogg container
  '.wav': 'audio/wav', // Waveform Audio Format
  '.weba': 'audio/webm', // WEBM audio
  '.wma': 'audio/x-ms-wma', // WMA audio

  // Fonts
  '.otf': 'font/otf', // OpenType font
  '.ttf': 'font/ttf', // TrueType Font
  '.woff': 'font/woff', // Web Open Font Format (WOFF)
  '.woff2': 'font/woff2', // Web Open Font Format (WOFF)

  // Images
  '.apng': 'image/apng', // Animated Portable Network Graphics (APNG) image
  '.avif': 'image/avif', // AVIF image
  '.bmp': 'image/bmp', // Windows OS/2 Bitmap Graphics
  '.gif': 'image/gif', // Graphics Interchange Format (GIF)
  '.ico': 'image/vnd.microsoft.icon', // Icon format
  '.jpeg': 'image/jpeg', // JPEG images
  '.jpg': 'image/jpeg', // JPEG images
  '.png': 'image/png', // Portable Network Graphics
  '.svg': 'image/svg+xml', // Scalable Vector Graphics (SVG)
  '.tif': 'image/tiff', // Tagged Image File Format (TIFF)
  '.tiff': 'image/tiff', // Tagged Image File Format (TIFF)
  '.webp': 'image/webp', // WEBP image

  // Text
  '.css': 'text/css', // Cascading Style Sheets (CSS)
  '.csv': 'text/csv', // Comma-separated values (CSV)
  '.htm': 'text/html', // HyperText Markup Language (HTML)
  '.html': 'text/html', // HyperText Markup Language (HTML)
  '.ics': 'text/calendar', // iCalendar format
  '.js': 'text/javascript', // JavaScript:  (Specifications: HTML and RFC 9239)
  '.mjs': 'text/javascript', // JavaScript module
  '.txt': 'text/plain', // Text (generally ASCII or ISO 8859-n)

  // Video
  '.3g2': 'video/3gpp2', // 3GPP2 audio/video container, could also be audio/3gpp2
  '.3gp': 'video/3gpp', // 3GPP audio/video container, could also be audio/3gpp
  '.avi': 'video/x-msvideo', // AVI: Audio Video Interleave
  '.flv': 'video/x-flv',
  '.m4v': 'video/x-m4v',
  '.mkv': 'video/x-matroska',
  '.mov': 'video/quicktime',
  '.mp4': 'video/mp4', // MP4 video
  '.mpeg': 'video/mpeg', // MPEG Video
  '.mpg': 'video/mpeg',
  '.ogv': 'video/ogg', // Ogg video
  '.ts': 'video/mp2t', // MPEG transport stream
  '.webm': 'video/webm', // WEBM video
  '.wmv': 'video/x-ms-wmv',
}

/**
 * Function to get MIME type from file extension
 * @param {string} path
 */
export function getMimeType(path) {
  const ext = path.slice(path.lastIndexOf('.')).toLowerCase()
  return mimeTypes[ext] || undefined
}

/** @type {Record<string, string>} */
const suffixes = {}
for (const suffix of Object.keys(mimeTypes)) {
  const mimeType = mimeTypes[suffix]
  suffixes[mimeType] = suffix
}

/**
 * Function to get MIME type from file extension
 * @param {string} mimeType
 */
export function getSuffix(mimeType) {
  return suffixes[mimeType] || undefined
}
