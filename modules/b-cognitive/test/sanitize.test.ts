import { describe, expect, it } from 'vitest';
import { sanitizeToFragment } from '../src/reading-mode/sanitize';

/** Helper: sanitize, then read the result back as HTML so assertions are easy to write. */
function clean(html: string): string {
  const holder = document.createElement('div');
  holder.append(sanitizeToFragment(html));
  return holder.innerHTML;
}

describe('sanitizeToFragment: nothing dangerous reaches the page', () => {
  it('removes scripts, event handlers and javascript: links', () => {
    const out = clean(
      '<p onclick="steal()">Hi <script>alert(1)</script><a href="javascript:alert(2)">link</a><img src="x" onerror="alert(3)"></p>',
    );
    expect(out).not.toMatch(/script/i);
    expect(out).not.toMatch(/onclick|onerror/i);
    expect(out).not.toMatch(/javascript:/i);
    expect(out).toContain('Hi');
  });

  it('removes iframes, embeds, SVG and inline styles', () => {
    const out = clean(
      '<p style="position:fixed">x</p><iframe src="https://evil.example"></iframe><embed src="a"><svg><script>1</script></svg>',
    );
    expect(out).not.toMatch(/iframe|embed|svg|style=/i);
  });

  it('removes form controls AND the text of their labels, so no orphan words are left behind', () => {
    const out = clean('<p>Read this.</p><label for="n">Your notes</label><textarea id="n"></textarea><button>Send</button>');
    expect(out).toContain('Read this.');
    expect(out).not.toMatch(/textarea|button|label/i);
    expect(out).not.toContain('Your notes');
    expect(out).not.toContain('Send');
  });

  it('removes media players (the original page keeps them)', () => {
    const out = clean('<p>Watch:</p><video src="a.mp4" controls><track kind="captions" src="a.vtt">Fallback text</video>');
    expect(out).not.toMatch(/video|track/i);
    expect(out).not.toContain('Fallback text');
  });

  it('removes element ids, which would duplicate ids in the hidden original', () => {
    expect(clean('<p id="p1">text</p>')).not.toContain('id=');
  });
});

describe('sanitizeToFragment: content reading mode must keep', () => {
  it('keeps headings, lists, tables, links and images with alt text', () => {
    const out = clean(
      '<h2>Heading</h2><ol><li>One</li></ol><table><tr><td>Cell</td></tr></table><a href="https://example.com/x">Read more</a><img src="https://example.com/a.png" alt="A chart of results">',
    );
    expect(out).toContain('<h2>Heading</h2>');
    expect(out).toContain('<li>One</li>');
    expect(out).toContain('<td>Cell</td>');
    expect(out).toContain('href="https://example.com/x"');
    expect(out).toContain('alt="A chart of results"');
  });

  it('keeps the anchor attribute that position keeping depends on', () => {
    expect(clean('<p data-iic-anchor="7">text</p>')).toContain('data-iic-anchor="7"');
  });

  it('keeps the text of unknown wrapper elements (e.g. custom elements) instead of dropping it', () => {
    expect(clean('<lms-card>Important sentence.</lms-card>')).toContain('Important sentence.');
  });
});
