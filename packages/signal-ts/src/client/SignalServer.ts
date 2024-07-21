import type { Logger } from '@chatally/logger';
import type { IRequestHandler, IWebSocketResource, SocketManager } from './SocketManager';

interface Config {
  socketManager: SocketManager;
  log: Logger;
}

export class SignalServer {
  log: Logger;
  socketManager: SocketManager;

  constructor({ log, socketManager }: Config) {
    this.log = log;
    this.socketManager = socketManager;
  }

  getProvisioningResource(
    handler: IRequestHandler
  ): Promise<IWebSocketResource> {
    return this.socketManager.getProvisioningResource(handler);
  }
}
