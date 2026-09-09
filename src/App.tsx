import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AutomataVisual } from './components/AutomataVisual';
import { RegexInputs } from './components/RegexInputs';
import { ResultSection } from './components/ResultSection';
import { ExamplesSection } from './components/ExamplesSection';
import { HowItWorks } from './components/HowItWorks';
import { InteractiveVerifier } from './components/InteractiveVerifier';
import { Footer } from './components/Footer';
import { evaluateStringDifference } from './utils/regexEngine';
import { EvaluationResult, ExamplePreset, SearchConfig } from './types';

export default function App() {
  const [regexA, setRegexA] = useState<string>('a(b|c)*');
  const [regexB, setRegexB] = useState<string>('ab*');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const searchConfig: SearchConfig = {
    maxStringLength: 7,
    maxCandidates: 6000,
    includeEmptyString: true,
  };

  const performEvaluation = useCallback((patternA: string, patternB: string) => {
    setIsSearching(true);
    setTimeout(() => {
      const evalResult = evaluateStringDifference(patternA, patternB, searchConfig);
      setResult(evalResult);
      setIsSearching(false);
    }, 80);
  }, []);

  // Initial evaluation on load
  useEffect(() => {
    performEvaluation('a(b|c)*', 'ab*');
  }, [performEvaluation]);

  const handleEvaluate = () => {
    performEvaluation(regexA, regexB);
  };

  const handleSwap = () => {
    const nextA = regexB;
    const nextB = regexA;
    setRegexA(nextA);
    setRegexB(nextB);
    performEvaluation(nextA, nextB);
  };

  const handleReset = () => {
    const defaultA = 'a(b|c)*';
    const defaultB = 'ab*';
    setRegexA(defaultA);
    setRegexB(defaultB);
    performEvaluation(defaultA, defaultB);
  };

  const handleSelectExample = (example: ExamplePreset) => {
    setRegexA(example.regexA);
    setRegexB(example.regexB);
    performEvaluation(example.regexA, example.regexB);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-['Inter',sans-serif]">
      {/* Navigation / Header */}
      <Header />

      <main className="flex-1 pb-10">
        {/* Clean Hero Section */}
        <HeroSection />

        {/* Educational Automata Visual: q0 -> q1 -> q2 -> q3 */}
        <AutomataVisual />

        {/* Main Input Section: Regex A & Regex B side by side */}
        <RegexInputs
          regexA={regexA}
          regexB={regexB}
          onChangeA={setRegexA}
          onChangeB={setRegexB}
          onEvaluate={handleEvaluate}
          onSwap={handleSwap}
          onReset={handleReset}
          isSearching={isSearching}
        />

        {/* Result Section: Sample String, Regex A Accepted, Regex B Rejected */}
        <ResultSection
          result={result}
          onInspectString={(str) => {
            const el = document.getElementById('inspector-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Examples Section */}
        <ExamplesSection
          onSelectExample={handleSelectExample}
          activeRegexA={regexA}
          activeRegexB={regexB}
        />

        {/* How It Works: 3 simple horizontal steps */}
        <HowItWorks />

        {/* Interactive String Inspector for Live Student Demo */}
        <div id="inspector-section">
          <InteractiveVerifier
            regexA={regexA}
            regexB={regexB}
          />
        </div>
      </main>

      {/* Clean Gray Footer */}
      <Footer />
    </div>
  );
}
