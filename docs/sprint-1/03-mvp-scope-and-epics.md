# 3. MVP scope, epics and acceptance criteria

## 1. Scope decision

The brief asks Company B to choose a primary target during Sprint 1 and not to promise features it can't build and evaluate in five weeks.

**Decision: cognitive accessibility as the primary target, with a deliberately limited hearing layer.**

| Option | Considered | Why / why not |
|---|---|---|
| Hearing only | ❌ | The highest-value hearing feature, automatic captions for uncaptioned media, needs tab-audio capture plus a speech-recognition service. Accuracy on Ghanaian English and technical vocabulary is a known weakness (see our Prosit 1 research), and evaluating it properly would take most of the five weeks. Without it, a hearing-only module is thin. |
| Cognitive only | 🟡 | Feasible and can be tested on any page. But it leaves FR08 and FR09 unaddressed and ignores our Prosit 1 hearing research. |
| **Cognitive first + light hearing** | ✅ | Cognitive features cover FR10 and FR11 in depth. The hearing layer covers FR08 and FR09 **only where the browser can do it reliably**: re-styling existing caption tracks, building transcripts from them, and visual alerts for HTML media playback. Uncaptioned media is **detected and reported**, not fixed. This keeps every promise testable. |

**Feasibility assumptions:** about 12 people in the company; four build sprints (Sprints 2–5); Chromium browser only; one shared demo LMS environment; Company A delivers its visual module against the same core.

## 2. What an epic is (for the team)

An **epic** is a large piece of work in the product backlog, too big for one sprint, grouped around one capability. Each epic below has a goal, the personas it serves, the functional requirements (FR) it covers, and **acceptance criteria (AC)** that make it testable. In later sprints, epics are broken into backlog items and tasks with owners and estimates. On the Scrum board, each epic is a label or parent issue.

## 3. Epic overview

Shared epics are built **with Company A**. Company B epics are ours alone.

| Epic | Name | Owner | FRs | Priority | Target sprint |
|---|---|---|---|---|---|
| E1 | Plugin shell and shared toolbar | Shared | FR01, FR02, FR04 | Must | S2 |
| E2 | Preferences, presets and page state | Shared | FR03, FR12, FR13 | Must | S2–S3 |
| E3 | Module integration and demo environment | Shared | FR14 | Must | S1–S3 |
| E4 | Focus and distraction reduction | B | FR10 | Must | S2–S3 |
| E5 | Reading support (incl. intelligent features) | B | FR10, FR11 | Must (AI items: Should) | S2–S4 |
| E6 | Captions, transcripts and visual alerts | B | FR08, FR09 | Should | S3–S4 |
| E7 | Content barrier report for lecturers | B | Limitation-reporting requirement | Should | S4 |
| E8 | Accessibility of the plugin, quality and evaluation | Shared | FR04 + NFRs | Must | S2–S5 |

Priority uses **MoSCoW**: Must (MVP fails without it), Should (important, planned), Could (if time allows), Won't (explicitly out of scope this time).

---

## 4. Epics in detail

### E1 · Plugin shell and shared toolbar *(shared)*

**Goal:** A user can install the extension, open one consistent toolbar on any supported page, and reach every feature from both companies by keyboard.
**Personas:** all.

| Priority | Feature |
|---|---|
| Must | Manifest V3 extension that installs unpacked in the agreed Chromium browser |
| Must | Toolbar launcher on the page plus a keyboard command to open and close it |
| Must | Toolbar renders controls supplied by modules (see API in document 4) |
| Must | Turn the plugin on or off per site; turning it off restores the page fully |
| Should | Toolbar docks left or right and pushes page content aside instead of covering it |

**Acceptance criteria**

- **AC-E1.1** Installing the unpacked build and reloading the demo page shows the toolbar launcher within 1 s, with no console errors.
- **AC-E1.2** The keyboard command toggles the toolbar; when it closes, focus returns to the element that had focus before it opened.
- **AC-E1.3** The toolbar never hides the focused page element (WCAG 2.4.11). Check: tab through the whole demo page with the toolbar open.
- **AC-E1.4** Turning the plugin off for a site removes all injected styles and DOM nodes. A DOM snapshot comparison shows no leftovers.
- **AC-E1.5** Controls from Company A and Company B appear in the same toolbar with the same visual style.

### E2 · Preferences, presets and page state *(shared)*

**Goal:** Settings persist, can be bundled into presets, never need a diagnosis, and changing them never loses the user's place.
**Personas:** P1 (presets), P2 (fine control), P4 (no diagnosis).

| Priority | Feature |
|---|---|
| Must | Save and load preferences locally; schema is versioned |
| Must | Reset all settings, or one module's settings, to defaults (FR13) |
| Must | Keep the reading position when a setting changes (FR12) |
| Should | Presets named by function: "Focus", "Easier reading", "Captions on" |
| Could | Export and import settings as a file, to move between computers |
| Won't | User accounts or cloud profiles (privacy and scope) |

**Acceptance criteria**

- **AC-E2.1** Changed settings are still applied after closing and reopening the browser.
- **AC-E2.2** "Reset to defaults" restores every setting and the page looks as it did with the plugin off. It asks for confirmation inside the toolbar, not through a browser `confirm()` dialog.
- **AC-E2.3** With the user scrolled to paragraph N of a long reading, switching reading mode or spacing on or off keeps paragraph N visible in the viewport.
- **AC-E2.4** No setup step or preset name refers to a disability or diagnosis.
- **AC-E2.5** Stored preferences contain no personal data: no name, email or browsing history. Check by inspecting `chrome.storage`.

### E3 · Module integration and demo environment *(shared)*

**Goal:** Both companies' modules plug into one core through an agreed contract and are tested on one shared demo site.

| Priority | Feature |
|---|---|
| Must | Module contract and registry agreed and versioned (document 4) |
| Must | Demo LMS site with: course home page, long reading, assignment instructions, quiz form, captioned video, uncaptioned video, page with audio notification, page with images (for Company A) |
| Must | A failing module doesn't break the toolbar or other modules |
| Should | Demo site hosted on GitHub Pages so both teams and testers use the same URL |

**Acceptance criteria**

- **AC-E3.1** A stub module written against the contract only (no core changes) appears in the toolbar and receives preference changes.
- **AC-E3.2** If a module throws an error during `apply()`, the toolbar shows a short "This feature couldn't run on this page" message, and the other modules keep working.
- **AC-E3.3** Both companies' modules run together on every demo page without CSS or DOM conflicts. The style ownership table in document 4 is followed.

### E4 · Focus and distraction reduction *(Company B)*

**Goal:** Remove visual noise so the main learning content is the only thing competing for attention.
**Personas:** P1 (main), P2, P4.

| Priority | Feature |
|---|---|
| Must | **Reading mode:** pull out the main content and show it in a clean, single-column view (deterministic extraction, e.g. Mozilla Readability) |
| Must | **Stop motion:** pause CSS animations and transitions, GIFs and autoplaying carousels |
| Should | **Hide distractions** without reading mode: dim or hide sidebars, banners and "related" panels, keeping the original page |
| Should | **Focus spotlight:** dim everything except the paragraph or section being read |
| Won't | Blocking ads or third-party trackers (not our purpose, and permission-heavy) |

**Acceptance criteria**

- **AC-E4.1** On every demo reading page, reading mode keeps all headings, body paragraphs, lists, tables, images with alt text and links from the main content. Measure against a hand-made checklist for each page; target 100 % of essential items.
- **AC-E4.2** Reading mode leaves out navigation, sidebars and footers on the demo course page.
- **AC-E4.3** With "Stop motion" on, no element on the demo pages animates. Check: computed `animation-play-state` and the carousel staying still for 10 s.
- **AC-E4.4** If reading mode can't find main content, it says so in plain language and falls back to "Hide distractions" instead of showing an empty view.
- **AC-E4.5** Leaving reading mode returns the user to the matching place on the original page (AC-E2.3).

### E5 · Reading support *(Company B)*

**Goal:** Make long and dense text easier to read, track and understand, with optional intelligent help.
**Personas:** P2 (main), P1, P4.

| Priority | Feature |
|---|---|
| Must | **Text spacing:** line height, letter, word and paragraph spacing, up to at least the WCAG 1.4.12 values |
| Must | **Line length and font:** maximum line width; choice of a few readable fonts; left-aligned (no justified) text |
| Must | **Reading ruler / line highlight** that follows the mouse or keyboard |
| Must | **Chunking:** split long content into sections by headings, or every N paragraphs if there are no headings, with next and previous controls |
| Must | **Reading time and progress:** estimated time remaining (adjustable reading speed) and a progress bar |
| Should | **Instructions as steps (deterministic):** detect numbered or "first/then/finally" patterns and show them as a checklist |
| Should | **🧠 Simplify passage (AI, opt-in):** user selects text → plain-language version shown *next to* the original, labelled "AI-generated, check against the original" |
| Should | **🧠 Key points (AI, opt-in):** 3–5 bullet summary of the current chunk |
| Could | Readability score per section (e.g. sentence length and word complexity) to flag hard passages |
| Won't | Silently replacing original text with AI output |

**About "intelligent computing":** The brief says deterministic features can be more appropriate than AI, but choices must be justified. We use a **hybrid**: every Must feature is deterministic and works offline. AI features are Should, **off by default**, run only on text the user selects, and always show the original. If the AI service fails or there is no internet, the deterministic version still works (e.g. step detection still splits instructions).

**Acceptance criteria**

- **AC-E5.1** With maximum spacing on (line height 1.5, paragraph spacing 2×, letter spacing 0.12 em, word spacing 0.16 em), no text on the demo pages is clipped or overlapping (WCAG 1.4.12 test).
- **AC-E5.2** The reading ruler can be moved with the keyboard alone (arrow keys), not only the mouse.
- **AC-E5.3** On a demo reading of at least 2,000 words, chunking produces sections that each have a heading or label, and moving with next/previous updates the progress bar.
- **AC-E5.4** Estimated reading time is within ±20 % of actual time at the user's chosen reading speed. Check with three testers on one demo reading.
- **AC-E5.5** On the demo assignment page, "Instructions as steps" finds every step the author wrote. Target: all steps on all three demo instruction samples.
- **AC-E5.6** AI features are off by default. Turning them on shows a one-screen explanation of what text is sent, where it goes and that it isn't stored.
- **AC-E5.7** AI output is never shown without (a) the original text next to it and (b) an "AI-generated" label.
- **AC-E5.8** With the network disconnected, AI buttons show "Not available offline", and every Must feature in E4 and E5 still works.
- **AC-E5.9** Evaluation (Sprint 4): in a structured comparison on 10 demo passages, testers rate the simplified version as preserving the meaning in at least 8 of 10. Failures are recorded as limitations.

### E6 · Captions, transcripts and visual alerts *(Company B, light hearing layer)*

**Goal:** Make existing captions readable and searchable, make in-page sounds visible, and be honest about media we cannot caption.
**Personas:** P3 (main), P4.

| Priority | Feature |
|---|---|
| Should | **Styled captions:** for HTML5 `<video>` with caption or subtitle tracks, render captions with user-chosen size, colour, background and position |
| Should | **Interactive transcript panel:** built from caption cues; current line highlighted; click a line to jump to that point; searchable |
| Should | **Visual sound alerts:** when page media starts playing with sound, or a page notification sound plays through HTML media, show a visible, non-blocking alert (and optionally a brief screen-edge flash, kept within safe flash limits) |
| Should | **Missing-caption flag:** videos without caption tracks get a visible "No captions available" badge |
| Won't (MVP) | Automatic speech-to-text captions for uncaptioned media → documented as future work |
| Won't (MVP) | Captions inside cross-origin players (e.g. YouTube iframes) → documented compatibility boundary |

**Acceptance criteria**

- **AC-E6.1** On the captioned demo video, the plugin's captions stay in sync with the native track (they use the same cues) and follow the user's size, colour and position settings.
- **AC-E6.2** Captions can be moved so they don't cover the bottom third of the video (where slide content often sits).
- **AC-E6.3** The transcript panel shows every cue; clicking a line moves `currentTime` to that cue's start; search finds a known phrase.
- **AC-E6.4** The transcript panel works with keyboard and screen reader (list semantics, the current cue announced politely only when the user turns that on).
- **AC-E6.5** On the demo audio-notification page, a visual alert appears within 500 ms of the sound starting and stays until dismissed or for at least 5 s.
- **AC-E6.6** The flash option never flashes more than 3 times per second (WCAG 2.3.1).
- **AC-E6.7** The uncaptioned demo video shows a "No captions available" badge, which explains that the course team needs to add captions.

### E7 · Content barrier report for lecturers *(Company B)*

**Goal:** Address the brief's requirement to identify and communicate limitations, which also serves the lecturer persona (P5).
**Personas:** P5 (main), P3.

| Priority | Feature |
|---|---|
| Should | "Check this page" action that lists cognitive and hearing barriers the plugin found but **cannot fix**: videos without captions, pages without headings, very long instructions, autoplaying audio, timed content |
| Should | Each item gets a plain-language explanation and a "how to fix" note for the author |
| Could | Copy the report as text to send to the lecturer or support office |
| Won't | A full WCAG audit (other tools do this; not our purpose) |

**Acceptance criteria**

- **AC-E7.1** On the demo course page, the report finds every planted barrier (uncaptioned video, missing headings, wall-of-text instructions, autoplay audio).
- **AC-E7.2** The report shows no more than 5 top items first, ranked by impact, with the rest behind "Show all".
- **AC-E7.3** Each item names the WCAG success criterion and gives one concrete fix in plain language.
- **AC-E7.4** No barrier from the planted list is wrongly reported as "fixed by the plugin".

### E8 · Accessibility of the plugin, quality and evaluation *(shared)*

**Goal:** The plugin itself meets WCAG 2.2 AA, performs well, protects privacy, and is tested with real assistive technology.

| Priority | Feature |
|---|---|
| Must | All toolbar controls reachable and usable by keyboard with a visible focus indicator (FR04) |
| Must | Correct names, roles and states for screen readers (NVDA on Windows; VoiceOver on macOS if available) |
| Must | Targets at least 24×24 px; respects `prefers-reduced-motion` and the user's zoom |
| Must | Least-privilege permissions; no analytics or tracking |
| Must | Performance budget (document 4 §7) |
| Should | Automated checks (axe-core) in CI, *plus* manual testing. Automated checks alone don't count as evaluation |

**Acceptance criteria**

- **AC-E8.1** A keyboard-only tester completes these tasks on the demo site with no mouse: open toolbar → turn on Focus preset → adjust spacing → open transcript → reset.
- **AC-E8.2** With NVDA, every toolbar control announces a meaningful name, role and state (e.g. "Reading mode, toggle button, pressed").
- **AC-E8.3** axe-core reports zero serious or critical issues in the toolbar UI.
- **AC-E8.4** Extension permissions match the list in document 4 §6, with no broad host permission granted by default.
- **AC-E8.5** Page load time on demo pages with the plugin on is at most 100 ms slower than with it off (median of 10 loads).

---

## 5. Out of scope (stated openly)

| Item | Reason | Where it goes |
|---|---|---|
| Automatic captions for uncaptioned media | Tab audio capture, recognition accuracy on Ghanaian English, evaluation time | Future work; flagged by E6/E7 |
| YouTube / cross-origin embedded players | Content scripts can't reliably reach cross-origin iframes without broad permissions | Compatibility boundary in docs |
| Sign language (Ghanaian Sign Language) interpretation | Needs human interpreters or research-level models; must be co-designed with the Deaf community | Future work; ethics section |
| Fixing timed quizzes | Timers are server-side LMS settings | Reported by E7 |
| Mobile browsers | Brief requires one Chromium desktop browser | Compatibility boundary |
| PDF documents opened in the browser's PDF viewer | Extension content scripts don't run in the built-in viewer | Compatibility boundary |

## 6. Definition of Done (proposed, to agree with Company A)

A backlog item is **done** when:

1. The code is merged to `main` through a reviewed pull request.
2. Its acceptance criteria pass on the shared demo site in the agreed browser.
3. It works with the keyboard alone and has correct screen-reader labels.
4. It respects reset-to-defaults and doesn't lose the reading position.
5. Its failure modes (unsupported page, missing content, offline) show a clear message instead of failing silently.
6. User-facing text is plain language and doesn't refer to disabilities or diagnoses.
7. The README or developer docs are updated if it adds a setting, permission or API.
8. It appears in the sprint increment demo.
