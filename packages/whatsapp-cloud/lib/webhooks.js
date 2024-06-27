import express, { raw } from "express";
import crypto from "node:crypto";
import { EventEmitter } from "node:events";
import { HttpError } from "./errors.js";

export class Webhooks extends EventEmitter {
  /** @type {string} */ #path;
  /** @type {number} */ #port;
  /** @type {string | undefined} */ #verifyToken;
  /** @type {string | undefined} */ #secret;
  /** @type {import("@chatally/logger").Logger | undefined} */ log;

  /** @param {import("./webhooks.d.ts").WebhooksConfig} [config] */
  constructor(config = {}) {
    super();
    const { path = "", port = 3000, verifyToken, secret, log } = config;
    this.#path = path;
    this.#port = port;
    this.#verifyToken = verifyToken;
    this.#secret = secret;
    this.log = log;
  }

  /** @param {number} [port] */
  listen(port = this.#port) {
    const url = port
      ? `http://localhost${this.#path}:${port}`
      : `http://localhost${this.#path}`;
    this.log?.info(`Started server at ${url} (GET, POST)`);
    this._app.listen(port);
  }

  /** @protected */
  get _app() {
    return (
      express() //
        .set("query parser", "simple")
        // in order to verify the signature, we need the JSON body as raw text
        .use(raw({ type: "*/*" }))
        .get(this.#path, (req, res) => {
          const challenge = subscribe(req, this.#verifyToken);
          res.send(challenge);
          this.log?.info(
            `Verified new subscription from IP ${req.ip} (challenge=${challenge})`
          );
        })
        .post(this.#path, (req, res, next) => {
          try {
            verifySignature(req, this.#secret);
            const notification = parse(req);
            this.emit("notification", notification);
            res.send("OK");
          } catch (err) {
            next(err);
          }
        })
        .use(
          /** @type {import("express").ErrorRequestHandler} */
          (err, _req, res, next) => {
            this.log?.error(err.message, err.description);
            if (err instanceof HttpError) {
              res.status(err.status).send(err.message);
            } else {
              next(err);
            }
          }
        )
    );
  }
}

/**
 * Register the webhooks server with WhatsApp business.
 *
 * This GET request is sent by Meta, when you verify your webhhoks server in
 * the WhatsApp application settings.
 *
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started/#verification-requests
 *
 * @param {import("express").Request} req,
 * @param {string} [verifyToken]
 */
function subscribe(req, verifyToken) {
  const hubMode = req.query["hub.mode"] || "";
  const hubVerifyToken = req.query["hub.verify_token"] || "";
  const hubChallenge = req.query["hub.challenge"] || "";
  if (
    hubMode === "subscribe" &&
    (!verifyToken || hubVerifyToken === verifyToken)
  ) {
    return hubChallenge;
  }
  throw new HttpError(
    401,
    "Verification failed",
    JSON.stringify({
      hubMode,
      hubChallenge,
      hubVerifyToken,
      expected: verifyToken,
    })
  );
}

/**
 * Verify the signature of the payload with the shared secret
 *
 * @param {import("express").Request} req
 * @param {string|undefined} [secret]
 */
function verifySignature(req, secret) {
  if (!secret) return;

  if (!(req.body instanceof Buffer)) {
    throw new HttpError(400, "No data received.");
  }
  const xHubSignature = req.headers["x-hub-signature-256"];
  if (!xHubSignature) {
    throw new HttpError(400, "Missing header 'x-hub-signature-256'.");
  }
  if (typeof xHubSignature !== "string") {
    throw new HttpError(400, "Invalid 'x-hub-signature-256'.");
  }
  const signature = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex");
  if (signature !== xHubSignature) {
    throw new HttpError(400, "Invalid 'x-hub-signature-256'.", signature);
  }
}

/**
 * Parse the payload
 * @param {import("express").Request} req
 * @returns {import("./webhooks.d.ts").WebhooksNotification}
 */
function parse(req) {
  const body = req.body;
  if (!(body instanceof Buffer)) {
    throw new HttpError(400, "No data received");
  }
  /** @type {import("./webhooks.js").Notification} */
  const notification = JSON.parse(body.toString());
  const changes = notification.entry?.flatMap((entry) => entry.changes || []);
  const values = changes.map((change) => change.value);
  return {
    messages: values.flatMap((v) => v.messages || []),
    statuses: values.flatMap((v) => v.statuses || []),
    errors: values.flatMap((v) => v.errors || []),
  };
}
