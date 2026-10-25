'use client';

import { useAuth } from '@/context/AuthContext';
import { GraduationCap } from 'lucide-react';

export default function AcademicPage() {
  const { student } = useAuth();
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-xl text-center space-y-4">
        <GraduationCap className="w-12 h-12 text-emerald-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Academic Performance Tracker</h2>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          {student?.branch || 'B.Tech'}{student?.semester ? ` • Semester ${student.semester}` : ''}
          {student?.cgpa ? ` • CGPA: ${student.cgpa}` : ''}
        </p>
        <p className="text-slate-500 text-xs">Detailed academic analytics coming soon.</p>
      </div>
    </div>
  );
}
