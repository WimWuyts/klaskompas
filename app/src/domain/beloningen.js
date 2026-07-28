// Beloningsmenu + uitgeef-mechaniek (ADR-0003, uit research/beloningssysteem-onderzoek.md).
// De startset staat als sjabloon ('*') klaar; per klas kan de leerkracht toevoegen/aanpassen.

import { db, get, put, getPot, beloningenVoorKlas } from '../db/repo.js';
import { maakBeloning, maakAankoop } from './model.js';
import { geefUit } from './klaspot.js';

/**
 * Aanbevolen startmenu (drie prijsniveaus, talen-gekleurd, collectief).
 * Prijzen zijn richtwaarden bij een prijsdrempel ~50; per klas ijkbaar.
 */
export const START_MENU = [
  // klein / vaak
  { categorie: 'voorrecht', niveau: 'klein', naam: 'Klas-DJ (muziek kiezen)', prijs: 10, talen: 'Enkel Engels-/Spaanstalige nummers → luisterinput', omschrijving: 'De klas kiest de muziek bij binnenkomst of stil werk.' },
  { categorie: 'voorrecht', niveau: 'klein', naam: 'Kies je plaats', prijs: 10, talen: 'Laat in de doeltaal over de keuze stemmen', omschrijving: 'De klas of leerling kiest de zitplaats voor een les.' },
  { categorie: 'voorrecht', niveau: 'klein', naam: '5–10 min free choice', prijs: 15, talen: '', omschrijving: 'Blok vrije tijd op het einde van de les, met duidelijke afspraken.' },
  // midden
  { categorie: 'ervaring', niveau: 'midden', naam: 'Spelles (Kahoot/Taboe)', prijs: 25, talen: 'Volledig in de doeltaal; quizbank per thema hergebruiken', omschrijving: 'Een les met taalspellen in teamverband.' },
  { categorie: 'talen', niveau: 'midden', naam: 'Clip-moment "kies de clip"', prijs: 25, talen: 'Leerling stelt een clip voor en zegt er kort iets over', omschrijving: 'Korte, vooraf gescreende clips/trailers in de doeltaal.' },
  { categorie: 'snoep', niveau: 'midden', naam: 'Cultuur-snoepmoment', prijs: 30, talen: 'Mini-opdracht "beschrijf de smaak in het Spaans"', omschrijving: 'Collectief, zeldzaam proevertje. Individueel verpakt + ingrediëntenlijst; check schoolbeleid.' },
  // groot / zeldzaam
  { categorie: 'klasmoment', niveau: 'groot', naam: 'Doeltaal-filmles', prijs: 50, talen: 'Authentieke input; ondertitels als opbouw (NL → doeltaal)', omschrijving: 'Volledige les film in het Engels/Spaans als grote gespaarde beloning.' },
  { categorie: 'klasmoment', niveau: 'groot', naam: 'Fiesta / cultuurmoment', prijs: 50, talen: 'Voorbereiding en presentatie in de doeltaal', omschrijving: 'Collectief cultuurfeest; groepjes zoeken playlist/eten op en presenteren.' },
];

/** Zet de startset als sjablonen ('*') klaar, indien nog niet aanwezig. */
export async function zaaiStartMenu() {
  const d = await db();
  const bestaand = await d.getAllByIndex('beloningen', 'klasId', '*');
  if (bestaand.length > 0) return 0;
  let n = 0;
  for (const b of START_MENU) {
    await d.put('beloningen', maakBeloning({ klasId: '*', ...b }));
    n++;
  }
  return n;
}

/** Alle (actieve) beloningen voor een klas, gesorteerd op niveau en prijs. */
export async function menuVoorKlas(klasId) {
  const volgorde = { klein: 0, midden: 1, groot: 2 };
  const items = await beloningenVoorKlas(klasId);
  items.sort(
    (a, b) => (volgorde[a.niveau] - volgorde[b.niveau]) || a.prijs - b.prijs,
  );
  return items;
}

/**
 * Wissel een beloning in: controleer saldo, trek af, log de aankoop.
 * @returns {Promise<{ok:boolean, reden?:string, saldo?:number}>}
 */
export async function wisselIn(klasId, beloningId) {
  const beloning = await get('beloningen', beloningId);
  if (!beloning) return { ok: false, reden: 'Beloning niet gevonden.' };
  const pot = await getPot(klasId);
  if (pot.saldo < beloning.prijs) {
    return { ok: false, reden: `Nog niet genoeg gespaard (€${pot.saldo} / €${beloning.prijs}).` };
  }
  const status = await geefUit(klasId, beloning.prijs, `Beloning: ${beloning.naam}`);
  await put(
    'aankopen',
    maakAankoop({ klasId, beloningId, naam: beloning.naam, prijs: beloning.prijs }),
  );
  return { ok: true, saldo: status.saldo };
}
