# Teacher Authority Matrix v1.0

**Status:** Phase 1B consolidated interpretation  
**Warning:** internal school procedures may further restrict or clarify authority

## Authority statuses

| Status | Meaning |
|---|---|
| `teacher_working_view` | Teacher may maintain a private operational view; it is not an official school record. |
| `classroom_management_autonomous` | Teacher may act immediately to organise instruction and restore learning conditions. |
| `factual_recording_autonomous` | Teacher may record observable facts and their own action without diagnosing or deciding an official measure. |
| `teacher_instructional_follow_up` | Teacher may plan ordinary subject follow-up/remediation, without creating an official support dossier. |
| `school_consultation_required` | KlasKompas may prepare a proposal/request; official confirmation is required. |
| `official_school_process` | School/Oase/secretariat/class council/support route owns the official process. |
| `emergency_escalation` | Restore safety and activate the designated school route immediately. |
| `director_only` | Director/delegate decides. |
| `outside_v1` | Not stored or executed in KlasKompas v1. |

## Consolidated matrix

| Action/domain | Status | Teacher may do in KlasKompas | KlasKompas must not do | Open confirmation |
|---|---|---|---|---|
| Lesson attendance working status | `teacher_working_view` + `factual_recording_autonomous` | Mark lesson deviations and correct them auditably | Decide legal justification or replace official attendance | Import/update route |
| Official lateness count | `official_school_process` | Display imported status if authorised | Create parallel count or sanction | Oase data availability |
| Ordinary assessment | `teacher_instructional_follow_up` | Create own assessment and track missing pupils | Become full gradebook or override school policy | Department/school conventions |
| Ordinary make-up decision/scheduling | `teacher_instructional_follow_up` provisionally | Confirm requirement, exception, date and completion | Override official exemptions/long-absence decisions | Exact authority/deadlines |
| Official examination make-up | `official_school_process` | Track official status/date | Independently decide official date/conditions | Oase/class council mapping |
| Manual remediation | `teacher_instructional_follow_up` | Identify instructional need, plan action and review outcome | Auto-assign from scores, diagnose, create care dossier | Formal school remediation boundary if any |
| Preventive routine | `classroom_management_autonomous` | Configure entry, seating, attention, device and closing routines | Present routine as sanction | None for design |
| L1/L2 redirect/reminder | `classroom_management_autonomous` | Use brief, observable correction | Store every minor correction or label motivation | None |
| Seat change/temporary individual work | `classroom_management_autonomous` | Restore learning conditions for the lesson/activity | Present as permanent punishment or remove learning access | Long-term seat-change practice |
| Smartphone into numbered pouch | `classroom_management_autonomous` | Require pouch use during prohibited mode | Invent confiscation period or retain outside authorised routine | Receiving L5 route/consequence |
| Temporary pedagogical smartphone exception | `classroom_management_autonomous` | Activate bounded activity and end it | Create permanent pupil/class entitlement | None |
| Close laptop/paper alternative | `classroom_management_autonomous` | Stop unauthorised digital use with equivalent task | Remove approved assistive access | Laptop brochure |
| L3 internal classroom record | `factual_recording_autonomous` | Record observable behaviour and announced L4 response privately | Call it official warning or publish automatically | Boundary locked by D5 |
| L4 direct classroom response | `classroom_management_autonomous` + `factual_recording_autonomous` | Apply approved response and record outcome | Convert refusal into automatic sanction | L5 destination remains open |
| Short conversation/simple repair | `classroom_management_autonomous` + `factual_recording_autonomous` | Hear pupil, agree proportionate action, record concise outcome | Force public apology/mediation or store sensitive narrative | Formal restorative boundary |
| Parent-contact task | `teacher_working_view`; factual contact often teacher-owned | Plan, draft and log factual own-lesson contact | Treat as automatic official warning or disclose other pupils | When leadership/class teacher included |
| Official warning/agenda/Smartschool/LVS note | `school_consultation_required` until confirmed | Prepare separate linked preview/request | Promote L3/L4 automatically or publish without rights/visibility | Exact module, authority, fields |
| Punishment work/detention/service | `school_consultation_required` | Propose/track confirmed measure | Auto-generate, schedule or impose | Internal procedure |
| Temporary removal from class | `school_consultation_required`; urgent route may be immediate | Trigger destination/handover workflow | Send pupil away without confirmed destination | Prior approval vs later notification |
| Behaviour contract/formal support | `official_school_process` | Track authorised status/objectives where approved | Create binding contract or full support dossier | Process owner/access |
| Damage | `factual_recording_autonomous` + `school_consultation_required` | Record facts and immediate response; request follow-up | Decide liability/amount | Reporting route |
| Violence/threat/dangerous object | `emergency_escalation` | Stop, secure, summon support, record facts | Use ordinary warning ladder or investigate alone | Handover contacts |
| Bullying/sexual boundary/severe discrimination | `emergency_escalation` or restricted school route | Report factually and preserve privacy | Force confrontation or minimise | Exact internal route |
| Suspension/exclusion | `director_only` | Track referral/imported status | Suggest/calculate/communicate as decided | Locked boundary |
| Medical/CLB/care narrative | `outside_v1` | Store only minimal approved classroom accommodation flag if authorised | Store diagnosis, medication or dossier narrative | Separate governance needed |

## Safe default

When uncertain whether something is ordinary teacher follow-up or an official school measure:

1. keep the teacher record private;
2. label the next step `school_consultation_required`;
3. create a separate proposal/request;
4. wait for an authorised confirmation;
5. keep parent contact, official record and external publication as separate lifecycles.
