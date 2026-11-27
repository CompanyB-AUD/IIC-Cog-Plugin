# UI/UX: role and delivery guide

Branch: `team/ui-ux` · [Team backlog](https://github.com/orgs/CompanyB-AUD/projects/1/views/8) · [Open team issues](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues?q=is%3Aissue%20is%3Aopen%20label%3Ateam%3Aui-ux) · [GitHub team](https://github.com/orgs/CompanyB-AUD/teams/ui-ux)

## Mission

Make the common extension usable and accessible. Own toolbar and control interaction, guided-reading presentation, keyboard/focus behavior and user-facing evaluation coordination.

## Shared baseline

Read [dev.md](dev.md) and [AGENTS.md](AGENTS.md) before coding. They remain canonical on main and are inherited by this branch. Use the same Node 24/pnpm workspace, TypeScript strict, Preact, Vite/CRXJS, MV3 manifest and shared core contract as the other teams. Core establishes the exact dependency pins and executable scaffold once; consume that work through main. No team-specific replacement stack.

The initial baseline is documentation; installation/build commands become runnable when #13 is implemented. Do not claim an executable foundation already exists. Company A agreement remains #10.

## Start here

1. Define #12 opening/closing, focus return, navigation, spacing and reset flows.
2. Build #14 against the agreed descriptors and a labeled mock preference client; connect to the real core as it lands.
3. Implement #16 docking and #20 presets when prioritized, without creating separate storage.
4. Own #29 ruler interaction and #31 progress/time presentation; agree targeting and progress events with Feature Implementation.
5. Handle #35/#36 caption/transcript presentation if Should capacity is approved; use the shared media/cue adapter.
6. Coordinate #11 research, #41 accessibility, #44 usability and #47 presentation, with contributions from every team.

First issues: [#12](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/12), [#14](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/14), [#20](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/20). These are an implementation sequence, not new completed or Ready statuses.

## Planned file ownership

These directories are targets until the scaffold creates them. Coordinate overlapping files explicitly.

- packages/core/src/ui/ — shared toolbar, controls, dialogs/notices and focus interaction
- extension/ popup/options presentation — coordinate entry/config files with Core
- Presentation components inside modules/b-cognitive/ and modules/b-hearing/ — coordinate exact files with Feature Implementation
- demo-site/ — representative layouts and UX fixtures
- docs/testing/ and user/UX documentation — consolidate findings with the other teams

## Interfaces and handoffs

- From Core: public settings API, descriptors, events and lifecycle; UI must not write its own settings store.
- From Feature Implementation: chunk/paragraph targeting, progress values, media cues and detection results.
- To both teams: semantic controls, keyboard behavior, loading/error/empty states, and actionable evaluation findings.
- Review #18 reset confirmation and #37/#38 alert/report presentation without taking over their processing logic.

Do not scaffold a standalone website or replace Preact with a different UI framework. Do not duplicate content extraction, chunking, or timing algorithms inside presentation components.

## Assigned tasks

| Issue | Priority | Task |
|---|---|---|
| [#11](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/11) | Must | [E8] Validate stakeholder barriers and persona assumptions |
| [#12](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/12) | Must | [E1] Design toolbar wireframes and accessible interaction flows |
| [#14](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/14) | Must | [E1] Implement the shared toolbar and keyboard launcher |
| [#16](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/16) | Should | [E1] Add configurable toolbar docking |
| [#20](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/20) | Should | [E2] Add function-based reading and focus presets |
| [#29](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/29) | Must | [E5] Implement keyboard-operable reading ruler |
| [#31](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/31) | Must | [E5] Implement reading progress and adjustable time estimates |
| [#35](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/35) | Should | [E6] Style existing HTML media caption tracks |
| [#36](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/36) | Should | [E6] Build searchable interactive transcripts |
| [#39](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/39) | Could | [E7] Add copyable lecturer barrier reports |
| [#41](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/41) | Must | [E8] Evaluate keyboard, screen-reader and accessibility behavior |
| [#44](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/44) | Must | [E8] Conduct structured usability evaluation and analyze findings |
| [#47](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/47) | Must | [E8] Prepare the final presentation and live demonstration |

Coordinating epics: [#1](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/1). Child tasks can belong to another team; the child’s Team field identifies its lead.

## Concurrent work and integration

Use the agreed typed interfaces and clearly labeled mocks when another team’s implementation is unfinished. A native blocked-by link does not automatically prevent all useful work. Integrate real services before claiming completion. Test and document your own changes; there is no separate fourth QA/demo team.

Create a short-lived issue branch from `origin/team/ui-ux` and open its PR into `team/ui-ux`. The coordinator promotes small reviewed increments from `team/ui-ux` into `main`, then synchronizes main back into the team branch. Use merge commits for those long-lived promotions/synchronizations, preserve shared history, and never force-push over colleagues. Baseline changes should land once on main, not be independently rewritten in all teams.

## Acceptance and reporting

- Choose one individual assignee and reviewer for each selected task; team ownership is not an assignment to every member.
- Preserve the issue’s criteria, priority and sprint until planning agrees a change.
- Show relevant unit/browser results plus keyboard, focus, reset/teardown, reading-position and failure evidence as applicable.
- Record what was not tested and any mocks or limitations. Never claim full integration from a screenshot or stub.
- Keep Scrum and scope coordination in the [shared view](https://github.com/orgs/CompanyB-AUD/projects/1/views/10); contribute your work to #9 and #48–#52.
- Close issues after accepted main integration; task PRs into a team branch alone are not final delivery.

## Coding-agent starter

> Read AGENTS.md, dev.md, ui-ux.md and issue #NUMBER. Work on an issue branch based on team/ui-ux. Use the shared baseline and public core contract, preserve the other teams’ files, and implement only this issue. Verify available checks, label mocks honestly, and prepare a PR into team/ui-ux with acceptance evidence. Do not merge or change the shared stack unless my task explicitly authorizes it.
