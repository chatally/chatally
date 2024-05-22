/**
 * @param {import("./messages.js").Message} msg
 * @returns {string}
 */
export function text(msg) {
  switch (msg.type) {
    case "text":
      return msg.text;
    case "image":
      return msg.image.caption || "<image>";
    case "audio":
      return msg.audio.transcript || "<audio>";
  }
}
