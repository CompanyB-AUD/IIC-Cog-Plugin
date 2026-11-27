import { describe, expect, it } from 'vitest';
import demoHtml from '../../../demo-site/index.html?raw';
import { extractReadableContent, MIN_ARTICLE_CHARS } from '../src/reading-mode/extract';
import { buildReadingView } from '../src/reading-mode/reading-view';
import { ESSENTIAL_ITEMS, INTERACTIVE_ONLY_IN_ORIGINAL, SHOULD_BE_ABSENT } from './fixtures/demo-checklist';

/** Parse an HTML string into a separate document (never the live test page). */
const parse = (html: string) => new DOMParser().parseFromString(html, 'text/html');
const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

function viewFor(html: string) {
  const doc = parse(html);
  const result = extractReadableContent(doc);
  if (result.status !== 'ok') throw new Error(`expected ok, got ${result.reason}`);
  return { doc, result, view: buildReadingView(doc, result) };
}

describe('extractReadableContent on the demo page (AC-E4.1 / AC-E4.2)', () => {
  it('keeps 100% of the hand-made essential items, in the author\'s order', () => {
    const { view } = viewFor(demoHtml);
    const selector = 'h1, h2, h3, h4, h5, h6, p, li';
    const shown = [...view.querySelectorAll(selector)].map((el) => ({ tag: el.tagName, text: norm(el.textContent) }));

    let cursor = -1; // each item must be found AFTER the previous one => order is preserved
    for (const item of ESSENTIAL_ITEMS) {
      const wantTag = item.kind === 'heading' ? `H${item.level}` : item.kind === 'list-item' ? 'LI' : 'P';
      const at = shown.findIndex((s, i) => i > cursor && s.tag === wantTag && s.text.includes(item.text));
      expect(at, `missing or out of order: ${wantTag} "${item.text}"`).toBeGreaterThan(cursor);
      cursor = at;
    }
  });

  it('leaves out page furniture and interactive controls', () => {
    const { view } = viewFor(demoHtml);
    const text = norm(view.textContent);
    for (const gone of [...SHOULD_BE_ABSENT, ...INTERACTIVE_ONLY_IN_ORIGINAL]) expect(text).not.toContain(gone);
    expect(view.querySelector('textarea, nav, header, footer, button, input')).toBeNull();
  });

  it('has exactly one h1', () => {
    const { view } = viewFor(demoHtml);
    expect(view.querySelectorAll('h1')).toHaveLength(1);
  });

  it('never changes the original page', () => {
    const doc = parse(demoHtml);
    const before = doc.documentElement.outerHTML;
    extractReadableContent(doc);
    expect(doc.documentElement.outerHTML).toBe(before);
  });

  it('numbers blocks so the reading view and the original share anchors', () => {
    const { result, view } = viewFor(demoHtml);
    const anchors = [...view.querySelectorAll('[data-iic-anchor]')].map((el) => Number(el.getAttribute('data-iic-anchor')));
    expect(anchors.length).toBeGreaterThan(5);
    for (const a of anchors) {
      const original = result.originalBlocks[a];
      expect(original).toBeDefined();
      const shown = norm(view.querySelector(`[data-iic-anchor="${a}"]`)?.textContent);
      expect(norm(original?.textContent)).toContain(shown.slice(0, 30));
    }
  });
});

describe('extractReadableContent: when it cannot help (AC-E4.4)', () => {
  it('fails with no-main-content on a page with almost no text', () => {
    const r = extractReadableContent(parse('<body><nav><a href="#">Home</a></nav><p>Hi</p></body>'));
    expect(r).toMatchObject({ status: 'failed', reason: 'no-main-content' });
  });

  it('fails when the text is shorter than the minimum', () => {
    const short = 'x'.repeat(Math.floor(MIN_ARTICLE_CHARS / 2));
    const r = extractReadableContent(parse(`<body><article><p>${short}</p></article></body>`));
    expect(r.status).toBe('failed');
  });

  it('does not run scripts that were in the page', () => {
    (globalThis as { __iicPwned?: boolean }).__iicPwned = false;
    const body = 'Safe sentence. '.repeat(30);
    const { view } = viewFor(
      `<body><article><h1>T</h1><p>${body}</p><img src="x" onerror="globalThis.__iicPwned=true"><script>globalThis.__iicPwned=true</script></article></body>`,
    );
    expect(view.innerHTML).not.toMatch(/script|onerror/i);
    expect((globalThis as { __iicPwned?: boolean }).__iicPwned).toBe(false);
  });
});
