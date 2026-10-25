'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SkillGapChart } from '@/components/dashboard/SkillGapChart';
import { CareerMatchesCard } from '@/components/dashboard/CareerMatchesCard';
import { StudySchedule } from '@/components/dashboard/StudySchedule';
import { AssessmentEvidenceTable } from '@/components/dashboard/AssessmentEvidenceTable';
import {
  mockSkillGaps,
  mockCareerMatches,
  mockStudySchedule,
  mockAssessmentEvidence,
  MetricData,
} from '@/lib/mockData';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { student } = useAuth();
  const [quickAction, setQuickAction] = useState<string | null>(null);

  const firstName =
    student?.name?.split(' ')[0] || student?.full_name?.split(' ')[0] || 'Student';
  const targetRole = student?.target_role || 'Machine Learning Engineer';

  const metrics: MetricData[] = [
    {
      id: 'readiness',
      title: 'Career Readiness',
      value: '78%',
      subtext: '+4% from last week',
      trend: 'up',
      trendValue: '+4%',
      iconName: 'Target',
      accentColor: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'skills',
      title: 'Registered Skills',
      value: student?.skills?.length ? `${student.skills.length} Skills` : '5 Skills',
      subtext: 'Self-Declared & Verified',
      trend: 'up',
      trendValue: '+3',
      iconName: 'Award',
      accentColor: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'cgpa',
      title: 'Academic CGPA',
      value: student?.cgpa ? `${student.cgpa}` : '—',
      subtext: student?.branch
        ? `${student.branch}${student.semester ? ` (${student.semester})` : ''}`
        : 'Academic Record',
      trend: 'up',
      trendValue: 'Verified',
      iconName: 'GraduationCap',
      accentColor: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'streak',
      title: 'Learning Streak',
      value: `${student?.streak_days ?? 0} Days`,
      subtext: `Commitment: ${student?.study_hours ?? 2}h / day`,
      trend: 'up',
      trendValue: 'Active',
      iconName: 'Flame',
      accentColor: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-7">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-blue-600/10 via-indigo-500/5 to-transparent pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              AI Skill Intelligence Active
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-xl leading-relaxed">
              Your top career match is{' '}
              <strong className="text-blue-400 font-semibold">{targetRole} (84% Alignment)</strong>.
              Bridge remaining skill gaps to unlock guaranteed campus interview shortlists.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/app/skills"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition flex items-center gap-2 group"
            >
              Analyse Skill Gaps
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/app/interview"
              className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition"
            >
              Mock Interview
            </a>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m) => (
          <MetricCard key={m.id} data={m} />
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillGapChart data={mockSkillGaps} targetRole={targetRole} />
        <CareerMatchesCard matches={mockCareerMatches} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudySchedule initialItems={mockStudySchedule} />
        <AssessmentEvidenceTable evidenceList={mockAssessmentEvidence} />
      </div>
    </div>
  );
}
