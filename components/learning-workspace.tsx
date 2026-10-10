"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Clock3,
  Code,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Lightbulb,
  ListChecks,
  Loader2,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { learningAssessments, learningCourses, type CurriculumLesson } from "@/lib/learning-data";
import { LoadingState } from "@/components/dashboard-ui";
import { useLearningState, type QuizResult } from "@/components/learning-state";
import { ErrorState } from "@/components/error-state";

export function CourseCatalogue() {
  const { state, setState, ready, syncEnabled, syncError } = useLearningState();
  const [filter, setFilter] = useState("All courses");
  const categories = ["All courses", ...new Set(learningCourses.map((course) => course.category))];
  const courses = filter === "All courses" ? learningCourses : learningCourses.filter((course) => course.category === filter);

  function toggle(courseId: string) {
    setState((current) => ({
      ...current,
      enrolled: current.enrolled.includes(courseId)
        ? current.enrolled.filter((id) => id !== courseId)
        : [...current.enrolled, courseId],
    }));
  }

  return (
    <div className="content learning-page">
      <div className="welcome">
        <div>
          <div className="eyebrow">LEARN WITH PURPOSE</div>
          <h1>Course catalogue</h1>
          <p>Structured courses packed with pre-written study materials, code snippets, formulas, and placement interview cheat sheets.</p>
        </div>
        <span className="date-pill">
          <BookOpen size={15} /> {state.enrolled.length} enrolled
        </span>
      </div>
      <div className="learning-status">
        {ready ? (
          syncEnabled ? (
            "Progress syncs to your account."
          ) : (
            "Progress saves in this browser. Sign in with Supabase to sync across devices."
          )
        ) : (
          <LoadingState label="Loading saved progress" />
        )}
      </div>
      {syncError && <ErrorState message={`${syncError} Your local progress remains available.`} />}
      <div className="learning-filters" aria-label="Filter courses">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={filter === category ? "selected" : ""}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="learning-grid">
        {courses.map((course) => {
          const enrolled = state.enrolled.includes(course.id);
          const progress = state.progress[course.id] ?? 0;
          const completeCount = Math.min(course.lessons, Math.round((progress * course.lessons) / 100));
          return (
            <article className="card learning-card" key={course.id}>
              <div className={`learning-card-art ${course.tone}`}>
                <span>{course.category}</span>
                <BookOpen size={25} />
              </div>
              <div className="learning-card-content">
                <div className="course-meta">
                  <span>{course.level}</span>
                  <span>
                    <Clock3 size={13} /> {course.duration}
                  </span>
                  <span>{course.lessons} topics & study notes</span>
                </div>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                {enrolled && (
                  <div className="lesson-progress">
                    <div className="course-progress-head">
                      <span>
                        {completeCount} of {course.lessons} lessons
                      </span>
                      <b>{progress}%</b>
                    </div>
                    <div className="bar">
                      <i style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}
                {enrolled ? (
                  <Link className="learning-button secondary" href={`/courses/${course.id}`}>
                    {progress >= 100 ? "Review study notes" : "Open study room"}
                    <ArrowRight size={15} />
                  </Link>
                ) : (
                  <button className="learning-button" type="button" disabled={!ready} onClick={() => toggle(course.id)}>
                    Enroll in course
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {!courses.length && (
        <div className="card learning-empty">
          <Sparkles size={22} />
          <h2>No courses in this category</h2>
          <p>Choose another category to keep exploring.</p>
        </div>
      )}
    </div>
  );
}

type TutorMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  modelUsed?: string;
};

function TopicAiTutor({
  lesson,
  courseTitle,
  courseCategory,
}: {
  lesson: CurriculumLesson;
  courseTitle: string;
  courseCategory: string;
}) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Initialize welcome message when topic changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome-" + lesson.title,
        role: "assistant",
        text: `👋 Hi! I'm your **Gemini AI Placement Tutor** for **${lesson.title}**.\n\nAsk me any questions, request code dry-runs, or click a quick prompt below to test your knowledge!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [lesson.title]);

  async function sendMessage(textToSend?: string) {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: TutorMessage = {
      id: "user-" + Date.now(),
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          topicTitle: lesson.title,
          courseTitle,
          courseCategory,
          contentContext: lesson.content,
          codeContext: lesson.codeSnippet,
          formulaContext: lesson.formula,
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
          text: `⚠️ **AI Tutor Notice**: ${err instanceof Error ? err.message : "Unable to connect right now. Please try again."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const quickPrompts = [
    { label: "💡 Explain Simply", prompt: `Can you explain ${lesson.title} with an intuitive real-world analogy and beginner-friendly breakdown?` },
    { label: "💻 Code & Edge Cases", prompt: `Show me the optimal code implementation pattern for ${lesson.title} and explain key edge cases to watch out for.` },
    { label: "🎯 Interview Quiz", prompt: `Ask me a realistic placement interview challenge question on ${lesson.title} and see if I can solve it.` },
    { label: "⚠️ Common Traps", prompt: `What tricky questions or traps do top tech interviewers usually ask regarding ${lesson.title}?` },
  ];

  return (
    <div style={{ margin: "24px 0", borderRadius: 14, background: "linear-gradient(180deg, #fbfbfe 0%, #f4f4fa 100%)", border: "1px solid #e0e0f0", boxShadow: "0 4px 20px -2px rgba(99,102,241,0.06)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "12px 18px", background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={19} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              AI Placement Tutor
              <span style={{ fontSize: 9, background: "rgba(255,255,255,0.25)", padding: "1px 5px", borderRadius: 4, fontWeight: 800, letterSpacing: 0.5 }}>
                GEMINI AI
              </span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>24/7 Doubts, Code Walkthroughs & Interview Drills</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => setMessages([{
              id: "welcome-" + Date.now(),
              role: "assistant",
              text: `Chat reset! Ask me anything about **${lesson.title}**.`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }])}
            style={{ background: "rgba(255,255,255,0.15)", border: 0, color: "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            title="Clear Chat"
          >
            <RefreshCw size={11} /> Clear
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ background: "rgba(255,255,255,0.15)", border: 0, color: "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}
          >
            {isExpanded ? "Hide" : "Show Tutor"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: "16px 18px" }}>
          {/* Quick Prompts */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginRight: 2 }}>
              Ask Tutor:
            </span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => sendMessage(qp.prompt)}
                style={{
                  background: "#fff",
                  border: "1px solid #dcdce8",
                  padding: "5px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#4338ca",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Conversation Thread */}
          <div style={{ maxHeight: 360, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingRight: 4, marginBottom: 14 }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: m.role === "user" ? "85%" : "100%",
                }}
              >
                {m.role === "assistant" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Bot size={16} />
                  </div>
                )}
                <div
                  style={{
                    background: m.role === "user" ? "#4f46e5" : "#fff",
                    color: m.role === "user" ? "#fff" : "var(--ink)",
                    border: m.role === "user" ? 0 : "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontSize: 13,
                    lineHeight: 1.6,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <div style={{ marginBottom: 4, fontSize: 10, opacity: 0.7, display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span>{m.role === "user" ? "You" : "Gemini AI Tutor"}</span>
                    <span suppressHydrationWarning>{m.timestamp}</span>
                  </div>
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e2e8f0", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 10, alignItems: "center", color: "#6366f1", fontSize: 12, paddingLeft: 38 }}>
                <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                <span>Gemini AI Tutor is thinking...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask AI Tutor a question about ${lesson.title}...`}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                fontSize: 13,
                outline: "none",
                background: "#fff",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: "#4f46e5",
                color: "#fff",
                border: 0,
                padding: "10px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Send size={14} /> Ask
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export function CourseRoom({ courseId }: { courseId: string }) {
  const course = learningCourses.find((item) => item.id === courseId);
  const { state, setState, ready, syncEnabled, syncError } = useLearningState();
  const [selectedLesson, setSelectedLesson] = useState(0);

  // Student Personal Notes per topic
  const [personalNotes, setPersonalNotes] = useState("");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  const storageKey = course ? `placeprep_notes_${course.id}_${selectedLesson}` : "";

  // Load saved personal notes from localStorage when switching topic
  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      setPersonalNotes(saved || "");
    } catch {
      setPersonalNotes("");
    }
  }, [storageKey]);

  // Save personal notes to localStorage
  function handleNotesChange(content: string) {
    setPersonalNotes(content);
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, content);
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (e) {
      console.warn("Could not auto-save notes to localStorage", e);
    }
  }

  function handleCopy(textToCopy: string, label = "Code") {
    navigator.clipboard.writeText(textToCopy);
    setCopyFeedback(`${label} copied!`);
    setTimeout(() => setCopyFeedback(""), 2200);
  }

  function downloadPersonalNotes() {
    if (!course) return;
    const currentLesson = course.curriculum[selectedLesson];
    const header = `# Study Notes: ${currentLesson.title}\nCourse: ${course.title}\n\n---\n\n`;
    const blob = new Blob([header + (personalNotes || "No notes added yet.")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${course.id}-topic-${selectedLesson + 1}-notes.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!course) {
    return (
      <div className="content">
        <div className="card learning-empty">
          <h1>Course not found</h1>
          <p>This course may have moved or the link may be incomplete.</p>
          <Link className="text-link" href="/courses">
            Back to courses <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  const enrolled = state.enrolled.includes(course.id);
  const progress = state.progress[course.id] ?? 0;
  const completedLessons = Math.min(course.lessons, Math.round((progress * course.lessons) / 100));
  const lesson: CurriculumLesson = course.curriculum[selectedLesson] || {
    title: "Lesson",
    content: "Content loading...",
    keyTakeaway: "",
    interviewTip: "",
    cheatSheet: [],
  };

  function enroll() {
    setState((current) => ({ ...current, enrolled: [...current.enrolled, course!.id] }));
  }

  function completeLesson() {
    if (selectedLesson === completedLessons && completedLessons < course!.lessons) {
      const nextCount = Math.min(course!.lessons, completedLessons + 1);
      setState((current) => ({
        ...current,
        enrolled: current.enrolled.includes(course!.id) ? current.enrolled : [...current.enrolled, course!.id],
        progress: { ...current.progress, [course!.id]: Math.round((nextCount / course!.lessons) * 100) },
      }));
      setSelectedLesson(Math.min(course!.lessons - 1, selectedLesson + 1));
    }
  }

  return (
    <div className="content learning-page course-room-page">
      <div className="welcome">
        <div>
          <Link className="text-link" href="/courses">
            ← Course catalogue
          </Link>
          <div className="eyebrow" style={{ marginTop: 13 }}>
            {course.category.toUpperCase()} STUDY ROOM
          </div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
        <span className="date-pill">
          <BookOpen size={15} /> {ready ? `${completedLessons}/${course.lessons} completed` : "Loading"}
        </span>
      </div>

      <div className="learning-status" role="status">
        {syncEnabled ? "Progress syncs to your account." : "Progress & personal notes save in this browser."}
      </div>
      {syncError && <ErrorState message={`${syncError} Your local progress remains available.`} />}

      {!ready ? (
        <LoadingState label="Loading your course progress" />
      ) : !enrolled ? (
        <section className="card course-enroll">
          <h2>Ready to study this course?</h2>
          <p>Enroll to track your progress and access pre-written study materials & notes on every topic.</p>
          <button className="learning-button" type="button" onClick={enroll}>
            Enroll in course <ArrowRight size={15} />
          </button>
        </section>
      ) : (
        <div className="course-room-layout">
          {/* Left Navigation: Topics & Lessons */}
          <nav className="card lesson-nav" aria-label="Course lessons">
            <div className="eyebrow">COURSE TOPICS</div>
            <div className="lesson-nav-progress">
              <div className="course-progress-head">
                <span>
                  {completedLessons} of {course.lessons} complete
                </span>
                <b>{progress}%</b>
              </div>
              <div className="bar">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
            {course.curriculum.map((item, index) => (
              <button
                className={selectedLesson === index ? "selected" : ""}
                type="button"
                key={item.title}
                disabled={index > completedLessons}
                onClick={() => setSelectedLesson(index)}
              >
                <span className="lesson-nav-number">
                  {index < completedLessons ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <span style={{ textAlign: "left", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.title}
                </span>
              </button>
            ))}
          </nav>

          {/* Right Area: Pre-Written Study Notes & Interactive Personal Notes */}
          <article className="card lesson-content">
            <div style={{ borderBottom: "1px solid #ececf5", paddingBottom: 14, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="eyebrow">TOPIC {String(selectedLesson + 1).padStart(2, "0")} · STUDY MATERIAL</div>
                <h2 style={{ margin: "4px 0 0", fontSize: 22 }}>{lesson.title}</h2>
              </div>
              {lesson.gfgUrl && (
                <a
                  href={lesson.gfgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "7px 13px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#047857",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    textDecoration: "none",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    transition: "all 0.15s ease",
                  }}
                  title="Open detailed notes on GeeksforGeeks in a new tab"
                >
                  <span style={{ background: "#059669", color: "#fff", padding: "1px 5px", borderRadius: 4, fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>GFG</span>
                  <span>GeeksforGeeks Notes</span>
                  <ExternalLink size={13} style={{ color: "#059669" }} />
                </a>
              )}
            </div>

            {/* 1. Core Conceptual Study Note */}
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--ink)", marginBottom: 20 }}>
              <p>{lesson.content}</p>
            </div>

            {/* 2. Code Snippet Reference Box */}
            {lesson.codeSnippet && (
              <div style={{ margin: "20px 0", borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f0", background: "#0f172a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", background: "#1e293b", color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Code size={13} style={{ color: "#38bdf8" }} />
                    Implementation Pattern / Algorithm Code
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(lesson.codeSnippet || "", "Code")}
                    style={{ border: 0, background: "transparent", color: "#cbd5e1", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Copy size={12} /> Copy Code
                  </button>
                </div>
                <pre style={{ margin: 0, padding: 14, color: "#f8fafc", fontSize: 12, lineHeight: 1.6, overflowX: "auto", fontFamily: "var(--font-mono, monospace)" }}>
                  <code>{lesson.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* 3. Mathematical Formula Reference Box */}
            {lesson.formula && (
              <div style={{ margin: "18px 0", padding: "14px 16px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                    📐 Key Formula & Calculation Shortcuts
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(lesson.formula || "", "Formula")}
                    style={{ border: 0, background: "transparent", color: "var(--purple)", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}
                  >
                    <Copy size={12} /> Copy
                  </button>
                </div>
                <pre style={{ margin: 0, color: "var(--purple)", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono, monospace)", whiteSpace: "pre-wrap" }}>
                  {lesson.formula}
                </pre>
              </div>
            )}

            {/* 4. Grid: Key Takeaways & Placement Interview Tips */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, margin: "20px 0" }}>
              <div className="lesson-takeaway" style={{ margin: 0, background: "#f5f3ff", border: "1px solid #ddd6fe" }}>
                <strong style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--purple)" }}>
                  <Lightbulb size={15} /> Core Takeaway
                </strong>
                <span style={{ fontSize: 12, lineHeight: 1.6 }}>{lesson.keyTakeaway}</span>
              </div>

              <div style={{ padding: "14px 16px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                <strong style={{ display: "flex", alignItems: "center", gap: 6, color: "#166534", fontSize: 12, marginBottom: 6 }}>
                  <CheckCircle2 size={15} style={{ color: "#22c55e" }} /> Corporate Placement Tip
                </strong>
                <span style={{ fontSize: 12, lineHeight: 1.6, color: "#1e3a29" }}>{lesson.interviewTip}</span>
              </div>
            </div>

            {/* 5. Quick Revision Cheat Sheet */}
            {lesson.cheatSheet && lesson.cheatSheet.length > 0 && (
              <div style={{ margin: "20px 0", padding: "14px 16px", borderRadius: 10, background: "#fbfbfe", border: "1px solid #ececf5" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <ListChecks size={14} style={{ color: "var(--purple)" }} /> Quick Revision Cheat Sheet
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.8, color: "var(--ink)" }}>
                  {lesson.cheatSheet.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 6. Common Candidate Pitfalls */}
            {lesson.commonPitfalls && lesson.commonPitfalls.length > 0 && (
              <div style={{ margin: "18px 0", padding: "12px 16px", borderRadius: 10, background: "#fff7ed", border: "1px solid #fed7aa" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9a3412", textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={14} /> Common Candidate Pitfalls to Avoid
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11, lineHeight: 1.7, color: "#7c2d12" }}>
                  {lesson.commonPitfalls.map((pitfall, idx) => (
                    <li key={idx}>{pitfall}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 7. Interactive Gemini AI Placement Tutor */}
            <TopicAiTutor lesson={lesson} courseTitle={course.title} courseCategory={course.category} />

            {/* 8. External Reference / GeeksforGeeks Notes */}
            {lesson.gfgUrl && (
              <div style={{ margin: "20px 0", padding: "14px 16px", borderRadius: 10, background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)", border: "1px solid #bbf7d0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 13, color: "#166534" }}>
                    <span style={{ background: "#059669", color: "#fff", padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 800 }}>GFG</span>
                    GeeksforGeeks Official Topic Documentation
                  </div>
                  <div style={{ fontSize: 12, color: "#1e3a29", marginTop: 3 }}>
                    Deep dive with comprehensive tutorials, practice problems, and interview test cases for <strong>{lesson.title}</strong>.
                  </div>
                </div>
                <a
                  href={lesson.gfgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="learning-button"
                  style={{ background: "#059669", color: "#fff", textDecoration: "none", fontSize: 12, padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  Explore on GeeksforGeeks <ExternalLink size={13} />
                </a>
              </div>
            )}

            {/* 8. Student Personal Notes Section on this Specific Topic */}
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px dashed #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div>
                  <strong style={{ fontSize: 13, color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
                    <FileText size={14} style={{ color: "var(--purple)" }} />
                    My Notes on this Topic
                  </strong>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Personal study notes for {lesson.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => handleCopy(personalNotes, "Notes")}
                    className="learning-button secondary"
                    style={{ fontSize: 10, padding: "4px 8px" }}
                  >
                    <Copy size={11} /> Copy Notes
                  </button>
                  <button
                    type="button"
                    onClick={downloadPersonalNotes}
                    className="learning-button secondary"
                    style={{ fontSize: 10, padding: "4px 8px" }}
                  >
                    <Download size={11} /> Export (.md)
                  </button>
                </div>
              </div>

              {/* Note Editor Toolbar */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderBottom: 0, borderRadius: "8px 8px 0 0" }}>
                <button
                  type="button"
                  onClick={() => handleNotesChange(personalNotes + (personalNotes ? "\n" : "") + "- ")}
                  style={{ border: 0, background: "transparent", fontSize: 11, color: "#475569", cursor: "pointer", fontWeight: 600 }}
                >
                  + Bullet
                </button>
                <span style={{ color: "#cbd5e1" }}>|</span>
                <button
                  type="button"
                  onClick={() => handleNotesChange(personalNotes + (personalNotes ? "\n" : "") + "### Key Concept:\n")}
                  style={{ border: 0, background: "transparent", fontSize: 11, color: "#475569", cursor: "pointer", fontWeight: 600 }}
                >
                  + Heading
                </button>
                <span style={{ color: "#cbd5e1" }}>|</span>
                <button
                  type="button"
                  onClick={() => handleNotesChange(personalNotes + (personalNotes ? "\n" : "") + "```\n// Code or formula\n```\n")}
                  style={{ border: 0, background: "transparent", fontSize: 11, color: "#475569", cursor: "pointer", fontWeight: 600 }}
                >
                  + Code
                </button>
                <span style={{ color: "#cbd5e1" }}>|</span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Clear your notes for this topic?")) {
                      handleNotesChange("");
                    }
                  }}
                  style={{ border: 0, background: "transparent", fontSize: 11, color: "#ef4444", cursor: "pointer", marginLeft: "auto", display: "flex", alignItems: "center", gap: 3 }}
                >
                  <Trash2 size={11} /> Clear
                </button>
              </div>

              <textarea
                value={personalNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Type your personal summary, doubts, or notes on this topic here... (Auto-saves in your browser)"
                style={{
                  width: "100%",
                  minHeight: 140,
                  padding: 12,
                  fontSize: 12,
                  lineHeight: 1.6,
                  borderRadius: "0 0 8px 8px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "var(--ink)",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, fontSize: 11, color: "#94a3b8" }}>
                <span>
                  <Save size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />
                  {lastSavedTime ? `Auto-saved at ${lastSavedTime}` : "Auto-saves automatically in your browser"}
                </span>
                <span>{personalNotes.length} chars</span>
              </div>
            </div>

            {copyFeedback && (
              <div style={{ marginTop: 10, padding: "6px 12px", background: "#f0fdf4", color: "#166534", borderRadius: 6, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={13} style={{ color: "#22c55e" }} /> {copyFeedback}
              </div>
            )}

            {/* Bottom Controls */}
            <div className="lesson-controls" style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #ececf5" }}>
              <button
                className="learning-button secondary"
                type="button"
                disabled={selectedLesson === 0}
                onClick={() => setSelectedLesson((index) => Math.max(0, index - 1))}
              >
                Previous topic
              </button>
              <button
                className="learning-button"
                type="button"
                disabled={completedLessons >= course.lessons || selectedLesson !== completedLessons}
                onClick={completeLesson}
              >
                {completedLessons >= course.lessons
                  ? "Course complete"
                  : selectedLesson < completedLessons
                  ? "Topic completed"
                  : selectedLesson > completedLessons
                  ? "Complete topics in order"
                  : "Mark topic complete"}
                {completedLessons < course.lessons && <ArrowRight size={15} />}
              </button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

export function AssessmentCatalogue() {
  const { state, ready, syncEnabled, syncError } = useLearningState();
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");

  const topics = ["All Topics", ...new Set(learningAssessments.map((a) => a.topic))];
  const levels = ["All Levels", "Foundation", "Intermediate", "Advanced", "Expert"];

  const filteredAssessments = useMemo(() => {
    return learningAssessments.filter((a) => {
      const matchesTopic = selectedTopic === "All Topics" || a.topic === selectedTopic;
      const matchesLevel = selectedLevel === "All Levels" || a.level === selectedLevel;
      const matchesSearch = !searchQuery.trim() || 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesLevel && matchesSearch;
    });
  }, [selectedTopic, selectedLevel, searchQuery]);

  function getLevelBadgeStyle(level: string) {
    switch (level) {
      case "Foundation":
        return { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0", label: "🌱 L1 · Foundation" };
      case "Intermediate":
        return { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe", label: "⚡ L2 · Intermediate" };
      case "Advanced":
        return { bg: "#f5f3ff", color: "#5b21b6", border: "#ddd6fe", label: "🔥 L3 · Advanced" };
      case "Expert":
        return { bg: "#fffbeb", color: "#92400e", border: "#fde68a", label: "👑 L4 · Expert" };
      default:
        return { bg: "#f1f5f9", color: "#334155", border: "#cbd5e1", label: level };
    }
  }

  // Count completed by level
  const completedAssessmentIds = new Set(state.results.map((r) => r.id));
  const totalCompleted = state.results.length;

  return (
    <div className="content learning-page">
      <div className="welcome">
        <div>
          <div className="eyebrow">PLACEMENT READINESS DRILLS</div>
          <h1>Multi-Level Assessments</h1>
          <p>Test your knowledge across 5 core placement domains with graded levels from <strong>Foundation</strong> to <strong>Expert</strong>.</p>
        </div>
        <span className="date-pill">
          <CheckCircle2 size={15} /> {totalCompleted} of {learningAssessments.length} completed
        </span>
      </div>

      <div className="learning-status">
        {ready ? (
          syncEnabled ? (
            "Results sync to your account."
          ) : (
            "Results save in this browser. Sign in with Supabase to sync across devices."
          )
        ) : (
          <LoadingState label="Loading saved results" />
        )}
      </div>
      {syncError && <ErrorState message={`${syncError} Your local results remain available.`} />}

      {/* Level Progression Overview Bar */}
      <div style={{ margin: "16px 0 24px", padding: "16px 20px", borderRadius: 14, background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", color: "#fff", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, boxShadow: "0 4px 20px -2px rgba(49,46,129,0.15)" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: "#a5b4fc" }}>
            LEVEL MASTERY PROGRESSION
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>
            Structured 4-Tier Assessment Ladder
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {[
            { level: "Foundation", icon: "🌱", color: "#34d399", count: learningAssessments.filter(a => a.level === "Foundation").length },
            { level: "Intermediate", icon: "⚡", color: "#60a5fa", count: learningAssessments.filter(a => a.level === "Intermediate").length },
            { level: "Advanced", icon: "🔥", color: "#c084fc", count: learningAssessments.filter(a => a.level === "Advanced").length },
            { level: "Expert", icon: "👑", color: "#fde047", count: learningAssessments.filter(a => a.level === "Expert").length },
          ].map((item) => {
            const completedInTier = learningAssessments.filter(a => a.level === item.level && completedAssessmentIds.has(a.id)).length;
            return (
              <div
                key={item.level}
                onClick={() => setSelectedLevel(selectedLevel === item.level ? "All Levels" : item.level)}
                style={{
                  background: selectedLevel === item.level ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                  border: `1px solid ${selectedLevel === item.level ? item.color : "rgba(255,255,255,0.15)"}`,
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.15s ease",
                }}
              >
                <span>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: item.color }}>{item.level}</div>
                  <div style={{ fontSize: 10, opacity: 0.8 }}>{completedInTier}/{item.count} Done</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs: Topic and Level */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {/* Topic Filters */}
        <div className="learning-filters" aria-label="Filter assessment topics" style={{ marginBottom: 0 }}>
          {topics.map((t) => (
            <button
              type="button"
              key={t}
              className={selectedTopic === t ? "selected" : ""}
              onClick={() => setSelectedTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Level Filters & Search */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginRight: 4 }}>
              Difficulty:
            </span>
            {levels.map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid",
                  borderColor: selectedLevel === lvl ? "var(--purple, #6366f1)" : "#e2e8f0",
                  background: selectedLevel === lvl ? "var(--purple, #6366f1)" : "#fff",
                  color: selectedLevel === lvl ? "#fff" : "var(--ink)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assessments, topics, keywords..."
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              fontSize: 12,
              minWidth: 240,
              background: "#fff",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="assessment-catalogue">
        {filteredAssessments.map((assessment, idx) => {
          const latest = state.results.find((result) => result.id === assessment.id);
          const badge = getLevelBadgeStyle(assessment.level);
          return (
            <article className="card assessment-card" key={assessment.id} style={{ position: "relative" }}>
              <div className="assessment-card-icon" style={{ fontSize: 13, fontWeight: 800 }}>
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="assessment-card-main">
                <div className="course-meta" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span
                    style={{
                      background: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {badge.label}
                  </span>
                  <span style={{ color: "#64748b", fontSize: 11, fontWeight: 600 }}>{assessment.topic}</span>
                  <span style={{ color: "#94a3b8", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <Clock3 size={12} /> {assessment.durationMinutes} min
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>{assessment.questions.length} questions</span>
                </div>
                <h2 style={{ fontSize: 17, marginBottom: 4 }}>{assessment.title}</h2>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "#475569" }}>{assessment.description}</p>
                {latest && (
                  <p className="latest-score" style={{ marginTop: 8 }}>
                    Latest Result:{" "}
                    <strong>
                      {latest.score}/{latest.total} ({Math.round((latest.score / latest.total) * 100)}%)
                    </strong>
                    <span style={{ marginLeft: 6, fontSize: 11, color: latest.score / latest.total >= 0.8 ? "#059669" : "#d97706" }}>
                      {latest.score / latest.total >= 0.8 ? "✓ Passed" : "⚡ Practice Recommended"}
                    </span>
                  </p>
                )}
              </div>
              <Link className="learning-button" aria-disabled={!ready} href={`/assessments/${assessment.id}`}>
                {latest ? "Retake Test" : "Start Test"} <ArrowRight size={15} />
              </Link>
            </article>
          );
        })}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="card learning-empty" style={{ margin: "24px 0" }}>
          <Sparkles size={24} style={{ color: "var(--purple)" }} />
          <h2>No tests found matching your filter</h2>
          <p>Try resetting the topic or level filters to view all available placement assessments.</p>
          <button
            type="button"
            className="learning-button secondary"
            onClick={() => {
              setSelectedTopic("All Topics");
              setSelectedLevel("All Levels");
              setSearchQuery("");
            }}
            style={{ width: "fit-content", margin: "12px auto 0" }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {ready && state.results.length === 0 && (
        <div className="learning-hint">
          Your test scores, correct answers, and comprehensive explanations will be recorded so you can review your growth over time.
        </div>
      )}

      {state.results.length > 0 && (
        <section className="card results-card" style={{ marginTop: 28 }}>
          <div className="card-title-row">
            <div>
              <h2>Recent Assessment Attempts</h2>
              <p className="subtle">Review detailed score breakdowns and answer keys</p>
            </div>
          </div>
          <div className="result-list">
            {state.results.slice(0, 8).map((result) => (
              <div className="result-row" key={`${result.id}-${result.date}`}>
                <span>
                  <strong>{result.title}</strong>
                  <small>{new Date(result.date).toLocaleString()}</small>
                </span>
                <b>
                  {result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%)
                </b>
                <Link className="text-link" href={`/assessments/${result.id}?review=latest`}>
                  Review Answers <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function AssessmentRunner({ assessmentId }: { assessmentId: string }) {
  const assessment = useMemo(() => learningAssessments.find((item) => item.id === assessmentId), [assessmentId]);
  const { state, setState, ready, syncEnabled } = useLearningState();
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  if (!assessment) {
    return (
      <div className="content">
        <div className="card learning-empty">
          <h1>Assessment not found</h1>
          <p>This quiz may have moved or the link may be incomplete.</p>
          <Link className="text-link" href="/assessments">
            Back to assessments <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  const latestResult = state.results.find((item) => item.id === assessment.id);

  function hasValidAnswers() {
    return (
      assessment!.questions.length > 0 &&
      answers.length === assessment!.questions.length &&
      assessment!.questions.every((question, index) => {
        const answer = answers[index];
        return Number.isInteger(answer) && answer >= 0 && answer < question.options.length;
      })
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasValidAnswers()) return;
    const score = assessment!.questions.reduce(
      (sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0),
      0
    );
    const nextResult: QuizResult = {
      id: assessment!.id,
      title: assessment!.title,
      score,
      total: assessment!.questions.length,
      date: new Date().toISOString(),
      answers,
    };
    setResult(nextResult);
    setState((current) => ({
      ...current,
      results: [nextResult, ...current.results.filter((item) => item.id !== assessment!.id)],
    }));
  }

  function reset() {
    setAnswers([]);
    setResult(null);
  }

  const displayedResult =
    result ?? (new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get("review") ? latestResult : null);

  const levelBadge = assessment.level === "Foundation"
    ? { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0", label: "🌱 Level 1 · Foundation" }
    : assessment.level === "Intermediate"
    ? { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe", label: "⚡ Level 2 · Intermediate" }
    : assessment.level === "Advanced"
    ? { bg: "#f5f3ff", color: "#5b21b6", border: "#ddd6fe", label: "🔥 Level 3 · Advanced" }
    : { bg: "#fffbeb", color: "#92400e", border: "#fde68a", label: "👑 Level 4 · Expert" };

  return (
    <div className="content learning-page quiz-page">
      <div className="welcome">
        <div>
          <Link className="text-link" href="/assessments">
            ← All assessments
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <span
              style={{
                background: levelBadge.bg,
                color: levelBadge.color,
                border: `1px solid ${levelBadge.border}`,
                padding: "2px 10px",
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {levelBadge.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
              {assessment.topic}
            </span>
          </div>
          <h1 style={{ marginTop: 6 }}>{assessment.title}</h1>
          <p>{assessment.description}</p>
        </div>
        <span className="date-pill">
          <Clock3 size={15} /> {assessment.durationMinutes} min · {assessment.questions.length} questions
        </span>
      </div>

      {!ready ? (
        <LoadingState label="Loading your saved result" />
      ) : displayedResult ? (
        <div className="quiz-results">
          <section className="card result-summary">
            <span className="result-check">
              <CheckCircle2 size={20} />
            </span>
            <div className="eyebrow">ASSESSMENT COMPLETE</div>
            <div className="result-score">
              {displayedResult.score}
              <small>/{displayedResult.total}</small>
            </div>
            <h2>
              {displayedResult.score / displayedResult.total >= 0.8
                ? "Excellent work"
                : displayedResult.score / displayedResult.total >= 0.5
                ? "Good progress"
                : "Keep practicing"}
            </h2>
            <p>
              You answered {displayedResult.score} of {displayedResult.total} questions correctly.
            </p>
            <p className="sync-note">{syncEnabled ? "Saved to your account" : "Saved in this browser"}</p>
            <button className="learning-button" onClick={reset} type="button">
              <RotateCcw size={15} /> Retake assessment
            </button>
          </section>
          <section className="review-list">
            <h2>Answer review</h2>
            {assessment.questions.map((question, index) => (
              <article className="card review-card" key={question.id}>
                <div className="review-number">
                  Question {index + 1}{" "}
                  <span className={displayedResult.answers[index] === question.answer ? "correct" : "incorrect"}>
                    {displayedResult.answers[index] === question.answer ? "Correct" : "Review"}
                  </span>
                </div>
                <h3>{question.prompt}</h3>
                <p>
                  <strong>Your answer:</strong> {question.options[displayedResult.answers[index]]}
                </p>
                <p>
                  <strong>Correct answer:</strong> {question.options[question.answer]}
                </p>
                <div className="answer-explanation">{question.explanation}</div>
              </article>
            ))}
          </section>
        </div>
      ) : (
        <form className="quiz-form" onSubmit={submit}>
          <div className="quiz-progress-label">
            <span>Choose one answer for each question</span>
            <span>
              {answers.filter((answer) => answer >= 0).length} of {assessment.questions.length} answered
            </span>
          </div>
          {assessment.questions.map((question, index) => (
            <fieldset className="card question-card" key={question.id}>
              <legend>
                <span>QUESTION {String(index + 1).padStart(2, "0")}</span>
                {question.prompt}
              </legend>
              <div className="answer-options">
                {question.options.map((option, optionIndex) => (
                  <label className={answers[index] === optionIndex ? "chosen" : ""} key={option}>
                    <input
                      type="radio"
                      name={question.id}
                      value={optionIndex}
                      checked={answers[index] === optionIndex}
                      onChange={() =>
                        setAnswers((current) => {
                          const next = [...current];
                          next[index] = optionIndex;
                          return next;
                        })
                      }
                    />
                    <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button className="learning-button quiz-submit" type="submit" disabled={!hasValidAnswers()}>
            Submit answers <ArrowRight size={15} />
          </button>
        </form>
      )}
    </div>
  );
}
