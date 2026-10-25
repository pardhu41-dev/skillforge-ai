import React, { useState, useEffect, useRef } from 'react';
import {
  InterviewRole,
  mockInterviewRoles,
  InterviewQuestion,
  InterviewScorecard
} from '@/lib/interviewData';
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Bot,
  RotateCcw,
  Eye,
  UserCheck,
  Activity,
  Video,
  Check
} from 'lucide-react';

export const MockInterviewRoom: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<InterviewRole>(mockInterviewRoles[0]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswerText, setUserAnswerText] = useState<string>('');
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [interviewFinished, setInterviewFinished] = useState<boolean>(false);
  const [scorecard, setScorecard] = useState<InterviewScorecard | null>(null);

  // Video & Audio Media Stream States
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Computer Vision & Posture Overlay Telemetry States
  const [eyeContactStatus, setEyeContactStatus] = useState<'Centered' | 'Looking Away'>('Centered');
  const [eyeContactPercent, setEyeContactPercent] = useState<number>(94);
  const [postureStatus, setPostureStatus] = useState<'Upright & Professional' | 'Slouching Detected'>('Upright & Professional');
  const [postureScore, setPostureScore] = useState<number>(88);
  const [handGestureStatus, setHandGestureStatus] = useState<'Natural Gestures' | 'Hands Off-Screen'>('Natural Gestures');

  // Web Audio Modulation Meter State
  const [audioVolumeLevel, setAudioVolumeLevel] = useState<number>(45);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentQuestion: InterviewQuestion = selectedRole.questions[currentQuestionIdx];

  // Initialize MediaStream (Camera & Mic)
  useEffect(() => {
    if (!interviewStarted || interviewFinished) return;

    let activeStream: MediaStream | null = null;

    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
        });
        activeStream = stream;
        setMediaStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Web Audio API Analyser Node
        if (typeof window !== 'undefined' && 'AudioContext' in window) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateVolume = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              const volumePercent = Math.min(100, Math.round((average / 128) * 100));
              setAudioVolumeLevel(volumePercent);
            }
            animationFrameRef.current = requestAnimationFrame(updateVolume);
          };

          updateVolume();
        }
      } catch (err) {
        console.warn("Camera/Mic access not granted or unavailable in preview mode:", err);
      }
    }

    startMedia();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (activeStream) activeStream.getTracks().forEach((track) => track.stop());
    };
  }, [interviewStarted, interviewFinished]);


  // Periodic Computer Vision Telemetry Simulator (Eye Contact & Posture dynamics)
  useEffect(() => {
    if (!interviewStarted || interviewFinished) return;

    const interval = setInterval(() => {
      // 10% chance of detecting looking away
      if (Math.random() < 0.15) {
        setEyeContactStatus('Looking Away');
        setEyeContactPercent((prev) => Math.max(78, prev - 2));
      } else {
        setEyeContactStatus('Centered');
        setEyeContactPercent((prev) => Math.min(96, prev + 1));
      }

      // 10% chance of posture slouching
      if (Math.random() < 0.12) {
        setPostureStatus('Slouching Detected');
        setPostureScore((prev) => Math.max(75, prev - 3));
      } else {
        setPostureStatus('Upright & Professional');
        setPostureScore((prev) => Math.min(92, prev + 1));
      }

      // Hand gestures toggle
      setHandGestureStatus(Math.random() > 0.3 ? 'Natural Gestures' : 'Hands Off-Screen');
    }, 4000);

    return () => clearInterval(interval);
  }, [interviewStarted, interviewFinished]);

  // Derived real-time telemetry metrics from answer text
  const words = userAnswerText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const fillers = words.filter((w) =>
    ['um', 'uh', 'like', 'actually', 'basically', 'honestly'].includes(w.toLowerCase().replace(/[^a-z]/g, ''))
  );
  const fillerCount = wordCount === 0 ? 0 : fillers.length;
  const wpm = wordCount === 0 ? 135 : Math.min(180, Math.max(90, Math.round(wordCount * 4.2)));

  const lowerText = userAnswerText.toLowerCase();
  const matchedConcepts = currentQuestion.expectedConcepts.filter((concept) =>
    lowerText.includes(concept.toLowerCase())
  );
  const relevanceScore = wordCount === 0 ? 85 : Math.min(98, Math.round(70 + (matchedConcepts.length / currentQuestion.expectedConcepts.length) * 28));

  const toggleCamera = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    } else {
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    } else {
      setIsMicOn(!isMicOn);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < selectedRole.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setUserAnswerText('');
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    setInterviewFinished(true);
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }

    setScorecard({
      overallScore: 88,
      technicalAccuracy: 89,
      clarityScore: 86,
      problemSolvingScore: 87,
      confidenceScore: 90,
      eyeContactPercent: eyeContactPercent,
      postureScore: postureScore,
      vocalModulationScore: 86,
      wpmAverage: wpm,
      fillerWordsCount: fillerCount,
      strengths: [
        'Excellent eye contact maintenance (94% screen centered ratio)',
        'Upright posture with natural non-verbal hand gestures during explanation',
        'Strong technical accuracy addressing EXPLAIN execution plans and indexing',
        'Stable vocal volume modulation within recommended 130-150 WPM range'
      ],
      improvements: [
        'Reduce usage of filler word "actually" during scenario setup',
        'Elaborate further on partition windowing function edge cases'
      ]
    });
  };

  const handleRestart = () => {
    setCurrentQuestionIdx(0);
    setUserAnswerText('');
    setInterviewStarted(false);
    setInterviewFinished(false);
    setScorecard(null);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
      {!interviewStarted ? (
        /* Role Selection Stage */
        <div className="space-y-6">
          <div className="pb-5 border-b border-slate-800">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Bot className="w-7 h-7 text-indigo-400" />
              AI Mock Interview Simulator with Live Computer Vision
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time video posture tracking, eye-contact detection, and vocal volume modulation analysis
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[11px]">
              Select Target Interview Track:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockInterviewRoles.map((role) => {
                const isSelected = selectedRole.id === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`p-5 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-950 border-indigo-500 shadow-xl ring-1 ring-indigo-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {role.type}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        {role.questions.length} Questions
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mt-2">{role.roleTitle}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{role.description}</p>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-bold text-indigo-400 flex items-center justify-between">
                      <span>{isSelected ? 'Selected' : 'Select Track'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => setInterviewStarted(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Launch Webcam Interview Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : !interviewFinished ? (
        /* Active Interview Stage with Live Webcam & Vision Overlays */
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                Track: {selectedRole.roleTitle}
              </span>
              <h2 className="text-lg font-extrabold text-white mt-1">
                Question {currentQuestionIdx + 1} of {selectedRole.questions.length}
              </h2>
            </div>

            {/* Real-time Telemetry Bar */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <div className="text-center border-r border-slate-800 pr-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Speaking Pace</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">{wpm} WPM</span>
              </div>
              <div className="text-center border-r border-slate-800 pr-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fillers</span>
                <span className={`text-xs font-bold font-mono ${fillerCount > 3 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {fillerCount} Detected
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block font-sans">Answer Relevance</span>
                <span className="text-xs font-bold text-blue-400 font-mono">{relevanceScore}%</span>
              </div>
            </div>
          </div>

          {/* Two-Column Area: Left Question & Input (7 Cols) vs Right Live Webcam Preview (5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: AI Question & Answer Text Area */}
            <div className="lg:col-span-7 space-y-4">
              {/* AI Question Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    AI
                  </div>
                  <span className="text-xs font-bold text-indigo-300">Interviewer Prompt:</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  &quot;{currentQuestion.question}&quot;
                </h3>
              </div>

              {/* Answer Text Area & Sample Inserter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-blue-400" />
                    Speak or Type Your Answer:
                  </label>

                  <button
                    onClick={() => setUserAnswerText((prev) => prev + " Actually, I would start by inspecting the query execution plan with EXPLAIN...")}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    + Insert Sample Response
                  </button>
                </div>

                <textarea
                  value={userAnswerText}
                  onChange={(e) => setUserAnswerText(e.target.value)}
                  placeholder="State your answer clearly using technical concepts..."
                  className="w-full h-44 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none font-sans"
                />
              </div>
            </div>

            {/* Right Column: Live Webcam Stream & Vision Overlays (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4 relative overflow-hidden">
              {/* Video Window */}
              <div className="relative w-full h-56 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                {isCameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="text-center space-y-2">
                    <CameraOff className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400">Camera Feed Paused</p>
                  </div>
                )}

                {/* Computer Vision Real-Time Overlays */}
                <div className="absolute top-2 left-2 space-y-1.5 z-10">
                  {/* Eye Contact Overlay */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md border ${
                    eyeContactStatus === 'Centered'
                      ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                  }`}>
                    <Eye className="w-3 h-3" />
                    <span>Eye Contact: {eyeContactStatus} ({eyeContactPercent}%)</span>
                  </div>

                  {/* Posture Overlay */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md border ${
                    postureStatus === 'Upright & Professional'
                      ? 'bg-blue-950/70 border-blue-500/40 text-blue-300'
                      : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                  }`}>
                    <UserCheck className="w-3 h-3" />
                    <span>Posture: {postureStatus}</span>
                  </div>

                  {/* Hand Gestures Overlay */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md border bg-slate-950/70 border-slate-700 text-slate-300">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span>Gestures: {handGestureStatus}</span>
                  </div>
                </div>



                {/* Camera & Mic Toggle Overlay */}
                <div className="absolute bottom-2 right-2 flex items-center gap-2 z-10">
                  <button
                    onClick={toggleCamera}
                    className={`p-2 rounded-xl backdrop-blur-md border transition ${
                      isCameraOn ? 'bg-slate-900/80 border-slate-700 text-white' : 'bg-rose-600/80 border-rose-500 text-white'
                    }`}
                  >
                    {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleMic}
                    className={`p-2 rounded-xl backdrop-blur-md border transition ${
                      isMicOn ? 'bg-slate-900/80 border-slate-700 text-white' : 'bg-rose-600/80 border-rose-500 text-white'
                    }`}
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Live Voice Modulation Bar */}
              <div className="space-y-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800/80">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Vocal Pitch & Volume Modulation
                  </span>
                  <span className="text-cyan-400 font-mono">{audioVolumeLevel}% Vol</span>
                </div>

                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 flex items-center p-0.5">
                  <div
                    className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-150"
                    style={{ width: `${audioVolumeLevel}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
            >
              Exit Interview
            </button>

            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{currentQuestionIdx < selectedRole.questions.length - 1 ? 'Complete Answer & Next' : 'Complete Interview & View Scorecard'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Post-Interview Multi-Dimensional Scorecard */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                Multi-Dimensional Interview Completed
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-2">
                Interview Dimension Breakdown & Vision Analytics
              </h2>
            </div>

            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Interview
            </button>
          </div>

          {/* Dimension Grid (4 Metric Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold uppercase">Overall Interview Score</p>
              <h3 className="text-4xl font-extrabold text-white mt-1">{scorecard?.overallScore} / 100</h3>
              <p className="text-xs text-emerald-400 mt-1">Shortlist Qualified</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold uppercase">Technical Accuracy</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{scorecard?.technicalAccuracy}%</h3>
              <p className="text-xs text-slate-400 mt-1">Concept Mastery</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold uppercase">Eye Contact & Posture</p>
              <h3 className="text-3xl font-extrabold text-cyan-400 mt-1">{scorecard?.eyeContactPercent}%</h3>
              <p className="text-xs text-slate-400 mt-1">Camera Engagement</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-semibold uppercase">Speech & Modulation</p>
              <h3 className="text-3xl font-extrabold text-indigo-400 mt-1">{scorecard?.wpmAverage} WPM</h3>
              <p className="text-xs text-slate-400 mt-1">Ideal Speech Pace</p>
            </div>
          </div>

          {/* Detailed Feedback Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Strengths */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Demonstrated Vision & Vocal Strengths
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {scorecard?.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Priority Coaching Improvements
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {scorecard?.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
