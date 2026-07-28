// Minimale, promise-gebaseerde IndexedDB-wrapper.
// Geen externe afhankelijkheden — voldoet aan "geen externe datastroom" (ADR-0001 §2.5.24).

/** @param {IDBRequest} req */
function wrap(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export class Idb {
  /** @param {IDBDatabase} db */
  constructor(db) {
    this.db = db;
  }

  /**
   * Open (of upgrade) de database.
   * @param {string} name
   * @param {number} version
   * @param {(db: IDBDatabase, oldVersion: number, tx: IDBTransaction) => void} upgrade
   * @returns {Promise<Idb>}
   */
  static open(name, version, upgrade) {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in globalThis)) {
        reject(new Error('IndexedDB is niet beschikbaar in deze browser.'));
        return;
      }
      const req = indexedDB.open(name, version);
      req.onupgradeneeded = (e) => {
        upgrade(req.result, e.oldVersion, req.transaction);
      };
      req.onsuccess = () => resolve(new Idb(req.result));
      req.onerror = () => reject(req.error);
      req.onblocked = () =>
        reject(new Error('Database geblokkeerd — sluit andere tabbladen van Klaskompas.'));
    });
  }

  /**
   * Voer werk uit binnen één transactie.
   * @template T
   * @param {string|string[]} stores
   * @param {IDBTransactionMode} mode
   * @param {(tx: IDBTransaction) => Promise<T>|T} work
   * @returns {Promise<T>}
   */
  tx(stores, mode, work) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(stores, mode);
      let result;
      let failed = false;
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => {
        if (!failed) reject(tx.error || new Error('Transactie afgebroken.'));
      };
      Promise.resolve()
        .then(() => work(tx))
        .then((r) => {
          result = r;
        })
        .catch((err) => {
          failed = true;
          try {
            tx.abort();
          } catch (_) {
            /* al afgebroken */
          }
          reject(err);
        });
    });
  }

  get(store, key) {
    return this.tx(store, 'readonly', (tx) => wrap(tx.objectStore(store).get(key)));
  }

  getAll(store, query, count) {
    return this.tx(store, 'readonly', (tx) => wrap(tx.objectStore(store).getAll(query, count)));
  }

  /** Alles uit een index halen op een sleutelwaarde. */
  getAllByIndex(store, index, value) {
    return this.tx(store, 'readonly', (tx) =>
      wrap(tx.objectStore(store).index(index).getAll(value)),
    );
  }

  put(store, value) {
    return this.tx(store, 'readwrite', (tx) => wrap(tx.objectStore(store).put(value)));
  }

  /** Meerdere records in één transactie wegschrijven. */
  putAll(store, values) {
    return this.tx(store, 'readwrite', async (tx) => {
      const os = tx.objectStore(store);
      for (const v of values) await wrap(os.put(v));
      return values.length;
    });
  }

  delete(store, key) {
    return this.tx(store, 'readwrite', (tx) => wrap(tx.objectStore(store).delete(key)));
  }

  clear(store) {
    return this.tx(store, 'readwrite', (tx) => wrap(tx.objectStore(store).clear()));
  }

  count(store) {
    return this.tx(store, 'readonly', (tx) => wrap(tx.objectStore(store).count()));
  }
}

export { wrap };
