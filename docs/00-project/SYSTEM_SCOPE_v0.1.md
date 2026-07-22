# Systeemscope v0.1

## Gedeelde kern

- schooljaar;
- vak;
- klas of lesgroep;
- leerling;
- inschrijving van leerling in klas/lesgroep;
- lesmoment;
- leerkrachtgebruiker.

## Module A — Vandaag

Toont per geselecteerde klas:

- afwezige of te late leerlingen;
- open inhaaltoetsen;
- open gedragsopvolging;
- acties met een vervaldatum;
- relevante lesnotities.

## Module B — Aanwezigheid

Ondersteunt minimaal:

- aanwezig;
- afwezig;
- te laat;
- gedeeltelijk aanwezig;
- onbekend/nog te bevestigen;
- correctie achteraf met auditreden.

De officiële schoolregistratie blijft leidend tenzij later formeel anders beslist.

## Module C — Evaluaties en inhaalwerk

Een evaluatie kan aan een klas en datum worden gekoppeld. Afwezigheid kan een inhaalverplichting creëren, maar uitzonderingen blijven mogelijk.

Kernstatussen:

- `not_required`;
- `required_unscheduled`;
- `scheduled`;
- `completed`;
- `graded`;
- `closed`;
- `exempted`.

## Module D — Gedrag

Registreert pas vanaf het afgesproken formele niveau. Een gebeurtenis bevat feitelijk gedrag, verwachting, interventiestap, gevolg, reactie/herstel en eventuele opvolging.

## Module E — Opvolgacties

Een actie kan ontstaan uit aanwezigheid, evaluatie, gedrag of een manuele notitie. Iedere actie heeft eigenaar, status, vervaldatum en bron.

## Module F — Historiek en audit

Statuswijzigingen bewaren minimaal:

- vorige en nieuwe waarde;
- tijdstip;
- handelende gebruiker;
- optionele of verplichte reden volgens actie;
- broncontext.

## Grens met officiële systemen

KlasKompas is een persoonlijk operationeel hulpmiddel. Officiële aanwezigheid, sancties en formele leerlingdossiers blijven in het door de school aangewezen systeem geregistreerd.
