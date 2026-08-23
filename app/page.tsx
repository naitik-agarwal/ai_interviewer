"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Editor, loader } from "@monaco-editor/react";
import { Send, Terminal, Play, Square, Loader2, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { problems } from "@/lib/problems";

// Configure Monaco Editor
loader.config({
  paths: { vs: "https://unpkg.com/monaco-editor@0.44.0/min/vs" },
});

export default function InterviewerDashboard() {
  // Randomly select a problem on initial load
  const [currentProblem] = useState(() => problems[Math.floor(Math.random() * problems.length)]);
  
  // UX Fix: Use a generic C++ boilerplate instead of the spoiling starter code
  const [code, setCode] = useState<string>(
`#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>

using namespace std;

// Wait for the interviewer to provide the problem,
// then write your optimal solution here...

int main() {
    
    return 0;
}`
  );
  
  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Evaluation States
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timer States (45 minutes = 2700 seconds)
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  // The new SDK v7+ syntax for passing a body payload
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { 
        problem: {
          title: currentProblem.title,
          description: currentProblem.description
        } 
      }
    })
  });

  // Timer Countdown Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Only tick if the interview has started (messages exist) and hasn't ended
    if (messages.length > 0 && !isInterviewEnded && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isInterviewEnded) {
      endInterview(); // Auto-fail/end when time runs out
    }

    return () => clearInterval(timer);
  }, [messages.length, isInterviewEnded, timeLeft]);

  // Helper function to format MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const payload = `${input}\n\n###CODE_STATE_DO_NOT_SHOW_IN_UI###\n${code}`;
    // Use sendMessage with the 'text' property
    sendMessage({ text: payload });
    setInput("");
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startInterview = () => {
    // Use sendMessage with the 'text' property
    sendMessage({ text: "Hello. I am ready to begin the technical interview." });
  };

  const endInterview = async () => {
    setIsInterviewEnded(true);
    setIsEvaluating(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate evaluation report.");
      }
      
      setReport(data.report);
    } catch (error: any) {
      setErrorMessage(
        error.message || "An error occurred while generating the report. You may have hit a rate limit. Wait a minute and try again."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const retryEvaluation = () => {
    endInterview();
  };

  const returnToChat = () => {
    setIsInterviewEnded(false);
  };

  // ------------------------------------------------------------------
  // UI: Evaluation Report Screen
  // ------------------------------------------------------------------
  if (isInterviewEnded) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 p-8 flex justify-center font-sans">
        <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <Terminal size={24} className="text-emerald-500" />
                <h1 className="font-semibold text-neutral-100 text-2xl">Interview Evaluation</h1>
              </div>
              <button
                onClick={returnToChat}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-md transition-colors"
              >
                ← Return to Transcript
              </button>
            </div>
            
            {isEvaluating ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 size={40} className="text-emerald-500 animate-spin" />
                <p className="text-neutral-400">The Hiring Committee is reviewing your transcript and code...</p>
              </div>
            ) : errorMessage ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                <p className="text-red-400 max-w-md">{errorMessage}</p>
                <button
                  onClick={retryEvaluation}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <RotateCcw size={16} />
                  Retry Evaluation
                </button>
              </div>
            ) : (
              <div className="prose prose-invert prose-emerald max-w-none">
                <ReactMarkdown>{report || ""}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // UI: Interview Dashboard
  // ------------------------------------------------------------------
  return (
    <div className="flex h-screen w-full bg-neutral-950 text-neutral-200 font-sans">
      
      {/* Left Panel: Chat Interface */}
      <div className="w-1/2 flex flex-col border-r border-neutral-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 p-4 bg-neutral-900">
          <div className="flex items-center gap-2">
            <Terminal size={20} className="text-emerald-500" />
            <h1 className="font-semibold text-neutral-100 text-lg">AI Interviewer</h1>
          </div>
          {messages.length > 0 && (
            <div className="flex items-center gap-4">
              {/* Ticking Countdown Timer */}
              <div className={`font-mono text-xl font-bold tracking-widest ${
                timeLeft <= 300 ? 'text-red-500 animate-pulse' : 'text-emerald-400'
              }`}>
                {formatTime(timeLeft)}
              </div>
              
              <button 
                onClick={endInterview}
                className="flex items-center gap-2 text-sm bg-red-900/50 hover:bg-red-900 text-red-200 px-3 py-1.5 rounded-md transition-colors border border-red-800/50"
              >
                <Square size={14} />
                End Interview
              </button>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <p className="text-neutral-400 text-base text-center max-w-md">
                You are about to start a 45-minute technical screen for an SDE position.
              </p>
              <button 
                onClick={startInterview}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Play size={18} />
                Start Interview
              </button>
            </div>
          ) : (
            messages.map((m) => (
              <div 
                key={m.id} 
                className={`p-4 rounded-lg max-w-[85%] ${
                  m.role === "user" 
                    ? "bg-neutral-800 self-end text-neutral-100" 
                    : "bg-neutral-900 border border-neutral-800 text-neutral-300 self-start"
                }`}
              >
                <div className="text-xs font-semibold mb-2 text-neutral-500 uppercase tracking-wider">
                  {m.role === "user" ? "You" : "Interviewer"}
                </div>
                <div className="text-base whitespace-pre-wrap leading-relaxed">
                  {m.parts?.map((part, index) => 
                    part.type === "text" ? (
                      <span key={index}>
                        {m.role === "user" 
                          ? part.text.split("\n\n###CODE_STATE_DO_NOT_SHOW_IN_UI###")[0] 
                          : part.text}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800">
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
              }}
              onKeyDown={onKeyDown}
              placeholder="Explain your approach... (Shift+Enter for new line)"
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-emerald-500 text-neutral-200 resize-none max-h-[150px] overflow-y-auto"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white p-3 rounded-lg transition-colors mb-0.5"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Code Scratchpad */}
      <div className="w-1/2 flex flex-col">
        <div className="border-b border-neutral-800 p-4 bg-neutral-900 flex justify-between items-center">
          <h2 className="font-semibold text-neutral-100 text-base">Code Scratchpad</h2>
          <span className="text-sm text-neutral-500 font-mono">C++</span>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
              padding: { top: 24 },
              scrollBeyondLastLine: false,
              wordWrap: "on",
            }}
          />
        </div>
      </div>
    </div>
  );
}