import { chromium, expect, test, type BrowserContext, type Page } from '@playwright/test';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

/**
 * Walking-skeleton journey: install → open toolbar → change a setting → save →
 * reload and restart → reset. Uses the production build in dist/ and an isolated,
 * temporary browser profile (never a personal one).
 */
const EXTENSION = resolve(import.meta.dirname, '../../dist');
const DEMO = 'http://localhost:4173/';
const BASE_LINE_HEIGHT = '20.8px'; // the demo page's own 16px × 1.3

let profile: string;

test.beforeAll(() => {
  if (!existsSync(join(EXTENSION, 'manifest.json'))) throw new Error('Run `pnpm build` first: dist/manifest.json is missing.');
  profile = mkdtempSync(join(tmpdir(), 'iic-e2e-'));
});

test.afterAll(() => rmSync(profile, { recursive: true, force: true }));

async function launch(): Promise<BrowserContext> {
  return chromium.launchPersistentContext(profile, {
    channel: 'chromium',
    args: [`--disable-extensions-except=${EXTENSION}`, `--load-extension=${EXTENSION}`],
  });
}

async function openDemo(context: BrowserContext): Promise<{ page: Page; errors: string[] }> {
  const page = context.pages()[0] ?? (await context.newPage());
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(DEMO);
  return { page, errors };
}

const lineHeight = (page: Page) => page.locator('#p1').evaluate((el) => getComputedStyle(el).lineHeight);

async function storedPrefs(context: BrowserContext): Promise<unknown> {
  const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
  return worker.evaluate(async () => (await chrome.storage.local.get('iic.prefs'))['iic.prefs']);
}

test('install → open toolbar → change setting → save → restart → reset', async () => {
  // 1. Installed extension shows its launcher on the demo page (AC-E1.1).
  let context = await launch();
  let { page, errors } = await openDemo(context);
  const launcher = page.getByRole('button', { name: 'Reading tools' });
  await expect(launcher).toBeVisible({ timeout: 1_000 });
  expect(await lineHeight(page)).toBe(BASE_LINE_HEIGHT);

  // 2. Open the toolbar; focus moves into it.
  await launcher.click();
  await expect(launcher).toHaveAttribute('aria-expanded', 'true');
  const panel = page.getByRole('region', { name: 'Reading tools' });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Close' })).toBeFocused();

  // 3. Change settings with mouse and keyboard; the page updates.
  const toggle = panel.getByRole('button', { name: 'Wider line spacing' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => lineHeight(page)).toBe('28.8px'); // 16px × 1.8
  const slider = panel.getByRole('slider', { name: 'Line spacing' });
  await slider.focus();
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
  await expect.poll(() => lineHeight(page)).toBe('35.2px'); // 16px × 2.2

  // 4. Escape closes the toolbar and returns focus to the launcher (AC-E1.2).
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(launcher).toBeFocused();

  // 5. Saved: survives a reload…
  await page.reload();
  await expect.poll(() => lineHeight(page)).toBe('35.2px');
  expect(await storedPrefs(context)).toMatchObject({
    schemaVersion: 1,
    modules: { 'stub.line-spacing': { enabled: true, lineHeight: 2.2 } },
  });
  expect(errors).toEqual([]);

  // …and a full browser restart with the same profile (AC-E2.1).
  await context.close();
  context = await launch();
  ({ page, errors } = await openDemo(context));
  await expect.poll(() => lineHeight(page)).toBe('35.2px');

  // 6. Reset all, confirmed inside the toolbar rather than with confirm() (AC-E2.2).
  await page.getByRole('button', { name: 'Reading tools' }).click();
  const panel2 = page.getByRole('region', { name: 'Reading tools' });
  await panel2.getByRole('button', { name: 'Reset all settings' }).click();
  const confirm = panel2.getByRole('button', { name: 'Yes, reset everything' });
  await expect(confirm).toBeFocused();
  await confirm.click();
  await expect(panel2.getByRole('button', { name: 'Reset all settings' })).toBeFocused();

  // The page looks as it did without the plugin: no injected styles or tokens left.
  await expect.poll(() => lineHeight(page)).toBe(BASE_LINE_HEIGHT);
  await expect(page.locator('style[data-iic-style]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.getAttribute('style') ?? '')).not.toContain('--iic-');
  await expect(panel2.getByRole('button', { name: 'Wider line spacing' })).toHaveAttribute('aria-pressed', 'false');
  expect(await storedPrefs(context)).toMatchObject({ modules: { 'stub.line-spacing': { enabled: false, lineHeight: 1.8 } } });
  expect(errors).toEqual([]);

  await context.close();
});

test('typing in a page field is never intercepted by the toolbar', async () => {
  const context = await launch();
  const { page } = await openDemo(context);
  await page.getByRole('button', { name: 'Reading tools' }).click();
  await page.locator('#notes').click();
  await page.keyboard.type('Escape key test');
  await page.keyboard.press('Escape');
  await expect(page.locator('#notes')).toHaveValue('Escape key test');
  // Escape in the page field does not close the toolbar: only Escape inside it does.
  await expect(page.getByRole('region', { name: 'Reading tools' })).toBeVisible();
  await context.close();
});
