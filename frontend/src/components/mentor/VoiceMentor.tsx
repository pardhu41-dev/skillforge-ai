'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MentorMessage,
  mockPromptPills,
  mockMentorKnowledgeBase
} from '@/lib/mentorData';
import {
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Bot,
  User
} from 'lucide-react';

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: { [index: number]: SpeechRecognitionResultItem };
  length: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface WebSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: () => void;
}

export const VoiceMentor: React.FC = () => {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: 'm-1',
      sender: 'mentor',
      text: "Hello Saradhi! I am your SkillForge AI Voice Mentor. Ask me anything about your skill gaps, study schedule, or career readiness!",
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);

  const recognitionRef = useRef<WebSpeechRecognition | null>(null);

  // Initialize Web Speech API Recognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowObj = window as unknown as Record<string, new () => WebSpeechRecognition>;
      const SpeechRecognitionClass = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recognition: WebSpeechRecognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from({ length: event.results.length }, (_, i) => event.results[i][0].transcript).join('');
          setInputQuery(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);



  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Web Speech API recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputQuery('');
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputQuery;
    if (!textToSend.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const currentMsgCount = messages.length;
    const userMsg: MentorMessage = {
      id: `u-${currentMsgCount + 1}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    // AI Knowledge Base Response
    setTimeout(() => {
      const lower = textToSend.toLowerCase().trim();
      let responseText = "I analyzed your query. To optimize your learning velocity, focus on closing high-priority skill gaps and practicing hands-on problem sets in the Coding Lab.";

      for (const [key, answer] of Object.entries(mockMentorKnowledgeBase)) {
        if (lower.includes(key) || key.includes(lower)) {
          responseText = answer;
          break;
        }
      }

      const mentorMsg: MentorMessage = {
        id: `m-${currentMsgCount + 2}`,
        sender: 'mentor',
        text: responseText,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, mentorMsg]);
      setIsThinking(false);
      speakText(responseText);
    }, 600);
  };


  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              SkillForge AI Voice Mentor
            </h2>
            <p className="text-xs text-slate-400">
              Interactive Speech & Natural Language Learning Assistant
            </p>
          </div>
        </div>

        {/* Controls: Audio Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isSpeaking && typeof window !== 'undefined') window.speechSynthesis.cancel();
              setTtsEnabled(!ttsEnabled);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
              ttsEnabled
                ? 'bg-blue-600/15 border-blue-500/30 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />}
            <span>{ttsEnabled ? 'Voice On' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Visualizer (5 Cols) & Right Chat Stream (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Animated Pulsing Audio Visualizer */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-6 text-center">
          <div className="relative flex items-center justify-center">
            {/* Glowing Waveform Rings */}
            {isListening && (
              <>
                <div className="absolute w-48 h-48 rounded-full bg-cyan-500/20 animate-ping" />
                <div className="absolute w-40 h-40 rounded-full bg-blue-500/30 animate-pulse" />
              </>
            )}

            {isSpeaking && (
              <>
                <div className="absolute w-48 h-48 rounded-full bg-indigo-500/20 animate-ping" />
                <div className="absolute w-40 h-40 rounded-full bg-purple-500/30 animate-pulse" />
              </>
            )}

            {isThinking && (
              <div className="absolute w-44 h-44 rounded-full bg-amber-500/20 animate-spin" />
            )}

            {/* Core Visualizer Orb */}
            <button
              onClick={toggleListening}
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300 relative z-10 ${
                isListening
                  ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 scale-105 shadow-cyan-500/50 ring-4 ring-cyan-400/40'
                  : isSpeaking
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 scale-105 shadow-indigo-500/50 ring-4 ring-indigo-400/40'
                  : isThinking
                  ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/50'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:scale-105 shadow-blue-600/40'
              }`}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-bounce text-white" />
              ) : isSpeaking ? (
                <Volume2 className="w-10 h-10 animate-pulse text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : isThinking ? 'Analyzing...' : 'Tap to Speak'}
              </span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              {isListening ? 'Listening to your voice input...' : isSpeaking ? 'Mentor is explaining...' : isThinking ? 'Processing Knowledge Graph...' : 'Ready for Voice Conversation'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Click microphone to speak or click quick prompts below.
            </p>
          </div>
        </div>

        {/* Right Column: Chat Stream & Quick Prompts */}
        <div className="lg:col-span-7 flex flex-col h-[460px] justify-between space-y-4">
          {/* Quick Prompt Pills */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Suggested Mentor Queries:
            </span>
            <div className="flex flex-wrap gap-2">
              {mockPromptPills.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(pill)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition hover:border-blue-500/50"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Log Container */}
          <div className="flex-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-y-auto space-y-3 custom-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                      isUser
                        ? 'bg-gradient-to-tr from-indigo-500 to-purple-600'
                        : 'bg-gradient-to-tr from-cyan-500 to-blue-600'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-70 mt-1 block text-right">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic p-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Mentor is synthesizing AI guidance...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your question or click mic..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
