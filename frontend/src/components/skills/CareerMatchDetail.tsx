'use client';

import React, { useState } from 'react';
import {
  TargetRoleDetail,
  mockTargetRoles,
  RequiredSkillBreakdown,
  PathwayStep
} from '@/lib/skillsData';
import {
  Briefcase,
  Target,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';


export const CareerMatchDetail: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<TargetRoleDetail>(mockTargetRoles[0]);
  const [pathway, setPathway] = useState<PathwayStep[]>(selectedRole.learningPathway);

  const handleSelectRole = (role: TargetRoleDetail) => {
    setSelectedRole(role);
    setPathway(role.learningPathway);
  };

  const togglePathwayStep = (stepNumber: number) => {
    setPathway((prev) =>
      prev.map((step) =>
        step.stepNumber === stepNumber ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const getStatusBadge = (status: RequiredSkillBreakdown['status']) => {
    switch (status) {
      case 'Met':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Benchmark Met
          </span>
        );
      case 'Developing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            Developing Gap
          </span>
        );
      case 'Missing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Flame className="w-3 h-3 text-rose-400" />
            Critical Gap
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Selectable Target Roles Cards Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-400" />
            Target Career Path & Match Intelligence
          </h2>
          <span className="text-xs text-slate-400">Select a target role to inspect gap analytics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockTargetRoles.map((role) => {
            const isSelected = selectedRole.id === role.id;
            return (
              <div
                key={role.id}
                onClick={() => handleSelectRole(role)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500/50 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Active Indicator Strip */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {role.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{role.roleTitle}</h3>
                    <p className="text-xs text-slate-400">{role.salaryRange} • {role.industryDemand} Demand</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block text-xl font-extrabold px-3 py-1 rounded-xl ${
                        role.matchScore >= 75
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : role.matchScore >= 60
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {role.matchScore}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {role.requiredSkills.filter((s) => s.status === 'Met').length} / {role.requiredSkills.length} Benchmarks Met
                  </span>
                  <span className={`font-bold flex items-center gap-1 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>
                    {isSelected ? 'Active Selection' : 'Inspect Path →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Breakdown Area (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Required Skills Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Required Skills & Proficiency Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Role: <strong className="text-white">{selectedRole.roleTitle}</strong> ({selectedRole.matchScore}% Compatibility)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {selectedRole.requiredSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{item.skillName}</span>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Progress Bar comparison */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">
                      Demonstrated: <strong className="text-slate-200">{item.currentScore}%</strong>
                    </span>
                    <span className="text-slate-400">
                      Required Benchmark: <strong className="text-amber-400">{item.requiredScore}%</strong>
                    </span>
                  </div>

                  <div className="w-full bg-slate-900 h-3 rounded-full border border-slate-800 relative overflow-hidden">
                    {/* Current Score Bar */}
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.status === 'Met'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : item.status === 'Developing'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-rose-500 to-red-400'
                      }`}
                      style={{ width: `${item.currentScore}%` }}
                    />
                    {/* Target Benchmark Line Indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow"
                      style={{ left: `${item.requiredScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Step-by-Step Personalized Learning Pathway (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Personalized Learning Pathway
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                AI-generated roadmap to close {selectedRole.roleTitle} skill gaps
              </p>
            </div>

            {/* Steps Timeline */}
            <div className="mt-4 space-y-4">
              {pathway.map((step) => (
                <div
                  key={step.stepNumber}
                  onClick={() => togglePathwayStep(step.stepNumber)}
                  className={`p-4 rounded-xl border transition cursor-pointer relative ${
                    step.completed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                        step.completed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {step.completed ? <Check className="w-4 h-4 stroke-[3]" /> : step.stepNumber}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {step.resourceType}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {step.duration}
                        </span>
                      </div>

                      <h4
                        className={`text-sm font-bold mt-1.5 ${
                          step.completed ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Estimated Completion: <strong className="text-slate-200">14 Days</strong>
            </span>
            <button
              onClick={() => alert(`Enrolled in ${selectedRole.roleTitle} Learning Roadmap!`)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
            >
              <span>Enroll in Pathway</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
