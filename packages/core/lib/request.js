/**
 * Create a request from the message(s)
 *
 * @typedef {import("./types.d.ts").IncomingMessage} IncomingMessage
 * @param {IncomingMessage | IncomingMessage[]} messages
 * @returns {import("./types.d.ts").Request}
 */
export function createRequest(messages) {
  if (!Array.isArray(messages)) {
    messages = [messages];
  }
  return { messages };
}
