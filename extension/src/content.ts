import {
  ModuleRegistry,
  PrefsStore,
  StyleService,
  chromeStorageArea,
  type IicModule,
  type ModuleSettings,
} from '@iic/core';
import { lineSpacingStub } from '@iic/core/stubs/line-spacing-stub';
import { PlaceholderToolbar } from '@iic/core/ui/placeholder-toolbar';
import { isExtensionMessage } from './messages';

/**
 * Content-script entry. Wiring order:
 *   preferences → registry (init + apply) → toolbar → listeners.
 * Modules are listed here until the agreed packaging for Company A and B modules
 * exists (ADR 0001, D2).
 */
const MODULES: IicModule[] = [lineSpacingStub];

declare global {
  interface Window {
    __iicBooted?: boolean;
  }
}

async function boot(): Promise<void> {
  // Guard against double injection (e.g. declared script plus a later programmatic one).
  if (window.__iicBooted) return;
  window.__iicBooted = true;

  const descriptors = Object.fromEntries(MODULES.map((m) => [m.id, m.settings]));
  const prefs = new PrefsStore(chromeStorageArea(), descriptors);
  const doc = await prefs.load();
  if (!doc.enabledGlobally || doc.disabledSites.includes(location.hostname)) return;

  const styles = new StyleService(document);
  let toolbar: PlaceholderToolbar | null = null;
  const registry = new ModuleRegistry(prefs, styles, {
    notify: (message, kind) => toolbar?.notify(message, kind),
    announce: (message) => toolbar?.announce(message),
  });
  for (const m of MODULES) registry.register(m);

  toolbar = new PlaceholderToolbar(document, {
    setValue: (id, key, value) => prefs.setValue(id, key, value),
    resetModule: (id) => prefs.resetModule(id),
    resetAll: () => prefs.resetAll(),
  }, registry.list());

  const settingsSnapshot = (): Record<string, ModuleSettings> =>
    Object.fromEntries(registry.list().map((m) => [m.id, prefs.getModule(m.id)]));

  await registry.start();
  toolbar.setSettings(settingsSnapshot());

  // One path for every change: this tab's own saves and other tabs' saves both
  // arrive here, so all open tabs stay in sync.
  let previous = JSON.stringify(settingsSnapshot());
  prefs.subscribe(() => {
    const current = settingsSnapshot();
    toolbar?.setSettings(current);
    const serialised = JSON.stringify(current);
    if (serialised === previous) return;
    previous = serialised;
    void registry.applyAll();
  });

  chrome.runtime.onMessage.addListener((message, sender) => {
    if (sender.id !== chrome.runtime.id || !isExtensionMessage(message)) return;
    toolbar?.toggle();
  });
}

void boot().catch((err) => console.error('[iic] failed to start', err));
