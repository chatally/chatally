import type { Logger } from '@chatally/logger';
import type { Long } from 'protobufjs';
import { signalservice as Proto } from './protos/compiled';
import { strictAssert } from './util/assert';

export type SocketManagerOptions = Readonly<{
  url: string;
  certificateAuthority: string;
  version: string;
  proxyUrl?: string;
}>;

export class SocketManager {

  constructor(
    // private readonly libsignalNet: Net.Net,
    // private readonly options: SocketManagerOptions,
    private readonly log: Logger,
  ) { }

  // Creates new IWebSocketResource for AccountManager's provisioning
  public async getProvisioningResource(
    { handleRequest }: IRequestHandler
  ): Promise<IWebSocketResource> {
    return this.connectResource({
      name: 'provisioning',
      path: '/v1/websocket/provisioning/',
      // proxyAgent: await this.getProxyAgent(),
      resourceOptions: {
        name: 'provisioning',
        handleRequest,
        keepalive: { path: '/v1/keepalive/provisioning' },
      },
    }).getResult();
  }

  private connectResource({
    name,
    path,
    // proxyAgent,
    resourceOptions,
    query = {},
    extraHeaders = {},
  }: {
    name: string;
    path: string;
    // proxyAgent: ProxyAgent | undefined;
    resourceOptions: WebSocketResourceOptions;
    query?: Record<string, string>;
    extraHeaders?: Record<string, string>;
  }): AbortableProcess<IWebSocketResource> {
    const queryWithDefaults = {
      agent: 'OWD',
      version: this.options.version,
      ...query,
    };

    const url = `${this.options.url}${path}?${qs.encode(queryWithDefaults)}`;
    const { version } = this.options;

    const start = performance.now();
    const webSocketResourceConnection = connectWebSocket({
      name,
      url,
      version,
      certificateAuthority: this.options.certificateAuthority,
      proxyAgent,

      extraHeaders,

      createResource(socket: WebSocket): WebSocketResource {
        const duration = (performance.now() - start).toFixed(1);
        log.info(
          `WebSocketResource(${resourceOptions.name}) connected in ${duration}ms`
        );
        return new WebSocketResource(socket, resourceOptions);
      },
    });

    const shadowingModeEnabled =
      !resourceOptions.transportOption ||
      resourceOptions.transportOption === TransportOption.Original;
    return shadowingModeEnabled
      ? webSocketResourceConnection
      : this.connectWithShadowing(webSocketResourceConnection, resourceOptions);
  }

  private async getProxyAgent(): Promise<ProxyAgent | undefined> {
    if (this.options.proxyUrl && !this.lazyProxyAgent) {
      // Cache the promise so that we don't import concurrently.
      this.lazyProxyAgent = createProxyAgent(this.options.proxyUrl);
    }
    return this.lazyProxyAgent;
  }

}

export interface IWebSocketResource extends IResource {
  sendRequest(options: SendRequestOptions): Promise<Response>;
  addEventListener(name: 'close', handler: (ev: CloseEvent) => void): void;
  forceKeepAlive(timeout?: number): void;
  shutdown(): void;
  close(): void;
  localPort(): number | undefined;
}

export type IResource = {
  close(code: number, reason: string): void;
};

export type SendRequestOptions = Readonly<{
  verb: string;
  path: string;
  body?: Uint8Array;
  timeout?: number;
  headers?: ReadonlyArray<[string, string]>;
}>;

export class CloseEvent extends Event {
  constructor(public readonly code: number, public readonly reason: string) {
    super('close');
  }
}

export class IncomingWebSocketRequest {
  private readonly id: Long;
  public readonly verb: string;
  public readonly path: string;
  public readonly body: Uint8Array | undefined;
  public readonly headers: ReadonlyArray<string>;

  constructor(
    request: Proto.IWebSocketRequestMessage,
    private readonly sendBytes: (bytes: Buffer) => void
  ) {
    strictAssert(request.id, 'request without id');
    strictAssert(request.verb, 'request without verb');
    strictAssert(request.path, 'request without path');

    this.id = request.id;
    this.verb = request.verb;
    this.path = request.path;
    this.body = dropNull(request.body);
    this.headers = request.headers || [];
  }

  public respond(status: number, message: string): void {
    const bytes = Proto.WebSocketMessage.encode({
      type: Proto.WebSocketMessage.Type.RESPONSE,
      response: { id: this.id, message, status },
    }).finish();

    this.sendBytes(Buffer.from(bytes));
  }
}

export type IRequestHandler = {
  handleRequest(request: IncomingWebSocketRequest): void;
};
