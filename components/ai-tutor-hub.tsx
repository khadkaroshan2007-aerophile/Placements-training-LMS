"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  BrainCircuit,
  Check,
  Code,
  Copy,
  Flame,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  User,
  Zap,
} from "lucide-react";
import { learningCourses } from "@/lib/learning-data";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  topic?: string;
  modelUsed?: string;
};

const TUTOR_MODES = [
  { id: "concept", label: "Concept & Intuition", icon: Lightbulb, promptPrefix: "Explain the core concept and real-world intuition for: " },
  { id: "code", label: "Code & Patterns", icon: Code, promptPrefix: "Provide a clean, production-grade code implementation, edge-case checklist, and dry-run for: " },
  { id: "drill", label: "Mock Question Drill", icon: Target, promptPrefix: "Ask me a challenging placement interview question on this topic and wait for my response: " },
  { id: "traps", label: "Interviewer Traps", icon: Zap, promptPrefix: "What tricky questions, anti-patterns, or subtle traps do tech interviewers test candidates on for: " },
];

export function AiTutorHub() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("dsa-foundations");
  const [selectedTopic, setSelectedTopic] = useState<string>("Arrays and Index Access");
  const [activeMode, setActiveMode] = useState<string>("concept");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentCourse = learningCourses.find((c) => c.id === selectedCourseId) || learningCourses[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-init",
      role: "assistant",
      text: `👋 **Welcome to PlacePrep Gemini AI Tutor!**

I'm your 24/7 technical placement mentor. I can help you:
- 💡 **Understand complex algorithms & aptitude concepts** with visual intuition
- 💻 **Write clean, optimal code** with step-by-step dry runs and complexity proofs
- 🎯 **Drill live interview questions** and evaluate your answers
- ⚠️ **Avoid interviewer traps** and subtle edge-case errors

Select a topic on the left or type any technical/placement question below to get started!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(textToSend?: string) {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      text: query,
      topic: selectedTopic,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    const activeLesson = currentCourse.curriculum.find((l) => l.title === selectedTopic);

    try {
      const response = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          topicTitle: selectedTopic,
          courseTitle: currentCourse.title,
          courseCategory: currentCourse.category,
          contentContext: activeLesson?.content || "",
          codeContext: activeLesson?.codeSnippet || "",
          formulaContext: activeLesson?.formula || "",
          history: nextHistory.map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      const data = (await response.json()) as { reply?: string; modelUsed?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error || "Failed to receive AI tutor answer.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "assistant-" + Date.now(),
          role: "assistant",
          text: data.reply || "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modelUsed: data.modelUsed,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + Date.now(),
          role: "assistant",
          text: `⚠️ **AI Tutor Notice**: ${err instanceof Error ? err.message : "Unable to reach Gemini AI Tutor right now. Please try again."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickModeClick(modeId: string) {
    setActiveMode(modeId);
    const mode = TUTOR_MODES.find((m) => m.id === modeId);
    if (mode) {
      handleSend(`${mode.promptPrefix}${selectedTopic} (${currentCourse.title})`);
    }
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function resetChat() {
    setMessages([
      {
        id: "reset-" + Date.now(),
        role: "assistant",
        text: `Chat reset! I'm ready to help with **${selectedTopic}** in **${currentCourse.title}**. What would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  return (
    <div className="content learning-page">
      {/* Page Header */}
      <div className="welcome">
        <div>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={14} style={{ color: "var(--purple)" }} /> 24/7 PLACEMENT MENTOR
          </div>
          <h1>Gemini AI Tutor</h1>
          <p>
            Interactive technical instructor for campus placement rounds, algorithmic problem-solving, quantitative reasoning, and behavioral mastery.
          </p>
        </div>
        <span className="date-pill" style={{ background: "#ecfdf5", color: "#047857", borderColor: "#a7f3d0" }}>
          <Bot size={15} /> Powered by Gemini
        </span>
      </div>

      {/* Main Tutor Workspace Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>
        {/* Left Sidebar: Course & Topic Picker */}
        <aside className="card" style={{ padding: "18px 16px" }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            SELECT SUBJECT & TOPIC
          </div>

          {/* Course Tabs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
            {learningCourses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => {
                  setSelectedCourseId(course.id);
                  if (course.curriculum.length > 0) {
                    setSelectedTopic(course.curriculum[0].title);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: selectedCourseId === course.id ? "1.5px solid var(--purple)" : "1px solid #e2e8f0",
                  background: selectedCourseId === course.id ? "#f5f3ff" : "#fff",
                  color: selectedCourseId === course.id ? "var(--purple)" : "var(--ink)",
                  fontWeight: selectedCourseId === course.id ? 700 : 500,
                  fontSize: 12,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>{course.title}</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>{course.curriculum.length} topics</span>
              </button>
            ))}
          </div>

          {/* Curriculum Topic List */}
          <div className="eyebrow" style={{ marginBottom: 8, fontSize: 10 }}>
            {currentCourse.title.toUpperCase()} TOPICS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 340, overflowY: "auto", paddingRight: 4 }}>
            {currentCourse.curriculum.map((lesson, idx) => (
              <button
                key={lesson.title}
                type="button"
                onClick={() => setSelectedTopic(lesson.title)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "none",
                  background: selectedTopic === lesson.title ? "var(--purple)" : "transparent",
                  color: selectedTopic === lesson.title ? "#fff" : "var(--ink)",
                  fontSize: 12,
                  fontWeight: selectedTopic === lesson.title ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 10, opacity: 0.8, minWidth: 16 }}>{idx + 1}.</span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lesson.title}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Right Area: Interactive AI Chat Room */}
        <main className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 620 }}>
          {/* Tutor Room Header */}
          <div
            style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, opacity: 0.9 }}>
                <span>{currentCourse.category.toUpperCase()}</span>
                <span>•</span>
                <span>{currentCourse.title}</span>
              </div>
              <h2 style={{ margin: "3px 0 0", fontSize: 18, color: "#fff", fontWeight: 700 }}>
                {selectedTopic}
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={resetChat}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: 0,
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontWeight: 600,
                }}
              >
                <RefreshCw size={13} /> Reset Chat
              </button>
            </div>
          </div>

          {/* Quick Action Mode Chips */}
          <div
            style={{
              padding: "10px 18px",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
              Tutor Drills:
            </span>
            {TUTOR_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickModeClick(mode.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: activeMode === mode.id ? "#ede9fe" : "#fff",
                    color: activeMode === mode.id ? "#5b21b6" : "#334155",
                    border: activeMode === mode.id ? "1.5px solid #8b5cf6" : "1px solid #cbd5e1",
                    padding: "5px 11px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  }}
                >
                  <Icon size={12} style={{ color: activeMode === mode.id ? "#7c3aed" : "#64748b" }} />
                  {mode.label}
                </button>
              );
            })}
          </div>

          {/* Chat Messages Log */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              maxHeight: "440px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              background: "#fcfcff",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: m.role === "user" ? "82%" : "95%",
                }}
              >
                {m.role === "assistant" && (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Bot size={17} />
                  </div>
                )}
                <div
                  style={{
                    background: m.role === "user" ? "#4f46e5" : "#fff",
                    color: m.role === "user" ? "#fff" : "var(--ink)",
                    border: m.role === "user" ? "none" : "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontSize: 13,
                    lineHeight: 1.7,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                      fontSize: 11,
                      opacity: 0.75,
                      gap: 12,
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>
                      {m.role === "user" ? "You" : "PlacePrep AI Tutor (Gemini)"}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span suppressHydrationWarning>{m.timestamp}</span>
                      {m.role === "assistant" && (
                        <button
                          type="button"
                          onClick={() => handleCopy(m.text, m.id)}
                          style={{
                            border: 0,
                            background: "transparent",
                            cursor: "pointer",
                            color: "inherit",
                            padding: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="Copy message"
                        >
                          {copiedId === m.id ? <Check size={12} style={{ color: "#22c55e" }} /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>
                  </div>
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#e2e8f0",
                      color: "#475569",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 12, alignItems: "center", paddingLeft: 44, color: "#6366f1", fontSize: 13 }}>
                <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} />
                <span>Gemini AI Tutor is formulating an in-depth explanation...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "14px 18px",
              background: "#fff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask Gemini Tutor about ${selectedTopic} or any coding / placement doubt...`}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 9,
                border: "1px solid #cbd5e1",
                fontSize: 13,
                outline: "none",
                background: "#f8fafc",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: "#4f46e5",
                color: "#fff",
                border: 0,
                padding: "12px 20px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 700,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Send size={15} /> Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

