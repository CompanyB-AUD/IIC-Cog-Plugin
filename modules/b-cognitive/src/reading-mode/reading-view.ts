/**
 * READING VIEW: building the on-page element, and moving the reader's place between views.
 * The functions that touch layout (getBoundingClientRect, scrolling) live here, kept small
 * and separate from the pure logic in anchors.ts.
 */
import { ANCHOR_ATTR, findFirstVisibleIndex, nearestAvailableIndex } from './anchors';
import type { ExtractionOk } from './extract';
import { VIEW_ATTR } from './styles';

/**
 * Builds the element that will hold the reading copy. A real <article> so assistive
 * technology announces it sensibly; labelled; focusable by script only (tabindex -1) so
 * it does NOT add a stop to the Tab order.
 */
export function buildReadingView(doc: Document, result: ExtractionOk): HTMLElement {
  const view = doc.createElement('article');
  view.setAttribute(VIEW_ATTR, '');
  view.setAttribute('aria-label', 'Reading mode');
  view.tabIndex = -1;
  if (result.lang) view.lang = result.lang;
  if (result.dir) view.dir = result.dir;

  view.append(result.fragment);
  restoreHeadingLevels(doc, view, result.originalBlocks);

  // Readability removes a heading that merely repeats the page title. If that left the
  // copy with no <h1> (the page itself had none), add the title as one so the page still
  // has a main heading. textContent (not innerHTML) so the title can never be read as markup.
  if (result.title && !view.querySelector('h1')) {
    const h1 = doc.createElement('h1');
    h1.textContent = result.title;
    view.prepend(h1);
  }
  return view;
}

const HEADING_TAG = /^H[1-6]$/;

/**
 * Readability turns every <h1> into an <h2> (it treats the page title as the only h1).
 * Heading levels are navigation for screen-reader users, so we put each heading back to
 * the level the author wrote, using the anchor number to find the original element.
 *
 * Why this does not undermine the sanitizing: nothing is re-parsed. We create a new
 * element whose tag is one of h1..h6 (already allowed), and MOVE the existing, already
 * sanitized children and attributes into it. No new markup is introduced.
 */
export function restoreHeadingLevels(doc: Document, view: HTMLElement, originalBlocks: readonly Element[]): void {
  for (const [n, el] of anchorsIn(view)) {
    const original = originalBlocks[n];
    if (!original || !HEADING_TAG.test(original.tagName) || !HEADING_TAG.test(el.tagName)) continue;
    if (original.tagName === el.tagName) continue;
    const fixed = doc.createElement(original.tagName.toLowerCase());
    for (const attr of Array.from(el.attributes)) fixed.setAttribute(attr.name, attr.value);
    fixed.append(...Array.from(el.childNodes));
    el.replaceWith(fixed);
  }
}

/** Block number (see anchors.ts) of the original-page block at the top of the screen, or null. */
export function topVisibleOriginalIndex(blocks: readonly Element[]): number | null {
  return findFirstVisibleIndex(blocks.length, (i) => blocks[i]?.getBoundingClientRect() ?? null);
}

/** All anchor numbers present in the view, mapped to their elements. */
function anchorsIn(view: HTMLElement): Map<number, Element> {
  const map = new Map<number, Element>();
  for (const el of Array.from(view.querySelectorAll(`[${ANCHOR_ATTR}]`))) {
    const n = Number(el.getAttribute(ANCHOR_ATTR));
    if (Number.isInteger(n) && n >= 0) map.set(n, el);
  }
  return map;
}

/** Anchor number of the reading-view block at the top of the screen, or null. */
export function topVisibleViewAnchor(view: HTMLElement): number | null {
  const entries = Array.from(anchorsIn(view)).sort((a, b) => a[0] - b[0]);
  const index = findFirstVisibleIndex(entries.length, (i) => entries[i]?.[1].getBoundingClientRect() ?? null);
  return index === null ? null : (entries[index]?.[0] ?? null);
}

/**
 * Scrolls the reading view so the block matching `anchor` (or the nearest earlier one)
 * is at the top. `behavior: 'instant'` skips smooth-scroll animation, which the page's own
 * CSS (scroll-behavior: smooth) could otherwise force on people who prefer reduced motion.
 * @returns true if something was scrolled to
 */
export function scrollViewToAnchor(view: HTMLElement, anchor: number): boolean {
  const map = anchorsIn(view);
  const chosen = nearestAvailableIndex(anchor, map.keys());
  const target = chosen === null ? undefined : map.get(chosen);
  if (!target) return false;
  target.scrollIntoView({ block: 'start', behavior: 'instant' });
  return true;
}
