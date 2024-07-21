import type { Logger } from "@chatally/logger";
import type { Database, Statement } from "@signalapp/better-sqlite3";
import SQLite from '@signalapp/better-sqlite3';
import type { SerializedStorageItem, StorageItem, StorageKey } from "./StorageItem";

export class StoragePersist {
  log: Logger;
  private readonly db: Database;

  readonly #insertOrReplace: Statement<[string, string]>;
  readonly #select: Statement<[StorageKey]>;
  readonly #selectAll: Statement<[]>;
  readonly #delete: Statement<[StorageKey]>;

  constructor(filePath: string, key: string, log: Logger) {
    this.log = log;
    this.db = openDb(filePath, key);
    this.#insertOrReplace = this.db.prepare(
      "INSERT OR REPLACE INTO items (id, json) VALUES (?, ?)"
    )
    this.#select = this.db.prepare("SELECT * FROM items WHERE id = ?")
    this.#selectAll = this.db.prepare(
      "SELECT * FROM items ORDER BY id ASC"
    )
    this.#delete = this.db.prepare("DELETE FROM items WHERE id = ?")
  }

  insertOrReplace<K extends StorageKey>(
    key: K,
    value: StorageItem[K]
  ): void {
    if (!key) {
      throw new Error("insertOrReplace: invalid key");
    }
    this.#insertOrReplace.run(key, JSON.stringify(value));
  }

  get<K extends StorageKey>(
    id: K
  ): SerializedStorageItem<K> {
    const row = this.#select.get(id);
    return JSON.parse(row.json);
  }

  getAll(): Partial<StorageItem> {
    const rows = this.#selectAll.all();
    const result: Partial<StorageItem> = Object.create(null);
    for (const { id, json } of rows) {
      result[id] = JSON.parse(json);
    }

    return result;
  }

  delete(id: StorageKey): void {
    this.#delete.run(id)
  }
}

const INVALID_KEY = /[^0-9A-Fa-f]/;
function openDb(filePath: string, key: string): Database {
  if (INVALID_KEY.exec(key)) {
    throw new Error(`SQLCipher: key '${key}' is not valid`);
  }

  // https://www.zetetic.net/sqlcipher/sqlcipher-api/#key
  let db = new SQLite(filePath);
  try {
    db.pragma(`key = "x'${key}'"`);
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = FULL');
    migrateSchemaVersion(db);
    db.pragma('foreign_keys = ON');
  } catch (error) {
    if (db) {
      db.close();
    }
    db = new SQLite(filePath);
    db.pragma(`key = "x'${key}'"`);
    // https://www.zetetic.net/blog/2018/11/30/sqlcipher-400-release/#compatability-sqlcipher-4-0-0
    db.pragma('cipher_compatibility = 3');
    migrateSchemaVersion(db);
    db.close();

    db = new SQLite(filePath);
    db.pragma(`key = "x'${key}'"`);
    db.pragma('cipher_migrate');
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = FULL');
    db.pragma('foreign_keys = ON');
  }

  db.exec(`
  CREATE TABLE IF NOT EXISTS items (
  'rowid' integer PRIMARY KEY AUTOINCREMENT,
  'id' varchar,
  'json' varchar
  );
  CREATE INDEX IF NOT EXISTS ids ON items(id);
`)
  return db;
}

function migrateSchemaVersion(db: Database): void {
  const schemaVersion = db.pragma('schema_version', { simple: true });
  const newUserVersion = schemaVersion > 18 ? 16 : schemaVersion;
  db.pragma(`user_version = ${newUserVersion}`);
}
