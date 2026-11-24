# Developer guide

Updated: 24 November 2026. Audience: developers, reviewers and coding agents.

## 1. What we are building

A desktop Chromium browser extension that helps students read and navigate learning material through focus modes, configurable typography, guided reading, chunking and progress. Company B integrates with Company A's visual-accessibility module through one shared toolbar and core.

Must features operate locally without an AI service. The repository's scope is **cognitive first with a limited hearing layer**. Existing-caption styling, transcripts, sound indicators and optional AI are Should work; settings export, readability scores and report copying are Could work. No automatic speech recognition, universal website repair, mobile extension, cloud accounts or built-in PDF-viewer support is promised.

Project: https://github.com/orgs/CompanyB-AUD/projects/1

Requirements: [MVP and epics](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/03-mvp-scope-and-epics.md), [architecture proposal](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/04-architecture-and-apis.md), [personas](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/02-personas.md).

## 2. Current implementation status

When this guide was written, `main` contained documentation/templates, and requirements lived on `sprint-1`. There was no `package.json`, lockfile, manifest, application code or test suite. The directories and commands below are the **proposed scaffold contract**, not a claim that a working build exists. Issue #13 must establish and verify it; update this guide when the scaffold lands.

Shared architecture decisions remain open in #10. This guide recommends one baseline so developers can prepare consistently; it does not claim Company A has accepted it. After agreement, record exact versions and choices in `docs/adr/0001-development-baseline.md` and the relevant manifests.

## 3. Proposed stack

| Area | Baseline | Purpose / decision |
|---|---|---|
| Browser | Chrome stable desktop; Edge best-effort | Record the tested browser/version; no universal compatibility claim |
| Extension | Manifest V3 | Content scripts, service worker, action popup and options page |
| Language | TypeScript, strict mode | Typed shared contract, settings and messages |
| Runtime for tooling | Node.js 24 LTS | Pin an exact supported patch in the scaffold and use it in CI |
| Package manager | pnpm workspaces | Pin exact pnpm in `packageManager`; commit one lockfile |
| Build | Vite + `@crxjs/vite-plugin` | First verify a compatible version pair with the chosen Node and UI plugin; pin it |
| UI | Preact + `@preact/preset-vite` | Small toolbar/options components; host the injected toolbar in Shadow DOM |
| Styling | Plain CSS and shared custom properties | Keep scope small; no separate CSS framework needed for MVP |
| Preferences | `chrome.storage.local` behind the shared core API | Local, versioned and validated; no database or login service |
| Main-content extraction | `@mozilla/readability` | Heuristic extraction on a cloned document, with safe fallback |
| HTML sanitization | DOMPurify | Sanitize extracted markup; preserve a reviewed semantic allowlist |
| Unit/component tests | Vitest, DOM test environment, Testing Library for Preact | Pure logic, lifecycle, settings and user-facing controls |
| Browser tests | Playwright bundled Chromium | Persistent extension context and isolated profile |
| Accessibility checks | axe-core integration plus keyboard and NVDA | Automated checks supplement manual evaluation |
| Quality | ESLint, Prettier, TypeScript checks | One shared configuration; avoid competing formatters |
| CI | GitHub Actions | Reproducible install, checks, build and browser tests when scaffold exists |
| Demo | Local static LMS fixtures; GitHub Pages if agreed | Common content and repeatable scenarios for both companies |
| Optional AI | Provider-neutral client, service-worker gateway, server-side proxy | Defer provider and hosting; no AI infrastructure in the Must path |

Node 24 remains an LTS line in the [Node release table](https://nodejs.org/en/about/previous-releases). Check the [Vite guide](https://vite.dev/guide/) and [CRXJS repository](https://github.com/crxjs/chrome-extension-tools) for supported versions before pinning: installing the latest of every package is not a compatibility strategy. If the build spike finds a real incompatibility, record a single agreed alternative rather than allowing each feature team a different build setup.

## 4. Target repository structure

```text
extension/                 # Manifest, action popup, options, content entry, service worker
packages/core/             # Contract, toolbar, registry, settings, styles, position, events
modules/b-cognitive/       # Reading mode, spacing, motion, ruler, chunking, progress
modules/b-hearing/         # Optional existing-caption/transcript/alert features
modules/b-barriers/        # Optional lecturer-facing local checks
modules/a-visual/          # Company A code, only under the agreed integration arrangement
demo-site/                 # Shared LMS pages and licensed/synthetic media
tests/e2e/                 # Cross-feature and installed-extension journeys
docs/adr/                  # Accepted decisions and rationale
docs/testing/              # Test protocols, results and limitations
docs/templates/            # Sprint evidence and reusable records
.github/                   # CI, issue forms, PR template
AGENTS.md                  # Agent-specific working instructions
dev.md                     # This guide
pnpm-workspace.yaml        # Created by scaffold task
package.json               # Created by scaffold task
pnpm-lock.yaml             # Created by scaffold task
```

This refines the older proposal's single `b-cognitive-hearing` directory into separate feature packages. Confirm the layout in #10 before creating it; package boundaries may change, the shared core contract may not be duplicated. If Company A uses a separate repository, agree a package/artifact integration strategy rather than inventing its source tree here.

## 5. Runtime architecture

| Context | Responsibility | Boundary |
|---|---|---|
| Content script | Toolbar, registry, feature modules and DOM changes | Runs in an isolated JavaScript world but shares the page DOM |
| Shared core | Preferences client, validated settings, style ownership, position, detection, announcements | Modules use these services instead of building competing versions |
| Service worker | Background events, preference coordination, commands, optional AI requests | No DOM; durable state goes in storage, not only global variables |
| Action popup | Activate the current page; explain restricted-page failures | Does not replace the on-page toolbar |
| Options page | Full settings, privacy information and optional AI consent | Uses the same schema and store |
| Main-world probe | Only if ordinary media events cannot satisfy an agreed case | Optional, minimal and validated; not trusted |

Chrome's [content-script documentation](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts) explains isolated worlds and message-based communication. Register the service worker in the manifest; use supported module imports and package executable code locally, following [Chrome's worker documentation](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/basics).

Data flow: control changes setting → core validates → storage interface persists → module receives settings → core preserves the current content anchor while layout changes → UI exposes updated state. Define preference propagation across tabs in the contract. An error in one module produces a clear notice and does not disable the others.

## 6. Shared contract and ownership

The authoritative TypeScript interfaces must live in one core package after #10/#22. Until then, use the [architecture proposal's contract](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/04-architecture-and-apis.md), not independently invented variants.

Each module has a stable namespaced ID, API version, owner, title, group, setting descriptors, control descriptors and `init(ctx)`, `apply(settings)`, `teardown()` methods. Settings are validated; errors are isolated; lifecycle calls must tolerate repeat application and cleanup.

The core provides preferences, an event bus, scoped styles/tokens, position preservation, announcements, content detection and notifications. An optional AI client exists only after consent. Feature modules do not depend directly on each other. Mocks must implement the same contract and be labeled clearly.

| Concern | Proposed owner |
|---|---|
| Toolbar, visible focus, preferences, registry and position service | Shared core |
| Text enlargement, contrast, text-to-speech and image descriptions | Company A |
| Spacing, line width, cognitive modes and motion reduction | Company B |
| Font family | Resolve in #10; one owner and one control |

Company B's reading view must honor Company A's scale and contrast. Test both modules together. Shared CSS layers do not guarantee that all third-party page styles cooperate: scope changes carefully and test the actual demo and supported pages.

## 7. Getting started

### Before the scaffold is merged

```sh
git clone https://github.com/CompanyB-AUD/IIC-Cog-Plugin.git
cd IIC-Cog-Plugin
git switch main
git pull --ff-only
git switch -c feat/13-extension-shell
```

Use your assigned issue number and description in the branch name. Read the issue, this file and `AGENTS.md`; review the linked `sprint-1` requirements without merging that branch casually. There is currently nothing to install or launch. Do not run an invented `pnpm dev` and assume an extension exists.

### Once the scaffold is merged

1. Install the pinned Node and pnpm versions from the repository. Use the same versions in CI.
2. Run `pnpm install --frozen-lockfile` from a clean clone. Initial scaffold creation generates the lockfile; dependency changes update it deliberately.
3. Read the actual root scripts. The scaffold must provide and verify the interface below, or update this guide to match the agreed replacement.

| Target command | Intended result |
|---|---|
| `pnpm dev` | Watch/development extension build |
| `pnpm demo` | Serve shared LMS fixtures locally |
| `pnpm build` | Production extension emitted to root `dist/`, including `manifest.json` |
| `pnpm typecheck` | Strict TypeScript checks across workspaces |
| `pnpm lint` | Lint maintained source files |
| `pnpm format:check` | Verify formatting without rewriting unrelated files |
| `pnpm test` | Non-watch unit/component tests |
| `pnpm test:e2e` | Installed-extension browser journeys |
| `pnpm test:a11y` | Automated accessibility checks on the toolbar/demo journeys |

4. For a production-build smoke test, open `chrome://extensions`, enable Developer mode and choose **Load unpacked**, selecting `dist/` containing the built manifest. Use the development output directory documented by the scaffold for the watch build; do not assume its output matches production.
5. Open the local demo URL printed by `pnpm demo`. Activate via the extension action; test the agreed shortcut (proposed `Alt+Shift+A`, rebindable).
6. After manifest or worker changes, reload the extension and refresh the demo page. Development-server hot reload does not prove the packaged production build works.

No account, database, paid API or `.env` secret is needed for the Must MVP. If optional services are added, provide an `.env.example` containing placeholders only. Browser-visible environment variables are public bundle data.

## 8. Build the first complete slice

Start with #10 (agreement), #13 (shell), #22 (registry), #12/#14 (toolbar) and #17/#18 (preferences/reset). Demonstrate one boolean setting applied on a synthetic page, persisted after browser restart and fully reversed. Test a stub Company A module and a failing module. Stub success is contract evidence, not completion of real cross-company integration #24.

Next add #28 spacing and #25 reading mode to this same extension. Do not build separate applications for each feature. Preserve position through #19, then connect #29 ruler, #30 chunking and #31 progress. See [the delivery sequence](docs/development-plan.md) for dates and workstream allocation.

## 9. Feature implementation rules

- **Reading mode:** clone before extraction because Readability can modify its input; sanitize the returned HTML before rendering. Check essential content against fixtures and preserve access to the original. [Mozilla's Readability guidance](https://github.com/mozilla/readability) documents extraction and sanitization considerations.
- **Restoration:** track precisely which nodes, styles and listeners belong to the extension. Avoid replacing the entire live document or destroying form state. Preserve the current paragraph rather than only an obsolete pixel scroll offset.
- **Motion:** CSS pause rules do not stop every GIF or JavaScript carousel. Use supported strategies per content type, test each demo fixture, and state limits. Do not freeze critical page interactions.
- **Typography:** support the issue's spacing values without clipping or overlap. Keep reset reversible and respect Company A's controls.
- **Ruler/chunking:** keyboard controls must have clear focus and not hijack typing. Use headings or labeled paragraph groups; keep content order and provide previous/next state.
- **Progress:** distinguish section/scroll progress from actual comprehension. Clearly label reading-time estimates and test the calculation separately from human timing results.
- **Instructions:** preserve source wording and order; only convert supported explicit patterns into steps. On uncertainty, keep the original rather than inventing a missing instruction.
- **Hearing:** use existing accessible media tracks and cues. Document inaccessible/cross-origin media. Flag missing captions honestly; no speech-to-text promise.
- **Barrier reports:** distinguish heuristic usability observations from verified WCAG failures. Do not label every long paragraph a standards violation.
- **AI:** off by default, selected/explicitly authorized text only, labeled output beside the source, server-side key, provider-specific retention disclosure, timeouts and offline fallback. Agree whether a selected chunk is authorized before implementing summaries.

## 10. Permissions, storage and security

Proposed permissions: `storage`, `activeTab`, `scripting`, and the agreed demo-host access. Request LMS/other host access only as needed and explain the behavior. No default `<all_urls>`, `tabCapture` or microphone access. Restricted browser pages and built-in PDF viewers need a clear unsupported-page message.

Use one versioned schema with module namespaces, default values, range checks and migration rules. Unknown/invalid values fall back safely. Per-site enablement may need hostnames; store only those explicit site choices, never navigation history. This clarifies the older proposal's broad "no personal data" claim: domain preferences still deserve minimization and disclosure.

Validate message types, senders where applicable, payload sizes and settings. Sanitize HTML and render generated text safely. Keep tokens and API keys off clients, logs and Git. No telemetry or remote analysis of whole pages. Any optional proxy needs request limits, secret management and a documented data flow before it is enabled.

## 11. Testing and evidence

| Layer | Required evidence |
|---|---|
| Unit | Settings validation/migration, chunking, timing, cleanup and other changed logic |
| Component | Control semantics, toggles, keyboard behavior, focus return and notices |
| Extension E2E | Install/activate, settings persistence, reset, reading position, repeated toggling, failure isolation and combined modules |
| Manual accessibility | Keyboard-only journeys, NVDA labels/state, focus visibility, zoom/reflow, target sizes and reduced motion |
| User evaluation | Voluntary representative users or explicitly documented simulations; task outcomes, feedback, changes and limitations |
| Performance/security | Reproducible environment, measured budgets, permissions/storage review and supported browser versions |

[Playwright's extension guide](https://playwright.dev/docs/chrome-extensions) requires a persistent Chromium context; use its bundled Chromium for automated extension loading, not a personal Chrome/Edge installation. Manual acceptance testing still targets the agreed Chrome release. Use temporary isolated profiles and licensed/synthetic content.

Demo fixtures should cover: course home, 2,000+ word reading, a 5,000-word performance page, three instruction patterns, a quiz form, captioned/uncaptioned video, audio notification, images, dynamic updates, and each supported motion type. Keep ground-truth content and planted-barrier checklists.

Proposed performance budgets from the architecture: initial content-script bundle at most 150 KB gzip; added load time at most 100 ms median over ten loads; toolbar opening at most 100 ms; settings applied within 200 ms on 5,000 words; mutation processing at most once per 250 ms. Define measurement conditions before testing; report misses honestly. Load optional code only when needed using mechanisms supported by its execution context.

Record exact browser/tool versions, steps, expected/actual results and defects in `docs/testing/`. No scanner-only conformance claims, fabricated participants or assumed successful tests.

## 12. Collaboration, review and delivery

Use issue-scoped branches such as `feat/28-text-spacing`, `fix/19-reading-anchor`, or `docs/45-user-guide`. Keep PRs small and link requirements plus evidence. Have at least one reviewer; shared-core changes follow the jointly agreed Company A/B review arrangement. These are workflow expectations, not a claim that branch protections are configured.

Board statuses: Backlog → Ready → In Progress → In Review → Done; Blocked only when an actual prerequisite prevents useful progress. Native "blocked by" links also show sequencing requirements. Mocks and parallel development are allowed once the interface is agreed, but completion requires real integration evidence.

CI should eventually run frozen installation, typecheck, lint, formatting, unit tests, production build and browser/accessibility checks. Do not add empty passing jobs just to show green. Package the built extension and preserve test evidence for the release candidate.

Done means accepted criteria, reviewed work, relevant accessibility/functional checks, restoration/state integrity, documented limitations and Sprint Review evidence. Keep Scrum records in #48–#52; do not reconstruct historical events as if they were observed.

## 13. Troubleshooting

| Symptom | First checks |
|---|---|
| Toolbar absent | Supported URL, permission grant, extension enabled, production manifest, content-script console |
| Worker inactive | Event-triggered workers can suspend; inspect worker errors and storage persistence, not only global state |
| Changes not appearing | Rebuild/reload extension and refresh page; distinguish watch output from production `dist/` |
| Settings reset unexpectedly | Schema migration, namespace validation, worker restart, storage event propagation |
| Page layout breaks | Scoped rules, duplicated application, font/style ownership, teardown and host-page mutations |
| E2E cannot load extension | Bundled Chromium, persistent context, absolute built-extension path, isolated profile |
| No captions found | Actual accessible text tracks, loading state, CORS/iframe boundary; missing data is not automatically a plugin bug |
| AI unavailable | Consent, configured proxy, optional permission, timeout/network; Must features must still work |

## 14. Open decisions

Resolve #10/D1–D12: browser, repository integration, exact package versions/UI, contract, settings/presets, style ownership, layout, shortcut, demo hosting, Definition of Done, optional AI ownership and integration cadence. Resolve #9: final Must/Should commitments, roles, capacity, assignees and estimates. Update this guide and the ADR when decisions change; do not silently treat proposals as approved.
