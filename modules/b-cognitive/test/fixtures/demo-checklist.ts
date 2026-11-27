/**
 * HAND-MADE ESSENTIAL-CONTENT CHECKLIST for the demo reading page (demo-site/index.html).
 * This is the "ground truth" that AC-E4.1 asks for: "measure against a hand-made checklist
 * for each page; target 100% of essential items".
 *
 * Written by reading the page, NOT by running the extractor, so the test can actually fail.
 * It has not been reviewed by the team yet. When #23 expands the demo site, add one
 * checklist per new reading page.
 */

export interface EssentialItem {
  /** What kind of element the author wrote. */
  kind: 'heading' | 'paragraph' | 'list-item';
  /** Heading level, for headings. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Text that must appear (whitespace-normalised). For paragraphs: enough of the start to identify it. */
  text: string;
}

/** In the order the author wrote them. The test also checks this order is preserved. */
export const ESSENTIAL_ITEMS: EssentialItem[] = [
  { kind: 'heading', level: 1, text: 'Week 3: Asking a good research question' },
  { kind: 'paragraph', text: 'A research question tells your reader what you want to find out' },
  { kind: 'paragraph', text: 'Start from a topic you care about, then ask who is affected' },
  { kind: 'heading', level: 2, text: 'Three checks before you commit' },
  { kind: 'list-item', text: 'Can you name the data you would need' },
  { kind: 'list-item', text: 'Would a reasonable person disagree about the answer' },
  { kind: 'list-item', text: 'Does the question avoid assuming its own answer?' },
  { kind: 'paragraph', text: 'When a question fails one of these checks, revise it' },
  { kind: 'heading', level: 2, text: 'Your task this week' },
  { kind: 'paragraph', text: 'Draft two possible research questions for your project' },
];

/** Page furniture that reading mode must LEAVE OUT (AC-E4.2): header bar and course menu. */
export const SHOULD_BE_ABSENT: string[] = [
  'Demo LMS',
  'Courses',
  'Calendar',
  'Course home',
  'Assignment 1',
  'Discussion',
];

/** The page's notes text box and its caption. Interactive, so it stays in the original page only. */
export const INTERACTIVE_ONLY_IN_ORIGINAL: string[] = ['Your notes'];
