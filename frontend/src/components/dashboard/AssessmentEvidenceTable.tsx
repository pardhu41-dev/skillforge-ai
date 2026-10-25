'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { AssessmentEvidence } from '@/lib/mockData';

interface AssessmentEvidenceTableProps {
  evidenceList: AssessmentEvidence[];
}

export const AssessmentEvidenceTable: React.FC<AssessmentEvidenceTableProps> = ({ evidenceList }) => {
  const getConfidenceBadge = (confidence: AssessmentEvidence['confidence']) => {
    switch (confidence) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            High Confidence
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            Needs Audit
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Recent Assessment Evidence
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified skill assertions backed by practical evaluations
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400">
          5 Recent Verifications
        </span>
      </div>

      {/* Table */}
      <div className="py-2 flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-2">Topic & Assessment</th>
              <th className="py-3 px-2">Score</th>
              <th className="py-3 px-2">Confidence</th>
              <th className="py-3 px-2">Timestamp</th>
              <th className="py-3 px-2 text-right">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {evidenceList.map((item) => (
              <tr key={item.id} className="hover:bg-slate-950/40 transition">
                {/* Topic */}
                <td className="py-3 px-2">
                  <p className="font-semibold text-slate-100">{item.topic}</p>
                  <p className="text-[10px] text-slate-400">{item.category} • {item.evidenceType}</p>
                </td>

                {/* Score */}
                <td className="py-3 px-2 font-bold text-sm">
                  <span className={item.score >= 80 ? 'text-emerald-400' : item.score >= 65 ? 'text-amber-400' : 'text-rose-400'}>
                    {item.score}%
                  </span>
                </td>

                {/* Confidence Badge */}
                <td className="py-3 px-2">
                  {getConfidenceBadge(item.confidence)}
                </td>

                {/* Timestamp */}
                <td className="py-3 px-2 text-slate-400 text-[11px]">
                  {item.timestamp}
                </td>

                {/* Action */}
                <td className="py-3 px-2 text-right">
                  <button className="text-slate-400 hover:text-blue-400 p-1 transition">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Evidence cryptographically hashed & stored</span>
        <button className="text-blue-400 hover:text-blue-300 font-semibold">
          Take Skill Assessment →
        </button>
      </div>
    </div>
  );
};
