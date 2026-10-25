'use client';

import React, { useState, useEffect } from 'react';
import {
  QuizQuestion,
  mockQuizQuestions,
  QuizDiagnosticResult
} from '@/lib/assessmentData';
import {
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Zap,
  Check
} from 'lucide-react';


export const AdaptiveQuiz: React.FC = () => {
  const [questions] = useState<QuizQuestion[]>(mockQuizQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(600); // 10 minutes (600 seconds)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<QuizDiagnosticResult | null>(null);

  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const currentQuestion = questions[currentIndex];


  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const domainScores: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, idx) => {
      if (!domainScores[q.domain]) {
        domainScores[q.domain] = { correct: 0, total: 0 };
      }
      domainScores[q.domain].total += 1;

      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount += 1;
        domainScores[q.domain].correct += 1;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const xpEarned = Math.round((scorePercent / 100) * 150) + 50;

    const masteryBreakdown = Object.keys(domainScores).map((domain) => ({
      domain,
      score: Math.round((domainScores[domain].correct / domainScores[domain].total) * 100)
    }));

    let recommendation = 'Great job! Your domain knowledge is strong across all tested areas.';
    if (scorePercent < 70) {
      recommendation = 'Recommended Review: Revisit Python Advanced Concepts & SQL Relational Algebra prerequisites before re-assessing.';
    } else if (scorePercent < 90) {
      recommendation = 'Recommended Focus: Practice nested subqueries and SQL Cartesian join edge cases.';
    }

    setDiagnosticResult({
      scorePercent,
      correctAnswersCount: correctCount,
      totalQuestions: questions.length,
      xpEarned,
      masteryBreakdown,
      recommendation
    });
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(600);
    setIsSubmitted(false);
    setDiagnosticResult(null);
  };

  const getDifficultyBadge = (diff: QuizQuestion['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">Easy</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">Medium</span>;
      case 'Hard':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold">Hard</span>;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl space-y-6">
      {!isSubmitted ? (
        <>
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  Adaptive Engine
                </span>
                <span className="text-xs text-slate-400 font-medium">Domain: {currentQuestion.domain}</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Question {currentIndex + 1} of {questions.length}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Difficulty Badge */}
              {getDifficultyBadge(currentQuestion.difficulty)}

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono text-xs font-bold text-amber-400">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Optional Code Snippet */}
            {currentQuestion.codeSnippet && (
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isOptionSelected = selectedAnswers[currentIndex] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isOptionSelected
                      ? 'bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/40 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition ${
                        isOptionSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Control Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition"
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Submit Assessment
              </button>
            )}
          </div>
        </>
      ) : (
        /* Submission Diagnostic Card */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                Assessment Completed
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-2">
                Diagnostic Mastery Report
              </h2>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Assessment
            </button>
          </div>

          {/* Top Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold uppercase">Overall Score</p>
              <h3 className="text-4xl font-extrabold text-white mt-1">
                {diagnosticResult?.scorePercent}%
              </h3>
              <p className="text-xs text-emerald-400 mt-1">
                {diagnosticResult?.correctAnswersCount} / {diagnosticResult?.totalQuestions} Correct
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold uppercase">XP Earned</p>
              <h3 className="text-4xl font-extrabold text-blue-400 mt-1 flex items-center justify-center gap-1">
                <Zap className="w-7 h-7 text-blue-400 fill-blue-400" />
                +{diagnosticResult?.xpEarned}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Rank XP Awarded</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold uppercase">Confidence Level</p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-3">
                {diagnosticResult && diagnosticResult.scorePercent >= 80 ? 'Verified High' : 'Verified Medium'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Empirical Evidence Assertion</p>
            </div>
          </div>

          {/* Concept Mastery Breakdown */}
          <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Concept Mastery Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {diagnosticResult?.masteryBreakdown.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.domain}</span>
                    <span className="font-bold text-blue-400">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        item.score >= 80 ? 'bg-emerald-400' : item.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Targeted Recommendation Box */}
          <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h5 className="font-bold text-blue-300">Targeted Feedback & Prerequisite Review</h5>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                {diagnosticResult?.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
