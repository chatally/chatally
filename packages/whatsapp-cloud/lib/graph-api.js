import { GraphApiError } from "./errors.js";
/**
 * We CANNOT use `node.fetch`, because it is not correctly detected by the
 * Facebook Graph API as client (probably due to a wrong Host header, which
 * cannot be overridden programmatically), when downloading binary data from
 * the Media endpoint.
 */
import undici from "undici";

/**
 * @typedef GraphApiConfig
 * @property {string} phoneNumberId
 *    Sender id, i.e. the phone number id of the WhatsApp business account
 * @property {string} accessToken
 *    Access token to use as authorization bearer
 * @property {string} [baseUrl]
 *    [Optional] Base URL for Meta GraphAPI
 *
 *    [default="graph.facebook.com"]
 * @property {number} [basePort]
 *    [Optional] Port at which to reach Meta GraphAPI
 *
 *    [default=undefined]
 * @property {number} [version]
 *    [Optional] Version of the Meta GraphAPI
 *
 *    [default=20]
 * @property {import("@chatally/logger").Logger} [log]
 *    [Optional] Logger to use
 *
 *    [default=undefined]
 * @property {RequestFn} [_request]
 *    [Optional] Allows to override the internal HTTP request for testing
 *
 *    [default=undici.request]
 */

/**
 * @typedef {(url: string, init: RequestInit) => Promise<ResponseData>} RequestFn
 */

/**
 * @typedef RequestInit
 * @property {"GET" | "POST" | "DELETE"} [method]
 * @property {string | FormData} [body]
 * @property {Record<string, string | string[] | undefined>} [headers]
 */

/**
 * @typedef ResponseData
 * @property {number} statusCode
 * @property {Record<string, string | string[] | undefined>} headers
 * @property {Body} body
 */

/**
 * @typedef Body
 * @property {() => string | Promise<string>} text
 * @property {() => unknown | Promise<unknown>} json
 * @property {() => ArrayBuffer | Promise<ArrayBuffer>} arrayBuffer
 */

const endpoints = [
  "business_compliance_info",
  "media",
  "messages",
  "register",
  "request_code",
  "whatsapp_business_profile",
];

export class GraphApi {
  #url;
  #phoneNumberId;
  #accessToken;

  /**
   * @protected
   * Override the internal fetch method for testing.
   *
   * @type {(url: string, init: RequestInit) => Promise<ResponseData>}
   */
  _fetch;

  /**
   * @param {GraphApiConfig} config
   */
  constructor(config) {
    const {
      basePort,
      baseUrl = "graph.facebook.com",
      version = 20,
      phoneNumberId,
      accessToken,
      _request: _fetch = undici.request,
    } = config;

    const host = basePort
      ? `http://${baseUrl}:${basePort}`
      : `https://${baseUrl}`;
    this.#url = `${host}/v${version}.0`;

    if (!phoneNumberId) {
      throw new Error(
        "No phoneNumberId provided for Graph API. Provide your WhatsApp business account phone number id in the configuration."
      );
    }
    this.#phoneNumberId = phoneNumberId;

    if (!accessToken) {
      throw new Error(
        "No accessToken provided for Graph API. Provide your WhatsApp business account access token in the configuration."
      );
    }
    this.#accessToken = accessToken;

    this._fetch = _fetch;
  }

  /**
   * @param {string|FormData|Record<string,unknown>} body
   * @param {string} endpoint
   */
  async post(body, endpoint) {
    const headers = this.#headers();
    if (typeof body === "string") {
      headers["Content-Type"] = "text/plain";
    } else if (body instanceof FormData) {
      // We explicitly do NOT set headers["Content-Type"]
      body.append("messaging_product", "whatsapp");
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({
        messaging_product: "whatsapp",
        ...body,
      });
    }
    return await this.#fetch({ method: "POST", headers, body }, endpoint);
  }

  /**
   * @param {string} endpoint
   * @param {Record<string, string>} [headers]
   */
  async get(endpoint, headers) {
    return await this.#fetch(
      { method: "GET", headers: this.#headers(headers) },
      endpoint
    );
  }

  /**
   * @param {string} endpoint
   * @param {Record<string, string>} [headers]
   */
  async delete(endpoint, headers) {
    return await this.#fetch(
      { method: "DELETE", headers: this.#headers(headers) },
      endpoint
    );
  }

  /**
   * @typedef Result
   * @property {string} contentType
   * @property {string | undefined} [text]
   * @property {Record<string, unknown> | undefined} [json]
   * @property {ArrayBuffer | undefined} [buffer]
   *
   * @param {RequestInit} request
   * @param {string} endpoint
   * @returns {Promise<Result>}
   */
  async #fetch(request, endpoint) {
    if (!endpoint || endpoint.length === 0) {
      throw new Error("Invalid Graph API fetch: endpoint may not be void.");
    }
    const segments = endpoint.startsWith("http")
      ? [endpoint]
      : endpoints.includes(endpoint)
        ? [this.#url, this.#phoneNumberId, endpoint, ""]
        : [this.#url, endpoint, ""];
    const url = segments.join("/");
    const response = await this._fetch(url, request);

    if (response.statusCode !== 200) {
      /** @type {any} */
      const { error } = await response.body.json();
      throw new GraphApiError(error);
    }
    const contentType =
      /** @type {string} */ (response.headers["content-type"]) || "unknown";

    /** @type {Result} */
    const result = {
      contentType,
      text: undefined,
      json: undefined,
      buffer: undefined,
    };
    if (contentType.startsWith("application/json")) {
      /** @type {any} */
      const json = await response.body.json();
      if (json.error) {
        throw new GraphApiError(json.error);
      }
      result.json = json;
    } else if (contentType.startsWith("text/javascript")) {
      const text = await response.body.text();
      try {
        /** @type {any} */
        const json = JSON.parse(text);
        if (json.error) {
          throw new GraphApiError(json.error);
        }
        result.json = json;
      } catch (e) {
        result.text = text;
      }
    } else if (contentType.startsWith("text/")) {
      result.text = await response.body.text();
    } else {
      result.buffer = await response.body.arrayBuffer();
    }
    return result;
  }

  /**
   * @param {Record<string, string>} [headers]
   * @returns {Record<string, string>}
   */
  #headers(headers = {}) {
    return {
      Authorization: `Bearer ${this.#accessToken}`,
      "Cache-Control": "no-cache",
      "User-Agent": "GraphApiSdk/1.0.0",
      ...headers,
    };
  }
}
