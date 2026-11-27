import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineModule, type IicModule, type ModuleContext } from '../src/contract';
import { PrefsStore } from '../src/prefs';
import { FAILURE_MESSAGE, ModuleRegistry } from '../src/registry';
import { lineSpacingStub } from '../src/stubs/line-spacing-stub';
import { StyleService } from '../src/styles';
import { FakeStorage } from './fakes';

function failingModule(phase: 'init' | 'apply'): IicModule {
  return defineModule({
    id: 'stub.always-fails',
    owner: 'B',
    apiVersion: 1,
    title: 'Failing stub',
    group: 'tools',
    settings: [{ key: 'enabled', type: 'boolean', default: true }],
    controls: [],
    init() {
      if (phase === 'init') throw new Error('boom in init');
    },
    apply() {
      if (phase === 'apply') throw new Error('boom in apply');
    },
    teardown() {},
  });
}

async function setup(modules: IicModule[]) {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  const prefs = new PrefsStore(new FakeStorage(), Object.fromEntries(modules.map((m) => [m.id, m.settings])));
  await prefs.load();
  const styles = new StyleService(document);
  const notices: string[] = [];
  const registry = new ModuleRegistry(prefs, styles, { notify: (m) => notices.push(m), announce: () => {} });
  for (const m of modules) registry.register(m);
  return { prefs, styles, registry, notices };
}

const injectedStyles = () => document.querySelectorAll('style[data-iic-style]').length;
const lineHeightToken = () => document.documentElement.style.getPropertyValue('--iic-line-height');

beforeEach(() => {
  document.head.innerHTML = '';
  document.documentElement.removeAttribute('style');
  vi.restoreAllMocks();
});

describe('ModuleRegistry', () => {
  it('rejects modules that break the contract', async () => {
    const { registry } = await setup([]);
    expect(() => registry.register({ ...lineSpacingStub, id: 'Bad Id' })).toThrow(/Invalid module id/);
    expect(() => registry.register({ ...lineSpacingStub, apiVersion: 2 as 1 })).toThrow(/apiVersion/);
    expect(() =>
      registry.register({ ...lineSpacingStub, id: 'stub.other', controls: [{ kind: 'toggle', setting: 'missing', label: 'x' }] }),
    ).toThrow(/unknown setting/);
    registry.register(lineSpacingStub);
    expect(() => registry.register(lineSpacingStub)).toThrow(/already registered/);
  });

  it('a stub module receives preference changes and applies them through the core style service (AC-E3.1)', async () => {
    const { prefs, registry } = await setup([lineSpacingStub]);
    await registry.start();
    expect(injectedStyles()).toBe(0);
    await prefs.setValue('stub.line-spacing', 'enabled', true);
    await registry.applyAll();
    expect(lineHeightToken()).toBe('1.8');
    const css = document.querySelector('style[data-iic-style]')?.textContent ?? '';
    expect(css).toContain('@layer iic');
    expect(css).toContain('!important');
  });

  it('applying the same settings twice does not duplicate page changes', async () => {
    const { prefs, registry } = await setup([lineSpacingStub]);
    await registry.start();
    await prefs.setValue('stub.line-spacing', 'enabled', true);
    await registry.applyAll();
    await registry.applyAll();
    expect(injectedStyles()).toBe(1);
  });

  it.each(['init', 'apply'] as const)('a module failing in %s shows a notice and leaves other modules working (AC-E3.2)', async (phase) => {
    const { prefs, registry, notices } = await setup([failingModule(phase), lineSpacingStub]);
    await registry.start();
    expect(registry.statusOf('stub.always-fails')).toBe('failed');
    expect(notices).toEqual([`Failing stub: ${FAILURE_MESSAGE}`]);
    expect(registry.statusOf('stub.line-spacing')).toBe('active');
    await prefs.setValue('stub.line-spacing', 'enabled', true);
    await registry.applyAll();
    expect(lineHeightToken()).toBe('1.8');
  });

  it('stopAll removes every style element and token the modules added', async () => {
    const { prefs, registry } = await setup([lineSpacingStub]);
    await registry.start();
    await prefs.setValue('stub.line-spacing', 'enabled', true);
    await registry.applyAll();
    await registry.stopAll();
    expect(injectedStyles()).toBe(0);
    expect(lineHeightToken()).toBe('');
  });

  it('cleans up after a module even if its own teardown throws', async () => {
    const leaky = defineModule({
      ...lineSpacingStub,
      id: 'stub.leaky',
      teardown() {
        throw new Error('teardown bug');
      },
    });
    const { prefs, registry } = await setup([leaky]);
    let ctx: ModuleContext | undefined;
    leaky.init = (c) => {
      ctx = c;
    };
    leaky.apply = () => {
      ctx?.style.addRules('x', 'p { color: red !important; }');
    };
    await registry.start();
    await prefs.setValue('stub.leaky', 'enabled', true);
    await registry.applyAll();
    expect(injectedStyles()).toBe(1);
    await registry.stopAll();
    expect(injectedStyles()).toBe(0);
  });
});

describe('StyleService token ownership', () => {
  it('lets a module set only the tokens its company owns', () => {
    const styles = new StyleService(document);
    expect(styles.setToken('B', '--iic-line-height', '2')).toBe(true);
    expect(styles.setToken('B', '--iic-font-scale', '1.5')).toBe(false);
    expect(styles.setToken('A', '--iic-line-height', '3')).toBe(false);
    expect(document.documentElement.style.getPropertyValue('--iic-line-height')).toBe('2');
    expect(document.documentElement.style.getPropertyValue('--iic-font-scale')).toBe('');
  });

  it('refuses rule ids that could break out of the managed element', () => {
    const styles = new StyleService(document);
    expect(() => styles.addRules('stub.x', '"]{}', 'p{}')).toThrow(/Invalid style id/);
  });
});
