// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { noLogger, type Logger } from '@chatally/logger';
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { Blocked } from './Blocked';
import { Protocol } from './Protocol';
import type { StorageInterface } from './StorageInterface';
import type { StorageItem, StorageKey } from './StorageItem';
import { StoragePersist } from './StoragePersist';
import { User } from './User';

interface Config {
  dbPath?: string,
  dbKey?: string,
  log?: Logger,
}

export class Storage implements StorageInterface {
  private readonly persist: StoragePersist;
  public readonly protocol: Protocol;
  public readonly user: User;
  public readonly blocked: Blocked;

  private readonly items: Partial<StorageItem> = Object.create(null);
  private readonly log: Logger

  constructor(
    { dbPath = 'signal.db', dbKey, log = noLogger }: Config = {}
  ) {
    dbKey ??= findOrGenerateKey();
    this.log = log
    this.persist = new StoragePersist(dbPath, dbKey, this.log.child('Persist'));
    Object.assign(this.items, this.persist.getAll());
    this.protocol = new Protocol(this, this.log.child('Protocol'));
    this.user = new User(this, this.log.child('User'));
    this.blocked = new Blocked(this, this.log.child('Blocked'));
  }

  public get<K extends StorageKey, V extends StorageItem[K]>(
    key: K
  ): V | undefined;

  public get<K extends StorageKey, V extends StorageItem[K]>(
    key: K,
    defaultValue: V
  ): V;

  public get<K extends StorageKey>(
    key: K,
    defaultValue?: StorageItem[K]
  ): Partial<StorageItem>[K] | undefined {
    const item = this.items[key];
    if (item === undefined) {
      return defaultValue;
    }

    return item;
  }

  // TODO: [Signal] Emit storage events

  public put<K extends StorageKey>(
    key: K,
    value: StorageItem[K]
  ) {
    this.items[key] = value;
    this.persist.insertOrReplace(key, value);
  }

  public remove<K extends StorageKey>(key: K): void {
    delete this.items[key];
    this.persist.delete(key);
  }
}

function findOrGenerateKey() {
  const varKey = process.env["SIGNAL_DB_KEY"];
  if (varKey) {
    return varKey;
  }
  const keyFile = join(homedir(), "signaldb.key");
  if (existsSync(keyFile)) {
    return readFileSync(keyFile, { encoding: "utf-8" });
  }

  // Generate a new key according to 
  // https://www.zetetic.net/sqlcipher/sqlcipher-api/#key
  const newKey = randomBytes(32).toString('hex');
  writeFileSync(keyFile, newKey, { mode: 0o600, encoding: "utf-8" });
  return newKey;
}
