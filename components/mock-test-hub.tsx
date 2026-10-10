"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Flag,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { mockTests, type MockTest, type MockTestResult } from "@/lib/mock-tests-data";
import { getActiveUserScope } from "@/lib/user-progress-storage";

export function getMockResultsStorageKey(userId?: string | null): string {
  const uid = userId && userId.trim() ? userId.trim() : getActiveUserScope();
  return uid ? `placeprep_mock_results_${uid}` : "placeprep_mock_results_guest";
}

export function getStoredMockResults(userId?: string | null): MockTestResult[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getMockResultsStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMockResult(result: MockTestResult, userId?: string | null) {
  if (typeof window === "undefined") return;
  try {
    const key = getMockResultsStorageKey(userId);
    const current = getStoredMockResults(userId);
    const updated = [result, ...current.filter((r) => r.id !== result.id && !(r.mockId === result.mockId && r.date === result.date))];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save mock test result", e);
  }
}

export function clearStoredMockResults(userId?: string | null) {
  if (typeof window === "undefined") return;
  try {
    const key = getMockResultsStorageKey(userId);
    localStorage.removeItem(key);
    localStorage.removeItem("placeprep-mock-results-v1");
  } catch (e) {
    console.error("Failed to clear mock test results", e);
  }
}

// ==========================================
// MOCK TEST CATALOGUE VIEW
// ==========================================
export function MockTestCatalogue() {
  const [results, setResults] = useState<MockTestResult[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data: { user: { id: string } | null }) => {
        setResults(getStoredMockResults(data.user?.id));
      })
      .catch(() => {
        setResults(getStoredMockResults());
      });
  }, []);

  const topics = ["All Topics", ...new Set(mockTests.map((t) => t.topic))];

  const filteredTests = useMemo(() => {
    return selectedTopic === "All Topics"
      ? mockTests
      : mockTests.filter((t) => t.topic === selectedTopic);
  }, [selectedTopic]);

  const totalMocksCompleted = results.length;
  const totalCorrectAnswers = results.reduce((sum, r) => sum + (r.score || 0), 0);
  const totalQuestionsAttempted = results.reduce((sum, r) => sum + (r.total || 20), 0);
  const overallMockPercentage = totalQuestionsAttempted > 0
    ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
    : null;

  return (
    <div className="content learning-page">
      <div className="welcome">
        <div>
          <div className="eyebrow">TIMED PLACEMENT SIMULATION</div>
          <h1>Placement Mock Tests</h1>
          <p>
            Real <strong>20-question, 25-minute</strong> timed mock exams designed to simulate actual company placement recruitment rounds.
          </p>
        </div>
        <span className="date-pill">
          <Clock size={15} /> 25 Minutes · 20 Questions per Exam
        </span>
      </div>

      {/* Top Banner with Stats */}
      <div
        style={{
          margin: "16px 0 24px",
          padding: "20px 24px",
          borderRadius: 14,
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
          color: "#fff",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          boxShadow: "0 10px 25px -5px rgba(49, 46, 129, 0.25)",
        }}
      >
        <div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
              background: "rgba(255,255,255,0.15)",
              padding: "3px 8px",
              borderRadius: 6,
            }}
          >
            Timed Testing Environment
          </span>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "10px 0 4px", color: "#fff" }}>
            Real Recruitment Exam Conditions
          </h2>
          <p style={{ fontSize: 13, opacity: 0.9, maxWidth: 540, lineHeight: 1.5 }}>
            Each exam presents 20 questions strictly timed for 25 minutes (1m 15s per question). Auto-submits on timeout with immediate correct-answer scorecards.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.12)", padding: "12px 18px", borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8" }}>{totalMocksCompleted}</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Mocks Taken</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", padding: "12px 18px", borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#4ade80" }}>
              {totalCorrectAnswers}/{totalQuestionsAttempted}
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Correct Answers</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", padding: "12px 18px", borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fbbf24" }}>
              {overallMockPercentage !== null ? `${overallMockPercentage}%` : "—"}
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Mock Accuracy</div>
          </div>
        </div>
      </div>

      {/* Topic Filters */}
      <div className="learning-filters" aria-label="Filter mock test topics" style={{ marginBottom: 20 }}>
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

      {/* Grid of Mock Tests */}
      <div className="assessment-catalogue">
        {filteredTests.map((test, idx) => {
          const testResults = results.filter((r) => r.mockId === test.id);
          const latest = testResults[0];
          const bestScore = testResults.reduce((max, r) => Math.max(max, r.score), 0);

          return (
            <article
              key={test.id}
              className="card assessment-card"
              style={{ position: "relative", border: "1px solid #e0e7ff" }}
            >
              <div
                className="assessment-card-icon"
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </div>

              <div className="assessment-card-main">
                <div className="course-meta" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span
                    style={{
                      background: "#ede9fe",
                      color: "#6d28d9",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    ⏱️ 25 Mins Timed
                  </span>
                  <span
                    style={{
                      background: "#e0f2fe",
                      color: "#0369a1",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    📝 20 Questions
                  </span>
                  <span style={{ color: "#64748b", fontSize: 11, fontWeight: 600 }}>{test.topic}</span>
                </div>

                <h2 style={{ fontSize: 18, marginBottom: 6 }}>{test.title}</h2>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "#475569" }}>{test.description}</p>

                {latest ? (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "8px 12px",
                      background: "#f8fafc",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div>
                      <span>Latest: </span>
                      <strong style={{ color: latest.percentage >= 70 ? "#166534" : "#b45309" }}>
                        {latest.score}/{latest.total} ({latest.percentage}%)
                      </strong>
                      <span style={{ color: "#94a3b8", marginLeft: 6 }}>
                        · Best: {bestScore}/{test.totalQuestions}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: "#64748b" }}>
                      {new Date(latest.date).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8" }}>
                    Not attempted yet · 20 questions available
                  </div>
                )}
              </div>

              <Link className="learning-button" href={`/mock-tests/${test.id}`} style={{ width: "fit-content" }}>
                {latest ? "Retake 25m Mock" : "Start 25m Mock Exam"} <ArrowRight size={15} />
              </Link>
            </article>
          );
        })}
      </div>

      {/* Recent Mock History */}
      {results.length > 0 && (
        <section className="card results-card" style={{ marginTop: 32 }}>
          <div className="card-title-row">
            <div>
              <h2>Recent Mock Exam History</h2>
              <p className="subtle">Track your timed test scores and review question solutions</p>
            </div>
          </div>
          <div className="result-list">
            {results.slice(0, 6).map((res) => (
              <div className="result-row" key={`${res.id}-${res.date}`}>
                <span>
                  <strong>{res.title}</strong>
                  <small>
                    {new Date(res.date).toLocaleString()} · {Math.floor(res.timeSpentSeconds / 60)}m {res.timeSpentSeconds % 60}s spent
                  </small>
                </span>
                <b>
                  {res.score}/{res.total} ({res.percentage}%)
                </b>
                <Link className="text-link" href={`/mock-tests/${res.mockId}?review=${res.id}`}>
                  Review Solutions <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ==========================================
// MOCK TEST RUNNER (25 MINS · 20 QUESTIONS)
// ==========================================
export function MockTestRunner({ mockId }: { mockId: string }) {
  const test: MockTest | undefined = useMemo(() => mockTests.find((t) => t.id === mockId), [mockId]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes = 1500 seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [savedResult, setSavedResult] = useState<MockTestResult | null>(null);

  // Initialize arrays
  useEffect(() => {
    if (test) {
      setAnswers(new Array(test.questions.length).fill(-1));
      setFlagged(new Array(test.questions.length).fill(false));
      setTimeLeft(25 * 60);
      setIsSubmitted(false);
    }
  }, [test]);

  // Handle Review Mode from URL
  useEffect(() => {
    if (typeof window === "undefined" || !test) return;
    const urlParams = new URLSearchParams(window.location.search);
    const reviewId = urlParams.get("review");
    if (reviewId) {
      const allResults = getStoredMockResults();
      const target = allResults.find((r) => r.id === reviewId || r.mockId === test.id);
      if (target) {
        setAnswers(target.answers || []);
        setSavedResult(target);
        setIsSubmitted(true);
      }
    }
  }, [test]);

  // 25-Minute Countdown Timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true); // Auto-submit on time expiry
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  function handleSubmitTest(forced = false) {
    if (!test || isSubmitted) return;
    setShowConfirmModal(false);

    const score = test.questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.answer ? 1 : 0);
    }, 0);

    const timeSpentSeconds = 25 * 60 - timeLeft;
    const result: MockTestResult = {
      id: "mock-res-" + Date.now(),
      mockId: test.id,
      title: test.title,
      topic: test.topic,
      score,
      total: test.questions.length,
      percentage: Math.round((score / test.questions.length) * 100),
      timeSpentSeconds,
      date: new Date().toISOString(),
      answers: [...answers],
    };

    saveMockResult(result);
    setSavedResult(result);
    setIsSubmitted(true);
  }

  function handleSelectOption(optionIndex: number) {
    if (isSubmitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = optionIndex;
      return next;
    });
  }

  function handleToggleFlag() {
    setFlagged((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = !next[currentQuestionIndex];
      return next;
    });
  }

  function handleClearAnswer() {
    if (isSubmitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = -1;
      return next;
    });
  }

  if (!test) {
    return (
      <div className="content">
        <div className="card learning-empty">
          <h1>Mock test not found</h1>
          <p>This exam may have moved or the link is invalid.</p>
          <Link className="text-link" href="/mock-tests">
            Back to Mock Tests <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeCritical = timeLeft < 5 * 60; // Less than 5 minutes
  const answeredCount = answers.filter((a) => a !== -1).length;
  const currentQ = test.questions[currentQuestionIndex];

  return (
    <div className="content learning-page quiz-page">
      {/* Top Breadcrumb & Header */}
      <div className="welcome" style={{ marginBottom: 14 }}>
        <div>
          <Link className="text-link" href="/mock-tests">
            ← Back to all mock tests
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <span
              style={{
                background: "#ede9fe",
                color: "#6d28d9",
                padding: "2px 8px",
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              25-Minute Examination
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
              {test.topic}
            </span>
          </div>
          <h1 style={{ marginTop: 4 }}>{test.title}</h1>
        </div>

        {/* Live Countdown Timer Badge */}
        {!isSubmitted ? (
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              background: isTimeCritical ? "#fef2f2" : "#f0fdf4",
              border: `1.5px solid ${isTimeCritical ? "#ef4444" : "#22c55e"}`,
              color: isTimeCritical ? "#b91c1c" : "#15803d",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Clock size={18} className={isTimeCritical ? "animate-pulse" : ""} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {isTimeCritical ? "Time Expiring!" : "Time Remaining"}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "8px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 12, fontWeight: 700, color: "#475569" }}>
            Exam Completed
          </div>
        )}
      </div>

      {/* RESULTS SCORECARD VIEW */}
      {isSubmitted && savedResult ? (
        <div className="quiz-results" style={{ marginTop: 12 }}>
          <section
            className="card result-summary"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #fbfbfe 100%)",
              border: "1px solid #e0e7ff",
              boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.15)",
            }}
          >
            <span className="result-check" style={{ background: savedResult.percentage >= 70 ? "#dcfce7" : "#fef3c7", color: savedResult.percentage >= 70 ? "#166534" : "#b45309" }}>
              {savedResult.percentage >= 70 ? <Trophy size={22} /> : <AlertCircle size={22} />}
            </span>
            <div className="eyebrow" style={{ color: "var(--purple)", fontWeight: 800 }}>
              25-MIN MOCK EXAM COMPLETE
            </div>
            <div className="result-score" style={{ margin: "8px 0" }}>
              {savedResult.score}
              <small style={{ fontSize: 18, color: "#94a3b8" }}>/{savedResult.total} Correct</small>
            </div>
            <h2 style={{ fontSize: 22, margin: "4px 0" }}>
              {savedResult.percentage >= 80
                ? "Outstanding! Placement Ready"
                : savedResult.percentage >= 60
                ? "Solid Effort! Clear for Interviewing"
                : "Developing - Practice Recommended"}
            </h2>
            <p style={{ color: "#64748b", fontSize: 13, maxWidth: 500 }}>
              You answered <strong>{savedResult.score} out of {savedResult.total}</strong> questions correctly ({savedResult.percentage}% accuracy) in {Math.floor(savedResult.timeSpentSeconds / 60)} minutes {savedResult.timeSpentSeconds % 60} seconds.
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap", justifyContent: "center" }}>
              <button
                type="button"
                className="learning-button"
                onClick={() => {
                  setAnswers(new Array(test.questions.length).fill(-1));
                  setFlagged(new Array(test.questions.length).fill(false));
                  setTimeLeft(25 * 60);
                  setIsSubmitted(false);
                  setSavedResult(null);
                  setCurrentQuestionIndex(0);
                }}
              >
                <RotateCcw size={15} /> Retake 25m Exam
              </button>
              <Link className="learning-button secondary" href="/mock-tests">
                <ArrowLeft size={15} /> All Mock Tests
              </Link>
            </div>
          </section>

          {/* Solutions Breakdown */}
          <section className="review-list">
            <h2 style={{ fontSize: 19, marginBottom: 14 }}>Full Solutions Review ({test.questions.length} Questions)</h2>
            {test.questions.map((q, idx) => {
              const candidateAns = savedResult.answers[idx];
              const isCorrect = candidateAns === q.answer;
              return (
                <article
                  key={q.id}
                  className="card review-card"
                  style={{
                    borderLeft: `4px solid ${isCorrect ? "#22c55e" : "#ef4444"}`,
                    marginBottom: 14,
                  }}
                >
                  <div className="review-number" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>
                      Question {idx + 1} of {test.questions.length}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        background: isCorrect ? "#ecfdf5" : "#fef2f2",
                        color: isCorrect ? "#065f46" : "#b91c1c",
                      }}
                    >
                      {isCorrect ? "✓ Correct (+1)" : "✗ Incorrect (0)"}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 15, margin: "8px 0 12px", color: "var(--ink)" }}>{q.prompt}</h3>

                  <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                    <p style={{ margin: 0, fontSize: 13, color: isCorrect ? "#166534" : "#b91c1c" }}>
                      <strong>Your Answer:</strong> {candidateAns >= 0 ? q.options[candidateAns] : "Not Attempted"}
                    </p>
                    {!isCorrect && (
                      <p style={{ margin: 0, fontSize: 13, color: "#166534" }}>
                        <strong>Correct Answer:</strong> {q.options[q.answer]}
                      </p>
                    )}
                  </div>

                  <div className="answer-explanation" style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }}>
                    <strong>💡 Solution Rationale:</strong> {q.explanation}
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      ) : (
        /* LIVE EXAMINATION SCREEN */
        <div className="mock-test-runner-layout">
          {/* Main Question Display */}
          <div>
            <div className="card question-card" style={{ padding: "20px 24px", minHeight: 420 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "var(--purple)", letterSpacing: 0.5 }}>
                  QUESTION {String(currentQuestionIndex + 1).padStart(2, "0")} OF {test.questions.length}
                </span>

                <button
                  type="button"
                  onClick={handleToggleFlag}
                  style={{
                    background: flagged[currentQuestionIndex] ? "#fef3c7" : "transparent",
                    color: flagged[currentQuestionIndex] ? "#b45309" : "#64748b",
                    border: `1px solid ${flagged[currentQuestionIndex] ? "#fde68a" : "#cbd5e1"}`,
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Flag size={12} fill={flagged[currentQuestionIndex] ? "#b45309" : "none"} />
                  {flagged[currentQuestionIndex] ? "Flagged for Review" : "Flag for Review"}
                </button>
              </div>

              <h2 style={{ fontSize: 17, lineHeight: 1.5, marginBottom: 20, color: "var(--ink)" }}>
                {currentQ.prompt}
              </h2>

              {/* Options */}
              <div className="answer-options" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQuestionIndex] === optIdx;
                  return (
                    <label
                      key={optIdx}
                      className={isSelected ? "chosen" : ""}
                      onClick={() => handleSelectOption(optIdx)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: `1.5px solid ${isSelected ? "var(--purple)" : "#e2e8f0"}`,
                        background: isSelected ? "#f5f3ff" : "#fff",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQuestionIndex}`}
                        checked={isSelected}
                        onChange={() => handleSelectOption(optIdx)}
                        style={{ display: "none" }}
                      />
                      <span
                        className="option-letter"
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: isSelected ? "var(--purple)" : "#f1f5f9",
                          color: isSelected ? "#fff" : "#475569",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span style={{ fontSize: 14, color: isSelected ? "var(--purple)" : "var(--ink)", fontWeight: isSelected ? 600 : 400 }}>
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Bottom Navigation Toolbar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 28,
                  paddingTop: 18,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="learning-button secondary"
                    style={{ fontSize: 12, padding: "8px 14px" }}
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    disabled={currentQuestionIndex === test.questions.length - 1}
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="learning-button secondary"
                    style={{ fontSize: 12, padding: "8px 14px" }}
                  >
                    Next →
                  </button>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {answers[currentQuestionIndex] !== -1 && (
                    <button
                      type="button"
                      onClick={handleClearAnswer}
                      style={{ border: 0, background: "transparent", color: "#64748b", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}
                    >
                      Clear Selection
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(true)}
                    className="learning-button"
                    style={{
                      background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      padding: "8px 18px",
                      fontSize: 13,
                    }}
                  >
                    Submit Exam ({answeredCount}/{test.questions.length})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Question Palette (1-20 grid) */}
          <aside className="card" style={{ padding: "16px 18px", background: "#fbfbfe" }}>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#64748b", marginBottom: 12 }}>
              Question Palette (20)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 7, marginBottom: 16 }}>
              {test.questions.map((_, qIdx) => {
                const isCurrent = currentQuestionIndex === qIdx;
                const isAnswered = answers[qIdx] !== -1;
                const isFlagged = flagged[qIdx];

                let bg = "#f1f5f9";
                let textCol = "#475569";
                let borderCol = "#e2e8f0";

                if (isCurrent) {
                  borderCol = "var(--purple)";
                }
                if (isAnswered) {
                  bg = "#22c55e";
                  textCol = "#fff";
                  borderCol = "#16a34a";
                }
                if (isFlagged) {
                  bg = "#f59e0b";
                  textCol = "#fff";
                  borderCol = "#d97706";
                }

                return (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(qIdx)}
                    style={{
                      aspectRatio: "1",
                      borderRadius: 8,
                      border: `2px solid ${isCurrent ? "#4f46e5" : borderCol}`,
                      background: bg,
                      color: textCol,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isCurrent ? "0 0 0 2px rgba(99,102,241,0.2)" : "none",
                    }}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: "grid", gap: 6, fontSize: 11, color: "#64748b", borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: "#22c55e" }} />
                <span>Answered ({answeredCount})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f59e0b" }} />
                <span>Flagged ({flagged.filter(Boolean).length})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f1f5f9", border: "1px solid #cbd5e1" }} />
                <span>Unanswered ({test.questions.length - answeredCount})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              style={{
                width: "100%",
                marginTop: 18,
                padding: "10px",
                borderRadius: 8,
                background: "#059669",
                color: "#fff",
                border: 0,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Finish & Submit Test
            </button>
          </aside>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 24,
              maxWidth: 440,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: 18, margin: "0 0 10px" }}>Ready to submit your exam?</h3>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, margin: "0 0 16px" }}>
              You have answered <strong>{answeredCount}</strong> out of <strong>{test.questions.length}</strong> questions.
              {test.questions.length - answeredCount > 0 && (
                <span style={{ display: "block", color: "#b45309", marginTop: 4 }}>
                  ⚠️ You still have {test.questions.length - answeredCount} unanswered questions!
                </span>
              )}
            </p>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="learning-button secondary"
                onClick={() => setShowConfirmModal(false)}
                style={{ fontSize: 12 }}
              >
                Keep Answering
              </button>
              <button
                type="button"
                className="learning-button"
                onClick={() => handleSubmitTest(false)}
                style={{ background: "#059669", fontSize: 12 }}
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

