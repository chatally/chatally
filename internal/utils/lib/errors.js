export class DocumentedError extends Error {
  /**
   *
   * @param {{message: string, href: string}} params
   */
  constructor({ message, href }) {
    super(generateMessage(message, href));
  }
}

const baseUrl = "https://chatally.org/docs/errors";

/**
 * @param {string} message
 * @param {string} href
 */
function generateMessage(message, href) {
  return `
${message}

For details see ${baseUrl}${href}
  `.trim();
}
