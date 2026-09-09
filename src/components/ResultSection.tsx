import React, { useState } from 'react';
import { Check, Copy, CheckCircle, X, AlertCircle } from 'lucide-react';
import { EvaluationResult } from '../types';

interface ResultSectionProps {
  result: EvaluationResult | null;
  onInspectString?: (str: string) => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ result, onInspectString }) => {
  const [copied, setCopied] = useState(false);

  if (!result || result.status === 'idle') {
    return null;
  }

  const handleCopy = () => {
    if (result.sampleString !== null) {
      navigator.clipboard.writeText(result.sampleString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ERROR STATE
  if (result.status === 'error') {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-900">
          <div className="flex items-center gap-2 mb-1 text-sm font-bold text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Regular Expression Error</span>
          </div>
          <p className="text-sm font-mono text-rose-700">{result.errorMessage || result.explanation}</p>
          <p className="text-xs text-rose-600 mt-2">
            Please check the syntax of your regular expression (e.g. mismatched parentheses or misplaced operators).
          </p>
        </div>
      </section>
    );
  }

  // NOT FOUND STATE
  if (result.status === 'not_found') {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white border border-amber-200 rounded-xl p-6 text-center shadow-xs">
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
            NO DIFFERENCE FOUND
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No distinguishing string found within the current search limit.
          </h3>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Every candidate evaluated either failed <span className="font-mono font-semibold text-blue-700">Regex A</span> or was also accepted by <span className="font-mono font-semibold text-blue-700">Regex B</span>.
          </p>
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 max-w-md mx-auto text-left font-mono">
            <span className="font-sans font-semibold text-gray-700 block mb-1">Theoretical note:</span>
            • This usually implies that <strong className="text-gray-900">L(A) ⊆ L(B)</strong> (Language A is a subset of Language B).
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-4 text-xs font-mono text-gray-500">
            <span>Candidates tested: <strong className="text-gray-700">{result.candidatesChecked}</strong></span>
            <span>•</span>
            <span>Time: <strong className="text-gray-700">{result.timeMs} ms</strong></span>
            <span>•</span>
            <span>Σ: <strong className="text-gray-700">&#123;{result.alphabet.join(', ')}&#125;</strong></span>
          </div>
        </div>
      </section>
    );
  }

  // RESULT FOUND (Success)
  return (
    <section className="w-full max-w-4xl mx-auto px-4 mt-8">
      <div className="bg-white border border-blue-200 rounded-xl p-6 sm:p-7 shadow-xs">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              RESULT FOUND
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
            <span>Tested: <strong className="text-gray-800">{result.candidatesChecked}</strong></span>
            <span>•</span>
            <span>Time: <strong className="text-gray-800">{result.timeMs} ms</strong></span>
          </div>
        </div>

        {/* Highlight Difference String */}
        <div className="text-center my-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Difference String
          </span>

          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-gray-50 border border-gray-300">
              {result.isEmptyString ? (
                <span className="font-mono text-2xl sm:text-3xl font-bold text-blue-700 flex items-center gap-2">
                  <span>ε</span>
                  <span className="text-xs font-normal text-gray-500 font-sans">(Empty String)</span>
                </span>
              ) : (
                <span className="font-mono text-2xl sm:text-3xl font-bold text-blue-800 tracking-wider">
                  {result.sampleString}
                </span>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-400 font-mono mt-1.5">
            Length |w| = {result.sampleString?.length ?? 0}
          </div>
        </div>

        {/* Two Status Boxes: Accepted / Rejected */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Regex A Status */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Regex A</div>
              <div className="font-mono text-sm text-gray-900 font-semibold mb-2">
                &ldquo;{result.regexA}&rdquo;
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300/60">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>✓ Accepted</span>
              </div>
            </div>
          </div>

          {/* Regex B Status */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-4 flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">Regex B</div>
              <div className="font-mono text-sm text-gray-900 font-semibold mb-2">
                &ldquo;{result.regexB}&rdquo;
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-300/60">
                <X className="w-3.5 h-3.5 text-rose-700" />
                <span>✕ Rejected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Simple Explanation */}
        <div className="mt-5 p-3.5 bg-blue-50/60 border border-blue-100 rounded-lg text-center">
          <p className="text-sm font-medium text-blue-900">
            &ldquo;This string is accepted by Regex A but rejected by Regex B.&rdquo;
          </p>
        </div>

        {/* Footer info strip */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 font-mono">
          <div>
            Alphabet Σ: <span className="font-semibold text-gray-700">&#123;{result.alphabet.join(', ')}&#125;</span>
          </div>
          {onInspectString && (
            <button
              type="button"
              onClick={() => onInspectString(result.sampleString ?? '')}
              className="text-blue-600 hover:text-blue-800 hover:underline font-sans"
            >
              Test in String Inspector ↓
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
