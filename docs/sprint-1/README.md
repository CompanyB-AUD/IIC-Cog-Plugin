# Sprint 1: Discovery, requirements and shared foundation

**Company B · Cognitive + hearing accessibility module**
**Sprint dates:** 13–19 November 2026
**Sprint goal (from the brief):** An approved product backlog and a shared architectural foundation.

## Contents

| # | Document | What it covers |
|---|---|---|
| 1 | [Stakeholders and barriers](01-stakeholders-and-barriers.md) | Who is affected, what blocks them, and which barriers a browser plugin can and cannot fix |
| 2 | [Personas](02-personas.md) | Five personas, including the three types the brief requires |
| 3 | [MVP scope, epics and acceptance criteria](03-mvp-scope-and-epics.md) | Scope decision and justification, epics, MoSCoW priorities, testable acceptance criteria, Definition of Done |
| 4 | [Shared architecture and APIs](04-architecture-and-apis.md) | Proposal for the joint meeting with Company A: plugin structure, module contract, preference schema, messaging, permissions |

## Scope decision in one paragraph

Company B will build a **cognitive-first module with a light hearing layer**. Cognitive support is the main deliverable: reading mode, distraction reduction, text spacing, chunking, guided reading and progress indicators. These features work on any text-based learning page and can be tested on any web page. The hearing layer is limited to features we can build reliably in the browser: styled captions and an interactive transcript for media that **already has caption tracks**, plus visual alerts for in-page audio events. We do **not** promise automatic speech-to-text captioning in the MVP. That depends on capturing tab audio and on speech-recognition accuracy for Ghanaian English, and neither can be built and properly evaluated in five weeks. Full justification is in [document 3](03-mvp-scope-and-epics.md#1-scope-decision).

## Open items before sprint review

- [ ] Product Owner confirms the epic priorities in document 3.
- [ ] Joint meeting with Company A agrees the decisions marked **🔶 needs agreement** in document 4.
- [ ] Confirm which LMS Ashesi uses, so the demo environment looks like it.
- [ ] Plan 3–5 short, voluntary interviews to check the persona assumptions (marked *Assumption* in document 2).
- [ ] Create the Scrum board, with one epic per board label or parent issue.
