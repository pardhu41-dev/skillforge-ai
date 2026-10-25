'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, Sparkles, BookOpen, Code, FileText, Check } from 'lucide-react';
import { ScheduleItem } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';

interface StudyScheduleProps {
  initialItems: ScheduleItem[];
}

export const StudySchedule: React.FC<StudyScheduleProps> = ({ initialItems }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<ScheduleItem[]>(initialItems);

  const studyHours = user?.study_hours || 2;

  useEffect(() => {
    if (user && user.study_hours) {
      const generated: ScheduleItem[] = [
        {
          id: 's1',
          day: 'Mon',
          title: 'Advanced Python Decorators & Generators Quiz',
          skillDomain: 'Python',
          estimatedMinutes: 45,
          completed: false,
          type: 'assessment'
        },
        {
          id: 's2',
          day: 'Mon',
          title: 'SQL Complex Joins & Window Functions Sandbox',
          skillDomain: 'SQL',
          estimatedMinutes: 45,
          completed: false,
          type: 'coding'
        }
      ];

      if (user.study_hours >= 3) {
        generated.push({
          id: 's3',
          day: 'Tue',
          title: 'Machine Learning Classification Benchmark',
          skillDomain: 'ML',
          estimatedMinutes: 60,
          completed: false,
          type: 'project'
        });
      }

      if (user.study_hours >= 4) {
        generated.push({
          id: 's4',
          day: 'Wed',
          title: 'Power BI Dashboard Data Modeling Challenge',
          skillDomain: 'Power BI',
          estimatedMinutes: 60,
          completed: false,
          type: 'coding'
        });
      }

      setItems(generated);
    }
  }, [user]);

  const toggleTask = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const getTypeIcon = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'coding':
        return <Code className="w-3.5 h-3.5 text-blue-400" />;
      case 'assessment':
        return <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'reading':
        return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
      case 'project':
        return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col h-full">
      {/* Title & Progress Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Adaptive Study Schedule ({studyHours} Hours / Day)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Personalized daily tasks generated based on your declared {studyHours}h study commitment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-200">
              {completedCount} / {items.length} Completed
            </span>
            <div className="w-24 bg-slate-950 h-2 rounded-full mt-1 border border-slate-800 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="py-4 space-y-2.5 flex-1 overflow-y-auto max-h-[340px] pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleTask(item.id)}
            className={`group p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
              item.completed
                ? 'bg-slate-950/40 border-slate-800/60 opacity-65'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Checkbox button */}
              <button
                type="button"
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                  item.completed
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'border border-slate-600 group-hover:border-blue-400 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                    {item.day}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 bg-slate-900 rounded border border-slate-800 flex items-center gap-1">
                    {getTypeIcon(item.type)}
                    {item.skillDomain}
                  </span>
                </div>
                <p
                  className={`text-sm font-medium mt-0.5 truncate ${
                    item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                  }`}
                >
                  {item.title}
                </p>
              </div>
            </div>

            {/* Time Estimate */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.estimatedMinutes} mins</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Schedule dynamically tailored to your study hours
        </span>
        <button
          onClick={() =>
            setItems((prev) => prev.map((i) => ({ ...i, completed: false })))
          }
          className="text-slate-400 hover:text-slate-200 transition"
        >
          Reset Tasks
        </button>
      </div>
    </div>
  );
};
