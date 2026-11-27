import type { ModuleSettings, SettingDescriptor, SettingValue } from './contract';

/**
 * Versioned, validated preferences (#17) with global and per-module reset (#18).
 *
 * Storage layout follows the documented proposal: one `iic.prefs` object in
 * chrome.storage.local. The write path is still open (ADR 0001, D5). Writes are
 * serialised within one tab; two tabs saving at the same moment can still lose
 * one change until D5 is decided.
 */

export const PREFS_KEY = 'iic.prefs';
export const SCHEMA_VERSION = 1;

export interface PrefsDocument {
  schemaVersion: typeof SCHEMA_VERSION;
  enabledGlobally: boolean;
  disabledSites: string[];
  activePreset: string | null;
  modules: Record<string, ModuleSettings>;
}

/** The subset of chrome.storage.local the store needs, so tests can use a fake. */
export interface StorageAreaLike {
  get(key: string): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  onChanged(listener: (newValue: unknown) => void): () => void;
}

export type DescriptorMap = Record<string, SettingDescriptor[]>;

const MAX_STRING = 200;
const MAX_SITES = 500;
const HOSTNAME = /^[a-z0-9.-]{1,253}$/;

export function defaultsFor(descriptors: SettingDescriptor[]): ModuleSettings {
  const out: ModuleSettings = {};
  for (const d of descriptors) out[d.key] = d.default;
  return out;
}

/** Returns a valid value for the descriptor, or `undefined` if `value` is not acceptable. */
export function coerceValue(d: SettingDescriptor, value: unknown): SettingValue | undefined {
  switch (d.type) {
    case 'boolean':
      return typeof value === 'boolean' ? value : undefined;
    case 'number': {
      if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
      if (value < d.min || value > d.max) return undefined;
      return value;
    }
    case 'enum':
      return typeof value === 'string' && d.options.some((o) => o.value === value) ? value : undefined;
    case 'string': {
      const limit = Math.min(d.maxLength ?? MAX_STRING, MAX_STRING);
      return typeof value === 'string' && value.length <= limit ? value : undefined;
    }
  }
}

/** Keeps known keys with valid values; everything else falls back to the default. */
export function validateModule(descriptors: SettingDescriptor[], raw: unknown): ModuleSettings {
  const source = isRecord(raw) ? raw : {};
  const out: ModuleSettings = {};
  for (const d of descriptors) {
    const v = coerceValue(d, source[d.key]);
    out[d.key] = v === undefined ? d.default : v;
  }
  return out;
}

export function defaultDocument(descriptors: DescriptorMap): PrefsDocument {
  const modules: Record<string, ModuleSettings> = {};
  for (const [id, ds] of Object.entries(descriptors)) modules[id] = defaultsFor(ds);
  return { schemaVersion: SCHEMA_VERSION, enabledGlobally: true, disabledSites: [], activePreset: null, modules };
}

/**
 * Turns whatever is stored into a valid current-version document.
 * Unknown modules and keys are dropped; invalid values become defaults.
 * There is only one schema version so far; future versions add steps here.
 */
export function migrate(raw: unknown, descriptors: DescriptorMap): PrefsDocument {
  const doc = defaultDocument(descriptors);
  if (!isRecord(raw) || raw.schemaVersion !== SCHEMA_VERSION) return doc;

  if (typeof raw.enabledGlobally === 'boolean') doc.enabledGlobally = raw.enabledGlobally;
  if (Array.isArray(raw.disabledSites)) {
    doc.disabledSites = raw.disabledSites
      .filter((s): s is string => typeof s === 'string' && HOSTNAME.test(s))
      .slice(0, MAX_SITES);
  }
  if (typeof raw.activePreset === 'string' && raw.activePreset.length <= 64) doc.activePreset = raw.activePreset;
  const storedModules = isRecord(raw.modules) ? raw.modules : {};
  for (const [id, ds] of Object.entries(descriptors)) doc.modules[id] = validateModule(ds, storedModules[id]);
  return doc;
}

export type PrefsListener = (doc: PrefsDocument) => void;

export class PrefsStore {
  private doc: PrefsDocument;
  private queue: Promise<void> = Promise.resolve();
  private listeners = new Set<PrefsListener>();
  private unsubscribeStorage: (() => void) | null = null;

  constructor(
    private readonly area: StorageAreaLike,
    private readonly descriptors: DescriptorMap,
  ) {
    this.doc = defaultDocument(descriptors);
  }

  async load(): Promise<PrefsDocument> {
    const stored = await this.area.get(PREFS_KEY);
    this.doc = migrate(stored[PREFS_KEY], this.descriptors);
    this.unsubscribeStorage ??= this.area.onChanged((value) => {
      this.doc = migrate(value, this.descriptors);
      this.emit();
    });
    return this.snapshot();
  }

  snapshot(): PrefsDocument {
    return structuredClone(this.doc);
  }

  getModule(moduleId: string): ModuleSettings {
    return { ...(this.doc.modules[moduleId] ?? {}) };
  }

  /** Validates against the module's descriptor; throws on unknown keys or invalid values. */
  setValue(moduleId: string, key: string, value: SettingValue): Promise<void> {
    const descriptor = this.descriptors[moduleId]?.find((d) => d.key === key);
    if (!descriptor) return Promise.reject(new Error(`Unknown setting ${moduleId}.${key}`));
    const valid = coerceValue(descriptor, value);
    if (valid === undefined) return Promise.reject(new Error(`Invalid value for ${moduleId}.${key}`));
    return this.write((doc) => {
      doc.modules[moduleId] = { ...doc.modules[moduleId], [key]: valid };
    });
  }

  resetModule(moduleId: string): Promise<void> {
    const ds = this.descriptors[moduleId];
    if (!ds) return Promise.reject(new Error(`Unknown module ${moduleId}`));
    return this.write((doc) => {
      doc.modules[moduleId] = defaultsFor(ds);
    });
  }

  resetAll(): Promise<void> {
    return this.write((doc) => {
      Object.assign(doc, defaultDocument(this.descriptors));
    });
  }

  subscribe(listener: PrefsListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  dispose(): void {
    this.unsubscribeStorage?.();
    this.unsubscribeStorage = null;
    this.listeners.clear();
  }

  private write(mutate: (doc: PrefsDocument) => void): Promise<void> {
    const run = async () => {
      const next = this.snapshot();
      mutate(next);
      this.doc = next;
      await this.area.set({ [PREFS_KEY]: next });
      this.emit();
    };
    const result = this.queue.then(run, run);
    this.queue = result.catch(() => undefined);
    return result;
  }

  private emit(): void {
    const snap = this.snapshot();
    for (const l of this.listeners) l(snap);
  }
}

/** Adapter for the real chrome.storage.local. */
export function chromeStorageArea(): StorageAreaLike {
  return {
    get: (key) => chrome.storage.local.get(key),
    set: (items) => chrome.storage.local.set(items),
    onChanged(listener) {
      const handler = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
        if (area === 'local' && changes[PREFS_KEY]) listener(changes[PREFS_KEY].newValue);
      };
      chrome.storage.onChanged.addListener(handler);
      return () => chrome.storage.onChanged.removeListener(handler);
    },
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
