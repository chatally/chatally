import { Application } from "@chatally/core";
import { WhatsAppCloud } from "./lib/index.js";
import { BaseLogger } from "@chatally/logger";

/**
 * If you want to try this example locally, you do not want to send anything to
 * the Meta GraphApi, hence you can mock it with this `_request` function.
 *
 * You can then try your WhatsApp bot with the following cUrl request:
 *
 * ```sh
 * curl --location 'http://localhost:3000/whatsapp' \
 * --header 'x-hub-signature-256: 4816f067216a69dec0dd0b3a476f5e588b4676e8579bbc25c791ab01fbe47c0e' \
 * --header 'Content-Type: application/json' \
 * --data '{"entry": [{"changes": [{"value": {"messages": [{"from": "foo", "type": "text", "text": { "body": "Hello!" }}]}}]}]}'
 * ```
 *
 * @type {import("./lib/graph-api.js").RequestFn}
 */
const _request = async (url, request) => {
  if (request.body?.toString().endsWith('"status": "read"}')) {
    return mockResponse({ success: true });
  } else {
    return mockResponse({ messages: [{ id: "2875634" }] });
  }
};

const whatsapp = new WhatsAppCloud({
  env: false, // do not read configuration from environment variables
  file: false, // do not read configuration from default configuration files
  graphApi: {
    phoneNumberId: "10012345",
    accessToken: "EAAADC___xyz",
    _request,
  },
  webhooks: {
    path: "/whatsapp",
    verifyToken: "verify",
    secret: "secret",
  },
});

const log = new BaseLogger({ name: "MyBot", level: "debug" });

new Application({ log }) //
  .use(whatsapp)
  .use(function echo({ req, res }) {
    if (res.isWritable) {
      res.write(`You said '${req.text}' and I don't know what it means.`);
    }
  })
  .listen();

/**
 * @param {unknown} response
 * @returns {import("./lib/graph-api.js").GraphApiResponse}
 */
function mockResponse(response) {
  let statusCode = 200;
  let body;
  let contentType;
  if (response instanceof Error) {
    statusCode = 400;
    body = {
      arrayBuffer: () => new ArrayBuffer(0),
      json: () => response,
      text: () => "",
    };
    contentType = "application/json";
  } else if (response instanceof ArrayBuffer) {
    body = {
      arrayBuffer: () => response,
      json: () => {},
      text: () => "",
    };
    contentType = "application/binary";
  } else if (typeof response === "string") {
    body = {
      arrayBuffer: () => new ArrayBuffer(0),
      json: () => {},
      text: () => response,
    };
    contentType = "text/plain";
  } else {
    body = {
      arrayBuffer: () => new ArrayBuffer(0),
      json: () => response,
      text: () => "",
    };
    contentType = "application/json";
  }
  return {
    statusCode,
    headers: { "content-type": contentType },
    body,
  };
}
