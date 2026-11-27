import { describe, expect, it } from 'vitest';
import { collectBlocks, findFirstVisibleIndex, nearestAvailableIndex, type Extent } from '../src/reading-mode/anchors';

describe('findFirstVisibleIndex: where is the reader?', () => {
  // Five blocks stacked 100px apart; the reader has scrolled 250px, so block 2 spans 200..300
  // minus 250 = -50..50 and is the first one still on screen.
  const stack = (scrolled: number) => (i: number): Extent => ({ top: i * 100 - scrolled, bottom: i * 100 + 90 - scrolled });

  it('picks the first block whose bottom is below the top of the screen', () => {
    expect(findFirstVisibleIndex(5, stack(250))).toBe(2);
  });

  it('picks block 0 when the page has not been scrolled', () => {
    expect(findFirstVisibleIndex(5, stack(0))).toBe(0);
  });

  it('skips blocks with no height (hidden or empty); they report position 0 and would be wrongly chosen', () => {
    const measure = (i: number): Extent => (i < 2 ? { top: 0, bottom: 0 } : { top: 10, bottom: 50 });
    expect(findFirstVisibleIndex(4, measure)).toBe(2);
  });

  it('skips blocks that cannot be measured', () => {
    expect(findFirstVisibleIndex(3, (i) => (i === 0 ? null : { top: 0, bottom: 20 }))).toBe(1);
  });

  it('returns null when everything is above the screen, or there are no blocks', () => {
    expect(findFirstVisibleIndex(3, () => ({ top: -200, bottom: -100 }))).toBeNull();
    expect(findFirstVisibleIndex(0, () => ({ top: 0, bottom: 10 }))).toBeNull();
  });

  it('honours a viewportTop offset (e.g. a fixed header covering the top 80px)', () => {
    const measure = (i: number): Extent => ({ top: i * 40 - 10, bottom: i * 40 + 30 });
    expect(findFirstVisibleIndex(5, measure, 0)).toBe(0);
    expect(findFirstVisibleIndex(5, measure, 80)).toBe(2);
  });
});

describe('nearestAvailableIndex: the block we want may have been dropped from the other view', () => {
  it('returns the wanted block when it exists', () => {
    expect(nearestAvailableIndex(5, [1, 5, 9])).toBe(5);
  });

  it('prefers the nearest EARLIER block, so the reader lands above their place, never past it', () => {
    expect(nearestAvailableIndex(7, [1, 5, 9])).toBe(5);
  });

  it('falls back to the nearest later block when nothing earlier exists', () => {
    expect(nearestAvailableIndex(0, [4, 9])).toBe(4);
  });

  it('returns null when there is nothing to choose from', () => {
    expect(nearestAvailableIndex(3, [])).toBeNull();
  });
});

describe('collectBlocks', () => {
  it('lists headings, paragraphs and list items in document order, and skips plugin UI', () => {
    document.body.innerHTML = `
      <h1>Title</h1><p>One</p>
      <ul><li>Item</li></ul>
      <div id="iic-toolbar-host"><p>toolbar paragraph</p></div>
      <article data-iic-reading-view=""><p>copy paragraph</p></article>
      <div><span>not a block</span></div>`;
    const tags = collectBlocks(document).map((el) => el.tagName);
    expect(tags).toEqual(['H1', 'P', 'LI']);
  });
});
