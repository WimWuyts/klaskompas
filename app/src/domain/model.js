// Domeinmodel: id's, entiteit-fabrieken, constanten en per-klas configuratie.
// De constanten leggen de defaults uit ADR-0001 vast (universele kern, per klas instelbaar).

/** Genereer een stabiel uniek id. */
export function uid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  // Terugval (oude browsers): tijd + toeval, geen echte UUID maar wel uniek genoeg.
  return 'id-' + Math.random().toString(36).slice(2) + '-' + performance.now().toString(36);
}

/** Normaliseer een naam tot een dedup-sleutel voor merge-import. */
export function dedupSleutel(voornaam, naam) {
  return `${(voornaam || '').trim()} ${(naam || '').trim()}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // diacritics weg
    .replace(/\s+/g, ' ')
    .trim();
}

// — Keuzelijsten (Vlaamse context, 2e graad) —

export const AANWEZIGHEID_STATUS = {
  aanwezig: 'Aanwezig',
  telaat: 'Te laat',
  gewettigd: 'Afwezig — gewettigd',
  ongewettigd: 'Afwezig — ongewettigd',
  deel: 'Deel gemist',
};

export const KALENDER_TYPE = {
  vakantie: 'Vakantie',
  vrijedag: 'Vrije dag',
  studiedag: 'Pedagogische studiedag',
  andere: 'Andere',
};

export const DAGEN = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

// — Klasafspraken & routine (klasfiche ADR-0001 §2.3) —

/** Vaste lesstart-drill (afvinkbaar op het Klasscherm). */
export const DRILL_STAPPEN = [
  'Binnenkomen — rustig en groeten',
  'Rechtstaan aan de bank',
  'Gaan zitten op teken',
  'Boek + taak van de vorige dag klaar',
  'Starten terwijl de leerkracht klaarzet',
];

/** De 5 kernafspraken voor de talenklas (samen aan te scherpen). */
export const DEFAULT_AFSPRAKEN = [
  'We tonen respect voor elkaars taal, mening en fouten.',
  'We luisteren tot iemand is uitgesproken en geven elkaar spreektijd.',
  'We proberen eerst in de doeltaal (met een steun-/ontsnappingsroute).',
  'We zijn op tijd en lesklaar (materiaal + opdracht klaar).',
  'We dragen bij aan het groepswerk — iedereen doet zijn deel.',
];

// — Beloningen (ADR-0003) —

export const BELONING_NIVEAU = {
  klein: 'Klein (vaak)',
  midden: 'Midden',
  groot: 'Groot (zeldzaam)',
};

export const BELONING_CATEGORIE = {
  voorrecht: 'Voorrechten & autonomie',
  ervaring: 'Ervaringen & spel',
  talen: 'Talen-gekleurd',
  snoep: 'Snoep & materieel',
  klasmoment: 'Klasmoment / spaardoel',
};

// — Klaskapitaal-configuratie per klas (ADR-0001 §2.1.8) —

export const DECIBEL_MODUS = {
  uit: 'Uit',
  bevestigen: 'Bevestigen per keer',
  objectief: 'Objectieve drift',
};

/** Default per-klas configuratie. Alles is per klas instelbaar. */
export function defaultKlasConfig() {
  return {
    startkapitaal: 20, // € waarmee een klas begint
    bodem: 0, // pot kan niet lager
    stapbedrag: 1, // standaard beweging per handeling (€)
    prijsdrempel: 50, // vanaf hier mag de klas iets "kopen"
    herstartdrempel: 5, // hieronder volgt een herstart-uitdaging
    optieC: false, // mag individueel gedrag de pot doen dalen? (OD-2, default uit)
    collectiefGevolg: true, // §2.1.7 aan/uit
    decibelModus: 'uit', // 'uit' | 'bevestigen' | 'objectief'
    decibelDrempel: 55, // relatieve luidheid 0–100 die als "te luid" geldt
  };
}

// — Entiteit-fabrieken —

export function maakSchooljaar({ label, start, eind }) {
  return { id: uid(), label, start, eind, aangemaakt: new Date().toISOString() };
}

export function maakKlas({ naam, vak = '', niveau = '', schooljaarId, note = '' }) {
  return {
    id: uid(),
    naam,
    vak,
    niveau,
    schooljaarId: schooljaarId || null,
    note,
    config: defaultKlasConfig(),
    aangemaakt: new Date().toISOString(),
  };
}

export function maakLeerling({ voornaam, naam, email = '', note = '' }) {
  return {
    id: uid(),
    voornaam: (voornaam || '').trim(),
    naam: (naam || '').trim(),
    email: (email || '').trim(),
    note,
    sleutel: dedupSleutel(voornaam, naam),
    aangemaakt: new Date().toISOString(),
  };
}

export function maakInschrijving({ leerlingId, klasId, schooljaarId }) {
  return {
    id: uid(),
    leerlingId,
    klasId,
    schooljaarId: schooljaarId || null,
    actief: true,
    aangemaakt: new Date().toISOString(),
  };
}

export function maakPotEvent({ klasId, delta, saldoNa, reden, bron = 'handmatig' }) {
  return {
    id: uid(),
    klasId,
    delta,
    saldoNa,
    reden: reden || '',
    bron, // 'handmatig' | 'drill' | 'decibel' | 'beloning' | 'herstart'
    ts: new Date().toISOString(),
  };
}

export function maakBeloning({
  klasId,
  categorie,
  naam,
  omschrijving = '',
  prijs,
  niveau = 'midden',
  talen = '',
  actief = true,
}) {
  return {
    id: uid(),
    klasId, // concrete klas-id of '*' voor een sjabloon
    categorie,
    naam,
    omschrijving,
    prijs: Number(prijs) || 0,
    niveau,
    talen,
    actief,
    aangemaakt: new Date().toISOString(),
  };
}

export function maakAankoop({ klasId, beloningId, naam, prijs, note = '' }) {
  return {
    id: uid(),
    klasId,
    beloningId,
    naam,
    prijs: Number(prijs) || 0,
    note,
    ts: new Date().toISOString(),
  };
}
