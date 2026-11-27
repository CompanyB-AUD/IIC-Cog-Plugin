/**
 * SANITIZE: the safety gate between "text extracted from someone else's web page" and
 * "elements we put on the page ourselves".
 *
 * WHY IT EXISTS
 * Readability does NOT make its output safe; its own documentation says to run it through
 * a sanitizer such as DOMPurify. The page we are reading could contain anything, so
 * whatever we insert must first pass through here (AGENTS.md: never inject unsanitized
 * page HTML).
 *
 * TWO RULES FROM DOMPURIFY'S DOCS THAT SHAPE THIS FILE
 *  1. "If you first sanitize HTML and then modify it afterwards, you might easily void
 *     the effects of sanitization." So sanitizing is the LAST thing done to the markup.
 *  2. If the browser can't support DOMPurify, it silently returns its input unchanged.
 *     That would be a security hole, so we check `isSupported` and refuse instead.
 *
 * WHY A DocumentFragment AND NOT A STRING
 * Turning sanitized HTML back into text and parsing it again (innerHTML) is a known route
 * for "mutation XSS". Asking DOMPurify for the DOM nodes directly skips that second parse.
 */
import DOMPurify from 'dompurify';

/**
 * Tags removed even though they are valid HTML. Reading mode is for READING:
 *  - script/style/iframe/object/embed: active or foreign content
 *  - form controls and labels: a copy of an input would be a dead duplicate. The real,
 *    working form stays in the original page, and we must never alter form state.
 *  - video/audio/source/track: two copies of a media player could play at once. Media is
 *    left in the original page (a documented limitation; captions are Epic E6).
 */
const FORBIDDEN_TAGS = [
  'script', 'style', 'iframe', 'object', 'embed',
  'form', 'input', 'button', 'textarea', 'select', 'option', 'label', 'fieldset',
  'video', 'audio', 'source', 'track',
];

/**
 * For these tags the text INSIDE is dropped together with the tag. By default DOMPurify
 * keeps the text of a removed element, which would leave orphan words behind (for example
 * the caption "Your notes ..." of a removed text box, or a video's fallback message).
 * Form and fieldset are NOT listed: they may wrap real paragraphs we want to keep.
 */
const DROP_CONTENT_TAGS = [
  'label', 'button', 'textarea', 'select', 'option',
  'video', 'audio', 'source', 'track', 'iframe', 'object', 'embed',
];

/**
 * Turns untrusted HTML into a safe DocumentFragment.
 *
 * What the defaults already do (per DOMPurify's documentation): strip script content,
 * event-handler attributes (onerror ...) and javascript: URLs. We keep `alt`, `href`,
 * tables, lists and the `data-iic-anchor` attribute (data-* attributes are allowed by
 * default), which is what reading mode needs.
 *
 * @throws if DOMPurify is not supported in this environment
 */
export function sanitizeToFragment(dirtyHtml: string): DocumentFragment {
  if (!DOMPurify.isSupported) {
    throw new Error('DOMPurify is not supported here; refusing to render unsanitized content.');
  }
  return DOMPurify.sanitize(dirtyHtml, {
    // Plain HTML only: no SVG or MathML (large attack surface, nothing we need to read).
    USE_PROFILES: { html: true },
    FORBID_TAGS: FORBIDDEN_TAGS,
    ADD_FORBID_CONTENTS: DROP_CONTENT_TAGS,
    // style: inline styles could restyle or overlay the page (e.g. fake buttons); our CSS is the only styling.
    // id: the original page is still in the document (hidden), so copied ids would be duplicates.
    //     Known limitation: links to "#some-id" on the same page do not scroll in reading mode.
    FORBID_ATTR: ['style', 'id'],
    RETURN_DOM_FRAGMENT: true,
  });
}
