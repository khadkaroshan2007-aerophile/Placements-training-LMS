"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileCode,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  Plus,
  Search,
  Send,
  Sparkles,
  Target,
  Timer,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import {
  defaultAssignedTests,
  defaultStudentRecords,
  getStoredFacultyMaterials,
  saveFacultyMaterial,
  deleteFacultyMaterial,
  type AssignedTest,
  type FacultyMaterial,
  type StudentRecord,
} from "@/lib/faculty-data";

export function FacultyHub() {
  const [materials, setMaterials] = useState<FacultyMaterial[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>(defaultStudentRecords);
  const [assignedTests, setAssignedTests] = useState<AssignedTest[]>(defaultAssignedTests);
  const [activeTab, setActiveTab] = useState<"materials" | "analytics" | "students" | "assessments">("materials");

  // Filters & State
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [materialCategory, setMaterialCategory] = useState("All Categories");
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState("All Status");

  // Modals
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentRecord | null>(null);
  const [selectedMaterialForPreview, setSelectedMaterialForPreview] = useState<FacultyMaterial | null>(null);
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [createTestOpen, setCreateTestOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  // New Material Form
  const [newMatTitle, setNewMatTitle] = useState("");
  const [newMatCategory, setNewMatCategory] = useState<FacultyMaterial["category"]>("DSA & Coding");
  const [newMatType, setNewMatType] = useState<FacultyMaterial["type"]>("Code Sheet");
  const [newMatDesc, setNewMatDesc] = useState("");
  const [newMatTopic, setNewMatTopic] = useState("");
  const [newMatLink, setNewMatLink] = useState("");
  const [newMatPoints, setNewMatPoints] = useState("");

  // New Test Form
  const [newTestTitle, setNewTestTitle] = useState("");
  const [newTestTopic, setNewTestTopic] = useState("Data Structures & Algorithms");
  const [newTestBatch, setNewTestBatch] = useState("CSE - Section A");
  const [newTestQuestions, setNewTestQuestions] = useState(20);
  const [newTestTimeLimit, setNewTestTimeLimit] = useState(25);
  const [newTestDueDate, setNewTestDueDate] = useState("2026-10-25");

  useEffect(() => {
    setMaterials(getStoredFacultyMaterials());
  }, []);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchBatch = selectedBatch === "All Batches" || s.batch.toLowerCase().includes(selectedBatch.toLowerCase());
      const matchSearch = !studentSearch.trim() || s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNo.toLowerCase().includes(studentSearch.toLowerCase());
      const matchStatus = studentStatusFilter === "All Status" || s.status === studentStatusFilter;
      return matchBatch && matchSearch && matchStatus;
    });
  }, [students, selectedBatch, studentSearch, studentStatusFilter]);

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchCategory = materialCategory === "All Categories" || m.category === materialCategory;
      const matchBatch = selectedBatch === "All Batches" || m.targetBatch.includes(selectedBatch) || m.targetBatch.includes("All");
      return matchCategory && matchBatch;
    });
  }, [materials, materialCategory, selectedBatch]);

  // Aggregate Batch Metrics
  const totalStudents = students.length;
  const avgReadiness = Math.round(students.reduce((sum, s) => sum + s.readinessScore, 0) / (totalStudents || 1));
  const tier1Count = students.filter((s) => s.status === "Tier-1 Ready").length;
  const needsAttentionCount = students.filter((s) => s.status === "Needs Attention").length;
  const onTrackCount = students.filter((s) => s.status === "On Track").length;

  function handleAddMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!newMatTitle.trim() || !newMatTopic.trim()) return;

    const points = newMatPoints
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const newMaterial: FacultyMaterial = {
      id: "mat-" + Date.now(),
      title: newMatTitle.trim(),
      category: newMatCategory,
      type: newMatType,
      description: newMatDesc.trim() || `Comprehensive faculty training notes and practice exercises for ${newMatTopic}.`,
      topic: newMatTopic.trim(),
      targetBatch: selectedBatch === "All Batches" ? "All Final Year Batches" : selectedBatch,
      dateAdded: "Today",
      fileSize: "1.5 MB",
      downloadsCount: 0,
      externalLink: newMatLink.trim() || undefined,
      contentSummary: points.length > 0 ? points : [
        `Core theoretical foundations for ${newMatTopic}`,
        "Top 10 campus interview questions and dry-runs",
        "Common edge cases and solution checklist",
      ],
    };

    saveFacultyMaterial(newMaterial);
    setMaterials(getStoredFacultyMaterials());
    setAddMaterialOpen(false);

    // Reset Form
    setNewMatTitle("");
    setNewMatDesc("");
    setNewMatTopic("");
    setNewMatLink("");
    setNewMatPoints("");

    setNotificationMsg(`✅ Published new handout: "${newMaterial.title}"`);
    setTimeout(() => setNotificationMsg(""), 4000);
  }

  function handleDeleteMaterial(id: string) {
    deleteFacultyMaterial(id);
    setMaterials(getStoredFacultyMaterials());
    setNotificationMsg("🗑️ Removed handout from faculty materials repository.");
    setTimeout(() => setNotificationMsg(""), 4000);
  }

  function handleCreateTest(e: React.FormEvent) {
    e.preventDefault();
    if (!newTestTitle.trim()) return;

    const newTest: AssignedTest = {
      id: "test-" + Date.now(),
      title: newTestTitle.trim(),
      batch: newTestBatch,
      topic: newTestTopic,
      questionCount: Number(newTestQuestions) || 20,
      timeLimitMinutes: Number(newTestTimeLimit) || 25,
      dueDate: newTestDueDate || "Oct 30, 2026",
      submissionsCount: 0,
      totalStudents: newTestBatch === "All Batches" ? 174 : 60,
      avgScore: 0,
      status: "Active",
    };

    setAssignedTests((prev) => [newTest, ...prev]);
    setCreateTestOpen(false);
    setNewTestTitle("");

    setNotificationMsg(`🚀 Created and scheduled assessment: "${newTest.title}" for ${newTest.batch}`);
    setTimeout(() => setNotificationMsg(""), 4500);
  }

  function exportBatchCsv() {
    const headers = "Roll No,Name,Email,Batch,Placement Readiness (%),Correct Answers,Questions Attempted,Accuracy (%),Assessments Completed,Mock Exams,Study Hours,Streak (Days),Status\n";
    const rows = filteredStudents.map((s) => {
      const accuracy = s.totalQuestionsAttempted > 0 ? Math.round((s.totalCorrectAnswers / s.totalQuestionsAttempted) * 100) : 0;
      return `"${s.rollNo}","${s.name}","${s.email}","${s.batch}",${s.readinessScore},${s.totalCorrectAnswers},${s.totalQuestionsAttempted},${accuracy}%,${s.assessmentsCompleted},${s.mockTestsCompleted},${s.studyHours}h,${s.streakDays},"${s.status}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PlacePrep-Batch-Performance-${selectedBatch.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportHandoutSummary(mat: FacultyMaterial) {
    const text = `# ${mat.title}
**Subject**: ${mat.topic} (${mat.category})
**Type**: ${mat.type} · Target Batch: ${mat.targetBatch}
**Date Added**: ${mat.dateAdded}

## Description
${mat.description}

## Key Content & Topics Covered
${mat.contentSummary.map((c) => `- ${c}`).join("\n")}

${mat.externalLink ? `\n**Reference / Repository Link**: ${mat.externalLink}` : ""}
`;
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mat.title.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="content learning-page">
      {/* Toast Notification */}
      {notificationMsg && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#1e1b4b",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {notificationMsg}
        </div>
      )}

      {/* Page Header */}
      <div className="welcome">
        <div>
          <div className="eyebrow">FACULTY & DEPARTMENT MENTOR SPACE</div>
          <h1>Faculty Training & Resource Portal</h1>
          <p>
            Manage course materials, assign timed 25-minute mock tests, monitor batch readiness diagnostics, and export student placement records.
          </p>
        </div>

        {/* Batch Selector & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #cbd5e1", borderRadius: 8, padding: "6px 12px" }}>
            <Users size={14} style={{ color: "var(--purple)" }} />
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              style={{ border: 0, outline: "none", fontSize: 12, fontWeight: 700, color: "var(--ink)", background: "transparent", cursor: "pointer" }}
            >
              <option value="All Batches">All Batches (174 Students)</option>
              <option value="CSE - Section A">CSE - Section A (62)</option>
              <option value="CSE - Section B">CSE - Section B (58)</option>
              <option value="IT - Section A">IT - Section A (54)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={exportBatchCsv}
            className="learning-button secondary"
            style={{ fontSize: 12, padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
            title="Download CSV scorecards for current batch"
          >
            <FileSpreadsheet size={14} /> Export Scorecards (.csv)
          </button>
        </div>
      </div>

      {/* Aggregate Performance Cards */}
      <div className="grid stats-grid" style={{ marginBottom: 20 }}>
        <article className="card stat-card">
          <div className="stat-head">
            <span>Class Readiness Average</span>
            <span className="stat-icon"><Target size={16} /></span>
          </div>
          <div className="stat-value">
            <strong>{avgReadiness}%</strong>
            <span className="trend" style={{ background: "#ecfdf5", color: "#059669" }}>↑ 6% this month</span>
          </div>
          <div className="stat-foot">Calculated across overall topics</div>
        </article>

        <article className="card stat-card">
          <div className="stat-head">
            <span>Tier-1 Ready Students</span>
            <span className="stat-icon"><Award size={16} /></span>
          </div>
          <div className="stat-value">
            <strong>{tier1Count} of {totalStudents}</strong>
            <span className="trend" style={{ background: "#ede9fe", color: "#6d28d9" }}>{Math.round((tier1Count / totalStudents) * 100)}% of class</span>
          </div>
          <div className="stat-foot">Scoring &ge; 80% with high consistency</div>
        </article>

        <article className="card stat-card">
          <div className="stat-head">
            <span>Needs Remedial Attention</span>
            <span className="stat-icon"><AlertTriangle size={16} /></span>
          </div>
          <div className="stat-value">
            <strong style={{ color: needsAttentionCount > 0 ? "#b45309" : "#059669" }}>
              {needsAttentionCount} Students
            </strong>
            <span className="trend" style={{ background: "#fef3c7", color: "#b45309" }}>Action Required</span>
          </div>
          <div className="stat-foot">Scoring &lt; 60% or inactive streaks</div>
        </article>

        <article className="card stat-card">
          <div className="stat-head">
            <span>Faculty Handouts & Materials</span>
            <span className="stat-icon"><BookOpen size={16} /></span>
          </div>
          <div className="stat-value">
            <strong>{materials.length} Resources</strong>
            <span className="trend">Active Hub</span>
          </div>
          <div className="stat-foot">Guides, problem sheets & rubrics</div>
        </article>
      </div>

      {/* Faculty Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          borderBottom: "1px solid #e2e8f0",
          marginBottom: 20,
          overflowX: "auto",
        }}
      >
        {[
          { id: "materials", label: "Teaching & Study Materials", icon: BookOpen, count: materials.length },
          { id: "analytics", label: "Batch Diagnostics & Weakness Analysis", icon: TrendingUp },
          { id: "students", label: "Student Directory & Scorecards", icon: Users, count: filteredStudents.length },
          { id: "assessments", label: "Assigned Tests & Mock Exams", icon: Timer, count: assignedTests.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                border: 0,
                borderBottom: isActive ? "3px solid var(--purple, #4f46e5)" : "3px solid transparent",
                background: "transparent",
                padding: "12px 18px",
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? "var(--purple, #4f46e5)" : "#64748b",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={15} />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  style={{
                    background: isActive ? "var(--purple)" : "#f1f5f9",
                    color: isActive ? "#fff" : "#475569",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "1px 7px",
                    borderRadius: 12,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: TEACHING & STUDY MATERIALS HUB
      ======================================================== */}
      {activeTab === "materials" && (
        <div>
          {/* Controls Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            {/* Category Filter Pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["All Categories", "DSA & Coding", "Aptitude & Math", "Core CS", "HR & Soft Skills", "Company Past Papers"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMaterialCategory(cat)}
                  style={{
                    border: 0,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: materialCategory === cat ? 700 : 500,
                    background: materialCategory === cat ? "var(--purple, #4f46e5)" : "#f1f5f9",
                    color: materialCategory === cat ? "#fff" : "#475569",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Add Resource Button */}
            <button
              type="button"
              onClick={() => setAddMaterialOpen(true)}
              className="learning-button"
              style={{ fontSize: 12, padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Plus size={14} /> Add New Handout / Resource
            </button>
          </div>

          {/* Materials Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="card"
                style={{
                  padding: "20px",
                  borderRadius: 14,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                  position: "relative",
                }}
              >
                <div>
                  {/* Top Type Tag & Delete */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                    <span
                      style={{
                        background: mat.category === "DSA & Coding" ? "#ede9fe" : mat.category === "Aptitude & Math" ? "#dcfce7" : mat.category === "Core CS" ? "#e0f2fe" : "#fef3c7",
                        color: mat.category === "DSA & Coding" ? "#6d28d9" : mat.category === "Aptitude & Math" ? "#166534" : mat.category === "Core CS" ? "#0369a1" : "#b45309",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {mat.type} · {mat.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteMaterial(mat.id)}
                      style={{ background: "transparent", border: 0, color: "#94a3b8", cursor: "pointer", padding: 2 }}
                      title="Remove resource"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 6px", color: "var(--ink)" }}>
                    {mat.title}
                  </h3>

                  <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px", lineHeight: 1.5 }}>
                    {mat.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: 8, border: "1px solid #f1f5f9", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                      Topics Covered:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "#334155", lineHeight: 1.6 }}>
                      {mat.contentSummary.slice(0, 3).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Info & Actions */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>
                    <span>Target: <strong>{mat.targetBatch}</strong></span>
                    <span>Size: {mat.fileSize} · {mat.downloadsCount} downloads</span>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setSelectedMaterialForPreview(mat)}
                      className="learning-button secondary"
                      style={{ flex: 1, fontSize: 12, padding: "7px 10px", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 6 }}
                    >
                      <Eye size={13} /> View Handout
                    </button>

                    <button
                      type="button"
                      onClick={() => exportHandoutSummary(mat)}
                      className="learning-button"
                      style={{ fontSize: 12, padding: "7px 12px" }}
                      title="Download Material (.md)"
                    >
                      <Download size={13} />
                    </button>

                    {mat.externalLink && (
                      <a
                        href={mat.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="learning-button secondary"
                        style={{ fontSize: 12, padding: "7px 10px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                        title="Open Resource Link"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: BATCH DIAGNOSTICS & WEAKNESS ANALYSIS
      ======================================================== */}
      {activeTab === "analytics" && (
        <div>
          <div className="grid main-grid" style={{ marginBottom: 20 }}>
            {/* Readiness Distribution Card */}
            <section className="card section-card">
              <div className="card-title-row">
                <div>
                  <h2>Batch Readiness Distribution ({selectedBatch})</h2>
                  <p className="subtle">Classification of candidates by technical interview threshold</p>
                </div>
              </div>

              <div style={{ display: "grid", gap: 14, margin: "16px 0" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    <span style={{ color: "#166534" }}>Tier-1 Ready (&ge; 80% Score)</span>
                    <span>{tier1Count} Students ({Math.round((tier1Count / totalStudents) * 100)}%)</span>
                  </div>
                  <div style={{ height: 8, background: "#f0fdf4", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(tier1Count / totalStudents) * 100}%`, background: "#16a34a", borderRadius: 4 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    <span style={{ color: "#4338ca" }}>On Track (60% – 79% Score)</span>
                    <span>{onTrackCount} Students ({Math.round((onTrackCount / totalStudents) * 100)}%)</span>
                  </div>
                  <div style={{ height: 8, background: "#ede9fe", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(onTrackCount / totalStudents) * 100}%`, background: "#4f46e5", borderRadius: 4 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    <span style={{ color: "#b45309" }}>Needs Remedial Attention (&lt; 60% Score)</span>
                    <span>{needsAttentionCount} Students ({Math.round((needsAttentionCount / totalStudents) * 100)}%)</span>
                  </div>
                  <div style={{ height: 8, background: "#fef3c7", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(needsAttentionCount / totalStudents) * 100}%`, background: "#d97706", borderRadius: 4 }} />
                  </div>
                </div>
              </div>

              <div style={{ padding: "12px 16px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
                💡 <strong>Faculty Action Recommendation</strong>: Conduct targeted remedial sessions on <em>Dynamic Programming</em> and <em>Modular Arithmetic</em> for the {needsAttentionCount} students in the attention band before upcoming campus drives.
              </div>
            </section>

            {/* Topic Strengths vs Weaknesses */}
            <section className="card section-card">
              <div className="card-title-row">
                <div>
                  <h2>Topic Mastery vs. Class Weaknesses</h2>
                  <p className="subtle">Identified from assessment accuracy & mock submissions</p>
                </div>
              </div>

              <div style={{ display: "grid", gap: 10, margin: "14px 0" }}>
                {[
                  { topic: "Two Pointers & Arrays", accuracy: 86, type: "Strength" },
                  { topic: "SQL & Normalization", accuracy: 82, type: "Strength" },
                  { topic: "Speed-Math & Percentages", accuracy: 78, type: "Strength" },
                  { topic: "Graph BFS / DFS", accuracy: 58, type: "Weakness" },
                  { topic: "OS Concurrency & Mutex", accuracy: 52, type: "Weakness" },
                  { topic: "Work-Rate Inverse Math", accuracy: 49, type: "Weakness" },
                ].map((t) => (
                  <div
                    key={t.topic}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: t.type === "Strength" ? "#f0fdf4" : "#fef2f2",
                      border: `1px solid ${t.type === "Strength" ? "#bbf7d0" : "#fecaca"}`,
                      fontSize: 12,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: t.type === "Strength" ? "#166534" : "#991b1b" }}>
                      {t.topic}
                    </span>
                    <strong style={{ color: t.type === "Strength" ? "#16a34a" : "#dc2626" }}>
                      {t.accuracy}% Accuracy ({t.type})
                    </strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: STUDENT DIRECTORY & SCORECARDS
      ======================================================== */}
      {activeTab === "students" && (
        <section className="card section-card" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            {/* Search Input */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, padding: "7px 12px", flex: 1, maxWidth: 360 }}>
              <Search size={14} style={{ color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search by student name or roll no..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{ border: 0, outline: "none", background: "transparent", fontSize: 13, width: "100%" }}
              />
            </div>

            {/* Status Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Filter Status:</span>
              <select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12, fontWeight: 700, color: "var(--ink)", background: "#fff" }}
              >
                <option value="All Status">All Status ({students.length})</option>
                <option value="Tier-1 Ready">Tier-1 Ready ({tier1Count})</option>
                <option value="On Track">On Track ({onTrackCount})</option>
                <option value="Needs Attention">Needs Attention ({needsAttentionCount})</option>
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  <th style={{ padding: "10px 12px" }}>Roll No / Candidate</th>
                  <th style={{ padding: "10px 12px" }}>Batch</th>
                  <th style={{ padding: "10px 12px" }}>Placement Readiness</th>
                  <th style={{ padding: "10px 12px" }}>Verified Correct</th>
                  <th style={{ padding: "10px 12px" }}>Tests (Assess / Mocks)</th>
                  <th style={{ padding: "10px 12px" }}>Status</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px" }}>
                      <strong>{s.name}</strong>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.rollNo} · {s.email}</div>
                    </td>
                    <td style={{ padding: "12px", color: "#475569" }}>{s.batch}</td>
                    <td style={{ padding: "12px" }}>
                      <strong style={{ fontSize: 14, color: s.readinessScore >= 80 ? "#16a34a" : s.readinessScore >= 60 ? "#4f46e5" : "#b45309" }}>
                        {s.readinessScore}%
                      </strong>
                    </td>
                    <td style={{ padding: "12px", color: "#334155" }}>
                      <strong>{s.totalCorrectAnswers}</strong> / {s.totalQuestionsAttempted} ({Math.round((s.totalCorrectAnswers / s.totalQuestionsAttempted) * 100)}%)
                    </td>
                    <td style={{ padding: "12px", color: "#475569" }}>
                      {s.assessmentsCompleted} assessments · {s.mockTestsCompleted} mocks
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          background: s.status === "Tier-1 Ready" ? "#dcfce7" : s.status === "On Track" ? "#ede9fe" : "#fef3c7",
                          color: s.status === "Tier-1 Ready" ? "#166534" : s.status === "On Track" ? "#6d28d9" : "#b45309",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 12,
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForModal(s)}
                        className="learning-button secondary"
                        style={{ fontSize: 11, padding: "5px 10px" }}
                      >
                        <Eye size={12} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================
          TAB 4: ASSIGNED TESTS & MOCK EXAMS
      ======================================================== */}
      {activeTab === "assessments" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px" }}>Active Scheduled Class Assessments</h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Assign timed 20-question, 25-minute mock exams and weekly checkpoints to batches</p>
            </div>

            <button
              type="button"
              onClick={() => setCreateTestOpen(true)}
              className="learning-button"
              style={{ fontSize: 12, padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Plus size={14} /> Schedule New Assessment
            </button>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {assignedTests.map((test) => (
              <div
                key={test.id}
                className="card"
                style={{
                  padding: "18px 22px",
                  borderRadius: 12,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 14,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "var(--ink)" }}>
                      {test.title}
                    </h3>
                    <span
                      style={{
                        background: test.status === "Active" ? "#dcfce7" : "#ede9fe",
                        color: test.status === "Active" ? "#166534" : "#6d28d9",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "1px 8px",
                        borderRadius: 12,
                      }}
                    >
                      {test.status}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    Target: <strong>{test.batch}</strong> · Topic: {test.topic} · Due: <strong>{test.dueDate}</strong>
                  </div>

                  <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>
                    Exam Format: <strong>{test.questionCount} Questions · {test.timeLimitMinutes} Minutes Timer</strong> · Submissions: <strong>{test.submissionsCount} / {test.totalStudents}</strong>
                    {test.avgScore > 0 && ` · Batch Average: ${test.avgScore}%`}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href="/mock-tests"
                    className="learning-button secondary"
                    style={{ fontSize: 12, padding: "7px 14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <Eye size={13} /> View Exam
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: ADD NEW HANDOUT / MATERIAL MODAL
      ======================================================== */}
      {addMaterialOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Publish New Teaching Handout</h3>
              <button type="button" onClick={() => setAddMaterialOpen(false)} style={{ border: 0, background: "transparent", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddMaterial} style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Handout Title *</label>
                <input required type="text" placeholder="e.g. Dynamic Programming 20 Pattern Problems & Templates" value={newMatTitle} onChange={(e) => setNewMatTitle(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Subject Category</label>
                  <select value={newMatCategory} onChange={(e) => setNewMatCategory(e.target.value as FacultyMaterial["category"])} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }}>
                    <option value="DSA & Coding">DSA & Coding</option>
                    <option value="Aptitude & Math">Aptitude & Math</option>
                    <option value="Core CS">Core CS</option>
                    <option value="HR & Soft Skills">HR & Soft Skills</option>
                    <option value="Company Past Papers">Company Past Papers</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Document Type</label>
                  <select value={newMatType} onChange={(e) => setNewMatType(e.target.value as FacultyMaterial["type"])} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }}>
                    <option value="Code Sheet">Code Sheet</option>
                    <option value="Formula Bank">Formula Bank</option>
                    <option value="PDF Guide">PDF Guide</option>
                    <option value="Question Bank">Question Bank</option>
                    <option value="Rubric">Rubric</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Topic Name *</label>
                <input required type="text" placeholder="e.g. Dynamic Programming (0/1 Knapsack & LCS)" value={newMatTopic} onChange={(e) => setNewMatTopic(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Description</label>
                <textarea rows={2} placeholder="Brief summary for students..." value={newMatDesc} onChange={(e) => setNewMatDesc(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Key Bullet Points (1 per line)</label>
                <textarea rows={3} placeholder="0/1 Knapsack standard tabular solution&#10;Longest Common Subsequence recursion tree&#10;Matrix chain multiplication interview tips" value={newMatPoints} onChange={(e) => setNewMatPoints(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Reference Link / GitHub Repo (Optional)</label>
                <input type="url" placeholder="https://..." value={newMatLink} onChange={(e) => setNewMatLink(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                <button type="button" className="learning-button secondary" onClick={() => setAddMaterialOpen(false)} style={{ fontSize: 12 }}>Cancel</button>
                <button type="submit" className="learning-button" style={{ fontSize: 12 }}>Publish Handout</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: SCHEDULE ASSESSMENT MODAL
      ======================================================== */}
      {createTestOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, maxWidth: 500, width: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Schedule Batch Assessment</h3>
              <button type="button" onClick={() => setCreateTestOpen(false)} style={{ border: 0, background: "transparent", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateTest} style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Assessment Title *</label>
                <input required type="text" placeholder="e.g. Mid-Term Mock: 20 Questions Speed Test" value={newTestTitle} onChange={(e) => setNewTestTitle(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Subject Topic</label>
                  <select value={newTestTopic} onChange={(e) => setNewTestTopic(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }}>
                    <option value="Data Structures & Algorithms">DSA</option>
                    <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                    <option value="Logical Reasoning & DI">Logical Reasoning</option>
                    <option value="Core Computer Science">Core CS</option>
                    <option value="Career & HR Skills">Career & HR</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Assign to Batch</label>
                  <select value={newTestBatch} onChange={(e) => setNewTestBatch(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 12 }}>
                    <option value="CSE - Section A">CSE - Section A</option>
                    <option value="CSE - Section B">CSE - Section B</option>
                    <option value="IT - Section A">IT - Section A</option>
                    <option value="All Batches">All Batches</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Question Count</label>
                  <input type="number" min={5} max={50} value={newTestQuestions} onChange={(e) => setNewTestQuestions(Number(e.target.value))} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Time Limit (Minutes)</label>
                  <input type="number" min={10} max={120} value={newTestTimeLimit} onChange={(e) => setNewTestTimeLimit(Number(e.target.value))} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Due Date</label>
                <input type="date" value={newTestDueDate} onChange={(e) => setNewTestDueDate(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }} />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                <button type="button" className="learning-button secondary" onClick={() => setCreateTestOpen(false)} style={{ fontSize: 12 }}>Cancel</button>
                <button type="submit" className="learning-button" style={{ fontSize: 12 }}>Assign Assessment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: STUDENT DRILLDOWN SCORECARD
      ======================================================== */}
      {selectedStudentForModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, maxWidth: 540, width: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{selectedStudentForModal.name}</h3>
                <div style={{ fontSize: 12, color: "#64748b" }}>Roll No: {selectedStudentForModal.rollNo} · {selectedStudentForModal.batch}</div>
              </div>
              <button type="button" onClick={() => setSelectedStudentForModal(null)} style={{ border: 0, background: "transparent", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ padding: 10, borderRadius: 8, background: "#f8fafc", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--purple)" }}>{selectedStudentForModal.readinessScore}%</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>Placement Readiness</div>
              </div>
              <div style={{ padding: 10, borderRadius: 8, background: "#f8fafc", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>{selectedStudentForModal.totalCorrectAnswers} / {selectedStudentForModal.totalQuestionsAttempted}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>Verified Correct</div>
              </div>
              <div style={{ padding: 10, borderRadius: 8, background: "#f8fafc", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0284c7" }}>{selectedStudentForModal.studyHours}h</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>Study Time Logged</div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
              <div style={{ padding: "8px 12px", borderRadius: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: "#166534" }}>Strongest Topic: </span>
                <span style={{ color: "#14532d" }}>{selectedStudentForModal.strongestTopic}</span>
              </div>
              <div style={{ padding: "8px 12px", borderRadius: 6, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: "#991b1b" }}>Needs Practice on: </span>
                <span style={{ color: "#7f1d1d" }}>{selectedStudentForModal.weakestTopic}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="learning-button" onClick={() => setSelectedStudentForModal(null)} style={{ fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: HANDOUT PREVIEW MODAL
      ======================================================== */}
      {selectedMaterialForPreview && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", textTransform: "uppercase" }}>{selectedMaterialForPreview.type} · {selectedMaterialForPreview.category}</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "2px 0 0" }}>{selectedMaterialForPreview.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedMaterialForPreview(null)} style={{ border: 0, background: "transparent", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>

            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
              {selectedMaterialForPreview.description}
            </p>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)", textTransform: "uppercase", marginBottom: 8 }}>Included Sections & Highlights:</h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#334155", lineHeight: 1.7 }}>
                {selectedMaterialForPreview.contentSummary.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Size: {selectedMaterialForPreview.fileSize}</span>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="learning-button secondary" onClick={() => exportHandoutSummary(selectedMaterialForPreview)} style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Download size={13} /> Download (.md)
                </button>
                <button type="button" className="learning-button" onClick={() => setSelectedMaterialForPreview(null)} style={{ fontSize: 12 }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
