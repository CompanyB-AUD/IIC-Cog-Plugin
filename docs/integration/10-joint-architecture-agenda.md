# Joint architecture meeting: agenda for #10

| | |
|---|---|
| **Purpose** | Agree the shared architecture and module contract with Company A, so both companies can build against one core |
| **Issue** | [#10](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/10) |
| **Decision record** | [ADR 0001 (Proposed)](../adr/0001-development-baseline.md) |
| **Date and time** | _To be scheduled_ (Africa/Accra) |
| **Length** | 75 minutes |
| **Attendees** | Company B: Core and Integration lead, plus one representative each from UI/UX and Feature Implementation. Company A: representatives to be named. Note-taker: _to be named_ |
| **Status** | Draft agenda prepared by Company B Core. Not yet shared with or confirmed by Company A. |

## Before the meeting (both companies, 15 minutes of reading)

1. [ADR 0001](../adr/0001-development-baseline.md): the summary table and the decisions marked **changed by core review**.
2. [Sprint 1 architecture proposal](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/04-architecture-and-apis.md), sections 4 and 5.
3. Company A: please bring your current repository arrangement, any code or contract you already have, and your toolbar and style needs (text size, contrast, text-to-speech, image descriptions).

## Desired outcome

By the end, each of D1–D14 is either **Accepted**, **Rejected** or **Deferred** with a named owner and date. At minimum, the decisions that block the extension scaffold (#13) and the contract (#22) must be settled: **D2, D4, D5, D6 and D13**.

## Agenda

Decisions are ordered by what they unblock, not by number.

| Time | Item | Decision needed | Company B proposal | Question for Company A |
|---|---|---|---|---|
| 0–5 | Goals and ground rules | Confirm the meeting's purpose and how decisions are recorded | Decisions recorded on #10 and in ADR 0001 within 24 hours | Who signs off for Company A? |
| 5–15 | **D2. Repository arrangement** | Monorepo, versioned package or separate extensions | One monorepo with company-owned folders; fallback: versioned package | Can you work in this repository? If not, how would you publish a package, and how often? |
| 15–30 | **D4. Module contract** | Adopt `apiVersion: 1`, with descriptors as plain data and a content-root concept | Lifecycle `init`/`apply`/`teardown`; the core handles errors; no functions inside descriptors; `contentRoot()` plus a `view:changed` event for reading mode | Does the contract cover TTS, contrast, magnification and image descriptions? Do you need panels or actions we haven't listed? |
| 30–40 | **D5. Preferences** | Schema rules, and a single write path | Versioned, namespaced, validated; prefer one storage key per module, fallback: service worker as the only writer | Do you need any global settings outside your module's namespace? Which presets will you contribute ("Larger and clearer")? |
| 40–50 | **D6. Style ownership** | Token owners; how overrides win against the page; font-family owner | Token table as proposed; `!important` inside `@layer iic`; Company B owns font family | How do your contrast and scale features change the page today? Is font family yours, ours or the core's? |
| 50–57 | **D13. Activation and permissions** | How the plugin gets onto pages; per-site on/off | Demo host + `activeTab`; opt-in per-site permission later; never `<all_urls>` by default | Do your features need any other permission (e.g. TTS, or an image-description service)? |
| 57–63 | **D7 / D8. Toolbar and shortcut** | Toolbar host and grouping; keyboard command | Shadow DOM toolbar grouped by purpose; `Alt+Shift+A`, rebindable | Any objection to grouping by purpose rather than by company? Any shortcut conflicts you know of? |
| 63–69 | **D1, D3, D9. Browser, stack, demo site** | Confirm them together unless someone objects | Chrome stable; TypeScript, Vite + CRXJS, Preact, pnpm; static demo site with the listed fixtures | Which demo pages do you need (images, forms, colour-heavy pages)? |
| 69–73 | **D10, D12. Done and cadence** | Definition of Done; meeting and build rhythm | Sprint 1 Definition of Done plus "integrated means the real core"; weekly meeting; two integrated builds per sprint | Which day and time suit you for the weekly meeting? |
| 73–75 | **D11, D14. Deferrals; wrap-up** | Confirm both deferrals; read back decisions and owners | Defer AI until after Sprint 3; no main-world probe unless needed | Any objection to deferring? |

If time runs short, settle D2, D4, D5, D6 and D13 in this meeting and take the rest asynchronously on #10, with a deadline.

## Recording the outcome

Within 24 hours of the meeting, the Core lead:

1. Posts a comment on #10 listing every decision with its outcome, using the template below.
2. Updates ADR 0001: each decision's status, the summary table, the record's status, and a link to the #10 comment.
3. Opens follow-up issues for anything deferred or newly discovered, each with an owner.
4. Records the meeting in the current sprint's Scrum issue (#49 for Sprint 2, #50 for Sprint 3).

Template for the #10 comment:

```markdown
## Joint architecture meeting: <date>

Attendees: Company A: <names>. Company B: <names>.

| # | Decision | Outcome | Notes / owner |
|---|---|---|---|
| D1 | Target browser | Accepted / Rejected / Deferred | |
| D2 | Repository arrangement | | |
| … | … | | |
| D14 | Main-world probe | | |

Unresolved items and deadlines:
- …

ADR 0001 updated in: <PR link>
```

Do not mark a decision Accepted unless Company A explicitly agreed to it in the meeting or in writing on #10.
