import React from 'react';

export const AutomataVisual: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-6">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
            Automata State Representation
          </span>
          <p className="text-xs text-gray-500 mt-0.5">
            Sequential state transitions verifying input string: <span className="font-mono text-gray-700">δ(q, σ)</span>
          </p>
        </div>

        {/* Clean educational textbook diagram: q0 → q1 → q2 → q3 */}
        <div className="w-full sm:w-auto overflow-x-auto py-1">
          <svg
            className="h-14 w-72 sm:w-80 mx-auto text-blue-600"
            viewBox="0 0 320 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Start Arrow */}
            <path d="M 10 30 L 32 30" stroke="#2563eb" strokeWidth="1.75" />
            <polygon points="32,30 26,26 26,34" fill="#2563eb" />
            <text x="14" y="20" fill="#64748b" fontSize="9" fontFamily="sans-serif">start</text>

            {/* State q0 */}
            <circle cx="48" cy="30" r="14" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.75" />
            <text x="48" y="34" fill="#1e40af" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">q0</text>

            {/* Arrow q0 -> q1 */}
            <path d="M 62 30 L 112 30" stroke="#2563eb" strokeWidth="1.75" />
            <polygon points="112,30 106,26 106,34" fill="#2563eb" />
            <text x="87" y="22" fill="#2563eb" fontSize="10" fontFamily="monospace" textAnchor="middle">σ₁</text>

            {/* State q1 */}
            <circle cx="128" cy="30" r="14" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.75" />
            <text x="128" y="34" fill="#1e40af" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">q1</text>

            {/* Arrow q1 -> q2 */}
            <path d="M 142 30 L 192 30" stroke="#2563eb" strokeWidth="1.75" />
            <polygon points="192,30 186,26 186,34" fill="#2563eb" />
            <text x="167" y="22" fill="#2563eb" fontSize="10" fontFamily="monospace" textAnchor="middle">σ₂</text>

            {/* State q2 */}
            <circle cx="208" cy="30" r="14" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.75" />
            <text x="208" y="34" fill="#1e40af" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">q2</text>

            {/* Arrow q2 -> q3 */}
            <path d="M 222 30 L 272 30" stroke="#2563eb" strokeWidth="1.75" />
            <polygon points="272,30 266,26 266,34" fill="#2563eb" />
            <text x="247" y="22" fill="#2563eb" fontSize="10" fontFamily="monospace" textAnchor="middle">σ₃</text>

            {/* State q3 (Accepting Double Circle) */}
            <circle cx="288" cy="30" r="14" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.75" />
            <circle cx="288" cy="30" r="11" fill="none" stroke="#2563eb" strokeWidth="1.25" />
            <text x="288" y="34" fill="#1e40af" fontSize="11" fontFamily="monospace" fontWeight="600" textAnchor="middle">q3</text>
          </svg>
        </div>
      </div>
    </div>
  );
};
