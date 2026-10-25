'use client';

import React, { useState } from 'react';
import {
  CodingProblem,
  mockCodingProblem,
  ExecutionResult,
  ComplexityAnalysis
} from '@/lib/codingData';
import { CodeAnalysisModal } from '@/components/coding/CodeAnalysisModal';
import {
  Play,
  CheckCircle2,
  Clock,
  HardDrive,
  RotateCcw,
  Sparkles,
  Terminal,
  FileCode2,
  Cpu,
  ChevronDown
} from 'lucide-react';


export const CodeLab: React.FC = () => {
  const [problem] = useState<CodingProblem>(mockCodingProblem);
  const [language, setLanguage] = useState<'python' | 'javascript' | 'java'>('python');
  const [code, setCode] = useState<string>(problem.starterCode.python);
  const [activeTabLeft, setActiveTabLeft] = useState<'description' | 'cases'>('description');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState<boolean>(false);

  const mockAnalysis: ComplexityAnalysis = {
    timeComplexity: 'O(N log K)',
    spaceComplexity: 'O(N)',
    qualityScore: 92,
    plagiarismRisk: 'Low',
    keyInsights: [
      'Using a Hash Map (Counter) with a Min-Heap yields O(N log K) time complexity.',
      'Optimal memory allocation adhering to 256MB limit.'
    ],
    refactoringSuggestions: [
      'Consider Bucket Sort algorithm to achieve pure linear O(N) time complexity for frequency counting.',
      'Add type annotations for function return type safety.',
      'Ensure input empty array edge cases return an empty list gracefully.'
    ]
  };

  const handleLanguageChange = (lang: 'python' | 'javascript' | 'java') => {
    setLanguage(lang);
    setCode(problem.starterCode[lang]);
    setExecutionResult(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: 'Accepted',
        totalPassed: 2,
        totalCases: 2,
        runtimeMs: 42,
        memoryMb: 14.8,
        outputLog: [
          'Sample Case 1: Input: [1, 1, 1, 2, 2, 3], k = 2 => Output: [1, 2] (PASSED)',
          'Sample Case 2: Input: [1], k = 1 => Output: [1] (PASSED)'
        ],
        cases: [
          { id: 1, passed: true, input: 'skills = [1, 1, 1, 2, 2, 3], k = 2', output: '[1, 2]', expected: '[1, 2]' },
          { id: 2, passed: true, input: 'skills = [1], k = 1', output: '[1]', expected: '[1]' }
        ]
      });
    }, 800);
  };

  const handleSubmitCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: 'Accepted',
        totalPassed: 5,
        totalCases: 5,
        runtimeMs: 64,
        memoryMb: 16.2,
        outputLog: [
          'Sample Case 1: PASSED',
          'Sample Case 2: PASSED',
          'Hidden Case 3 (Large Dataset N=10^5): PASSED (18ms)',
          'Hidden Case 4 (All Unique Elements): PASSED (22ms)',
          'Hidden Case 5 (Negative Skill IDs): PASSED (12ms)'
        ],
        cases: [
          { id: 1, passed: true, input: 'skills = [1, 1, 1, 2, 2, 3], k = 2', output: '[1, 2]', expected: '[1, 2]' },
          { id: 2, passed: true, input: 'skills = [1], k = 1', output: '[1]', expected: '[1]' },
          { id: 3, passed: true, input: '[Hidden Large Dataset]', output: '[Verified]', expected: '[Verified]', isHidden: true },
          { id: 4, passed: true, input: '[Hidden Edge Cases]', output: '[Verified]', expected: '[Verified]', isHidden: true },
          { id: 5, passed: true, input: '[Hidden Negative IDs]', output: '[Verified]', expected: '[Verified]', isHidden: true }
        ]
      });
    }, 1200);
  };

  const getDifficultyBadge = (diff: CodingProblem['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">Easy</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">Medium</span>;
      case 'Hard':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold">Hard</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Two-Pane Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* Left Pane: Problem Description & Test Cases (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header Title */}
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  {problem.domain}
                </span>
                {getDifficultyBadge(problem.difficulty)}
              </div>

              <h2 className="text-xl font-extrabold text-white mt-2">
                {problem.title}
              </h2>

              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {problem.timeLimit}
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5" />
                  {problem.memoryLimit}
                </span>
              </div>
            </div>

            {/* Left Nav Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTabLeft('description')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTabLeft === 'description'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Problem Description
              </button>
              <button
                onClick={() => setActiveTabLeft('cases')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTabLeft === 'cases'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sample Test Cases ({problem.sampleCases.length})
              </button>
            </div>

            {/* Description Tab Content */}
            {activeTabLeft === 'description' && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed max-h-[420px] overflow-y-auto pr-1">
                <div className="whitespace-pre-line">{problem.description}</div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Constraints:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Test Cases Tab Content */}
            {activeTabLeft === 'cases' && (
              <div className="space-y-3 text-xs max-h-[420px] overflow-y-auto pr-1">
                {problem.sampleCases.map((tc) => (
                  <div key={tc.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                    <span className="text-[10px] font-bold text-blue-400 uppercase">Case {tc.id}</span>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Input:</span>
                      <code className="text-slate-200">{tc.input}</code>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Expected Output:</span>
                      <code className="text-emerald-400">{tc.expectedOutput}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Left Footer info */}
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>{problem.hiddenCasesCount} Hidden Evaluation Cases</span>
            <button
              onClick={() => setIsAnalysisOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Inspect Complexity AST</span>
            </button>
          </div>
        </div>

        {/* Right Pane: Code Editor & Output Terminal (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <FileCode2 className="w-5 h-5 text-blue-400" />
              {/* Language Selector Dropdown */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as 'python' | 'javascript' | 'java')}
                  className="bg-slate-950 border border-slate-800 text-slate-200 font-semibold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none pr-8"
                >

                  <option value="python">Python 3.11</option>
                  <option value="javascript">JavaScript (Node v20)</option>
                  <option value="java">Java 17 (OpenJDK)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCode(problem.starterCode[language])}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Reset Code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAnalysisOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-600 font-semibold text-xs transition flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Analyze Code</span>
              </button>
            </div>
          </div>

          {/* Code Textarea Editor */}
          <div className="relative flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-72 lg:h-80 bg-slate-950 text-slate-100 p-4 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-blue-600 selection:text-white"
            />
          </div>

          {/* Execution Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span>Execution Engine Ready</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={isRunning}
                onClick={handleRunCode}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                disabled={isRunning}
                onClick={handleSubmitCode}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRunning ? 'Evaluating...' : 'Submit Code'}</span>
              </button>
            </div>
          </div>

          {/* Execution Terminal Output Window */}
          {executionResult && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      executionResult.status === 'Accepted'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {executionResult.status} ({executionResult.totalPassed}/{executionResult.totalCases} Passed)
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>Runtime: <strong className="text-white">{executionResult.runtimeMs}ms</strong></span>
                  <span>Memory: <strong className="text-white">{executionResult.memoryMb}MB</strong></span>
                </div>
              </div>

              <div className="font-mono text-[11px] text-slate-300 space-y-1">
                {executionResult.outputLog.map((logLine, idx) => (
                  <p key={idx} className="text-emerald-400/90">{logLine}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Complexity Inspector Modal */}
      <CodeAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        analysis={mockAnalysis}
      />
    </div>
  );
};
