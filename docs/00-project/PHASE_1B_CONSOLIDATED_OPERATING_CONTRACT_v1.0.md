# Phase 1B — Consolidated Operating Contract v1.0

**Status:** consolidation candidate for project-owner review  
**Date:** 22 July 2026  
**Project:** KlasKompas  
**Primary user:** one teacher  
**Data gate:** fictional data only until school governance approval

## 1. Product identity

KlasKompas is a personal teacher overview and follow-up tool. Its purpose is to help one teacher keep an accurate, actionable and auditable working overview of:

- classes and pupils;
- lesson-level attendance exceptions;
- missed assessments;
- make-up assessments;
- manually indicated remediation;
- classroom behaviour and immediate responses;
- conversations, repair and other follow-up actions;
- school-follow-up proposals and external publication status;
- history, corrections and synchronisation problems.

KlasKompas is not a replacement for Smartschool, Wis@d, Oase, Skore, an official pupil-tracking dossier, a full gradebook or a care dossier.

## 2. Core product promise

The application answers, at any moment:

1. What requires my attention today?
2. Which pupil was absent or late in my lesson?
3. Who missed which assessment?
4. Which make-up assessment still needs a decision, date, completion, correction or closure?
5. For whom have I identified remediation, what is planned and when must I review it?
6. Which classroom follow-up conversation or repair action is due?
7. Which school-follow-up or parent-contact action is still open?
8. Which changes are pending, failed or conflicted across my devices?

The system supports professional judgement. It does not replace it with automatic sanctions, risk scores or automatic remediation decisions.

## 3. Integrated modules

### A. Classes, pupils and lesson sessions

- roster and class membership;
- subject and school-year context;
- active lesson session;
- configured routines and seat plan;
- external Smartschool/OneRoster identifiers where approved.

### B. Today dashboard

One private overview containing only actionable exceptions and due work:

- current and next lessons;
- attendance exceptions or unresolved attendance;
- missed assessments awaiting a decision;
- unscheduled or due make-up assessments;
- completed make-up work awaiting correction or closure;
- remediation to plan, perform or review;
- behaviour conversations and repair actions;
- school-follow-up and parent-contact tasks;
- unresolved serious handovers where applicable;
- pending, failed or conflicted synchronisation.

No combined pupil risk score or public ranking is created.

### C. Attendance working view

- every pupil starts as present for the lesson;
- the teacher records only deviations: absent, late, partly present or unknown;
- corrections remain auditable;
- official legal attendance and lateness remain owned by the school system;
- an absence can create a missed-assessment candidate when an assessment occurred in that lesson.

### D. Assessments and make-up work

The teacher can create an ordinary assessment and indicate whether an absent pupil must make it up.

The system distinguishes:

- teacher-owned ordinary assessment follow-up;
- official examination make-up owned by Oase/director/class council;
- exemption or no make-up required;
- decision still required.

A make-up workflow continues until it is closed, not merely until a date is scheduled.

### E. Remediation

KlasKompas supports **manual remediation tracking** as personal teacher follow-up.

A teacher may indicate remediation because of:

- an assessment result observed by the teacher;
- a missed prerequisite or skill;
- repeated difficulty during lessons;
- a completed make-up assessment;
- another factual teaching observation.

The tool records a limited instructional objective, planned action, status, deadline/review date and outcome. It does not automatically infer remediation from marks, calculate a risk level, diagnose a learning problem or become a care dossier.

The earlier exclusion of `remediation based on grades` means that automatic score-driven assignment remains out of scope. It does not exclude teacher-confirmed remediation follow-up.

### F. Behaviour and classroom management

The approved D1-D6 contract applies:

- six universal expectations;
- L0-L5 classroom route plus separate serious route;
- L3 is an internal classroom record with announced response;
- approved L4 response map;
- repeated-behaviour review by lesson contacts, never an automatic sanction;
- Dutch-first pupil-facing and official language;
- smartphone prohibition with a temporary teacher-authorised pedagogical exception;
- internal records remain separate from official school records and Smartschool/LVS publication.

### G. Follow-up actions

A follow-up action may originate from:

- attendance;
- a missed assessment;
- make-up work;
- remediation;
- behaviour;
- parent contact;
- school consultation;
- a manual teacher note;
- a synchronisation or data-correction problem.

Every action has a source, owner, status, due/review date where relevant and audit history.

### H. Pupil overview

The private pupil overview contains separate sections for:

- open actions;
- attendance working history;
- assessments and make-up work;
- remediation;
- internal classroom records and responses;
- conversations and repair;
- parent contact;
- school-follow-up and official-publication references;
- audit history.

The sections are not merged into one score, colour or label.

### I. History and audit

Meaningful changes record:

- previous and new value;
- time;
- teacher/device/session;
- source context;
- reason where required;
- synchronisation/publication result;
- correction or withdrawal relationship;
- external identifier where available.

## 4. Device contract

- laptop: dedicated command centre and primary overview;
- tablet: touch-first classroom and seat-plan view;
- phone: rapid search, attendance and quick action entry;
- connected devices share one canonical lesson state;
- accepted changes propagate automatically without refresh;
- normal-connectivity product target: within two seconds after server acceptance;
- pending, failed and conflict states remain visible;
- no silent overwrite or duplicate mutation.

## 5. Smartschool boundary

Smartschool remains the official school environment.

KlasKompas may, after approval:

- read roster data through official OneRoster;
- use official OAuth for teacher identity;
- prepare official publication objects;
- publish only through a confirmed official endpoint, field mapping and rights model.

Cross-device KlasKompas synchronisation is not Smartschool publication. Internal records, make-up tracking and remediation can be synchronised between the teacher's devices while remaining local to KlasKompas.

## 6. Privacy and governance boundary

Before real pupil data:

- written school-purpose approval;
- approved processing roles and data inventory;
- hosting and processor approval;
- access, retention, rights and incident procedures;
- approval of encrypted temporary device queues;
- Smartschool clients/scopes where used;
- fictitious-data test and explicit launch decision.

Medical history, diagnoses, medication, CLB narratives, recordings, biometrics, emotion detection and inferred risk or motivation are excluded.

## 7. September prototype scope

The fictitious-data prototype must demonstrate:

1. class and pupil overview;
2. lesson start and rapid attendance exceptions;
3. ordinary assessment creation;
4. automatic identification of pupils who missed that assessment from the lesson working view;
5. teacher confirmation of make-up requirement or exception;
6. make-up follow-up through scheduling, completion, grading and closure;
7. manual creation and follow-up of remediation;
8. D1-D6 classroom-management route;
9. one Today dashboard for all open actions;
10. private pupil overview with separate domains;
11. cross-device synchronisation and visible conflict/offline states;
12. correction and withdrawal without silent history deletion.

## 8. Explicitly outside the first prototype

- complete gradebook and report calculations;
- automatic remediation based on a percentage or algorithm;
- automatic sanctions or behaviour scores;
- pupil, parent or colleague accounts;
- full parent communication platform;
- shared care dossier or medical narrative;
- unofficial Smartschool automation;
- automatic official LVS publication without the external approvals.

## 9. Remaining external blockers

These do not block a fictitious prototype but do block real-data production use:

- 2026-2027 school regulations;
- internal staff procedure for official order measures and class removal;
- Chromebook/laptop brochure;
- Smartschool administrator, OneRoster and OAuth access;
- official LVS destination, fields, visibility, rights and write endpoint;
- privacy, hosting, processor, retention and launch approval.

## 10. Supersession rule

This contract consolidates the approved Phase 1B-D1 through D6 decisions and the operational scope clarification on manual remediation. Detailed approved decision files remain the authority for their specific topic. Earlier drafts remain historical evidence but may not override this v1.0 contract.
