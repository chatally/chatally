import { dirname } from "https://deno.land/std@0.185.0/path/win32.ts";
import { getLogger } from "../logger.ts";
import { createInteractiveButton } from "../messages/interactive.ts";
import { TextMessage } from "../messages/text.ts";
import { Message } from "../messages/types.ts";
import { FS } from "../runtime.ts";
import { WA_DATA_DIR } from "../sample/config.ts";
import {
  ITU_LANGUAGE_BY_DOMAIN,
  ITUDomain,
  ITULanguage,
  parseITUDomain,
} from "../utils/itu.ts";
import { IncomingMessage } from "../webhooks.types.ts";
import { GDPR_TEXT, GdprText } from "./gdprConsent.text.ts";

const log = getLogger("gdprConsent");

const GDPR_CONSENT_LOG = (from: string) =>
  `WhatsApp conversation with +${from}

[${new Date().toISOString()}]
GDPR consent given`;

const cache = new Set<string>();

export async function gdprConsent(
  message: IncomingMessage,
): Promise<true | Message> {
  const { from } = message;
  const filename = `${WA_DATA_DIR}/log/c-${from}.log`;

  if (cache.has(from)) {
    log.debug(`GDPR consent by ${from} is cached.`);
    return true;
  } else if (await FS.exists(filename)) {
    log.debug(`GDPR consent by ${from} exists.`);
    cache.add(from);
    return true;
  } else {
    const regionCode = parseITUDomain(from);
    const gdprText = getGdprText(regionCode);
    if (
      getMessageReplyId(message) === "/gdpr_consent" ||
      isMessageText(message, ...gdprText.agree)
    ) {
      log.debug(`New GDPR consent by ${from}.`);
      await FS.ensureDir(dirname(filename));
      await FS.writeText(filename, GDPR_CONSENT_LOG(from));
      cache.add(from);
      // Modify the message to start a new session after GDPR consent
      message.type = "text";
      // deno-lint-ignore no-explicit-any
      delete (message as any).interactive;
      (message as TextMessage).text = { body: "/start_session" };
      return { type: "text", text: { body: gdprText.thanks } };
    } else {
      log.debug(`Asking for GDPR consent from ${from}.`);
      const interactive = createInteractiveButton({
        body: gdprText.body,
        buttons: [{ title: gdprText.button, id: "/gdpr_consent" }],
      });
      return { type: "interactive", interactive };
    }
  }
}

function getMessageReplyId(message: IncomingMessage) {
  if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    return message.interactive.button_reply.id;
  }
  return undefined;
}

function isMessageText(message: IncomingMessage, ...texts: string[]) {
  if (message.type === "text") {
    return texts.includes(message.text.body?.toLowerCase());
  }
}

function getGdprText(regionCode: ITUDomain | undefined): GdprText {
  if (regionCode) {
    try {
      const language: ITULanguage = ITU_LANGUAGE_BY_DOMAIN[regionCode];
      return GDPR_TEXT[language] || GDPR_TEXT.EN;
    } catch (_) {
      // ignore
    }
  }
  log.error(`GDPR text for ${regionCode} not found.`);
  return GDPR_TEXT.EN;
}
