# ADR 0001: Shared architecture and development baseline

| | |
|---|---|
| **Status** | **Proposed.** Company A has not reviewed or accepted any decision in this record. |
| **Issue** | [#10](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/10) · parent epic [#3](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/3) |
| **Proposed by** | Company B, Core and Integration team |
| **Must agree** | Company A and Company B, recorded at a joint meeting ([agenda](../integration/10-joint-architecture-agenda.md)) |
| **Drafted** | 26 November 2026 |
| **Supersedes** | Nothing. Builds on the [Sprint 1 architecture proposal](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/04-architecture-and-apis.md) (below: "the proposal") |

## How to read this record

The proposal lists twelve decisions, D1–D12. This record keeps that numbering so the two documents can be read side by side. The Core team's review found two more decisions the proposal does not cover, added as D13 and D14, and sharpened several of D1–D12. Every change to the proposal is marked **Changed by core review**.

Each decision has a status:

- **Proposed**: Company B's recommendation, not yet discussed with Company A.
- **Accepted**: agreed by both companies at a recorded meeting. Link the meeting notes or the #10 comment.
- **Rejected / Deferred**: discussed and not adopted, or postponed with a named owner and date.

When the meeting has run, update each decision's status and the summary table, and set the record's status to **Accepted**. If only some decisions are agreed, mark it **Partially accepted**. Change an accepted decision later by writing a new ADR that supersedes the affected section, not by editing this one.

## Context

Company A (visual accessibility) and Company B (reading, attention and limited hearing support) are building **one** Chrome extension with one toolbar and one preference store ([dev.md](../../dev.md), [AGENTS.md](../../AGENTS.md)). Three Company B teams and Company A will build against the same core in parallel, so the contract between core and modules must be agreed before teams diverge.

On 26 November 2026, at the end of Sprint 2, there is no code, manifest or package file in the repository. Issue #13 (extension scaffold) depends on this record, and so do #22 (registry), #17 (preferences), #14 (toolbar), #25 (reading mode) and #28 (text spacing).

Constraints from the brief and the Sprint 1 requirements:

- Manifest V3 extension for one desktop Chromium browser, delivered by 17 December 2026.
- Every Must feature works offline without an AI service.
- Least-privilege permissions; no analytics; preferences stay on the device.
- Every page change is reversible (reset, FR13; turning the plugin off, AC-E1.4) and keeps the reading position (FR12).
- An error in one module must not break the toolbar or the other modules (AC-E3.2).
- The plugin's own UI meets WCAG 2.2 AA.

## Decision drivers

1. **Parallel work across four teams.** Interfaces must be small, typed and stable enough to mock.
2. **Robustness on pages we don't control.** LMS markup and CSS vary, change, and can remove our nodes.
3. **Reversibility.** Every change to the page is tracked and undone exactly.
4. **Least privilege and privacy.** No broad permissions or data collection by default.
5. **Mainstream, documented tooling.** A small team with five weeks cannot debug exotic choices.
6. **Five-week delivery.** Prefer the option that gets one working end-to-end path soonest.

## Summary

| # | Decision | Proposed outcome | Status |
|---|---|---|---|
| D1 | Target browser | Chrome stable desktop; Edge best effort | Proposed |
| D2 | Repository arrangement | One monorepo; fallback: Company A publishes a versioned package | Proposed |
| D3 | Language, build and UI | TypeScript strict, Vite + CRXJS, Preact, pnpm workspace, Node 24 | Proposed |
| D4 | Module contract | `apiVersion: 1` lifecycle with core-handled errors; **descriptors are plain data; add a content-root event** | Proposed, **changed by core review** |
| D5 | Preference schema and write path | Versioned, namespaced, validated; **choose a single write path (see options)** | Proposed, **changed by core review** |
| D6 | Style ownership and mechanism | Token ownership as proposed; **`!important` declarations inside `@layer iic`**; font family needs one owner | Proposed, **changed by core review** |
| D7 | Toolbar layout and host | Group by purpose; **in-page Shadow DOM**, side panel to be tried by UI/UX | Proposed |
| D8 | Keyboard command | `Alt+Shift+A` via `chrome.commands`, rebindable | Proposed |
| D9 | Demo environment | Static demo LMS in this repository; GitHub Pages if agreed | Proposed |
| D10 | Definition of Done | Sprint 1 document 3, section 6, with the integration clarification | Proposed |
| D11 | Optional AI proxy | Deferred until Must features are integrated | Proposed (defer) |
| D12 | Integration cadence | Weekly joint meeting; at least two integrated builds per sprint | Proposed |
| D13 | Activation and permissions | **New.** Demo host + `activeTab`; opt-in per-site access later | Proposed |
| D14 | Main-world probe | **New.** Not built until ordinary media events are shown to be insufficient | Proposed |

## Decisions

### D1. Target browser

**Proposed:** Chrome stable on desktop (Windows and macOS) is the supported browser. Edge is best effort and untested unless time allows. Record the exact Chrome version used for acceptance testing in `docs/testing/`.

**Why:** The brief requires one Chromium browser. Chrome is the reference implementation for Manifest V3. Playwright's bundled Chromium can load extensions for automated tests.

**To confirm with Company A:** the browser on campus machines, and whether extension installs are blocked by policy there (stakeholder: Ashesi IT).

### D2. Repository arrangement

**Options:**

| Option | Gains | Costs |
|---|---|---|
| A. One monorepo (this repository) with folders owned by each company | One build, one lockfile, one CI; integration problems appear immediately | Both companies need write access and cross-company review rules |
| B. Company A keeps its repository and publishes a versioned package that we consume | Each company controls its own repository | Integration happens late; versions drift; packaging work for Company A |
| C. Two separate extensions | No coordination | Two toolbars and two preference stores; conflicting page styles. Fails the brief's "one toolbar" goal |

**Proposed:** A. If Company A cannot work in this repository, use B, with a version bump whenever the contract changes. Reject C.

**Consequences of A:** Company A's code lives in `modules/a-visual/`. Changes to `packages/core/` (the contract and services) need one reviewer from each company. Company B's planned layout is in [dev.md section 4](../../dev.md#4-target-repository-structure).

### D3. Language, build and UI

**Proposed:**

| Concern | Choice |
|---|---|
| Language | TypeScript, `strict` |
| Runtime for tooling | Node.js 24 LTS, exact patch pinned |
| Packages | pnpm workspace, exact version in `packageManager`, one committed lockfile |
| Build | Vite + `@crxjs/vite-plugin`, compatible versions verified together in #13 before pinning |
| UI | Preact inside a Shadow DOM (see D7); plain CSS with shared custom properties |
| Tests | Vitest (logic and components), Playwright with a persistent Chromium context (extension end to end), axe-core plus manual keyboard and NVDA checks |

**Why:** All of these are mainstream with good documentation. Preact keeps the content-script bundle within the proposal's 150 KB budget. TypeScript checks the shared contract at compile time across both companies.

**Note:** Exact versions are a #13 deliverable. If the #13 build spike finds an incompatibility (for example CRXJS with the chosen Vite version), it records one replacement here rather than each team choosing its own.

### D4. Module contract

**Proposed:** Adopt the lifecycle in the proposal, section 4, as `apiVersion: 1`:

- Each module declares a stable namespaced `id` (`a.*`, `b.*`), `owner`, `apiVersion`, `title` (describing what it does, never who it is for), `group`, `settings` and `controls`.
- Lifecycle: `init(ctx)` once per page, `apply(settings)` on every change, `teardown()` to undo everything.
- The core wraps every lifecycle call in error handling. On an error it emits `module:error`, shows a toolbar notice and keeps the other modules running.
- `apply` must be idempotent: applying the same settings twice leaves the page unchanged the second time.
- The core refuses to load a module whose `apiVersion` it does not support and shows a notice.
- One authoritative definition lives in `packages/core/src/contract.ts`, exported as `@iic/core`.

**Changed by core review:**

1. **Control descriptors are plain data.** The proposal's `action.run` and `panel.render` put functions inside descriptors. The options page runs in a different context, and functions cannot be sent between contexts. Proposed shape: descriptors carry only data (`{ kind: 'action', id, label }`). The module handles the action through a separate method, e.g. `onAction(id)`. Keep `panel` only for named, agreed cases such as the transcript (#36). Panels render inside a container the core provides, using the core's styles.
2. **Add a "content root" concept.** Reading mode (#25) shows a cleaned copy of the content in place of the original. Spacing (B), contrast and text size (A), the ruler and chunking must then work on that copy, and the position keeper must map between the two. Proposed: `ctx.detect.contentRoot()` returns the element that currently holds the readable content, and a bus event `view:changed { root }` fires when it switches. The reading-mode copy carries anchor attributes that point back to the original elements, so position is kept when leaving reading mode (AC-E4.5).
3. **Bus payloads stay inside the content script.** Events such as `media:play` carry DOM elements. That is fine because the bus never crosses a context boundary, but the contract should say so, so no one tries to forward bus events to the service worker.

**Consequences:** UI/UX builds the toolbar from descriptors only. Feature modules never import each other or render their own toolbar. A labelled mock implementation of `ModuleContext` ships with the contract so other teams can start before the real core exists.

### D5. Preference schema and write path

**Proposed (unchanged from the proposal):**

- Settings live in `chrome.storage.local`, never in the website's `localStorage`.
- Settings carry a schema version and are namespaced per module.
- Every value is validated against the module's `SettingDescriptor`. Unknown keys are dropped; invalid values fall back to the default.
- A schema version change runs a migration.
- Presets are named by function ("Focus", "Easier reading"), never by diagnosis.
- Stored data: settings, the global on/off switch, and hostnames the user explicitly chose (D13). No names, browsing history or AI inputs.

**Changed by core review: the write path must be chosen.** Several tabs, the popup and the options page can all save settings. If each one reads the whole `iic.prefs` object, changes one value and writes it all back, two saves close together lose one of the changes.

| Option | Gains | Costs |
|---|---|---|
| A. One object; every context writes it directly | Simplest | Lost updates under concurrent saves. **Reject** |
| B. One object (`iic.prefs`, as proposed); the service worker is the only writer, applying saves one at a time | Keeps the agreed shape; no lost updates | Every save is a message round trip and may wake the worker; the worker becomes a dependency for every setting change |
| C. One storage key per module (e.g. `iic.v1.module.b.text-spacing`), plus one key for global state; contexts write their own module's key directly | Modules cannot overwrite each other; `storage.onChanged` syncs every tab with no extra messaging; the worker is not involved | Changes the agreed single-object shape; reset-all must remove a set of keys; same-module saves from two tabs are still last-writer-wins (low risk) |

**Proposed:** C. B is an acceptable fallback if Company A prefers the single object. Whichever is chosen, every module, the toolbar and the options page use the same core preferences client. No one calls `chrome.storage` directly.

### D6. Style ownership and mechanism

**Proposed ownership (unchanged from the proposal, section 5.2):**

| Token | Owner |
|---|---|
| `--iic-font-scale` | Company A |
| `--iic-fg`, `--iic-bg`, `--iic-link`, `--iic-contrast-mode` | Company A |
| `--iic-line-height`, `--iic-letter-spacing`, `--iic-word-spacing`, `--iic-paragraph-spacing`, `--iic-max-line-length` | Company B |
| `--iic-motion` | Company B (the core also honours `prefers-reduced-motion`) |
| `--iic-focus-ring` | Core |
| `--iic-font-family` | **Open.** One owner and one control. Company B proposes owning it as part of readable-font choice (#28). |

A module may read any token but set only its own. The core rejects other writes and logs a warning. Company B's reading mode reads Company A's colour and scale tokens.

**Changed by core review: how our rules win.** The proposal puts every rule inside one cascade layer, `@layer iic`. Under the CSS cascade rules, a normal declaration in a layer **loses** to any normal declaration outside a layer. LMS stylesheets are almost always unlayered, so plain rules in `@layer iic` would often have no effect. For `!important` declarations the order reverses: a layered `!important` declaration beats an unlayered one. Proposed mechanism:

- Every property the plugin overrides on the page is written as `!important` inside `@layer iic`.
- Its value comes from a token, e.g. `line-height: var(--iic-line-height) !important`.
- Selectors are scoped to the content root (D4), never to the toolbar.
- The core owns one style element per module and removes it on teardown.
- Known exception: a page's own inline `style="… !important"` still wins. This is rare, and we document it as a limitation.

**To verify:** #13 includes a test on the demo page that a layered `!important` rule overrides a typical unlayered LMS rule. If it fails, this section is revised before the contract is frozen.

### D7. Toolbar layout and host

**Layout (unchanged):** controls are grouped by purpose (Reading, Focus, See, Hear, Tools), not by company. Quick presets come first and detailed settings sit behind "More settings" (B-P4). Targets are at least 24×24 CSS px, aiming for 44×44.

**Host options:**

| Option | Gains | Costs |
|---|---|---|
| A. Shadow DOM inside the page | Styles are isolated in both directions; light; focus stays in the page, so returning focus is simple (AC-E1.2) | Page scripts can remove our host node, so the core must re-attach it; the toolbar must dock without hiding focused content (AC-E1.3) |
| B. iframe inside the page | Complete isolation | Heavier; each control talks across frames; focus handling is harder |
| C. Chrome side panel | Never covers page content; Chrome narrows the page, which solves docking (#16) | Separate context, so every control is a message; focus leaves the page; opening it needs a user action; AC-E1.2 needs reinterpreting |

**Proposed:** A for the MVP. UI/UX may run a short side-panel trial (C) under #12/#16 before Sprint 3. Switching hosts needs a new ADR.

**Implementation note for #13/#14:** Vite/CRXJS adds a content script's imported CSS to the page document by default. Toolbar CSS must be imported as a string and attached inside the shadow root, or it will not apply and may leak onto the page.

### D8. Keyboard command

**Proposed:** `Alt+Shift+A` opens and closes the toolbar, declared in `chrome.commands` so users can rebind it at `chrome://extensions/shortcuts`. Closing the toolbar returns focus to the element that had it before (AC-E1.2). There are no single-character shortcuts (WCAG 2.1.4). The toolbar never intercepts keys while the user is typing in a field or editable region.

**To check:** before acceptance, check for conflicts with NVDA and common LMS shortcuts, and record the result.

### D9. Demo environment

**Proposed:** a static demo LMS in `demo-site/` in this repository, served locally by `pnpm demo`, and on GitHub Pages if both companies agree. Minimum contents (from E3 and dev.md section 11):

- course home page
- reading of 2,000+ words
- 5,000-word performance page
- three instruction patterns
- quiz form
- captioned and uncaptioned video
- page with an audio notification
- images with descriptions for Company A
- a dynamic-update page
- every supported motion type

Content is synthetic or appropriately licensed. Core owns the harness (#23), and every team contributes fixtures.

**Note:** GitHub Pages gives a fixed host for the manifest's host permission (D13). A local-only demo needs a `localhost` match pattern instead.

### D10. Definition of Done

**Proposed:** adopt the Definition of Done in [Sprint 1 document 3, section 6](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/03-mvp-scope-and-epics.md#6-definition-of-done-proposed-to-agree-with-company-a), with one clarification: work counts as integrated only when it runs against the real core, not a mock. A task merged into a team branch is not Done until it is on `main` and its acceptance evidence is linked.

### D11. Optional AI proxy

**Proposed:** defer. No AI code, proxy or host permission until the Must features are integrated (after Sprint 3). Then, if there is capacity:

- the service worker is the only gateway
- a team-run proxy holds the provider key; no key ships in the extension
- the feature is off by default, with informed opt-in
- only text the user selected is sent
- output is labelled and shown next to the original
- the provider's actual data retention is documented

Proxy ownership (Company B in the proposal) is decided at that point.

### D12. Integration cadence

**Proposed:**

- A weekly joint integration meeting, minuted in the sprint's Scrum issue (#48–#52).
- At least two integrated builds per sprint containing both companies' modules.
- Changes to the contract or to style ownership need an ADR and one reviewer from each company.

### D13. Activation and permissions (new)

**Why it's needed:** the proposal lists permissions but not how the plugin gets onto a page or how per-site on/off works (#15). With `activeTab`, the plugin can run on the current tab after the user clicks or uses the shortcut, but only until that tab navigates. Remembering "always run on this site" therefore needs a real host permission for that site.

**Proposed:**

| Situation | Mechanism | Permission |
|---|---|---|
| Demo site | `content_scripts` declared in the manifest | Host permission for the demo host only |
| Any other page, on request | `chrome.scripting.executeScript` after an icon click or the keyboard command | `activeTab` + `scripting` (no install warning) |
| "Always run on this site" (#15) | `chrome.permissions.request` for that origin, then `chrome.scripting.registerContentScripts` | `optional_host_permissions`, granted per site at runtime |
| Ashesi LMS | Same as the row above, or a declared match once the domain is confirmed | Optional, requested at runtime |
| Restricted pages (`chrome://`, Chrome Web Store, built-in PDF viewer) | None possible; the popup explains | — |

Also proposed:

- `<all_urls>` is never requested by default. `tabCapture` and microphone access are never requested.
- Hostnames the user chooses are stored locally and disclosed in the privacy notes (D5).
- Turning the plugin off on a site unregisters it there and runs every module's `teardown()`.

### D14. Main-world probe (new)

**Why it's needed:** the proposal includes a script in the page's own JavaScript environment that hooks `HTMLMediaElement.prototype.play` for visual sound alerts (#37). That adds complexity and an untrusted input channel.

**Proposed:** do not build it at first. A content script can see `play` events on media in the page by listening on the document in the capture phase. A probe would only add coverage for audio created with `new Audio()` and never added to the page. Build it (using `world: "MAIN"`) only if a demo fixture shows that gap matters. Any messages it sends are validated as untrusted.

## Consequences

**If accepted:**

- #13 can scaffold one workspace with pinned versions, a manifest matching D13 and a Shadow DOM toolbar mount.
- Core publishes `contract.ts` and a labelled mock `ModuleContext`. UI/UX (#14) and Feature Implementation (#25, #28) build against it straight away.
- The style approach (D6) and the content-root concept (D4) are proven on the demo site in Sprint 2/3 rather than discovered late during integration (#24).
- `dev.md` is updated wherever it describes these decisions as open.

**Risks that remain:**

- If D2 is unresolved, integration with Company A (#24) may slip.
- Both D5 options carry a cost; a later switch needs a storage migration.
- Some LMS pages will still defeat style overrides or Readability extraction. These are documented as limitations, not hidden.

## Follow-up actions

| Action | Owner | Issue |
|---|---|---|
| Run the joint meeting and record outcomes on #10 | Core lead + Company A representative (to be named) | #10 |
| Update this record's statuses and summary table | Core | #10 |
| Scaffold, pin versions, verify the D6 cascade test | Core | #13 |
| Publish `contract.ts` and the mock context | Core | #22 |
| Side-panel trial (optional) | UI/UX | #12 / #16 |
| Synchronise `dev.md` and the team guides once accepted | Core | #10 |

## References

- [Sprint 1 architecture proposal](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/04-architecture-and-apis.md)
- [Sprint 1 MVP scope and acceptance criteria](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/03-mvp-scope-and-epics.md)
- [dev.md](../../dev.md) and [AGENTS.md](../../AGENTS.md)
- Chrome: [content scripts and isolated worlds](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts), [service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle), [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab), [chrome.scripting](https://developer.chrome.com/docs/extensions/reference/api/scripting), [chrome.storage](https://developer.chrome.com/docs/extensions/reference/api/storage), [chrome.sidePanel](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
- CSS: [Cascade Layers, CSS Cascading and Inheritance Level 5](https://www.w3.org/TR/css-cascade-5/#layering)
