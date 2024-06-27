/**
 * We CANNOT use `node.fetch`, because it is not correctly detected by the
 * Facebook Graph API as client, when downloading binary data from
 * the Media endpoint.
 *
 * This is probably due to a wrong Host header, which cannot be overridden
 * programmatically.
 */
import undici from "undici";
import { BaseError } from "./errors.js";

const endpoints = [
  "business_compliance_info",
  "media",
  "messages",
  "register",
  "request_code",
  "whatsapp_business_profile",
];

export class GraphApi {
  /** @type {import("@chatally/logger").Logger | undefined} */
  log;
  #url;
  #phoneNumberId;
  #accessToken;

  /**
   * @protected
   * @type {import("./graph-api.d.ts").RequestFn}
   */
  _request;

  /** @param {import("./graph-api.d.ts").GraphApiConfig} config */
  constructor(config) {
    const {
      basePort,
      baseUrl = "graph.facebook.com",
      version = 20,
      phoneNumberId,
      accessToken,
      log,
      _request = undici.request,
    } = config;
    this.log = log;

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

    this._request = _request;
  }

  /**
   * @param {string} endpoint
   * @param {string|FormData|Record<string,unknown>} body
   * @param {Record<string, string>} [headers]
   */
  async post(endpoint, body, headers) {
    headers = this.#headers(headers);
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
    return await this.#request({ method: "POST", headers, body }, endpoint);
  }

  /**
   * @param {string} endpoint
   * @param {Record<string, string>} [headers]
   */
  async get(endpoint, headers) {
    headers = this.#headers(headers);
    return await this.#request({ method: "GET", headers }, endpoint);
  }

  /**
   * @param {string} endpoint
   * @param {Record<string, string>} [headers]
   */
  async delete(endpoint, headers) {
    headers = this.#headers(headers);
    return await this.#request({ method: "DELETE", headers }, endpoint);
  }

  /**
   * @param {import("./graph-api.d.ts").GraphApiRequest} request
   * @param {string} endpoint
   * @returns {Promise<import("./graph-api.d.ts").GraphApiResult>}
   */
  async #request(request, endpoint) {
    if (!endpoint || endpoint.length === 0) {
      throw new Error("Invalid Graph API fetch: endpoint may not be void.");
    }
    const segments = endpoint.startsWith("http")
      ? [endpoint]
      : endpoints.includes(endpoint)
        ? [this.#url, this.#phoneNumberId, endpoint, ""]
        : [this.#url, endpoint, ""];
    const url = segments.join("/");
    this.log?.trace("Request", { url, request });
    const response = await this._request(url, request);

    if (response.statusCode !== 200) {
      /** @type {any} */
      const { error } = await response.body.json();
      throw new GraphApiError(error);
    }
    const contentType =
      /** @type {string} */ (response.headers["content-type"]) || "unknown";

    /** @type {import("./graph-api.d.ts").GraphApiResult} */
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
    this.log?.trace("Response", result);
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

export class GraphApiError extends BaseError {
  /** @param {import("./graph-api.js").GraphApiErrorInit} init */
  constructor(init) {
    super(init.error_user_msg);
    Object.assign(this, init);
  }
}
