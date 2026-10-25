'use client';

import React from 'react';
import { Target, Award, Flame, GraduationCap, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MetricData } from '@/lib/mockData';

interface MetricCardProps {
  data: MetricData;
}

const iconMap = {
  Target: Target,
  Award: Award,
  Flame: Flame,
  GraduationCap: GraduationCap
};

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  const IconComponent = iconMap[data.iconName as keyof typeof iconMap] || Target;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-200 shadow-lg relative overflow-hidden group">
      {/* Background Gradient Subtle Glow */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${data.accentColor} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity blur-xl pointer-events-none`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {data.title}
          </p>
          <h3 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            {data.value}
          </h3>
        </div>

        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${data.accentColor} flex items-center justify-center text-white shadow-md shadow-slate-950/50`}>
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60">
        <span className="text-xs text-slate-400 font-medium">
          {data.subtext}
        </span>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
          data.trend === 'up' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : data.trend === 'down'
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            : 'bg-slate-800 text-slate-400'
        }`}>
          {data.trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {data.trend === 'down' && <TrendingDown className="w-3 h-3" />}
          {data.trend === 'neutral' && <Minus className="w-3 h-3" />}
          <span>{data.trendValue}</span>
        </div>
      </div>
    </div>
  );
};
