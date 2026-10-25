'use client';

import React from 'react';
import {
  LayoutDashboard,
  Target,
  Briefcase,
  Award,
  Code2,
  MessageSquare,
  GraduationCap,
  Trophy,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'skills', label: 'Skills & Gaps', icon: Target, badge: '4 Gaps' },
  { id: 'career', label: 'Career Match', icon: Briefcase, badge: '84%' },
  { id: 'assessments', label: 'Assessments', icon: Award, badge: null },
  { id: 'coding', label: 'Coding Lab', icon: Code2, badge: 'New' },
  { id: 'interview', label: 'Mock Interview', icon: MessageSquare, badge: 'AI' },
  { id: 'academic', label: 'Academic Tracker', icon: GraduationCap, badge: null },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: '#12' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { student, logout } = useAuth();

  const displayName = student?.name || student?.full_name || 'Student';
  const displayBranch = student?.branch || '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              SkillForge{' '}
              <span className="text-blue-500 text-xs px-1.5 py-0.5 rounded bg-blue-500/10 font-bold border border-blue-500/20">
                AI
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Career Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Main Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Profile Mini-card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">{displayName}</p>
            <p className="text-[10px] text-slate-400 truncate">{displayBranch}</p>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors p-1.5 rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
