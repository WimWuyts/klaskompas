# Technologiestack — opties v0.1

## Bindende producteisen uit 1B-D4

Iedere kandidaatstack moet vóór selectie aantonen dat zij deze functies veilig kan ondersteunen:

- één canonieke actieve lessessie op laptop, tablet en gsm;
- geauthenticeerde realtime updates of gelijkwaardige server push;
- automatische verwerking op andere verbonden toestellen zonder handmatig vernieuwen;
- productdoel: propagatie binnen twee seconden na serveracceptatie bij normale verbinding;
- idempotente mutaties, zodat netwerkherhaling geen dubbele registraties veroorzaakt;
- recordversies of een gelijkwaardig mechanisme voor gelijktijdige wijzigingen;
- zichtbare conflictafhandeling zonder stille `last write wins`;
- versleutelde lokale wachtrij voor tijdelijk verbindingsverlies, indien schoolbeleid dit toestaat;
- auditbare correcties en intrekkingen;
- herkenbare en intrekbare apparaatsessies;
- aparte responsieve laptop-, tablet- en gsm-interfaces.

Een stack die deze eisen niet betrouwbaar kan invullen, valt af ongeacht de ontwikkelsnelheid.

## Optie A — TypeScript PWA + Supabase/PostgreSQL

Voordelen:

- snelle web-, laptop- en tabletinterface;
- sterke relationele databank;
- authenticatie en row-level security;
- realtime databasekanalen beschikbaar;
- relatief snel door Claude Code te bouwen;
- latere offlinewachtrij mogelijk.

Risico's en te bewijzen punten:

- gegevenslocatie en schoolgoedkeuring controleren;
- offline synchronisatie en conflictresolutie zijn niet triviaal;
- row-level security moet streng getest worden;
- idempotente mutaties en recordversies moeten expliciet worden ontworpen;
- realtimekanalen mogen nooit bredere leerlingdata lekken dan het scherm nodig heeft;
- revocable device sessions en lokale versleuteling vereisen een concrete uitwerking.

## Optie B — Volledig self-hosted TypeScript + PostgreSQL

Voordelen:

- maximale controle over hosting en gegevens;
- minder afhankelijkheid van een backend-as-a-service;
- realtime transport, sessies en conflictbeleid volledig zelf te bepalen.

Risico's en te bewijzen punten:

- meer beheer, beveiliging en deploymentwerk;
- langere bouwtijd vóór september;
- realtime infrastructuur, reconnects en presence moeten zelf betrouwbaar worden gebouwd;
- grotere operationele verantwoordelijkheid voor updates, back-ups en incidenten.

## Optie C — Frappe-framework

Voordelen:

- snelle datamodellen, rollen, workflows en dashboards;
- aansluiting bij Frappe Education-patronen;
- servergestuurde gebeurtenissen en auditpatronen kunnen als basis dienen.

Risico's en te bewijzen punten:

- zwaarder framework;
- minder vrijheid voor een extreem snelle teacher-first UI;
- afzonderlijke laptop-, tablet- en gsm-ervaring kan meer maatwerk vragen;
- lokale offlinewachtrij en fijnmazige conflictresolutie moeten worden bewezen.

## Verplichte technische proef vóór de stacklock

Met uitsluitend fictieve data moet iedere serieuze kandidaat minimaal demonstreren:

1. gsm wijzigt aanwezigheid en laptop/tablet werken automatisch bij;
2. laptop registreert L3 en gsm/tablet ontvangen één identieke gebeurtenis;
3. dubbele verzending levert geen dubbel record;
4. offline mutatie synchroniseert na reconnect;
5. twee onverenigbare wijzigingen geven een zichtbare conflictstatus;
6. een gecorrigeerde of ingetrokken registratie wordt op alle toestellen auditbaar bijgewerkt;
7. een tweede toestel sluit aan bij de bestaande actieve lessessie;
8. privacy- en rijautorisatie verhinderen toegang buiten de eigen leerkrachtcontext.

## Voorlopig advies

Optie A blijft de voorlopige voorkeursrichting wegens de ontwikkelsnelheid en beschikbare realtimebouwstenen. De keuze is nog niet definitief. Hosting, schoolgoedkeuring, beveiliging, lokale opslag en de volledige D4-proef moeten eerst aantoonbaar slagen.

## Bindende verwijzingen

- `../00-project/DECISION_1B_D4_DEVICE_LAYOUT_AND_REALTIME_SYNC_v1.0.md`
- `CROSS_DEVICE_REALTIME_SYNC_SPEC_v0.1.md`
- `CLASSROOM_QUICK_INTERACTION_SPEC_v0.1.md`
