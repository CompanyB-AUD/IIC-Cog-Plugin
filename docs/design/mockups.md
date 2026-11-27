# Toolbar wireframes and control grouping (#12)

Status: **Draft for team review and Company A review.** Nothing here is agreed until the review below is recorded and #10 (shared contract) is decided.

| | |
|---|---|
| Issue | [#12 Design toolbar wireframes and accessible interaction flows](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/12) |
| Wireframes and layout | Chelsea Owusu-Pokuaah |
| Keyboard and interaction flows | Michael Sylvester (drafting; see [section 7](#7-keyboard-and-interaction-flows)) |
| Company A review | kaanyen |
| Clickable wireframe | [toolbar-wireframe.html](toolbar-wireframe.html). Download it, or check out this branch, and open it in Chrome. No build step. |

## 1. Sources

- [MVP scope and acceptance criteria](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/03-mvp-scope-and-epics.md): E1, E2, E4, E5, E6 and E8.
- [Personas](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/02-personas.md): the "What the personas tell us about design" section.
- [Architecture proposal](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/04-architecture-and-apis.md) §4.1: the module `group` field and the `ControlDescriptor` kinds.
- Draft ADR 0001, D7 and D8 (PR #57, not yet accepted).
- The placeholder toolbar in PR #56. The real toolbar is #14.

## 2. Design principles

These are taken from the personas and the acceptance criteria. Every screen below is checked against them.

1. **Name controls by what they do, never by who they are for.** No label, preset or setup step mentions a disability or diagnosis (AC-E2.4).
2. **Presets first, fine-tuning second.** One click for Abena (P1); detailed control for Yaw (P2).
3. **Don't add clutter to a busy page.** Closed, the toolbar is one small launcher. Open, it shows a short first view and keeps detail behind "More settings" (ADR D7).
4. **Group by purpose, not by company.** Use the five contract groups: Reading, Focus, See, Hear, Tools. Company A and B controls sit side by side with the same style (AC-E1.5).
5. **Say plainly what didn't work.** Notices appear inside the toolbar, never through browser `alert()` or `confirm()` (AC-E2.2, AC-E3.2).
6. **Never cover the page.** The open panel pushes the page aside instead of sitting on top of the text, so it never hides what the user is reading or the focused element (AC-E1.3). See section 6.

## 3. Control inventory and grouping

The toolbar renders only what modules declare through `ControlDescriptor` (`toggle`, `slider`, `select`, `action`, `panel`). This table proposes **which group each control goes in, and its label**. Modules supply the final descriptors.

Priority follows the backlog. Controls for Should and Could features appear only once that feature is built. The wireframe marks them "(if built)".

| Group | Control | Kind | Proposed label | Short description (shown under the label) | Owner / issue | Priority |
|---|---|---|---|---|---|---|
| Presets | Focus | preset | Focus | Hide clutter and stop motion | UI/UX #20 | Should |
| Presets | Easier reading | preset | Easier reading | More space between lines and words | UI/UX #20 | Should |
| Presets | Captions on | preset | Captions on | Larger captions with a background | UI/UX #20 + #35 | Should (if E6 built) |
| Presets | Larger and clearer | preset | Larger and clearer | Bigger text, stronger contrast | Company A | To agree |
| Focus | Reading mode | toggle | Reading mode | Show only the main content in a clean layout | Feat. #25 | Must |
| Focus | Stop motion | toggle | Stop motion | Pause animations, GIFs and carousels where possible | Feat. #26 | Must |
| Focus | Hide distractions | toggle | Hide distractions | Dim sidebars and banners and keep the page | Feat. #27 | Should |
| Focus | Focus spotlight | toggle | Spotlight | Dim everything except the part you are reading | Feat. #27 | Should |
| Reading | Line spacing | slider | Line spacing | 1.0–2.0 | Feat. #28 | Must |
| Reading | Letter spacing | slider | Letter spacing | 0–0.12 em | Feat. #28 | Must |
| Reading | Word spacing | slider | Word spacing | 0–0.16 em | Feat. #28 | Must |
| Reading | Paragraph spacing | slider | Paragraph spacing | 1×–2× | Feat. #28 | Must |
| Reading | Line width | select | Line width | Narrow / Medium / Full | Feat. #28 | Must |
| Reading | Font | select | Font | Page font / readable fonts (owner open, see section 8) | Feat. #28 or Company A | Must |
| Reading | Reading ruler | toggle | Reading ruler | Highlight the line you are reading | UI/UX #29 | Must |
| Reading | Sections | toggle + panel | Split into sections | Show one section at a time, with next and previous | Feat. #30 | Must |
| Reading | Progress and time | toggle | Show progress | Progress bar and estimated time left | UI/UX #31 | Must |
| Reading | Reading speed | slider | Reading speed | Words per minute, used for the time estimate | UI/UX #31 | Must |
| Reading | Instructions as steps | toggle | Show steps as a checklist | Turn numbered instructions into a checklist | Feat. #32 | Should |
| See | Text size, contrast, read aloud, image descriptions | per Company A | Company A's labels | | Company A | Company A |
| Hear | Caption style | panel | Caption style | Size, colour, background, position | UI/UX #35 | Should |
| Hear | Transcript | panel | Transcript | Searchable text of the video | UI/UX #36 | Should |
| Hear | Sound alerts | toggle | Show sound alerts | A visible alert when the page plays a sound | Feat. #37 | Should |
| Tools | Check this page | action | Check this page | List barriers the toolbar can't fix | Feat. #38 / UI/UX #39 | Should |
| Tools | Reset | action | Reset all settings | Asks to confirm, inside the toolbar | Core #18 | Must |
| Tools | Site on/off | toggle | Use on this site | Turn the toolbar off here and restore the page | Core #15 | Must |
| Tools | Privacy and help | link | Privacy and help | Opens the options page | Core / UI/UX | Must |

**Why three quick switches appear in the first view:** Reading mode, Stop motion and Reading ruler are single, high-value Must toggles that the personas reach for first (P1 and P2). Every other control lives in its group under "More settings". This choice is a hypothesis to check in #11 and #44.

## 4. Layout

```
 Closed                                Open (first view)
 ┌──────────────────────────────┐      ┌───────────────────────────┬──────────────────┐
 │ page content                 │      │ page content              │ Reading tools  ✕ │
 │                              │      │                           │──────────────────│
 │                              │      │                           │ Presets          │
 │                              │      │                           │ [Focus][Easier   │
 │                              │      │                           │  reading]        │
 │                              │      │                           │──────────────────│
 │                              │      │                           │ Quick switches   │
 │                              │      │                           │ Reading mode [ ○]│
 │                              │      │                           │ Stop motion  [ ○]│
 │                              │      │                           │ Reading ruler[ ○]│
 │                              │      │                           │──────────────────│
 │                         ┌──┐ │      │                           │ ▸ More settings  │
 │                         │Aa│ │      │                           │──────────────────│
 │                         └──┘ │      │                           │ Reset all · Use  │
 └──────────────────────────────┘      └───────────────────────────┴ on this site ────┘
   launcher, bottom right                panel docked right, full height
```

| Element | Proposal | Reason |
|---|---|---|
| Launcher | 48×48 CSS px round button, bottom right, 16 px from the edges. Accessible name "Reading tools". The icon is decorative. | Above the 24×24 minimum and close to the 44×44 aim (ADR D7). Small enough not to add clutter (P1). |
| Panel | Docked right, full viewport height, 360 px wide. Opening it **pushes the page left**: the page reflows into the remaining width, and closing restores it. Below 640 px of viewport width, the panel takes the full width instead. The panel scrolls inside itself. | Never covers page text (AC-E1.3, principle 6). Predictable position. Width fits sliders and labels at 200% zoom with wrapping. |
| Header | Title "Reading tools" as a heading, and a close button (✕, accessible name "Close reading tools"). | Clear landmark for screen readers. The close button is always reachable. |
| Sections | Presets → Quick switches → More settings (disclosure) → footer. Inside More settings, one disclosure per group in the order Reading, Focus, See, Hear, Tools. | Matches the "presets first" principle. Groups appear only if they contain a control. |
| Footer | "Reset all settings" and "Use on this site". | Always visible, so recovery is easy to find (P1, P2). |
| Notices area | Directly under the header, at most 3 at a time, each dismissible. | Visible when the toolbar opens. Matches the placeholder toolbar. |
| Section and progress strip | When sections or progress are on, a compact strip under the header: "Section 3 of 8 · about 6 min left", with Previous and Next. | Keeps chunk navigation in one predictable place. Final placement belongs to #30 and #31. |
| Visual style | Greyscale in the wireframe. Real colours come from shared tokens (`--iic-focus-ring` and so on). Visible focus ring at least 2 px. Respects `prefers-reduced-motion` and zoom. | AC-E8 and the token ownership table. |

## 5. Screens and states

Each state is in the clickable wireframe; use the "Wireframe state" picker at the top of the file.

| # | State | What the user sees | Criteria it supports |
|---|---|---|---|
| S1 | Closed | Launcher only. | AC-E1.1 |
| S2 | Open: first view | Presets, three quick switches, "More settings" collapsed, footer. | AC-E1.5, principle 2 |
| S3 | Preset chosen, then adjusted | The chosen preset shows as pressed. Changing any setting afterwards changes the label to "Focus (changed)", and the preset can be chosen again to restore it. | #20, AC-E2.4 |
| S4 | More settings expanded | Group disclosures. The Reading group is open, with spacing sliders and select controls. Each slider shows its current value as text. | AC-E5.1, FR04 |
| S5 | Reading mode on, sections on | The section and progress strip appears under the header, with Previous, Next and "Section n of N". | AC-E5.3, #30/#31 |
| S6 | Reset confirmation | Inline in the footer: "Reset all settings? This turns off every feature and restores the page." with **Reset** and **Cancel**. No browser `confirm()`. Focus moves to Cancel. | AC-E2.2 |
| S7 | Notice: feature couldn't run | "Reading mode couldn't find the main content on this page. Showing Hide distractions instead." Dismiss button. | AC-E3.2, AC-E4.4 |
| S8 | Unsupported page | Extension icon popup: "The toolbar can't run on this page", with a link to the list of supported pages. | Architecture §8 |
| S9 | Turned off on this site | Panel closes. The launcher stays and shows "Off on this site". Opening it shows only "Use on this site". | AC-E1.4, #15 |

## 6. The panel pushes the page aside

**Decision in this draft:** the open toolbar never sits on top of page text. Opening it narrows the page to the space left of the panel. Closing it gives the width back.

| Viewport width | Behaviour |
|---|---|
| 640 px and wider | The page reflows into (viewport − 360 px). The reader's place is kept through the position service (#19), because reflowing moves the text. |
| Under 640 px | No room for both side by side. The panel takes the full width while open, and closing it shows the page again. |

Implementation notes for #14 and #16. These are risks to test, not solved problems:

- Pushing the page means changing the host page's layout, for example a right margin on `<html>`. Pages with fixed or sticky headers, or full-width elements sized to `100vw`, may not reflow cleanly. Test them on the demo site and on real LMS pages, and record those that don't.
- Choosing left or right docking (#16) uses the same mechanism on the other side.
- Removing the margin on close, reset and site-off is part of teardown (AC-E1.4).
- The Chrome side panel (ADR D7, option C) would give this behaviour for free, because Chrome narrows the page itself. See O2.

## 7. Keyboard and interaction flows

**Drafted by Michael (reviewer).** Michael adds the open/close, focus-return, tab-order and reset flows here.

Constraints the wireframes already follow (from AC-E1.2, ADR D8 and AGENTS.md; not new decisions):

- `Alt+Shift+A` (rebindable) and the launcher both open and close the toolbar. Closing returns focus to the element that had it before.
- Escape closes the toolbar. It is a non-modal panel, so focus is never trapped.
- No single-character shortcuts. No key handling while the user types in a field or editable region.
- Tab order follows the visual order: header → notices → presets → quick switches → More settings → footer.
- Real buttons, checkboxes, sliders (`input type="range"`) and `details`/`summary` or `button[aria-expanded]` disclosures. No custom widgets where a native one works.

## 8. Open decisions (need #10 or a team decision)

| # | Question | Proposal in this draft | Decided by |
|---|---|---|---|
| O1 | Who owns the font control: Company A or B? | Show one "Font" select in Reading. Owner TBD. | #10, D6 |
| O2 | Toolbar host: in-page Shadow DOM or Chrome side panel? | Wireframed as in-page (ADR D7 option A). A side panel would keep the same grouping but change open/close and focus return. | #10, D7 |
| O3 | Does Company A use the same group names (See) and preset style? | Yes. Their controls appear in a "See" group, plus a "Larger and clearer" preset. | Company A review |
| O4 | Which quick switches go in the first view? | Reading mode, Stop motion, Reading ruler. | Team, then checked in #11/#44 |
| O5 | Where does the section and progress strip live? | Under the toolbar header. | #30, #31 |
| O6 | Launcher label | "Reading tools". This works for both companies' features without mentioning a disability. | Team + Company A |

## 9. Review record

Fill in as reviews happen. Don't record a review that hasn't taken place.

| Date | Reviewer | Feedback | Change made |
|---|---|---|---|
| | Michael Sylvester (UI/UX) | | |
| | kaanyen (Company A) | | |

## 10. What this draft does not cover

- Final colours, typography and icons. These need the shared token decision (#10).
- Options page and extension popup layouts beyond S8.
- Caption style and transcript panel internals (#35, #36) and barrier report layout (#39).
- No user testing yet. The grouping and labels are assumptions to check in #11 and #44.
