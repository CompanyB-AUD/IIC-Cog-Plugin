# Team ownership and task allocation

The backlog is organized around the three GitHub teams created by Company B. Each issue has one lead-team label and project Team value. Team labels do not assign individuals or grant repository permissions.

## Working rules

- Each lead team chooses one developer as assignee and a reviewer. Preserve existing assignments when reorganizing work.
- All teams is shared coordination for scope and Scrum, not a fourth development team.
- Child-issue ownership takes precedence over the epic coordinator for that task.
- Company A/B responsibility labels remain separate from internal Company B team labels.
- Priorities, milestones, status and acceptance criteria are unchanged by this allocation. Team task counts are not effort estimates; plan capacity using estimates and actual availability.
- Each team tests and documents its changes. Demo/QA work begins with small fixtures now and grows into full evaluation later.
- Dependencies permit concurrent work on agreed interfaces and labeled mocks where appropriate. Actual completion needs integrated evidence.

## Start concurrently

| Team | First actions | Handoff |
|---|---|---|
| Core and Integration | Agree #10 contract; build #13 shell, #22 registry, #17 settings; start #23 demo | Publish typed interfaces, mock adapters and a runnable extension; coordinate with Company A |
| UI/UX | Design #12 flows; build #14 toolbar against agreed mocks | Define control descriptors, focus behavior and settings interaction; connect to real core as it lands |
| Feature Implementation | Build #25 reading extraction and #28 spacing using shared fixtures | Expose lifecycle and content events through the agreed core; integrate and verify restoration |

Core does not need to finish its entire backlog before the other teams start. Agree the interface first and integrate small changes throughout the sprint.

## Cross-team handoffs

| Area | Lead and support |
|---|---|
| Reset and presets | Core owns reset/storage (#18); UI/UX owns controls and presets (#20) |
| Reading ruler and progress | UI/UX owns interaction/presentation (#29/#31); Feature Implementation supports targeting/chunk data and timing logic |
| Demo | Core owns harness/hosting (#23); UI/UX supplies layouts; Feature Implementation supplies sample content/media/motion |
| Captions and transcripts | UI/UX owns controls/rendering/search/seek (#35/#36); Feature Implementation supports media/cue adapters |
| Optional AI | Feature Implementation owns behavior (#33); Core supports gateway/privacy; UI/UX supports consent and output presentation |
| Barrier reports | Feature Implementation owns detection (#38); UI/UX supports layout and report copying (#39) |
| Evaluation | UI/UX coordinates keyboard/NVDA/usability (#41/#44); each team provides evidence and fixes its defects |
| Documentation and release | Core consolidates #45/#46; each team provides its section and acceptance evidence; UI/UX coordinates presentation #47 |

## Core and Integration

[GitHub team](https://github.com/orgs/CompanyB-AUD/teams/core-and-integration) · label `team:core-and-integration`

| Issue | Type | Task |
|---|---|---|
| [#2](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/2) | Epic | [E2] Preferences, presets and page state |
| [#3](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/3) | Epic | [E3] Module integration and demo environment |
| [#10](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/10) | Task | [E3] Agree the shared architecture and API contract with Company A |
| [#13](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/13) | Task | [E1] Build the installable Manifest V3 plugin shell |
| [#15](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/15) | Task | [E1] Implement per-site activation and complete teardown |
| [#17](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/17) | Task | [E2] Implement versioned local preferences and validation |
| [#18](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/18) | Task | [E2] Implement global and per-module reset |
| [#19](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/19) | Task | [E2] Preserve reading position across setting and mode changes |
| [#21](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/21) | Task | [E2] Export and import preference files |
| [#22](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/22) | Task | [E3] Implement module registry, lifecycle and failure isolation |
| [#23](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/23) | Task | [E3] Build the shared demonstration learning environment |
| [#24](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/24) | Task | [E3] Integrate Company A and B modules and test dynamic pages |
| [#40](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/40) | Task | [E8] Set up reproducible checks and pull-request workflow |
| [#42](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/42) | Task | [E8] Review permissions, privacy and service failure handling |
| [#43](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/43) | Task | [E8] Measure performance and browser compatibility |
| [#45](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/45) | Task | [E8] Complete proposal, design, architecture and user documentation |
| [#46](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/46) | Task | [E8] Complete regression testing and submit the release candidate |

## UI/UX

[GitHub team](https://github.com/orgs/CompanyB-AUD/teams/ui-ux) · label `team:ui-ux`

| Issue | Type | Task |
|---|---|---|
| [#1](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/1) | Epic | [E1] Plugin shell and shared toolbar |
| [#11](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/11) | Task | [E8] Validate stakeholder barriers and persona assumptions |
| [#12](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/12) | Task | [E1] Design toolbar wireframes and accessible interaction flows |
| [#14](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/14) | Task | [E1] Implement the shared toolbar and keyboard launcher |
| [#16](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/16) | Task | [E1] Add configurable toolbar docking |
| [#20](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/20) | Task | [E2] Add function-based reading and focus presets |
| [#29](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/29) | Task | [E5] Implement keyboard-operable reading ruler |
| [#31](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/31) | Task | [E5] Implement reading progress and adjustable time estimates |
| [#35](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/35) | Task | [E6] Style existing HTML media caption tracks |
| [#36](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/36) | Task | [E6] Build searchable interactive transcripts |
| [#39](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/39) | Task | [E7] Add copyable lecturer barrier reports |
| [#41](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/41) | Task | [E8] Evaluate keyboard, screen-reader and accessibility behavior |
| [#44](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/44) | Task | [E8] Conduct structured usability evaluation and analyze findings |
| [#47](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/47) | Task | [E8] Prepare the final presentation and live demonstration |

## Feature Implementation

[GitHub team](https://github.com/orgs/CompanyB-AUD/teams/feature-implementation) · label `team:feature-implementation`

| Issue | Type | Task |
|---|---|---|
| [#4](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/4) | Epic | [E4] Focus and distraction reduction |
| [#5](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/5) | Epic | [E5] Reading support and optional intelligent features |
| [#6](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/6) | Epic | [E6] Captions, transcripts and visual alerts |
| [#7](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/7) | Epic | [E7] Content barrier report for lecturers |
| [#25](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/25) | Task | [E4] Implement clean reading mode and restoration |
| [#26](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/26) | Task | [E4] Implement motion reduction on supported content |
| [#27](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/27) | Task | [E4] Add hide-distractions and focus spotlight controls |
| [#28](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/28) | Task | [E5] Implement text spacing, line width and font controls |
| [#30](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/30) | Task | [E5] Implement content chunking and section navigation |
| [#32](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/32) | Task | [E5] Present supported instructions as step checklists |
| [#33](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/33) | Task | [E5] Add opt-in passage simplification and key points |
| [#34](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/34) | Task | [E5] Add optional section readability indicators |
| [#37](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/37) | Task | [E6] Add visual alerts and missing-caption indicators |
| [#38](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/38) | Task | [E7] Implement local content barrier checks and lecturer guidance |

## All teams

Scope and Scrum records are jointly coordinated by the Product Owner, Scrum Master and team coordinators.

| Issue | Type | Task |
|---|---|---|
| [#8](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/8) | Epic | [E8] Accessibility, quality and evaluation |
| [#9](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/9) | Task | [E3] Confirm MVP priorities, roles and requirement traceability |
| [#48](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/48) | Task | [E8] Record Sprint 1 planning, Scrum evidence and integration review |
| [#49](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/49) | Task | [E8] Record Sprint 2 planning, Scrum evidence and integration review |
| [#50](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/50) | Task | [E8] Record Sprint 3 planning, Scrum evidence and integration review |
| [#51](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/51) | Task | [E8] Record Sprint 4 planning, Scrum evidence and integration review |
| [#52](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/52) | Task | [E8] Record Sprint 5 planning, Scrum evidence and integration review |

## Board use

Use the Core and Integration, UI/UX, Feature Implementation and Shared coordination views in the [project](https://github.com/orgs/CompanyB-AUD/projects/1). Team views show tasks, while the existing Epics view shows coordinating parent issues. When ownership changes, update both the Team field and the team label, and update this guide and the issue handoff notes. Do not change an individual assignee without coordinating the handoff.
