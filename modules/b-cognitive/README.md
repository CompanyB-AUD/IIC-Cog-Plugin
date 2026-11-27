# @iic/b-cognitive — Company B cognitive-accessibility module

Status: **#25 reading mode (in progress)**. #27 (hide distractions / focus spotlight) and #32 (step checklists) are not started.

Written against the PROPOSED module contract (ADR 0001, PR #57). Company A has not agreed it yet.

## Reading mode (`b.reading-mode`)

Turning it on shows the page's main text as one clean column and hides the rest. Turning it off removes everything we added and returns the reader to the same paragraph.

Pipeline (`src/reading-mode/`):

1. `anchors.ts`: number the original page's blocks (headings, paragraphs, list items…) in document order.
2. `extract.ts`: deep-clone the page, stamp the same numbers on the CLONE, run Mozilla Readability on the clone, then sanitise with DOMPurify **last**. The live page is never modified.
3. `reading-view.ts`: build an `<article data-iic-reading-view>`, restore heading levels (Readability turns h1 into h2).
4. `reading-mode.ts`: the module (states: off / fallback / reading), position keeping, announcements.
5. `styles.ts`: CSS for the view and for the fallback.

If no main text is found (or under 100 characters), the module says so in plain language and hides page-level menus and side panels instead (AC-E4.4).

## Pinned libraries

`@mozilla/readability` 0.6.0 (Apache-2.0) and `dompurify` 3.5.0 (MPL-2.0 OR Apache-2.0).

## Evidence so far (jsdom only)

57 tests pass across the repo (38 in this module): anchors, sanitiser/XSS, the demo page against a hand-made checklist (`test/fixtures/demo-checklist.ts`), no-leftovers after turn-off, idempotence, teardown, fallback, error-path cleanup, and the module run through the real `ModuleRegistry`.

## NOT verified

- Real-browser layout and scrolling. jsdom has no layout, so position keeping is tested with faked rectangles only.
- Playwright end-to-end, keyboard and NVDA checks, performance, Node 24 (tested on Node 22).
- The 100-character minimum is a guess; revisit with real pages.
- Only the one demo page has a checklist. Pages with iframes, shadow DOM or content that loads late are untested.
- `ctx.position.preserve` is a placeholder until #19; this module keeps position itself.

## Needs Core / Company A

- `contentRoot()` and `view:changed` (promised in ADR 0001 D4) are missing from the skeleton contract.
- `modules/*` is not in `pnpm-workspace.yaml` or the Vitest include; the lockfile must be regenerated.
- Registration is hard-coded in `extension/src/content.ts` (`MODULES`).
- Confirm the `iic-` id prefix for plugin UI.
