// Schema-definitie + migraties voor de Klaskompas-database.
// Framework-first: alle stores worden nu al aangelegd (leeg), zodat concrete
// gegevens later enkel ingevuld hoeven te worden zonder migratie (OD-9, ontwerpprincipe).

import { Idb } from './idb.js';

export const DB_NAME = 'klaskompas';
export const DB_VERSION = 1;

/**
 * Storedefinities. `key` = keyPath. `indexes` = [naam, keyPath, opties?].
 * De volgorde is bewust: administratie-ruggengraat eerst, dan klasmanagement.
 */
export const STORES = [
  // — sleutel/waarde —
  { name: 'meta', key: 'key' }, // schemaVersie, appVersie, aangemaakt …
  { name: 'settings', key: 'key' }, // actieveKlasId, modus, globale voorkeuren …

  // — administratie-ruggengraat: klas → leerling (via inschrijving) —
  { name: 'schooljaren', key: 'id' },
  {
    name: 'klassen',
    key: 'id',
    indexes: [['schooljaarId', 'schooljaarId']],
  },
  {
    name: 'leerlingen',
    key: 'id',
    indexes: [['sleutel', 'sleutel', { unique: false }]], // dedup-sleutel voor merge-import
  },
  {
    name: 'inschrijvingen',
    key: 'id',
    indexes: [
      ['klasId', 'klasId'],
      ['leerlingId', 'leerlingId'],
      ['schooljaarId', 'schooljaarId'],
    ],
  },

  // — kalender & rooster (structuur nu, invullen later) —
  {
    name: 'kalenderitems', // vakanties, vrije dagen, pedagogische studiedagen
    key: 'id',
    indexes: [['schooljaarId', 'schooljaarId']],
  },
  {
    name: 'roosterslots', // wekelijks terugkerend lesmoment per klas
    key: 'id',
    indexes: [
      ['klasId', 'klasId'],
      ['schooljaarId', 'schooljaarId'],
    ],
  },

  // — aanwezigheid per lesuur —
  {
    name: 'aanwezigheid',
    key: 'id',
    indexes: [
      ['klasId', 'klasId'],
      ['leerlingId', 'leerlingId'],
      ['datum', 'datum'],
    ],
  },

  // — klaskapitaal-economie (ADR-0001) —
  { name: 'potten', key: 'klasId' }, // huidig saldo + config-momentopname per klas
  {
    name: 'potEvents', // logboek van elke beweging (audit/transparantie)
    key: 'id',
    indexes: [['klasId', 'klasId']],
  },

  // — beloningen (ADR-0003) —
  {
    name: 'beloningen', // menu-items (per klas; klasId '*' = sjabloon voor alle klassen)
    key: 'id',
    indexes: [['klasId', 'klasId']],
  },
  {
    name: 'aankopen', // ingewisselde beloningen
    key: 'id',
    indexes: [['klasId', 'klasId']],
  },

  // — individueel spoor (privaat, feitelijk — ADR-0001 §2.2/§2.4) —
  {
    name: 'observaties',
    key: 'id',
    indexes: [
      ['leerlingId', 'leerlingId'],
      ['klasId', 'klasId'],
    ],
  },
  {
    name: 'quota', // feitelijke tellers (bv. "boek vergeten")
    key: 'id',
    indexes: [['leerlingId', 'leerlingId'], ['klasId', 'klasId']],
  },
];

/** Voer de nodige upgrades uit. Idempotent per storenaam. */
function upgrade(db, oldVersion, tx) {
  for (const def of STORES) {
    let store;
    if (!db.objectStoreNames.contains(def.name)) {
      store = db.createObjectStore(def.name, { keyPath: def.key });
    } else {
      store = tx.objectStore(def.name);
    }
    for (const [name, keyPath, opts] of def.indexes || []) {
      if (!store.indexNames.contains(name)) {
        store.createIndex(name, keyPath, opts || {});
      }
    }
  }
}

/** Open de database met het huidige schema. @returns {Promise<Idb>} */
export function openDb() {
  return Idb.open(DB_NAME, DB_VERSION, upgrade);
}
