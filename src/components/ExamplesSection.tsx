import React from 'react';
import { EXAMPLE_PRESETS } from '../data/examples';
import { ExamplePreset } from '../types';

interface ExamplesSectionProps {
  onSelectExample: (example: ExamplePreset) => void;
  activeRegexA: string;
  activeRegexB: string;
}

export const ExamplesSection: React.FC<ExamplesSectionProps> = ({
  onSelectExample,
  activeRegexA,
  activeRegexB,
}) => {
  // Use the first 3 or 4 clear examples
  const displayPresets = EXAMPLE_PRESETS.slice(0, 3);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mt-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">Try an Example</h3>
          <p className="text-xs text-gray-500">Click any example to automatically populate Regex A and Regex B</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {displayPresets.map((preset, index) => {
          const isSelected = activeRegexA === preset.regexA && activeRegexB === preset.regexB;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectExample(preset)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-blue-50/60 border-blue-400 ring-1 ring-blue-400 shadow-xs'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50/70 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-900">
                  Example 0{index + 1}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {preset.badge}
                </span>
              </div>

              <div className="space-y-1.5 my-2.5 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-gray-800">
                  <span className="font-semibold text-blue-600 w-4">A:</span>
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 border border-gray-200">
                    {preset.regexA}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-800">
                  <span className="font-semibold text-gray-500 w-4">B:</span>
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 border border-gray-200">
                    {preset.regexB}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                {preset.description}
              </p>

              <div className="mt-3 pt-2 border-t border-gray-100 text-xs font-semibold text-blue-600 flex items-center justify-between">
                <span>{isSelected ? 'Loaded' : 'Load Example'}</span>
                <span>→</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
