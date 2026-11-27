/**
 * READING MODE module (#25): "Implement clean reading mode and restoration".
 *
 * WHAT IT DOES
 *  - ON : extract the page's main content, show it as one clean column, hide the rest.
 *  - OFF: remove everything we added and put the reader back where they were.
 *  - If the main content can't be found: say so in plain language and fall back to
 *    hiding page-level clutter (AC-E4.4), instead of showing an empty page.
 *
 * HOW IT PLUGS IN (the Core contract, apiVersion 1; see packages/core/src/contract.ts)
 *  - init(ctx)     : called once; we just remember the context.
 *  - apply(settings): called whenever settings change. MUST be idempotent: calling it
 *                     twice with the same settings must leave the page unchanged.
 *  - teardown()    : undo everything.
 *  We never write to the page's <style> or storage directly; we go through `ctx`.
 *
 * STATE
 * The module is a small state machine with exactly three states, so "what do I have
 * to clean up?" always has one clear answer:
 *    off ──enable──▶ reading   (view on the page + reading rules)
 *      └──enable──▶ fallback   (only the hide-distractions rules)
 *    reading/fallback ──disable or teardown──▶ off
 *
 * STATUS OF INTEGRATION (be honest in reviews): written against the PROPOSED contract
 * (ADR 0001, not yet agreed with Company A). Position keeping here is this module's own
 * (anchors.ts); it does not yet use ctx.position.preserve, which is a placeholder until #19.
 */
import { defineModule, type ModuleContext, type ModuleSettings } from '@iic/core';
import { extractReadableContent, type ExtractionOk, type FailureReason } from './extract';
import { buildReadingView, scrollViewToAnchor, topVisibleOriginalIndex, topVisibleViewAnchor } from './reading-view';
import { HIDE_DISTRACTIONS_CSS, READING_VIEW_CSS, RULES_FALLBACK, RULES_READING } from './styles';

/** Plain-language notices. They describe the page, not the reader, and never mention disability. */
const FALLBACK_MESSAGES: Record<FailureReason, string> = {
  'no-main-content':
    "Reading mode couldn't find the main text on this page. Menus and side panels are hidden instead.",
  'anchor-mismatch':
    "Reading mode couldn't safely copy this page. Menus and side panels are hidden instead.",
  'extraction-error':
    "Reading mode couldn't run on this page. Menus and side panels are hidden instead.",
};

type State =
  | { kind: 'off' }
  | { kind: 'fallback' }
  | { kind: 'reading'; view: HTMLElement; originalBlocks: readonly Element[]; savedScrollY: number };

/**
 * Factory so each test (or each page) gets its own private state. Production code uses
 * the ready-made `readingMode` exported from index.ts.
 */
export function createReadingMode(doc: Document = document) {
  let ctx: ModuleContext | null = null;
  let state: State = { kind: 'off' };

  const win = () => doc.defaultView ?? window;

  /** Show the reading view. If anything fails halfway, undo it: the registry will NOT call teardown() after an apply() error. */
  function enterReading(c: ModuleContext, result: ExtractionOk): void {
    // Measure BEFORE changing the page: once the original is hidden every block has zero height.
    const topIndex = topVisibleOriginalIndex(result.originalBlocks);
    const savedScrollY = win().scrollY;

    const view = buildReadingView(doc, result);
    try {
      doc.body.append(view);
      c.style.addRules(RULES_READING, READING_VIEW_CSS);
      state = { kind: 'reading', view, originalBlocks: result.originalBlocks, savedScrollY };

      // Land the reader on the same paragraph in the new view; top of page if unknown.
      const landed = topIndex !== null && scrollViewToAnchor(view, topIndex);
      if (!landed) win().scrollTo(0, 0);
    } catch (err) {
      view.remove();
      c.style.removeRules(RULES_READING);
      state = { kind: 'off' };
      throw err; // let the registry show its standard "couldn't run" notice
    }
    c.announce('Reading mode on.');
  }

  /** Extraction failed: explain, then hide page-level clutter instead. */
  function enterFallback(c: ModuleContext, reason: FailureReason, detail?: string): void {
    c.log.warn(`Reading mode extraction failed (${reason})${detail ? `: ${detail}` : ''}`);
    c.style.addRules(RULES_FALLBACK, HIDE_DISTRACTIONS_CSS);
    state = { kind: 'fallback' };
    c.notify(FALLBACK_MESSAGES[reason], 'warning');
    c.announce(FALLBACK_MESSAGES[reason]);
  }

  /** Remove everything and put the reader back at the matching place. */
  function leave(announce: boolean): void {
    const c = ctx;
    const previous = state;
    state = { kind: 'off' };

    if (previous.kind === 'reading') {
      // Measure the view BEFORE removing it, or there is nothing left to measure.
      const anchor = topVisibleViewAnchor(previous.view);
      previous.view.remove();
      c?.style.removeRules(RULES_READING);

      // Original is visible again: scroll to the block with the same number (AC-E4.5).
      // If the page replaced that element meanwhile, fall back to where we were before.
      const target = anchor === null ? undefined : previous.originalBlocks[anchor];
      if (target?.isConnected) target.scrollIntoView({ block: 'start', behavior: 'instant' });
      else win().scrollTo(0, previous.savedScrollY);
    } else if (previous.kind === 'fallback') {
      c?.style.removeRules(RULES_FALLBACK);
    }

    if (announce && previous.kind !== 'off') c?.announce('Reading mode off.');
  }

  return defineModule({
    id: 'b.reading-mode',
    owner: 'B',
    apiVersion: 1,
    title: 'Reading mode', // says what it does, never who it is for
    group: 'focus',
    settings: [{ key: 'enabled', type: 'boolean', default: false }],
    controls: [
      {
        kind: 'toggle',
        setting: 'enabled',
        label: 'Reading mode',
        description: 'Show only the main text in a clean, single column',
      },
    ],

    init(context) {
      ctx = context;
    },

    apply(settings: ModuleSettings) {
      const c = ctx;
      if (!c) return;
      const wantOn = settings.enabled === true;

      if (wantOn && state.kind === 'off') {
        // Only extract when switching ON from off. Re-applying "on" does nothing (idempotent),
        // and a page that already failed once is not re-tried on every settings change.
        const result = extractReadableContent(doc);
        if (result.status === 'ok') enterReading(c, result);
        else enterFallback(c, result.reason, result.detail);
      } else if (!wantOn && state.kind !== 'off') {
        leave(true);
      }
    },

    teardown() {
      leave(false);
      ctx = null;
    },
  });
}

/** The module instance the extension registers. */
export const readingMode = createReadingMode();
