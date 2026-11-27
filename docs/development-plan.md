# Development plan

Planning baseline: 24 November 2026, Africa/Accra. This is a proposed sequence, not a record of work completed or a promise that every backlog item fits the available capacity.

## Outcome

Deliver one installable, integrated extension with useful cognitive support, accessible controls, saved preferences, reliable reset, evaluation evidence and the required documentation. Keep the limited hearing layer and AI as Should work; retain Could tasks as unscheduled stretch work. The full Must list remains the approved-backlog candidate until the Product Owner confirms scope.

## Immediate team kickoff

1. Review #9: confirm priorities, team roles and what is genuinely complete. Sprint 1 has elapsed; link real evidence and record gaps.
2. Resolve #10 with Company A: core interface, style ownership, preferences, repository arrangement and first integration date. Record decisions before teams diverge.
3. Assign each selected task one owner and one reviewer; estimate it together. Avoid assigning the entire backlog to everyone.
4. Select a small Sprint 2 slice that fits the remaining 24–26 November window. Carry unfinished foundation work forward transparently; update both Sprint field and milestone when the team accepts a change.
5. Build a single working path: install → activate → toolbar → change one setting → persist → reset. Share a demonstration before broad feature work.

## Three concurrent development teams

Use the three actual GitHub teams below. Each currently has four memberships, with the organization owner included in all three; do not treat this as twelve distinct available developers. Confirm individual capacity during planning. Product Owner and Scrum Master responsibilities can be held alongside development work.

| GitHub team | Initial work | Continuing responsibility |
|---|---|---|
| Core and Integration | #10, #13, #22, #17 and a basic #23 fixture | Shell, API, storage/reset/position, integration, CI, security/performance and release |
| UI/UX | #12 and #14 against the agreed contract/mocks | Toolbar, presets, ruler/progress interaction, caption/transcript UI, accessibility and usability coordination |
| Feature Implementation | #25 and #28 on shared sample content | Reading/content processing, motion, chunking, instructions and optional AI/media/barrier detection |

See [team ownership](team-ownership.md) for every issue and cross-team handoffs. The issue's Team field and `team:*` label identify the lead team; the individual assignee and reviewer are chosen by that team. Epic ownership coordinates an area but does not override a child issue's lead team.

There is no separate demo/QA/documentation team. Each team tests and documents its own changes. Core coordinates the shared demo harness and release; UI/UX coordinates user/accessibility evaluation; Feature Implementation contributes representative fixtures and feature evidence. Create the minimum demo and test fixtures early; expand evaluation and documentation in later sprints. All teams work concurrently after agreeing interfaces, using labeled mocks where a service is unfinished. Optional work gets capacity only after Must progress is checked.

## Sequence and sprint checkpoints

| Window | Focus | Demonstrable checkpoint |
|---|---|---|
| 24–26 Nov: remaining Sprint 2 | Recover decisions; agree contract; scaffold; demo fixture; one toolbar control with persistence/reset | A clean clone can build and load the extension, and the basic end-to-end path works. If not achievable, record the shortfall and carry it forward explicitly. |
| 27 Nov–3 Dec: Sprint 3 | Expand reading mode/spacing, position service, ruler, chunking, motion and progress; integrate with Company A | One shared extension demonstrates core cognitive journeys and combined settings on agreed pages. |
| 4–10 Dec: Sprint 4 | Manual/automated testing, user evaluation, performance/privacy review and defect repair | Stable tested MVP with evidence and limitations; optional features only where capacity remains. |
| 11–17 Dec: Sprint 5 | Freeze scope, regression checks, documentation, release packaging and rehearsal | Installable release candidate, complete deliverables and rehearsed live demo. |
| 18 Dec | Final presentation | 20-minute presentation and demonstration, followed by 10-minute Q&A. |

The original milestone dates remain unchanged by this document. Proposed changes must be reflected on the board after planning. Do not mark Sprint 1 tasks done because their due date has passed.

## How work can proceed in parallel

- Once the contract is agreed, toolbar, storage, feature logic and test fixtures can proceed concurrently using typed mocks.
- Reading extraction can be developed on fixtures while the position service is built. Completion requires their real integration.
- Pure chunking/timing functions and tests can start before the full reading UI exists; the final journey needs reading mode, navigation and persistence.
- UI designers and QA can define keyboard flows, essential-content checklists and evaluation protocols before the build is ready.
- Native dependency badges show prerequisite relationships. Use Blocked status only when there is no useful next step and explain the specific blocker. Resolve a dependency or revise an over-strict link through planning; do not pretend a mock fulfills it.

## Daily working loop

1. Check the board and agree the next task. Keep one primary active implementation task per developer where practical.
2. Read its criteria and `dev.md`; if using an agent, have it read `AGENTS.md` explicitly.
3. Work on an issue branch. Test the changed behavior and its restoration/failure cases.
4. Open a focused PR with evidence, request the designated reviewer, and set In Review.
5. Integrate small reviewed changes frequently. Resolve shared-contract changes with Company A. Aim for at least two integrated builds per sprint and one joint integration meeting each week, subject to the recorded agreement.
6. Record a brief Daily Scrum update: completed, next, blocker/needed help. Link actual evidence in the sprint issue.

## Scope control

Must work is prioritized before Should. AI, transcripts and lecturer reports must not consume the time needed to make the core extension accessible and stable. If the full Must list is too large, the Product Owner must agree a narrower demonstrable backlog with the lecturer; do not silently drop requirements or reclassify them as completed.

The source requirements include tensions to resolve explicitly: FR08/FR09 versus a cognitive-first scope, reliable motion handling, privacy wording for per-site hostnames, and AI selected-text versus current-chunk consent. Use #9/#10 and issue acceptance notes rather than allowing each developer to make a different assumption.

## Review and release gates

- Foundation: reproducible build; agreed contract; functional controls; saved settings; reset; isolated module errors.
- Cognitive increment: essential content retained, keyboard journeys usable, current position preserved, host page restored and offline Must features working.
- Integration: actual Company A and B modules together, no style/storage conflicts, dynamic page and failure cases checked.
- Release: meaningful acceptance evidence, critical defects resolved, known limitations stated, docs consistent with shipped behavior, installation verified from a clean package.

Never equate merged code, a green scanner or an agent's confidence with full acceptance. A human developer owns the review of agent-generated code and its evidence.

## Required delivery package

Use #45–#47 to track proposal, requirements/personas/stories, UX package, architecture/API/data flows, working extension, versioned Git release, testing/evaluation report, Scrum evidence, user/developer guides and final presentation. Rehearse the six-minute live demo within the twenty-minute presentation and prepare recovery steps for a failed network or unsupported page.
