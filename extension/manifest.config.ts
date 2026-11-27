import { defineManifest } from '@crxjs/vite-plugin';

/**
 * Least-privilege manifest for the walking skeleton (ADR 0001, D13, proposed).
 * Runs automatically only on the local demo site. Running on other pages
 * (activeTab + scripting) and per-site opt-in arrive with #15.
 */
const DEMO_MATCHES = ['http://localhost:4173/*', 'http://127.0.0.1:4173/*'];

export default defineManifest({
  manifest_version: 3,
  name: 'IIC Reading Tools (development build)',
  description: 'Reading and focus support for learning pages. Development build of the Company B core.',
  version: '0.1.0',
  minimum_chrome_version: '120',
  permissions: ['storage'],
  background: { service_worker: 'src/background.ts', type: 'module' },
  action: { default_title: 'Open reading tools' },
  commands: {
    'toggle-toolbar': {
      suggested_key: { default: 'Alt+Shift+A' },
      description: 'Open or close the reading tools',
    },
  },
  content_scripts: [{ matches: DEMO_MATCHES, js: ['src/content.ts'], run_at: 'document_idle' }],
});
