export interface EvaluationResult {
  status: 'idle' | 'searching' | 'found' | 'not_found' | 'error';
  sampleString: string | null;
  isEmptyString?: boolean;
  acceptedByA: boolean;
  rejectedByB: boolean;
  regexA: string;
  regexB: string;
  explanation: string;
  errorMessage?: string;
  alphabet: string[];
  candidatesChecked: number;
  timeMs: number;
  searchLimit: number;
}

export interface ExamplePreset {
  id: string;
  title: string;
  regexA: string;
  regexB: string;
  description: string;
  expectedOutcome: string;
  badge: string;
}

export interface SearchConfig {
  maxStringLength: number;
  maxCandidates: number;
  includeEmptyString: boolean;
}

export interface VerificationResult {
  testedString: string;
  inA: boolean;
  inB: boolean;
  isDistinguishing: boolean;
}
