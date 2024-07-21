import type { StorageItem, StorageKey } from './StorageItem';

export interface StorageInterface {
  get<K extends StorageKey, V extends StorageItem[K]>(
    key: K
  ): V | undefined;

  get<K extends StorageKey, V extends StorageItem[K]>(
    key: K,
    defaultValue: V
  ): V;

  put<K extends StorageKey>(
    key: K,
    value: StorageItem[K]
  ): void;

  remove<K extends StorageKey>(key: K): void;
};
