import { assert } from "https://deno.land/x/oak@v12.4.0/util.ts";
import { InteractiveMessage } from "../messages/interactive.ts";
import { IncomingMessage } from "../webhooks.types.ts";
import { gdprConsent } from "./gdprConsent.ts";

Deno.test(
  "gdprConsent: returns English text for German number",
  async () => {
    const input = newIncomingMessage({ from: "49152123456789" });
    const actual = await gdprConsent(input) as InteractiveMessage;
    assert(actual.interactive.body!.text.startsWith("Sorry to bother you."));
  },
);

Deno.test(
  "gdprConsent: returns French text for Mali number",
  async () => {
    const input = newIncomingMessage({ from: "22357123456789" });
    const actual = await gdprConsent(input) as InteractiveMessage;
    assert(
      actual.interactive.body!.text.startsWith("Désolé de vous déranger."),
    );
  },
);

function newIncomingMessage(
  partial: Partial<IncomingMessage>,
): IncomingMessage {
  return {
    id: "WAMID-0",
    timestamp: "2023-01-01T00:00:00.000Z",
    type: "text",
    text: { body: "test" },
    from: "",
    errors: [],
    ...partial,
  } as IncomingMessage;
}
