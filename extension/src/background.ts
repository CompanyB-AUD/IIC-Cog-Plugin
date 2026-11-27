import { TOGGLE_TOOLBAR, type ExtensionMessage } from './messages';

/**
 * Service worker: no DOM and no long-lived state. It only forwards the keyboard
 * command and toolbar-icon click to the active tab's content script.
 */
async function toggleInActiveTab(tabId?: number): Promise<void> {
  const id = tabId ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0]?.id;
  if (id === undefined) return;
  const message: ExtensionMessage = { type: TOGGLE_TOOLBAR };
  try {
    await chrome.tabs.sendMessage(id, message);
  } catch {
    // No content script on this page (unsupported or not yet enabled). Running on
    // other pages and the "can't run here" message arrive with #13/#15.
    await chrome.action.setBadgeText({ tabId: id, text: '–' });
    await chrome.action.setTitle({ tabId: id, title: 'Reading tools are not available on this page yet' });
  }
}

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'toggle-toolbar') void toggleInActiveTab(tab?.id);
});

chrome.action.onClicked.addListener((tab) => {
  void toggleInActiveTab(tab.id);
});
