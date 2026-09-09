import { EvaluationResult, SearchConfig, VerificationResult } from '../types';

/**
 * Normalizes regular expression input for Automata Theory:
 * - Replaces automata empty-string symbols (ε, λ) with empty non-capturing group (?:)
 * - Trims whitespace
 */
export function normalizeRegex(pattern: string): string {
  if (!pattern) return '';
  return pattern
    .trim()
    .replace(/[ελ]/g, '(?:)')
    .replace(/\\e\b/g, '(?:)')
    .replace(/\\eps\b/g, '(?:)');
}

/**
 * Validates whether a regex is syntactically valid in JavaScript.
 * Returns an error message if invalid, or null if valid.
 */
export function validateRegexSyntax(rawPattern: string): string | null {
  const normalized = normalizeRegex(rawPattern);
  if (!normalized) {
    return 'Regex cannot be empty';
  }
  try {
    new RegExp(normalized);
    return null;
  } catch (err) {
    if (err instanceof Error) {
      return err.message.replace(/^Invalid regular expression:\s*/i, '');
    }
    return 'Invalid regular expression syntax';
  }
}

/**
 * Creates an anchored RegExp enforcing complete string acceptance w ∈ L(R).
 */
export function createAnchoredRegex(rawPattern: string): RegExp {
  const normalized = normalizeRegex(rawPattern);
  return new RegExp(`^(?:${normalized})$`);
}

/**
 * Extracts the alphabet Σ from two regular expressions.
 * Scans for literal characters, character sets, and common digits/letters.
 */
export function extractAlphabet(rawA: string, rawB: string): string[] {
  const combined = `${rawA} ${rawB}`;
  const charSet = new Set<string>();

  // Extract character classes like [0-9], [a-z], [abc]
  const classMatches = combined.match(/\[([^\]]+)\]/g);
  if (classMatches) {
    for (const cls of classMatches) {
      const inner = cls.slice(1, -1);
      // Check for ranges like a-z, 0-9
      const rangeMatches = inner.matchAll(/([a-zA-Z0-9])-([a-zA-Z0-9])/g);
      let hasRange = false;
      for (const match of rangeMatches) {
        hasRange = true;
        const start = match[1].charCodeAt(0);
        const end = match[2].charCodeAt(0);
        const step = start <= end ? 1 : -1;
        const count = Math.min(Math.abs(end - start) + 1, 10); // cap range samples
        for (let i = 0; i < count; i++) {
          charSet.add(String.fromCharCode(start + i * step));
        }
      }
      if (!hasRange) {
        // Single characters inside class
        for (const ch of inner) {
          if (!'\\-^'.includes(ch)) {
            charSet.add(ch);
          }
        }
      }
    }
  }

  // Check for common shorthand classes
  if (/\\d/.test(combined)) {
    charSet.add('0');
    charSet.add('1');
  }
  if (/\\w/.test(combined)) {
    charSet.add('a');
    charSet.add('b');
    charSet.add('0');
  }

  // Remove regex operators, brackets, qualifiers, and extract literal symbols
  const cleaned = combined
    .replace(/\[[^\]]*\]/g, '') // remove classes already processed
    .replace(/\\[dswDSW]/g, '') // remove shorthands
    .replace(/\\(.)/g, '$1'); // unescape literal escapes

  // Standard regex metacharacters to exclude
  const metaChars = new Set(['(', ')', '{', '}', '*', '+', '?', '|', '^', '$', '.', '\\', ' ', '\t', '\n', '\r']);

  for (const char of cleaned) {
    if (!metaChars.has(char) && char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
      charSet.add(char);
    }
  }

  // If no literal symbols found (e.g. wildcards or empty), provide common defaults
  if (charSet.size === 0) {
    if (combined.includes('0') || combined.includes('1')) {
      charSet.add('0');
      charSet.add('1');
    } else {
      charSet.add('a');
      charSet.add('b');
    }
  }

  // Sort alphabet for deterministic Shortlex generation
  return Array.from(charSet).sort();
}

/**
 * Generates sample path candidate strings directly from the structure of Regex A.
 * This guarantees quick discovery of patterns matching A.
 */
function generateStructuralSamplesFromA(regexA: string): string[] {
  const samples = new Set<string>();
  const normalized = normalizeRegex(regexA);

  // Basic structural heuristics:
  // 1. Remove Kleene stars completely (0 repeats)
  const noStars = normalized.replace(/\(([^()]+)\)\*/g, '').replace(/([a-zA-Z0-9])\*/g, '');
  // 2. Convert plus to single instance
  const onePlus = normalized.replace(/\+/g, '');
  // 3. Choice branches
  const simplifyChoices = (str: string): string[] => {
    const branchMatch = str.match(/\(([^()|]+(?:\|[^()|]+)+)\)/);
    if (!branchMatch) return [str];
    const fullGroup = branchMatch[0];
    const options = branchMatch[1].split('|');
    const results: string[] = [];
    for (const opt of options) {
      results.push(str.replace(fullGroup, opt));
    }
    return results;
  };

  const cleanChars = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '');

  const baseStrings = [noStars, onePlus, normalized];
  for (const b of baseStrings) {
    const expansions = simplifyChoices(b);
    for (const exp of expansions) {
      const cleaned = cleanChars(exp);
      if (cleaned.length <= 12) {
        samples.add(cleaned);
      }
    }
  }

  return Array.from(samples);
}

/**
 * Core PBL Evaluator:
 * Finds a string w such that w ∈ L(A) and w ∉ L(B).
 */
export function evaluateStringDifference(
  rawA: string,
  rawB: string,
  config: SearchConfig = {
    maxStringLength: 7,
    maxCandidates: 6000,
    includeEmptyString: true,
  }
): EvaluationResult {
  const startTime = performance.now();

  // Validate syntax first
  const errorA = validateRegexSyntax(rawA);
  if (errorA) {
    return {
      status: 'error',
      sampleString: null,
      acceptedByA: false,
      rejectedByB: false,
      regexA: rawA,
      regexB: rawB,
      explanation: `Syntax error in Regex A: ${errorA}`,
      errorMessage: `Regex A: ${errorA}`,
      alphabet: [],
      candidatesChecked: 0,
      timeMs: 0,
      searchLimit: config.maxCandidates,
    };
  }

  const errorB = validateRegexSyntax(rawB);
  if (errorB) {
    return {
      status: 'error',
      sampleString: null,
      acceptedByA: false,
      rejectedByB: false,
      regexA: rawA,
      regexB: rawB,
      explanation: `Syntax error in Regex B: ${errorB}`,
      errorMessage: `Regex B: ${errorB}`,
      alphabet: [],
      candidatesChecked: 0,
      timeMs: 0,
      searchLimit: config.maxCandidates,
    };
  }

  let testA: RegExp;
  let testB: RegExp;

  try {
    testA = createAnchoredRegex(rawA);
    testB = createAnchoredRegex(rawB);
  } catch (err) {
    return {
      status: 'error',
      sampleString: null,
      acceptedByA: false,
      rejectedByB: false,
      regexA: rawA,
      regexB: rawB,
      explanation: 'Could not compile regular expressions.',
      errorMessage: err instanceof Error ? err.message : 'Unknown regex compilation error',
      alphabet: [],
      candidatesChecked: 0,
      timeMs: 0,
      searchLimit: config.maxCandidates,
    };
  }

  const alphabet = extractAlphabet(rawA, rawB);
  let candidatesChecked = 0;
  const maxCandidates = config.maxCandidates;
  const maxLength = config.maxStringLength;

  const testedSet = new Set<string>();

  // Check function
  const checkCandidate = (w: string): boolean => {
    if (testedSet.has(w)) return false;
    testedSet.add(w);
    candidatesChecked++;

    let inA = false;
    let inB = false;

    try {
      inA = testA.test(w);
      inB = testB.test(w);
    } catch {
      // Safeguard against extreme regex edge cases
      return false;
    }

    if (inA && !inB) {
      return true;
    }
    return false;
  };

  // 1. Check empty string ε if enabled
  if (config.includeEmptyString) {
    if (checkCandidate('')) {
      const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        status: 'found',
        sampleString: '',
        isEmptyString: true,
        acceptedByA: true,
        rejectedByB: true,
        regexA: rawA,
        regexB: rawB,
        explanation: 'The empty string (ε) belongs to the language of Regex A, but it is not accepted by Regex B.',
        alphabet,
        candidatesChecked,
        timeMs: elapsed,
        searchLimit: maxCandidates,
      };
    }
  }

  // 2. Check structural sample strings derived from Regex A
  const structuralSamples = generateStructuralSamplesFromA(rawA);
  for (const sample of structuralSamples) {
    if (sample.length <= maxLength && checkCandidate(sample)) {
      const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
      return {
        status: 'found',
        sampleString: sample,
        isEmptyString: false,
        acceptedByA: true,
        rejectedByB: true,
        regexA: rawA,
        regexB: rawB,
        explanation: 'The generated string belongs to the language of Regex A, but it is not accepted by Regex B.',
        alphabet,
        candidatesChecked,
        timeMs: elapsed,
        searchLimit: maxCandidates,
      };
    }
  }

  // 3. Shortlex Breadth-First Search (BFS) over Alphabet Σ
  // Level by level: Length 1, 2, 3, ... up to maxLength
  let currentQueue: string[] = [''];

  for (let length = 1; length <= maxLength; length++) {
    const nextQueue: string[] = [];

    for (const prefix of currentQueue) {
      for (const char of alphabet) {
        const candidate = prefix + char;
        nextQueue.push(candidate);

        if (checkCandidate(candidate)) {
          const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
          return {
            status: 'found',
            sampleString: candidate,
            isEmptyString: false,
            acceptedByA: true,
            rejectedByB: true,
            regexA: rawA,
            regexB: rawB,
            explanation: 'The generated string belongs to the language of Regex A, but it is not accepted by Regex B.',
            alphabet,
            candidatesChecked,
            timeMs: elapsed,
            searchLimit: maxCandidates,
          };
        }

        if (candidatesChecked >= maxCandidates) {
          break;
        }
      }
      if (candidatesChecked >= maxCandidates) {
        break;
      }
    }

    currentQueue = nextQueue;
    if (candidatesChecked >= maxCandidates) {
      break;
    }
  }

  const elapsed = Math.round((performance.now() - startTime) * 100) / 100;

  // If no string found
  return {
    status: 'not_found',
    sampleString: null,
    acceptedByA: false,
    rejectedByB: false,
    regexA: rawA,
    regexB: rawB,
    explanation: 'No distinguishing string found within the current search limit.',
    alphabet,
    candidatesChecked,
    timeMs: elapsed,
    searchLimit: maxCandidates,
  };
}

/**
 * Real-time verification of any user-entered string against Regex A and Regex B.
 */
export function verifyCustomString(
  testString: string,
  rawA: string,
  rawB: string
): VerificationResult | null {
  if (!rawA || !rawB) return null;
  if (validateRegexSyntax(rawA) || validateRegexSyntax(rawB)) return null;

  try {
    const testA = createAnchoredRegex(rawA);
    const testB = createAnchoredRegex(rawB);

    const inA = testA.test(testString);
    const inB = testB.test(testString);

    return {
      testedString: testString,
      inA,
      inB,
      isDistinguishing: inA && !inB,
    };
  } catch {
    return null;
  }
}
