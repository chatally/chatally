import { getLogger, noLogger, type LoggerInit } from '@chatally/logger';
import { randomBytes } from 'node:crypto';
import { AccountManager } from './AccountManager';
import { Messaging } from './Messaging';
import { SignalServer } from './SignalServer';
import { SocketManager } from './SocketManager';
import { Storage } from './Storage';
import { drop } from './util/drop';
import { explodePromise } from './util/promise';

interface Config {
  dbKey: string,
  log?: LoggerInit,
}

export class Client {
  private readonly server: SignalServer;
  public readonly storage: Storage;
  public readonly account: AccountManager;
  public readonly messaging: Messaging;
  public readonly ready: Promise<Client>;

  constructor({ dbKey, log: logInit = noLogger }: Config) {
    const log = getLogger(logInit);
    this.storage = new Storage({ dbKey, log: log.child("Storage") });
    const socketManager = new SocketManager(log.child("Sockets"));
    this.server = new SignalServer({ socketManager, log: log.child("Server") });
    this.account = new AccountManager({
      log: log.child("Account"),
      storage: this.storage,
      server: this.server,
    });
    this.messaging = new Messaging({
      log: log.child("Messaging"),
      account: this.account,
      server: this.server,
    });
    log.info(`
Registering... 
Wait for registration to end before using the client.
You can do that by 'const client = await new Client().ready'`);
    const { promise, resolve, reject } = explodePromise<this>();
    this.ready = promise;
    drop(this.account.register(() => resolve(this), reject));
  }

  static generateDbKey() {
    // https://www.zetetic.net/sqlcipher/sqlcipher-api/#key
    return randomBytes(32).toString('hex');
  }
}
