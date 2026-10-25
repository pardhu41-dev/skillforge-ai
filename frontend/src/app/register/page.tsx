'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  GraduationCap,
  Briefcase,
  Target,
  Sliders,
  Check,
  ChevronLeft,
  BookOpen,
  Award
} from 'lucide-react';

const AVAILABLE_SKILLS = [
  { name: 'Python', category: 'Programming' },
  { name: 'SQL', category: 'Database' },
  { name: 'Statistics', category: 'Mathematics' },
  { name: 'Machine Learning', category: 'AI / ML' },
  { name: 'Power BI', category: 'Analytics' },
  { name: 'React', category: 'Web Development' },
  { name: 'Node.js', category: 'Backend Development' },
  { name: 'Data Structures', category: 'Computer Science' },
  { name: 'Git', category: 'DevOps' },
  { name: 'Docker', category: 'Cloud & Infrastructure' }
];

const CAREER_TARGETS = [
  'Data Analyst',
  'Machine Learning Engineer',
  'Full Stack Developer',
  'AI Research Engineer',
  'Cloud & DevOps Engineer'
];

export default function RegisterPage() {
  const router = useRouter();
  const { sendOtp, verifyOtp, registerStudent } = useAuth();

  // Wizard Phase State: 1 | 2 | 3
  const [phase, setPhase] = useState<1 | 2 | 3>(1);

  // Phase 1: Email Verification
  const [email, setEmail] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Phase 2: Personal & Academic
  const [fullName, setFullName] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [branch, setBranch] = useState<string>('B.Tech AI & Data Science');
  const [semester, setSemester] = useState<string>('4-1');
  const [cgpa, setCgpa] = useState<string>('8.8');

  // Phase 3: Career Aspirations & Skills
  const [targetRole, setTargetRole] = useState<string>('Machine Learning Engineer');
  const [selectedSkills, setSelectedSkills] = useState<{ [skillName: string]: 'Beginner' | 'Intermediate' | 'Advanced' }>({
    'Python': 'Advanced',
    'SQL': 'Intermediate',
    'Machine Learning': 'Intermediate'
  });
  const [studyHours, setStudyHours] = useState<number>(3);

  // Form states
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handlers for OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid student email address.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    const result = await sendOtp(email);
    setLoading(false);

    if (result.success) {
      setIsOtpSent(true);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      if (pasted.length === 6) {
        setOtpDigits(pasted);
        digitRefs.current[5]?.focus();
        return;
      }
    }
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    if (digit && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter all 6 digits of your email OTP code.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    const result = await verifyOtp(email, enteredOtp);
    setLoading(false);

    if (result.success) {
      setIsEmailVerified(true);
      setPhase(2);
    } else {
      setErrorMessage(result.message);
    }
  };

  // Skill toggle handler
  const handleToggleSkill = (skillName: string) => {
    setSelectedSkills((prev) => {
      const updated = { ...prev };
      if (updated[skillName]) {
        delete updated[skillName];
      } else {
        updated[skillName] = 'Intermediate';
      }
      return updated;
    });
  };

  const handleSkillLevelChange = (skillName: string, level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setSelectedSkills((prev) => ({
      ...prev,
      [skillName]: level
    }));
  };

  // Final Registration Submission
  const handleFinalSubmit = async () => {
    if (Object.keys(selectedSkills).length === 0) {
      setErrorMessage('Please select at least one core skill.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const skillsPayload = Object.entries(selectedSkills).map(([name, level]) => {
      const found = AVAILABLE_SKILLS.find((s) => s.name === name);
      return {
        name,
        category: found?.category || 'Technical',
        level
      };
    });

    const payload = {
      email,
      full_name: fullName || email.split('@')[0],
      college: college || 'University Campus',
      branch: branch || 'B.Tech AI & Data Science',
      semester: semester || '4-1',
      cgpa: parseFloat(cgpa) || 8.5,
      target_role: targetRole,
      study_hours: studyHours,
      skills: skillsPayload
    };

    const result = await registerStudent(payload);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10 space-y-8">
        {/* Brand & Progress Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            SkillForge AI Onboarding Wizard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Build Your <span className="text-blue-400">Skill Intelligence</span> Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Dynamic benchmark profiling to map your academic strengths, career aspirations, and skill gaps.
          </p>
        </div>

        {/* Phase Step Indicator */}
        <div className="flex items-center justify-between max-w-md mx-auto relative px-4">
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-800 -translate-y-1/2 -z-0" />
          
          <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
            phase >= 1 ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-slate-800 text-slate-400'
          }`}>
            {isEmailVerified ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
            phase >= 2 ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-slate-800 text-slate-400'
          }`}>
            2
          </div>
          <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
            phase >= 3 ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-slate-800 text-slate-400'
          }`}>
            3
          </div>
        </div>

        {/* Form Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* PHASE 1: Email Verification */}
        {phase === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                Phase 1: Email Verification
              </h2>
              <p className="text-xs text-slate-400 mt-1">Verify your student email address to proceed.</p>
            </div>

            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Student Email Address:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <span>Sending OTP...</span> : (
                    <>
                      <span>Send Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Enter OTP code sent to: <strong className="text-slate-200">{email}</strong></span>
                  <button type="button" onClick={() => setIsOtpSent(false)} className="text-blue-400 hover:underline">Change Email</button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { digitRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      className="w-12 h-14 bg-slate-950 border border-slate-800 rounded-xl text-center text-xl font-bold font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <span>Verifying...</span> : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Email & Continue</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* PHASE 2: Personal & Academic Details */}
        {phase === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  Phase 2: Academic Profile
                </h2>
                <p className="text-xs text-slate-400 mt-1">Provide your current college and academic standing.</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                ✓ {email}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">Full Name:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="G. P. P. Saradhi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">College / University Name:</label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="KL University"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Degree & Branch:</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="B.Tech AI & Data Science">B.Tech AI & Data Science</option>
                  <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                  <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                  <option value="M.Tech Software Engineering">M.Tech Software Engineering</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Current Semester:</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="1-1">1st Year - Sem 1 (1-1)</option>
                  <option value="1-2">1st Year - Sem 2 (1-2)</option>
                  <option value="2-1">2nd Year - Sem 1 (2-1)</option>
                  <option value="2-2">2nd Year - Sem 2 (2-2)</option>
                  <option value="3-1">3rd Year - Sem 1 (3-1)</option>
                  <option value="3-2">3rd Year - Sem 2 (3-2)</option>
                  <option value="4-1">4th Year - Sem 1 (4-1)</option>
                  <option value="4-2">4th Year - Sem 2 (4-2)</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">Verified CGPA (0.0 - 10.0):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 transition font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPhase(1)}
                className="px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-semibold transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!fullName.trim() || !college.trim()) {
                    setErrorMessage('Please fill in your name and college.');
                    return;
                  }
                  setErrorMessage(null);
                  setPhase(3);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                <span>Next: Career & Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 3: Career Aspirations & Skills */}
        {phase === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                Phase 3: Career Aspirations & Skill Matrix
              </h2>
              <p className="text-xs text-slate-400 mt-1">Target role and self-declared skill proficiency levels.</p>
            </div>

            {/* Target Role Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Primary Career Goal:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CAREER_TARGETS.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold text-left transition flex items-center justify-between ${
                      targetRole === role
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{role}</span>
                    {targetRole === role && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Picker & Level Matrix */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Select Your Core Skills & Declare Level:</span>
                <span className="text-slate-400 text-[11px] font-normal">
                  {Object.keys(selectedSkills).length} skills selected
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {AVAILABLE_SKILLS.map((skill) => {
                  const isSelected = !!selectedSkills[skill.name];
                  const currentLevel = selectedSkills[skill.name] || 'Intermediate';

                  return (
                    <div
                      key={skill.name}
                      className={`p-3 rounded-xl border transition space-y-2 ${
                        isSelected
                          ? 'bg-slate-900 border-blue-500/50 shadow-md'
                          : 'bg-slate-950 border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleSkill(skill.name)}
                          className="flex items-center gap-2 text-left"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{skill.name}</div>
                            <div className="text-[10px] text-slate-500">{skill.category}</div>
                          </div>
                        </button>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 pt-1 border-t border-slate-800/60">
                          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleSkillLevelChange(skill.name, lvl)}
                              className={`flex-1 py-1 text-[10px] font-bold rounded transition ${
                                currentLevel === lvl
                                  ? 'bg-blue-500 text-white shadow'
                                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Commitment Slider */}
            <div className="space-y-2 bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  Daily Study Commitment:
                </label>
                <span className="font-mono font-bold text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                  {studyHours} Hours / Day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={studyHours}
                onChange={(e) => setStudyHours(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Hr (Light)</span>
                <span>2 Hrs (Balanced)</span>
                <span>3 Hrs (Intensive)</span>
                <span>4 Hrs (Bootcamp)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPhase(2)}
                className="px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-semibold transition"
              >
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleFinalSubmit}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <span>Initializing Profile...</span> : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Registration & Launch Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
