// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { noLogger, type Logger } from '@chatally/logger';
import { SignalProtocolStore } from './SignalProtocolStore';
import { StorageBlocked } from './StorageBlocked';
import type { StorageInterface } from './StorageInterface';
import type { StorageItem, StorageKey } from './StorageItem';
import { StoragePersist } from './StoragePersist';
import { StorageUser } from './StorageUser';

interface Config {
  dbPath?: string,
  dbKey: string,
  log?: Logger,
}

export class Storage implements StorageInterface {
  private readonly persist: StoragePersist;
  public readonly protocol: SignalProtocolStore;
  public readonly user: StorageUser;
  public readonly blocked: StorageBlocked;

  private readonly items: Partial<StorageItem> = Object.create(null);
  private readonly log: Logger

  constructor({ dbPath = 'signal.db', dbKey, log = noLogger }: Config) {
    this.log = log
    this.persist = new StoragePersist(dbPath, dbKey, this.log.child('Persist'));
    Object.assign(this.items, this.persist.getAll());
    this.protocol = new SignalProtocolStore(this, this.log.child('Protocol'));
    this.user = new StorageUser(this, this.log.child('User'));
    this.blocked = new StorageBlocked(this, this.log.child('Blocked'));
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
