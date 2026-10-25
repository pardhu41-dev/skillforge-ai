'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Zap,
  Clock,
  ChevronLeft,
  Shield,
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, sendOtp, verifyOtp, demoLogin } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);

  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/app/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Countdown timer
  useEffect(() => {
    if (step !== 2 || resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendTimer]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await sendOtp(email);
    setLoading(false);
    if (result.success) {
      setStep(2);
      setResendTimer(60);
      setTimeout(() => digitRefs.current[0]?.focus(), 150);
    } else {
      setError(result.message);
    }
  };

  const handleDigitChange = (idx: number, value: string) => {
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
    updated[idx] = digit;
    setOtpDigits(updated);
    if (digit && idx < 5) digitRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      digitRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await verifyOtp(email, entered);
    setLoading(false);
    if (!result.success) {
      setError((result as { success: false; message: string }).message);
      return;
    }
    if (result.registered) {
      router.replace('/app/dashboard');
    } else {
      // New user — go to onboarding, pass temp_token via sessionStorage
      sessionStorage.setItem('sf_temp_token', result.tempToken);
      sessionStorage.setItem('sf_temp_email', result.email);
      router.replace('/onboarding');
    }
  };

  const handleDemo = () => {
    demoLogin();
    router.replace('/app/dashboard');
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(99,102,241,0.08),transparent)]" />
        {/* Animated dots */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-blue-500/40 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 rounded-full bg-indigo-500/40 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-cyan-500/40 animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50 space-y-7">
          {/* Brand */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 mx-auto flex items-center justify-center shadow-xl shadow-blue-500/25 relative">
              <Sparkles className="w-8 h-8 text-white" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                SkillForge <span className="text-blue-400">AI</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {step === 1 ? 'Career Intelligence Platform — Secure Sign In' : `Verification code sent to ${email}`}
              </p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                    s <= step ? 'bg-blue-500' : 'bg-slate-800'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  Student Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                id="auth-send-otp"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <span>Continue with Email</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  id="auth-demo-login"
                  type="button"
                  onClick={handleDemo}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Quick Demo Sign In (Saradhi)
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <button
                type="button"
                onClick={() => { setStep(1); setError(null); setOtpDigits(['','','','','','']); }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Change Email
              </button>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex items-center justify-between gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-digit-${idx}`}
                      ref={(el) => { digitRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className={`w-12 h-14 bg-slate-950 border rounded-xl text-center text-xl font-bold font-mono text-white focus:outline-none transition ${
                        digit
                          ? 'border-emerald-500/70 ring-1 ring-emerald-500/30'
                          : 'border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                id="auth-verify-otp"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Verify Code
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                <span className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Ready to resend'}
                </span>
                <button
                  type="button"
                  disabled={resendTimer > 0 || loading}
                  onClick={() => handleSendOtp()}
                  className="text-blue-400 hover:text-blue-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-500">
            By continuing, you agree to SkillForge AI's Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
