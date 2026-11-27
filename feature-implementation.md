# Feature Implementation: role and delivery guide

Branch: `team/feature-implementation` · [Team backlog](https://github.com/orgs/CompanyB-AUD/projects/1/views/9) · [Open team issues](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues?q=is%3Aissue%20is%3Aopen%20label%3Ateam%3Afeature-implementation) · [GitHub team](https://github.com/orgs/CompanyB-AUD/teams/feature-implementation)

## Mission

Implement the cognitive support and local content processing behind the shared controls. Keep feature transformations safe, reversible and compatible with the host page and Company A’s visual settings.

## Shared baseline

Read [dev.md](dev.md) and [AGENTS.md](AGENTS.md) before coding. They remain canonical on main and are inherited by this branch. Use the same Node 24/pnpm workspace, TypeScript strict, Preact, Vite/CRXJS, MV3 manifest and shared core contract as the other teams. Core establishes the exact dependency pins and executable scaffold once; consume that work through main. No team-specific replacement stack.

The initial baseline is documentation; installation/build commands become runnable when #13 is implemented. Do not claim an executable foundation already exists. Company A agreement remains #10.

## Start here

1. Develop #25 extraction and #28 spacing concurrently on shared fixtures after agreeing #10/#22 interfaces.
2. Clone and sanitize reading content, retain essential information, and demonstrate complete restoration.
3. Implement #26 supported motion reduction and #30 chunking; document unsupported cases and test each content type.
4. Provide paragraph/chunk/progress events for UI/UX’s #29/#31, keeping calculations in one agreed location.
5. Add #27/#32 and optional #33/#34/#37/#38 only according to priority and capacity; no external AI dependency in Must features.
6. Supply real module integration, essential-content checklists, edge-case fixtures, tests and honest limitations.

First issues: [#25](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/25), [#28](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/28), [#26](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/26), [#30](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/30). These are an implementation sequence, not new completed or Ready statuses.

## Planned file ownership

These directories are targets until the scaffold creates them. Coordinate overlapping files explicitly.

- modules/b-cognitive/ — extraction, spacing, motion, chunking and instructions; coordinate presentation components with UI/UX
- modules/b-hearing/ — optional supported media/event adapters; UI/UX owns caption/transcript interaction
- modules/b-barriers/ — optional local detection/ranking and author guidance
- Feature-specific unit tests and demo-site/ fixtures
- Module documentation and evaluation evidence for your features

## Interfaces and handoffs

- From Core: typed lifecycle, style ownership, preferences, position preservation, detectors and bus.
- To UI/UX: controls/descriptors, data/events, content anchors and documented empty/error states.
- For #35/#36: support media cue adapters while UI/UX owns rendering, transcript search/seek controls and interaction.
- For optional AI #33: Core supports the gateway/privacy boundary and UI/UX supports consent and original/output presentation.

Do not create a second toolbar, preference store, manifest or build system. Do not import private core/UI files or silently alter academic content, form state or quiz answers.

## Assigned tasks

| Issue | Priority | Task |
|---|---|---|
| [#25](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/25) | Must | [E4] Implement clean reading mode and restoration |
| [#26](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/26) | Must | [E4] Implement motion reduction on supported content |
| [#27](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/27) | Should | [E4] Add hide-distractions and focus spotlight controls |
| [#28](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/28) | Must | [E5] Implement text spacing, line width and font controls |
| [#30](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/30) | Must | [E5] Implement content chunking and section navigation |
| [#32](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/32) | Should | [E5] Present supported instructions as step checklists |
| [#33](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/33) | Should | [E5] Add opt-in passage simplification and key points |
| [#34](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/34) | Could | [E5] Add optional section readability indicators |
| [#37](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/37) | Should | [E6] Add visual alerts and missing-caption indicators |
| [#38](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/38) | Should | [E7] Implement local content barrier checks and lecturer guidance |

Coordinating epics: [#4](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/4), [#5](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/5), [#6](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/6), [#7](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/7). Child tasks can belong to another team; the child’s Team field identifies its lead.

## Concurrent work and integration

Use the agreed typed interfaces and clearly labeled mocks when another team’s implementation is unfinished. A native blocked-by link does not automatically prevent all useful work. Integrate real services before claiming completion. Test and document your own changes; there is no separate fourth QA/demo team.

Create a short-lived issue branch from `origin/team/feature-implementation` and open its PR into `team/feature-implementation`. The coordinator promotes small reviewed increments from `team/feature-implementation` into `main`, then synchronizes main back into the team branch. Use merge commits for those long-lived promotions/synchronizations, preserve shared history, and never force-push over colleagues. Baseline changes should land once on main, not be independently rewritten in all teams.

## Acceptance and reporting

- Choose one individual assignee and reviewer for each selected task; team ownership is not an assignment to every member.
- Preserve the issue’s criteria, priority and sprint until planning agrees a change.
- Show relevant unit/browser results plus keyboard, focus, reset/teardown, reading-position and failure evidence as applicable.
- Record what was not tested and any mocks or limitations. Never claim full integration from a screenshot or stub.
- Keep Scrum and scope coordination in the [shared view](https://github.com/orgs/CompanyB-AUD/projects/1/views/10); contribute your work to #9 and #48–#52.
- Close issues after accepted main integration; task PRs into a team branch alone are not final delivery.

## Coding-agent starter

> Read AGENTS.md, dev.md, feature-implementation.md and issue #NUMBER. Work on an issue branch based on team/feature-implementation. Use the shared baseline and public core contract, preserve the other teams’ files, and implement only this issue. Verify available checks, label mocks honestly, and prepare a PR into team/feature-implementation with acceptance evidence. Do not merge or change the shared stack unless my task explicitly authorizes it.
