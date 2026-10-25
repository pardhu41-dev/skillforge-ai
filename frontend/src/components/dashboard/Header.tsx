'use client';

import React, { useState } from 'react';
import { Flame, Zap, Search, Bell, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';

/**
 * Legacy Header used by the old /dashboard page (now redirected).
 * Kept here to avoid breaking any remaining imports.
 * In the new architecture, the header is part of /app/layout.tsx.
 */
export const Header: React.FC<Record<string, never>> = () => {
  const { student, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const displayName = student?.name || student?.full_name || 'Student';
  const displayBranch = student?.branch || '';
  const displaySemester = student?.semester ? `Sem ${student.semester}` : '';
  const displayAvatar = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const displayXp = student?.xp ?? 0;
  const displayStreak = student?.streak_days ?? 0;

  return (
    <header className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills, assessments, career paths..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
          <span className="text-blue-400">{displayBranch}</span>
          {displaySemester && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-mono">{displaySemester}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="text-xs text-amber-400 font-bold">{displayStreak} Days</span>
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-xl">
          <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
          <span className="text-xs text-blue-300 font-bold">{displayXp.toLocaleString()} XP</span>
        </div>

        <Bell className="w-4 h-4 text-slate-400" />

        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/10 uppercase">
            {displayAvatar}
          </div>
          <div className="hidden md:block text-left">
            <h3 className="text-sm font-bold text-slate-100 leading-tight">{displayName}</h3>
            <p className="text-[11px] font-medium text-slate-400">{displayBranch}</p>
          </div>

          {isAuthenticated ? (
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5 ml-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              Log In
            </button>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};
