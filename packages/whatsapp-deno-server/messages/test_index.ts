import { WhatsApp } from "../mod.ts";
import { createInteractiveButton } from "./interactive.ts";

/**
 * Test some messages against the real API manually.
 *
 * Make sure you have a .env file with the following variables:
 * - GRAPH_API_ID
 * - GRAPH_API_ACCESS_TOKEN
 */

const { messages } = new WhatsApp();

const interactive = createInteractiveButton({
  body: "Body",
  buttons: [
    { id: "id-3", title: "With Markdown" },
  ],
});

const response = await messages.sendInteractive("4917623975929", interactive);
console.log(response);
