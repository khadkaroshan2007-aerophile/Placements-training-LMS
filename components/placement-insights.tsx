"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Flame,
  HelpCircle,
  History,
  Layers,
  LineChart,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { learningAssessments, learningCourses } from "@/lib/learning-data";
import { mockTests, type MockTestResult } from "@/lib/mock-tests-data";
import { clearStoredMockResults, getStoredMockResults } from "@/components/mock-test-hub";
import {
  archiveCurrentMonthProgress,
  clearMonthlyArchive,
  getStoredMonthlyReports,
  loadSampleHistoricalArchive,
  type MonthlyReport,
} from "@/lib/monthly-reports";
import { getActiveUserScope, setActiveUserScope } from "@/lib/user-progress-storage";
import { useLearningState } from "@/components/learning-state";
import { ErrorState } from "@/components/error-state";

export function PlacementInsights() {
  const { state, ready, syncEnabled, syncError, setState } = useLearningState();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [mockResults, setMockResults] = useState<MockTestResult[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [activeTab, setActiveTab] = useState<"assessments" | "mocks" | "monthly">("assessments");

  // Comparison graph time range: 3, 6, 9, or 12 months
  const [compareMonthsRange, setCompareMonthsRange] = useState<3 | 6 | 9 | 12>(6);
  const [selectedReportForView, setSelectedReportForView] = useState<MonthlyReport | null>(null);
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data: { user: { id: string; name: string; email: string } | null }) => {
        const uid = data.user?.id ?? null;
        setCurrentUserId(uid);
        if (uid) {
          setActiveUserScope(uid);
        }
        setMockResults(getStoredMockResults(uid));
        setMonthlyReports(getStoredMonthlyReports(uid));
      })
      .catch(() => {
        const localScope = getActiveUserScope();
        setCurrentUserId(localScope);
        setMockResults(getStoredMockResults(localScope));
        setMonthlyReports(getStoredMonthlyReports(localScope));
      });
  }, []);

  // ========================================================
  // 1. ASSESSMENTS PROGRESS CALCULATION (CORRECT ANSWERS)
  // ========================================================
  const completedAssessments = state.results;
  const assessmentTotalCorrect = completedAssessments.reduce((sum, r) => sum + (r.score || 0), 0);
  const assessmentTotalQuestions = completedAssessments.reduce((sum, r) => sum + (r.total || 0), 0);
  const assessmentOverallPercentage = assessmentTotalQuestions > 0
    ? Math.round((assessmentTotalCorrect / assessmentTotalQuestions) * 100)
    : 0;

  // Group assessments by topic and calculate correct answers
  const assessmentTopics = Array.from(new Set(learningAssessments.map((a) => a.topic)));
  const assessmentTopicBreakdown = assessmentTopics.map((topic) => {
    const topicTests = learningAssessments.filter((a) => a.topic === topic);
    const testIds = new Set(topicTests.map((t) => t.id));
    const userAttempts = completedAssessments.filter((r) => testIds.has(r.id));

    const correct = userAttempts.reduce((sum, r) => sum + (r.score || 0), 0);
    const totalAttempted = userAttempts.reduce((sum, r) => sum + (r.total || 0), 0);
    const availableQuestions = topicTests.reduce((sum, t) => sum + t.questions.length, 0);

    const percentage = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 0;
    const completedCount = userAttempts.length;

    return {
      topic,
      correct,
      totalAttempted,
      availableQuestions,
      percentage,
      completedCount,
      totalTests: topicTests.length,
    };
  });

  // Calculate assessment level progression
  const levels = ["Foundation", "Intermediate", "Advanced", "Expert"] as const;
  const levelBreakdown = levels.map((lvl) => {
    const testsInLevel = learningAssessments.filter((a) => a.level === lvl);
    const testIds = new Set(testsInLevel.map((t) => t.id));
    const attemptsInLevel = completedAssessments.filter((r) => testIds.has(r.id));
    const correct = attemptsInLevel.reduce((sum, r) => sum + (r.score || 0), 0);
    const total = attemptsInLevel.reduce((sum, r) => sum + (r.total || 0), 0);

    return {
      level: lvl,
      completed: attemptsInLevel.length,
      totalCount: testsInLevel.length,
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  });

  // ========================================================
  // 2. MOCK TESTS PROGRESS CALCULATION (CORRECT ANSWERS)
  // ========================================================
  const mockTotalCorrect = mockResults.reduce((sum, r) => sum + (r.score || 0), 0);
  const mockTotalQuestions = mockResults.reduce((sum, r) => sum + (r.total || 20), 0);
  const mockOverallPercentage = mockTotalQuestions > 0
    ? Math.round((mockTotalCorrect / mockTotalQuestions) * 100)
    : 0;

  // Group mock tests by topic and calculate correct answers
  const mockTopicBreakdown = mockTests.map((mock) => {
    const attempts = mockResults.filter((r) => r.mockId === mock.id);
    const latest = attempts[0];
    const bestScore = attempts.reduce((max, r) => Math.max(max, r.score || 0), 0);

    return {
      id: mock.id,
      title: mock.title,
      topic: mock.topic,
      category: mock.category,
      attemptsCount: attempts.length,
      latestScore: latest ? latest.score : 0,
      bestScore: attempts.length > 0 ? bestScore : 0,
      total: mock.totalQuestions, // 20
      percentage: latest ? latest.percentage : 0,
      timeSpentSeconds: latest ? latest.timeSpentSeconds : null,
      date: latest ? latest.date : null,
    };
  });

  // ========================================================
  // 3. COMBINED OVERALL PLACEMENT READINESS SCORE
  // ========================================================
  const grandTotalCorrect = assessmentTotalCorrect + mockTotalCorrect;
  const grandTotalQuestions = assessmentTotalQuestions + mockTotalQuestions;
  const grandReadinessScore = grandTotalQuestions > 0
    ? Math.round((grandTotalCorrect / grandTotalQuestions) * 100)
    : 0; // Fresh user starts at 0%

  // Current Month Cycle Information (October 2026)
  const now = new Date();
  const currentMonthName = now.toLocaleString("default", { month: "long" }) + " " + now.getFullYear();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentMonthDateRange = `${now.toLocaleString("default", { month: "short" })} 01, ${now.getFullYear()} – ${now.toLocaleString("default", { month: "short" })} ${lastDayOfMonth}, ${now.getFullYear()}`;
  const daysRemainingInMonth = Math.max(0, lastDayOfMonth - now.getDate());

  // Function to archive current month and reset progress for the new monthly cycle
  function handleArchiveAndResetMonthlyProgress() {
    const archivedReport = archiveCurrentMonthProgress(
      grandTotalCorrect,
      grandTotalQuestions,
      completedAssessments.length,
      mockResults.length,
      28,
      14,
      currentUserId
    );

    // Refresh monthly reports
    setMonthlyReports(getStoredMonthlyReports(currentUserId));

    // Reset active mock test results in storage and state
    clearStoredMockResults(currentUserId);
    setMockResults([]);

    // Reset active browser learning state for the fresh new monthly cycle
    setState((prev) => ({
      ...prev,
      results: [],
    }));

    setResetConfirmOpen(false);
    setNotificationMsg(`🎉 Successfully archived ${currentMonthName} report! New monthly progress cycle initialized.`);
    setTimeout(() => setNotificationMsg(""), 4500);
  }

  function handleLoadSampleArchive() {
    loadSampleHistoricalArchive(currentUserId);
    setMonthlyReports(getStoredMonthlyReports(currentUserId));
    setNotificationMsg("✨ Loaded 12 months of historical performance archives! You can now compare 3, 6, 9, or 12 months.");
    setTimeout(() => setNotificationMsg(""), 4500);
  }

  function handleClearArchive() {
    clearMonthlyArchive(currentUserId);
    setMonthlyReports([]);
    setNotificationMsg("🧹 Historical monthly archive cleared. Returned to 0-state baseline.");
    setTimeout(() => setNotificationMsg(""), 4500);
  }

  // Slice historical reports for comparison graph according to chosen range (3, 6, 9, 12 months)
  const comparisonData = useMemo(() => {
    // Reverse so the oldest is on the left and newest is on the right
    return [...monthlyReports].slice(0, compareMonthsRange).reverse();
  }, [monthlyReports, compareMonthsRange]);

  // Comparison Metrics: Delta between start of period and latest month
  const oldestInPeriod = comparisonData[0];
  const newestInPeriod = comparisonData[comparisonData.length - 1];
  const progressGrowthDelta = oldestInPeriod && newestInPeriod
    ? newestInPeriod.readinessScore - oldestInPeriod.readinessScore
    : 0;

  function exportReportToMarkdown(rep: MonthlyReport) {
    const content = `# PlacePrep AI Monthly Progress Report: ${rep.monthName}
Date Range: ${rep.displayDateRange}
Overall Readiness Score: ${rep.readinessScore}%
Accuracy Rate: ${rep.accuracyRate}%
Total Correct Answers: ${rep.totalCorrectAnswers} / ${rep.totalQuestionsAttempted}

## Summary Metrics
- Assessments Completed: ${rep.assessmentsCompleted}
- 25-Min Mock Exams Completed: ${rep.mockTestsCompleted}
- Study Hours Logged: ${rep.studyHours}h
- Course Lessons Finished: ${rep.lessonsCompleted}

## Topic-Wise Performance Breakdown
- Data Structures & Algorithms: ${rep.topicBreakdown.dsaCorrect}/${rep.topicBreakdown.dsaTotal} Correct
- Quantitative Aptitude: ${rep.topicBreakdown.aptitudeCorrect}/${rep.topicBreakdown.aptitudeTotal} Correct
- Logical Reasoning & DI: ${rep.topicBreakdown.logicalCorrect}/${rep.topicBreakdown.logicalTotal} Correct
- Core Computer Science: ${rep.topicBreakdown.coreCsCorrect}/${rep.topicBreakdown.coreCsTotal} Correct
- Career & HR Skills: ${rep.topicBreakdown.hrCorrect}/${rep.topicBreakdown.hrTotal} Correct

## Monthly Highlights
${rep.keyHighlights.map((h) => `- ${h}`).join("\n")}

## Placement Growth Insight
${rep.growthInsight}
`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PlacePrep-Report-${rep.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="content learning-page">
      {/* Page Header */}
      <div className="welcome">
        <div>
          <div className="eyebrow">MY PLACEMENT PROGRESS & ANALYTICS</div>
          <h1>My Learning Progress</h1>
          <p>
            Track your verified progress calculated strictly from the <strong>number of correct answers</strong> across overall topics, with monthly reports and historical comparison graphs.
          </p>
        </div>
        <span className="date-pill">
          <Calendar size={15} /> Active Cycle: {currentMonthName}
        </span>
      </div>

      {notificationMsg && (
        <div
          style={{
            margin: "12px 0 18px",
            padding: "12px 18px",
            background: "#ecfdf5",
            border: "1px solid #6ee7b7",
            color: "#065f46",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CheckCircle2 size={16} style={{ color: "#10b981" }} />
          <span>{notificationMsg}</span>
        </div>
      )}

      {syncError && <ErrorState message={`${syncError} Your local progress remains available.`} />}

      {/* Hero Overview Card: Combined Correct Answers & Readiness Score */}
      <section
        className="card"
        style={{
          margin: "18px 0 24px",
          padding: "24px 28px",
          borderRadius: 14,
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          boxShadow: "0 10px 25px -5px rgba(49, 46, 129, 0.25)",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", background: "rgba(255,255,255,0.18)", padding: "3px 10px", borderRadius: 20 }}>
            <Award size={13} style={{ color: "#38bdf8" }} /> Overall Readiness Benchmark
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "10px 0 6px", color: "#fff" }}>
            {grandReadinessScore !== null
              ? grandReadinessScore >= 80
                ? "Placement Ready (Tier 1 Candidate)"
                : grandReadinessScore >= 60
                ? "Steady Progress (Interview Capable)"
                : "Foundational Progress Underway"
              : "Start practicing to calculate your readiness"}
          </h2>
          <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.6, margin: 0 }}>
            Calculated as total verified correct answers across all attempted assessments and 25-minute mock exams:{" "}
            <strong style={{ color: "#38bdf8" }}>{grandTotalCorrect}</strong> of{" "}
            <strong>{grandTotalQuestions}</strong> questions correct.
          </p>
        </div>

        {/* Big Numbers */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.12)", padding: "14px 20px", borderRadius: 12, textAlign: "center", minWidth: 110 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#4ade80" }}>
              {grandTotalCorrect}
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Total Correct Answers</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", padding: "14px 20px", borderRadius: 12, textAlign: "center", minWidth: 110 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#38bdf8" }}>
              {grandReadinessScore !== null ? `${grandReadinessScore}%` : "—"}
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Accuracy Index</div>
          </div>
        </div>
      </section>

      {/* THREE PRIMARY CATEGORY TABS */}
      <div style={{ display: "flex", gap: 10, borderBottom: "2px solid #e2e8f0", paddingBottom: 0, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setActiveTab("assessments")}
          style={{
            padding: "12px 18px",
            fontSize: 14,
            fontWeight: 700,
            border: 0,
            background: "transparent",
            color: activeTab === "assessments" ? "var(--purple, #4f46e5)" : "#64748b",
            borderBottom: activeTab === "assessments" ? "3px solid var(--purple, #4f46e5)" : "3px solid transparent",
            marginBottom: -2,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.15s ease",
          }}
        >
          <Layers size={17} />
          <span>Assessments Tests Progress</span>
          <span
            style={{
              fontSize: 11,
              background: activeTab === "assessments" ? "var(--purple, #4f46e5)" : "#e2e8f0",
              color: activeTab === "assessments" ? "#fff" : "#475569",
              padding: "2px 8px",
              borderRadius: 12,
              fontWeight: 800,
            }}
          >
            {assessmentTotalCorrect} Correct
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mocks")}
          style={{
            padding: "12px 18px",
            fontSize: 14,
            fontWeight: 700,
            border: 0,
            background: "transparent",
            color: activeTab === "mocks" ? "var(--purple, #4f46e5)" : "#64748b",
            borderBottom: activeTab === "mocks" ? "3px solid var(--purple, #4f46e5)" : "3px solid transparent",
            marginBottom: -2,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.15s ease",
          }}
        >
          <Timer size={17} />
          <span>Mock Tests Progress</span>
          <span
            style={{
              fontSize: 11,
              background: activeTab === "mocks" ? "var(--purple, #4f46e5)" : "#e2e8f0",
              color: activeTab === "mocks" ? "#fff" : "#475569",
              padding: "2px 8px",
              borderRadius: 12,
              fontWeight: 800,
            }}
          >
            {mockTotalCorrect} Correct
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("monthly")}
          style={{
            padding: "12px 18px",
            fontSize: 14,
            fontWeight: 700,
            border: 0,
            background: "transparent",
            color: activeTab === "monthly" ? "var(--purple, #4f46e5)" : "#64748b",
            borderBottom: activeTab === "monthly" ? "3px solid var(--purple, #4f46e5)" : "3px solid transparent",
            marginBottom: -2,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.15s ease",
          }}
        >
          <LineChart size={17} />
          <span>Monthly Reports & Progress Comparison</span>
          <span
            style={{
              fontSize: 11,
              background: activeTab === "monthly" ? "#059669" : "#e2e8f0",
              color: activeTab === "monthly" ? "#fff" : "#475569",
              padding: "2px 8px",
              borderRadius: 12,
              fontWeight: 800,
            }}
          >
            {monthlyReports.length} Reports
          </span>
        </button>
      </div>

      {/* ========================================================
          CATEGORY 1: ASSESSMENTS TESTS PROGRESS
      ======================================================== */}
      {activeTab === "assessments" && (
        <div>
          {/* Key Metric Cards */}
          <div className="grid stats-grid" style={{ marginBottom: 24 }}>
            <article className="card stat-card">
              <div className="stat-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
                <CheckCircle2 size={18} />
              </div>
              <div className="stat-label">Assessment Correct Answers</div>
              <div className="stat-value">
                {assessmentTotalCorrect}
                <small style={{ fontSize: 13, color: "#94a3b8" }}>/{assessmentTotalQuestions}</small>
              </div>
              <div className="stat-foot">
                Across {completedAssessments.length} assessment sets
              </div>
            </article>

            <article className="card stat-card">
              <div className="stat-icon" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                <Target size={18} />
              </div>
              <div className="stat-label">Assessment Accuracy</div>
              <div className="stat-value">
                {assessmentOverallPercentage !== null ? `${assessmentOverallPercentage}%` : "—"}
              </div>
              <div className="stat-foot">Overall score percentage</div>
            </article>

            <article className="card stat-card">
              <div className="stat-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <BookOpen size={18} />
              </div>
              <div className="stat-label">Assessments Completed</div>
              <div className="stat-value">
                {completedAssessments.length}
                <small style={{ fontSize: 13, color: "#94a3b8" }}>/{learningAssessments.length}</small>
              </div>
              <div className="stat-foot">Available leveled tests</div>
            </article>

            <article className="card stat-card">
              <div className="stat-icon" style={{ background: "#fffbeb", color: "#d97706" }}>
                <Trophy size={18} />
              </div>
              <div className="stat-label">High-Scoring Sets (≥80%)</div>
              <div className="stat-value">
                {completedAssessments.filter((r) => r.total > 0 && r.score / r.total >= 0.8).length}
              </div>
              <div className="stat-foot">Achieved mastery benchmark</div>
            </article>
          </div>

          {/* Topic-Wise Correct Answers Breakdown */}
          <section className="card section-card" style={{ marginBottom: 24, padding: "20px 24px" }}>
            <div className="card-title-row" style={{ marginBottom: 14 }}>
              <div>
                <h2>Assessments: Topic-Wise Correct Answers</h2>
                <p className="subtle">Calculated as numbers of correct answers for each individual topic</p>
              </div>
              <Link className="text-link" href="/assessments">
                Browse all assessments <ArrowRight size={13} />
              </Link>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {assessmentTopicBreakdown.map((item) => (
                <div
                  key={item.topic}
                  style={{
                    padding: "14px 18px",
                    borderRadius: 10,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 200 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{item.topic}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {item.completedCount} of {item.totalTests} tests completed
                    </div>
                  </div>

                  {/* Progress Bar & Exact Correct Answer Count */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, maxWidth: 400 }}>
                    <div style={{ flex: 1, height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${item.percentage || 0}%`,
                          height: "100%",
                          background: (item.percentage || 0) >= 75 ? "#10b981" : (item.percentage || 0) >= 50 ? "#6366f1" : "#f59e0b",
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <div style={{ textAlign: "right", minWidth: 110 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>
                        {item.correct} / {item.totalAttempted} Correct
                      </div>
                      <div style={{ fontSize: 11, color: (item.percentage || 0) >= 70 ? "#059669" : "#64748b" }}>
                        {item.percentage !== null ? `${item.percentage}% Accuracy` : "Not attempted"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Level Mastery Breakdown (Foundation -> Expert) */}
          <section className="card section-card" style={{ marginBottom: 24, padding: "20px 24px" }}>
            <div className="card-title-row" style={{ marginBottom: 14 }}>
              <div>
                <h2>4-Tier Level Progression (Foundation → Expert)</h2>
                <p className="subtle">Correct answers achieved in each difficulty tier</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              {levelBreakdown.map((item) => (
                <div
                  key={item.level}
                  style={{
                    padding: "16px",
                    borderRadius: 10,
                    background: item.level === "Foundation"
                      ? "#ecfdf5"
                      : item.level === "Intermediate"
                      ? "#eff6ff"
                      : item.level === "Advanced"
                      ? "#f5f3ff"
                      : "#fffbeb",
                    border: "1px solid",
                    borderColor: item.level === "Foundation"
                      ? "#a7f3d0"
                      : item.level === "Intermediate"
                      ? "#bfdbfe"
                      : item.level === "Advanced"
                      ? "#ddd6fe"
                      : "#fde68a",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#475569" }}>
                    {item.level === "Foundation" ? "🌱 Level 1 · Foundation" : item.level === "Intermediate" ? "⚡ Level 2 · Intermediate" : item.level === "Advanced" ? "🔥 Level 3 · Advanced" : "👑 Level 4 · Expert"}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, margin: "8px 0 2px", color: "var(--ink)" }}>
                    {item.correct} / {item.total} Correct
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {item.completed} of {item.totalCount} tests passed ({item.percentage !== null ? `${item.percentage}%` : "0%"})
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Assessment Attempts */}
          {completedAssessments.length > 0 && (
            <section className="card results-card">
              <div className="card-title-row">
                <div>
                  <h2>Recent Assessment Results</h2>
                  <p className="subtle">Click review to inspect correct answers and explanations</p>
                </div>
              </div>
              <div className="result-list">
                {completedAssessments.slice(0, 6).map((res) => (
                  <div className="result-row" key={`${res.id}-${res.date}`}>
                    <span>
                      <strong>{res.title}</strong>
                      <small>{new Date(res.date).toLocaleString()}</small>
                    </span>
                    <b>
                      {res.score}/{res.total} ({Math.round((res.score / res.total) * 100)}%)
                    </b>
                    <Link className="text-link" href={`/assessments/${res.id}?review=latest`}>
                      Review Answers <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ========================================================
          CATEGORY 2: MOCK TESTS PROGRESS
      ======================================================== */}
      {activeTab === "mocks" && (
        <div>
          {/* Key Metric Cards */}
          <div className="grid stats-grid" style={{ marginBottom: 24 }}>
            <article className="card stat-card">
              <div className="stat-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
                <CheckCircle2 size={18} />
              </div>
              <div className="stat-label">Mock Correct Answers</div>
              <div className="stat-value">
                {mockTotalCorrect}
                <small style={{ fontSize: 13, color: "#94a3b8" }}>/{mockTotalQuestions}</small>
              </div>
              <div className="stat-foot">
                Across {mockResults.length} full 25m mock exams
              </div>
            </article>

            <article className="card stat-card">
              <div className="stat-icon" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                <Target size={18} />
              </div>
              <div className="stat-label">Mock Accuracy Index</div>
              <div className="stat-value">
                {mockOverallPercentage !== null ? `${mockOverallPercentage}%` : "—"}
              </div>
              <div className="stat-foot">Overall mock percentage</div>
            </article>

            <article className="card stat-card">
              <div className="stat-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <Timer size={18} />
              </div>
              <div className="stat-label">25m Mocks Attempted</div>
              <div className="stat-value">
                {mockResults.length}
                <small style={{ fontSize: 13, color: "#94a3b8" }}>/{mockTests.length} topics</small>
              </div>
              <div className="stat-foot">20 questions each</div>
            </article>

            <article className="card stat-card">
              <div className="stat-icon" style={{ background: "#fffbeb", color: "#d97706" }}>
                <Trophy size={18} />
              </div>
              <div className="stat-label">Placement Qualified (≥70%)</div>
              <div className="stat-value">
                {mockResults.filter((r) => r.percentage >= 70).length}
              </div>
              <div className="stat-foot">Passed recruiter cutoff</div>
            </article>
          </div>

          {/* Topic-Wise 20-Question Mock Test Performance */}
          <section className="card section-card" style={{ marginBottom: 24, padding: "20px 24px" }}>
            <div className="card-title-row" style={{ marginBottom: 14 }}>
              <div>
                <h2>Mock Tests: Topic-Wise Correct Answers (20 Questions Each)</h2>
                <p className="subtle">Calculated as numbers of correct answers for each 25-minute mock topic</p>
              </div>
              <Link className="text-link" href="/mock-tests">
                Start a new mock exam <ArrowRight size={13} />
              </Link>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {mockTopicBreakdown.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 10,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 14,
                  }}
                >
                  <div style={{ minWidth: 240 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: "#e0e7ff", color: "#4338ca", padding: "1px 6px", borderRadius: 4 }}>
                        25 MINS · 20 Qs
                      </span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{item.topic}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginTop: 4 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {item.attemptsCount > 0
                        ? `${item.attemptsCount} attempt${item.attemptsCount === 1 ? "" : "s"} · Best score: ${item.bestScore}/20`
                        : "Not attempted yet"}
                    </div>
                  </div>

                  {/* Correct Answers Bar & CTA */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, maxWidth: 440 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span>Correct Answers:</span>
                        <strong>
                          {item.latestScore !== null ? `${item.latestScore} / 20 Correct (${item.percentage}%)` : "— / 20"}
                        </strong>
                      </div>
                      <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${item.percentage || 0}%`,
                            height: "100%",
                            background: (item.percentage || 0) >= 70 ? "#10b981" : (item.percentage || 0) >= 50 ? "#6366f1" : "#f59e0b",
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </div>

                    <Link
                      className="learning-button secondary"
                      href={`/mock-tests/${item.id}`}
                      style={{ fontSize: 12, padding: "7px 12px", whiteSpace: "nowrap" }}
                    >
                      {item.attemptsCount > 0 ? "Retake Mock" : "Start Mock"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Full Mock Test Attempts History */}
          {mockResults.length > 0 ? (
            <section className="card results-card">
              <div className="card-title-row">
                <div>
                  <h2>Completed 25-Minute Mock Tests</h2>
                  <p className="subtle">Review your exact scores, time spent, and question-by-question solutions</p>
                </div>
              </div>
              <div className="result-list">
                {mockResults.map((res) => (
                  <div className="result-row" key={`${res.id}-${res.date}`}>
                    <span>
                      <strong>{res.title}</strong>
                      <small>
                        {new Date(res.date).toLocaleString()} · {Math.floor(res.timeSpentSeconds / 60)}m {res.timeSpentSeconds % 60}s used
                      </small>
                    </span>
                    <b>
                      {res.score}/20 Correct ({res.percentage}%)
                    </b>
                    <Link className="text-link" href={`/mock-tests/${res.mockId}?review=${res.id}`}>
                      Review Solutions <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="card learning-empty" style={{ margin: "20px 0" }}>
              <Timer size={24} style={{ color: "var(--purple)" }} />
              <h2>No mock exams completed yet</h2>
              <p>Try your first 25-minute, 20-question mock test to measure your true placement speed and accuracy!</p>
              <Link className="learning-button" href="/mock-tests" style={{ width: "fit-content", margin: "14px auto 0" }}>
                Start a 25-Minute Mock Exam <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          CATEGORY 3: MONTHLY REPORTS & PROGRESS COMPARISON GRAPH
      ======================================================== */}
      {activeTab === "monthly" && (
        <div>
          {/* Active Month Cycle Control Banner */}
          <div
            style={{
              padding: "18px 22px",
              borderRadius: 12,
              background: "#f0fdf4",
              border: "1.5px solid #86efac",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 4 }}>
                  Active Monthly Cycle
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>
                  {currentMonthName}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#166534", marginTop: 4 }}>
                Date Range: <strong>{currentMonthDateRange}</strong> · {daysRemainingInMonth} days remaining in this cycle.
              </div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>
                Current cycle performance: <strong>{grandTotalCorrect} correct answers</strong> across {completedAssessments.length + mockResults.length} test sessions.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              style={{
                background: "#059669",
                color: "#fff",
                border: 0,
                padding: "9px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 6px rgba(5, 150, 105, 0.2)",
              }}
            >
              <Archive size={14} /> Archive & Reset for New Month
            </button>
          </div>

          {/* ========================================================
              INTERACTIVE MONTHLY PROGRESS COMPARISON GRAPH
          ======================================================== */}
          <section
            className="card"
            style={{
              padding: "24px",
              borderRadius: 14,
              border: "1px solid #e0e7ff",
              marginBottom: 24,
              background: "#ffffff",
              boxShadow: "0 4px 20px -2px rgba(99, 102, 241, 0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--purple)", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  <TrendingUp size={15} /> Monthly Performance Trend
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: "4px 0" }}>
                  Progress Comparison Graph Across Previous Months
                </h2>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Compare your learning trajectory, readiness scores, and correct answers over your choice of duration.
                </p>
              </div>

              {/* Time Range Selector: 3M, 6M, 9M, 12M */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9", padding: "4px", borderRadius: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", padding: "0 6px" }}>Compare:</span>
                {([3, 6, 9, 12] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setCompareMonthsRange(r)}
                    style={{
                      border: 0,
                      background: compareMonthsRange === r ? "var(--purple, #4f46e5)" : "transparent",
                      color: compareMonthsRange === r ? "#fff" : "#475569",
                      padding: "5px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {r} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Growth Stat Banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 18px",
                background: "#f8fafc",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: "#64748b" }}>Duration Window: </span>
                <strong style={{ fontSize: 13, color: "var(--ink)" }}>
                  {oldestInPeriod && newestInPeriod
                    ? `Last ${compareMonthsRange} Months (${oldestInPeriod.shortMonth} → ${newestInPeriod.shortMonth})`
                    : `Last ${compareMonthsRange} Months (${monthlyReports.length} archived reports)`}
                </strong>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Net Readiness Trajectory:</span>
                <strong
                  style={{
                    fontSize: 14,
                    color: comparisonData.length > 0 ? (progressGrowthDelta >= 0 ? "#059669" : "#dc2626") : "#64748b",
                    background: comparisonData.length > 0 ? (progressGrowthDelta >= 0 ? "#ecfdf5" : "#fef2f2") : "#f1f5f9",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {comparisonData.length > 0
                    ? progressGrowthDelta >= 0
                      ? `+${progressGrowthDelta}% Growth`
                      : `${progressGrowthDelta}% Change`
                    : "0% Baseline (Fresh User)"}
                </strong>
              </div>
            </div>

            {/* Zero-State or SVG Visual Comparison Graph */}
            {comparisonData.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "36px 20px",
                  background: "#f8fafc",
                  borderRadius: 12,
                  border: "1px dashed #cbd5e1",
                  margin: "8px 0",
                }}
              >
                <div style={{ display: "inline-flex", padding: 12, borderRadius: 50, background: "#ede9fe", color: "var(--purple)", marginBottom: 12 }}>
                  <TrendingUp size={28} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 6px", color: "var(--ink)" }}>
                  Fresh User: Starting at 0% Baseline
                </h3>
                <p style={{ fontSize: 13, color: "#64748b", maxWidth: 520, margin: "0 auto 16px", lineHeight: 1.6 }}>
                  You currently have 0 archived monthly reports. As you complete assessments and 25-minute mock tests, verified correct answers accumulate safely in local & cloud storage. At the end of each monthly cycle, click <strong>&quot;Archive &amp; Reset for New Month&quot;</strong> to establish your timeline.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={handleLoadSampleArchive}
                    className="learning-button secondary"
                    style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <Sparkles size={13} /> Load Sample 12-Month Comparison Data
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ overflowX: "auto", paddingBottom: 10 }}>
                  <div style={{ minWidth: 580, height: 260, position: "relative" }}>
                    <svg
                      viewBox="0 0 650 220"
                      style={{ width: "100%", height: "100%", overflow: "visible" }}
                    >
                      {/* Grid Lines */}
                      {[20, 40, 60, 80, 100].map((val) => {
                        const y = 180 - (val / 100) * 150;
                        return (
                          <g key={val}>
                            <line x1="45" y1={y} x2="630" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                            <text x="35" y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">
                              {val}%
                            </text>
                          </g>
                        );
                      })}

                      {/* Draw Monthly Bars & Line Points */}
                      {comparisonData.map((item, idx) => {
                        const totalItems = comparisonData.length;
                        const availableWidth = 570;
                        const step = availableWidth / (totalItems + 1);
                        const x = 50 + (idx + 1) * step;
                        const y = 180 - (item.readinessScore / 100) * 150;
                        const barHeight = (item.readinessScore / 100) * 150;
                        const isHovered = hoveredMonthIndex === idx;

                        return (
                          <g
                            key={item.id}
                            onMouseEnter={() => setHoveredMonthIndex(idx)}
                            onMouseLeave={() => setHoveredMonthIndex(null)}
                            onClick={() => setSelectedReportForView(item)}
                            style={{ cursor: "pointer" }}
                          >
                            {/* Vertical Bar */}
                            <rect
                              x={x - 14}
                              y={180 - barHeight}
                              width="28"
                              height={barHeight}
                              rx="4"
                              fill={isHovered ? "url(#hoverGradient)" : "url(#barGradient)"}
                              opacity={isHovered ? 1 : 0.85}
                              style={{ transition: "all 0.2s ease" }}
                            />

                            {/* Top Node */}
                            <circle
                              cx={x}
                              cy={y}
                              r={isHovered ? "7" : "5"}
                              fill="#4f46e5"
                              stroke="#ffffff"
                              strokeWidth="2.5"
                              style={{ transition: "all 0.2s ease" }}
                            />

                            {/* Score Text above point */}
                            <text
                              x={x}
                              y={y - 10}
                              textAnchor="middle"
                              fontSize="11"
                              fontWeight="700"
                              fill={isHovered ? "#4f46e5" : "#334155"}
                            >
                              {item.readinessScore}%
                            </text>

                            {/* Month Label below */}
                            <text
                              x={x}
                              y="200"
                              textAnchor="middle"
                              fontSize="11"
                              fontWeight={isHovered ? "800" : "600"}
                              fill={isHovered ? "#4f46e5" : "#64748b"}
                            >
                              {item.shortMonth}
                            </text>
                          </g>
                        );
                      })}

                      {/* Gradients */}
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#e0e7ff" />
                        </linearGradient>
                        <linearGradient id="hoverGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="100%" stopColor="#c7d2fe" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 8 }}>
                  💡 Click on any bar/node in the chart to inspect that specific month’s full verified report.
                </p>
              </>
            )}
          </section>

          {/* ========================================================
              ALL PREVIOUS MONTHS REPORTS ARCHIVE (RETRIEVAL TABLE)
          ======================================================== */}
          <section className="card section-card" style={{ padding: "20px 24px" }}>
            <div className="card-title-row" style={{ marginBottom: 16 }}>
              <div>
                <h2>Previous Monthly Reports Archive ({monthlyReports.length} Available)</h2>
                <p className="subtle">
                  Retrieve and review verified historical scorecards for any previous month
                </p>
              </div>

              {monthlyReports.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearArchive}
                  style={{
                    border: 0,
                    background: "#f1f5f9",
                    color: "#64748b",
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  title="Reset to 0 fresh baseline"
                >
                  Clear Archive (Reset to 0)
                </button>
              )}
            </div>

            {monthlyReports.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 20px",
                  background: "#f8fafc",
                  borderRadius: 12,
                  border: "1px dashed #cbd5e1",
                }}
              >
                <History size={32} style={{ color: "#94a3b8", marginBottom: 10 }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>No Historical Monthly Reports Saved Yet</h3>
                <p style={{ fontSize: 13, color: "#64748b", maxWidth: 460, margin: "0 auto 16px", lineHeight: 1.5 }}>
                  When you archive your monthly cycle, complete scorecards with appropriate dates, total verified correct answers, and topic breakdowns will appear here for permanent retrieval.
                </p>
                <button
                  type="button"
                  onClick={handleLoadSampleArchive}
                  className="learning-button"
                  style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <Sparkles size={13} /> Load Sample Archive to Preview Scorecards
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {monthlyReports.map((report) => (
                  <div
                    key={report.id}
                    style={{
                      padding: "16px 20px",
                      borderRadius: 12,
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 14,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>
                          {report.monthName}
                        </span>
                        <span
                          style={{
                            background: report.readinessScore >= 80 ? "#dcfce7" : report.readinessScore >= 65 ? "#ede9fe" : "#fef3c7",
                            color: report.readinessScore >= 80 ? "#166534" : report.readinessScore >= 65 ? "#6d28d9" : "#b45309",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "1px 8px",
                            borderRadius: 12,
                          }}
                        >
                          {report.readinessScore}% Score
                        </span>
                      </div>

                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>
                        Appropriate Dates: <strong>{report.displayDateRange}</strong>
                      </div>

                      <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
                        Verified Correct: <strong>{report.totalCorrectAnswers} / {report.totalQuestionsAttempted} answers</strong> ({report.accuracyRate}% accuracy) · {report.assessmentsCompleted} assessments · {report.mockTestsCompleted} mock exams
                      </div>
                    </div>

                    {/* Actions: View Report & Export */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => setSelectedReportForView(report)}
                        className="learning-button"
                        style={{ fontSize: 12, padding: "7px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
                      >
                        <Eye size={13} /> View Full Report
                      </button>

                      <button
                        type="button"
                        onClick={() => exportReportToMarkdown(report)}
                        className="learning-button secondary"
                        style={{ fontSize: 12, padding: "7px 12px" }}
                        title="Download Report (.md)"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ========================================================
          MONTHLY REPORT INSPECTION MODAL (FULL RETRIEVAL VIEW)
      ======================================================== */}
      {selectedReportForView && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(5px)",
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
              borderRadius: 16,
              maxWidth: 620,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#a5b4fc" }}>
                  Official Monthly Report Archive
                </span>
                <h2 style={{ fontSize: 20, margin: "4px 0 0", color: "#fff" }}>
                  {selectedReportForView.monthName}
                </h2>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                  {selectedReportForView.displayDateRange}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReportForView(null)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: 0,
                  color: "#fff",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "24px" }}>
              {/* Score Snapshot */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                  gap: 12,
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#4f46e5" }}>
                    {selectedReportForView.readinessScore}%
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Readiness Score</div>
                </div>

                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#166534" }}>
                    {selectedReportForView.totalCorrectAnswers}/{selectedReportForView.totalQuestionsAttempted}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Correct Answers</div>
                </div>

                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#0284c7" }}>
                    {selectedReportForView.studyHours}h
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Study Hours</div>
                </div>
              </div>

              {/* Topic-Wise Performance */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 10 }}>
                  Topic-Wise Correct Answers in {selectedReportForView.shortMonth}
                </h3>

                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { label: "Data Structures & Algorithms", correct: selectedReportForView.topicBreakdown.dsaCorrect, total: selectedReportForView.topicBreakdown.dsaTotal },
                    { label: "Quantitative Aptitude", correct: selectedReportForView.topicBreakdown.aptitudeCorrect, total: selectedReportForView.topicBreakdown.aptitudeTotal },
                    { label: "Logical Reasoning & DI", correct: selectedReportForView.topicBreakdown.logicalCorrect, total: selectedReportForView.topicBreakdown.logicalTotal },
                    { label: "Core Computer Science", correct: selectedReportForView.topicBreakdown.coreCsCorrect, total: selectedReportForView.topicBreakdown.coreCsTotal },
                    { label: "Career & HR Skills", correct: selectedReportForView.topicBreakdown.hrCorrect, total: selectedReportForView.topicBreakdown.hrTotal },
                  ].map((t) => (
                    <div
                      key={t.label}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        background: "#f8fafc",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 12,
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{t.label}</span>
                      <strong style={{ color: "#4f46e5" }}>
                        {t.correct} / {t.total} Correct ({Math.round((t.correct / t.total) * 100)}%)
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Highlights */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 8 }}>
                  Key Highlights & Milestones
                </h3>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.7, color: "#334155" }}>
                  {selectedReportForView.keyHighlights.map((hl, idx) => (
                    <li key={idx}>{hl}</li>
                  ))}
                </ul>
              </div>

              {/* Growth Insight */}
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "#f5f3ff", border: "1px solid #ddd6fe", marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--purple)", textTransform: "uppercase", marginBottom: 4 }}>
                  Placement Growth Insight
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#4c1d95", lineHeight: 1.5 }}>
                  {selectedReportForView.growthInsight}
                </p>
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="learning-button secondary"
                  onClick={() => exportReportToMarkdown(selectedReportForView)}
                  style={{ fontSize: 12 }}
                >
                  <Download size={13} /> Export Report (.md)
                </button>
                <button
                  type="button"
                  className="learning-button"
                  onClick={() => setSelectedReportForView(null)}
                  style={{ fontSize: 12 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MONTHLY ARCHIVE & RESET CONFIRMATION MODAL
      ======================================================== */}
      {resetConfirmOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
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
              maxWidth: 460,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ fontSize: 18, margin: "0 0 10px" }}>
              Archive & Reset Monthly Progress Cycle?
            </h3>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: "0 0 16px" }}>
              This will save your current progress ({grandTotalCorrect} correct answers across {completedAssessments.length + mockResults.length} tests) into an official permanent report for <strong>{currentMonthName}</strong> ({currentMonthDateRange}), and reset the active monthly counter so you can begin next month with a fresh slate.
            </p>
            <p style={{ fontSize: 12, color: "#059669", fontWeight: 600, margin: "0 0 20px" }}>
              ✓ You will always be able to retrieve and compare your {currentMonthName} report anytime in the Monthly Reports archive.
            </p>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="learning-button secondary"
                onClick={() => setResetConfirmOpen(false)}
                style={{ fontSize: 12 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="learning-button"
                onClick={handleArchiveAndResetMonthlyProgress}
                style={{ background: "#059669", fontSize: 12 }}
              >
                Confirm & Archive Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
