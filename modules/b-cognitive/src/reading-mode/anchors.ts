/**
 * ANCHORS: how reading mode finds "the same place" in two different copies of a page.
 *
 * THE PROBLEM
 * Reading mode shows a cleaned COPY of the page's main content. The reader may be in
 * the middle of paragraph 12 when they switch it on or off. We must land them on
 * paragraph 12 in the other view (AC-E2.3 and AC-E4.5), even though the two views are
 * built from different elements and have different heights.
 *
 * THE IDEA
 * 1. List the "blocks" (headings, paragraphs, list items ...) of the ORIGINAL page in
 *    document order. A block's number is its position in that list: 0, 1, 2 ...
 * 2. Build the same list for the CLONE the extractor works on, and stamp each clone
 *    block with its number in a `data-iic-anchor` attribute.
 * 3. Readability keeps those attributes on whatever blocks survive into the reading view.
 * 4. To go from one view to the other: find the block at the top of the screen, read its
 *    number, and scroll to the block with the same number in the other view.
 *
 * WHY THE STAMPS GO ON THE CLONE, NOT THE LIVE PAGE
 * Writing attributes onto the real page would be a change we would have to track and
 * undo (reset, turning the plugin off). The clone is thrown away, so nothing leaks.
 * The original blocks are remembered in a plain JavaScript array instead.
 *
 * Everything in this file is pure (no module state, no DOM writes), so it can be unit
 * tested without a browser layout engine.
 */

/** Attribute written onto blocks of the CLONE only. Its value is the block's number. */
export const ANCHOR_ATTR = 'data-iic-anchor';

/**
 * Elements that count as a "block". Chosen to be the things a reader's place can sit in.
 * Deliberately NOT included: div/span (layout wrappers, change between views) and img
 * (an image is normally inside a figure or paragraph that already counts).
 */
export const BLOCK_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, li, blockquote, pre, table, figure';

/**
 * The plugin's own UI must never be treated as page content:
 *  - the toolbar host (id "iic-toolbar-host"; ids starting "iic-" are reserved for plugin UI)
 *  - the reading view itself, if it is already on the page
 */
export const PLUGIN_UI_SELECTOR = '[id^="iic-"], [data-iic-reading-view]';

/**
 * Lists the blocks of a document (or element) in document order, skipping plugin UI.
 * Called on BOTH the original and its clone; because the clone is a deep copy, the two
 * lists have the same length and the same order, so index i matches in both.
 */
export function collectBlocks(root: Document | Element): Element[] {
  return Array.from(root.querySelectorAll(BLOCK_SELECTOR)).filter((el) => !el.closest(PLUGIN_UI_SELECTOR));
}

/** The vertical extent of an element on screen, in pixels from the top of the viewport. */
export interface Extent {
  top: number;
  bottom: number;
}

/**
 * Finds the first block that is at least partly on screen, i.e. "where the reader is".
 *
 * `measure(i)` returns block i's extent, or null if it can't be measured. It is passed in
 * (instead of calling getBoundingClientRect here) so tests can supply fake positions:
 * the test environment has no layout engine.
 *
 * Blocks with no height are skipped: they are hidden (display: none) or empty, and would
 * otherwise be wrongly picked because their position is reported as 0.
 *
 * @param viewportTop  where the readable area starts; 0 unless a fixed header covers the top
 * @returns the block's number, or null if nothing measurable is on screen
 */
export function findFirstVisibleIndex(
  count: number,
  measure: (index: number) => Extent | null,
  viewportTop = 0,
): number | null {
  for (let i = 0; i < count; i++) {
    const extent = measure(i);
    if (!extent) continue;
    if (extent.bottom === extent.top) continue; // no height: hidden or empty
    if (extent.bottom > viewportTop) return i;
  }
  return null;
}

/**
 * The target view may not contain the exact block we want (Readability drops blocks it
 * judges to be clutter). Pick the closest one instead: the nearest block at or BEFORE the
 * wanted number, so the reader lands slightly above their place, never past it. If nothing
 * earlier exists, take the nearest one after.
 *
 * @returns a number from `available`, or null if `available` is empty
 */
export function nearestAvailableIndex(wanted: number, available: Iterable<number>): number | null {
  let before: number | null = null;
  let after: number | null = null;
  for (const n of available) {
    if (n <= wanted) {
      if (before === null || n > before) before = n;
    } else if (after === null || n < after) {
      after = n;
    }
  }
  return before ?? after;
}
