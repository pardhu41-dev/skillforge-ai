'use client';

import { useAuth } from '@/context/AuthContext';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const { student } = useAuth();
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-xl text-center space-y-4">
        <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Campus & Batch Skill Leaderboard</h2>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          {student?.branch ? `Department of ${student.branch}` : 'Your Department'} • {student?.xp ?? 0} XP earned
        </p>
        <p className="text-slate-500 text-xs">Live leaderboard rankings coming soon.</p>
      </div>
    </div>
  );
}
