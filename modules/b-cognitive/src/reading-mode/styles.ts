/**
 * STYLES for reading mode and for its fallback.
 *
 * HOW OUR CSS BEATS THE PAGE'S CSS (ADR 0001, D6)
 * The core wraps everything passed to ctx.style.addRules() in `@layer iic`. In CSS, a
 * normal rule inside a layer LOSES to any normal rule outside a layer, and a typical
 * learning site's stylesheet has no layers. But `!important` reverses that order: a
 * layered `!important` beats an unlayered `!important`. So every declaration here that
 * must win is marked `!important`.
 *
 * COOPERATING WITH COMPANY A
 * Colours and text size are Company A's. We never SET their tokens; we only READ them
 * with var(--iic-fg, fallback). With no Company A module active the fallback values apply.
 * Spacing/line length belong to Company B (the --iic-line-height / --iic-max-line-length
 * tokens), read the same way, so a future spacing module (#28) restyles this view for free.
 *
 * THE "iic-" ID CONVENTION
 * Anything the plugin adds directly under <body> has an id starting with "iic-" (the
 * toolbar's is "iic-toolbar-host"). The rules below leave such elements visible. This
 * convention should be confirmed with Core and Company A.
 */

/** Marks the reading-view element. Also used by anchors.ts to skip it when collecting blocks. */
export const VIEW_ATTR = 'data-iic-reading-view';

/** Names of the two rule sets this module registers with the core. */
export const RULES_READING = 'reading-view';
export const RULES_FALLBACK = 'hide-distractions';

/** Reading mode: hide the original page content and style our copy as one calm column. */
export const READING_VIEW_CSS = `
/* Hide everything the page put directly inside <body>, except plugin UI and the view. */
body > :not([${VIEW_ATTR}]):not([id^="iic-"]) {
  display: none !important;
}

[${VIEW_ATTR}] {
  display: block !important;
  box-sizing: border-box !important;
  max-width: var(--iic-max-line-length, 70ch) !important;
  margin: 0 auto !important;
  padding: 2rem 1rem 4rem !important;
  color: var(--iic-fg, #1a1a1a) !important;
  background: var(--iic-bg, #ffffff) !important;
  font-family: var(--iic-font-family, Georgia, 'Times New Roman', serif) !important;
  font-size: calc(1.125rem * var(--iic-font-scale, 1)) !important;
  line-height: var(--iic-line-height, 1.6) !important;
  text-align: left !important; /* never justified: uneven word gaps hurt readability */
}

[${VIEW_ATTR}] a { color: var(--iic-link, #0b57d0) !important; }
[${VIEW_ATTR}] img, [${VIEW_ATTR}] figure { max-width: 100% !important; height: auto !important; }
[${VIEW_ATTR}] table { display: block !important; max-width: 100% !important; overflow-x: auto !important; border-collapse: collapse !important; }
[${VIEW_ATTR}] th, [${VIEW_ATTR}] td { border: 1px solid currentColor !important; padding: 0.4em 0.6em !important; }
[${VIEW_ATTR}] pre { white-space: pre-wrap !important; overflow-wrap: anywhere !important; }
`;

/**
 * FALLBACK ("hide distractions"): used when extraction fails. The issue requires it to
 * exist inside #25 even if the fuller #27 feature is deferred, so this is deliberately
 * the simplest thing that works: hide the page-level landmarks that are usually clutter.
 *
 * The :not(... *) part keeps landmarks that sit INSIDE main content (an <article>'s own
 * <header>, say), so we don't hide a real heading by accident. #27 will replace this with
 * a configurable version that dims instead of hides and keeps necessary controls.
 */
export const HIDE_DISTRACTIONS_CSS = `
:where(header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]):not(:where(main, article, [role="main"]) *):not([id^="iic-"]) {
  display: none !important;
}
`;
