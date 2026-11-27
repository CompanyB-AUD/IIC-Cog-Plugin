import { defineModule, type ModuleContext } from '../contract';

/**
 * STUB MODULE, for the walking skeleton and AC-E3.1 only.
 * It is NOT the real text-spacing feature (#28, owned by Feature Implementation).
 * It exists to prove the contract end to end: settings, toolbar controls,
 * persistence, style ownership and teardown.
 */

let ctx: ModuleContext | null = null;
const RULES = 'line-height';

export const lineSpacingStub = defineModule({
  id: 'stub.line-spacing',
  owner: 'B',
  apiVersion: 1,
  title: 'Line spacing (demo stub)',
  group: 'reading',
  settings: [
    { key: 'enabled', type: 'boolean', default: false },
    { key: 'lineHeight', type: 'number', default: 1.8, min: 1.5, max: 2.5, step: 0.1 },
  ],
  controls: [
    { kind: 'toggle', setting: 'enabled', label: 'Wider line spacing', description: 'Adds space between lines of text' },
    { kind: 'slider', setting: 'lineHeight', label: 'Line spacing', unit: '×' },
  ],

  init(context) {
    ctx = context;
  },

  apply(settings) {
    if (!ctx) return;
    if (settings.enabled === true && typeof settings.lineHeight === 'number') {
      ctx.style.setToken('--iic-line-height', String(settings.lineHeight));
      ctx.style.addRules(
        RULES,
        `:where(main, [role="main"], article) :where(p, li, dd, blockquote) {
  line-height: var(--iic-line-height) !important;
}`,
      );
    } else {
      ctx.style.removeRules(RULES);
      ctx.style.setToken('--iic-line-height', null);
    }
  },

  teardown() {
    ctx?.style.removeRules(RULES);
    ctx?.style.setToken('--iic-line-height', null);
    ctx = null;
  },
});
