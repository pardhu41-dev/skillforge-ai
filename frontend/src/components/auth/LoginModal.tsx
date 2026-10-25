'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { sendOtp, verifyOtp, demoLogin, isAuthenticated } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState<string>('saradhi@skillforge.ai');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(60);

  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Timer Countdown
  useEffect(() => {
    if (step !== 2 || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen || isAuthenticated) return null;

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
      setStep(2);
      setResendTimer(60);

      setTimeout(() => {
        digitRefs.current[0]?.focus();
      }, 150);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of 6-digit code
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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await verifyOtp(email, enteredOtp);
    setLoading(false);

    if (result.success) {
      if (onClose) onClose();
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleDemoSignIn = () => {
    demoLogin();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-150 select-none">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            SkillForge <span className="text-blue-400">AI</span> Auth
          </h2>
          <p className="text-xs text-slate-400">
            Passwordless Email OTP Authentication
          </p>
        </div>

        {/* Step 1: Request OTP */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-400" />
                Student Email Address:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@skillforge.ai"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Sending OTP...</span>
              ) : (
                <>
                  <span>Send Passwordless OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Login Option */}
            <div className="pt-3 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>One-Click Demo Sign In (Saradhi)</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Verify 6-digit OTP */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Edit Email
              </button>
              <span className="text-xs text-slate-400 font-mono">{email}</span>
            </div>


            {/* 6-Digit OTP Boxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  Enter 6-Digit Verification Code:
                </span>
              </label>

              <div className="flex items-center justify-between gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      digitRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 bg-slate-950 border border-slate-800 rounded-xl text-center text-xl font-bold font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Verifying JWT Token...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Sign In</span>
                </>
              )}
            </button>

            {/* Resend Timer */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Code Expired'}
              </span>

              <button
                type="button"
                disabled={resendTimer > 0 || loading}
                onClick={() => handleSendOtp()}
                className="text-blue-400 hover:text-blue-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Resend OTP Code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
