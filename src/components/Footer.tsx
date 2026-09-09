import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200 mt-16 py-8">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-gray-700">
          String Difference Evaluator
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PBL Project • Automata Theory
        </p>
      </div>
    </footer>
  );
};
