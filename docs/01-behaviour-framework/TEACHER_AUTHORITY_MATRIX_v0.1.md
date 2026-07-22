# Teacher Authority Matrix v0.1

**Status:** preliminary interpretation of the 2025-2026 school regulations  
**Important:** internal staff procedures can narrow or clarify these permissions. When uncertain, KlasKompas must choose the more restrictive route.

## 1. Authority statuses

| Status | Meaning in KlasKompas |
|---|---|
| `classroom_management_autonomous` | The teacher may use this as an immediate organisational or instructional response during their lesson. It is not presented as an official school sanction. |
| `factual_recording_autonomous` | The teacher may record observable facts and their own classroom action, without diagnosing, labelling or deciding an official measure. |
| `school_consultation_required` | KlasKompas may create a proposal or follow-up task, but the measure is only confirmed after the authorised school consultation/workflow. |
| `official_school_process` | The school/secretariat/behaviour coach/class council owns the process. KlasKompas can display or track it only when authorised. |
| `emergency_escalation` | Safety is restored immediately and the designated school route is activated. The ordinary warning ladder is skipped. |
| `director_only` | Only the director or delegate can decide. KlasKompas never recommends this as an automatic outcome. |
| `not_in_klaskompas_v1` | The information or action is outside the first-version scope. |

## 2. Matrix

| Action or topic | Preliminary status | What the teacher may do in KlasKompas | What KlasKompas must not do | Remaining confirmation |
|---|---|---|---|---|
| Preventive routine | `classroom_management_autonomous` | Configure entry, start task, attention signal, seating, device and closing routine | Treat a routine as a sanction | None for design |
| Non-verbal redirect | `classroom_management_autonomous` | Use proximity, eye contact or agreed signal | Register every small correction | None |
| Brief verbal reminder | `classroom_management_autonomous` | State observable behaviour and expected action | Debate, label or threaten | None |
| Assigned seat / seat change | `classroom_management_autonomous` | Assign or change a place to restore learning conditions | Present it as an official order measure or permanent punishment | Confirm local practice for long-term seat changes |
| Temporarily individual work | `classroom_management_autonomous` | Move a pupil from group work to individual work for the activity | Exclude the pupil from teaching or assessment without support | Confirm if prolonged use requires notification |
| Repeat entry/transition/clean-up routine | `classroom_management_autonomous` | Require the missed routine to be completed correctly | Use collective or humiliating punishment | None |
| Phone into numbered pouch | `classroom_management_autonomous` | Ask the pupil to place the device in the classroom pouch | Keep the device beyond the authorised routine or invent a confiscation period | Clarify refusal and end-of-lesson return process |
| Close laptop / switch to paper task | `classroom_management_autonomous` | Stop unauthorised device use and provide an equivalent task | Remove access needed for approved accommodations | Confirm Chromebook/laptop brochure |
| Documented classroom warning | `factual_recording_autonomous` | Record observable behaviour, expectation and announced classroom consequence | Call it an official school order measure unless confirmed | Clarify relation to agenda/Smartschool warning |
| Short conversation after lesson | `classroom_management_autonomous` + `factual_recording_autonomous` | Discuss behaviour, hear the pupil and record a short factual outcome | Store sensitive support/medical details | None for basic conversation |
| Simple restorative action | `classroom_management_autonomous` or `school_consultation_required` depending on scope | Agree a proportionate action such as restoring material, apologising voluntarily or completing missed clean-up | Force mediation, require public apology or conduct formal HERGO/No Blame alone | Clarify which restorative methods teachers may initiate |
| Note in school agenda / official Smartschool note | `school_consultation_required` until clarified | Prepare a preview or follow-up request | Publish automatically or without correct visibility/rights | Confirm school workflow and LVS fields |
| Punishment work | `school_consultation_required` | Propose and track only after confirmation | Automatically generate or impose repetitive/irrelevant writing | Clarify teacher autonomy in daily practice |
| Detention / study detention | `school_consultation_required` | Request or record confirmed measure and parent-notification status | Schedule or notify autonomously unless procedure permits | Confirm planner, responsible role and notification channel |
| Material service as formal order measure | `school_consultation_required` | Track confirmed restorative/service action | Assign unsafe, degrading or unrelated work | Confirm responsible role |
| Temporary removal from lesson | `school_consultation_required`; urgent removal may be immediate with notification | Trigger one-tap route to behaviour coach/delegate; record departure and handover | Send a pupil into corridors without destination/confirmation | Confirm immediate decision authority and handover protocol |
| Parent contact about ordinary learning/behaviour | `classroom_management_autonomous` for factual contact; formal notices may require consultation | Create a task, draft factual summary or log contact | Share data about other pupils or publish unconfirmed allegations | Confirm when class teacher/leadership must be included |
| Behavioural contract | `school_consultation_required` | Track objectives and review dates after school approval | Create a binding school contract automatically | Confirm owner: behaviour coach, student support or director |
| NAFT / formal support route | `official_school_process` | Display referral and status if authorised | Store full welfare dossier | Confirm integration and access |
| Official lateness count | `official_school_process` | Display imported status or reminder to verify Oase registration | Create parallel count or sanctions | Smartschool/Oase data availability |
| Official absence status | `official_school_process` | Display imported status; use lesson absence to suggest missed work | Decide whether absence is legally justified | Smartschool/secretariat integration |
| Ordinary make-up quiz/task | `classroom_management_autonomous` provisionally | Create and schedule make-up work for the teacher's own ordinary assessment | Override a school exemption or long-absence decision | Confirm subject-teacher authority and common deadlines |
| Examination make-up | `official_school_process` | Show status and school-scheduled time | Independently decide how/when official exams are made up | Oase/class council mapping |
| Fraud in ordinary task/test | `classroom_management_autonomous` within assessment rules | Record evidence and teacher's assessment decision | Infer intent without evidence or combine with behaviour score | Confirm departmental assessment policy |
| Suspected exam fraud | `official_school_process` | Record evidence and immediate measure needed for normal exam continuation | Decide fraud or final consequence | Class council process |
| Damage | `factual_recording_autonomous` + `school_consultation_required` | Record damage, witnesses and immediate safety response; request follow-up | Determine financial liability or amount | Confirm reporting route |
| Dangerous object | `emergency_escalation` | Restore safety and contact authorised school role | Use ordinary warning ladder | Confirm handover protocol |
| Violence / credible threat | `emergency_escalation` | Stop situation, summon help, separate where safe, record facts | Continue normal lesson ladder or investigate alone | Confirm emergency contacts |
| Bullying / sexual boundary violation | `emergency_escalation` / support procedure | Report via school route and preserve privacy | Resolve through forced face-to-face confrontation | Confirm internal route and visibility |
| Discriminatory/racist incident | `emergency_escalation` or `school_consultation_required` depending on severity | Stop behaviour and record exact words/actions where necessary | Minimise, reinterpret or label the pupil | Confirm escalation threshold |
| Disciplinary suspension/exclusion | `director_only` | Record referral or imported status only | Calculate, suggest as automatic result or communicate as decided | Locked by regulations |
| Medical/support details | `not_in_klaskompas_v1` | Store only a minimal neutral flag if school explicitly approves a necessary classroom accommodation | Store diagnosis, medication, health narrative or CLB dossier | Requires separate governance decision |

## 3. Safe default rule

When an action could reasonably be understood as an official order measure rather than ordinary classroom organisation, KlasKompas must:

1. label it `school_consultation_required`;
2. show the applicable school-policy note;
3. create a follow-up request rather than execute it;
4. store the confirmed decision separately from the teacher's initial proposal.

## 4. Required school confirmations

1. Does every official agenda/Smartschool warning require consultation, or may a teacher issue it independently?
2. May a teacher independently assign punishment work?
3. Who schedules detention and study detention?
4. May a teacher remove a pupil immediately and notify the behaviour coach afterwards, or is prior contact required?
5. Who may initiate parent contact for repeated classroom behaviour?
6. Which restorative practices may a subject teacher conduct independently?
7. What is the exact phone refusal/confiscation process?
8. What additional rules are in the Chromebook/laptop brochure?
9. Which ordinary assessments may the subject teacher schedule for make-up without Oase involvement?