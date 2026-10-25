'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
  Flame,
  Zap,
  Bell,
  Search,
  ChevronDown,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems = [
  { id: 'dashboard', label: 'Overview', href: '/app/dashboard', icon: LayoutDashboard, badge: null },
  { id: 'skills', label: 'Skills & Gaps', href: '/app/skills', icon: Target, badge: '4 Gaps' },
  { id: 'career', label: 'Career Paths', href: '/app/career', icon: Briefcase, badge: '84%' },
  { id: 'assessments', label: 'Assessments', href: '/app/assessments', icon: Award, badge: null },
  { id: 'coding', label: 'Coding Lab', href: '/app/coding', icon: Code2, badge: 'New' },
  { id: 'interview', label: 'Mock Interview', href: '/app/interview', icon: MessageSquare, badge: 'AI' },
  { id: 'academic', label: 'Academics', href: '/app/academic', icon: GraduationCap, badge: null },
  { id: 'leaderboard', label: 'Leaderboard', href: '/app/leaderboard', icon: Trophy, badge: '#12' },
];

// ─── Shell Layout ────────────────────────────────────────────────────────────

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { student, isAuthenticated, isLoading, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Route guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400">Loading SkillForge AI...</p>
        </div>
      </div>
    );
  }

  const displayName = student?.name || student?.full_name || 'Student';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const branch = student?.branch || 'B.Tech';
  const semester = student?.semester ? `Sem ${student.semester}` : '';
  const xp = student?.xp ?? 0;
  const streak = student?.streak_days ?? 0;

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  // Derive current section from path
  const activeId = navItems.find((n) => pathname?.startsWith(n.href))?.id ?? 'dashboard';
  // Page title
  const currentNav = navItems.find((n) => n.id === activeId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex antialiased selection:bg-blue-600 selection:text-white">
      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 select-none shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
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

        {/* Nav links */}
        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
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
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400 truncate">{branch}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
          {/* Left: page title + academic pill */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium">SkillForge AI</p>
              <h2 className="text-sm font-bold text-white leading-tight">{currentNav?.label ?? 'Dashboard'}</h2>
            </div>
            {(branch || semester) && (
              <div className="hidden md:flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
                <span className="text-blue-400">{branch}</span>
                {semester && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-emerald-400 font-mono">{semester}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm mx-6 hidden lg:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills, assessments..."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>
          </div>

          {/* Right: XP, streak, user */}
          <div className="flex items-center gap-3">
            {/* Streak badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-xl">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-amber-400">{streak}d</span>
            </div>

            {/* XP badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span className="text-xs font-bold text-blue-300">{xp.toLocaleString()} XP</span>
            </div>

            {/* Notification bell */}
            <button className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white transition">
              <Bell className="w-4 h-4" />
            </button>

            {/* User avatar + dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:bg-slate-800/60 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow">
                  {initials}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-100 leading-none">{displayName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{student?.level ?? 'Beginner'}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{displayName}</p>
                    <p className="text-[11px] text-slate-400">{student?.email}</p>
                  </div>
                  <Link
                    href="/app/settings"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
