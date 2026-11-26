import type { ModuleOwner, StyleToken } from './contract';

/**
 * Token ownership from ADR 0001, D6 (proposed). Font family is still open; until
 * #10 decides, only the core may set it.
 */
export const TOKEN_OWNERS: Record<StyleToken, ModuleOwner> = {
  '--iic-font-scale': 'A',
  '--iic-fg': 'A',
  '--iic-bg': 'A',
  '--iic-link': 'A',
  '--iic-contrast-mode': 'A',
  '--iic-line-height': 'B',
  '--iic-letter-spacing': 'B',
  '--iic-word-spacing': 'B',
  '--iic-paragraph-spacing': 'B',
  '--iic-max-line-length': 'B',
  '--iic-motion': 'B',
  '--iic-focus-ring': 'core',
  '--iic-font-family': 'core',
};

const STYLE_ATTR = 'data-iic-style';
const SAFE_ID = /^[a-z0-9][a-z0-9._-]{0,63}$/;

/**
 * Owns every <style> element and CSS variable the plugin adds to the host page,
 * so teardown can remove all of them. Rules go inside `@layer iic`; overriding
 * declarations must use `!important` to beat unlayered page CSS (ADR 0001, D6).
 */
export class StyleService {
  private tokens = new Map<StyleToken, string>();
  private sheets = new Map<string, HTMLStyleElement>();

  constructor(private readonly doc: Document = document) {}

  setToken(owner: ModuleOwner, name: StyleToken, value: string | null): boolean {
    const tokenOwner = TOKEN_OWNERS[name];
    if (tokenOwner !== owner && owner !== 'core') return false;
    const root = this.doc.documentElement;
    if (value === null) {
      root.style.removeProperty(name);
      this.tokens.delete(name);
    } else {
      root.style.setProperty(name, value);
      this.tokens.set(name, value);
    }
    return true;
  }

  addRules(moduleId: string, ruleId: string, css: string): void {
    const key = `${moduleId}/${ruleId}`;
    if (!SAFE_ID.test(moduleId) || !SAFE_ID.test(ruleId)) throw new Error(`Invalid style id ${key}`);
    let el = this.sheets.get(key);
    if (!el) {
      el = this.doc.createElement('style');
      el.setAttribute(STYLE_ATTR, key);
      this.sheets.set(key, el);
    }
    el.textContent = `@layer iic {\n${css}\n}`;
    if (!el.isConnected) (this.doc.head ?? this.doc.documentElement).append(el);
  }

  removeRules(moduleId: string, ruleId: string): void {
    const key = `${moduleId}/${ruleId}`;
    this.sheets.get(key)?.remove();
    this.sheets.delete(key);
  }

  /** Removes every rule set a module added. Called by the registry on teardown. */
  removeAllFor(moduleId: string): void {
    for (const key of [...this.sheets.keys()]) {
      if (key.startsWith(`${moduleId}/`)) {
        this.sheets.get(key)?.remove();
        this.sheets.delete(key);
      }
    }
  }

  /** Removes tokens owned by `owner`. Used when a module is torn down. */
  clearTokensOwnedBy(owner: ModuleOwner, only?: Set<StyleToken>): void {
    for (const name of [...this.tokens.keys()]) {
      if (TOKEN_OWNERS[name] === owner && (!only || only.has(name))) this.setToken(owner, name, null);
    }
  }

  removeAll(): void {
    for (const el of this.sheets.values()) el.remove();
    this.sheets.clear();
    for (const name of [...this.tokens.keys()]) this.doc.documentElement.style.removeProperty(name);
    this.tokens.clear();
  }
}
