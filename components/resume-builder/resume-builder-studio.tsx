"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Eye,
  FileCode,
  FileText,
  GraduationCap,
  Layers,
  Palette,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trash2,
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

export function ResumeBuilderStudio() {
  const [resume, setResume] = useState<ResumeData>(sampleResumeData);
  const [templateId, setTemplateId] = useState<ResumeTemplateId>("modern");
  const [accentColor, setAccentColor] = useState<ResumeAccentColor>("purple");
  const [activeFormTab, setActiveFormTab] = useState<
    "personal" | "summary" | "skills" | "experience" | "projects" | "education" | "certifications"
  >("personal");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const draft = getStoredResumeDraft();
    const settings = getStoredResumeSettings();
    setResume(draft);
    setTemplateId(settings.templateId);
    setAccentColor(settings.accentColor);
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

  // Clear form
  function handleClearForm() {
    if (confirm("Clear all resume fields?")) {
      const empty: ResumeData = {
        personal: {
          fullName: "",
          jobTitle: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          portfolio: "",
          summary: "",
        },
        skills: {
          languages: "",
          frameworks: "",
          toolsAndDatabases: "",
          coreConcepts: "",
        },
        experience: [],
        projects: [],
        education: [],
        certifications: [],
      };
      updateResume(empty);
    }
  }

  // AI Summary Enhancement
  function handleAiSummaryGenerate() {
    setIsAiLoading(true);
    setTimeout(() => {
      const role = resume.personal.jobTitle || "Software Engineer";
      const langs = resume.skills.languages || "modern technologies";
      const summaryOptions = [
        `Results-oriented ${role} with strong foundational expertise in ${langs}. Demonstrated ability to architect high-performance web applications, optimize backend latency, and deliver scalable full-stack features. Passionate about problem-solving, clean code architecture, and high-impact engineering.`,
        `High-performing ${role} equipped with solid proficiency in ${langs} and distributed software design. Proven track record of developing reliable software systems, collaborating in cross-functional Agile environments, and shipping production-ready code with 99.9% reliability.`,
      ];
      const selected = summaryOptions[Math.floor(Math.random() * summaryOptions.length)];
      updateResume({
        ...resume,
        personal: { ...resume.personal, summary: selected },
      });
      setIsAiLoading(false);
    }, 600);
  }

  // AI Bullet Points Polisher
  function handleAiPolishBullets(type: "experience" | "project", id: string) {
    setIsAiLoading(true);
    setTimeout(() => {
      if (type === "experience") {
        const updatedExp = resume.experience.map((exp) => {
          if (exp.id === id) {
            const polished = exp.bullets.map((b) => {
              if (!b.trim()) return b;
              if (b.includes("Worked on") || b.includes("Responsible for")) {
                return b.replace("Worked on", "Spearheaded development of").replace("Responsible for", "Architected and delivered");
              }
              return `Engineered and optimized ${b.replace(/^([A-Z])/, (m) => m.toLowerCase())}, achieving a 30% boost in system performance.`;
            });
            return { ...exp, bullets: polished };
          }
          return exp;
        });
        updateResume({ ...resume, experience: updatedExp });
      } else {
        const updatedProj = resume.projects.map((proj) => {
          if (proj.id === id) {
            const polished = proj.bullets.map((b) => {
              if (!b.trim()) return b;
              return `Developed and deployed ${b.replace(/^([A-Z])/, (m) => m.toLowerCase())}, supporting high concurrent throughput and seamless user experience.`;
            });
            return { ...proj, bullets: polished };
          }
          return proj;
        });
        updateResume({ ...resume, projects: updatedProj });
      }
      setIsAiLoading(false);
    }, 500);
  }

  // Experience Handlers
  function addExperience() {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: ["Developed key modules and collaborated with cross-functional engineering teams."],
    };
    updateResume({ ...resume, experience: [newItem, ...resume.experience] });
  }

  function removeExperience(id: string) {
    updateResume({
      ...resume,
      experience: resume.experience.filter((e) => e.id !== id),
    });
  }

  // Project Handlers
  function addProject() {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: "",
      techStack: "",
      link: "",
      bullets: ["Engineered scalable architecture with clean API design and comprehensive test coverage."],
    };
    updateResume({ ...resume, projects: [newItem, ...resume.projects] });
  }

  function removeProject(id: string) {
    updateResume({
      ...resume,
      projects: resume.projects.filter((p) => p.id !== id),
    });
  }

  // Education Handlers
  function addEducation() {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "B.Tech",
      field: "Computer Science",
      location: "",
      startDate: "2020",
      endDate: "2024",
      grade: "",
    };
    updateResume({ ...resume, education: [...resume.education, newItem] });
  }

  function removeEducation(id: string) {
    updateResume({
      ...resume,
      education: resume.education.filter((e) => e.id !== id),
    });
  }

  // Certification Handlers
  function addCertification() {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: new Date().getFullYear().toString(),
    };
    updateResume({ ...resume, certifications: [...resume.certifications, newItem] });
  }

  function removeCertification(id: string) {
    updateResume({
      ...resume,
      certifications: resume.certifications.filter((c) => c.id !== id),
    });
  }

  // Print PDF Trigger
  function handlePrintPdf() {
    window.print();
  }

  // Calculate ATS Score
  const atsScore = calculateAtsScore(resume);

  return (
    <div className="content resume-builder-page">
      {/* Top Header & Toolbar */}
      <div className="resume-builder-header">
        <div>
          <div className="eyebrow">AI RESUME BUILDER</div>
          <h1 style={{ fontSize: 24, margin: "4px 0 2px" }}>Placement Resume Studio</h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: 13 }}>
            Build, polish with AI, and download ATS-compliant resumes in multiple formats.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="resume-builder-actions">
          <button
            type="button"
            className="learning-button secondary"
            onClick={() => setShowAtsModal(true)}
            style={{ fontSize: 12, padding: "8px 12px" }}
          >
            <Sparkles size={14} color="var(--purple)" /> ATS Score:{" "}
            <strong>{atsScore.score}/100</strong>
          </button>

          <button
            type="button"
            className="learning-button secondary"
            onClick={handleLoadSample}
            style={{ fontSize: 12, padding: "8px 12px" }}
            title="Pre-fill with a sample CS resume profile"
          >
            <RotateCcw size={14} /> Sample Profile
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

      {/* Mobile Mode Switcher */}
      <div className="resume-mobile-toggle">
        <button
          type="button"
          className={mobileTab === "edit" ? "active" : ""}
          onClick={() => setMobileTab("edit")}
        >
          <FileText size={14} /> Edit Form
        </button>
        <button
          type="button"
          className={mobileTab === "preview" ? "active" : ""}
          onClick={() => setMobileTab("preview")}
        >
          <Eye size={14} /> Live Preview
        </button>
      </div>

      {/* Split-Screen Studio */}
      <div className="resume-studio-split">
        {/* LEFT PANE: Form Inputs & AI Polish */}
        <div className={`resume-form-pane ${mobileTab === "edit" ? "mobile-show" : ""}`}>
          {/* Navigation Category Tabs */}
          <div className="resume-form-nav">
            <button
              type="button"
              className={activeFormTab === "personal" ? "active" : ""}
              onClick={() => setActiveFormTab("personal")}
            >
              <User size={14} /> Personal
            </button>
            <button
              type="button"
              className={activeFormTab === "summary" ? "active" : ""}
              onClick={() => setActiveFormTab("summary")}
            >
              <Wand2 size={14} /> Summary
            </button>
            <button
              type="button"
              className={activeFormTab === "skills" ? "active" : ""}
              onClick={() => setActiveFormTab("skills")}
            >
              <FileCode size={14} /> Skills
            </button>
            <button
              type="button"
              className={activeFormTab === "experience" ? "active" : ""}
              onClick={() => setActiveFormTab("experience")}
            >
              <Briefcase size={14} /> Experience ({resume.experience.length})
            </button>
            <button
              type="button"
              className={activeFormTab === "projects" ? "active" : ""}
              onClick={() => setActiveFormTab("projects")}
            >
              <Layers size={14} /> Projects ({resume.projects.length})
            </button>
            <button
              type="button"
              className={activeFormTab === "education" ? "active" : ""}
              onClick={() => setActiveFormTab("education")}
            >
              <GraduationCap size={14} /> Education
            </button>
            <button
              type="button"
              className={activeFormTab === "certifications" ? "active" : ""}
              onClick={() => setActiveFormTab("certifications")}
            >
              <Award size={14} /> Certifications
            </button>
          </div>

          {/* Form Content Area */}
          <div className="resume-form-body">
            {/* 1. PERSONAL INFO */}
            {activeFormTab === "personal" && (
              <div className="animate-fade-in form-section-wrap">
                <h3 className="form-section-title">Personal Contact Details</h3>
                <div className="form-grid-2">
                  <label className="resume-label">
                    Full Name
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="e.g. Alex Rivera"
                      value={resume.personal.fullName}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personal: { ...resume.personal, fullName: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label className="resume-label">
                    Target Job Title
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="e.g. Full Stack Engineer / SDE-1"
                      value={resume.personal.jobTitle}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personal: { ...resume.personal, jobTitle: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label className="resume-label">
                    Email Address
                    <input
                      type="email"
                      className="resume-input"
                      placeholder="alex@example.com"
                      value={resume.personal.email}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personal: { ...resume.personal, email: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label className="resume-label">
                    Phone Number
                    <input
                      type="tel"
                      className="resume-input"
                      placeholder="+91 98765 43210"
                      value={resume.personal.phone}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personal: { ...resume.personal, phone: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label className="resume-label">
                    Location (City, Country)
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="Bangalore, India"
                      value={resume.personal.location}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personal: { ...resume.personal, location: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label className="resume-label">
                    LinkedIn Profile URL
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="linkedin.com/in/username"
                      value={resume.personal.linkedin}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personal: { ...resume.personal, linkedin: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label className="resume-label">
                    GitHub Profile URL
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="github.com/username"
                      value={resume.personal.github}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personal: { ...resume.personal, github: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label className="resume-label">
                    Portfolio / Website URL
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="portfolio.dev"
                      value={resume.personal.portfolio}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          personal: { ...resume.personal, portfolio: e.target.value },
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            )}

            {/* 2. PROFESSIONAL SUMMARY */}
            {activeFormTab === "summary" && (
              <div className="animate-fade-in form-section-wrap">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 className="form-section-title" style={{ margin: 0 }}>Professional Summary</h3>
                  <button
                    type="button"
                    className="learning-button"
                    onClick={handleAiSummaryGenerate}
                    disabled={isAiLoading}
                    style={{ fontSize: 11, padding: "6px 12px" }}
                  >
                    <Sparkles size={13} /> {isAiLoading ? "Writing..." : "✨ AI Generate / Polish"}
                  </button>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 12px" }}>
                  Write a concise 2-3 sentence overview highlighting your core strengths, technical stack, and placement focus.
                </p>
                <textarea
                  className="resume-textarea"
                  rows={6}
                  placeholder="e.g. Dedicated software engineer with 2+ years of hands-on experience in React, Node.js, and cloud services..."
                  value={resume.personal.summary}
                  onChange={(e) =>
                    updateResume({
                      ...resume,
                      personal: { ...resume.personal, summary: e.target.value },
                    })
                  }
                />
              </div>
            )}

            {/* 3. TECHNICAL SKILLS */}
            {activeFormTab === "skills" && (
              <div className="animate-fade-in form-section-wrap">
                <h3 className="form-section-title">Technical Skills & Competencies</h3>
                <div style={{ display: "grid", gap: 14 }}>
                  <label className="resume-label">
                    Programming Languages
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="e.g. Java, Python, C++, TypeScript, JavaScript, SQL"
                      value={resume.skills.languages}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          skills: { ...resume.skills, languages: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label className="resume-label">
                    Frameworks & Libraries
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="e.g. React, Next.js, Node.js, Express, Tailwind CSS, Spring Boot"
                      value={resume.skills.frameworks}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          skills: { ...resume.skills, frameworks: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label className="resume-label">
                    Developer Tools & Databases
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="e.g. PostgreSQL, MongoDB, Redis, Docker, Git, AWS, Supabase"
                      value={resume.skills.toolsAndDatabases}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          skills: { ...resume.skills, toolsAndDatabases: e.target.value },
                        })
                      }
                    />
                  </label>

                  <label className="resume-label">
                    Core CS Concepts
                    <input
                      type="text"
                      className="resume-input"
                      placeholder="e.g. Data Structures & Algorithms, System Design, REST APIs, OOPs"
                      value={resume.skills.coreConcepts}
                      onChange={(e) =>
                        updateResume({
                          ...resume,
                          skills: { ...resume.skills, coreConcepts: e.target.value },
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            )}

            {/* 4. WORK EXPERIENCE */}
            {activeFormTab === "experience" && (
              <div className="animate-fade-in form-section-wrap">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 className="form-section-title" style={{ margin: 0 }}>Work & Internship Experience</h3>
                  <button
                    type="button"
                    className="learning-button"
                    onClick={addExperience}
                    style={{ fontSize: 11, padding: "6px 12px" }}
                  >
                    <Plus size={14} /> Add Experience
                  </button>
                </div>

                {resume.experience.length === 0 ? (
                  <div className="resume-empty-box">
                    <Briefcase size={28} style={{ color: "var(--muted)", margin: "0 auto 8px" }} />
                    <p>No work experiences added yet.</p>
                    <button type="button" className="learning-button secondary" onClick={addExperience}>
                      + Add Work Experience
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 16 }}>
                    {resume.experience.map((exp, idx) => (
                      <div key={exp.id} className="card resume-item-card">
                        <div className="item-card-header">
                          <strong>#{idx + 1} {exp.role || "Job Role"} {exp.company ? `@ ${exp.company}` : ""}</strong>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              type="button"
                              className="learning-button secondary"
                              style={{ fontSize: 10, padding: "4px 8px" }}
                              onClick={() => handleAiPolishBullets("experience", exp.id)}
                              title="Polish bullet points into STAR format"
                            >
                              <Sparkles size={11} /> AI Polish Bullets
                            </button>
                            <button
                              type="button"
                              className="resume-delete-btn"
                              onClick={() => removeExperience(exp.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="form-grid-2" style={{ marginTop: 10 }}>
                          <label className="resume-label">
                            Company Name
                            <input
                              type="text"
                              className="resume-input"
                              placeholder="e.g. Google / Microsoft / Startup"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = resume.experience.map((item) =>
                                  item.id === exp.id ? { ...item, company: e.target.value } : item
                                );
                                updateResume({ ...resume, experience: updated });
                              }}
                            />
                          </label>

                          <label className="resume-label">
                            Role / Title
                            <input
                              type="text"
                              className="resume-input"
                              placeholder="e.g. Software Engineer Intern"
                              value={exp.role}
                              onChange={(e) => {
                                const updated = resume.experience.map((item) =>
                                  item.id === exp.id ? { ...item, role: e.target.value } : item
                                );
                                updateResume({ ...resume, experience: updated });
                              }}
                            />
                          </label>

                          <label className="resume-label">
                            Start Date
                            <input
                              type="text"
                              className="resume-input"
                              placeholder="e.g. Jan 2024"
                              value={exp.startDate}
                              onChange={(e) => {
                                const updated = resume.experience.map((item) =>
                                  item.id === exp.id ? { ...item, startDate: e.target.value } : item
                                );
                                updateResume({ ...resume, experience: updated });
                              }}
                            />
                          </label>

                          <label className="resume-label">
                            End Date
                            <input
                              type="text"
                              className="resume-input"
                              placeholder="e.g. Jun 2024 or Present"
                              value={exp.endDate}
                              onChange={(e) => {
                                const updated = resume.experience.map((item) =>
                                  item.id === exp.id ? { ...item, endDate: e.target.value } : item
                                );
                                updateResume({ ...resume, experience: updated });
                              }}
                            />
                          </label>
                        </div>

                        {/* Bullet Points */}
                        <div style={{ marginTop: 12 }}>
                          <label className="resume-label">
                            Key Achievements & Responsibilities (1 per line)
                          </label>
                          <textarea
                            className="resume-textarea"
                            rows={3}
                            placeholder="Enter bullet points (one per line)..."
                            value={exp.bullets.join("\n")}
                            onChange={(e) => {
                              const bullets = e.target.value.split("\n");
                              const updated = resume.experience.map((item) =>
                                item.id === exp.id ? { ...item, bullets } : item
                              );
                              updateResume({ ...resume, experience: updated });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. PROJECTS */}
            {activeFormTab === "projects" && (
              <div className="animate-fade-in form-section-wrap">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 className="form-section-title" style={{ margin: 0 }}>Featured Projects</h3>
                  <button
                    type="button"
                    className="learning-button"
                    onClick={addProject}
                    style={{ fontSize: 11, padding: "6px 12px" }}
                  >
                    <Plus size={14} /> Add Project
                  </button>
                </div>

                {resume.projects.length === 0 ? (
                  <div className="resume-empty-box">
                    <Layers size={28} style={{ color: "var(--muted)", margin: "0 auto 8px" }} />
                    <p>No projects added yet.</p>
                    <button type="button" className="learning-button secondary" onClick={addProject}>
                      + Add Key Project
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 16 }}>
                    {resume.projects.map((proj, idx) => (
                      <div key={proj.id} className="card resume-item-card">
                        <div className="item-card-header">
                          <strong>#{idx + 1} {proj.title || "Project Title"}</strong>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              type="button"
                              className="learning-button secondary"
                              style={{ fontSize: 10, padding: "4px 8px" }}
                              onClick={() => handleAiPolishBullets("project", proj.id)}
                            >
                              <Sparkles size={11} /> AI Polish
                            </button>
                            <button
                              type="button"
                              className="resume-delete-btn"
                              onClick={() => removeProject(proj.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="form-grid-2" style={{ marginTop: 10 }}>
                          <label className="resume-label">
                            Project Title
                            <input
                              type="text"
                              className="resume-input"
                              placeholder="e.g. PlacePrep AI LMS"
                              value={proj.title}
                              onChange={(e) => {
                                const updated = resume.projects.map((item) =>
                                  item.id === proj.id ? { ...item, title: e.target.value } : item
                                );
                                updateResume({ ...resume, projects: updated });
                              }}
                            />
                          </label>

                          <label className="resume-label">
                            Technologies Used
                            <input
                              type="text"
                              className="resume-input"
                              placeholder="e.g. Next.js, TypeScript, Supabase, Tailwind"
                              value={proj.techStack}
                              onChange={(e) => {
                                const updated = resume.projects.map((item) =>
                                  item.id === proj.id ? { ...item, techStack: e.target.value } : item
                                );
                                updateResume({ ...resume, projects: updated });
                              }}
                            />
                          </label>

                          <label className="resume-label" style={{ gridColumn: "1 / -1" }}>
                            Project / GitHub URL
                            <input
                              type="text"
                              className="resume-input"
                              placeholder="e.g. https://github.com/user/project"
                              value={proj.link}
                              onChange={(e) => {
                                const updated = resume.projects.map((item) =>
                                  item.id === proj.id ? { ...item, link: e.target.value } : item
                                );
                                updateResume({ ...resume, projects: updated });
                              }}
                            />
                          </label>
                        </div>

                        <div style={{ marginTop: 12 }}>
                          <label className="resume-label">
                            Project Highlights & Outcomes (1 per line)
                          </label>
                          <textarea
                            className="resume-textarea"
                            rows={3}
                            placeholder="Enter project bullet points..."
                            value={proj.bullets.join("\n")}
                            onChange={(e) => {
                              const bullets = e.target.value.split("\n");
                              const updated = resume.projects.map((item) =>
                                item.id === proj.id ? { ...item, bullets } : item
                              );
                              updateResume({ ...resume, projects: updated });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. EDUCATION */}
            {activeFormTab === "education" && (
              <div className="animate-fade-in form-section-wrap">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 className="form-section-title" style={{ margin: 0 }}>Education & Academic Background</h3>
                  <button
                    type="button"
                    className="learning-button"
                    onClick={addEducation}
                    style={{ fontSize: 11, padding: "6px 12px" }}
                  >
                    <Plus size={14} /> Add Education
                  </button>
                </div>

                <div style={{ display: "grid", gap: 14 }}>
                  {resume.education.map((edu, idx) => (
                    <div key={edu.id} className="card resume-item-card">
                      <div className="item-card-header">
                        <strong>#{idx + 1} {edu.institution || "College / University"}</strong>
                        <button
                          type="button"
                          className="resume-delete-btn"
                          onClick={() => removeEducation(edu.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="form-grid-2" style={{ marginTop: 10 }}>
                        <label className="resume-label">
                          Institution / University
                          <input
                            type="text"
                            className="resume-input"
                            placeholder="e.g. National Institute of Technology (NIT)"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = resume.education.map((item) =>
                                item.id === edu.id ? { ...item, institution: e.target.value } : item
                              );
                              updateResume({ ...resume, education: updated });
                            }}
                          />
                        </label>

                        <label className="resume-label">
                          Degree & Major
                          <input
                            type="text"
                            className="resume-input"
                            placeholder="e.g. B.Tech in Computer Science"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = resume.education.map((item) =>
                                item.id === edu.id ? { ...item, degree: e.target.value } : item
                              );
                              updateResume({ ...resume, education: updated });
                            }}
                          />
                        </label>

                        <label className="resume-label">
                          Years (Start – End)
                          <input
                            type="text"
                            className="resume-input"
                            placeholder="e.g. 2020 – 2024"
                            value={`${edu.startDate} – ${edu.endDate}`}
                            onChange={(e) => {
                              const parts = e.target.value.split("–").map((p) => p.trim());
                              const updated = resume.education.map((item) =>
                                item.id === edu.id
                                  ? { ...item, startDate: parts[0] || "", endDate: parts[1] || "" }
                                  : item
                              );
                              updateResume({ ...resume, education: updated });
                            }}
                          />
                        </label>

                        <label className="resume-label">
                          Grade / CGPA
                          <input
                            type="text"
                            className="resume-input"
                            placeholder="e.g. CGPA: 8.85 / 10.0"
                            value={edu.grade}
                            onChange={(e) => {
                              const updated = resume.education.map((item) =>
                                item.id === edu.id ? { ...item, grade: e.target.value } : item
                              );
                              updateResume({ ...resume, education: updated });
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. CERTIFICATIONS */}
            {activeFormTab === "certifications" && (
              <div className="animate-fade-in form-section-wrap">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 className="form-section-title" style={{ margin: 0 }}>Certifications & Honors</h3>
                  <button
                    type="button"
                    className="learning-button"
                    onClick={addCertification}
                    style={{ fontSize: 11, padding: "6px 12px" }}
                  >
                    <Plus size={14} /> Add Certification
                  </button>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  {resume.certifications.map((cert, idx) => (
                    <div key={cert.id} className="card resume-item-card">
                      <div className="item-card-header">
                        <strong>#{idx + 1} {cert.name || "Certification Name"}</strong>
                        <button
                          type="button"
                          className="resume-delete-btn"
                          onClick={() => removeCertification(cert.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="form-grid-2" style={{ marginTop: 10 }}>
                        <label className="resume-label">
                          Certification Title
                          <input
                            type="text"
                            className="resume-input"
                            placeholder="e.g. AWS Certified Developer"
                            value={cert.name}
                            onChange={(e) => {
                              const updated = resume.certifications.map((item) =>
                                item.id === cert.id ? { ...item, name: e.target.value } : item
                              );
                              updateResume({ ...resume, certifications: updated });
                            }}
                          />
                        </label>

                        <label className="resume-label">
                          Issuing Organization
                          <input
                            type="text"
                            className="resume-input"
                            placeholder="e.g. Amazon Web Services"
                            value={cert.issuer}
                            onChange={(e) => {
                              const updated = resume.certifications.map((item) =>
                                item.id === cert.id ? { ...item, issuer: e.target.value } : item
                              );
                              updateResume({ ...resume, certifications: updated });
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Live ATS-Compliant Document Preview */}
        <div className={`resume-preview-pane ${mobileTab === "preview" ? "mobile-show" : ""}`}>
          {/* Preview Customization Bar */}
          <div className="resume-customizer-bar">
            {/* Template Selector */}
            <div className="customizer-group">
              <span className="customizer-label">Template:</span>
              <div className="template-select-pills">
                <button
                  type="button"
                  className={templateId === "modern" ? "active" : ""}
                  onClick={() => handleTemplateChange("modern")}
                >
                  Modern Tech
                </button>
                <button
                  type="button"
                  className={templateId === "classic" ? "active" : ""}
                  onClick={() => handleTemplateChange("classic")}
                >
                  Classic ATS
                </button>
                <button
                  type="button"
                  className={templateId === "compact" ? "active" : ""}
                  onClick={() => handleTemplateChange("compact")}
                >
                  Stanford Compact
                </button>
              </div>
            </div>

            {/* Accent Color Picker */}
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
                  className={`color-swatch slate ${accentColor === "slate" ? "selected" : ""}`}
                  onClick={() => handleColorChange("slate")}
                  title="Slate Black"
                />
              </div>
            </div>

            {/* Zoom controls */}
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

          {/* Scaled Printable Document Container */}
          <div className="resume-paper-scroller">
            <div
              className="resume-paper-wrapper"
              id="printable-resume"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
            >
              <ResumeRenderer data={resume} templateId={templateId} accentColor={accentColor} />
            </div>
          </div>
        </div>
      </div>

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

