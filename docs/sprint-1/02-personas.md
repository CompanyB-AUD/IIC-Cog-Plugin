# 2. Personas

The brief requires at least three personas: a student with a disability, a student without an identified disability, and a teaching or support stakeholder. We have five. Two of them have cognitive needs but **different** needs, which supports the ethical-design requirement that we don't assume everyone in a disability group needs the same things.

All personas are fictional composites. Statements marked *Assumption* are hypotheses we will check with real Ashesi students and staff before Sprint 4. They are not research findings.

| | Persona | Type required by the brief | Main epics |
|---|---|---|---|
| P1 | Abena: struggles to stay focused on cluttered pages | Student with a disability or difference | E4 Focus, E5 Reading support |
| P2 | Yaw: dyslexic, reads slowly | Student with a disability | E5 Reading support, E4 Focus |
| P3 | Kwesi: hard of hearing | Student with a disability | E6 Captions and alerts |
| P4 | Mariam: no identified disability, reads in a second language | Student without an identified disability | E5, E6, E7 |
| P5 | Dr. Adjoa Mensah: lecturer | Teaching stakeholder | E7 Barrier report |

---

## P1 · Abena Owusu

> "I read the same paragraph three times because something on the side keeps moving."

| | |
|---|---|
| **Age / year** | 20, second-year Computer Science |
| **Context** | Studies in the library and in her hostel room on a mid-range laptop. Often has 10+ tabs open. Has never been formally assessed. She would not call herself disabled and wouldn't use a tool labelled as being for disabled students. |
| **Technology** | Chrome, LMS, PDFs in the browser, YouTube for revision. Comfortable with technology. |
| **Goals** | Get through weekly readings without losing focus; know how long a reading will take before she starts. |
| **Barriers** | B-C1 clutter, B-C3 long unstructured pages, B-C5 losing her place |
| **Frustrations** | Banners, carousels and "related content" panels; not knowing how much is left; starting again after an interruption |
| **What would help** | One-click focus mode, a reading-time estimate, a progress bar, sections she can tick off as done |
| **Must not** | Single her out, or add more buttons to an already busy screen |
| **Assumption** | Students like Abena would prefer a named preset ("Focus") over adjusting individual settings. |

## P2 · Yaw Boateng

> "I understand it fine. It just takes me twice as long, and the lines blur together."

| | |
|---|---|
| **Age / year** | 22, third-year Business Administration |
| **Context** | Diagnosed with dyslexia in secondary school. Registered with student support for extra exam time, but doesn't want classmates to know. Reads on a laptop and sometimes on his phone. |
| **Technology** | Chrome; sometimes uses text-to-speech on his phone. Has tried "dyslexia fonts" but found the difference small. |
| **Goals** | Read assignment briefs accurately the first time; get through long case studies without fatigue. |
| **Barriers** | B-C2 dense text, B-C4 complex instructions |
| **Frustrations** | Tight line spacing, justified text, long lines, multi-step instructions in a single paragraph |
| **What would help** | Wider letter, word and line spacing; shorter line length; a reading ruler or line highlight; instructions split into numbered steps |
| **Note** | Yaw's needs overlap with Abena's (reading support) but differ in the details. He doesn't need clutter removal as much as typographic control. That is why spacing and focus are separate controls, not one "cognitive mode". |
| **Cross-module note** | Text-to-speech belongs to Company A. Yaw uses features from **both** modules, which is the Universal Design case for one shared toolbar. |

## P3 · Kwesi Asante

> "If the lecturer posts the video with captions, I'm fine. When they don't, I wait for a friend's notes."

| | |
|---|---|
| **Age / year** | 21, second-year Engineering |
| **Context** | Hard of hearing since childhood; wears hearing aids. Lip-reads in person and doesn't use sign language day to day. Watches recorded lectures at home, where the connection is sometimes unreliable. |
| **Technology** | Chrome, laptop, mobile data hotspot. Uses auto-captions on YouTube but finds they struggle with Ghanaian accents and technical terms. |
| **Goals** | Follow recorded lectures fully; review a specific explanation without scrubbing through the video. |
| **Barriers** | B-H1 hard-to-read captions, B-H2 no transcript, B-H3 no captions at all, B-H4 audio-only alerts |
| **Frustrations** | Small white captions over white slides; having to rewind to find something the lecturer said; missing the quiz "time almost up" sound |
| **What would help** | Larger, repositionable captions with a background; a searchable transcript where clicking a line jumps to that point; a visible alert when the page plays a sound |
| **Assumption** | Kwesi values a searchable transcript as much as live captions, because he reviews more than he watches live. |
| **Limitation we must be honest about** | Where the lecturer uploaded no captions, the MVP can only *tell* Kwesi (and the lecturer) that captions are missing. It cannot create them. |

## P4 · Mariam Diallo

> "My English is good, but academic English at 11 pm is a different language."

| | |
|---|---|
| **Age / year** | 19, first-year Economics; international student from a French-speaking country |
| **Context** | No identified disability. Reads in her second language. Sometimes watches lectures in a shared room with no headphones. |
| **Technology** | Chrome on a laptop; uses a translation tool now and then. |
| **Goals** | Understand dense readings and instructions quickly; follow videos without sound when she has to. |
| **Barriers** | B-C4 complex wording, B-H1/B-H2 (situational: no sound available) |
| **What would help** | Simplified explanations of difficult passages with the original kept alongside; captions and transcripts; comfortable reading spacing |
| **Why she matters** | She shows that the features are useful **without a diagnosis** (the brief's cross-ability criterion). If the toolbar asks "What is your disability?", Mariam never opens it. |

## P5 · Dr. Adjoa Mensah

> "I want my materials to work for everyone. I just don't know what I'm getting wrong."

| | |
|---|---|
| **Role** | Senior lecturer, teaches two large first-year courses |
| **Context** | Uploads slides, readings and recorded lectures to the LMS every week. Records lectures on a laptop; doesn't always have time to add captions. No accessibility training beyond a short orientation. |
| **Goals** | Know which of her materials cause problems, and what to fix first, without becoming an accessibility expert. |
| **Barriers she causes without meaning to** | B-H3 uncaptioned videos, B-C3 unstructured documents, B-C4 dense instructions |
| **What would help** | A short, plain-language report on a page: "2 videos have no captions; this page has no headings; these instructions are long. Here is how to fix each." |
| **Must not** | Shame or overwhelm her; produce dozens of technical warnings |
| **Assumption** | Lecturers would use a one-click page check if it gives three to five clear, ranked actions instead of a full audit. |

---

## What the personas tell us about design

1. **Name features by what they do, not by who they're for.** None of P1, P2 or P4 wants to choose a "disability" setting.
2. **Presets first, fine-tuning second.** P1 wants one click; P2 wants detailed control. We need both.
3. **Show the original alongside any changes.** For simplification (P2, P4) and captions (P3), users must be able to check against the source.
4. **The two modules overlap.** P2 needs Company B's spacing and Company A's text-to-speech together. One toolbar and one preferences store is a real user need, not just an engineering choice.
5. **Report limitations, don't hide them.** P3 and P5 both benefit when the plugin says plainly what it cannot fix.
