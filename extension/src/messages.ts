/** Messages between the service worker and content scripts. Validate before acting. */
export const TOGGLE_TOOLBAR = 'iic:toggle-toolbar' as const;

export type ExtensionMessage = { type: typeof TOGGLE_TOOLBAR };

export function isExtensionMessage(value: unknown): value is ExtensionMessage {
  return typeof value === 'object' && value !== null && (value as { type?: unknown }).type === TOGGLE_TOOLBAR && Object.keys(value).length === 1;
}
