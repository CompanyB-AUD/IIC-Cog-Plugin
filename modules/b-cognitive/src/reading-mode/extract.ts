/**
 * EXTRACT: turns a live page into a safe, anchored copy of its main content.
 *
 * The pipeline, in the order it MUST run:
 *   1. list the original blocks         (so we can map positions back later)
 *   2. clone the whole document         (Readability destroys what it is given)
 *   3. stamp the clone's blocks         (anchors; see anchors.ts)
 *   4. run Readability on the clone     (finds the main content)
 *   5. sanitize the result              (LAST step; see sanitize.ts)
 *
 * This file never touches the live page: it only reads it. The caller decides what to
 * show. Every failure is returned as a value (not thrown) so the caller can fall back
 * with a clear message instead of showing an empty view (AC-E4.4).
 */
import { Readability } from '@mozilla/readability';
import { ANCHOR_ATTR, collectBlocks } from './anchors';
import { sanitizeToFragment } from './sanitize';

/** Why extraction did not produce a usable view. Each maps to a plain-language message. */
export type FailureReason =
  | 'no-main-content' // Readability found nothing substantial (e.g. an app-like page, or too little text)
  | 'anchor-mismatch' // original and clone block lists differ, so positions could not be mapped
  | 'extraction-error'; // something threw (including "sanitizer unavailable")

export interface ExtractionOk {
  status: 'ok';
  /** Page title as Readability read it. Used only if the content has no <h1>. */
  title: string;
  /** Sanitized main content. Elements carry data-iic-anchor numbers. Safe to insert. */
  fragment: DocumentFragment;
  /** Blocks of the ORIGINAL page, index = anchor number. Kept in memory, never written to the page. */
  originalBlocks: Element[];
  lang: string | null;
  dir: 'ltr' | 'rtl' | null;
}

export interface ExtractionFailed {
  status: 'failed';
  reason: FailureReason;
  /** Technical detail for the console only; never shown to the reader. */
  detail?: string;
}

export type ExtractionResult = ExtractionOk | ExtractionFailed;

/**
 * Readability returns its best attempt even when the text is shorter than its own
 * charThreshold, and returns null only when there is no text at all. A reading view with
 * one short line is worse than the fallback, so we add our own minimum.
 *
 * ASSUMPTION, NOT EVIDENCE: 100 characters is a starting guess (about one to two sentences).
 * Revisit it with the pages used in testing (Sprint 4) and record the outcome.
 */
export const MIN_ARTICLE_CHARS = 100;

/** Only well-formed language tags (e.g. "en", "en-GB") are copied onto our element. */
const LANG_TAG = /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

/**
 * Extracts the main content of `doc` without modifying `doc`.
 *
 * Why we rely on Readability's own verdict instead of calling isProbablyReaderable()
 * first: its documentation says that check can give false positives AND false negatives.
 * A false negative would wrongly block a page that parse() could have handled, so
 * parse()'s result is the only verdict we trust.
 */
export function extractReadableContent(doc: Document): ExtractionResult {
  try {
    // 1. Blocks of the real page, in document order.
    const originalBlocks = collectBlocks(doc);

    // 2. Deep clone. Readability's docs: parse() "modifies the DOM"; pass a clone to
    //    protect the page. The clone is not attached to any window, so scripts in it
    //    never run and it has no effect on what the user sees.
    const clone = doc.cloneNode(true) as Document;

    // 3. A deep clone has the same blocks in the same order. If not (should never
    //    happen), positions can't be trusted, so stop rather than guess.
    const cloneBlocks = collectBlocks(clone);
    if (cloneBlocks.length !== originalBlocks.length) {
      return {
        status: 'failed',
        reason: 'anchor-mismatch',
        detail: `original has ${originalBlocks.length} blocks, clone has ${cloneBlocks.length}`,
      };
    }
    cloneBlocks.forEach((block, i) => block.setAttribute(ANCHOR_ATTR, String(i)));

    // 4. Find the main content. parse() returns null when it finds nothing usable
    //    (the docs don't say so explicitly; this is covered by a test).
    const article = new Readability(clone).parse();
    if (!article || !article.content) return { status: 'failed', reason: 'no-main-content' };
    const textLength = article.length ?? 0; // Readability types allow null
    if (textLength < MIN_ARTICLE_CHARS) {
      return { status: 'failed', reason: 'no-main-content', detail: `only ${textLength} characters found` };
    }

    // 5. Sanitize LAST. Nothing may modify the markup after this point.
    const fragment = sanitizeToFragment(article.content);
    if ((fragment.textContent ?? '').trim().length === 0) {
      // The sanitizer removed everything (the "content" was only scripts/forms/media).
      return { status: 'failed', reason: 'no-main-content', detail: 'nothing left after sanitizing' };
    }

    return {
      status: 'ok',
      title: (article.title ?? '').trim(),
      fragment,
      originalBlocks,
      lang: article.lang && LANG_TAG.test(article.lang) ? article.lang : null,
      dir: article.dir === 'ltr' || article.dir === 'rtl' ? article.dir : null,
    };
  } catch (err) {
    return {
      status: 'failed',
      reason: 'extraction-error',
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}
