# Domeinmodel v0.1

## Kernentiteiten

- `User`
- `SchoolYear`
- `Subject`
- `ClassGroup`
- `Student`
- `Enrollment`
- `LessonSession`
- `AttendanceRecord`
- `Assessment`
- `AssessmentParticipation`
- `MakeupAssessment`
- `BehaviourExpectation`
- `BehaviourEvent`
- `Intervention`
- `FollowUpAction`
- `AuditEvent`

## Belangrijke relaties

- een leerling is via een inschrijving aan een klas gekoppeld;
- een lesmoment behoort tot een klas en vak;
- aanwezigheid koppelt een inschrijving aan een lesmoment;
- een evaluatie behoort tot een klas/vak en kan aan een lesmoment gekoppeld zijn;
- een inhaaltoets koppelt leerling en evaluatie;
- een gedragsgebeurtenis koppelt leerling, klas, lesmoment en verwachting;
- een opvolgactie verwijst naar precies één primaire bron, maar kan aanvullende context hebben;
- iedere betekenisvolle mutatie kan een auditgebeurtenis opleveren.
