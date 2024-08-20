// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { getLogger, type Logger } from '@chatally/logger';
import type Long from 'long';
import EventEmitter from 'node:events';
import { Timer } from 'src/util/Timer';
import * as WS from 'websocket';
import WebSocketClient from "websocket/lib/WebSocketClient";
import { signalservice as Proto } from '../../protos/compiled';
import { strictAssert } from '../util/assert';
import { createTimeout } from '../util/createTimeout';
import { explodePromise } from '../util/promise';
import { MINUTES, SECONDS } from '../util/timeInMilliseconds';
import { HTTPSAgent } from './HTTPSAgent';
import { PendingRequests } from './PendingRequests';

const KEEPALIVE_INTERVAL_MS = 10 * SECONDS;
const MAX_MESSAGE_SIZE = 512 * 1024;

/**
 * WebSocket Resource
 *
 * Create a request-response interface over websockets using the
 * [WebSocket-Resources sub-protocol](https://github.com/signalapp/WebSocket-Resources).
 *
 * const client = new WebSocketResource(socket, function(request) {
 *    request.respond(200, 'OK');
 * });
 *
 * const { response, status } = await client.sendRequest({
 *    verb: 'PUT',
 *    path: '/v1/messages',
 *    headers: ['content-type:application/json'],
 *    body: Buffer.from('{ some: "json" }'),
 * });
 */

interface WSRConnectOptions extends WSConnectOptions, WSROptions { }

interface WSROptions {
  log: Logger;
  name: string;
  handleRequest: WSRRequestHandler;
  keepalive?: string;
};

export type WSRRequestHandler =
  (request: WSRRequest) => void | undefined | string | WSRResponse | Promise<void | undefined | string | WSRResponse>;

interface WSRRequest {
  verb: string;
  path: string;
  body?: Uint8Array;
  headers?: ReadonlyArray<[string, string]>;
}

export interface WSRResponse {
  message: string;
  status: number;
  headers?: ReadonlyArray<[string, string]>;
  body?: Uint8Array;
}

interface WSREvents {
  close: []
}

export class WebSocketResource extends EventEmitter<WSREvents> {
  readonly #log: Logger;
  readonly #connection: WS.connection;
  readonly #handleRequest: WSRRequestHandler;
  readonly #pending = new PendingRequests<WSRResponse>();
  readonly #keepalive?: Timer;
  #closed: false | "closing" | "closed" = false;

  public static async connect(options: WSRConnectOptions) {
    const connection = await wsConnect(options);
    return new WebSocketResource(connection, options);
  }

  private constructor(
    connection: WS.connection,
    { log, name, handleRequest, keepalive }: WSROptions
  ) {
    super();
    this.#log = log || getLogger(name);
    this.#handleRequest = handleRequest;
    this.#connection = connection;
    connection.on('error', (error) => { this.#log.error(error) });
    connection.on('close', (code, reason) => this.#handleClose(code, reason));
    connection.on('message', (message) => this.#handleMessage(message));
    if (keepalive) {
      this.#keepalive = Timer
        .execute(() => {
          this.request({ verb: "GET", path: keepalive });
        })
        .every(30 * SECONDS)
        .timeoutAfter(60 * MINUTES)
        .onTimeout(() => {
          this.close(3001, "Stale connection");
        })
        .start();
    }
  }

  #handleClose(code: number, reason?: string) {
    this.#closed = "closed";
    this.#log.info("Socket closed", { code, reason });
    this.#keepalive?.stop();
    this.#pending.closeOutgoing();
  }

  #handleMessage(wsmessage: WS.Message): void {
    this.#keepalive?.restart();
    strictAssert(
      wsmessage.type === 'binary',
      `Unsupported websocket message type: ${wsmessage.type}`
    );
    strictAssert(
      !!wsmessage.binaryData,
      "Empty websocket message"
    );
    const message = Proto.WebSocketMessage.decode(wsmessage.binaryData);

    if (message.type === Proto.WebSocketMessage.Type.RESPONSE) {
      const response = message.response;
      strictAssert(response.id, 'Response without id');
      this.#log.trace("Incoming response:", response);
      this.#pending.resolveOutgoing(response.id, toWSRResponse(response));
    } else if (message.type === Proto.WebSocketMessage.Type.REQUEST) {
      const request = message.request;
      this.#log.trace("Incoming request:", request);
      const id = request.id;
      const respond = (response: Proto.IWebSocketResponseMessage) => {
        const bytes = Proto.WebSocketMessage.encode({
          type: Proto.WebSocketMessage.Type.RESPONSE,
          response: { id, ...response },
        }).finish();
        strictAssert(
          bytes.length <= MAX_MESSAGE_SIZE,
          'WebSocket response byte size exceeded'
        );
        this.#log.trace("Outgoing response:", response);
        this.#connection.sendBytes(Buffer.from(bytes));
      }

      if (this.#closed) {
        respond({ status: -1, message: "Closing connection" });
      } else {
        (async () => {
          this.#pending.addIncoming(respond);
          const wsrResponse = await this.#handleRequest(toWSRRequest(request));
          this.#pending.removeIncoming(respond);
          respond(toWebSocketResponseMessage(wsrResponse));
        })();
      }
    } else {
      this.#log.trace("Unknown message:", message);
    }
  }

  public request(request: WSRRequest, timeout?: number) {
    strictAssert(
      this.#closed === false,
      'Connection is closed, request is not sent'
    );
    this.#keepalive?.restart();

    const send = (id: Long) => {
      const bytes = Proto.WebSocketMessage.encode({
        type: Proto.WebSocketMessage.Type.REQUEST,
        request: {
          id,
          ...request,
          headers: request.headers?.map((h) => h.join(":")),
        },
      }).finish();
      strictAssert(
        bytes.length <= MAX_MESSAGE_SIZE,
        'Request size too large, send canceled'
      );
      this.#log.trace("Outgoing request:", { id, ...request });
      this.#connection.sendBytes(Buffer.from(bytes));
    }

    if (timeout) {
      const { promise, resolve, onTimeout } =
        createTimeout<WSRResponse>(timeout);
      const id = this.#pending.addOutgoing(resolve);
      onTimeout(
        () => {
          this.#pending.removeOutgoing(id);
          this.close(3001, "Outgoing request timed out");
        }
      )
      send(id);
      return promise;
    } else {
      const { promise, resolve } = explodePromise<WSRResponse>();
      const id = this.#pending.addOutgoing(resolve);
      send(id);
      return promise;
    }
  }

  public close(code = 3000, reason?: string, force = false): void {
    if (this.#closed === "closed") {
      this.#log.info("Connection is already closed");
      return;
    }
    this.#closed = "closing";
    if (!force && !this.#pending.isEmpty) {
      const grace = 30;
      this.#log.info(
        `Pending requests, waiting ${grace} seconds before closing forcefully`
      );
      setTimeout(() => { this.close(code, reason, true) }, grace * SECONDS);
      return;
    }
    this.#log.info(`Closing connection (${code}, ${reason || "unknown"})`);
    this.#pending.closeIncoming();
    this.#connection.closeTimeout = 5 * SECONDS;
    this.#connection.close(code, reason);
  }
}

interface WSConnectOptions {
  log: Logger;
  url: string;
  userAgent: string;
  timeout?: number;
  certificateAuthority?: string;
}

function wsConnect(options: WSConnectOptions): Promise<WS.connection> {
  const {
    log, url, userAgent,
    certificateAuthority: ca,
    timeout = 10 * SECONDS
  } = options;
  const client = new WebSocketClient({
    tlsOptions: { agent: new HTTPSAgent(), ca },
    maxReceivedFrameSize: 0x210000,
  }) as WS.client;
  const { promise, resolve, reject } = createTimeout<WS.connection>(
    timeout, "WebSocket: Connection timed out"
  );
  client //
    .on('connectFailed', cause => {
      reject(new Error('WebSocket: Connection failed', cause));
    })
    .on('connect', connection => {
      connection.socket.setKeepAlive(true, KEEPALIVE_INTERVAL_MS);
      const droppedMessageWarning = (msg: WS.Message) => {
        if (connection.listenerCount("message") <= 1) {
          log.warn("No 'message' listeneres registered. Message will be dropped", msg);
        } else {
          connection.removeListener("message", droppedMessageWarning);
        }
      }
      connection.on("message", droppedMessageWarning)
      resolve(connection);
    })
    .on('httpResponse', async response => {
      reject(new Error(`Invalid HTTP response (${response.statusCode} ${response.statusMessage})`));
    })
    .connect(
      url.replace('https://', 'wss://').replace('http://', 'ws://'),
      undefined, // requestedProtocols
      undefined, // origin
      { 'User-Agent': userAgent }
    );

  return promise;
}

function toWSRResponse(response: Proto.IWebSocketResponseMessage): WSRResponse {
  const { status = 200, message = "OK", body, headers } = response;
  return {
    status, message, body,
    headers: headers.map(header => header.split(':', 2) as [string, string])
  };
}

function toWSRRequest(request: Proto.IWebSocketRequestMessage): WSRRequest {
  const { verb = "GET", path, body, headers } = request;
  return {
    verb, path, body,
    headers: headers.map(header => header.split(':', 2) as [string, string])
  }
}

function toWebSocketResponseMessage(r: void | undefined | string | WSRResponse): Proto.IWebSocketResponseMessage {
  if (typeof r === "undefined") {
    return { status: 200, message: "OK" }
  } else if (typeof r === "string") {
    return { status: 200, message: r }
  } else {
    return {
      ...r,
      headers: r.headers?.map(h => h.join(":"))
    }
  }
}

