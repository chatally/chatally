const docsUrl = "https://chatally.org/docs/errors";

export class DocumentedError extends Error {
  /**
   *
   * @param {string} message
   * @param {string} href
   */
  constructor(message, href) {
    super(generateMessage(message, href));
  }
}

/**
 * @param {string} message
 * @param {string} href
 */
function generateMessage(message, href) {
  return `
${message}

For details see ${docsUrl}${href}
  `.trim();
}

export class XError extends Error {
  /**
   *
   * @param {string} message
   * @param {Object} [x]
   */
  constructor(message, x) {
    super(message);
    if (x) {
      Object.assign(this, x);
    }
  }
}
