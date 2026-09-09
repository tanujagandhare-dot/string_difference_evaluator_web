import React from 'react';
import { GitCommit, GraduationCap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
            {/* Simple blue automata state logo */}
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="12" r="3" />
              <circle cx="18" cy="12" r="1.5" />
              <path d="M9 12h6" />
              <path d="M12 9.5l2.5 2.5-2.5 2.5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                String Difference Evaluator
              </h1>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Regular Expression Language Difference
            </p>
          </div>
        </div>

        {/* Minimal academic badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Automata Theory PBL</span>
        </div>
      </div>
    </header>
  );
};
