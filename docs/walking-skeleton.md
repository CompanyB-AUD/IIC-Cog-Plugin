# Walking skeleton: install → toolbar → change → save → reset

Status: first working slice of the core, built on the **proposed** contract in [ADR 0001](adr/0001-development-baseline.md) (not yet agreed with Company A, #10). Contributes to #13, #17, #18 and #22; it does not complete them.

## Run it

Requires Node 24 (see `.nvmrc`) and pnpm 10.28.0 (`corepack enable` picks up the pinned version).

```sh
pnpm install --frozen-lockfile
pnpm build          # production extension in dist/
pnpm demo           # demo page at http://localhost:4173/
```

In Chrome: open `chrome://extensions`, switch on **Developer mode**, click **Load unpacked** and choose `dist/`. Open http://localhost:4173/. The **Reading tools** button appears at the bottom right. Press `Alt+Shift+A` or click the extension icon to open or close the toolbar (rebind the shortcut at `chrome://extensions/shortcuts`).

| Command | Result |
|---|---|
| `pnpm typecheck` | Strict TypeScript across the workspace |
| `pnpm test` | Unit tests (Vitest, jsdom) |
| `pnpm test:e2e` | Builds, then runs the installed-extension journey in Playwright's Chromium with a temporary profile |
| `pnpm dev` | Rebuilds `dist/` on change; reload the extension in `chrome://extensions` afterwards |

## What is real and what is a stand-in

| Part | State | Where |
|---|---|---|
| Module contract (`apiVersion: 1`) | Proposed, follows ADR 0001 D4 | `packages/core/src/contract.ts` |
| Preferences: versioned `iic.prefs`, validation, migration, per-module and global reset | Implemented; write path still open (ADR D5) | `packages/core/src/prefs.ts` |
| Registry: lifecycle, failure isolation, cleanup | Implemented | `packages/core/src/registry.ts` |
| Style service: token ownership, `@layer iic` + `!important` | Implemented; overrides unlayered page CSS on the demo page | `packages/core/src/styles.ts` |
| Manifest, service worker, content script | Implemented; `storage` permission only, runs on the demo site only | `extension/` |
| **Toolbar** | **Placeholder.** The real toolbar is UI/UX's #14 | `packages/core/src/ui/placeholder-toolbar.tsx` |
| **Line spacing module** | **Stub** to prove the contract. The real feature is Feature Implementation's #28 | `packages/core/src/stubs/line-spacing-stub.ts` |
| Reading-position service | Placeholder that runs changes without preserving position (#19) | `registry.ts` |
| Demo page | One synthetic reading page (#23 will expand it) | `demo-site/index.html` |

## Evidence

- `pnpm test`: 19 unit tests. They cover validation, migration, unknown and invalid values, rapid saves, reset, cross-tab updates, stored keys, contract checks, AC-E3.1 (stub module), AC-E3.2 (failing module isolated during init and apply), idempotent apply, teardown cleanup and token ownership.
- `pnpm test:e2e`, two journeys:
  - Launcher visible within 1 s with no console errors (AC-E1.1).
  - Toolbar opens with focus inside it.
  - Toggle and keyboard slider change the page.
  - Escape returns focus to the launcher (AC-E1.2).
  - Values survive a reload and a full browser restart (AC-E2.1).
  - Reset all asks for confirmation inside the toolbar and leaves no injected style or token (AC-E2.2).
  - Typing in a page field is not intercepted.

## Not done yet, or not tested

- Running on pages other than the demo site, the "can't run on this page" message, per-site on/off (#13, #15).
- The keyboard command (`Alt+Shift+A`) was not tested automatically, because Playwright cannot press browser-level extension shortcuts. Check it manually.
- No NVDA or screen-reader check, and no axe scan, yet.
- The toolbar overlays page content and can cover it (AC-E1.3, docking #16, UI/UX).
- Two tabs saving at the same moment can lose one change until ADR D5 is decided.
- No ESLint, Prettier or CI yet (#40).
- Tested on Playwright's Chromium 1.63 build only. Manual testing in Chrome stable is still to do.
