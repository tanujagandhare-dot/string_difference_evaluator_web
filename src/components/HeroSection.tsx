import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50/70 via-white to-gray-50 border-b border-gray-200/80 py-10 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Academic Course Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100/70 text-blue-800 text-xs font-semibold mb-4 border border-blue-200">
          <span>Problem Based Learning</span>
          <span>•</span>
          <span>Automata Theory &amp; Formal Languages</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          String Difference Evaluator
        </h2>

        {/* Subtitle */}
        <p className="mt-2.5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-normal">
          Find a string accepted by Regex A but rejected by Regex B.
        </p>

        {/* Mathematical concept highlight box */}
        <div className="mt-5 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white border border-blue-200 px-5 py-2.5 rounded-lg shadow-xs">
          <span className="font-mono font-bold text-lg text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/60">
            L(A) − L(B)
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="text-sm text-gray-600 font-medium">
            Find a distinguishing string that belongs to the language of Regex A but not to Regex B.
          </span>
        </div>
      </div>
    </section>
  );
};
