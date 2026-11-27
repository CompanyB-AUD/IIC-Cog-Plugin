# Usability evaluation plan (#44)

Status: **Draft plan. No sessions have been run.** This document says how the evaluation will be done. Results go in a separate results report once sessions happen (section 11).

| | |
|---|---|
| Issue | [#44 Conduct structured usability evaluation and analyze findings](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/issues/44) |
| Epic | #8 Accessibility, quality and evaluation |
| Lead | Chelsea Owusu-Pokuaah (UI/UX) |
| Reviewer | kaanyen |
| Sprint | Sprint 4, 4–10 December 2026 |
| Depends on | #11 (stakeholder research and personas), #24 (both companies' modules integrated) |
| Related | #41 keyboard and screen-reader evaluation (pmireku); [consent sheet](usability-consent.md); [session record template](usability-session-record.md) |

## 1. Acceptance criteria this plan answers

From #44:

1. Test representative **reading, instruction and configuration** tasks with **voluntary participants**, or clearly documented appropriate simulations.
2. Record **task completion, errors, user feedback and changes**. Protect participant privacy and **do not ask for diagnoses**.
3. Report evidence and limitations **without treating simulation as lived experience**.

**How this differs from #41:** #41 is an expert check of keyboard, NVDA and WCAG behaviour, run by the team. #44 watches **real students** use the extension for study tasks, to learn whether it is understandable and useful. Findings from both are shared, and neither replaces the other.

## 2. What we want to learn

| # | Question | Where it comes from |
|---|---|---|
| Q1 | Can students find and open the toolbar without help? | AC-E1.1, launcher label (#12 O6) |
| Q2 | Can they make a cluttered or dense page easier to read, using the toolbar alone? | E4, E5, personas P1 and P2 |
| Q3 | Do they understand the preset names and control labels? Does any label feel like it is "for someone else" or about a condition? | AC-E2.4, principle 1 in [mockups.md](../design/mockups.md) |
| Q4 | Do they prefer one-click presets, or adjusting individual settings? | P1 assumption in the personas; #20 |
| Q5 | Is it clear what happens to a preset after they change one of its settings? | #20 open decision P2 |
| Q6 | Can they get the page back to normal? | AC-E2.2 |
| Q7 | Does the open toolbar get in the way of reading? | #12 section 6 (push-aside panel) |
| Q8 | Which features would they actually use for their own studies, and which feel unnecessary? | Scope and priority input for Sprint 5 |

These are **questions to learn from**, not pass or fail tests. With 8–10 short sessions, the results show problems and patterns. They don't prove that something works for all students.

## 3. Participants

### 3.1 Who and how many

- **8–10 voluntary Ashesi students, with 5 as the minimum.** Sessions are only 10 minutes (section 8), so each person tells us less. More participants make up for that, and the short slot makes it easier for people to say yes.
- **Not** members of Company A or B. Classmates on other teams are acceptable if no one else volunteers; record that as a limitation.
- Aim for a mix of **study situations**, described in everyday terms, never as conditions:
  - finds long readings tiring, or loses their place
  - gets distracted by busy pages
  - reads mostly in a second language
  - often watches lectures without sound, or relies on captions
  - none of the above (Universal Design check)

### 3.2 Recruitment

- Use an open invitation, for example a class group message: "We're testing a browser tool that makes course pages easier to read. 10 minutes, any student welcome."
- Interested students choose any study situations that apply to them **if they want to**. That's optional, and the only thing used to balance the mix.
- **Never ask about diagnoses, disabilities or medical history**, during recruitment or during the session. If a participant volunteers this, don't write it down.
- No payment. If the team offers snacks or similar, offer them to everyone equally, whether or not they finish.

### 3.3 If there aren't enough volunteers: simulations

Team members can run the tasks under **documented simulated conditions**, for example keyboard only, 200% browser zoom, sound off, or a set reading time. Every simulated session is:

- marked **"Simulation"** in the records and the report
- reported separately from participant sessions
- never described as the experience of disabled students

Simulations can find usability bugs. They can't tell us what disabled students need, and the report has to say so (AC 3).

## 4. Ethics and privacy

**Open question, to settle before any session:** ask the course lecturer whether Ashesi needs an ethics review, or any other approval, for usability testing with students in a course project. **No session runs until the answer is recorded** in #44, without personal details.

Rules that apply either way:

| Rule | How |
|---|---|
| Voluntary | Participants can stop at any time or skip any task or question, with no reason needed and no consequence. |
| Informed consent | Read the [consent sheet](usability-consent.md) out loud and give a copy before starting. Record verbal consent as "yes" against the participant code, with no signature or name. |
| No diagnosis | As in 3.2. |
| No recordings | No audio, video or screen recording. Notes only. |
| Codes, not names | Participants are U01, U02 and so on. The list linking names to codes exists only to arrange sessions; **delete it once sessions are done**. It never goes into the repository, issues, the project board or chat groups. |
| The repository is public | **Raw session notes never go into the repository.** Keep them in a private team folder that only the moderator and note-taker can open. Only combined, anonymised findings go into the results report. |
| Nothing identifying | No quotes that could identify someone (a course, a hometown, an unusual detail). Paraphrase if in doubt. |
| Synthetic content only | Participants use the demo site. Never their own LMS account, real course material or personal browser profile. |
| Data removal | Participants can ask for their notes to be removed until the results report is published. |
| Deletion | Raw notes are deleted when the project is graded, or earlier if the lecturer's guidance says so. |

## 5. Test setup

| Item | Requirement |
|---|---|
| Build | A production build (`pnpm build`) from a recorded commit on `main` that includes #24's integration. Write the commit SHA in every session record. |
| Browser | Chrome stable on the moderator's laptop. Record the version. Load the extension unpacked from `dist/`. |
| Profile | A **fresh, empty Chrome profile** made for testing. No personal accounts, bookmarks or history. |
| Pages | The shared demo site (`pnpm demo`, #23): course home, long reading, assignment instructions and, if built, captioned video. |
| Starting state | Before each participant: **Reset all settings**, close the toolbar, reload the demo page and set browser zoom to 100%, or the participant's usual zoom if they ask. |
| Devices | One laptop with an external mouse available. Participants can use keyboard, touchpad or mouse, whichever they prefer. Record what they use. |
| Room | Quiet, with space for the moderator and the note-taker. |

**Entry criteria, checked on 4 December:**
- the integrated build from #24 is on `main`
- a pilot session (section 8) has been run
- the ethics question in section 4 is answered

**If Company A's module isn't integrated by then:** run the sessions on Company B's features alone, and record that limitation.

## 6. Tasks

Each task is read to the participant as a **goal**, without naming the control, so we see whether they can find it. The moderator never demonstrates.

Sessions are 10 minutes, so there are **five tasks, each with a time cap**. When the cap is reached, record "Not completed" and move on kindly ("That's really useful, let's try the next one"). The cap is a session limit, not a judgement of the participant.

The "Needs" column lists the features each task depends on. **If a feature isn't built when testing starts, skip the task and record "not tested".** Never test against a mock.

| # | Task as read to the participant | Type | Cap | Success looks like | Needs | Answers |
|---|---|---|---|---|---|---|
| T1 | "You're on a course page. This browser has a tool that can change how pages look. Please open it." | Configuration | 1 min | Toolbar open without help. | Toolbar #14 | Q1 |
| T2 | "This reading page feels busy. Make it easier to focus on the main text." | Reading | 1 min | A preset or the reading mode or stop-motion switch turned on. | #20 or #25, #26 | Q2, Q4, Q7 |
| T3 | "Now make the text more comfortable for you to read." | Configuration | 1.5 min | At least one spacing or line-width setting changed to the participant's preference. | #20 or #28 | Q2, Q4, Q5 |
| T4 | "Open the assignment page. Using the instructions, tell me what you need to submit and by when." | Instruction | 1 min | A correct answer from the synthetic instructions. Note any toolbar features used. | Demo page #23; optionally #32 | Q2, Q8 |
| T5 | "You're finished. Put the page back to how it was at the start." | Configuration | 0.5 min | Reset all, or every feature turned off, so the page looks as it did at the start. | Core #18 | Q6 |

T2 and T3 are presented in a different order for each participant, so they don't always learn the toolbar on the same task. Record the order used.

**Dropped to fit 10 minutes:**
- Reading progress and sections (#30, #31).
- Captions (#35).

If the team wants evidence on either, run it as a separate short session or include it in #41.

**Also not tested here:** the optional AI features (#33), barrier reports (#38, #39) and Company A–only features. The latter are tested by Company A unless agreed otherwise in #24.

## 7. What we record

Use the [session record template](usability-session-record.md).

| Measure | How | Notes |
|---|---|---|
| Task outcome | **Success** / **Success with help** / **Not completed** (including reaching the cap) / **Skipped** | "With help" means the moderator gave any hint. The hints allowed are in the moderator script (8.2). |
| Errors | Count and describe: wrong control, setting changed then undone, lost place, page left in an unexpected state | Describe what happened, not the person. |
| Time on task | Seconds, from reading the task to the participant saying they're done, or the cap | Indicative only. Thinking aloud slows people down. |
| Ease rating | After each task: "From 1 (very hard) to 7 (very easy), how was that?" | Single Ease Question. Report the median and range per task. |
| Observations | What they looked for, where they hesitated, what they said, whether the open toolbar got in their way | |
| End questionnaire | UMUX-Lite, 2 items on a 1–7 scale: "This tool's features meet my needs" and "This tool is easy to use" | Replaces the 10-item System Usability Scale to fit 10 minutes. Indicative only; report it with the number of participants. |
| End interview | Two questions in 8.2 | Answers Q3, Q4 and Q8. Q5 and Q7 come from observation. |

## 8. Session procedure

**10 minutes per session**, with one moderator (UI/UX) and one note-taker. Book **15-minute slots**, leaving 5 minutes to reset between participants. The note-taker should come from Core or Feature Implementation where possible, so each team sees real use.

So that consent doesn't take up half the session, **send the full [consent sheet](usability-consent.md) when booking the slot.** At the session, read only its short key points.

### 8.1 Pilot

On 4 December, run one full 10-minute session with a team member who hasn't worked on the toolbar. Check that the timing holds, and fix confusing task wording and setup problems. **Pilot data is not counted** in the results.

### 8.2 Moderator script

| Step | Time | What happens |
|---|---|---|
| 1. Welcome and consent | 2 min | "Thanks for coming. We're testing the tool, not you. Anything confusing is our problem to fix." Read the **key points** from the consent sheet, ask "Are you happy to continue?", and record yes or no against the participant code. |
| 2. Think aloud | 0.5 min | "As you work, please say what you're looking for. If you go quiet, I may ask what you're thinking." |
| 3. Tasks | 5 min | Read each task, wait, observe. Ask the ease question after each one. Keep to the caps in section 6. |
| 4. Questionnaire | 0.5 min | The two UMUX-Lite items. |
| 5. Interview | 1.5 min | Two questions, below. |
| 6. Close | 0.5 min | Thank them. Remind them they can ask for their notes to be removed, and tell them how. |
| | **10 min** | Then reset the extension and page for the next participant (section 5). |

During the tasks:
- Allowed prompts: "What are you looking for?" "What do you expect that to do?"
- A **hint** (which turns the outcome into "Success with help") is only given after about **30 seconds** stuck, or if the participant asks. Give the smallest hint first ("Try the button at the bottom right"), and record it word for word.

Interview questions:
1. "Did any name or wording feel confusing, or like it wasn't meant for someone like you?"
2. "Would you rather pick a ready-made option or adjust things yourself? Would you use any of this for your own studies?"

No background questions are asked. Nothing about health or disability is asked at any point.

## 9. Analysis

Done by the moderator and note-taker together, within a day of the last session.

1. **Task table:** outcome counts per task, for example "T3: 4 success, 1 with help, 0 not completed", with the median ease rating. Simulation sessions get their own table.
2. **Issue list.** Each distinct problem becomes one row: what happened, how many participants it affected, severity, owner team, related issue, and a suggested change.

| Severity | Meaning |
|---|---|
| Critical | Stops a participant from completing a task, or leaves the page broken or content lost. |
| Serious | Causes long delay, needs a hint, or affects most participants. |
| Minor | Small hesitation or confusion; the participant recovers on their own. |
| Suggestion | A participant's idea, not linked to a failure. |

3. **Defects:** each critical or serious issue becomes a GitHub issue (bug template), labelled with the owner team, with no participant details. Each team fixes its own defects (the #44 comment from kaanyen).
4. **Assumptions:** for each persona assumption and open decision this evaluation touches (P1 preset preference, #12 O4 and O6, #20 P2), record **Supported**, **Not supported** or **Unclear**, with the evidence count.
5. **Changes:** record what the team changed because of the findings and link the PR (AC 2: "changes").

## 10. Roles and schedule

| Date (2026) | Activity | Who |
|---|---|---|
| By 3 Dec | Ethics question answered; recruitment message sent; time slots booked | Chelsea, with the coordinator |
| 4 Dec | Entry criteria checked; pilot session; task wording fixed | Chelsea plus one volunteer team member |
| 5–8 Dec | Participant sessions (8–10, in 15-minute slots) | Moderator: UI/UX. Note-taker: rotating from Core and Feature Implementation |
| 9 Dec | Analysis, issue list, defects filed | Moderator and note-takers |
| 10 Dec | Results report drafted and reviewed (kaanyen) | Chelsea |
| Sprint 5 | Fixes, and the results report feeds the final documentation (#45) and presentation (#47) | All teams |

## 11. Results report (to write after the sessions)

Create `docs/testing/usability-evaluation-results.md` with these sections:

1. Summary
2. Participants: count, study-situation mix, devices used. No identifying details.
3. Simulation sessions, if any, kept separate.
4. Build and setup: commit SHA, Chrome version, the features present.
5. Task results table.
6. Issue list, with severity and owners.
7. Assumptions: supported, not supported, unclear.
8. Changes made, with PR links.
9. Limitations.
10. Tasks skipped, and why.

**Limitations to state in the report no matter how sessions go:**
- small sample
- participants from one university
- demo pages rather than real LMS courses
- one browser
- think-aloud slows people down and changes behaviour
- 10-minute sessions show first impressions, not longer-term use
- any simulated sessions, and any features that weren't ready

## 12. Open questions

| # | Question | Who answers |
|---|---|---|
| E1 | Does Ashesi need ethics review or other approval for this testing? | Course lecturer |
| E2 | Will #24's integrated build be on `main` by 4 December? If not, do we test Company B's features alone? | Core (#24) |
| E3 | Will "Instructions as steps" (#32) be built in time to be used in T4? Do progress (#30, #31) and captions (#35) need their own short sessions? | Team, at Sprint 4 planning |
| E4 | Where is the private folder for raw notes, and who can open it? | UI/UX lead and coordinator |
| E5 | Should Company A observe or co-run sessions for their features? | Company A, via #24 |
