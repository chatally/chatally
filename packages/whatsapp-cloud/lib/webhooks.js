import express, { raw } from "express";
import crypto from "node:crypto";
import { EventEmitter } from "node:events";
import { HttpError } from "./errors.js";

/**
 * @typedef WebhooksConfig
 * @property {import("@chatally/logger").Logger} [log]
 *    [Optional] Logger to use instead of console
 *    [`default=undefined`]
 * @property {number} [port=3000]
 *    [Optional] Port to listen on
 *    [`default=3000`]
 * @property {string|undefined} [verifyToken]
 *    [Optional] token to verify webhooks registration, if not provided
 *    webhooks cannot be registered with WhatsApp business account
 *    [`default=undefined`]
 * @property {string} [secret]
 *    [Optional] secret to verify payload signatures, if not provided thet
 *    payload is not verified
 *    [`default=undefined`]
 * @property {string} [assetsDir]
 *    [Optional] directory to static assets to be served at assetsPath
 *    [`default=undefined`]
 * @property {string} [assetsPath]
 *    [Optional] path to access static assets, has no effect if assetsDir is not
 *    set
 *    [`default="/assets"`]
 */

/**
 * @typedef Notification
 * @property {import("./webhooks-types.d.ts").IncomingMessage[]} messages
 * @property {import("./webhooks-types.d.ts").Status[]} statuses
 * @property {import("./webhooks-types.d.ts").Error[]} errors
 */

/**
 * @typedef {object} Events
 * @property {Notification[]} notification
 * @extends {EventEmitter<Events>}
 */
export class Webhooks extends EventEmitter {
  /** @type {number} */
  #port;

  /**
   * @protected
   * Access to the underlying express server for testing purposes or in derived
   * classes
   */
  _server;
  /**
   * Create a WhatsApp Webhooks server.
   *
   * The server implements EventEmitter, you can register the event
   * `notification`, it gives you notification with incoming messages,
   * statuses, and errors.
   *
   * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks
   *
   * @param {WebhooksConfig} [config]
   */
  constructor(config = {}) {
    super();
    const { port, verifyToken, secret, log, assetsDir, assetsPath } = config;
    this.#port = port || 3000;
    this._server = express() //
      .set("query parser", "simple")
      // in order to verify the signature, we need the JSON body as raw text
      .use(raw({ type: "*/*" }))
      .get("/", register(verifyToken))
      .post("/", (req, res, next) => {
        try {
          verifySignature(req, secret);
          const notification = parse(req);
          this.emit("notification", notification);
          res.send("OK");
        } catch (err) {
          next(err);
        }
      })
      .use(errorHandler(log));

    if (assetsDir) {
      this._server.use(assetsPath || "/assets", express.static(assetsDir));
    }
  }

  /**
   * Start the server
   * @param {number} [port] Optional port to listen on [`default=this.port=3000`]
   */
  listen(port) {
    this._server.listen(port || this.#port);
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
 * @param {string} [verifyToken]
 */
function register(verifyToken) {
  return function (
    /** @type {import("express").Request} */ req,
    /** @type {import("express").Response} */ res
  ) {
    const hubMode = req.query["hub.mode"] || "";
    if (hubMode === "subscribe") {
      const hubVerifyToken = req.query["hub.verify_token"] || "";
      const hubChallenge = req.query["hub.challenge"] || "";
      if (!verifyToken || hubVerifyToken === verifyToken) {
        res.send(hubChallenge);
      } else {
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
    } else {
      res.send("OK");
    }
  };
}

/**
 * Verify the signature of the payload with the shared secret
 *
 * @param {import("express").Request} req
 * @param {string|undefined} [secret]
 */
function verifySignature(req, secret) {
  if (!secret) return;

  const xHubSignature = req.headers["x-hub-signature-256"];
  if (!xHubSignature) {
    throw new HttpError(401, "Missing header 'x-hub-signature-256'.");
  }
  if (typeof xHubSignature !== "string") {
    throw new HttpError(401, "Invalid 'x-hub-signature-256'.");
  }
  const signature = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex");
  if (signature !== xHubSignature) {
    throw new HttpError(401, "Invalid 'x-hub-signature-256'.", signature);
  }
}

/**
 * Parse the payload
 * @param {import("express").Request} req
 * @returns {Notification}
 */
function parse(req) {
  const body = req.body;
  if (!(body instanceof Buffer)) {
    throw new HttpError(400, "No data received");
  }
  /** @type {import("./webhooks-types.d.ts").Notification} */
  const notification = JSON.parse(body.toString());
  const changes = notification.entry?.flatMap((entry) => entry.changes || []);
  const values = changes.map((change) => change.value);
  return {
    messages: values.flatMap((v) => v.messages || []),
    statuses: values.flatMap((v) => v.statuses || []),
    errors: values.flatMap((v) => v.errors || []),
  };
}

/** @param {import("@chatally/logger").Logger} [log] */
function errorHandler(log) {
  /**
   * @param {unknown} err
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  function handler(err, req, res, next) {
    log?.error(err);
    if (err instanceof HttpError) {
      res.status(err.status).send(err.message);
    } else {
      next(err);
    }
  }
  return handler;
}
