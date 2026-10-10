"use client";

import React, { useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Download,
  FileCheck,
  FileText,
  HelpCircle,
  Key,
  Layers,
  Lightbulb,
  Lock,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Upload,
  User,
  Wand2,
  XCircle,
} from "lucide-react";

interface SectionScore {
  score: number;
  passed: boolean;
  feedback: string;
}

interface MissingKeywordItem {
  keyword: string;
  category: string;
  importance: "Critical" | "Recommended" | "Bonus";
  reason: string;
}

interface BulletImprovement {
  area: string;
  originalSnippet: string;
  improvedVersion: string;
  impact: string;
}

interface FormattingAlert {
  issue: string;
  severity: "High" | "Medium" | "Low";
  recommendation: string;
}

interface AtsAnalysisResult {
  atsScore: number;
  matchPercentage: number;
  tier: string;
  summaryFeedback: string;
  sections: {
    contact: SectionScore;
    summary: SectionScore;
    experience: SectionScore;
    skills: SectionScore;
    projects: SectionScore;
    education: SectionScore;
  };
  missingKeywords: MissingKeywordItem[];
  strongKeywordsFound: string[];
  bulletPointImprovements: BulletImprovement[];
  formattingAlerts: FormattingAlert[];
  roleSpecificSuggestions: string[];
}

const SAMPLE_RESUME_TEXT = `
Alex Rivera
Software Development Engineer (Full Stack)
Email: alex.rivera@example.com | Phone: +91 98765 43210 | Location: Bangalore, India
LinkedIn: linkedin.com/in/alex-rivera-dev | GitHub: github.com/alexrivera | Portfolio: alexrivera.dev

PROFESSIONAL SUMMARY
Results-driven Computer Science graduate with hands-on experience in full-stack web development, scalable microservices, and distributed systems. Proficient in Next.js, Python, TypeScript, and AWS. Proven track record of architecting performant apps with 99.9% uptime and optimizing database queries for high-traffic platforms.

TECHNICAL SKILLS
Languages: Java, Python, TypeScript, JavaScript, C++, SQL
Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, Spring Boot
Developer Tools & Databases: PostgreSQL, MongoDB, Redis, Docker, Git, AWS (S3, EC2), Supabase
Core Competencies: Data Structures & Algorithms, System Design, REST APIs, Microservices, CI/CD

WORK EXPERIENCE
Software Engineering Intern | InnovateTech Solutions (Jan 2024 – Jun 2024)
- Engineered full-stack analytics dashboards using Next.js 14 and PostgreSQL, reducing query latency by 35% through Redis caching.
- Implemented secure JWT authentication and role-based access control (RBAC) handling over 10,000+ daily active user sessions.
- Collaborated in Agile sprints with cross-functional engineering teams, writing 85%+ unit test coverage with Jest and Cypress.

Backend Developer Intern | CloudCore Labs (Jul 2023 – Nov 2023)
- Designed and deployed asynchronous REST APIs in Node.js and Express to process high-throughput batch transaction payloads.
- Optimized database indexing on PostgreSQL tables with 2M+ records, decreasing average API response times from 420ms to 95ms.

KEY PROJECTS
PlacePrep AI — Placement Training & LMS Platform
- Architected an end-to-end LMS platform with real-time AI interview simulator, DSA coding sandbox, and placement readiness tracking.
- Constructed custom multi-language code evaluation runner supporting Python, Java, C++, and JavaScript with sub-second execution.

EDUCATION
Bachelor of Technology in Computer Science | National Institute of Technology (2020 – 2024) | CGPA: 8.85 / 10.0
`;

export function ResumeAnalyzerView() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [groqApiKey, setGroqApiKey] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AtsAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File Upload & Text Extraction
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setResumeText(content);
    };
    reader.readAsText(file);
  }

  // Run AI Resume Analysis
  async function handleAnalyze() {
    if (!resumeText.trim()) {
      setErrorMessage("Please paste or upload your resume text to begin analysis.");
      return;
    }

    setErrorMessage("");
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/ai/resume-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription.trim() || undefined,
          userApiKey: groqApiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      setAnalysisResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleLoadSample() {
    setResumeText(SAMPLE_RESUME_TEXT.trim());
    setJobDescription(
      "Looking for a Full-Stack Software Engineer proficient in React, Next.js, TypeScript, Node.js, and PostgreSQL. Experience with Docker, Redis, CI/CD, AWS, and distributed microservices is a strong plus."
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: "grid", gap: 20 }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".txt,.md,.doc,.docx,.pdf"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      {/* Header Banner */}
      <div className="card" style={{ padding: "20px 24px", background: "var(--card-bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div className="eyebrow">AI RESUME & ATS ANALYZER (GROQ LLaMA-3.3)</div>
            <h2 style={{ fontSize: 22, margin: "6px 0 4px", color: "var(--ink)" }}>
              ATS Score & Gap Diagnostics Engine
            </h2>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: 13 }}>
              Upload your resume and optional job description to get instant ATS scores, keyword gaps, and Google XYZ rewrites.
            </p>
          </div>

          <button
            type="button"
            className="learning-button secondary"
            onClick={handleLoadSample}
            style={{ fontSize: 12, padding: "8px 14px" }}
          >
            <Sparkles size={13} color="var(--purple)" /> Load Sample Profile
          </button>
        </div>
      </div>

      {/* INPUT STAGE: Resume & Job Description Inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18 }}>
        {/* Left: Resume Text / Upload */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <strong style={{ fontSize: 13, color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
              <FileText size={15} color="var(--purple)" /> Candidate Resume Content
            </strong>
            <button
              type="button"
              className="learning-button secondary"
              style={{ fontSize: 11, padding: "4px 10px" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={12} /> Upload File (.txt, .md, .pdf)
            </button>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here (or upload your resume file above)..."
            rows={10}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "1px solid var(--input-border)",
              background: "var(--input-bg)",
              color: "var(--ink)",
              fontSize: 12,
              lineHeight: 1.5,
              resize: "vertical",
              fontFamily: "monospace",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--muted)" }}>
            <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
            {resumeText && (
              <button
                type="button"
                style={{ border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: 11 }}
                onClick={() => setResumeText("")}
              >
                Clear text
              </button>
            )}
          </div>
        </div>

        {/* Right: Job Description & Groq API Key */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Target Job Description (Optional) */}
          <div className="card" style={{ padding: "18px 20px", flex: 1 }}>
            <strong style={{ fontSize: 13, color: "var(--ink)", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Tag size={15} color="var(--purple)" /> Target Job Description (Optional)
            </strong>
            <p style={{ margin: "0 0 8px", fontSize: 11, color: "var(--muted)" }}>
              Paste the role requirements to get customized keyword matching and role fit score.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. SDE-1 Job Description: Requirements: React, TypeScript, Python, Docker, Redis, AWS..."
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 8,
                border: "1px solid var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--ink)",
                fontSize: 12,
                lineHeight: 1.45,
                resize: "vertical",
              }}
            />
          </div>

          {/* Groq API Key Configuration */}
          <div className="card" style={{ padding: "14px 18px", background: "var(--card-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Key size={14} color="var(--purple)" />
              <strong style={{ fontSize: 12, color: "var(--ink)" }}>
                Groq API Key (Optional / Custom)
              </strong>
            </div>
            <input
              type="password"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              placeholder="gsk_... (Leave empty to use built-in Groq analyzer)"
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 6,
                border: "1px solid var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--ink)",
                fontSize: 11.5,
              }}
            />
            <span style={{ fontSize: 10, color: "var(--muted)", display: "block", marginTop: 4 }}>
              Powered by Groq LLaMA-3.3-70B model with ultra-fast sub-second token throughput.
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(220, 38, 38, 0.1)", color: "#dc2626", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <AlertCircle size={15} /> {errorMessage}
        </div>
      )}

      {/* Main Analyze Action Button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          className="learning-button"
          disabled={isAnalyzing}
          onClick={handleAnalyze}
          style={{ fontSize: 14, padding: "12px 32px", display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <Sparkles size={16} className={isAnalyzing ? "animate-spin" : ""} />
          {isAnalyzing ? "Analyzing Resume with Groq AI..." : "Run AI Resume & ATS Analysis"}
        </button>
      </div>

      {/* RESULTS DASHBOARD */}
      {analysisResult && (
        <div className="animate-fade-in" style={{ display: "grid", gap: 18, marginTop: 10 }}>
          {/* Overall ATS Score Summary Card */}
          <div className="card" style={{ padding: "24px 28px", background: "var(--card-bg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                {/* Score Circle */}
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: `conic-gradient(#6366f1 ${analysisResult.atsScore * 3.6}deg, var(--line) 0deg)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "var(--card-bg)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 26, fontWeight: 900, color: "var(--ink)", lineHeight: 1 }}>
                      {analysisResult.atsScore}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
                      ATS Score
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "var(--ink)" }}>
                      {analysisResult.tier}
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: analysisResult.atsScore >= 80 ? "#16a34a" : "#d97706",
                        background: analysisResult.atsScore >= 80 ? "rgba(22, 163, 74, 0.1)" : "rgba(217, 119, 6, 0.1)",
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {analysisResult.matchPercentage}% JD Match
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5, maxWidth: 750 }}>
                    {analysisResult.summaryFeedback}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section-by-Section ATS Breakdown */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
              <Layers size={16} color="var(--purple)" /> Section-by-Section ATS Breakdown
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              {Object.entries(analysisResult.sections).map(([key, sec]) => (
                <div
                  key={key}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid var(--line)",
                    background: "var(--card-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: 12, textTransform: "capitalize", color: "var(--ink)" }}>
                      {key} Section
                    </strong>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: sec.score >= 75 ? "#16a34a" : "#d97706",
                      }}
                    >
                      {sec.score}/100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: "100%", height: 5, borderRadius: 3, background: "var(--line)", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${sec.score}%`,
                        height: "100%",
                        background: sec.score >= 75 ? "#16a34a" : "#d97706",
                        borderRadius: 3,
                      }}
                    />
                  </div>

                  <p style={{ margin: 0, fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>
                    {sec.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords & Strong Keywords Cloud */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {/* Missing Keywords */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px", color: "#dc2626", display: "flex", alignItems: "center", gap: 6 }}>
                <AlertTriangle size={16} /> Missing High-Priority Keywords
              </h3>
              <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "0 0 12px" }}>
                Add these technical competencies and tools to pass recruiter ATS keyword filters.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {analysisResult.missingKeywords.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#16a34a" }}>
                    ✅ Great job! No critical keywords missing.
                  </div>
                ) : (
                  analysisResult.missingKeywords.map((kw, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: "rgba(220, 38, 38, 0.05)",
                        border: "1px solid rgba(220, 38, 38, 0.2)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: 12, color: "var(--ink)" }}>{kw.keyword}</strong>
                        <span style={{ fontSize: 10.5, color: "var(--muted)", marginLeft: 6 }}>
                          ({kw.category})
                        </span>
                        <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 2 }}>{kw.reason}</div>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: kw.importance === "Critical" ? "#dc2626" : "#d97706",
                          background: kw.importance === "Critical" ? "#fee2e2" : "#fef3c7",
                          padding: "2px 6px",
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                      >
                        {kw.importance}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Strong Keywords Detected */}
            <div className="card" style={{ padding: "20px 24px" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px", color: "#16a34a", display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={16} /> Strong Keywords Detected
              </h3>
              <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "0 0 12px" }}>
                Keywords successfully parsed and indexed by the ATS scanner.
              </p>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {analysisResult.strongKeywordsFound.map((kw, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: 11,
                      background: "rgba(22, 163, 74, 0.1)",
                      color: "#16a34a",
                      border: "1px solid rgba(22, 163, 74, 0.25)",
                      padding: "3px 9px",
                      borderRadius: 14,
                      fontWeight: 600,
                    }}
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>

              {/* Role Suggestions */}
              <div style={{ marginTop: 18 }}>
                <strong style={{ fontSize: 12, color: "var(--ink)", display: "block", marginBottom: 6 }}>
                  💡 Role-Specific Recommendations:
                </strong>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, color: "var(--muted)", lineHeight: 1.5 }}>
                  {analysisResult.roleSpecificSuggestions.map((sug, i) => (
                    <li key={i}>{sug}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Google XYZ Bullet Point Rewrites */}
          {analysisResult.bulletPointImprovements && analysisResult.bulletPointImprovements.length > 0 && (
            <div className="card" style={{ padding: "20px 24px" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
                <Wand2 size={16} color="var(--purple)" /> High-Impact Google XYZ Bullet Point Rewrites
              </h3>
              <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "0 0 14px" }}>
                Transforms passive duties into quantified accomplishment statements (<em>Accomplished [X] by doing [Y] as measured by [Z]</em>).
              </p>

              <div style={{ display: "grid", gap: 12 }}>
                {analysisResult.bulletPointImprovements.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 8,
                      border: "1px solid var(--line)",
                      background: "var(--card-subtle)",
                      display: "grid",
                      gap: 6,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", background: "#fee2e2", padding: "1px 6px", borderRadius: 4 }}>
                        Before (Weak)
                      </span>
                      <span style={{ fontSize: 11.5, color: "var(--muted)", fontStyle: "italic" }}>
                        "{item.originalSnippet}"
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "1px 6px", borderRadius: 4, flexShrink: 0 }}>
                        After (Google XYZ)
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>
                        "{item.improvedVersion}"
                      </span>
                    </div>

                    <div style={{ fontSize: 10.5, color: "var(--purple)", marginTop: 2 }}>
                      <strong>Why this works:</strong> {item.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

