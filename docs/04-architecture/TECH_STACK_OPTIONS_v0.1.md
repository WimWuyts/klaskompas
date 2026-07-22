# Technologiestack — opties v0.1

## Optie A — TypeScript PWA + Supabase/PostgreSQL

Voordelen:

- snelle web- en tabletinterface;
- sterke relationele databank;
- authenticatie en row-level security;
- relatief snel door Claude Code te bouwen;
- latere offlineondersteuning mogelijk.

Risico's:

- gegevenslocatie en schoolgoedkeuring controleren;
- offline synchronisatie is niet triviaal;
- row-level security moet streng getest worden.

## Optie B — Volledig self-hosted TypeScript + PostgreSQL

Voordelen:

- maximale controle over hosting en gegevens;
- minder afhankelijkheid van een backend-as-a-service.

Risico's:

- meer beheer, beveiliging en deploymentwerk;
- langere bouwtijd vóór september.

## Optie C — Frappe-framework

Voordelen:

- snelle datamodellen, rollen, workflows en dashboards;
- aansluiting bij Frappe Education-patronen.

Risico's:

- zwaarder framework;
- minder vrijheid voor een extreem snelle teacher-first UI.

## Voorlopig advies

Optie A is de voorlopige voorkeursrichting, maar wordt pas definitief na beslissingen over hosting, schoolgoedkeuring en offlinebehoefte.
