/**
 * @param {import("./types.js").MessageContent} msg
 * @returns {string}
 */
export function getMessageText(msg) {
  switch (msg.type) {
    case "text":
      return msg.text;
    case "image":
      return msg.image.caption || "<image>";
  }
}
