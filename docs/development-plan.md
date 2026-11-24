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

## Suggested workstreams for a twelve-person team

These are proposed responsibility groups, not named assignments or fixed staffing. Rebalance by experience and availability. Product Owner and Scrum Master duties are explicit but can be held alongside a workstream.

| Workstream | Suggested people | Initial work | Later responsibility |
|---|---:|---|---|
| Shared foundation / integration | 3 | #10, #13, #22, #17, #18, #19 | Contract, worker, settings, Company A integration #24 |
| Toolbar / accessible UX | 2 | #12, #14, #15 | Focus behavior, presets, keyboard and NVDA collaboration |
| Cognitive features | 4 | Pair on #25 and #28 | #26 motion, #29 ruler, #30 chunking, #31 progress |
| Demo / QA / research / documentation | 3 | #11, #23, test fixtures and #40 | Evaluation #41–#44, docs #45, release/presentation evidence |

Quality remains every developer's responsibility. QA defines acceptance fixtures early, not only after implementation. Optional work gets capacity only after the Product Owner checks Must progress. No developer is assumed to belong to Company A.

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
