'use client';

import React, { useState } from 'react';
import {
  SkillMatrixItem,
  mockSkillMatrix
} from '@/lib/skillsData';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Zap,
  TrendingDown,
  TrendingUp,
  X,
  Play
} from 'lucide-react';

export const SkillMatrixTable: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [assessmentModalSkill, setAssessmentModalSkill] = useState<any | null>(null);

  // Derive active skills from user profile if available, otherwise mockSkillMatrix
  const displaySkills: any[] = user?.skills && user.skills.length > 0
    ? user.skills.map((s, idx) => ({
        id: `user-skill-${idx}`,
        name: s.name,
        category: s.category || 'Technical',
        selfDeclared: s.self_declared,
        demonstrated: s.demonstrated_score,
        status: s.status || 'Declared',
        evidenceSource: 'Self-Declared Registration',
        evidenceCount: 1,
        lastAssessed: 'Recently'
      }))
    : mockSkillMatrix;

  const categories = ['All', 'Languages', 'Database', 'Mathematics', 'AI & ML', 'Analytics', 'Web Development', 'Computer Science', 'DevOps'];

  const filteredSkills = displaySkills.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'Strong' || status === 'Verified') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </span>
      );
    } else if (status === 'Developing') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <TrendingUp className="w-3 h-3" />
          Developing
        </span>
      );
    } else if (status === 'Needs Practice' || status === 'Priority Gap') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Flame className="w-3 h-3 text-rose-400" />
          Priority Gap
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <ShieldCheck className="w-3 h-3" />
        Declared
      </span>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            Registered Skill Matrix ({displaySkills.length} Skills)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Comparing student self-declared proficiency against empirical evidence-backed scores
          </p>
        </div>

        {/* Category Pills & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-slate-950/50">
              <th className="py-3.5 px-4 rounded-l-xl">Skill Name</th>
              <th className="py-3.5 px-3">Category</th>
              <th className="py-3.5 px-3">Self-Declared</th>
              <th className="py-3.5 px-3">Demonstrated Score</th>
              <th className="py-3.5 px-3">Gap Delta</th>
              <th className="py-3.5 px-3">Evidence Source</th>
              <th className="py-3.5 px-4 text-right rounded-r-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredSkills.map((item) => {
              const delta = item.demonstrated - item.selfDeclared;
              return (
                <tr key={item.id} className="hover:bg-slate-950/60 transition group">
                  {/* Name & Status */}
                  <td className="py-4 px-4 font-semibold text-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                        {item.name}
                      </span>
                    </div>
                    <div className="mt-1">{getStatusBadge(item.status)}</div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-3">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.category}
                    </span>
                  </td>

                  {/* Self-Declared */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-300">{item.selfDeclared}%</span>
                      <div className="w-16 bg-slate-950 h-1.5 rounded-full border border-slate-800 overflow-hidden">
                        <div
                          className="bg-slate-500 h-full rounded-full"
                          style={{ width: `${item.selfDeclared}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Demonstrated Score */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {item.demonstrated}%
                      </span>
                      <div className="w-20 bg-slate-950 h-2 rounded-full border border-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.demonstrated >= 80
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : item.demonstrated >= 60
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                              : 'bg-gradient-to-r from-rose-500 to-red-400'
                          }`}
                          style={{ width: `${item.demonstrated}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Gap Delta */}
                  <td className="py-4 px-3">
                    <div
                      className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded ${
                        delta >= 0
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : delta >= -15
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{delta >= 0 ? `+${delta}%` : `${delta}%`}</span>
                    </div>
                  </td>

                  {/* Evidence Source */}
                  <td className="py-4 px-3">
                    <div>
                      <p className="font-medium text-slate-200">{item.evidenceSource}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.evidenceCount} evidence items • {item.lastAssessed}
                      </p>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setAssessmentModalSkill(item)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 hover:border-blue-500 text-blue-300 hover:text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 ml-auto"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Verify Skill</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Verification Assessment Modal */}
      {assessmentModalSkill && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setAssessmentModalSkill(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Skill Verification Lab: {assessmentModalSkill.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Category: {assessmentModalSkill.category} • Target Score: 85%
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Score:</span>
                <span className="font-bold text-white">{assessmentModalSkill.demonstrated}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Format:</span>
                <span className="font-semibold text-blue-400">Adaptive Interactive Quiz & Sandbox Lab</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAssessmentModalSkill(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Launching ${assessmentModalSkill.name} Skill Verification Assessment!`);
                  setAssessmentModalSkill(null);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
