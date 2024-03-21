/** Copyright (c) Christian Fuss */

import { DryRunError, GraphApiError } from "./errors.ts";
import { Body, GraphApiRequest } from "./graph_api.types.ts";
import { getLogger } from "./logger.ts";
import { HTTP, RUNTIME_VERSION } from "./runtime.ts";
import { SemanticVersion } from "./types.ts";

export const SDK_VERSION = SemanticVersion.fromString("0.0.6-Alpha");
export const USER_AGENT = `WA_SDK/${SDK_VERSION} (${RUNTIME_VERSION})`;

const log = getLogger("GraphApi");

export interface GraphApiConfig {
  /** Your WhatsApp Phone Number ID (sender). */
  id: string;
  /** System user access token. */
  accessToken: string;
  /** Base URL to send all SDK requests to, default 'graph.facebook.com' */
  baseUrl?: string;
  /** Port on the base URL, default <undefined> */
  basePort?: number;
  /** Version of the API to use, default v17.0 */
  version?: string;
  /** Do not send any requests to the API, default false. */
  dryRun?: boolean;
}

/**
 * Client for the common parts of the Facebook Graph API.
 *
 * See https://developers.facebook.com/docs/graph-api
 */
export class GraphApi {
  readonly #id: string;
  readonly #accessToken?: string;
  readonly #baseUrl: string;
  readonly #basePort?: number;
  readonly #version: string;
  readonly #dryRun?: boolean;

  constructor(config: Readonly<GraphApiConfig>) {
    this.#accessToken = config.accessToken;
    this.#id = config.id || "";
    this.#baseUrl = config.baseUrl || "graph.facebook.com";
    this.#basePort = config.basePort;
    this.#version = config.version || "v17.0";
    this.#dryRun = config.dryRun;
    if (this.#dryRun) {
      log.info("Dry-run mode enabled.");
    } else {
      if (!this.#id) {
        throw new Error(`Missing ID.
  Provide a valid ID via the 'id' configuration or the 'GRAPH_API_ID' environment variable.`);
      }
      if (!this.#accessToken) {
        throw new Error(`Missing access token.
  Provide a valid access token via the 'accessToken' configuration or the 'GRAPH_API_ACCESS_TOKEN' environment variable.`);
      }
    }
  }

  get id(): string {
    return this.#id;
  }

  async request<R>(
    { endpoint, method = "GET", body, id }: GraphApiRequest,
  ): Promise<R> {
    const url = this.#getUrl(id || this.#id, endpoint);
    const request = this.#getRequest(method, body);

    const msg = this.#dryRun
      ? `Dry-run: Request was not sent to ${url}.`
      : "Sending request...";
    log.debug(msg, { url, request });
    if (this.#dryRun) {
      throw new DryRunError(msg, url, request);
    }

    // ======> Here is the actual fetch request <======
    const response = await HTTP.fetch(url, request);

    if (response.status !== 200) {
      const body = await response.json();
      throw new GraphApiError(body.error);
    }
    if (response.headers.get("Content-Type")?.startsWith("application/json")) {
      const body = await response.json();
      if (body.error) {
        throw new GraphApiError(body.error);
      }
      return body as R;
    }
    return (await response.text()) as R;
  }

  #getUrl(id: string, endpoint?: string): string {
    const protocol = this.#basePort ? "http:/" : "https:/";
    const port = this.#basePort ? `:${this.#basePort}` : "";
    const path: string[] = [];
    path.push(protocol);
    path.push(this.#baseUrl + port);
    path.push(this.#version);
    path.push(id);
    endpoint && path.push(endpoint);
    return path.join("/");
  }

  #getRequest(method: string, body?: Body): RequestInit {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.#accessToken}`,
      "User-Agent": USER_AGENT,
    };

    let bodyInit: BodyInit | undefined;
    if (typeof body === "string") {
      headers["Content-Type"] = "text/plain";
      bodyInit = body;
    } else if (body instanceof FormData) {
      // We explicitly do not set headers["Content-Type"]
      bodyInit = body;
    } else {
      headers["Content-Type"] = "application/json";
      bodyInit = JSON.stringify(body);
    }

    return { method, headers, body: bodyInit };
  }
}
