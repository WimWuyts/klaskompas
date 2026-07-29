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

// ————————————————————————————— Individueel spoor (ADR-0001 §2.2/§2.4) —————

export const OBSERVATIE_CATEGORIE = {
  werkhouding: 'Werkhouding',
  gedrag: 'Gedrag',
  sociaal: 'Sociale vaardigheden',
  motivatie: 'Motivatie',
  participatie: 'Klasparticipatie',
  positief: 'Positief',
  andere: 'Andere',
};

/** De 5 vaste herstelvragen (kort na de les). */
export const HERSTELVRAGEN = [
  'Wat gebeurde er precies? (feiten)',
  'Wie is erdoor geraakt, en hoe?',
  'Wat had je anders kunnen doen?',
  'Hoe maken we het weer goed?',
  'Wat spreken we af voor de volgende keer?',
];

/** Individuele consequentie-ladder (van licht naar zwaar; §2.2.11). */
export const CONSEQUENTIE_LADDER = [
  { sleutel: 'herstelgesprek', label: 'Herstelgesprek', hint: '5 herstelvragen, kort na de les.' },
  { sleutel: 'herstelopdracht', label: 'Logische herstelopdracht', hint: '"You break it, you fix it" — evt. kort in de doeltaal.' },
  { sleutel: 'notitie', label: 'Feitelijke notitie + opschalen', hint: 'ABC-notitie; bij een patroon een signaal naar mentor/ouders/zorg.' },
  { sleutel: 'privilege', label: 'Tijdelijk privilegeverlies', hint: 'Bv. even geen vrije partner-/plaatskeuze. Nooit de leerstof of een basisbehoefte.' },
];

/** Types feitelijke tellers (uitbreidbaar). */
export const QUOTA_TYPES = {
  boek: 'Boek vergeten',
  materiaal: 'Materiaal vergeten',
  taak: 'Taak niet gemaakt',
  telaat: 'Te laat',
  gsm: 'Gsm-afspraak',
  andere: 'Andere',
};

export function maakObservatie({ leerlingId, klasId, categorie = 'gedrag', aanleiding = '', gedrag = '', gevolg = '', opvolgen = false }) {
  return {
    id: uid(),
    leerlingId,
    klasId,
    categorie,
    aanleiding, // A — antecedent
    gedrag, // B — behavior (het feitelijke gedrag)
    gevolg, // C — consequence
    opvolgen: !!opvolgen,
    datum: new Date().toISOString(),
  };
}

export function maakQuota({ leerlingId, klasId, type = 'boek', drempel = 3 }) {
  return {
    id: uid(),
    leerlingId,
    klasId,
    type,
    aantal: 0,
    drempel: Number(drempel) || 3,
    maand: new Date().toISOString().slice(0, 7), // JJJJ-MM
    laatst: null,
  };
}

export function maakConsequentie({ leerlingId, klasId, stap, note = '', observatieId = null }) {
  return {
    id: uid(),
    leerlingId,
    klasId,
    stap, // sleutel uit CONSEQUENTIE_LADDER
    note,
    observatieId,
    datum: new Date().toISOString(),
  };
}

// ————————————————————————————— Administratie v0.2 —————

export const INHAALWERK_TYPE = { toets: 'Toets', taak: 'Taak', mondeling: 'Mondeling', lesinhoud: 'Lesinhoud', andere: 'Andere' };
export const INHAALWERK_STATUS = { open: 'Open', afspraak: 'Afspraak te maken', ingepland: 'Ingepland', afgelegd: 'Afgelegd', afgesloten: 'Afgesloten' };

export function maakInhaalwerk({ leerlingId, klasId, type = 'toets', titel = '', status = 'open', missedDatum = '', scheduledDatum = '', note = '' }) {
  return { id: uid(), leerlingId, klasId, type, titel, status, missedDatum, scheduledDatum, note, aangemaakt: new Date().toISOString() };
}

export const EVALUATIE_TYPE = { toets: 'Toets', taak: 'Taak', mondeling: 'Mondeling', oefening: 'Oefening', observatie: 'Observatie', andere: 'Andere' };

export function maakEvaluatie({ klasId, datum = '', titel = '', type = 'toets', maxPunten = 10, gewicht = 100, thema = '', note = '' }) {
  return { id: uid(), klasId, datum, titel, type, maxPunten: Number(maxPunten) || 10, gewicht: Number(gewicht) || 100, thema, note, aangemaakt: new Date().toISOString() };
}

export function maakEvalResultaat({ evaluatieId, leerlingId, klasId, punten = null, afwezig = false, note = '' }) {
  return { id: uid(), evaluatieId, leerlingId, klasId, punten: punten === '' || punten == null ? null : Number(punten), afwezig: !!afwezig, note };
}

export const ACTIE_STATUS = { open: 'Open', gedaan: 'Gedaan' };

export function maakActie({ tekst, klasId = null, leerlingId = null, datum = '' }) {
  return { id: uid(), tekst, klasId, leerlingId, datum, status: 'open', aangemaakt: new Date().toISOString() };
}

export const NOTITIE_KANAAL = { ouder: 'Ouder', mentor: 'Mentor', zorg: 'Zorg', directie: 'Directie', andere: 'Andere' };

export function maakNotitie({ leerlingId = null, klasId = null, kanaal = 'ouder', tekst = '', opvolgen = false }) {
  return { id: uid(), leerlingId, klasId, kanaal, tekst, opvolgen: !!opvolgen, datum: new Date().toISOString() };
}

// ————————————————————————————— Zitplan (OD-7/OD-8) —————

export const ZITREGEL_TYPE = {
  nietnaast: 'Niet naast elkaar',
  vastvooraan: 'Vast vooraan',
  vastachteraan: 'Vast achteraan',
  vasteplaats: 'Vaste plaats',
};

export function maakZitregel({ klasId, type, leerlingId = null, leerlingId2 = null, rij = null, kol = null }) {
  return { id: uid(), klasId, type, leerlingId, leerlingId2, rij, kol };
}

// ————————————————————————————— Optie C-voorwaarden (OD-2) —————

export function maakOptieCVoorwaarde({ klasId, tekst, actief = true }) {
  return { id: uid(), klasId, tekst, actief: !!actief, aangemaakt: new Date().toISOString() };
}
