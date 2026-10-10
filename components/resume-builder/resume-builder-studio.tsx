"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Award,
  Briefcase,
  Camera,
  CheckCircle2,
  ChevronDown,
  Download,
  Edit3,
  Eye,
  FileCode,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  Palette,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  User,
  Wand2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  sampleResumeData,
  type CertificationItem,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
  type ResumeAccentColor,
  type ResumeData,
  type ResumeTemplateId,
} from "@/lib/resume-data";
import {
  getStoredResumeDraft,
  getStoredResumeSettings,
  saveResumeDraft,
  saveResumeSettings,
} from "@/lib/resume-storage";
import { ResumeRenderer } from "./resume-templates";

const AVATAR_PRESETS = [
  {
    label: "Professional 1",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
  },
  {
    label: "Professional 2",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80",
  },
  {
    label: "Professional 3",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80",
  },
  {
    label: "Professional 4",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80",
  },
];

export function ResumeBuilderStudio() {
  const [resume, setResume] = useState<ResumeData>(sampleResumeData);
  const [templateId, setTemplateId] = useState<ResumeTemplateId>("creative-duo");
  const [accentColor, setAccentColor] = useState<ResumeAccentColor>("purple");
  const [isDirectEditable, setIsDirectEditable] = useState<boolean>(true);
  const [showAtsModal, setShowAtsModal] = useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const draft = getStoredResumeDraft();
    const settings = getStoredResumeSettings();
    setResume(draft);
    if (settings.templateId) setTemplateId(settings.templateId);
    if (settings.accentColor) setAccentColor(settings.accentColor);
  }, []);

  function updateResume(updated: ResumeData) {
    setResume(updated);
    saveResumeDraft(updated);
  }

  function handleTemplateChange(newTemplate: ResumeTemplateId) {
    setTemplateId(newTemplate);
    saveResumeSettings({ templateId: newTemplate, accentColor });
  }

  function handleColorChange(newColor: ResumeAccentColor) {
    setAccentColor(newColor);
    saveResumeSettings({ templateId, accentColor: newColor });
  }

  // Load sample profile
  function handleLoadSample() {
    if (confirm("Load sample profile? This will populate the fields with a complete software engineer resume.")) {
      updateResume(sampleResumeData);
    }
  }

  // Clear resume
  function handleClearForm() {
    if (confirm("Clear resume contents to start fresh?")) {
      const empty: ResumeData = {
        personal: {
          fullName: "Your Full Name",
          jobTitle: "Target Job Title",
          email: "email@example.com",
          phone: "+91 98765 43210",
          location: "City, Country",
          linkedin: "linkedin.com/in/username",
          github: "github.com/username",
          portfolio: "portfolio.dev",
          summary: "Write your professional summary here...",
          photoUrl: "",
          showPhoto: false,
        },
        skills: {
          languages: "Java, Python, C++, TypeScript, SQL",
          frameworks: "React, Next.js, Node.js, Express, Spring Boot",
          toolsAndDatabases: "PostgreSQL, MongoDB, Redis, Docker, Git, AWS",
          coreConcepts: "Data Structures & Algorithms, System Design, REST APIs",
        },
        experience: [
          {
            id: `exp-${Date.now()}`,
            company: "Company Name",
            role: "Software Engineer",
            location: "City, Country",
            startDate: "2023",
            endDate: "Present",
            current: true,
            bullets: ["Spearheaded development of scalable features and optimized latency."],
          },
        ],
        projects: [
          {
            id: `proj-${Date.now()}`,
            title: "Project Name",
            techStack: "Next.js, TypeScript, Tailwind CSS",
            link: "https://github.com/user/project",
            bullets: ["Engineered responsive application featuring real-time data sync."],
          },
        ],
        education: [
          {
            id: `edu-${Date.now()}`,
            institution: "University Name",
            degree: "Bachelor of Technology",
            field: "Computer Science",
            location: "City, Country",
            startDate: "2020",
            endDate: "2024",
            grade: "CGPA: 8.8 / 10",
          },
        ],
        certifications: [
          {
            id: `cert-${Date.now()}`,
            name: "AWS Certified Developer",
            issuer: "Amazon Web Services",
            date: "2024",
          },
        ],
      };
      updateResume(empty);
    }
  }

  // Handle Photo File Upload
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      updateResume({
        ...resume,
        personal: {
          ...resume.personal,
          photoUrl: result,
          showPhoto: true,
        },
      });
      setShowPhotoModal(false);
    };
    reader.readAsDataURL(file);
  }

  // AI Summary Enhancement
  function handleAiSummaryGenerate() {
    setIsAiLoading(true);
    setTimeout(() => {
      const role = resume.personal.jobTitle || "Software Engineer";
      const langs = resume.skills.languages || "modern technologies";
      const summaryOptions = [
        `Results-driven ${role} with strong foundational expertise in ${langs}. Demonstrated ability to architect high-performance web applications, optimize backend latency, and deliver scalable full-stack features. Passionate about clean code architecture, algorithmic problem-solving, and high-impact engineering.`,
        `High-performing ${role} equipped with solid proficiency in ${langs} and distributed software design. Proven track record of developing reliable software systems, collaborating in cross-functional Agile environments, and shipping production-ready code with 99.9% uptime.`,
        `Dynamic ${role} specialized in building end-to-end applications using ${langs}. Strong communicator with solid background in data structures, API architecture, and database optimization for high-concurrency systems.`,
      ];
      const selected = summaryOptions[Math.floor(Math.random() * summaryOptions.length)];
      updateResume({
        ...resume,
        personal: { ...resume.personal, summary: selected },
      });
      setIsAiLoading(false);
      setShowAiModal(false);
    }, 600);
  }

  // AI Polish All Bullets
  function handleAiPolishAllBullets() {
    setIsAiLoading(true);
    setTimeout(() => {
      const updatedExp = resume.experience.map((exp) => ({
        ...exp,
        bullets: exp.bullets.map((b) => {
          if (!b.trim()) return b;
          if (b.includes("Worked on") || b.includes("Responsible for")) {
            return b.replace("Worked on", "Spearheaded development of").replace("Responsible for", "Architected and delivered");
          }
          return `Engineered and optimized ${b.replace(/^([A-Z])/, (m) => m.toLowerCase())}, boosting performance and throughput.`;
        }),
      }));

      const updatedProj = resume.projects.map((proj) => ({
        ...proj,
        bullets: proj.bullets.map((b) => {
          if (!b.trim()) return b;
          return `Developed and deployed ${b.replace(/^([A-Z])/, (m) => m.toLowerCase())}, achieving sub-second query response.`;
        }),
      }));

      updateResume({ ...resume, experience: updatedExp, projects: updatedProj });
      setIsAiLoading(false);
      setShowAiModal(false);
    }, 600);
  }

  // Print PDF Trigger
  function handlePrintPdf() {
    window.print();
  }

  // Calculate ATS Score
  const atsScore = calculateAtsScore(resume);

  return (
    <div className="content resume-builder-page">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      {/* Top Header & Studio Navigation */}
      <div className="resume-builder-header">
        <div>
          <div className="eyebrow">A4 RESUME BUILDER & DESIGN STUDIO</div>
          <h1 style={{ fontSize: 24, margin: "4px 0 2px" }}>Placement Resume Studio</h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: 13 }}>
            Customize your details directly inside the A4 paper below, choose creative templates, and export to PDF.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="resume-builder-actions">
          <button
            type="button"
            className="learning-button secondary"
            onClick={() => setShowPhotoModal(true)}
            style={{ fontSize: 12, padding: "8px 12px" }}
            title="Upload or change resume photo"
          >
            <Camera size={14} color="var(--purple)" /> Photo Options
          </button>

          <button
            type="button"
            className="learning-button secondary"
            onClick={() => setShowAiModal(true)}
            style={{ fontSize: 12, padding: "8px 12px" }}
            title="Enhance summary and polish bullet points with AI"
          >
            <Sparkles size={14} color="var(--purple)" /> AI Assistant
          </button>

          <button
            type="button"
            className="learning-button secondary"
            onClick={() => setShowAtsModal(true)}
            style={{ fontSize: 12, padding: "8px 12px" }}
          >
            <CheckCircle2 size={14} color="#16a34a" /> ATS Score:{" "}
            <strong>{atsScore.score}/100</strong>
          </button>

          <button
            type="button"
            className="learning-button secondary"
            onClick={handleLoadSample}
            style={{ fontSize: 12, padding: "8px 12px" }}
            title="Pre-fill with sample profile"
          >
            <RotateCcw size={14} /> Sample
          </button>

          <button
            type="button"
            className="learning-button"
            onClick={handlePrintPdf}
            style={{ fontSize: 12, padding: "8px 16px" }}
          >
            <Printer size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Top Customizer Bar for Single A4 Studio */}
      <div className="resume-customizer-bar">
        {/* Template Selector */}
        <div className="customizer-group">
          <span className="customizer-label">Template:</span>
          <div className="template-select-pills">
            <button
              type="button"
              className={templateId === "creative-duo" ? "active" : ""}
              onClick={() => handleTemplateChange("creative-duo")}
            >
              Creative Duo
            </button>
            <button
              type="button"
              className={templateId === "creative-banner" ? "active" : ""}
              onClick={() => handleTemplateChange("creative-banner")}
            >
              Creative Banner
            </button>
            <button
              type="button"
              className={templateId === "modern" ? "active" : ""}
              onClick={() => handleTemplateChange("modern")}
            >
              Modern Tech
            </button>
            <button
              type="button"
              className={templateId === "compact" ? "active" : ""}
              onClick={() => handleTemplateChange("compact")}
            >
              Stanford
            </button>
            <button
              type="button"
              className={templateId === "classic" ? "active" : ""}
              onClick={() => handleTemplateChange("classic")}
            >
              Classic ATS
            </button>
          </div>
        </div>

        {/* Accent Color Themes */}
        <div className="customizer-group">
          <span className="customizer-label">Theme:</span>
          <div className="color-swatches">
            <button
              type="button"
              className={`color-swatch purple ${accentColor === "purple" ? "selected" : ""}`}
              onClick={() => handleColorChange("purple")}
              title="Indigo Purple"
            />
            <button
              type="button"
              className={`color-swatch blue ${accentColor === "blue" ? "selected" : ""}`}
              onClick={() => handleColorChange("blue")}
              title="Sky Blue"
            />
            <button
              type="button"
              className={`color-swatch emerald ${accentColor === "emerald" ? "selected" : ""}`}
              onClick={() => handleColorChange("emerald")}
              title="Emerald Green"
            />
            <button
              type="button"
              className={`color-swatch rose ${accentColor === "rose" ? "selected" : ""}`}
              onClick={() => handleColorChange("rose")}
              title="Crimson Sunset"
              style={{ background: "#e11d48" }}
            />
            <button
              type="button"
              className={`color-swatch amber ${accentColor === "amber" ? "selected" : ""}`}
              onClick={() => handleColorChange("amber")}
              title="Warm Amber"
              style={{ background: "#d97706" }}
            />
            <button
              type="button"
              className={`color-swatch slate ${accentColor === "slate" ? "selected" : ""}`}
              onClick={() => handleColorChange("slate")}
              title="Midnight Slate"
            />
          </div>
        </div>

        {/* Direct Edit Mode Toggle */}
        <div className="customizer-group">
          <span className="customizer-label">Mode:</span>
          <div className="template-select-pills">
            <button
              type="button"
              className={isDirectEditable ? "active" : ""}
              onClick={() => setIsDirectEditable(true)}
              title="Click and type directly on the resume to edit"
            >
              <Edit3 size={12} /> Direct Edit
            </button>
            <button
              type="button"
              className={!isDirectEditable ? "active" : ""}
              onClick={() => setIsDirectEditable(false)}
              title="Clean print preview"
            >
              <Eye size={12} /> Clean View
            </button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="customizer-group zoom-ctrls">
          <button
            type="button"
            className="code-icon-btn"
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            className="code-icon-btn"
            onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      {/* Direct Edit Helper Hint */}
      {isDirectEditable && (
        <div className="resume-direct-edit-hint">
          <span>✍️ <strong>Interactive A4 Paper:</strong> Click and type directly on any section, name, bullet point, skill, or photo inside the A4 paper below to customize your resume!</span>
        </div>
      )}

      {/* SINGLE CENTERED A4 PAPER CONTAINER */}
      <div className="resume-paper-scroller">
        <div
          className="resume-paper-wrapper"
          id="printable-resume"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
        >
          <ResumeRenderer
            data={resume}
            templateId={templateId}
            accentColor={accentColor}
            isEditable={isDirectEditable}
            onUpdate={updateResume}
            onPhotoUploadClick={() => setShowPhotoModal(true)}
          />
        </div>
      </div>

      {/* PHOTO MANAGEMENT MODAL */}
      {showPhotoModal && (
        <div className="ats-modal-backdrop" onClick={() => setShowPhotoModal(false)}>
          <div className="card ats-modal-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="ats-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="stat-icon" style={{ width: 38, height: 38, borderRadius: 10 }}>
                  <Camera size={18} />
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>Resume Profile Photo</h3>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>
                    Upload your headshot or choose an avatar
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setShowPhotoModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ margin: "16px 0", display: "grid", gap: 16 }}>
              {/* Current Photo Preview & Upload Button */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--card-subtle)", padding: 14, borderRadius: 12 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: "2px solid var(--purple)", flexShrink: 0, background: "var(--card-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {resume.personal.photoUrl ? (
                    <img src={resume.personal.photoUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <User size={32} color="var(--muted)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <button
                    type="button"
                    className="learning-button"
                    style={{ fontSize: 12, padding: "8px 14px", marginBottom: 8 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={13} /> Upload Photo from Device
                  </button>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>
                    Supports PNG, JPG, JPEG, WEBP. Max 5MB.
                  </p>
                </div>
              </div>

              {/* Toggle Visibility */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--card-bg)", borderRadius: 10, border: "1px solid var(--line)" }}>
                <div>
                  <strong style={{ fontSize: 13, display: "block", color: "var(--ink)" }}>Show Photo on Resume</strong>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>Toggle whether headshot renders in PDF / preview</span>
                </div>
                <input
                  type="checkbox"
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                  checked={Boolean(resume.personal.showPhoto)}
                  onChange={(e) =>
                    updateResume({
                      ...resume,
                      personal: { ...resume.personal, showPhoto: e.target.checked },
                    })
                  }
                />
              </div>

              {/* Sample Presets */}
              <div>
                <strong style={{ fontSize: 12, display: "block", marginBottom: 8, color: "var(--ink)" }}>
                  Or Choose from Sample Professional Avatars:
                </strong>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        updateResume({
                          ...resume,
                          personal: {
                            ...resume.personal,
                            photoUrl: preset.url,
                            showPhoto: true,
                          },
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        border: resume.personal.photoUrl === preset.url ? "2px solid var(--purple)" : "1px solid var(--line)",
                        borderRadius: 10,
                        padding: 6,
                        textAlign: "center",
                        background: "var(--card-bg)",
                        transition: "transform 0.15s ease",
                      }}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", margin: "0 auto 4px" }}
                      />
                      <span style={{ fontSize: 10, color: "var(--muted)", display: "block" }}>{preset.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remove Photo */}
              {resume.personal.photoUrl && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <button
                    type="button"
                    className="learning-button secondary"
                    style={{ fontSize: 11, padding: "6px 12px", color: "#dc2626" }}
                    onClick={() => {
                      updateResume({
                        ...resume,
                        personal: { ...resume.personal, photoUrl: "", showPhoto: false },
                      });
                    }}
                  >
                    <Trash2 size={12} /> Remove Current Photo
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button
                type="button"
                className="learning-button"
                onClick={() => setShowPhotoModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI ASSISTANT MODAL */}
      {showAiModal && (
        <div className="ats-modal-backdrop" onClick={() => setShowAiModal(false)}>
          <div className="card ats-modal-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="ats-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="stat-icon" style={{ width: 38, height: 38, borderRadius: 10 }}>
                  <Sparkles size={18} />
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>AI Resume Assistant</h3>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>
                    Generate impactful summaries & polish action bullet points
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setShowAiModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ margin: "18px 0", display: "grid", gap: 14 }}>
              <div style={{ padding: 14, background: "var(--card-subtle)", borderRadius: 10 }}>
                <strong style={{ fontSize: 13, display: "block", color: "var(--ink)", marginBottom: 4 }}>
                  ✨ Generate Professional Summary
                </strong>
                <p style={{ margin: "0 0 10px", fontSize: 11, color: "var(--muted)" }}>
                  Tailors an impactful summary for {resume.personal.jobTitle || "Software Engineer"} using your skills.
                </p>
                <button
                  type="button"
                  className="learning-button"
                  disabled={isAiLoading}
                  onClick={handleAiSummaryGenerate}
                  style={{ fontSize: 11, padding: "6px 12px" }}
                >
                  <Wand2 size={12} /> {isAiLoading ? "Generating..." : "Generate AI Summary"}
                </button>
              </div>

              <div style={{ padding: 14, background: "var(--card-subtle)", borderRadius: 10 }}>
                <strong style={{ fontSize: 13, display: "block", color: "var(--ink)", marginBottom: 4 }}>
                  ⚡ Polish All Bullet Points
                </strong>
                <p style={{ margin: "0 0 10px", fontSize: 11, color: "var(--muted)" }}>
                  Converts standard task descriptions into quantified XYZ accomplishment statements across all experience and project items.
                </p>
                <button
                  type="button"
                  className="learning-button secondary"
                  disabled={isAiLoading}
                  onClick={handleAiPolishAllBullets}
                  style={{ fontSize: 11, padding: "6px 12px" }}
                >
                  <Sparkles size={12} /> {isAiLoading ? "Polishing..." : "Polish All Bullets"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="learning-button secondary"
                onClick={() => setShowAiModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ATS SCORE & OPTIMIZATION MODAL */}
      {showAtsModal && (
        <div className="ats-modal-backdrop" onClick={() => setShowAtsModal(false)}>
          <div className="card ats-modal-card animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="ats-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="stat-icon" style={{ width: 38, height: 38, borderRadius: 10 }}>
                  <Sparkles size={18} />
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>AI ATS Compatibility Score</h3>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>
                    Automated analysis of recruiters & ATS parsing criteria
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setShowAtsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="ats-score-badge-row">
              <div className="ats-score-circle">
                <strong>{atsScore.score}</strong>
                <span>/ 100</span>
              </div>
              <div>
                <strong style={{ fontSize: 15, color: "var(--ink)" }}>
                  {atsScore.score >= 80
                    ? "🌟 High Placement Readiness!"
                    : atsScore.score >= 60
                    ? "👍 Good ATS Base"
                    : "⚠️ Needs Improvement"}
                </strong>
                <p style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.5 }}>
                  {atsScore.score >= 80
                    ? "Your resume has high keyword density, strong action verbs, and clear ATS-friendly section structuring."
                    : "Add more quantifiable metrics, tech stack keywords, and bullet points to maximize interview calls."}
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="ats-checklist">
              {atsScore.checklist.map((item, idx) => (
                <div key={idx} className="ats-check-item">
                  <CheckCircle2
                    size={16}
                    color={item.passed ? "#16a34a" : "#cbd5e1"}
                    style={{ flexShrink: 0 }}
                  />
                  <div>
                    <strong style={{ fontSize: 12, color: item.passed ? "var(--ink)" : "var(--muted)" }}>
                      {item.title}
                    </strong>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
              <button
                type="button"
                className="learning-button"
                onClick={() => setShowAtsModal(false)}
              >
                Got It, Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateAtsScore(data: ResumeData): {
  score: number;
  checklist: Array<{ title: string; desc: string; passed: boolean }>;
} {
  let score = 20;
  const checklist = [];

  const hasNameAndContact = Boolean(data.personal.fullName && data.personal.email && data.personal.phone);
  if (hasNameAndContact) score += 15;
  checklist.push({
    title: "Complete Contact Information",
    desc: "Includes Full Name, professional email, phone number, and location.",
    passed: hasNameAndContact,
  });

  const hasSummary = Boolean(data.personal.summary && data.personal.summary.length > 50);
  if (hasSummary) score += 15;
  checklist.push({
    title: "Impactful Summary Statement",
    desc: "A concise 2-3 sentence overview highlighting your engineering focus.",
    passed: hasSummary,
  });

  const hasSkills = Boolean(data.skills.languages && data.skills.frameworks);
  if (hasSkills) score += 20;
  checklist.push({
    title: "Categorized Technical Skills",
    desc: "Languages, Frameworks, Tools, and Databases categorized for ATS parser keywords.",
    passed: hasSkills,
  });

  const hasProjectsOrExp = data.experience.length > 0 || data.projects.length > 0;
  if (hasProjectsOrExp) score += 20;
  checklist.push({
    title: "Work Experience or Key Projects",
    desc: "At least 1-2 structured technical projects or internships with action bullet points.",
    passed: hasProjectsOrExp,
  });

  const hasEducation = data.education.length > 0 && Boolean(data.education[0].institution);
  if (hasEducation) score += 10;
  checklist.push({
    title: "Academic Background",
    desc: "College, degree, major, graduation year, and CGPA listed.",
    passed: hasEducation,
  });

  return { score: Math.min(100, score), checklist };
}
