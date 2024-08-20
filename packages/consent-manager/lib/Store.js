import Database from 'better-sqlite3'

export class Store {
  /**
   * @param {string} path
   */
  constructor(path) {
    const db = new Database(path)
    db.pragma('journal_mode = WAL')
    db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
      'rowid' integer PRIMARY KEY AUTOINCREMENT,
      'id' varchar UNIQUE,
      'consent' BOOLEAN NOT NULL CHECK (consent IN (0, 1)) DEFAULT 0,
      'original' varchar,
      'message_id' varchar,
      'timestamp' INTEGER
    );
    CREATE INDEX IF NOT EXISTS visitor_by_id ON visitors(id);
  `)
    /** @type {import("better-sqlite3").Statement<[string], {consent?: number}>} */
    this.selectConsent = db.prepare(
      'SELECT consent FROM visitors WHERE id = ?',
    )
    /** @type {import("better-sqlite3").Statement<[string], {original?: string}>} */
    this.selectOriginal = db.prepare(
      'SELECT original FROM visitors WHERE id = ?',
    )
    this.updateConsent = db.prepare(
      'UPDATE visitors SET consent=1, original=NULL, message_id=?, timestamp=? WHERE id=?',
    )
    this.insertOriginal = db.prepare(
      'INSERT INTO visitors (id, original) VALUES (?, ?)',
    )
  }

  /**
   * Check if consent is true for an entry.
   * @param {string} from sender id
   * @returns {boolean|undefined} Undefined is returned if no entry is found
   */
  hasConsent(from) {
    const result = this.selectConsent.get(from)
    if (!result) return undefined
    return result.consent === 1
  };

  /**
   * Get the original message.
   * @param {string} from sender id
   * @returns {import('@chatally/core').ChatRequest|undefined} The original request (parsed from the stored JSON).
   */
  getOriginal(from) {
    const result = this.selectOriginal.get(from)
    if (result?.original) {
      try {
        return JSON.parse(result.original)
      } catch (_e) {
      }
    }
    return undefined
  };

  /**
   * Store the given consent with message id and timestamp.
   * @param {string} from sender id
   * @param {string} messageId message id
   */
  storeConsent(from, messageId) {
    this.updateConsent.run(messageId, Date.now(), from)
  };

  /**
   * Store the given consent with message id and timestamp.
   * @param {string} from sender id
   * @param {import('@chatally/core').ChatRequest} original original message as JSON string
   */
  storeOriginal(from, original) {
    this.insertOriginal.run(from, JSON.stringify(original))
  };
}
