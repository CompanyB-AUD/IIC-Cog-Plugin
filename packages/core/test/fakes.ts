import type { StorageAreaLike } from '../src/prefs';

/** In-memory stand-in for chrome.storage.local that mimics JSON copying and onChanged. */
export class FakeStorage implements StorageAreaLike {
  data: Record<string, unknown> = {};
  private listeners = new Set<(v: unknown) => void>();
  sets = 0;

  async get(key: string): Promise<Record<string, unknown>> {
    return key in this.data ? { [key]: structuredClone(this.data[key]) } : {};
  }

  async set(items: Record<string, unknown>): Promise<void> {
    this.sets++;
    for (const [k, v] of Object.entries(items)) {
      this.data[k] = structuredClone(v);
      for (const l of this.listeners) l(structuredClone(v));
    }
  }

  onChanged(listener: (v: unknown) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Simulates another tab writing directly to storage. */
  externalWrite(key: string, value: unknown): void {
    this.data[key] = structuredClone(value);
    for (const l of this.listeners) l(structuredClone(value));
  }
}
