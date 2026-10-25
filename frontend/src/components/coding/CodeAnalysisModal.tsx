'use client';

import React from 'react';
import { ComplexityAnalysis } from '@/lib/codingData';
import {
  X,
  Cpu,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lightbulb
} from 'lucide-react';


interface CodeAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ComplexityAnalysis;
}

export const CodeAnalysisModal: React.FC<CodeAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              Integrity & Complexity Inspector
            </h2>
            <p className="text-xs text-slate-400">
              Automated static AST analysis & execution profiling
            </p>
          </div>
        </div>

        {/* Top Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Time Complexity */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold uppercase">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Time Complexity</span>
            </div>
            <h3 className="text-2xl font-extrabold text-blue-400 font-mono">
              {analysis.timeComplexity}
            </h3>
            <p className="text-[10px] text-slate-400">Optimal for N = 10^5</p>
          </div>

          {/* Space Complexity */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold uppercase">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Space Complexity</span>
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-400 font-mono">
              {analysis.spaceComplexity}
            </h3>
            <p className="text-[10px] text-slate-400">Memory Allocation</p>
          </div>

          {/* Plagiarism & Integrity */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold uppercase">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Code Integrity</span>
            </div>
            <div className="mt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {analysis.plagiarismRisk} Risk (Verified)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Unique Authorship</p>
          </div>
        </div>

        {/* Quality Score Bar */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300">Code Quality & Maintainability Index</span>
            <span className="text-blue-400">{analysis.qualityScore} / 100</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${analysis.qualityScore}%` }}
            />
          </div>
        </div>

        {/* Key Insights & Refactoring Suggestions */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Optimization & Clean Code Suggestions
          </h4>

          <ul className="space-y-2 text-xs">
            {analysis.refactoringSuggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5 text-slate-300"
              >
                <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30"
          >
            Close Analysis Panel
          </button>
        </div>
      </div>
    </div>
  );
};
