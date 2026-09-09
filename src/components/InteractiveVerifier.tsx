import React, { useState } from 'react';
import { CheckCircle2, XCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { verifyCustomString } from '../utils/regexEngine';

interface InteractiveVerifierProps {
  regexA: string;
  regexB: string;
}

export const InteractiveVerifier: React.FC<InteractiveVerifierProps> = ({
  regexA,
  regexB,
}) => {
  const [testString, setTestString] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const verification = testString !== null
    ? verifyCustomString(testString, regexA, regexB)
    : null;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mt-8">
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                <span>Interactive String Inspector</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  Optional Tool
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Test any custom string against L(A) and L(B) in real time
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold text-blue-600 flex items-center gap-1">
            <span>{isExpanded ? 'Hide' : 'Open'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Type any test word (e.g. ac, abac, ab, a)..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                />
                {testString && (
                  <button
                    type="button"
                    onClick={() => setTestString('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 px-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setTestString('')}
                className="px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-mono border border-gray-200 transition-colors"
                title="Test empty string ε"
              >
                ε (Empty)
              </button>
            </div>

            {/* Live Verification Results */}
            {verification ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Check A */}
                <div
                  className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                    verification.inA
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50/80 border-rose-200 text-rose-800'
                  }`}
                >
                  {verification.inA ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <div className="text-xs">
                    <span className="font-semibold block">Accepted by Regex A?</span>
                    <span className="font-medium text-[11px]">
                      {verification.inA ? 'Yes (∈ L(A))' : 'No (∉ L(A))'}
                    </span>
                  </div>
                </div>

                {/* Check B */}
                <div
                  className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                    verification.inB
                      ? 'bg-rose-50/80 border-rose-200 text-rose-800'
                      : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                  }`}
                >
                  {verification.inB ? (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <div className="text-xs">
                    <span className="font-semibold block">Rejected by Regex B?</span>
                    <span className="font-medium text-[11px]">
                      {verification.inB ? 'No (Accepted by B)' : 'Yes (Rejected by B)'}
                    </span>
                  </div>
                </div>

                {/* Final Difference Verdict */}
                <div
                  className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                    verification.isDistinguishing
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="text-xs">
                    <span className="font-semibold block">In L(A) − L(B)?</span>
                    <span className="font-bold text-[11px]">
                      {verification.isDistinguishing ? '✓ Valid Difference String' : '✗ Not in Difference'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-center text-xs text-gray-400 italic">
                Enter valid patterns for Regex A and Regex B to test words.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
