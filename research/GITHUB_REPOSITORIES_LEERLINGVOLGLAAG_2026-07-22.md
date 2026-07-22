# GitHub-repositories voor de leerlingvolg- en opvolglaag

**Projectcontext:** een eigen klasmanagement- en leerlingopvolgsysteem voor een leerkracht Engels en Spaans in de tweede graad, met klassen, leerlingen, aanwezigheid, gemiste evaluaties, inhaaltoetsen, gedrag en open opvolgacties.

**Onderzoeksdatum:** 22 juli 2026

## 1. Diepgaande audit

Deze repositories zijn de belangrijkste product- en architectuurreferenties.

| Repository | GitHub-link | Belangrijkste bruikbare onderdelen |
|---|---|---|
| GibbonEdu/core | https://github.com/GibbonEdu/core | Leerlingprofielen, attendance, markbook, pastoral care, gedrag, alerts, rollen en historiek |
| meesakveld/student-tracking-system | https://github.com/meesakveld/student-tracking-system | Aanwezigheid, participatie, prestaties, opmerkingen, coaching en leerlingstatussen |
| AliAkrem/track-your-classes | https://github.com/AliAkrem/track-your-classes | Klassen, Excelimport, lesmomenten, attendance, opmerkingen, SQLite en Supabase |
| frappe/education | https://github.com/frappe/education | Leerlingen, programma-inschrijvingen, planning, attendance, examens en modulaire architectuur |
| francoisjacquet/rosariosis | https://github.com/francoisjacquet/rosariosis | Attendance, gradebook, opdrachten, rapporten, schooljaren en leerlinginformatie |
| changeweb/Unifiedtransform | https://github.com/changeweb/Unifiedtransform | Schooljaar, semester, klas, vak, lesmomenten, opdrachten en examens |
| openedx/frontend-app-gradebook | https://github.com/openedx/frontend-app-gradebook | Filters, statussen, bulkbewerkingen en audit trail bij evaluatiewijzigingen |
| danmarsden/moodle-mod_attendance | https://github.com/danmarsden/moodle-mod_attendance | Lesmomenten, aanwezigheidsstatussen, correcties, rapporten en exports |
| classroomio/classroomio | https://github.com/classroomio/classroomio | Moderne dashboard- en klasseninterface, componentarchitectuur en mobiele navigatie |

## 2. Gerichte deelanalyse

Deze repositories bevatten kleinere of specifieke patronen die bruikbaar kunnen zijn.

| Repository | GitHub-link | Gerichte opbrengst |
|---|---|---|
| Sheetgo/classroom-attendance | https://github.com/Sheetgo/classroom-attendance | Eenvoudige invoer en automatische dashboards |
| OviSarkar62/GradeBook | https://github.com/OviSarkar62/GradeBook | Eenvoudig model voor klas, leerling, examen, gewicht en cijfer |
| fbatuhanr/StudentInformationSystem | https://github.com/fbatuhanr/StudentInformationSystem | Bulkattendance, datumbereiken en desktopachtige tabelinterface |
| najat-ttt/SAMS | https://github.com/najat-ttt/SAMS | Mobiele teacher-first attendance-interface |
| mo7amedgom3a/School-Management-System | https://github.com/mo7amedgom3a/School-Management-System | Recente Next.js- en ASP.NET-architectuur met rollen |
| projectfedena/fedena | https://github.com/projectfedena/fedena | Historisch schooladministratiemodel in Rails |
| OPTIMUM-LINKUP/open-source-school | https://github.com/OPTIMUM-LINKUP/open-source-school | Attendance, planner, gradebook, opdrachten en gedrag |
| PavanKumar1207/Student_management_system | https://github.com/PavanKumar1207/Student_management_system | Django-modellen, rollen, attendance en rapportage |
| mo7amedshaban/school-management-system | https://github.com/mo7amedshaban/school-management-system | Laravelstructuur, rollen, teacher-dashboard en attendance |

## 3. Alleen als negatieve of beveiligingsreferentie

Deze repositories mogen niet zonder grondige beveiligings- en licentiecontrole als basis worden gebruikt.

| Repository | GitHub-link | Waarom alleen negatief bestuderen |
|---|---|---|
| OS4ED/openSIS-Classic | https://github.com/OS4ED/openSIS-Classic | Volwaardig SIS, maar gemelde beveiligingsrisico's rond toegangscontrole |
| Yogndrr/MERN-School-Management-System | https://github.com/Yogndrr/MERN-School-Management-System | Gemelde problemen met authenticatie en wachtwoordopslag |
| Jadit19/Attendance-Tracker | https://github.com/Jadit19/Attendance-Tracker | Gebruikt gezichtsherkenning; onnodig en privacygevoelig voor dit project |

## 4. Aanbevolen combinatie voor ons eigen systeem

Geen van deze repositories moet rechtstreeks worden geforkt. De sterkste combinatie is:

- **GibbonEdu/core** — breed domeinmodel;
- **meesakveld/student-tracking-system** — leerlingoverzicht en coaching;
- **AliAkrem/track-your-classes** — snelle attendance en offline-first gebruik;
- **openedx/frontend-app-gradebook** — statussen, filters en audit trail;
- **danmarsden/moodle-mod-attendance** — lesmomenten en aanwezigheidsstatussen;
- **classroomio/classroomio** — moderne gebruikersinterface;
- **frappe/education** — modulaire architectuur.

## 5. Gewenste workflow die we zelf moeten ontwerpen

Er werd geen volwassen open-sourcerepository gevonden die deze volledige keten afdekt:

```text
Leerling afwezig
→ evaluatie gemist
→ inhaaltoets vereist
→ datum afspreken
→ ingepland
→ afgelegd
→ gecorrigeerd
→ afgesloten
```

Die workflow wordt daarom een eigen kernfunctie van het project.
