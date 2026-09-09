import React from 'react';
import { Edit3, Cpu, CheckSquare } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Enter Regular Expressions',
      description: 'Define Regex A (the target language to satisfy) and Regex B (the rejection criterion).',
      icon: Edit3,
    },
    {
      number: '02',
      title: 'Generate Candidate Strings',
      description: 'The engine extracts the alphabet Σ and enumerates words systematically using Shortlex BFS.',
      icon: Cpu,
    },
    {
      number: '03',
      title: 'Compare Acceptance',
      description: 'Each candidate is verified against anchored automata rules: w ∈ L(A) and w ∉ L(B).',
      icon: CheckSquare,
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mt-12">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">How It Works</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Algorithmic process in 3 simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {step.number}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1.5">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
