import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ModuleRegistry, PrefsStore, StyleService, type StorageAreaLike } from '@iic/core';
import demoHtml from '../../../demo-site/index.html?raw';
import { createReadingMode } from '../src/reading-mode/reading-mode';

/** In-memory stand-in for chrome.storage.local. */
function memoryArea(): StorageAreaLike {
  const data: Record<string, unknown> = {};
  return {
    get: async (k) => (k in data ? { [k]: data[k] } : {}),
    set: async (items) => void Object.assign(data, items),
    onChanged: () => () => {},
  };
}

/** Load the demo page into the live jsdom document. */
function loadDemo() {
  const parsed = new DOMParser().parseFromString(demoHtml, 'text/html');
  document.head.innerHTML = parsed.head.innerHTML;
  document.body.innerHTML = parsed.body.innerHTML;
  document.documentElement.removeAttribute('style');
}

/** Snapshot of everything the plugin could leave behind. */
const snapshot = () => document.documentElement.outerHTML;

async function setup() {
  const mod = createReadingMode(document);
  const prefs = new PrefsStore(memoryArea(), { [mod.id]: mod.settings });
  await prefs.load();
  const hooks = { notify: vi.fn(), announce: vi.fn() };
  const registry = new ModuleRegistry(prefs, new StyleService(document), hooks, window);
  registry.register(mod);
  await registry.start();
  const set = async (on: boolean) => {
    await prefs.setValue(mod.id, 'enabled', on);
    await registry.applyOne(mod.id);
  };
  return { mod, registry, hooks, set };
}

const viewEl = () => document.querySelector('[data-iic-reading-view]');

beforeEach(() => {
  loadDemo();
  // jsdom has no layout: scrollIntoView and scrollTo do not exist or do nothing.
  Element.prototype.scrollIntoView = vi.fn();
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});
afterEach(() => vi.restoreAllMocks());

describe('reading mode through the real registry', () => {
  it('is off by default and does not touch the page', async () => {
    const before = snapshot();
    await setup();
    expect(snapshot()).toBe(before);
  });

  it('turns on: adds one reading view and the reading rules, and announces', async () => {
    const { set, hooks } = await setup();
    await set(true);
    expect(document.querySelectorAll('[data-iic-reading-view]')).toHaveLength(1);
    expect(document.querySelector('style')).not.toBeNull();
    expect(hooks.announce).toHaveBeenCalledWith('Reading mode on.', 'polite');
  });

  it('turns off: leaves NOTHING behind (AC-E4.3)', async () => {
    const before = snapshot();
    const { set } = await setup();
    await set(true);
    await set(false);
    expect(snapshot()).toBe(before);
  });

  it('is idempotent: applying "on" twice makes one view', async () => {
    const { set, registry, mod } = await setup();
    await set(true);
    await registry.applyOne(mod.id);
    expect(document.querySelectorAll('[data-iic-reading-view]')).toHaveLength(1);
  });

  it('teardown (registry.stopAll) removes everything', async () => {
    const before = snapshot();
    const { set, registry } = await setup();
    await set(true);
    await registry.stopAll();
    expect(snapshot()).toBe(before);
  });

  it('can be switched on and off repeatedly', async () => {
    const before = snapshot();
    const { set } = await setup();
    for (let i = 0; i < 3; i++) {
      await set(true);
      await set(false);
    }
    expect(snapshot()).toBe(before);
  });
});

describe('fallback when the page has no readable text (AC-E4.4)', () => {
  it('shows a plain-language notice and hides page-level clutter, then cleans up', async () => {
    document.body.innerHTML = '<header>Site</header><nav>Menu</nav><p>Hi</p>';
    const before = snapshot();
    const { set, hooks } = await setup();
    await set(true);
    expect(viewEl()).toBeNull();
    expect(hooks.notify).toHaveBeenCalledWith(expect.stringContaining("couldn't find the main text"), 'warning');
    expect(document.querySelector('style')?.textContent).toMatch(/nav/);
    await set(false);
    expect(snapshot()).toBe(before);
  });

  it('is not retried on every settings change', async () => {
    document.body.innerHTML = '<p>Hi</p>';
    const { set, registry, mod, hooks } = await setup();
    await set(true);
    await registry.applyOne(mod.id);
    expect(hooks.notify).toHaveBeenCalledTimes(1);
  });
});

describe('error path: the registry does NOT call teardown after an apply error', () => {
  it('undoes its own changes if adding the rules throws', async () => {
    const before = snapshot();
    const { set, hooks } = await setup();
    vi.spyOn(StyleService.prototype, 'addRules').mockImplementation(() => {
      throw new Error('boom');
    });
    await set(true);
    expect(viewEl()).toBeNull();
    expect(snapshot()).toBe(before);
    expect(hooks.notify).toHaveBeenCalledWith(expect.stringContaining("couldn't run"), 'error');
  });
});

describe('reading position (AC-E4.5), with layout faked because jsdom has none', () => {
  /** Give every element a fake rectangle: `top` = its index * 100 - scroll. */
  function fakeLayout(scroll: { y: number }) {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      const all = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li')].filter((e) => e.closest('[data-iic-reading-view]') === this.closest('[data-iic-reading-view]'));
      const i = all.indexOf(this);
      const top = i * 100 - scroll.y;
      return { top, bottom: top + 90, left: 0, right: 0, width: 100, height: 90, x: 0, y: top, toJSON() {} } as DOMRect;
    });
  }

  it('enters reading at the same paragraph the reader was on', async () => {
    const scroll = { y: 0 };
    fakeLayout(scroll);
    // Scroll so the 3rd measured block is the first one on screen.
    scroll.y = 250;
    const { set } = await setup();
    await set(true);
    const target = (Element.prototype.scrollIntoView as ReturnType<typeof vi.fn>).mock.contexts.at(-1) as Element | undefined;
    expect(target?.closest('[data-iic-reading-view]')).not.toBeNull();
    expect(target?.getAttribute('data-iic-anchor')).not.toBeNull();
  });

  it('leaves reading at the matching ORIGINAL block', async () => {
    const scroll = { y: 0 };
    fakeLayout(scroll);
    const { set } = await setup();
    await set(true);
    (Element.prototype.scrollIntoView as ReturnType<typeof vi.fn>).mockClear();
    scroll.y = 150;
    await set(false);
    const calls = (Element.prototype.scrollIntoView as ReturnType<typeof vi.fn>).mock.contexts;
    const target = calls.at(-1) as Element | undefined;
    expect(target?.isConnected).toBe(true);
    expect(target?.closest('[data-iic-reading-view]')).toBeNull();
  });
});
