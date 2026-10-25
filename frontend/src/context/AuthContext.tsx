'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:8000/api/v1';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentSkillItem {
  name: string;
  category: string;
  self_declared: number;
  demonstrated_score: number;
  status: string;
}

export interface StudentProfile {
  id: number;
  email: string;
  name?: string;
  full_name: string;
  college?: string;
  branch: string;
  semester?: string | number;
  cgpa: number;
  target_role?: string;
  study_hours?: number;
  xp: number;
  streak_days: number;
  level: string;
  onboarding_complete?: boolean;
  skills?: StudentSkillItem[];
}

// Keep legacy export name for compatibility
export type StudentAuthProfile = StudentProfile;

export interface OnboardingPayload {
  email: string;
  temp_token: string;
  name: string;
  college: string;
  branch: string;
  semester: string;
  cgpa: number;
  target_role: string;
  study_hours: number;
  skills: { name: string; category: string; level: string }[];
}

interface AuthContextType {
  student: StudentProfile | null;
  /** @deprecated use student */
  user: StudentProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Core auth actions
  sendOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (
    email: string,
    otp: string
  ) => Promise<
    | { success: true; registered: true; student: StudentProfile }
    | { success: true; registered: false; tempToken: string; email: string }
    | { success: false; message: string }
  >;
  completeOnboarding: (payload: OnboardingPayload) => Promise<{ success: boolean; message: string }>;
  login: (token: string, student: StudentProfile) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  // Legacy helpers
  registerStudent: (payload: unknown) => Promise<{ success: boolean; message: string }>;
  demoLogin: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ── Hydrate from localStorage on mount ───────────────────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem('skillforge_token');
    if (savedToken) {
      // Validate token by calling /me
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          setToken(savedToken);
          setStudent(data.student);
          localStorage.setItem('skillforge_user', JSON.stringify(data.student));
        })
        .catch(() => {
          // Token invalid — clear storage
          localStorage.removeItem('skillforge_token');
          localStorage.removeItem('skillforge_user');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const login = useCallback((authToken: string, studentProfile: StudentProfile) => {
    setToken(authToken);
    setStudent(studentProfile);
    localStorage.setItem('skillforge_token', authToken);
    localStorage.setItem('skillforge_user', JSON.stringify(studentProfile));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setStudent(null);
    localStorage.removeItem('skillforge_token');
    localStorage.removeItem('skillforge_user');
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
        localStorage.setItem('skillforge_user', JSON.stringify(data.student));
      }
    } catch {
      // silent
    }
  }, [token]);

  // ── Auth actions ─────────────────────────────────────────────────────────

  const sendOtp = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message || 'OTP sent to your email' };
      }
      const err = await res.json();
      return { success: false, message: err.detail || 'Failed to send OTP' };
    } catch {
      return { success: false, message: 'Unable to connect to authentication server.' };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) {
        const err = await res.json();
        return { success: false as const, message: err.detail || 'Invalid OTP' };
      }
      const data = await res.json();
      if (data.registered) {
        login(data.access_token, data.student as StudentProfile);
        return { success: true as const, registered: true as const, student: data.student as StudentProfile };
      } else {
        return {
          success: true as const,
          registered: false as const,
          tempToken: data.temp_token as string,
          email: data.email as string,
        };
      }
    } catch {
      return { success: false as const, message: 'Unable to connect to authentication server.' };
    }
  };

  const completeOnboarding = async (payload: OnboardingPayload): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/complete-onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        login(data.access_token, data.student as StudentProfile);
        return { success: true, message: 'Onboarding complete!' };
      }
      const err = await res.json();
      return { success: false, message: err.detail || 'Onboarding failed' };
    } catch {
      return { success: false, message: 'Unable to connect to server.' };
    }
  };

  // ── Legacy: registerStudent ───────────────────────────────────────────────

  const registerStudent = async (payload: unknown): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        login(data.access_token, data.student as StudentProfile);
        return { success: true, message: 'Registration completed successfully' };
      }
      const err = await res.json();
      return { success: false, message: err.detail || 'Registration failed' };
    } catch {
      return { success: false, message: 'Unable to connect to registration server' };
    }
  };

  // ── Legacy: demoLogin ────────────────────────────────────────────────────

  const demoLogin = () => {
    const demoStudent: StudentProfile = {
      id: 1,
      email: 'saradhi@skillforge.ai',
      full_name: 'G. P. P. Saradhi',
      name: 'G. P. P. Saradhi',
      college: 'KL University',
      branch: 'B.Tech AI & DS',
      semester: '4-1',
      cgpa: 8.8,
      target_role: 'Machine Learning Engineer',
      study_hours: 3,
      xp: 1250,
      streak_days: 5,
      level: 'Level 4 - Advanced Apprentice',
      onboarding_complete: true,
      skills: [
        { name: 'Python', category: 'Programming', self_declared: 80, demonstrated_score: 85, status: 'Declared' },
        { name: 'SQL', category: 'Database', self_declared: 70, demonstrated_score: 75, status: 'Declared' },
        { name: 'Statistics', category: 'Mathematics', self_declared: 60, demonstrated_score: 65, status: 'Declared' },
        { name: 'Machine Learning', category: 'AI / ML', self_declared: 60, demonstrated_score: 60, status: 'Declared' },
        { name: 'Power BI', category: 'Analytics', self_declared: 50, demonstrated_score: 50, status: 'Declared' },
      ],
    };
    login('demo_jwt_token_saradhi', demoStudent);
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        user: student, // legacy alias
        token,
        isAuthenticated: !!student && !!token,
        isLoading,
        sendOtp,
        verifyOtp,
        completeOnboarding,
        login,
        logout,
        refreshProfile,
        registerStudent,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
