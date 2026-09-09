import React, { useRef } from 'react';
import { ArrowRight, RotateCcw, ArrowLeftRight, CheckCircle, AlertCircle } from 'lucide-react';
import { validateRegexSyntax } from '../utils/regexEngine';

interface RegexInputsProps {
  regexA: string;
  regexB: string;
  onChangeA: (val: string) => void;
  onChangeB: (val: string) => void;
  onEvaluate: () => void;
  onSwap: () => void;
  onReset: () => void;
  isSearching: boolean;
}

const QUICK_SYMBOLS = ['(', ')', '|', '*', '+', '?', 'ε', '[a-z]', '[0-9]'];

export const RegexInputs: React.FC<RegexInputsProps> = ({
  regexA,
  regexB,
  onChangeA,
  onChangeB,
  onEvaluate,
  onSwap,
  onReset,
  isSearching,
}) => {
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);

  const errorA = regexA ? validateRegexSyntax(regexA) : null;
  const errorB = regexB ? validateRegexSyntax(regexB) : null;

  const hasValidInputs = regexA.trim().length > 0 && regexB.trim().length > 0 && !errorA && !errorB;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching && hasValidInputs) {
      e.preventDefault();
      onEvaluate();
    }
  };

  const insertSymbol = (symbol: string, target: 'A' | 'B') => {
    const inputRef = target === 'A' ? inputARef.current : inputBRef.current;
    const currentVal = target === 'A' ? regexA : regexB;
    const setter = target === 'A' ? onChangeA : onChangeB;

    if (!inputRef) {
      setter(currentVal + symbol);
      return;
    }

    const start = inputRef.selectionStart ?? currentVal.length;
    const end = inputRef.selectionEnd ?? currentVal.length;
    const nextVal = currentVal.substring(0, start) + symbol + currentVal.substring(end);
    setter(nextVal);

    setTimeout(() => {
      inputRef.focus();
      inputRef.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 10);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mt-8">
      {/* Two clean input cards side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LEFT PANEL: Regex A (Must Accept) */}
        <div
          id="card-regex-a"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-blue-900">Regex A</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Must Accept
                </span>
              </div>

              {/* Status Indicator */}
              {regexA.trim().length > 0 && (
                errorA ? (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Syntax Error
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Valid
                  </span>
                )
              )}
            </div>

            <label htmlFor="regex-a-input" className="block text-xs text-gray-500 font-medium mb-1.5">
              Enter regular expression for language L(A):
            </label>

            <div className="relative">
              <input
                id="regex-a-input"
                ref={inputARef}
                type="text"
                value={regexA}
                onChange={(e) => onChangeA(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="a(b|c)*"
                spellCheck={false}
                autoComplete="off"
                className={`w-full px-3.5 py-2.5 rounded-lg bg-white border text-gray-900 font-mono text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errorA
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                    : 'border-gray-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {regexA && (
                <button
                  type="button"
                  onClick={() => onChangeA('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1 py-0.5"
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>

            {errorA ? (
              <p className="mt-1.5 text-xs text-rose-600 flex items-start gap-1">
                <span>•</span>
                <span>{errorA}</span>
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-gray-500">
                Example: <span className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">a(b|c)*</span>
              </p>
            )}
          </div>

          {/* Clean Quick Symbols */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Symbols</span>
            <div className="flex flex-wrap gap-1">
              {QUICK_SYMBOLS.slice(0, 6).map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => insertSymbol(sym, 'A')}
                  className="px-2 py-0.5 rounded bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-mono border border-gray-200 transition-colors"
                  title={`Insert ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Regex B (Must Reject) */}
        <div
          id="card-regex-b"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-blue-900">Regex B</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  Must Reject
                </span>
              </div>

              {/* Status Indicator */}
              {regexB.trim().length > 0 && (
                errorB ? (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> Syntax Error
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Valid
                  </span>
                )
              )}
            </div>

            <label htmlFor="regex-b-input" className="block text-xs text-gray-500 font-medium mb-1.5">
              Enter regular expression for language L(B):
            </label>

            <div className="relative">
              <input
                id="regex-b-input"
                ref={inputBRef}
                type="text"
                value={regexB}
                onChange={(e) => onChangeB(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ab*"
                spellCheck={false}
                autoComplete="off"
                className={`w-full px-3.5 py-2.5 rounded-lg bg-white border text-gray-900 font-mono text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errorB
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                    : 'border-gray-300 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {regexB && (
                <button
                  type="button"
                  onClick={() => onChangeB('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1 py-0.5"
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>

            {errorB ? (
              <p className="mt-1.5 text-xs text-rose-600 flex items-start gap-1">
                <span>•</span>
                <span>{errorB}</span>
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-gray-500">
                Example: <span className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">ab*</span>
              </p>
            )}
          </div>

          {/* Clean Quick Symbols */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Symbols</span>
            <div className="flex flex-wrap gap-1">
              {QUICK_SYMBOLS.slice(0, 6).map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => insertSymbol(sym, 'B')}
                  className="px-2 py-0.5 rounded bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-mono border border-gray-200 transition-colors"
                  title={`Insert ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Button Row: Professional blue primary button and secondary buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Primary Button */}
        <button
          id="btn-find-difference"
          type="button"
          onClick={onEvaluate}
          disabled={isSearching || !hasValidInputs}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-xs ${
            !hasValidInputs
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800'
          }`}
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <span>Find Difference String</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Secondary: Swap */}
        <button
          id="btn-swap-regex"
          type="button"
          onClick={onSwap}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors shadow-xs"
          title="Swap Regex A and Regex B"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-gray-500" />
          <span>Swap A ⇄ B</span>
        </button>

        {/* Secondary: Reset */}
        <button
          id="btn-reset-inputs"
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-colors shadow-xs"
          title="Reset to default examples"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );
};
