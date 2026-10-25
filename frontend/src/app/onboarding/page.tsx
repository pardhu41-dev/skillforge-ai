'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  User,
  GraduationCap,
  Target,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

// ─── Skill Pills Data ────────────────────────────────────────────────────────

const SKILL_OPTIONS = [
  { name: 'Python', category: 'Programming' },
  { name: 'SQL', category: 'Database' },
  { name: 'Machine Learning', category: 'AI / ML' },
  { name: 'Deep Learning', category: 'AI / ML' },
  { name: 'Statistics', category: 'Mathematics' },
  { name: 'Data Analysis', category: 'Analytics' },
  { name: 'Power BI', category: 'Analytics' },
  { name: 'Tableau', category: 'Analytics' },
  { name: 'JavaScript', category: 'Programming' },
  { name: 'React', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Java', category: 'Programming' },
  { name: 'C++', category: 'Programming' },
  { name: 'Computer Vision', category: 'AI / ML' },
  { name: 'NLP', category: 'AI / ML' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Git', category: 'Tools' },
  { name: 'Excel', category: 'Analytics' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'AWS', category: 'Cloud' },
];

const CAREER_ROLES = [
  'Machine Learning Engineer',
  'Data Scientist',
  'Data Analyst',
  'AI Research Engineer',
  'Full Stack Developer',
  'Backend Engineer',
  'Frontend Developer',
  'DevOps Engineer',
  'Cloud Architect',
  'Product Manager',
];

const BRANCHES = [
  'B.Tech AI & Data Science',
  'B.Tech Computer Science',
  'B.Tech Information Technology',
  'B.Tech Electronics & Communication',
  'B.Tech Electrical Engineering',
  'B.Tech Mechanical Engineering',
  'B.Sc Computer Science',
  'MCA',
  'M.Tech',
  'MBA',
];

const SEMESTERS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

interface SkillSelection {
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, completeOnboarding } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Temp auth from sessionStorage
  const [tempToken, setTempToken] = useState('');
  const [tempEmail, setTempEmail] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [studyHours, setStudyHours] = useState(2);
  const [selectedSkills, setSelectedSkills] = useState<SkillSelection[]>([]);

  // ── Guard: redirect if already authenticated ────────────────────────────
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/app/dashboard');
      return;
    }
    // Get temp creds from session
    const t = sessionStorage.getItem('sf_temp_token');
    const e = sessionStorage.getItem('sf_temp_email');
    if (!t || !e) {
      router.replace('/auth');
      return;
    }
    setTempToken(t);
    setTempEmail(e);
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Skills ────────────────────────────────────────────────────────────────

  const toggleSkill = (skill: { name: string; category: string }) => {
    setSelectedSkills((prev) => {
      const exists = prev.find((s) => s.name === skill.name);
      if (exists) return prev.filter((s) => s.name !== skill.name);
      return [...prev, { ...skill, level: 'Intermediate' }];
    });
  };

  const setSkillLevel = (skillName: string, level: SkillSelection['level']) => {
    setSelectedSkills((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, level } : s))
    );
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validateStep = () => {
    if (step === 1) {
      if (!name.trim()) return 'Please enter your full name.';
      if (!college.trim()) return 'Please enter your college / university.';
      return null;
    }
    if (step === 2) {
      if (!branch) return 'Please select your branch.';
      if (!semester) return 'Please select your semester.';
      const cgpaNum = parseFloat(cgpa);
      if (!cgpa || isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10)
        return 'Please enter a valid CGPA (0 – 10).';
      return null;
    }
    if (step === 3) {
      if (!targetRole) return 'Please select your target career role.';
      if (selectedSkills.length === 0) return 'Please select at least 1 skill.';
      return null;
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setStep((s) => Math.min(s + 1, 3) as 1 | 2 | 3);
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);

    const result = await completeOnboarding({
      email: tempEmail,
      temp_token: tempToken,
      name,
      college,
      branch,
      semester,
      cgpa: parseFloat(cgpa),
      target_role: targetRole,
      study_hours: studyHours,
      skills: selectedSkills,
    });

    setLoading(false);
    if (result.success) {
      sessionStorage.removeItem('sf_temp_token');
      sessionStorage.removeItem('sf_temp_email');
      router.replace('/app/dashboard');
    } else {
      setError(result.message);
    }
  };

  // ── Step metadata ─────────────────────────────────────────────────────────

  const steps = [
    { label: 'Identity & College', icon: User },
    { label: 'Academic Info', icon: GraduationCap },
    { label: 'Career Goal & Skills', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.12),transparent)]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 mx-auto flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Set Up Your Profile</h1>
          <p className="text-sm text-slate-400">Complete your profile to unlock personalised AI career intelligence</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center mb-8 px-2">
          {steps.map((s, idx) => {
            const num = idx + 1;
            const Icon = s.icon;
            const done = num < step;
            const active = num === step;
            return (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center gap-1.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      done
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                        : active
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    {done ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[11px] font-semibold text-center leading-tight max-w-[70px] ${active ? 'text-blue-400' : done ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500 ${done ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50">
          {error && (
            <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Step 1: Identity ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Identity & College</h2>
                <p className="text-xs text-slate-400">Tell us who you are and where you study.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Full Name *</label>
                  <input
                    id="ob-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditya Kumar Singh"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">College / University *</label>
                  <input
                    id="ob-college"
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. KL University, Vijayawada"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
                  />
                </div>
                <div className="p-3.5 rounded-xl bg-blue-500/8 border border-blue-500/20 text-xs text-blue-300/80 flex items-center gap-2">
                  <span className="font-mono text-blue-400">{tempEmail}</span>
                  <span className="text-slate-500">— verified ✓</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Academic ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Academic Information</h2>
                <p className="text-xs text-slate-400">Help us understand your academic background.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Branch / Programme *</label>
                  <select
                    id="ob-branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition appearance-none"
                  >
                    <option value="" className="text-slate-500">Select branch…</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b} className="bg-slate-900">{b}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Semester *</label>
                    <select
                      id="ob-semester"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition appearance-none"
                    >
                      <option value="">Select…</option>
                      {SEMESTERS.map((s) => (
                        <option key={s} value={s} className="bg-slate-900">{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">CGPA *</label>
                    <input
                      id="ob-cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 8.5"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Career & Skills ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Career Goal & Initial Skills</h2>
                <p className="text-xs text-slate-400">Tell us your ambition and pick the skills you already have.</p>
              </div>

              {/* Target role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  Target Career Role *
                </label>
                <select
                  id="ob-target-role"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition appearance-none"
                >
                  <option value="">Select target role…</option>
                  {CAREER_ROLES.map((r) => (
                    <option key={r} value={r} className="bg-slate-900">{r}</option>
                  ))}
                </select>
              </div>

              {/* Study hours slider */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Daily Study Commitment</span>
                  <span className="text-blue-400 font-bold">{studyHours}h / day</span>
                </label>
                <input
                  id="ob-study-hours"
                  type="range"
                  min={1}
                  max={8}
                  value={studyHours}
                  onChange={(e) => setStudyHours(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1h</span><span>2h</span><span>3h</span><span>4h</span><span>5h</span><span>6h</span><span>7h</span><span>8h</span>
                </div>
              </div>

              {/* Skill pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Your Current Skills * <span className="font-normal text-slate-500">({selectedSkills.length} selected)</span>
                </label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                  {SKILL_OPTIONS.map((skill) => {
                    const selected = selectedSkills.find((s) => s.name === skill.name);
                    return (
                      <button
                        key={skill.name}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                          selected
                            ? 'bg-blue-600/20 border-blue-500/60 text-blue-300 shadow-sm shadow-blue-500/10'
                            : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                        }`}
                      >
                        {selected && <Check className="inline w-3 h-3 mr-1" />}
                        {skill.name}
                      </button>
                    );
                  })}
                </div>

                {/* Level selectors for selected skills */}
                {selectedSkills.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[11px] text-slate-400 font-medium">Set proficiency level:</p>
                    {selectedSkills.map((s) => (
                      <div key={s.name} className="flex items-center gap-3">
                        <span className="text-xs text-slate-300 w-32 truncate">{s.name}</span>
                        <div className="flex gap-1">
                          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setSkillLevel(s.name, lvl)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                                s.level === lvl
                                  ? lvl === 'Advanced'
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                    : lvl === 'Intermediate'
                                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                    : 'bg-slate-700 border-slate-600 text-slate-300'
                                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                              }`}
                            >
                              {lvl === 'Intermediate' ? 'Inter.' : lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Navigation Buttons ── */}
          <div className="flex items-center justify-between mt-7 pt-5 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => { setStep((s) => (s - 1) as 1 | 2 | 3); setError(null); }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-800 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                id={`ob-next-${step}`}
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-600/25 transition group"
              >
                Continue
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                id="ob-finish"
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up your profile...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Launch My Dashboard
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-4">
          Step {step} of 3 — {steps[step - 1].label}
        </p>
      </div>
    </div>
  );
}
