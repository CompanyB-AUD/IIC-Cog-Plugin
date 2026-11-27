/** Styles for the placeholder toolbar, scoped to its shadow root. */
export const TOOLBAR_CSS = `
:host { all: initial; }
.iic-root {
  --fg: #1b1c1b; --muted: #454845; --bg: #ffffff; --line: #8a8d8a;
  --accent: #0b5d3b; --accent-fg: #ffffff; --danger: #a4161a;
  --focus: #1a56db;
  font: 16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--fg);
}
.iic-launcher {
  position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
  min-height: 44px; padding: 0 18px; border-radius: 22px;
  border: 2px solid var(--accent); background: var(--accent); color: var(--accent-fg);
  font: 600 16px/1 system-ui, sans-serif; cursor: pointer;
}
.iic-panel {
  position: fixed; right: 16px; bottom: 72px; z-index: 2147483647;
  width: min(360px, calc(100vw - 32px)); max-height: calc(100vh - 96px); overflow: auto;
  background: var(--bg); color: var(--fg); border: 1px solid var(--line); border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0,0,0,.18); padding: 16px;
}
.iic-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
h2 { font-size: 20px; margin: 0; }
h3 { font-size: 15px; margin: 16px 0 8px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; }
.iic-badge { margin: 6px 0 0; font-size: 13px; color: var(--muted); }
fieldset { border: 1px solid #d3d6d3; border-radius: 8px; margin: 0 0 12px; padding: 8px 12px 12px; }
legend { font-weight: 600; padding: 0 4px; }
.iic-control { margin: 8px 0; }
.iic-hint { margin: 4px 0 0; font-size: 14px; color: var(--muted); }
button {
  min-height: 44px; min-width: 44px; padding: 0 14px; border-radius: 8px; cursor: pointer;
  font: 600 15px/1.2 system-ui, sans-serif; border: 2px solid var(--line); background: var(--bg); color: var(--fg);
}
.iic-toggle { width: 100%; display: flex; justify-content: space-between; align-items: center; }
.iic-toggle[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--accent-fg); }
.iic-state { font-weight: 400; }
.iic-secondary { margin-top: 4px; }
.iic-danger { background: var(--danger); border-color: var(--danger); color: #fff; margin-right: 8px; }
.iic-slider { display: flex; align-items: center; gap: 12px; }
input[type="range"] { flex: 1; min-height: 44px; accent-color: var(--accent); }
output { min-width: 3.5em; text-align: right; font-variant-numeric: tabular-nums; }
.iic-reset { border-top: 1px solid #d3d6d3; margin-top: 8px; padding-top: 12px; }
.iic-reset p { margin: 0 0 8px; font-weight: 600; }
.iic-notices { list-style: none; margin: 12px 0 0; padding: 0; }
.iic-notice { display: flex; gap: 8px; align-items: center; justify-content: space-between;
  border-left: 4px solid var(--line); background: #f4f5f4; padding: 6px 8px; margin-bottom: 6px; }
.iic-error { border-left-color: var(--danger); }
.iic-warning { border-left-color: #b45309; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
.iic-sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
@media (prefers-reduced-motion: no-preference) { button { transition: background-color .12s; } }
`;
