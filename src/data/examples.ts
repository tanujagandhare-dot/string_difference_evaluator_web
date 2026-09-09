import { ExamplePreset } from '../types';

export const EXAMPLE_PRESETS: ExamplePreset[] = [
  {
    id: 'example-1',
    title: 'Choice vs Single Repeat',
    regexA: 'a(b|c)*',
    regexB: 'ab*',
    description: "Strings starting with 'a' with choices of 'b' or 'c', vs only 'b's.",
    expectedOutcome: 'Distinguishing string: "ac"',
    badge: 'Classic Automata',
  },
  {
    id: 'example-2',
    title: 'Binary Suffix Check',
    regexA: '(0|1)*1',
    regexB: '(0|1)*0',
    description: 'Binary strings ending in 1 versus binary strings ending in 0.',
    expectedOutcome: 'Distinguishing string: "1"',
    badge: 'Binary Language',
  },
  {
    id: 'example-3',
    title: 'Required Symbol (a+b+ vs a*)',
    regexA: 'a+b+',
    regexB: 'a*',
    description: 'At least one "a" followed by at least one "b" versus only "a"s.',
    expectedOutcome: 'Distinguishing string: "ab"',
    badge: 'Repetition Operator',
  },
  {
    id: 'example-4',
    title: 'Subset Case: L(A) ⊆ L(B)',
    regexA: '(a|b)*abb',
    regexB: '(a|b)*b',
    description: "Any string ending with 'abb' also ends with 'b', so L(A) ⊆ L(B).",
    expectedOutcome: 'No distinguishing string exists',
    badge: 'Theoretical Limit',
  },
  {
    id: 'example-5',
    title: 'Empty String (ε) Difference',
    regexA: '(a|ε)',
    regexB: 'a+',
    description: 'Regex A accepts the empty string ε or "a", while Regex B requires at least one "a".',
    expectedOutcome: 'Distinguishing string: ε',
    badge: 'Epsilon Transition',
  },
];
