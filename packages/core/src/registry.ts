import {
  API_VERSION,
  type BusEvents,
  type IicModule,
  type LifecyclePhase,
  type ModuleContext,
  type ModuleSettings,
  type StyleToken,
} from './contract';
import type { DescriptorMap, PrefsStore } from './prefs';
import type { StyleService } from './styles';

const MODULE_ID = /^(a|b|core|stub)\.[a-z0-9-]{1,48}$/;

export type ModuleStatus = 'registered' | 'active' | 'failed' | 'stopped';

export interface RegistryHooks {
  /** Shown in the toolbar; must not reveal stack traces to users. */
  notify(message: string, kind: 'info' | 'warning' | 'error'): void;
  announce(message: string, priority: 'polite' | 'assertive'): void;
}

type Listener = (payload: never) => void;

export const FAILURE_MESSAGE = "This feature couldn't run on this page.";

/**
 * Module registry with lifecycle and failure isolation (#22).
 * Every lifecycle call is wrapped: an error marks only that module as failed,
 * shows a notice and leaves the other modules running (AC-E3.2).
 */
export class ModuleRegistry {
  private modules = new Map<string, IicModule>();
  private status = new Map<string, ModuleStatus>();
  private tokensSet = new Map<string, Set<StyleToken>>();
  private busListeners = new Map<keyof BusEvents, Set<Listener>>();

  constructor(
    private readonly prefs: PrefsStore,
    private readonly styles: StyleService,
    private readonly hooks: RegistryHooks,
    private readonly win: Window = window,
  ) {}

  /** Throws on a contract violation: these are developer errors, not page errors. */
  register(module: IicModule): void {
    if (!MODULE_ID.test(module.id)) throw new Error(`Invalid module id "${module.id}"`);
    if (module.apiVersion !== API_VERSION) throw new Error(`Module ${module.id} needs apiVersion ${API_VERSION}`);
    if (this.modules.has(module.id)) throw new Error(`Module ${module.id} is already registered`);
    const keys = new Set(module.settings.map((s) => s.key));
    for (const c of module.controls) {
      if ('setting' in c && !keys.has(c.setting)) throw new Error(`Control in ${module.id} refers to unknown setting ${c.setting}`);
    }
    this.modules.set(module.id, module);
    this.status.set(module.id, 'registered');
  }

  list(): IicModule[] {
    return [...this.modules.values()];
  }

  statusOf(id: string): ModuleStatus | undefined {
    return this.status.get(id);
  }

  descriptors(): DescriptorMap {
    const out: DescriptorMap = {};
    for (const m of this.modules.values()) out[m.id] = m.settings;
    return out;
  }

  async start(): Promise<void> {
    for (const m of this.modules.values()) {
      const ok = await this.run(m, 'init', () => m.init(this.contextFor(m)));
      if (ok) this.status.set(m.id, 'active');
    }
    await this.applyAll();
  }

  async applyAll(): Promise<void> {
    for (const m of this.modules.values()) await this.applyOne(m.id);
  }

  async applyOne(id: string): Promise<void> {
    const m = this.modules.get(id);
    if (!m || this.status.get(id) !== 'active') return;
    const settings = this.prefs.getModule(id);
    await this.run(m, 'apply', () => m.apply(settings));
    this.emit('prefs:changed', { moduleId: id, settings });
  }

  async runAction(id: string, actionId: string): Promise<void> {
    const m = this.modules.get(id);
    if (!m?.onAction || this.status.get(id) !== 'active') return;
    await this.run(m, 'action', () => m.onAction?.(actionId));
  }

  /** Calls every module's teardown, then removes anything the core added for them. */
  async stopAll(): Promise<void> {
    for (const m of [...this.modules.values()].reverse()) {
      if (this.status.get(m.id) === 'active' || this.status.get(m.id) === 'failed') {
        await this.run(m, 'teardown', () => m.teardown());
      }
      this.cleanupFor(m);
      this.status.set(m.id, 'stopped');
    }
    this.busListeners.clear();
  }

  private async run(m: IicModule, phase: LifecyclePhase, fn: () => unknown): Promise<boolean> {
    try {
      await fn();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[iic] ${m.id} failed during ${phase}:`, message);
      if (phase !== 'teardown') {
        this.status.set(m.id, 'failed');
        this.cleanupFor(m);
      }
      this.emit('module:error', { moduleId: m.id, phase, message });
      this.hooks.notify(`${m.title}: ${FAILURE_MESSAGE}`, 'error');
      return false;
    }
  }

  private cleanupFor(m: IicModule): void {
    this.styles.removeAllFor(m.id);
    const tokens = this.tokensSet.get(m.id);
    if (tokens) this.styles.clearTokensOwnedBy(m.owner, tokens);
    this.tokensSet.delete(m.id);
  }

  private emit<E extends keyof BusEvents>(event: E, payload: BusEvents[E]): void {
    for (const fn of this.busListeners.get(event) ?? []) {
      try {
        (fn as (p: BusEvents[E]) => void)(payload);
      } catch (err) {
        console.warn('[iic] bus listener failed', err);
      }
    }
  }

  private contextFor(m: IicModule): ModuleContext {
    const doc = this.win.document;
    return {
      prefs: {
        get: (): ModuleSettings => this.prefs.getModule(m.id),
        set: (key, value) => this.prefs.setValue(m.id, key, value),
      },
      bus: {
        on: (event, fn) => {
          const set = this.busListeners.get(event) ?? new Set<Listener>();
          set.add(fn as Listener);
          this.busListeners.set(event, set);
          return () => set.delete(fn as Listener);
        },
        emit: (event, payload) => this.emit(event, payload),
      },
      style: {
        setToken: (name, value) => {
          if (!this.styles.setToken(m.owner, name, value)) {
            console.warn(`[iic] ${m.id} may not set ${name}; it is owned by another module.`);
            return;
          }
          const set = this.tokensSet.get(m.id) ?? new Set<StyleToken>();
          if (value === null) set.delete(name);
          else set.add(name);
          this.tokensSet.set(m.id, set);
        },
        addRules: (id, css) => this.styles.addRules(m.id, id, css),
        removeRules: (id) => this.styles.removeRules(m.id, id),
      },
      // Placeholder until #19: runs the change without preserving the reading position.
      position: { preserve: async (change) => change() },
      announce: (message, priority = 'polite') => this.hooks.announce(message, priority),
      detect: {
        mainContent: () => doc.querySelector('main, [role="main"], article'),
        headings: () => [...doc.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6')],
        media: () => [...doc.querySelectorAll<HTMLMediaElement>('video, audio')],
        images: () => [...doc.querySelectorAll<HTMLImageElement>('img')],
      },
      notify: (message, kind = 'info') => this.hooks.notify(message, kind),
      log: {
        debug: (...a: unknown[]) => console.debug(`[iic:${m.id}]`, ...a),
        warn: (...a: unknown[]) => console.warn(`[iic:${m.id}]`, ...a),
        error: (...a: unknown[]) => console.error(`[iic:${m.id}]`, ...a),
      },
    };
  }
}
