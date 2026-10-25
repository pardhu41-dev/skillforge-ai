'use client';

import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { SkillGapItem } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { Target, BarChart2, Radio, Info } from 'lucide-react';

interface SkillGapChartProps {
  data: SkillGapItem[];
  targetRole: string;
}

const BENCHMARK_SCORES: { [key: string]: number } = {
  'Python': 85,
  'SQL': 80,
  'Machine Learning': 75,
  'Statistics': 75,
  'Power BI': 70,
  'React': 80,
  'Node.js': 75,
  'Data Structures': 85,
  'Git': 70,
  'Docker': 65
};

export const SkillGapChart: React.FC<SkillGapChartProps> = ({ data, targetRole }) => {
  const { user } = useAuth();
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');

  const activeTargetRole = user?.target_role || targetRole;

  // Derive dynamic chart data from user's registered skills
  const chartData: SkillGapItem[] = user?.skills && user.skills.length > 0
    ? user.skills.map((s) => ({
        skill: s.name,
        demonstrated: s.demonstrated_score,
        required: BENCHMARK_SCORES[s.name] || 75,
        category: s.category || 'Technical'
      }))
    : data;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col h-full">
      {/* Header & Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Skill Radar & Gap Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrated skills vs required benchmark for <span className="text-blue-400 font-semibold">{activeTargetRole}</span>
          </p>
        </div>

        {/* Toggle Radar / Bar */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setChartType('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              chartType === 'radar'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Radar
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Bar Comparison
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-72 my-2 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'radar' ? (
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 10 }} />
              <Radar
                name="Demonstrated Score"
                dataKey="demonstrated"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.4}
              />
              <Radar
                name="Required Benchmark"
                dataKey="required"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.25}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
              />
            </RadarChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="skill"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '5px', fontSize: '12px' }} />
              <Bar dataKey="demonstrated" name="Demonstrated Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="required" name="Required Benchmark" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Skill Gap Summary */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-amber-400 font-medium">
          <Info className="w-3.5 h-3.5" />
          <span>Active Target: {activeTargetRole} ({chartData.length} Skills Tracked)</span>
        </div>
      </div>
    </div>
  );
};
