import { describe, expect, it } from 'vitest';
import type { SettingDescriptor } from '../src/contract';
import { PREFS_KEY, PrefsStore, migrate } from '../src/prefs';
import { FakeStorage } from './fakes';

const spacing: SettingDescriptor[] = [
  { key: 'enabled', type: 'boolean', default: false },
  { key: 'lineHeight', type: 'number', default: 1.8, min: 1.5, max: 2.5, step: 0.1 },
  { key: 'font', type: 'enum', default: 'system', options: [{ value: 'system', label: 'System' }, { value: 'serif', label: 'Serif' }] },
];
const descriptors = { 'b.spacing': spacing, 'a.contrast': [{ key: 'mode', type: 'string', default: 'normal', maxLength: 20 }] as SettingDescriptor[] };

describe('migrate', () => {
  it('returns defaults for missing, malformed or unknown-version data', () => {
    for (const raw of [undefined, null, 'x', [], { schemaVersion: 99, modules: { 'b.spacing': { enabled: true } } }]) {
      const doc = migrate(raw, descriptors);
      expect(doc.modules['b.spacing']).toEqual({ enabled: false, lineHeight: 1.8, font: 'system' });
      expect(doc.enabledGlobally).toBe(true);
    }
  });

  it('keeps valid values, replaces invalid ones with defaults and drops unknown keys and modules', () => {
    const doc = migrate(
      {
        schemaVersion: 1,
        enabledGlobally: false,
        disabledSites: ['lms.example.edu', 42, 'Bad Host!', 'ok.example'],
        modules: {
          'b.spacing': { enabled: true, lineHeight: 9, font: 'comic', extra: 'x' },
          'zz.unknown': { anything: true },
          'a.contrast': { mode: 'x'.repeat(21) },
        },
      },
      descriptors,
    );
    expect(doc.enabledGlobally).toBe(false);
    expect(doc.disabledSites).toEqual(['lms.example.edu', 'ok.example']);
    expect(doc.modules['b.spacing']).toEqual({ enabled: true, lineHeight: 1.8, font: 'system' });
    expect(doc.modules['a.contrast']).toEqual({ mode: 'normal' });
    expect(Object.keys(doc.modules)).not.toContain('zz.unknown');
  });

  it('rejects NaN and Infinity for numbers', () => {
    for (const lineHeight of [Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(migrate({ schemaVersion: 1, modules: { 'b.spacing': { lineHeight } } }, descriptors).modules['b.spacing']?.lineHeight).toBe(1.8);
    }
  });
});

describe('PrefsStore', () => {
  it('persists a valid change and reads it back after a fresh load (restart)', async () => {
    const storage = new FakeStorage();
    const first = new PrefsStore(storage, descriptors);
    await first.load();
    await first.setValue('b.spacing', 'lineHeight', 2.2);
    const second = new PrefsStore(storage, descriptors);
    await second.load();
    expect(second.getModule('b.spacing').lineHeight).toBe(2.2);
  });

  it('rejects unknown keys, unknown modules and out-of-range or wrongly typed values without writing', async () => {
    const storage = new FakeStorage();
    const store = new PrefsStore(storage, descriptors);
    await store.load();
    await expect(store.setValue('b.spacing', 'nope', 1)).rejects.toThrow(/Unknown setting/);
    await expect(store.setValue('x.none', 'enabled', true)).rejects.toThrow(/Unknown setting/);
    await expect(store.setValue('b.spacing', 'lineHeight', 3)).rejects.toThrow(/Invalid value/);
    await expect(store.setValue('b.spacing', 'enabled', 'yes')).rejects.toThrow(/Invalid value/);
    expect(storage.sets).toBe(0);
  });

  it('keeps every change when saves are made quickly one after another', async () => {
    const storage = new FakeStorage();
    const store = new PrefsStore(storage, descriptors);
    await store.load();
    await Promise.all([
      store.setValue('b.spacing', 'enabled', true),
      store.setValue('b.spacing', 'lineHeight', 2),
      store.setValue('a.contrast', 'mode', 'dark'),
    ]);
    const saved = migrate(storage.data[PREFS_KEY], descriptors);
    expect(saved.modules['b.spacing']).toMatchObject({ enabled: true, lineHeight: 2 });
    expect(saved.modules['a.contrast']).toEqual({ mode: 'dark' });
  });

  it('resets one module without touching the others', async () => {
    const store = new PrefsStore(new FakeStorage(), descriptors);
    await store.load();
    await store.setValue('b.spacing', 'enabled', true);
    await store.setValue('a.contrast', 'mode', 'dark');
    await store.resetModule('b.spacing');
    expect(store.getModule('b.spacing').enabled).toBe(false);
    expect(store.getModule('a.contrast').mode).toBe('dark');
  });

  it('reset all restores the complete default document', async () => {
    const storage = new FakeStorage();
    const store = new PrefsStore(storage, descriptors);
    await store.load();
    await store.setValue('b.spacing', 'enabled', true);
    await store.resetAll();
    expect(storage.data[PREFS_KEY]).toEqual(migrate(undefined, descriptors));
  });

  it('notifies subscribers about changes written by another tab, after validating them', async () => {
    const storage = new FakeStorage();
    const store = new PrefsStore(storage, descriptors);
    await store.load();
    const seen: unknown[] = [];
    store.subscribe((doc) => seen.push(doc.modules['b.spacing']));
    storage.externalWrite(PREFS_KEY, { schemaVersion: 1, modules: { 'b.spacing': { enabled: true, lineHeight: 42 } } });
    expect(seen).toEqual([{ enabled: true, lineHeight: 1.8, font: 'system' }]);
  });

  it('stores only settings: no URL, page title or other personal data', async () => {
    const storage = new FakeStorage();
    const store = new PrefsStore(storage, descriptors);
    await store.load();
    await store.setValue('b.spacing', 'enabled', true);
    expect(Object.keys(storage.data)).toEqual([PREFS_KEY]);
    expect(Object.keys(storage.data[PREFS_KEY] as object).sort()).toEqual(['activePreset', 'disabledSites', 'enabledGlobally', 'modules', 'schemaVersion']);
  });
});
