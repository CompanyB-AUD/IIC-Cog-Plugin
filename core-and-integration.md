# Core and Integration: role and delivery guide

Branch: `team/core-and-integration` · [Team backlog](https://github.com/orgs/CompanyB-AUD/projects/1/views/7) · [Open team issues](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues?q=is%3Aissue%20is%3Aopen%20label%3Ateam%3Acore-and-integration) · [GitHub team](https://github.com/orgs/CompanyB-AUD/teams/core-and-integration)

## Mission

Provide the single extension foundation and keep both companies’ modules compatible. Own installation, runtime coordination, the shared contract, preferences, lifecycle, integration and release.

## Shared baseline

Read [dev.md](dev.md) and [AGENTS.md](AGENTS.md) before coding. They remain canonical on main and are inherited by this branch. Use the same Node 24/pnpm workspace, TypeScript strict, Preact, Vite/CRXJS, MV3 manifest and shared core contract as the other teams. Core establishes the exact dependency pins and executable scaffold once; consume that work through main. No team-specific replacement stack.

The initial baseline is documentation; installation/build commands become runnable when #13 is implemented. Do not claim an executable foundation already exists. Company A agreement remains #10.

## Start here

1. Record #10 decisions and publish the typed contract and mock adapter before dependent teams diverge.
2. Build #13 as one root workspace, pin compatible tool versions, and verify a clean install/build/load.
3. Implement #22 lifecycle with repeat application, full teardown and isolated failures.
4. Implement #17/#18 settings validation, persistence and reset, then #19 content-anchor position preservation.
5. Start the minimal #23 demo early; integrate a stub and then real modules in #24.
6. Coordinate CI, privacy/performance review, complete documentation and release evidence.

First issues: [#10](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/10), [#13](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/13), [#22](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/22), [#17](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/17), [#23](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/23). These are an implementation sequence, not new completed or Ready statuses.

## Planned file ownership

These directories are targets until the scaffold creates them. Coordinate overlapping files explicitly.

- extension/ — manifest, entry points, worker and activation; coordinate popup/options UI with UI/UX
- packages/core/src/contract.ts and public exports — one module API
- packages/core/src/ — registry, preferences, events, styles, position and detection services; UI components belong to UI/UX
- Root toolchain/config/lockfile and .github/workflows/ — one build and CI
- demo-site/ — harness/hosting; fixtures are contributed by all teams

## Interfaces and handoffs

- To UI/UX: setting/control descriptors, preference client, notifications and keyboard launcher integration points.
- To Feature Implementation: module lifecycle, styles/tokens, content detector, position service and typed bus.
- From both teams: fixture requests, API feedback, module exports, acceptance results and measured issues.
- With Company A: versioned API, style/font ownership, integration packaging and shared review cadence.

Do not duplicate UI components owned by UI/UX or implement cognitive algorithms in the service worker. Do not require the other teams to wait for every core task before using the agreed contract.

## Assigned tasks

| Issue | Priority | Task |
|---|---|---|
| [#10](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/10) | Must | [E3] Agree the shared architecture and API contract with Company A |
| [#13](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/13) | Must | [E1] Build the installable Manifest V3 plugin shell |
| [#15](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/15) | Must | [E1] Implement per-site activation and complete teardown |
| [#17](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/17) | Must | [E2] Implement versioned local preferences and validation |
| [#18](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/18) | Must | [E2] Implement global and per-module reset |
| [#19](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/19) | Must | [E2] Preserve reading position across setting and mode changes |
| [#21](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/21) | Could | [E2] Export and import preference files |
| [#22](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/22) | Must | [E3] Implement module registry, lifecycle and failure isolation |
| [#23](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/23) | Must | [E3] Build the shared demonstration learning environment |
| [#24](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/24) | Must | [E3] Integrate Company A and B modules and test dynamic pages |
| [#40](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/40) | Must | [E8] Set up reproducible checks and pull-request workflow |
| [#42](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/42) | Must | [E8] Review permissions, privacy and service failure handling |
| [#43](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/43) | Must | [E8] Measure performance and browser compatibility |
| [#45](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/45) | Must | [E8] Complete proposal, design, architecture and user documentation |
| [#46](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/46) | Must | [E8] Complete regression testing and submit the release candidate |

Coordinating epics: [#2](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/2), [#3](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/3). Child tasks can belong to another team; the child’s Team field identifies its lead.

## Concurrent work and integration

Use the agreed typed interfaces and clearly labeled mocks when another team’s implementation is unfinished. A native blocked-by link does not automatically prevent all useful work. Integrate real services before claiming completion. Test and document your own changes; there is no separate fourth QA/demo team.

Create a short-lived issue branch from `origin/team/core-and-integration` and open its PR into `team/core-and-integration`. The coordinator promotes small reviewed increments from `team/core-and-integration` into `main`, then synchronizes main back into the team branch. Use merge commits for those long-lived promotions/synchronizations, preserve shared history, and never force-push over colleagues. Baseline changes should land once on main, not be independently rewritten in all teams.

## Acceptance and reporting

- Choose one individual assignee and reviewer for each selected task; team ownership is not an assignment to every member.
- Preserve the issue’s criteria, priority and sprint until planning agrees a change.
- Show relevant unit/browser results plus keyboard, focus, reset/teardown, reading-position and failure evidence as applicable.
- Record what was not tested and any mocks or limitations. Never claim full integration from a screenshot or stub.
- Keep Scrum and scope coordination in the [shared view](https://github.com/orgs/CompanyB-AUD/projects/1/views/10); contribute your work to #9 and #48–#52.
- Close issues after accepted main integration; task PRs into a team branch alone are not final delivery.

## Coding-agent starter

> Read AGENTS.md, dev.md, core-and-integration.md and issue #NUMBER. Work on an issue branch based on team/core-and-integration. Use the shared baseline and public core contract, preserve the other teams’ files, and implement only this issue. Verify available checks, label mocks honestly, and prepare a PR into team/core-and-integration with acceptance evidence. Do not merge or change the shared stack unless my task explicitly authorizes it.
