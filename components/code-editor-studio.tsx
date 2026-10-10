"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Bug,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Cpu,
  FileCode2,
  HelpCircle,
  History,
  Info,
  Layers,
  Lightbulb,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Terminal,
  Type,
  XCircle,
} from "lucide-react";
import {
  codingProblems,
  type CodingProblem,
  type SupportedLanguage,
  type TestCase,
} from "@/lib/coding-problems-data";
import {
  getCodeDraft,
  getStoredSubmissions,
  saveCodeDraft,
  saveCodeSubmission,
  type CodeSubmission,
} from "@/lib/coding-storage";

export interface DiagnosticInfo {
  errorType:
    | "SyntaxError"
    | "IndentationError"
    | "NameError"
    | "TypeError"
    | "IndexError"
    | "CompileError"
    | "RuntimeError"
    | "TimeLimitExceeded"
    | "WrongAnswer";
  line?: number;
  column?: number;
  message: string;
  snippet?: string;
  suggestion: string;
  stackTrace?: string;
}

interface RunResultItem {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
  runtimeMs: number;
}

interface RunResponse {
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded" | "Compile Error";
  allPassed: boolean;
  passedTests: number;
  totalTests: number;
  results: RunResultItem[];
  diagnostic?: DiagnosticInfo | null;
  runtimeMs: number;
  memoryMb: number;
}

const LANGUAGE_LABELS: Record<SupportedLanguage, { name: string; ext: string; badge: string }> = {
  python: { name: "Python 3", ext: "py", badge: "🐍 Python" },
  javascript: { name: "JavaScript", ext: "js", badge: "🟨 JavaScript" },
  java: { name: "Java 17", ext: "java", badge: "☕ Java" },
  cpp: { name: "C++ 20", ext: "cpp", badge: "⚡ C++" },
};

export function CodeEditorStudio({ problem }: { problem: CodingProblem }) {
  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [code, setCode] = useState<string>(problem.starterCode.python);
  const [activeLeftTab, setActiveLeftTab] = useState<"description" | "hints" | "submissions">("description");
  const [activeBottomTab, setActiveBottomTab] = useState<"testcase" | "result">("testcase");
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>("");
  const [useCustomInput, setUseCustomInput] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(13);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<RunResponse | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<CodeSubmission[]>([]);
  const [mobileViewTab, setMobileViewTab] = useState<"problem" | "code">("problem");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load code draft or starter code when language or problem changes
  useEffect(() => {
    const draft = getCodeDraft(problem.id, language);
    if (draft && draft.trim()) {
      setCode(draft);
    } else {
      setCode(problem.starterCode[language]);
    }
  }, [language, problem.id, problem.starterCode]);

  // Load submissions for this problem
  useEffect(() => {
    const all = getStoredSubmissions();
    setSubmissions(all.filter((s) => s.problemId === problem.id));
  }, [problem.id]);

  // Handle code change and draft persistence
  function handleCodeChange(newCode: string) {
    setCode(newCode);
    saveCodeDraft(problem.id, language, newCode);
  }

  // Handle Tab key in code editor
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = "    "; // 4 spaces

      const updated = code.substring(0, start) + spaces + code.substring(end);
      handleCodeChange(updated);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  }

  // Reset to default starter code
  function handleResetTemplate() {
    if (confirm("Reset editor to default template? Your current edits in this language will be cleared.")) {
      const initial = problem.starterCode[language];
      handleCodeChange(initial);
    }
  }

  // Copy code to clipboard
  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      // Ignore
    }
  }

  // Run Test Cases
  async function executeCode(isSubmission = false) {
    if (isSubmission) {
      setIsSubmitting(true);
    } else {
      setIsRunning(true);
    }

    try {
      const response = await fetch("/api/coding-practice/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          language,
          code,
          customInput: useCustomInput ? customInput : undefined,
          isSubmission,
        }),
      });

      const data = (await response.json()) as RunResponse;
      setRunResult(data);
      setActiveBottomTab("result");

      if (isSubmission) {
        const sub: CodeSubmission = {
          id: `sub_${Date.now()}`,
          problemId: problem.id,
          language,
          code,
          status: data.status,
          passedTests: data.passedTests,
          totalTests: data.totalTests,
          runtimeMs: data.runtimeMs,
          memoryMb: data.memoryMb,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric",
          }),
        };
        saveCodeSubmission(sub);
        setSubmissions((prev) => [sub, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
      setIsSubmitting(false);
    }
  }

  const lines = code.split("\n");
  const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden);
  const errorLine = runResult?.diagnostic?.line;

  const difficultyColor =
    problem.difficulty === "Easy"
      ? "#16a34a"
      : problem.difficulty === "Medium"
      ? "#d97706"
      : "#dc2626";

  return (
    <div className="content" style={{ padding: "16px 20px 40px", maxWidth: 1600 }}>
      {/* Top Breadcrumb & Actions Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/coding-practice"
            className="learning-button secondary"
            style={{ padding: "6px 10px", fontSize: 11 }}
          >
            <ArrowLeft size={14} /> Problem List
          </Link>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
            {problem.title}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: difficultyColor,
              background: `${difficultyColor}18`,
              padding: "2px 7px",
              borderRadius: 4,
            }}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Quick Nav problem category & company pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 10,
              color: "var(--purple)",
              background: "var(--accent-subtle)",
              border: "1px solid var(--line)",
              padding: "2px 8px",
              borderRadius: 12,
              fontWeight: 600,
            }}
          >
            {problem.category}
          </span>
          {problem.companies.slice(0, 3).map((comp) => (
            <span
              key={comp}
              style={{
                fontSize: 10,
                color: "var(--muted)",
                background: "var(--card-bg)",
                border: "1px solid var(--line)",
                padding: "2px 8px",
                borderRadius: 12,
              }}
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      {/* Mobile Tabs Switcher */}
      <div className="mobile-code-tabs" style={{ display: "none", marginBottom: 12 }}>
        <button
          type="button"
          className={mobileViewTab === "problem" ? "selected" : ""}
          onClick={() => setMobileViewTab("problem")}
        >
          Problem Description
        </button>
        <button
          type="button"
          className={mobileViewTab === "code" ? "selected" : ""}
          onClick={() => setMobileViewTab("code")}
        >
          Code Editor ({LANGUAGE_LABELS[language].name})
        </button>
      </div>

      {/* Main Studio 2-Column Split Layout */}
      <div className="code-studio-layout">
        {/* LEFT PANE: Problem Description, Hints, Submissions */}
        <section
          className={`card code-left-pane ${
            mobileViewTab === "problem" ? "mobile-show" : ""
          }`}
        >
          {/* Tabs bar */}
          <div className="code-tab-header">
            <button
              type="button"
              className={activeLeftTab === "description" ? "active" : ""}
              onClick={() => setActiveLeftTab("description")}
            >
              <FileCode2 size={13} /> Description
            </button>
            <button
              type="button"
              className={activeLeftTab === "hints" ? "active" : ""}
              onClick={() => setActiveLeftTab("hints")}
            >
              <Lightbulb size={13} /> Hints ({problem.hints.length})
            </button>
            <button
              type="button"
              className={activeLeftTab === "submissions" ? "active" : ""}
              onClick={() => setActiveLeftTab("submissions")}
            >
              <History size={13} /> Submissions ({submissions.length})
            </button>
          </div>

          {/* Description Tab */}
          {activeLeftTab === "description" && (
            <div className="code-pane-scroll animate-fade-in">
              <h2 style={{ fontSize: 18, margin: "0 0 10px", color: "var(--ink)" }}>
                {problem.title}
              </h2>

              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: "var(--ink)",
                  whiteSpace: "pre-wrap",
                  marginBottom: 16,
                }}
              >
                {problem.description}
              </div>

              {/* Examples */}
              <div style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--muted)", margin: "0 0 10px" }}>
                  Examples
                </h3>
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="code-example-card">
                    <strong style={{ fontSize: 11, color: "var(--purple)", display: "block", marginBottom: 4 }}>
                      Example {idx + 1}:
                    </strong>
                    <div style={{ fontSize: 12, fontFamily: "monospace", color: "var(--ink)" }}>
                      <div><strong>Input:</strong> {ex.input}</div>
                      <div><strong>Output:</strong> {ex.output}</div>
                      {ex.explanation && (
                        <div style={{ color: "var(--muted)", marginTop: 4, fontFamily: "inherit", fontSize: 11 }}>
                          <strong>Explanation:</strong> {ex.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              {problem.constraints && problem.constraints.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <h3 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--muted)", margin: "0 0 8px" }}>
                    Constraints
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                    {problem.constraints.map((c, i) => (
                      <li key={i}>
                        <code style={{ background: "var(--card-subtle)", padding: "1px 5px", borderRadius: 4, fontSize: 11 }}>
                          {c}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Hints Tab */}
          {activeLeftTab === "hints" && (
            <div className="code-pane-scroll animate-fade-in">
              <h3 style={{ fontSize: 14, margin: "0 0 12px", color: "var(--ink)" }}>
                💡 Algorithmic Hints
              </h3>
              <div style={{ display: "grid", gap: 10 }}>
                {problem.hints.map((hint, i) => (
                  <div key={i} className="code-hint-card">
                    <strong style={{ fontSize: 11, color: "var(--purple)", display: "block", marginBottom: 4 }}>
                      Hint {i + 1}:
                    </strong>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--ink)", lineHeight: 1.5 }}>
                      {hint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submissions Tab */}
          {activeLeftTab === "submissions" && (
            <div className="code-pane-scroll animate-fade-in">
              <h3 style={{ fontSize: 14, margin: "0 0 12px", color: "var(--ink)" }}>
                📜 Your Submissions
              </h3>
              {submissions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--muted)", fontSize: 12 }}>
                  No submissions yet. Write your code and click <strong>"Submit"</strong> to record.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {submissions.map((sub) => {
                    const isAccepted = sub.status === "Accepted";
                    return (
                      <div
                        key={sub.id}
                        style={{
                          padding: "12px 14px",
                          borderRadius: 8,
                          border: "1px solid var(--line)",
                          background: isAccepted
                            ? "rgba(22, 163, 74, 0.08)"
                            : "rgba(220, 38, 38, 0.08)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: 12,
                        }}
                      >
                        <div>
                          <strong style={{ color: isAccepted ? "#16a34a" : "#dc2626" }}>
                            {sub.status}
                          </strong>
                          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>
                            {LANGUAGE_LABELS[sub.language].name} · {sub.timestamp}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: 11, color: "var(--muted)" }}>
                          <div>{sub.runtimeMs} ms</div>
                          <div>{sub.memoryMb} MB</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* RIGHT PANE: Code Editor & Test Cases Runner */}
        <section
          className={`card code-right-pane ${
            mobileViewTab === "code" ? "mobile-show" : ""
          }`}
        >
          {/* Editor Header Bar */}
          <div className="code-editor-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="code-lang-select"
              >
                {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((langKey) => (
                  <option key={langKey} value={langKey}>
                    {LANGUAGE_LABELS[langKey].badge}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Font size control */}
              <button
                type="button"
                className="code-icon-btn"
                title="Toggle font size"
                onClick={() => setFontSize((f) => (f === 13 ? 14 : f === 14 ? 15 : 13))}
              >
                <Type size={14} /> {fontSize}px
              </button>

              {/* Copy Code */}
              <button
                type="button"
                className="code-icon-btn"
                title="Copy code"
                onClick={handleCopyCode}
              >
                <Copy size={14} /> {copyFeedback ? "Copied!" : "Copy"}
              </button>

              {/* Reset to template */}
              <button
                type="button"
                className="code-icon-btn"
                title="Reset code template"
                onClick={handleResetTemplate}
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          {/* Code Textarea with Line Numbers & Error Gutter Marker */}
          <div className="code-editor-wrapper" style={{ fontSize: `${fontSize}px` }}>
            <div className="code-line-numbers" aria-hidden="true">
              {lines.map((_, i) => {
                const lineNum = i + 1;
                const isError = errorLine === lineNum;
                return (
                  <span
                    key={i}
                    style={{
                      color: isError ? "#ef4444" : undefined,
                      fontWeight: isError ? 800 : undefined,
                      background: isError ? "rgba(239, 68, 68, 0.2)" : undefined,
                      display: "block",
                      borderRadius: 2,
                    }}
                    title={isError ? `Error on line ${lineNum}` : undefined}
                  >
                    {isError ? "▶" : ""} {lineNum}
                  </span>
                );
              })}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="code-textarea"
              placeholder={`// Write your ${LANGUAGE_LABELS[language].name} solution here...`}
            />
          </div>

          {/* BOTTOM DRAWER: Test Cases & Execution Results */}
          <div className="code-bottom-drawer">
            {/* Drawer Tab Header */}
            <div className="code-drawer-header">
              <button
                type="button"
                className={activeBottomTab === "testcase" ? "active" : ""}
                onClick={() => setActiveBottomTab("testcase")}
              >
                <Terminal size={13} /> Testcase
              </button>
              <button
                type="button"
                className={activeBottomTab === "result" ? "active" : ""}
                onClick={() => setActiveBottomTab("result")}
              >
                <Play size={13} /> Test Result
                {runResult && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: runResult.allPassed ? "#16a34a" : "#dc2626",
                      display: "inline-block",
                      marginLeft: 4,
                    }}
                  />
                )}
              </button>
            </div>

            {/* Bottom Content: Testcase Inputs */}
            {activeBottomTab === "testcase" && (
              <div className="code-drawer-content animate-fade-in">
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  {visibleTestCases.map((tc, idx) => (
                    <button
                      key={tc.id}
                      type="button"
                      className={`tc-pill-btn ${
                        !useCustomInput && selectedTestCaseIdx === idx ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedTestCaseIdx(idx);
                        setUseCustomInput(false);
                      }}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`tc-pill-btn ${useCustomInput ? "active" : ""}`}
                    onClick={() => setUseCustomInput(true)}
                  >
                    + Custom Input
                  </button>
                </div>

                {useCustomInput ? (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>
                      Custom Testcase Input:
                    </label>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="e.g. [2,7,11,15], 9"
                      style={{
                        width: "100%",
                        height: 60,
                        marginTop: 6,
                        borderRadius: 8,
                        padding: "8px 10px",
                        border: "1px solid var(--input-border)",
                        background: "var(--input-bg)",
                        color: "var(--ink)",
                        fontFamily: "monospace",
                        fontSize: 12,
                        resize: "vertical",
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 4 }}>
                      Input:
                    </div>
                    <pre className="code-sample-box">
                      {visibleTestCases[selectedTestCaseIdx]?.input}
                    </pre>

                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", margin: "8px 0 4px" }}>
                      Expected Output:
                    </div>
                    <pre className="code-sample-box">
                      {visibleTestCases[selectedTestCaseIdx]?.expectedOutput}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Content: Test Result Console & VS Code / LeetCode Error Diagnostics */}
            {activeBottomTab === "result" && (
              <div className="code-drawer-content animate-fade-in">
                {!runResult ? (
                  <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)", fontSize: 12 }}>
                    Click <strong>"Run Code"</strong> to test your solution or <strong>"Submit"</strong> to evaluate all test cases.
                  </div>
                ) : (
                  <div>
                    {/* Status Header Banner */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 10,
                        marginBottom: 14,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: runResult.allPassed ? "#16a34a" : "#dc2626",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {runResult.allPassed ? (
                            <CheckCircle2 size={18} color="#16a34a" />
                          ) : (
                            <XCircle size={18} color="#dc2626" />
                          )}
                          {runResult.status}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>
                          ({runResult.passedTests}/{runResult.totalTests} test cases passed)
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: "var(--muted)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Clock size={13} /> {runResult.runtimeMs} ms
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Cpu size={13} /> {runResult.memoryMb} MB
                        </span>
                      </div>
                    </div>

                    {/* VS CODE & LEETCODE DIAGNOSTIC ERROR & SUGGESTION BOX */}
                    {runResult.diagnostic && (
                      <div className="code-diagnostic-card">
                        <div className="diagnostic-header">
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Bug size={16} color="#ef4444" />
                            <strong style={{ color: "#ef4444", fontSize: 13 }}>
                              {runResult.diagnostic.errorType}
                              {runResult.diagnostic.line && ` (Line ${runResult.diagnostic.line})`}
                            </strong>
                          </div>
                          {runResult.diagnostic.line && (
                            <span className="diagnostic-line-badge">
                              Line {runResult.diagnostic.line}
                            </span>
                          )}
                        </div>

                        {/* Error Message */}
                        <div className="diagnostic-msg">
                          {runResult.diagnostic.message}
                        </div>

                        {/* Stack Trace / Code Snippet */}
                        {runResult.diagnostic.stackTrace && (
                          <pre className="diagnostic-traceback">
                            {runResult.diagnostic.stackTrace}
                          </pre>
                        )}

                        {/* VS Code / AI Smart Suggestion */}
                        {runResult.diagnostic.suggestion && (
                          <div className="diagnostic-suggestion-box">
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                              <Lightbulb size={14} color="#f59e0b" />
                              <strong style={{ fontSize: 11, color: "var(--ink)" }}>
                                VS Code / AI Suggestion & Fix:
                              </strong>
                            </div>
                            <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.45, color: "var(--ink)" }}>
                              {runResult.diagnostic.suggestion}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Results Test Case Tabs */}
                    <div style={{ display: "flex", gap: 6, margin: "14px 0 10px", flexWrap: "wrap" }}>
                      {runResult.results.map((res, idx) => (
                        <button
                          key={res.id}
                          type="button"
                          className={`tc-pill-btn ${selectedTestCaseIdx === idx ? "active" : ""}`}
                          onClick={() => setSelectedTestCaseIdx(idx)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: res.passed ? "#16a34a" : "#dc2626",
                            }}
                          />
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Selected Result Details */}
                    {runResult.results[selectedTestCaseIdx] && (
                      <div className="code-result-comparison">
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 3 }}>
                          Input:
                        </div>
                        <pre className="code-sample-box">
                          {runResult.results[selectedTestCaseIdx].input}
                        </pre>

                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", margin: "6px 0 3px" }}>
                          Expected Output:
                        </div>
                        <pre className="code-sample-box">
                          {runResult.results[selectedTestCaseIdx].expectedOutput}
                        </pre>

                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", margin: "6px 0 3px" }}>
                          Your Output:
                        </div>
                        <pre
                          className="code-sample-box"
                          style={{
                            color: runResult.results[selectedTestCaseIdx].passed ? "#16a34a" : "#dc2626",
                            borderColor: runResult.results[selectedTestCaseIdx].passed
                              ? "rgba(22, 163, 74, 0.3)"
                              : "rgba(220, 38, 38, 0.3)",
                          }}
                        >
                          {runResult.results[selectedTestCaseIdx].actualOutput}
                        </pre>

                        {runResult.results[selectedTestCaseIdx].error && (
                          <div
                            style={{
                              marginTop: 8,
                              padding: "8px 10px",
                              borderRadius: 6,
                              background: "rgba(220, 38, 38, 0.1)",
                              color: "#dc2626",
                              fontSize: 11,
                            }}
                          >
                            <strong>Error:</strong> {runResult.results[selectedTestCaseIdx].error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="code-action-footer">
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                Language: <strong>{LANGUAGE_LABELS[language].name}</strong>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="learning-button secondary"
                  style={{ padding: "8px 16px", fontSize: 12 }}
                  disabled={isRunning || isSubmitting}
                  onClick={() => executeCode(false)}
                >
                  <Play size={13} /> {isRunning ? "Running..." : "Run Code"}
                </button>

                <button
                  type="button"
                  className="learning-button"
                  style={{ padding: "8px 18px", fontSize: 12 }}
                  disabled={isRunning || isSubmitting}
                  onClick={() => executeCode(true)}
                >
                  <Send size={13} /> {isSubmitting ? "Judging..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
