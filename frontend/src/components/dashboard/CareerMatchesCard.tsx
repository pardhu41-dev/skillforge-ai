'use client';

import React from 'react';
import { Briefcase, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { CareerMatch } from '@/lib/mockData';

interface CareerMatchesCardProps {
  matches: CareerMatch[];
}

export const CareerMatchesCard: React.FC<CareerMatchesCardProps> = ({ matches }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            Active Career Matches
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Role alignment powered by real-time skill evidence
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
          3 Roles Analyzed
        </span>
      </div>

      {/* Career Match Cards List */}
      <div className="py-4 space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
        {matches.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition flex items-center gap-2">
                  {item.title}
                  <span className="text-xs font-medium text-slate-400 font-normal">
                    ({item.salaryRange})
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{item.company} • {item.openings} Openings</p>
              </div>

              {/* Match Score Badge */}
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600/20 to-emerald-500/20 border border-blue-500/30 rounded-xl text-xs font-bold text-blue-300">
                  <span>{item.matchScore}% Match</span>
                </div>
              </div>
            </div>

            {/* Top Gaps Pills */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                Key Gaps:
              </span>
              {item.topGaps.map((gap, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[11px] border border-amber-500/20 font-medium"
                >
                  {gap}
                </span>
              ))}
            </div>

            {/* Action Row */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Strengths: {item.keyStrengths.slice(0, 2).join(', ')}</span>
              </div>

              <button className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition group/btn">
                <span>Start Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Updated daily based on your learning telemetry</span>
        <button className="text-blue-400 hover:text-blue-300 font-semibold">
          Explore All Job Requirements →
        </button>
      </div>
    </div>
  );
};
