/**
 * PLACEHOLDER TOOLBAR for the walking skeleton.
 * UI/UX owns the real toolbar (#12 design, #14 implementation). This version exists
 * only so the core flow (open → change → save → reset) can be demonstrated, and
 * renders controls purely from module descriptors so it can be swapped out.
 */
import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { ControlDescriptor, IicModule, ModuleGroup, ModuleSettings, SettingValue } from '../contract';
import { TOOLBAR_CSS } from './placeholder-toolbar.css';

export interface ToolbarActions {
  setValue(moduleId: string, key: string, value: SettingValue): Promise<void>;
  resetModule(moduleId: string): Promise<void>;
  resetAll(): Promise<void>;
}

export interface Notice {
  id: number;
  message: string;
  kind: 'info' | 'warning' | 'error';
}

interface ViewState {
  open: boolean;
  modules: IicModule[];
  settings: Record<string, ModuleSettings>;
  notices: Notice[];
  liveMessage: string;
}

const GROUP_LABELS: Record<ModuleGroup, string> = {
  reading: 'Reading',
  focus: 'Focus',
  see: 'See',
  hear: 'Hear',
  tools: 'Tools',
};

export const HOST_ID = 'iic-toolbar-host';

/** Owns the Shadow DOM host, open/close state and focus return. */
export class PlaceholderToolbar {
  private host: HTMLElement;
  private shadow: ShadowRoot;
  private state: ViewState;
  private returnFocusTo: HTMLElement | null = null;
  private observer: MutationObserver;
  private noticeId = 0;

  constructor(
    private readonly doc: Document,
    private readonly actions: ToolbarActions,
    modules: IicModule[],
  ) {
    this.state = { open: false, modules, settings: {}, notices: [], liveMessage: '' };
    this.host = doc.createElement('div');
    this.host.id = HOST_ID;
    this.shadow = this.host.attachShadow({ mode: 'open' });
    const style = doc.createElement('style');
    style.textContent = TOOLBAR_CSS;
    const mount = doc.createElement('div');
    this.shadow.append(style, mount);
    doc.body.append(this.host);
    // Some pages rebuild <body>; put the toolbar back if it is removed.
    this.observer = new MutationObserver(() => {
      if (!this.host.isConnected) doc.body.append(this.host);
    });
    this.observer.observe(doc.body, { childList: true });
    this.render();
  }

  get isOpen(): boolean {
    return this.state.open;
  }

  setSettings(settings: Record<string, ModuleSettings>): void {
    this.state = { ...this.state, settings };
    this.render();
  }

  toggle(): void {
    if (this.state.open) this.close();
    else this.open();
  }

  open(): void {
    if (this.state.open) return;
    const active = this.doc.activeElement;
    this.returnFocusTo = active instanceof HTMLElement && active !== this.doc.body ? active : null;
    this.state = { ...this.state, open: true };
    this.render();
    this.focusInShadow('[data-autofocus]');
  }

  close(): void {
    if (!this.state.open) return;
    this.state = { ...this.state, open: false };
    this.render();
    const target = this.returnFocusTo;
    this.returnFocusTo = null;
    if (target?.isConnected && target !== this.host) target.focus();
    else this.focusInShadow('.iic-launcher');
  }

  notify(message: string, kind: Notice['kind']): void {
    const notice = { id: ++this.noticeId, message, kind };
    this.state = { ...this.state, notices: [...this.state.notices, notice].slice(-3) };
    this.render();
  }

  announce(message: string): void {
    // Clear first so repeating the same message is announced again.
    this.state = { ...this.state, liveMessage: '' };
    this.render();
    setTimeout(() => {
      this.state = { ...this.state, liveMessage: message };
      this.render();
    }, 50);
  }

  destroy(): void {
    this.observer.disconnect();
    render(null, this.shadow.lastElementChild as Element);
    this.host.remove();
  }

  private focusInShadow(selector: string): void {
    const el = this.shadow.querySelector<HTMLElement>(selector);
    el?.focus();
  }

  private render(): void {
    render(
      <ToolbarView
        state={this.state}
        actions={this.actions}
        onToggle={() => this.toggle()}
        onClose={() => this.close()}
        onDismiss={(id) => {
          this.state = { ...this.state, notices: this.state.notices.filter((n) => n.id !== id) };
          this.render();
        }}
        announce={(m) => this.announce(m)}
      />,
      this.shadow.lastElementChild as Element,
    );
  }
}

interface ViewProps {
  state: ViewState;
  actions: ToolbarActions;
  onToggle(): void;
  onClose(): void;
  onDismiss(id: number): void;
  announce(message: string): void;
}

function ToolbarView({ state, actions, onToggle, onClose, onDismiss, announce }: ViewProps) {
  const groups = groupModules(state.modules);
  return (
    <div class="iic-root">
      {state.open && (
        <section
          id="iic-panel"
          class="iic-panel"
          aria-labelledby="iic-title"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              onClose();
            }
          }}
        >
          <header class="iic-header">
            <h2 id="iic-title">Reading tools</h2>
            <button type="button" class="iic-close" data-autofocus onClick={onClose}>
              Close
            </button>
          </header>
          <p class="iic-badge">Development build · placeholder toolbar</p>

          {state.notices.length > 0 && (
            <ul class="iic-notices">
              {state.notices.map((n) => (
                <li key={n.id} class={`iic-notice iic-${n.kind}`}>
                  <span>{n.message}</span>
                  <button type="button" onClick={() => onDismiss(n.id)} aria-label={`Dismiss: ${n.message}`}>
                    Dismiss
                  </button>
                </li>
              ))}
            </ul>
          )}

          {groups.map(([group, modules]) => (
            <div class="iic-group" key={group}>
              <h3>{GROUP_LABELS[group]}</h3>
              {modules.map((m) => (
                <fieldset key={m.id} class="iic-module">
                  <legend>{m.title}</legend>
                  {m.controls.map((c) => (
                    <Control
                      key={controlKey(c)}
                      module={m}
                      control={c}
                      settings={state.settings[m.id] ?? {}}
                      actions={actions}
                      announce={announce}
                    />
                  ))}
                  <button
                    type="button"
                    class="iic-secondary"
                    onClick={async () => {
                      await actions.resetModule(m.id);
                      announce(`${m.title} reset to default`);
                    }}
                  >
                    Reset this feature
                  </button>
                </fieldset>
              ))}
            </div>
          ))}

          <ResetAll actions={actions} announce={announce} />
        </section>
      )}
      <button
        type="button"
        class="iic-launcher"
        aria-expanded={state.open}
        aria-controls="iic-panel"
        onClick={onToggle}
      >
        Reading tools
      </button>
      <div class="iic-sr-only" role="status" aria-live="polite">
        {state.liveMessage}
      </div>
    </div>
  );
}

function Control(props: {
  module: IicModule;
  control: ControlDescriptor;
  settings: ModuleSettings;
  actions: ToolbarActions;
  announce(message: string): void;
}) {
  const { module, control, settings, actions, announce } = props;
  if (control.kind === 'toggle') {
    const pressed = settings[control.setting] === true;
    return (
      <div class="iic-control">
        <button
          type="button"
          class="iic-toggle"
          aria-pressed={pressed}
          aria-describedby={control.description ? `${module.id}-${control.setting}-desc` : undefined}
          onClick={async () => {
            await actions.setValue(module.id, control.setting, !pressed);
            announce(`${control.label} ${pressed ? 'off' : 'on'}`);
          }}
        >
          {control.label}
          <span aria-hidden="true" class="iic-state">
            {pressed ? 'On' : 'Off'}
          </span>
        </button>
        {control.description && (
          <p id={`${module.id}-${control.setting}-desc`} class="iic-hint">
            {control.description}
          </p>
        )}
      </div>
    );
  }
  if (control.kind === 'slider') {
    const d = module.settings.find((s) => s.key === control.setting);
    if (!d || d.type !== 'number') return null;
    return <Slider module={module} control={control} descriptor={d} value={settings[control.setting]} {...{ actions, announce }} />;
  }
  return null;
}

function Slider(props: {
  module: IicModule;
  control: Extract<ControlDescriptor, { kind: 'slider' }>;
  descriptor: { key: string; min: number; max: number; step?: number; default: number };
  value: SettingValue | undefined;
  actions: ToolbarActions;
  announce(message: string): void;
}) {
  const { module, control, descriptor, actions } = props;
  const saved = typeof props.value === 'number' ? props.value : descriptor.default;
  const [local, setLocal] = useState(saved);
  useEffect(() => setLocal(saved), [saved]);
  const id = `${module.id}-${control.setting}`;
  return (
    <div class="iic-control">
      <label for={id}>{control.label}</label>
      <div class="iic-slider">
        <input
          id={id}
          type="range"
          min={descriptor.min}
          max={descriptor.max}
          step={descriptor.step ?? 1}
          value={local}
          aria-valuetext={`${local}${control.unit ?? ''}`}
          onInput={(e) => setLocal(Number((e.currentTarget as HTMLInputElement).value))}
          onChange={(e) => void actions.setValue(module.id, control.setting, Number((e.currentTarget as HTMLInputElement).value))}
        />
        <output for={id}>
          {local}
          {control.unit ?? ''}
        </output>
      </div>
    </div>
  );
}

function ResetAll({ actions, announce }: { actions: ToolbarActions; announce(m: string): void }) {
  const [confirming, setConfirming] = useState(false);
  const resetRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);
  if (!confirming) {
    return (
      <div class="iic-reset">
        <button type="button" ref={resetRef} class="iic-secondary" onClick={() => setConfirming(true)}>
          Reset all settings
        </button>
      </div>
    );
  }
  const finish = () => {
    setConfirming(false);
    setTimeout(() => resetRef.current?.focus(), 0);
  };
  return (
    <div class="iic-reset" role="group" aria-labelledby="iic-reset-q">
      <p id="iic-reset-q">Reset every setting to its default?</p>
      <button
        type="button"
        ref={confirmRef}
        class="iic-danger"
        onClick={async () => {
          await actions.resetAll();
          announce('All settings reset to defaults');
          finish();
        }}
      >
        Yes, reset everything
      </button>
      <button type="button" class="iic-secondary" onClick={finish}>
        Cancel
      </button>
    </div>
  );
}

function groupModules(modules: IicModule[]): [ModuleGroup, IicModule[]][] {
  const order: ModuleGroup[] = ['reading', 'focus', 'see', 'hear', 'tools'];
  return order
    .map((g) => [g, modules.filter((m) => m.group === g)] as [ModuleGroup, IicModule[]])
    .filter(([, ms]) => ms.length > 0);
}

function controlKey(c: ControlDescriptor): string {
  return c.kind === 'action' ? `action:${c.id}` : `${c.kind}:${c.setting}`;
}
