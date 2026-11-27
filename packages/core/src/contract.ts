/**
 * IIC shared module contract, apiVersion 1.
 *
 * STATUS: PROPOSED. Follows the Sprint 1 architecture proposal (section 4) and
 * docs/adr/0001-development-baseline.md. Company A has not agreed it yet (#10).
 * Differences from the proposal are marked "PROPOSED CHANGE" and must be agreed
 * before the contract is frozen.
 */

export const API_VERSION = 1 as const;

export type SettingValue = boolean | number | string;
export type ModuleSettings = Record<string, SettingValue>;

export type ModuleOwner = 'A' | 'B' | 'core';
export type ModuleGroup = 'reading' | 'focus' | 'see' | 'hear' | 'tools';

export type SettingDescriptor =
  | { key: string; type: 'boolean'; default: boolean }
  | { key: string; type: 'number'; default: number; min: number; max: number; step?: number }
  | { key: string; type: 'enum'; default: string; options: { value: string; label: string }[] }
  | { key: string; type: 'string'; default: string; maxLength?: number };

/**
 * Controls are plain data so the toolbar, popup and options page can all render them.
 * PROPOSED CHANGE (ADR 0001, D4): actions carry no function; the core calls
 * `module.onAction(id)` instead. `panel` controls are left out until agreed.
 */
export type ControlDescriptor =
  | { kind: 'toggle'; setting: string; label: string; description?: string }
  | { kind: 'slider'; setting: string; label: string; unit?: string }
  | { kind: 'select'; setting: string; label: string }
  | { kind: 'action'; id: string; label: string };

export type StyleToken =
  | '--iic-font-scale'
  | '--iic-font-family'
  | '--iic-line-height'
  | '--iic-letter-spacing'
  | '--iic-word-spacing'
  | '--iic-paragraph-spacing'
  | '--iic-max-line-length'
  | '--iic-fg'
  | '--iic-bg'
  | '--iic-link'
  | '--iic-contrast-mode'
  | '--iic-focus-ring'
  | '--iic-motion';

export interface BusEvents {
  'prefs:changed': { moduleId: string; settings: ModuleSettings };
  'page:ready': { url: string };
  'module:error': { moduleId: string; phase: LifecyclePhase; message: string };
}

export type LifecyclePhase = 'init' | 'apply' | 'teardown' | 'action';

export interface ModuleContext {
  prefs: {
    get(): ModuleSettings;
    /** Writes one of this module's own keys. Rejects unknown keys and invalid values. */
    set(key: string, value: SettingValue): Promise<void>;
  };
  bus: {
    on<E extends keyof BusEvents>(event: E, fn: (payload: BusEvents[E]) => void): () => void;
    emit<E extends keyof BusEvents>(event: E, payload: BusEvents[E]): void;
  };
  /** Page styling goes through the core; modules never inject <style> directly. */
  style: {
    /** Only the token's owner may set it (ADR 0001, D6). `null` removes it. */
    setToken(name: StyleToken, value: string | null): void;
    /** Rules are wrapped in `@layer iic` and removed automatically on teardown. */
    addRules(id: string, css: string): void;
    /** PROPOSED CHANGE: lets a module switch a rule set off without a full teardown. */
    removeRules(id: string): void;
  };
  /** Keeps the reader's place across layout changes (FR12, #19). */
  position: { preserve<T>(change: () => T | Promise<T>): Promise<T> };
  announce(message: string, priority?: 'polite' | 'assertive'): void;
  detect: {
    mainContent(): Element | null;
    headings(): HTMLHeadingElement[];
    media(): HTMLMediaElement[];
    images(): HTMLImageElement[];
  };
  notify(message: string, kind?: 'info' | 'warning' | 'error'): void;
  log: Pick<Console, 'debug' | 'warn' | 'error'>;
}

export interface IicModule {
  /** Stable namespaced id such as "a.tts" or "b.reading-mode". */
  id: string;
  owner: ModuleOwner;
  apiVersion: typeof API_VERSION;
  /** Says what the feature does, never who it is for. */
  title: string;
  group: ModuleGroup;
  settings: SettingDescriptor[];
  controls: ControlDescriptor[];
  init(ctx: ModuleContext): void | Promise<void>;
  /** Must be idempotent: the same settings applied twice leave the page unchanged. */
  apply(settings: ModuleSettings): void | Promise<void>;
  /** Undo every change this module made to the page. */
  teardown(): void | Promise<void>;
  onAction?(id: string): void | Promise<void>;
}

export function defineModule<M extends IicModule>(module: M): M {
  return module;
}
