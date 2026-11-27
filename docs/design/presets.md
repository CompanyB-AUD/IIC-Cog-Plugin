# Presets: behaviour and interface spec (#20)

Status: **Draft for team review.** This is a spec written before code, and nothing here is implemented. The walking skeleton (PR #56) is now on `main`: it includes the proposed contract, a first version of settings storage (`packages/core/src/prefs.ts`) and a placeholder toolbar. The real toolbar (#14) and the finished settings work (#17) are still open, and ADR 0001 is still **Proposed**. Setting keys are provisional until the feature modules publish their descriptors.

| | |
|---|---|
| Issue | [#20 Add function-based reading and focus presets](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/20) |
| Author | Chelsea Owusu-Pokuaah |
| Reviewer | Michael Sylvester |
| Depends on | #14 (toolbar), #17 (settings), plus the modules whose settings presets change: #25, #26, #28, #31 and #35 |
| Related | [#12 wireframes](mockups.md), Core reset #18 |

## 1. Acceptance criteria this spec answers

From #20:

- Provide **Focus** and **Easier reading** presets, plus **Captions on** once captions (E6) are available.
- Allow fine adjustment after choosing a preset. Never ask for diagnosis information.
- **AC-E2.4:** no setup step or preset name refers to a disability or diagnosis.

From the personas: Abena (P1) wants one click; Yaw (P2) wants detailed control. The same toolbar must work for both.

## 2. What a preset is

A preset is **a named shortcut that sets several module settings at once**. It is not a mode, and it stores nothing of its own:

- A preset changes only the settings it lists. Everything else stays as the user left it.
- After choosing a preset, the user can change any setting, as they could without the preset.
- Presets work only through the core's settings client. No preset storage of their own (Core owns storage and reset, #18).

## 3. The presets

Setting keys use `moduleId.key`. **Module IDs and keys are provisional.** The final keys come from each module's `SettingDescriptor` list. Values follow the issue ranges and the WCAG 1.4.12 limits from AC-E5.1.

### Focus

Label: **Focus**. Description: "Hide clutter and stop motion." For Abena (P1): fewer things competing for attention, and a sense of how much is left.

| Setting | Value | Module / issue |
|---|---|---|
| `b.reading-mode.enabled` | `true` | Feature #25 (Must) |
| `b.motion.stopMotion` | `true` | Feature #26 (Must) |
| `b.progress.showProgress` | `true` | UI/UX #31 (Must) |

If Hide distractions (#27, Should) is built, it **does not** replace reading mode in this preset. It stays a separate control, and it is the fallback when reading mode can't find the main content (AC-E4.4).

### Easier reading

Label: **Easier reading**. Description: "More space between lines and words." For Yaw (P2): typographic comfort without removing the page.

| Setting | Value | Module / issue |
|---|---|---|
| `b.text-spacing.lineHeight` | `1.8` | Feature #28 |
| `b.text-spacing.letterSpacing` | `0.06` (em) | Feature #28 |
| `b.text-spacing.wordSpacing` | `0.08` (em) | Feature #28 |
| `b.text-spacing.paragraphSpacing` | `1.5` (× font size) | Feature #28 |
| `b.text-spacing.lineWidth` | `"medium"` (about 70 characters) | Feature #28 |

The values are moderate: roughly half of the WCAG maximums, so the preset helps without making pages feel broken. Users can go up to the maximums with the sliders. The wireframe in #12 uses the same values.

The reading ruler is **not** part of this preset. It's helpful for some readers and distracting for others, so it stays a separate quick switch. This is an assumption to check in #11 and #44.

### Captions on (only if E6 is built)

Label: **Captions on**. Description: "Larger captions with a background."

| Setting | Value | Module / issue |
|---|---|---|
| `b.captions.enabled` | `true` | UI/UX #35 |
| `b.captions.size` | `"large"` | UI/UX #35 |
| `b.captions.background` | `true` | UI/UX #35 |

This preset appears only when the captions module is registered. It is never shown greyed out.

### Larger and clearer (Company A, to agree)

Company A defines this preset's settings (text size and contrast). It uses the same mechanism and looks the same. Listed here so the layout leaves room for it; see open decision P4.

## 4. Behaviour

### 4.1 Presets are independent toggles

Each preset is a **toggle button** (`aria-pressed`). More than one can be on at once, because they change different settings: Focus with Easier reading is a likely combination, since Abena's and Yaw's needs overlap.

| User action | Result |
|---|---|
| Turn a preset on | All its settings are written **in one batch** (section 5). One polite announcement: "Focus on: reading mode, stop motion, progress." |
| Turn a preset off | Only that preset's settings go back to their **defaults**. Other presets and the user's other changes stay. Announcement: "Focus off." |
| Change a setting a preset set | The change is saved as usual. The preset's button becomes **not pressed**, because its settings no longer all match. Announcement: "Focus is now off because line spacing was changed." The other settings from the preset stay as they were. |
| Reset all (Core #18) | Every setting goes back to its default, so every preset shows as off. Nothing preset-specific is needed. |
| Reset one module | Presets that use that module's settings show as off. |

**"Off" means back to defaults, not back to the user's previous values.** Remembering previous values would mean storing extra state, and the result is harder to predict. A user who wants their own mix can adjust settings directly. This needs checking in usability testing (#44).

### 4.2 Whether a preset is on is worked out, not stored

A preset is shown as **on** when every setting it lists currently has the preset's value. Nothing extra is saved:

- No change to the settings format, so it works with any write-path decision in ADR D5.
- It stays correct after a reset, an import (#21), another tab changing a setting, or a user setting the same values by hand.
- `activePreset` in `PrefsDocument` (`packages/core/src/prefs.ts`, from PR #56) is then not needed; see open decision P1.

**Trade-off:** this means no "Focus (changed)" state. The #12 wireframe ([toolbar-wireframe.html](toolbar-wireframe.html)) shows a "(changed)" label, and it will be updated to match whichever option the team chooses (P2).

### 4.3 When a preset's feature can't run on this page

If one of a preset's modules isn't registered, or reports an error on this page (AC-E3.2):

- The preset still writes all its settings, so they apply on pages where the feature does work.
- Whether it shows as on is worked out from the settings, so it shows as on even where a feature can't run on the current page.
- The toolbar shows one notice: "Reading mode isn't available on this page. The rest of Focus is on." It uses the core's notice service, not a new message type.

A preset whose module is **not installed at all** is not shown. Today that applies only to Captions on.

### 4.4 What presets never do

- Ask who the user is, or why they want a preset.
- Change content, submit forms, or turn on optional AI features.
- Turn the plugin on for a site that is off (Core #15). Presets apply only where the toolbar is on.

## 5. What UI/UX needs from Core and Feature Implementation

These are **requests**, not decisions. They change the shared contract, so they go through the agreed review (#10). Until then, implementation uses a labelled mock.

| # | Request | To | Why |
|---|---|---|---|
| R1 | A way for the toolbar to write **several modules' settings in one batch**, for example `prefs.setMany([{ moduleId, key, value }])`. It validates each value as `set` does and writes once. | Core (#17) | Applying a preset key by key causes several re-renders, several layout shifts and a half-applied preset if a write fails. Under ADR D5 option C, one `chrome.storage.local.set` call with several keys covers it. |
| R2 | The batch is wrapped in **one** `position.preserve()` call. | Core (#19) | One layout change instead of five, so the reader keeps their place (AC-E2.3). |
| R3 | A `PresetDescriptor` type in `contract.ts`: `{ id, owner, label, description, settings: { moduleId, key, value }[], requiresModules?: string[] }`. | Core (#22), then Company A | Lets Company A add "Larger and clearer" through the same mechanism, without UI/UX code knowing their keys. |
| R4 | Confirm or rename the setting keys in section 3. `b.reading-mode.enabled` already matches the reading mode PR (#59, open). | Feature Implementation (#25, #26, #28), UI/UX (#31, #35) | Presets break silently if a key is renamed. Implementation will check each preset key against registered descriptors and log an error if one is missing. |
| R5 | Decide whether `activePreset` stays in the settings format. | Core (#17) | Not needed if P1 is accepted. Dropping it before first release avoids a migration later. |

## 6. Toolbar presentation

Most of this is already in the #12 wireframe.

- **Position:** a "Presets" group at the top of the panel, above the quick switches.
- **Control:** a native `<button aria-pressed>` for each preset. The label is the name, and the description is linked with `aria-describedby`. The buttons sit in a `role="group"` labelled "Presets".
- **Keyboard:** Tab reaches each button, and Space or Enter toggles it. Presets are never applied on focus or hover.
- **Visible state:** pressed buttons look different in more than colour (filled background and a check mark) and keep a visible focus ring.
- **Size:** at least 44×44 px. Labels wrap rather than truncate at 200% zoom.

## 7. Naming check (AC-E2.4)

| Allowed (describes the result) | Not allowed (describes a person or condition) |
|---|---|
| Focus, Easier reading, Captions on, Larger and clearer | Dyslexia mode, ADHD mode, For deaf users, Low-vision mode, Accessibility mode, any medical term |

The same rule applies to descriptions, announcements, notices and the options page. Reviewers check it in every PR that adds user-facing text.

## 8. Test plan (for when this is implemented)

None of these have been run. There is no code yet.

| Layer | Checks |
|---|---|
| Unit (Vitest) | Turning a preset on writes exactly its settings. Turning it off restores only those to defaults. On/off is worked out correctly, including when two presets are on. Changing one setting shows the preset as off. A missing setting key is reported. Unknown or invalid values are rejected by the core, not the preset code. |
| Component | Correct `aria-pressed`. Group label and descriptions announced. Space and Enter toggle. Captions on hidden without the captions module. |
| Extension (Playwright) | The keyboard-only path from AC-E8.1: open the toolbar → Focus → adjust spacing → reset. Preset state survives a browser restart (AC-E2.1). The reader's place is kept when Easier reading is turned on (AC-E2.3). |
| Manual | NVDA reads "Focus, toggle button, not pressed" and the announcements (AC-E8.2). Labels checked against section 7. |

## 9. Open decisions

| # | Question | Proposal | Decided by |
|---|---|---|---|
| P1 | Is preset on/off worked out from settings, or stored (`activePreset`)? | Worked out (4.2). | UI/UX + Core |
| P2 | After the user changes a preset's setting, does the preset show as off, or as "changed"? | Off, with an announcement. A "changed" state needs stored state (see P1). | UI/UX, then check in #44 |
| P3 | Can several presets be on at once? | Yes (4.1). If Core keeps a single `activePreset`, fall back to one at a time. | UI/UX + Core |
| P4 | Does Company A provide "Larger and clearer"? | Yes, through R3. | Company A review (#10) |
| P5 | Preset values in section 3 | As listed. Check with users in #11/#44. | UI/UX |
| P6 | Do presets apply everywhere or per site? | Everywhere, the same as all settings today. Per-site settings are out of scope. | Core (#15) |

## 10. Not covered here

- Code. Presets can now be prototyped against the walking skeleton on `main`, labelled as a mock. Finishing them needs #14 and requests R1–R3.
- Options page layout for presets.
- Export and import (#21), which needs nothing extra if P1 is accepted.
