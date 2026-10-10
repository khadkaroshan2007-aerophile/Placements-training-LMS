"use client";

import React from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Camera,
  CheckCircle2,
  Code2,
  ExternalLink,
  FolderGit2,
  Globe,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Phone,
  Plus,
  Sparkles,
  Terminal,
  Trash2,
  User,
  X,
} from "lucide-react";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeAccentColor,
  ResumeData,
  ResumeTemplateId,
} from "@/lib/resume-data";

export const ACCENT_COLORS: Record<
  ResumeAccentColor,
  {
    primary: string;
    secondary: string;
    dark: string;
    light: string;
    border: string;
    text: string;
    gradient: string;
  }
> = {
  purple: {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    dark: "#1e1b4b",
    light: "#f5f3ff",
    border: "#ddd6fe",
    text: "#4338ca",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  },
  blue: {
    primary: "#0284c7",
    secondary: "#2563eb",
    dark: "#0c2340",
    light: "#f0f9ff",
    border: "#bae6fd",
    text: "#0369a1",
    gradient: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
  },
  emerald: {
    primary: "#059669",
    secondary: "#10b981",
    dark: "#064e3b",
    light: "#ecfdf5",
    border: "#a7f3d0",
    text: "#047857",
    gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
  },
  rose: {
    primary: "#e11d48",
    secondary: "#f43f5e",
    dark: "#4c0519",
    light: "#fff1f2",
    border: "#fecdd3",
    text: "#be123c",
    gradient: "linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)",
  },
  amber: {
    primary: "#d97706",
    secondary: "#f59e0b",
    dark: "#451a03",
    light: "#fffbeb",
    border: "#fde68a",
    text: "#b45309",
    gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
  },
  slate: {
    primary: "#334155",
    secondary: "#475569",
    dark: "#0f172a",
    light: "#f8fafc",
    border: "#cbd5e1",
    text: "#1e293b",
    gradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  },
};

interface ResumeRendererProps {
  data: ResumeData;
  templateId: ResumeTemplateId;
  accentColor: ResumeAccentColor;
  isEditable?: boolean;
  onUpdate?: (updated: ResumeData) => void;
  onPhotoUploadClick?: () => void;
}

export function ResumeRenderer({
  data,
  templateId,
  accentColor,
  isEditable = false,
  onUpdate,
  onPhotoUploadClick,
}: ResumeRendererProps) {
  const colors = ACCENT_COLORS[accentColor] || ACCENT_COLORS.purple;

  const updatePersonal = (field: keyof ResumeData["personal"], value: any) => {
    if (!onUpdate) return;
    onUpdate({
      ...data,
      personal: { ...data.personal, [field]: value },
    });
  };

  const updateSkills = (field: keyof ResumeData["skills"], value: string) => {
    if (!onUpdate) return;
    onUpdate({
      ...data,
      skills: { ...data.skills, [field]: value },
    });
  };

  const updateExperience = (index: number, updatedExp: ExperienceItem) => {
    if (!onUpdate) return;
    const next = [...data.experience];
    next[index] = updatedExp;
    onUpdate({ ...data, experience: next });
  };

  const deleteExperience = (index: number) => {
    if (!onUpdate) return;
    onUpdate({
      ...data,
      experience: data.experience.filter((_, i) => i !== index),
    });
  };

  const addExperience = () => {
    if (!onUpdate) return;
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "Company Name",
      role: "Position / Job Title",
      location: "City, Country",
      startDate: "2023",
      endDate: "Present",
      current: true,
      bullets: ["Spearheaded scalable feature development, optimizing latency by 35%."],
    };
    onUpdate({ ...data, experience: [newExp, ...data.experience] });
  };

  const updateProject = (index: number, updatedProj: ProjectItem) => {
    if (!onUpdate) return;
    const next = [...data.projects];
    next[index] = updatedProj;
    onUpdate({ ...data, projects: next });
  };

  const deleteProject = (index: number) => {
    if (!onUpdate) return;
    onUpdate({
      ...data,
      projects: data.projects.filter((_, i) => i !== index),
    });
  };

  const addProject = () => {
    if (!onUpdate) return;
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: "Project Title",
      techStack: "React, Node.js, TypeScript",
      link: "https://yourproject.com",
      bullets: ["Architected full-stack application featuring real-time data sync."],
    };
    onUpdate({ ...data, projects: [newProj, ...data.projects] });
  };

  const updateEducation = (index: number, updatedEdu: EducationItem) => {
    if (!onUpdate) return;
    const next = [...data.education];
    next[index] = updatedEdu;
    onUpdate({ ...data, education: next });
  };

  const deleteEducation = (index: number) => {
    if (!onUpdate) return;
    onUpdate({
      ...data,
      education: data.education.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    if (!onUpdate) return;
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "University / Institution",
      degree: "Bachelor of Technology",
      field: "Computer Science",
      location: "City, Country",
      startDate: "2020",
      endDate: "2024",
      grade: "CGPA: 8.8 / 10",
    };
    onUpdate({ ...data, education: [...data.education, newEdu] });
  };

  const updateCertification = (index: number, updatedCert: CertificationItem) => {
    if (!onUpdate) return;
    const next = [...data.certifications];
    next[index] = updatedCert;
    onUpdate({ ...data, certifications: next });
  };

  const deleteCertification = (index: number) => {
    if (!onUpdate) return;
    onUpdate({
      ...data,
      certifications: data.certifications.filter((_, i) => i !== index),
    });
  };

  const addCertification = () => {
    if (!onUpdate) return;
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: "Certification Name",
      issuer: "Issuing Organization",
      date: "2024",
    };
    onUpdate({ ...data, certifications: [...data.certifications, newCert] });
  };

  const sharedProps = {
    data,
    colors,
    isEditable,
    updatePersonal,
    updateSkills,
    updateExperience,
    deleteExperience,
    addExperience,
    updateProject,
    deleteProject,
    addProject,
    updateEducation,
    deleteEducation,
    addEducation,
    updateCertification,
    deleteCertification,
    addCertification,
    onPhotoUploadClick,
  };

  if (templateId === "creative-duo") {
    return <CreativeDuoTemplate {...sharedProps} />;
  }

  if (templateId === "creative-banner") {
    return <CreativeBannerTemplate {...sharedProps} />;
  }

  if (templateId === "classic") {
    return <ClassicATSTemplate {...sharedProps} />;
  }

  if (templateId === "compact") {
    return <CompactStanfordTemplate {...sharedProps} />;
  }

  return <ModernTechTemplate {...sharedProps} />;
}

/* =========================================================================
   INLINE EDITABLE COMPONENT
   ========================================================================= */
interface InlineFieldProps {
  value: string;
  onChange: (val: string) => void;
  isEditable?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  tag?: "h1" | "h2" | "h3" | "span" | "p" | "div" | "strong" | "em";
}

function InlineField({
  value,
  onChange,
  isEditable = false,
  placeholder = "Click to edit...",
  className = "",
  style = {},
  tag = "span",
}: InlineFieldProps) {
  const Tag = tag as any;

  if (!isEditable) {
    return (
      <Tag className={className} style={style}>
        {value || (placeholder ? <span style={{ opacity: 0.35 }}>{placeholder}</span> : null)}
      </Tag>
    );
  }

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      className={`resume-inline-editable ${className}`}
      style={style}
      data-placeholder={placeholder}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.textContent || "";
        if (text !== value) {
          onChange(text);
        }
      }}
      dangerouslySetInnerHTML={{ __html: escapeHtml(value) }}
    />
  );
}

function escapeHtml(text: string) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================================================
   TEMPLATE 1: CREATIVE DUO-TONE (Dual-Tone Sidebar with Timeline & Cards)
   ========================================================================= */
function CreativeDuoTemplate({
  data,
  colors,
  isEditable,
  updatePersonal,
  updateSkills,
  updateExperience,
  deleteExperience,
  addExperience,
  updateProject,
  deleteProject,
  addProject,
  updateEducation,
  deleteEducation,
  addEducation,
  updateCertification,
  deleteCertification,
  addCertification,
  onPhotoUploadClick,
}: any) {
  const showPhoto = data.personal.showPhoto && data.personal.photoUrl;

  return (
    <div
      className="a4-sheet-container template-creative-duo"
      style={
        {
          "--primary": colors.primary,
          "--secondary": colors.secondary,
          "--dark": colors.dark,
          "--light": colors.light,
          "--border": colors.border,
          "--gradient": colors.gradient,
        } as any
      }
    >
      {/* LEFT SIDEBAR: DARK GRADIENT */}
      <aside className="duo-sidebar" style={{ background: colors.gradient }}>
        {/* Photo Container */}
        <div className="duo-photo-box">
          {showPhoto ? (
            <div
              className="duo-photo-wrap"
              onClick={isEditable ? onPhotoUploadClick : undefined}
              title={isEditable ? "Click to change photo" : undefined}
            >
              <img src={data.personal.photoUrl} alt={data.personal.fullName} className="duo-photo-img" />
              {isEditable && (
                <div className="photo-edit-overlay">
                  <Camera size={16} />
                </div>
              )}
            </div>
          ) : isEditable ? (
            <button
              type="button"
              onClick={onPhotoUploadClick}
              className="duo-photo-placeholder"
              title="Click to add photo"
            >
              <Camera size={20} />
              <span>+ Photo</span>
            </button>
          ) : (
            <div className="duo-monogram">
              {(data.personal.fullName || "AR")
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="duo-sidebar-section">
          <div className="duo-sidebar-title">
            <User size={13} /> CONTACT
          </div>
          <div className="duo-contact-list">
            {(data.personal.email || isEditable) && (
              <div className="duo-contact-item">
                <span className="duo-contact-icon">
                  <Mail size={12} />
                </span>
                <InlineField
                  value={data.personal.email}
                  onChange={(v) => updatePersonal("email", v)}
                  isEditable={isEditable}
                  placeholder="alex@example.com"
                  tag="span"
                />
              </div>
            )}
            {(data.personal.phone || isEditable) && (
              <div className="duo-contact-item">
                <span className="duo-contact-icon">
                  <Phone size={12} />
                </span>
                <InlineField
                  value={data.personal.phone}
                  onChange={(v) => updatePersonal("phone", v)}
                  isEditable={isEditable}
                  placeholder="+91 98765 43210"
                  tag="span"
                />
              </div>
            )}
            {(data.personal.location || isEditable) && (
              <div className="duo-contact-item">
                <span className="duo-contact-icon">
                  <MapPin size={12} />
                </span>
                <InlineField
                  value={data.personal.location}
                  onChange={(v) => updatePersonal("location", v)}
                  isEditable={isEditable}
                  placeholder="Bangalore, India"
                  tag="span"
                />
              </div>
            )}
            {(data.personal.linkedin || isEditable) && (
              <div className="duo-contact-item">
                <span className="duo-contact-icon">
                  <Globe size={12} />
                </span>
                <InlineField
                  value={data.personal.linkedin}
                  onChange={(v) => updatePersonal("linkedin", v)}
                  isEditable={isEditable}
                  placeholder="linkedin.com/in/username"
                  tag="span"
                />
              </div>
            )}
            {(data.personal.github || isEditable) && (
              <div className="duo-contact-item">
                <span className="duo-contact-icon">
                  <FolderGit2 size={12} />
                </span>
                <InlineField
                  value={data.personal.github}
                  onChange={(v) => updatePersonal("github", v)}
                  isEditable={isEditable}
                  placeholder="github.com/username"
                  tag="span"
                />
              </div>
            )}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="duo-sidebar-section">
          <div className="duo-sidebar-title">
            <Code2 size={13} /> TECHNICAL SKILLS
          </div>
          <div className="duo-skills-list">
            <div className="duo-skill-block">
              <strong className="duo-skill-label">Languages</strong>
              <div className="duo-skill-text">
                <InlineField
                  value={data.skills.languages}
                  onChange={(v) => updateSkills("languages", v)}
                  isEditable={isEditable}
                  placeholder="Java, Python, TypeScript..."
                  tag="span"
                />
              </div>
            </div>
            <div className="duo-skill-block">
              <strong className="duo-skill-label">Frameworks</strong>
              <div className="duo-skill-text">
                <InlineField
                  value={data.skills.frameworks}
                  onChange={(v) => updateSkills("frameworks", v)}
                  isEditable={isEditable}
                  placeholder="React, Next.js, Node.js..."
                  tag="span"
                />
              </div>
            </div>
            <div className="duo-skill-block">
              <strong className="duo-skill-label">Tools & Databases</strong>
              <div className="duo-skill-text">
                <InlineField
                  value={data.skills.toolsAndDatabases}
                  onChange={(v) => updateSkills("toolsAndDatabases", v)}
                  isEditable={isEditable}
                  placeholder="PostgreSQL, Docker, AWS..."
                  tag="span"
                />
              </div>
            </div>
            <div className="duo-skill-block">
              <strong className="duo-skill-label">Core Concepts</strong>
              <div className="duo-skill-text">
                <InlineField
                  value={data.skills.coreConcepts}
                  onChange={(v) => updateSkills("coreConcepts", v)}
                  isEditable={isEditable}
                  placeholder="DSA, System Design, REST APIs..."
                  tag="span"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="duo-sidebar-section">
          <div className="section-title-row">
            <div className="duo-sidebar-title">
              <GraduationCap size={13} /> EDUCATION
            </div>
            {isEditable && (
              <button type="button" onClick={addEducation} className="duo-sidebar-add-btn">
                <Plus size={10} />
              </button>
            )}
          </div>
          <div className="duo-edu-list">
            {data.education.map((edu: EducationItem, idx: number) => (
              <div key={edu.id || idx} className="duo-edu-card relative-item-group">
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => deleteEducation(idx)}
                    className="resume-delete-entry-btn"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
                <div className="duo-edu-degree">
                  <InlineField
                    value={edu.degree}
                    onChange={(v) => updateEducation(idx, { ...edu, degree: v })}
                    isEditable={isEditable}
                    placeholder="Degree"
                    tag="strong"
                  />
                  {" in "}
                  <InlineField
                    value={edu.field}
                    onChange={(v) => updateEducation(idx, { ...edu, field: v })}
                    isEditable={isEditable}
                    placeholder="Field"
                    tag="span"
                  />
                </div>
                <div className="duo-edu-school">
                  <InlineField
                    value={edu.institution}
                    onChange={(v) => updateEducation(idx, { ...edu, institution: v })}
                    isEditable={isEditable}
                    placeholder="Institution"
                    tag="span"
                  />
                </div>
                <div className="duo-edu-meta">
                  <span>
                    <InlineField
                      value={edu.startDate}
                      onChange={(v) => updateEducation(idx, { ...edu, startDate: v })}
                      isEditable={isEditable}
                      placeholder="Start"
                      tag="span"
                    />
                    {" – "}
                    <InlineField
                      value={edu.endDate}
                      onChange={(v) => updateEducation(idx, { ...edu, endDate: v })}
                      isEditable={isEditable}
                      placeholder="End"
                      tag="span"
                    />
                  </span>
                  {edu.grade && (
                    <span className="duo-grade-badge">
                      <InlineField
                        value={edu.grade}
                        onChange={(v) => updateEducation(idx, { ...edu, grade: v })}
                        isEditable={isEditable}
                        placeholder="Grade"
                        tag="span"
                      />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="duo-sidebar-section">
            <div className="section-title-row">
              <div className="duo-sidebar-title">
                <Award size={13} /> CERTIFICATIONS
              </div>
              {isEditable && (
                <button type="button" onClick={addCertification} className="duo-sidebar-add-btn">
                  <Plus size={10} />
                </button>
              )}
            </div>
            <div className="duo-cert-list">
              {data.certifications.map((cert: CertificationItem, idx: number) => (
                <div key={cert.id || idx} className="duo-cert-item relative-item-group">
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => deleteCertification(idx)}
                      className="resume-delete-entry-btn"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                  <strong className="duo-cert-name">
                    <InlineField
                      value={cert.name}
                      onChange={(v) => updateCertification(idx, { ...cert, name: v })}
                      isEditable={isEditable}
                      placeholder="Certificate Name"
                      tag="span"
                    />
                  </strong>
                  <span className="duo-cert-issuer">
                    <InlineField
                      value={cert.issuer}
                      onChange={(v) => updateCertification(idx, { ...cert, issuer: v })}
                      isEditable={isEditable}
                      placeholder="Issuer"
                      tag="span"
                    />{" "}
                    ·{" "}
                    <InlineField
                      value={cert.date}
                      onChange={(v) => updateCertification(idx, { ...cert, date: v })}
                      isEditable={isEditable}
                      placeholder="Year"
                      tag="span"
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="duo-main">
        {/* Header Title Section */}
        <header className="duo-main-header">
          <div className="duo-name-banner">
            <h1 className="duo-name">
              <InlineField
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                isEditable={isEditable}
                placeholder="YOUR FULL NAME"
                tag="span"
              />
            </h1>
            <div className="duo-job-pill" style={{ background: colors.light, color: colors.text }}>
              <InlineField
                value={data.personal.jobTitle}
                onChange={(v) => updatePersonal("jobTitle", v)}
                isEditable={isEditable}
                placeholder="Target Job Title"
                tag="span"
              />
            </div>
          </div>
        </header>

        {/* Professional Summary */}
        {(data.personal.summary || isEditable) && (
          <section className="duo-section">
            <div className="duo-section-header">
              <span className="duo-section-dot" style={{ background: colors.primary }} />
              <h2 className="duo-section-title" style={{ color: colors.text }}>
                PROFILE SUMMARY
              </h2>
            </div>
            <div className="duo-summary-box">
              <InlineField
                value={data.personal.summary}
                onChange={(v) => updatePersonal("summary", v)}
                isEditable={isEditable}
                placeholder="Write your professional summary here..."
                tag="p"
              />
            </div>
          </section>
        )}

        {/* Work Experience with Timeline */}
        <section className="duo-section">
          <div className="section-title-row">
            <div className="duo-section-header">
              <span className="duo-section-dot" style={{ background: colors.primary }} />
              <h2 className="duo-section-title" style={{ color: colors.text }}>
                WORK EXPERIENCE
              </h2>
            </div>
            {isEditable && (
              <button type="button" onClick={addExperience} className="resume-add-entry-btn">
                <Plus size={11} /> Add Experience
              </button>
            )}
          </div>

          <div className="duo-timeline">
            {data.experience.map((exp: ExperienceItem, idx: number) => (
              <div key={exp.id || idx} className="duo-timeline-item relative-item-group">
                <div className="duo-timeline-node" style={{ borderColor: colors.primary }} />
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => deleteExperience(idx)}
                    className="resume-delete-entry-btn"
                    title="Remove experience"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div className="duo-item-header">
                  <div>
                    <h3 className="duo-item-role" style={{ color: colors.dark }}>
                      <InlineField
                        value={exp.role}
                        onChange={(v) => updateExperience(idx, { ...exp, role: v })}
                        isEditable={isEditable}
                        placeholder="Position Role"
                        tag="span"
                      />
                    </h3>
                    <div className="duo-item-company">
                      <InlineField
                        value={exp.company}
                        onChange={(v) => updateExperience(idx, { ...exp, company: v })}
                        isEditable={isEditable}
                        placeholder="Company"
                        tag="strong"
                      />
                      {" · "}
                      <InlineField
                        value={exp.location}
                        onChange={(v) => updateExperience(idx, { ...exp, location: v })}
                        isEditable={isEditable}
                        placeholder="Location"
                        tag="span"
                      />
                    </div>
                  </div>
                  <span className="duo-date-chip" style={{ background: colors.light, color: colors.text }}>
                    <InlineField
                      value={exp.startDate}
                      onChange={(v) => updateExperience(idx, { ...exp, startDate: v })}
                      isEditable={isEditable}
                      placeholder="Start"
                      tag="span"
                    />
                    {" – "}
                    <InlineField
                      value={exp.endDate}
                      onChange={(v) => updateExperience(idx, { ...exp, endDate: v })}
                      isEditable={isEditable}
                      placeholder="End"
                      tag="span"
                    />
                  </span>
                </div>

                <ul className="duo-bullets">
                  {exp.bullets.map((bullet: string, bIdx: number) => (
                    <li key={bIdx} className="bullet-row-editable">
                      <InlineField
                        value={bullet}
                        onChange={(v) => {
                          const newBullets = [...exp.bullets];
                          newBullets[bIdx] = v;
                          updateExperience(idx, { ...exp, bullets: newBullets });
                        }}
                        isEditable={isEditable}
                        placeholder="Accomplishment bullet..."
                        tag="span"
                      />
                      {isEditable && exp.bullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newBullets = exp.bullets.filter((_, i) => i !== bIdx);
                            updateExperience(idx, { ...exp, bullets: newBullets });
                          }}
                          className="bullet-remove-inline"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => {
                      updateExperience(idx, {
                        ...exp,
                        bullets: [...exp.bullets, "Spearheaded key milestone delivering tangible results."],
                      });
                    }}
                    className="resume-add-bullet-btn"
                  >
                    <Plus size={10} /> Add bullet
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <section className="duo-section">
          <div className="section-title-row">
            <div className="duo-section-header">
              <span className="duo-section-dot" style={{ background: colors.primary }} />
              <h2 className="duo-section-title" style={{ color: colors.text }}>
                KEY PROJECTS
              </h2>
            </div>
            {isEditable && (
              <button type="button" onClick={addProject} className="resume-add-entry-btn">
                <Plus size={11} /> Add Project
              </button>
            )}
          </div>

          <div className="duo-projects-grid">
            {data.projects.map((proj: ProjectItem, idx: number) => (
              <div key={proj.id || idx} className="duo-project-card relative-item-group">
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => deleteProject(idx)}
                    className="resume-delete-entry-btn"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div className="duo-project-header">
                  <h3 className="duo-project-title" style={{ color: colors.dark }}>
                    <InlineField
                      value={proj.title}
                      onChange={(v) => updateProject(idx, { ...proj, title: v })}
                      isEditable={isEditable}
                      placeholder="Project Name"
                      tag="span"
                    />
                  </h3>
                  {(proj.link || isEditable) && (
                    <span className="duo-project-link">
                      <InlineField
                        value={proj.link}
                        onChange={(v) => updateProject(idx, { ...proj, link: v })}
                        isEditable={isEditable}
                        placeholder="https://link.com"
                        tag="span"
                      />
                    </span>
                  )}
                </div>

                <div className="duo-project-stack" style={{ color: colors.text }}>
                  <em>
                    Stack:{" "}
                    <InlineField
                      value={proj.techStack}
                      onChange={(v) => updateProject(idx, { ...proj, techStack: v })}
                      isEditable={isEditable}
                      placeholder="React, Next.js, Node.js..."
                      tag="span"
                    />
                  </em>
                </div>

                <ul className="duo-bullets">
                  {proj.bullets.map((b: string, bIdx: number) => (
                    <li key={bIdx} className="bullet-row-editable">
                      <InlineField
                        value={b}
                        onChange={(v) => {
                          const newBullets = [...proj.bullets];
                          newBullets[bIdx] = v;
                          updateProject(idx, { ...proj, bullets: newBullets });
                        }}
                        isEditable={isEditable}
                        placeholder="Impact detail..."
                        tag="span"
                      />
                      {isEditable && proj.bullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newBullets = proj.bullets.filter((_, i) => i !== bIdx);
                            updateProject(idx, { ...proj, bullets: newBullets });
                          }}
                          className="bullet-remove-inline"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => {
                      updateProject(idx, {
                        ...proj,
                        bullets: [...proj.bullets, "Engineered performant user interface with sub-second response."],
                      });
                    }}
                    className="resume-add-bullet-btn"
                  >
                    <Plus size={10} /> Add bullet
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* =========================================================================
   TEMPLATE 2: CREATIVE MODERN BANNER (Gradient Top Header & 2-Column Grid)
   ========================================================================= */
function CreativeBannerTemplate({
  data,
  colors,
  isEditable,
  updatePersonal,
  updateSkills,
  updateExperience,
  deleteExperience,
  addExperience,
  updateProject,
  deleteProject,
  addProject,
  updateEducation,
  deleteEducation,
  addEducation,
  updateCertification,
  deleteCertification,
  addCertification,
  onPhotoUploadClick,
}: any) {
  const showPhoto = data.personal.showPhoto && data.personal.photoUrl;

  return (
    <div
      className="a4-sheet-container template-creative-banner"
      style={
        {
          "--primary": colors.primary,
          "--secondary": colors.secondary,
          "--dark": colors.dark,
          "--light": colors.light,
          "--border": colors.border,
          "--gradient": colors.gradient,
        } as any
      }
    >
      {/* CREATIVE TOP GRADIENT BANNER */}
      <header className="banner-top-header" style={{ background: colors.gradient }}>
        <div className="banner-top-row">
          {/* Photo Slot */}
          <div className="banner-photo-box">
            {showPhoto ? (
              <div
                className="banner-photo-wrap"
                onClick={isEditable ? onPhotoUploadClick : undefined}
                title={isEditable ? "Click to change photo" : undefined}
              >
                <img src={data.personal.photoUrl} alt={data.personal.fullName} className="banner-photo-img" />
                {isEditable && (
                  <div className="photo-edit-overlay">
                    <Camera size={14} />
                  </div>
                )}
              </div>
            ) : isEditable ? (
              <button
                type="button"
                onClick={onPhotoUploadClick}
                className="banner-photo-placeholder"
              >
                <Camera size={18} />
                <span>+ Photo</span>
              </button>
            ) : null}
          </div>

          <div className="banner-header-text">
            <h1 className="banner-name">
              <InlineField
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                isEditable={isEditable}
                placeholder="YOUR FULL NAME"
                tag="span"
              />
            </h1>
            <div className="banner-title-pill">
              <InlineField
                value={data.personal.jobTitle}
                onChange={(v) => updatePersonal("jobTitle", v)}
                isEditable={isEditable}
                placeholder="Target Job Title"
                tag="span"
              />
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="banner-contact-strip">
          {(data.personal.email || isEditable) && (
            <span className="banner-contact-pill">
              <Mail size={11} />
              <InlineField
                value={data.personal.email}
                onChange={(v) => updatePersonal("email", v)}
                isEditable={isEditable}
                placeholder="email@example.com"
                tag="span"
              />
            </span>
          )}
          {(data.personal.phone || isEditable) && (
            <span className="banner-contact-pill">
              <Phone size={11} />
              <InlineField
                value={data.personal.phone}
                onChange={(v) => updatePersonal("phone", v)}
                isEditable={isEditable}
                placeholder="+91 98765 43210"
                tag="span"
              />
            </span>
          )}
          {(data.personal.location || isEditable) && (
            <span className="banner-contact-pill">
              <MapPin size={11} />
              <InlineField
                value={data.personal.location}
                onChange={(v) => updatePersonal("location", v)}
                isEditable={isEditable}
                placeholder="Location"
                tag="span"
              />
            </span>
          )}
          {(data.personal.linkedin || isEditable) && (
            <span className="banner-contact-pill">
              <Globe size={11} />
              <InlineField
                value={data.personal.linkedin}
                onChange={(v) => updatePersonal("linkedin", v)}
                isEditable={isEditable}
                placeholder="LinkedIn"
                tag="span"
              />
            </span>
          )}
          {(data.personal.github || isEditable) && (
            <span className="banner-contact-pill">
              <FolderGit2 size={11} />
              <InlineField
                value={data.personal.github}
                onChange={(v) => updatePersonal("github", v)}
                isEditable={isEditable}
                placeholder="GitHub"
                tag="span"
              />
            </span>
          )}
        </div>
      </header>

      {/* BODY 2-COLUMN SPLIT */}
      <div className="banner-body-grid">
        {/* LEFT COLUMN: Summary, Experience & Projects */}
        <div className="banner-main-col">
          {/* Summary */}
          {(data.personal.summary || isEditable) && (
            <section className="banner-section">
              <div className="banner-section-heading" style={{ color: colors.text }}>
                <Sparkles size={14} color={colors.primary} /> ABOUT ME
              </div>
              <div className="banner-card-box">
                <InlineField
                  value={data.personal.summary}
                  onChange={(v) => updatePersonal("summary", v)}
                  isEditable={isEditable}
                  placeholder="Professional summary statement..."
                  tag="p"
                />
              </div>
            </section>
          )}

          {/* Experience */}
          <section className="banner-section">
            <div className="section-title-row">
              <div className="banner-section-heading" style={{ color: colors.text }}>
                <Briefcase size={14} color={colors.primary} /> EXPERIENCE
              </div>
              {isEditable && (
                <button type="button" onClick={addExperience} className="resume-add-entry-btn">
                  <Plus size={11} /> Add
                </button>
              )}
            </div>

            <div className="banner-item-stack">
              {data.experience.map((exp: ExperienceItem, idx: number) => (
                <div key={exp.id || idx} className="banner-card-box relative-item-group">
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => deleteExperience(idx)}
                      className="resume-delete-entry-btn"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div className="banner-item-header">
                    <strong className="banner-role" style={{ color: colors.dark }}>
                      <InlineField
                        value={exp.role}
                        onChange={(v) => updateExperience(idx, { ...exp, role: v })}
                        isEditable={isEditable}
                        placeholder="Role / Title"
                        tag="span"
                      />
                    </strong>
                    <span className="banner-tag-date" style={{ background: colors.light, color: colors.text }}>
                      <InlineField
                        value={exp.startDate}
                        onChange={(v) => updateExperience(idx, { ...exp, startDate: v })}
                        isEditable={isEditable}
                        placeholder="Start"
                        tag="span"
                      />
                      {" – "}
                      <InlineField
                        value={exp.endDate}
                        onChange={(v) => updateExperience(idx, { ...exp, endDate: v })}
                        isEditable={isEditable}
                        placeholder="End"
                        tag="span"
                      />
                    </span>
                  </div>
                  <div className="banner-company-row">
                    <InlineField
                      value={exp.company}
                      onChange={(v) => updateExperience(idx, { ...exp, company: v })}
                      isEditable={isEditable}
                      placeholder="Company"
                      tag="span"
                    />
                    {" | "}
                    <InlineField
                      value={exp.location}
                      onChange={(v) => updateExperience(idx, { ...exp, location: v })}
                      isEditable={isEditable}
                      placeholder="Location"
                      tag="span"
                    />
                  </div>
                  <ul className="banner-bullets">
                    {exp.bullets.map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="bullet-row-editable">
                        <InlineField
                          value={bullet}
                          onChange={(v) => {
                            const newBullets = [...exp.bullets];
                            newBullets[bIdx] = v;
                            updateExperience(idx, { ...exp, bullets: newBullets });
                          }}
                          isEditable={isEditable}
                          placeholder="Accomplishment bullet..."
                          tag="span"
                        />
                        {isEditable && exp.bullets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newBullets = exp.bullets.filter((_, i) => i !== bIdx);
                              updateExperience(idx, { ...exp, bullets: newBullets });
                            }}
                            className="bullet-remove-inline"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => {
                        updateExperience(idx, {
                          ...exp,
                          bullets: [...exp.bullets, "Collaborated with agile engineering squad on deliverable."],
                        });
                      }}
                      className="resume-add-bullet-btn"
                    >
                      <Plus size={10} /> Add bullet
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="banner-section">
            <div className="section-title-row">
              <div className="banner-section-heading" style={{ color: colors.text }}>
                <Terminal size={14} color={colors.primary} /> KEY PROJECTS
              </div>
              {isEditable && (
                <button type="button" onClick={addProject} className="resume-add-entry-btn">
                  <Plus size={11} /> Add
                </button>
              )}
            </div>

            <div className="banner-item-stack">
              {data.projects.map((proj: ProjectItem, idx: number) => (
                <div key={proj.id || idx} className="banner-card-box relative-item-group">
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => deleteProject(idx)}
                      className="resume-delete-entry-btn"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div className="banner-item-header">
                    <strong className="banner-role" style={{ color: colors.dark }}>
                      <InlineField
                        value={proj.title}
                        onChange={(v) => updateProject(idx, { ...proj, title: v })}
                        isEditable={isEditable}
                        placeholder="Project Name"
                        tag="span"
                      />
                    </strong>
                    {proj.link && (
                      <span className="banner-proj-link">
                        <InlineField
                          value={proj.link}
                          onChange={(v) => updateProject(idx, { ...proj, link: v })}
                          isEditable={isEditable}
                          placeholder="Link"
                          tag="span"
                        />
                      </span>
                    )}
                  </div>
                  <div className="banner-tech-stack" style={{ color: colors.text }}>
                    <em>
                      Tech:{" "}
                      <InlineField
                        value={proj.techStack}
                        onChange={(v) => updateProject(idx, { ...proj, techStack: v })}
                        isEditable={isEditable}
                        placeholder="Tech stack"
                        tag="span"
                      />
                    </em>
                  </div>
                  <ul className="banner-bullets">
                    {proj.bullets.map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="bullet-row-editable">
                        <InlineField
                          value={bullet}
                          onChange={(v) => {
                            const newBullets = [...proj.bullets];
                            newBullets[bIdx] = v;
                            updateProject(idx, { ...proj, bullets: newBullets });
                          }}
                          isEditable={isEditable}
                          placeholder="Project details..."
                          tag="span"
                        />
                        {isEditable && proj.bullets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newBullets = proj.bullets.filter((_, i) => i !== bIdx);
                              updateProject(idx, { ...proj, bullets: newBullets });
                            }}
                            className="bullet-remove-inline"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => {
                        updateProject(idx, {
                          ...proj,
                          bullets: [...proj.bullets, "Architected high-throughput data processing pipeline."],
                        });
                      }}
                      className="resume-add-bullet-btn"
                    >
                      <Plus size={10} /> Add bullet
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Skills, Education, Certs */}
        <div className="banner-side-col">
          {/* Skills */}
          <section className="banner-section">
            <div className="banner-section-heading" style={{ color: colors.text }}>
              <Code2 size={14} color={colors.primary} /> SKILLS & STACK
            </div>
            <div className="banner-side-card">
              <div className="banner-skill-group">
                <strong className="banner-skill-cat" style={{ color: colors.primary }}>
                  Languages
                </strong>
                <div className="banner-skill-val">
                  <InlineField
                    value={data.skills.languages}
                    onChange={(v) => updateSkills("languages", v)}
                    isEditable={isEditable}
                    placeholder="Java, Python, C++..."
                    tag="span"
                  />
                </div>
              </div>
              <div className="banner-skill-group">
                <strong className="banner-skill-cat" style={{ color: colors.primary }}>
                  Frameworks
                </strong>
                <div className="banner-skill-val">
                  <InlineField
                    value={data.skills.frameworks}
                    onChange={(v) => updateSkills("frameworks", v)}
                    isEditable={isEditable}
                    placeholder="React, Next.js, Node.js..."
                    tag="span"
                  />
                </div>
              </div>
              <div className="banner-skill-group">
                <strong className="banner-skill-cat" style={{ color: colors.primary }}>
                  Tools & DBs
                </strong>
                <div className="banner-skill-val">
                  <InlineField
                    value={data.skills.toolsAndDatabases}
                    onChange={(v) => updateSkills("toolsAndDatabases", v)}
                    isEditable={isEditable}
                    placeholder="PostgreSQL, Docker, AWS..."
                    tag="span"
                  />
                </div>
              </div>
              <div className="banner-skill-group">
                <strong className="banner-skill-cat" style={{ color: colors.primary }}>
                  Competencies
                </strong>
                <div className="banner-skill-val">
                  <InlineField
                    value={data.skills.coreConcepts}
                    onChange={(v) => updateSkills("coreConcepts", v)}
                    isEditable={isEditable}
                    placeholder="DSA, System Design..."
                    tag="span"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="banner-section">
            <div className="section-title-row">
              <div className="banner-section-heading" style={{ color: colors.text }}>
                <GraduationCap size={14} color={colors.primary} /> EDUCATION
              </div>
              {isEditable && (
                <button type="button" onClick={addEducation} className="resume-add-entry-btn">
                  <Plus size={11} /> Add
                </button>
              )}
            </div>

            <div className="banner-side-card">
              {data.education.map((edu: EducationItem, idx: number) => (
                <div key={edu.id || idx} className="banner-edu-box relative-item-group">
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => deleteEducation(idx)}
                      className="resume-delete-entry-btn"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                  <strong className="banner-edu-deg" style={{ color: colors.dark }}>
                    <InlineField
                      value={edu.degree}
                      onChange={(v) => updateEducation(idx, { ...edu, degree: v })}
                      isEditable={isEditable}
                      placeholder="Degree"
                      tag="span"
                    />
                    {" in "}
                    <InlineField
                      value={edu.field}
                      onChange={(v) => updateEducation(idx, { ...edu, field: v })}
                      isEditable={isEditable}
                      placeholder="Field"
                      tag="span"
                    />
                  </strong>
                  <div className="banner-edu-sch">
                    <InlineField
                      value={edu.institution}
                      onChange={(v) => updateEducation(idx, { ...edu, institution: v })}
                      isEditable={isEditable}
                      placeholder="Institution"
                      tag="span"
                    />
                  </div>
                  <div className="banner-edu-foot">
                    <span>
                      <InlineField
                        value={edu.startDate}
                        onChange={(v) => updateEducation(idx, { ...edu, startDate: v })}
                        isEditable={isEditable}
                        placeholder="2020"
                        tag="span"
                      />
                      {" – "}
                      <InlineField
                        value={edu.endDate}
                        onChange={(v) => updateEducation(idx, { ...edu, endDate: v })}
                        isEditable={isEditable}
                        placeholder="2024"
                        tag="span"
                      />
                    </span>
                    {edu.grade && (
                      <span className="banner-grade-pill">
                        <InlineField
                          value={edu.grade}
                          onChange={(v) => updateEducation(idx, { ...edu, grade: v })}
                          isEditable={isEditable}
                          placeholder="Grade"
                          tag="span"
                        />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section className="banner-section">
              <div className="section-title-row">
                <div className="banner-section-heading" style={{ color: colors.text }}>
                  <Award size={14} color={colors.primary} /> AWARDS & CERTS
                </div>
                {isEditable && (
                  <button type="button" onClick={addCertification} className="resume-add-entry-btn">
                    <Plus size={11} /> Add
                  </button>
                )}
              </div>

              <div className="banner-side-card">
                {data.certifications.map((cert: CertificationItem, idx: number) => (
                  <div key={cert.id || idx} className="banner-cert-box relative-item-group">
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => deleteCertification(idx)}
                        className="resume-delete-entry-btn"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                    <strong className="banner-cert-title" style={{ color: colors.dark }}>
                      <InlineField
                        value={cert.name}
                        onChange={(v) => updateCertification(idx, { ...cert, name: v })}
                        isEditable={isEditable}
                        placeholder="Certificate"
                        tag="span"
                      />
                    </strong>
                    <div className="banner-cert-org">
                      <InlineField
                        value={cert.issuer}
                        onChange={(v) => updateCertification(idx, { ...cert, issuer: v })}
                        isEditable={isEditable}
                        placeholder="Issuer"
                        tag="span"
                      />{" "}
                      ({cert.date})
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TEMPLATE 3: MODERN TECH EXECUTIVE
   ========================================================================= */
function ModernTechTemplate({
  data,
  colors,
  isEditable,
  updatePersonal,
  updateSkills,
  updateExperience,
  deleteExperience,
  addExperience,
  updateProject,
  deleteProject,
  addProject,
  updateEducation,
  deleteEducation,
  addEducation,
  updateCertification,
  deleteCertification,
  addCertification,
  onPhotoUploadClick,
}: any) {
  const showPhoto = data.personal.showPhoto && data.personal.photoUrl;

  return (
    <div
      className="a4-sheet-container template-modern"
      style={{ "--primary": colors.primary, "--light": colors.light, "--border": colors.border } as any}
    >
      {/* Header Banner */}
      <header className="modern-header" style={{ borderBottom: `2.5px solid ${colors.primary}` }}>
        <div className="modern-header-row">
          {/* Photo Slot */}
          {(showPhoto || isEditable) && (
            <div className="modern-photo-container">
              {showPhoto ? (
                <div
                  className="modern-photo-wrap"
                  style={{ borderColor: colors.primary }}
                  onClick={isEditable ? onPhotoUploadClick : undefined}
                  title={isEditable ? "Click to change photo" : undefined}
                >
                  <img src={data.personal.photoUrl} alt={data.personal.fullName} className="modern-photo-img" />
                  {isEditable && (
                    <div className="photo-edit-overlay">
                      <Camera size={14} />
                    </div>
                  )}
                </div>
              ) : isEditable ? (
                <button
                  type="button"
                  onClick={onPhotoUploadClick}
                  className="modern-photo-placeholder"
                  style={{ borderColor: colors.border }}
                  title="Click to add profile photo"
                >
                  <Camera size={18} style={{ color: colors.primary }} />
                  <span>+ Photo</span>
                </button>
              ) : null}
            </div>
          )}

          <div className="modern-header-text">
            <h1 className="modern-name" style={{ color: colors.primary }}>
              <InlineField
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                isEditable={isEditable}
                placeholder="Your Full Name"
                tag="span"
              />
            </h1>
            <div className="modern-title">
              <InlineField
                value={data.personal.jobTitle}
                onChange={(v) => updatePersonal("jobTitle", v)}
                isEditable={isEditable}
                placeholder="Target Job Title (e.g. Software Engineer)"
                tag="span"
              />
            </div>

            {/* Contact Links */}
            <div className="modern-contacts">
              {(data.personal.email || isEditable) && (
                <span>
                  <Mail size={12} style={{ color: colors.primary }} />
                  <InlineField
                    value={data.personal.email}
                    onChange={(v) => updatePersonal("email", v)}
                    isEditable={isEditable}
                    placeholder="email@example.com"
                    tag="span"
                  />
                </span>
              )}
              {(data.personal.phone || isEditable) && (
                <span>
                  <Phone size={12} style={{ color: colors.primary }} />
                  <InlineField
                    value={data.personal.phone}
                    onChange={(v) => updatePersonal("phone", v)}
                    isEditable={isEditable}
                    placeholder="+91 98765 43210"
                    tag="span"
                  />
                </span>
              )}
              {(data.personal.location || isEditable) && (
                <span>
                  <MapPin size={12} style={{ color: colors.primary }} />
                  <InlineField
                    value={data.personal.location}
                    onChange={(v) => updatePersonal("location", v)}
                    isEditable={isEditable}
                    placeholder="City, Country"
                    tag="span"
                  />
                </span>
              )}
              {(data.personal.linkedin || isEditable) && (
                <span>
                  <Globe size={12} style={{ color: colors.primary }} />
                  <InlineField
                    value={data.personal.linkedin}
                    onChange={(v) => updatePersonal("linkedin", v)}
                    isEditable={isEditable}
                    placeholder="linkedin.com/in/username"
                    tag="span"
                  />
                </span>
              )}
              {(data.personal.github || isEditable) && (
                <span>
                  <FolderGit2 size={12} style={{ color: colors.primary }} />
                  <InlineField
                    value={data.personal.github}
                    onChange={(v) => updatePersonal("github", v)}
                    isEditable={isEditable}
                    placeholder="github.com/username"
                    tag="span"
                  />
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {(data.personal.summary || isEditable) && (
        <section className="modern-section">
          <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
            Professional Summary
          </h2>
          <div className="modern-summary">
            <InlineField
              value={data.personal.summary}
              onChange={(v) => updatePersonal("summary", v)}
              isEditable={isEditable}
              placeholder="Write a concise professional summary highlighting your key strengths..."
              tag="p"
            />
          </div>
        </section>
      )}

      {/* Technical Skills */}
      <section className="modern-section">
        <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
          Technical Skills
        </h2>
        <div className="modern-skills-grid">
          <div>
            <strong>Languages:</strong>{" "}
            <InlineField
              value={data.skills.languages}
              onChange={(v) => updateSkills("languages", v)}
              isEditable={isEditable}
              placeholder="Java, Python, TypeScript, SQL..."
              tag="span"
            />
          </div>
          <div>
            <strong>Frameworks:</strong>{" "}
            <InlineField
              value={data.skills.frameworks}
              onChange={(v) => updateSkills("frameworks", v)}
              isEditable={isEditable}
              placeholder="React, Next.js, Node.js, Spring Boot..."
              tag="span"
            />
          </div>
          <div>
            <strong>Tools & Databases:</strong>{" "}
            <InlineField
              value={data.skills.toolsAndDatabases}
              onChange={(v) => updateSkills("toolsAndDatabases", v)}
              isEditable={isEditable}
              placeholder="PostgreSQL, Redis, Docker, AWS, Git..."
              tag="span"
            />
          </div>
          <div>
            <strong>Core Competencies:</strong>{" "}
            <InlineField
              value={data.skills.coreConcepts}
              onChange={(v) => updateSkills("coreConcepts", v)}
              isEditable={isEditable}
              placeholder="System Design, DSA, REST APIs, Microservices..."
              tag="span"
            />
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section className="modern-section">
        <div className="section-title-row">
          <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
            Work Experience
          </h2>
          {isEditable && (
            <button type="button" onClick={addExperience} className="resume-add-entry-btn">
              <Plus size={11} /> Add Experience
            </button>
          )}
        </div>
        <div className="modern-items-list">
          {data.experience.map((exp: ExperienceItem, expIdx: number) => (
            <article key={exp.id || expIdx} className="modern-item relative-item-group">
              {isEditable && (
                <button
                  type="button"
                  onClick={() => deleteExperience(expIdx)}
                  className="resume-delete-entry-btn"
                  title="Remove this experience"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <div className="item-heading-row">
                <div>
                  <strong className="item-title">
                    <InlineField
                      value={exp.role}
                      onChange={(v) => updateExperience(expIdx, { ...exp, role: v })}
                      isEditable={isEditable}
                      placeholder="Role / Title"
                      tag="span"
                    />
                  </strong>
                  <span className="item-subtitle">
                    {" "}
                    ·{" "}
                    <InlineField
                      value={exp.company}
                      onChange={(v) => updateExperience(expIdx, { ...exp, company: v })}
                      isEditable={isEditable}
                      placeholder="Company Name"
                      tag="span"
                    />
                  </span>
                </div>
                <span className="item-dates">
                  <InlineField
                    value={exp.startDate}
                    onChange={(v) => updateExperience(expIdx, { ...exp, startDate: v })}
                    isEditable={isEditable}
                    placeholder="Start"
                    tag="span"
                  />
                  {" – "}
                  <InlineField
                    value={exp.endDate}
                    onChange={(v) => updateExperience(expIdx, { ...exp, endDate: v })}
                    isEditable={isEditable}
                    placeholder="End / Present"
                    tag="span"
                  />
                  {" | "}
                  <InlineField
                    value={exp.location}
                    onChange={(v) => updateExperience(expIdx, { ...exp, location: v })}
                    isEditable={isEditable}
                    placeholder="Location"
                    tag="span"
                  />
                </span>
              </div>
              <ul className="item-bullets">
                {exp.bullets.map((bullet: string, bIdx: number) => (
                  <li key={bIdx} className="bullet-row-editable">
                    <InlineField
                      value={bullet}
                      onChange={(v) => {
                        const newBullets = [...exp.bullets];
                        newBullets[bIdx] = v;
                        updateExperience(expIdx, { ...exp, bullets: newBullets });
                      }}
                      isEditable={isEditable}
                      placeholder="Describe your achievement..."
                      tag="span"
                    />
                    {isEditable && exp.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newBullets = exp.bullets.filter((_, idx) => idx !== bIdx);
                          updateExperience(expIdx, { ...exp, bullets: newBullets });
                        }}
                        className="bullet-remove-inline"
                        title="Delete bullet"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {isEditable && (
                <button
                  type="button"
                  onClick={() => {
                    updateExperience(expIdx, { ...exp, bullets: [...exp.bullets, "New accomplishment bullet point"] });
                  }}
                  className="resume-add-bullet-btn"
                >
                  <Plus size={10} /> Add bullet
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="modern-section">
        <div className="section-title-row">
          <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
            Featured Projects
          </h2>
          {isEditable && (
            <button type="button" onClick={addProject} className="resume-add-entry-btn">
              <Plus size={11} /> Add Project
            </button>
          )}
        </div>
        <div className="modern-items-list">
          {data.projects.map((proj: ProjectItem, pIdx: number) => (
            <article key={proj.id || pIdx} className="modern-item relative-item-group">
              {isEditable && (
                <button
                  type="button"
                  onClick={() => deleteProject(pIdx)}
                  className="resume-delete-entry-btn"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <div className="item-heading-row">
                <div>
                  <strong className="item-title">
                    <InlineField
                      value={proj.title}
                      onChange={(v) => updateProject(pIdx, { ...proj, title: v })}
                      isEditable={isEditable}
                      placeholder="Project Title"
                      tag="span"
                    />
                  </strong>
                  <span className="item-tech-stack">
                    {" "}
                    |{" "}
                    <em>
                      <InlineField
                        value={proj.techStack}
                        onChange={(v) => updateProject(pIdx, { ...proj, techStack: v })}
                        isEditable={isEditable}
                        placeholder="Technologies"
                        tag="span"
                      />
                    </em>
                  </span>
                </div>
                {(proj.link || isEditable) && (
                  <span className="item-link">
                    <InlineField
                      value={proj.link}
                      onChange={(v) => updateProject(pIdx, { ...proj, link: v })}
                      isEditable={isEditable}
                      placeholder="https://project.com"
                      tag="span"
                    />
                  </span>
                )}
              </div>
              <ul className="item-bullets">
                {proj.bullets.map((bullet: string, bIdx: number) => (
                  <li key={bIdx} className="bullet-row-editable">
                    <InlineField
                      value={bullet}
                      onChange={(v) => {
                        const newBullets = [...proj.bullets];
                        newBullets[bIdx] = v;
                        updateProject(pIdx, { ...proj, bullets: newBullets });
                      }}
                      isEditable={isEditable}
                      placeholder="Describe project details..."
                      tag="span"
                    />
                    {isEditable && proj.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newBullets = proj.bullets.filter((_, idx) => idx !== bIdx);
                          updateProject(pIdx, { ...proj, bullets: newBullets });
                        }}
                        className="bullet-remove-inline"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {isEditable && (
                <button
                  type="button"
                  onClick={() => {
                    updateProject(pIdx, { ...proj, bullets: [...proj.bullets, "New project impact bullet point"] });
                  }}
                  className="resume-add-bullet-btn"
                >
                  <Plus size={10} /> Add bullet
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Education & Certifications Split */}
      <div className="modern-two-col">
        {/* Education */}
        <section className="modern-section">
          <div className="section-title-row">
            <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
              Education
            </h2>
            {isEditable && (
              <button type="button" onClick={addEducation} className="resume-add-entry-btn">
                <Plus size={11} /> Add
              </button>
            )}
          </div>
          {data.education.map((edu: EducationItem, eIdx: number) => (
            <div key={edu.id || eIdx} className="modern-edu-item relative-item-group">
              {isEditable && (
                <button
                  type="button"
                  onClick={() => deleteEducation(eIdx)}
                  className="resume-delete-entry-btn"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <div className="item-heading-row">
                <strong className="item-title">
                  <InlineField
                    value={edu.degree}
                    onChange={(v) => updateEducation(eIdx, { ...edu, degree: v })}
                    isEditable={isEditable}
                    placeholder="Degree"
                    tag="span"
                  />
                  {" in "}
                  <InlineField
                    value={edu.field}
                    onChange={(v) => updateEducation(eIdx, { ...edu, field: v })}
                    isEditable={isEditable}
                    placeholder="Field"
                    tag="span"
                  />
                </strong>
                <span className="item-dates">
                  <InlineField
                    value={edu.startDate}
                    onChange={(v) => updateEducation(eIdx, { ...edu, startDate: v })}
                    isEditable={isEditable}
                    placeholder="Start"
                    tag="span"
                  />
                  {" – "}
                  <InlineField
                    value={edu.endDate}
                    onChange={(v) => updateEducation(eIdx, { ...edu, endDate: v })}
                    isEditable={isEditable}
                    placeholder="End"
                    tag="span"
                  />
                </span>
              </div>
              <div className="item-subtitle">
                <InlineField
                  value={edu.institution}
                  onChange={(v) => updateEducation(eIdx, { ...edu, institution: v })}
                  isEditable={isEditable}
                  placeholder="Institution"
                  tag="span"
                />
                {", "}
                <InlineField
                  value={edu.location}
                  onChange={(v) => updateEducation(eIdx, { ...edu, location: v })}
                  isEditable={isEditable}
                  placeholder="Location"
                  tag="span"
                />
              </div>
              {(edu.grade || isEditable) && (
                <div className="item-grade">
                  <InlineField
                    value={edu.grade}
                    onChange={(v) => updateEducation(eIdx, { ...edu, grade: v })}
                    isEditable={isEditable}
                    placeholder="GPA: 8.8 / 10"
                    tag="span"
                  />
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Certifications */}
        <section className="modern-section">
          <div className="section-title-row">
            <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
              Certifications
            </h2>
            {isEditable && (
              <button type="button" onClick={addCertification} className="resume-add-entry-btn">
                <Plus size={11} /> Add
              </button>
            )}
          </div>
          {data.certifications.map((cert: CertificationItem, cIdx: number) => (
            <div key={cert.id || cIdx} className="modern-cert-item relative-item-group">
              {isEditable && (
                <button
                  type="button"
                  onClick={() => deleteCertification(cIdx)}
                  className="resume-delete-entry-btn"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <div className="item-heading-row">
                <strong className="item-title">
                  <InlineField
                    value={cert.name}
                    onChange={(v) => updateCertification(cIdx, { ...cert, name: v })}
                    isEditable={isEditable}
                    placeholder="Certificate"
                    tag="span"
                  />
                </strong>
                <span className="item-dates">
                  <InlineField
                    value={cert.date}
                    onChange={(v) => updateCertification(cIdx, { ...cert, date: v })}
                    isEditable={isEditable}
                    placeholder="Year"
                    tag="span"
                  />
                </span>
              </div>
              <div className="item-subtitle">
                <InlineField
                  value={cert.issuer}
                  onChange={(v) => updateCertification(cIdx, { ...cert, issuer: v })}
                  isEditable={isEditable}
                  placeholder="Issuer"
                  tag="span"
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

/* =========================================================================
   TEMPLATE 4: CLASSIC ATS MINIMALIST (Harvard / Google Standard)
   ========================================================================= */
function ClassicATSTemplate({
  data,
  colors,
  isEditable,
  updatePersonal,
  updateSkills,
  updateExperience,
  deleteExperience,
  addExperience,
  updateProject,
  deleteProject,
  addProject,
  updateEducation,
  deleteEducation,
  addEducation,
  updateCertification,
  deleteCertification,
  addCertification,
  onPhotoUploadClick,
}: any) {
  const showPhoto = data.personal.showPhoto && data.personal.photoUrl;

  return (
    <div className="a4-sheet-container template-classic">
      {/* Centered Clean Header */}
      <header className="classic-header">
        <div className="classic-header-flex">
          {showPhoto && (
            <div
              className="classic-photo-wrap"
              onClick={isEditable ? onPhotoUploadClick : undefined}
              title={isEditable ? "Click to change photo" : undefined}
            >
              <img src={data.personal.photoUrl} alt={data.personal.fullName} className="classic-photo-img" />
              {isEditable && (
                <div className="photo-edit-overlay">
                  <Camera size={13} />
                </div>
              )}
            </div>
          )}

          <div className="classic-header-content">
            <h1 className="classic-name">
              <InlineField
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                isEditable={isEditable}
                placeholder="YOUR FULL NAME"
                tag="span"
              />
            </h1>
            <div className="classic-title">
              <InlineField
                value={data.personal.jobTitle}
                onChange={(v) => updatePersonal("jobTitle", v)}
                isEditable={isEditable}
                placeholder="Software Development Engineer"
                tag="span"
              />
            </div>
            <div className="classic-contacts">
              <InlineField
                value={data.personal.location}
                onChange={(v) => updatePersonal("location", v)}
                isEditable={isEditable}
                placeholder="Location"
                tag="span"
              />
              {"  |  "}
              <InlineField
                value={data.personal.phone}
                onChange={(v) => updatePersonal("phone", v)}
                isEditable={isEditable}
                placeholder="Phone"
                tag="span"
              />
              {"  |  "}
              <InlineField
                value={data.personal.email}
                onChange={(v) => updatePersonal("email", v)}
                isEditable={isEditable}
                placeholder="Email Address"
                tag="span"
              />
              {"  |  "}
              <InlineField
                value={data.personal.linkedin}
                onChange={(v) => updatePersonal("linkedin", v)}
                isEditable={isEditable}
                placeholder="LinkedIn URL"
                tag="span"
              />
              {"  |  "}
              <InlineField
                value={data.personal.github}
                onChange={(v) => updatePersonal("github", v)}
                isEditable={isEditable}
                placeholder="GitHub URL"
                tag="span"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      {(data.personal.summary || isEditable) && (
        <section className="classic-section">
          <h2 className="classic-section-title">SUMMARY</h2>
          <div className="classic-summary">
            <InlineField
              value={data.personal.summary}
              onChange={(v) => updatePersonal("summary", v)}
              isEditable={isEditable}
              placeholder="Results-driven professional with proven expertise..."
              tag="p"
            />
          </div>
        </section>
      )}

      {/* Education */}
      <section className="classic-section">
        <div className="section-title-row">
          <h2 className="classic-section-title">EDUCATION</h2>
          {isEditable && (
            <button type="button" onClick={addEducation} className="resume-add-entry-btn">
              <Plus size={11} /> Add
            </button>
          )}
        </div>
        {data.education.map((edu: EducationItem, idx: number) => (
          <div key={edu.id || idx} className="classic-item relative-item-group">
            {isEditable && (
              <button
                type="button"
                onClick={() => deleteEducation(idx)}
                className="resume-delete-entry-btn"
              >
                <Trash2 size={12} />
              </button>
            )}
            <div className="classic-row">
              <strong>
                <InlineField
                  value={edu.institution}
                  onChange={(v) => updateEducation(idx, { ...edu, institution: v })}
                  isEditable={isEditable}
                  placeholder="Institution"
                  tag="span"
                />
              </strong>
              <span>
                <InlineField
                  value={edu.location}
                  onChange={(v) => updateEducation(idx, { ...edu, location: v })}
                  isEditable={isEditable}
                  placeholder="City, State"
                  tag="span"
                />
              </span>
            </div>
            <div className="classic-row">
              <span>
                <InlineField
                  value={edu.degree}
                  onChange={(v) => updateEducation(idx, { ...edu, degree: v })}
                  isEditable={isEditable}
                  placeholder="Degree"
                  tag="span"
                />
                {" in "}
                <InlineField
                  value={edu.field}
                  onChange={(v) => updateEducation(idx, { ...edu, field: v })}
                  isEditable={isEditable}
                  placeholder="Major"
                  tag="span"
                />
                {" ("}
                <InlineField
                  value={edu.grade}
                  onChange={(v) => updateEducation(idx, { ...edu, grade: v })}
                  isEditable={isEditable}
                  placeholder="GPA: 8.8/10"
                  tag="span"
                />
                {")"}
              </span>
              <span>
                <InlineField
                  value={edu.startDate}
                  onChange={(v) => updateEducation(idx, { ...edu, startDate: v })}
                  isEditable={isEditable}
                  placeholder="Start"
                  tag="span"
                />
                {" – "}
                <InlineField
                  value={edu.endDate}
                  onChange={(v) => updateEducation(idx, { ...edu, endDate: v })}
                  isEditable={isEditable}
                  placeholder="Graduation"
                  tag="span"
                />
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Technical Skills */}
      <section className="classic-section">
        <h2 className="classic-section-title">TECHNICAL SKILLS</h2>
        <div className="classic-skills-list">
          <div>
            <strong>Languages:</strong>{" "}
            <InlineField
              value={data.skills.languages}
              onChange={(v) => updateSkills("languages", v)}
              isEditable={isEditable}
              placeholder="Java, Python, C++, TypeScript..."
              tag="span"
            />
          </div>
          <div>
            <strong>Frameworks & Libraries:</strong>{" "}
            <InlineField
              value={data.skills.frameworks}
              onChange={(v) => updateSkills("frameworks", v)}
              isEditable={isEditable}
              placeholder="React, Next.js, Node.js..."
              tag="span"
            />
          </div>
          <div>
            <strong>Developer Tools & Databases:</strong>{" "}
            <InlineField
              value={data.skills.toolsAndDatabases}
              onChange={(v) => updateSkills("toolsAndDatabases", v)}
              isEditable={isEditable}
              placeholder="PostgreSQL, MongoDB, Docker, Git..."
              tag="span"
            />
          </div>
          <div>
            <strong>Core Competencies:</strong>{" "}
            <InlineField
              value={data.skills.coreConcepts}
              onChange={(v) => updateSkills("coreConcepts", v)}
              isEditable={isEditable}
              placeholder="System Design, Algorithms, REST APIs..."
              tag="span"
            />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="classic-section">
        <div className="section-title-row">
          <h2 className="classic-section-title">WORK EXPERIENCE</h2>
          {isEditable && (
            <button type="button" onClick={addExperience} className="resume-add-entry-btn">
              <Plus size={11} /> Add
            </button>
          )}
        </div>
        {data.experience.map((exp: ExperienceItem, idx: number) => (
          <div key={exp.id || idx} className="classic-item relative-item-group">
            {isEditable && (
              <button
                type="button"
                onClick={() => deleteExperience(idx)}
                className="resume-delete-entry-btn"
              >
                <Trash2 size={12} />
              </button>
            )}
            <div className="classic-row">
              <strong>
                <InlineField
                  value={exp.role}
                  onChange={(v) => updateExperience(idx, { ...exp, role: v })}
                  isEditable={isEditable}
                  placeholder="Job Title"
                  tag="span"
                />
              </strong>
              <span>
                <InlineField
                  value={exp.startDate}
                  onChange={(v) => updateExperience(idx, { ...exp, startDate: v })}
                  isEditable={isEditable}
                  placeholder="Start"
                  tag="span"
                />
                {" – "}
                <InlineField
                  value={exp.endDate}
                  onChange={(v) => updateExperience(idx, { ...exp, endDate: v })}
                  isEditable={isEditable}
                  placeholder="End"
                  tag="span"
                />
              </span>
            </div>
            <div className="classic-row">
              <em>
                <InlineField
                  value={exp.company}
                  onChange={(v) => updateExperience(idx, { ...exp, company: v })}
                  isEditable={isEditable}
                  placeholder="Company Name"
                  tag="span"
                />
              </em>
              <span>
                <InlineField
                  value={exp.location}
                  onChange={(v) => updateExperience(idx, { ...exp, location: v })}
                  isEditable={isEditable}
                  placeholder="Location"
                  tag="span"
                />
              </span>
            </div>
            <ul className="classic-bullets">
              {exp.bullets.map((bullet: string, bIdx: number) => (
                <li key={bIdx} className="bullet-row-editable">
                  <InlineField
                    value={bullet}
                    onChange={(v) => {
                      const newBullets = [...exp.bullets];
                      newBullets[bIdx] = v;
                      updateExperience(idx, { ...exp, bullets: newBullets });
                    }}
                    isEditable={isEditable}
                    placeholder="Accomplishment bullet..."
                    tag="span"
                  />
                  {isEditable && exp.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newBullets = exp.bullets.filter((_, i) => i !== bIdx);
                        updateExperience(idx, { ...exp, bullets: newBullets });
                      }}
                      className="bullet-remove-inline"
                    >
                      <X size={10} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {isEditable && (
              <button
                type="button"
                onClick={() => {
                  updateExperience(idx, { ...exp, bullets: [...exp.bullets, "New accomplishment bullet point"] });
                }}
                className="resume-add-bullet-btn"
              >
                <Plus size={10} /> Add bullet
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Projects */}
      <section className="classic-section">
        <div className="section-title-row">
          <h2 className="classic-section-title">PROJECTS</h2>
          {isEditable && (
            <button type="button" onClick={addProject} className="resume-add-entry-btn">
              <Plus size={11} /> Add
            </button>
          )}
        </div>
        {data.projects.map((proj: ProjectItem, idx: number) => (
          <div key={proj.id || idx} className="classic-item relative-item-group">
            {isEditable && (
              <button
                type="button"
                onClick={() => deleteProject(idx)}
                className="resume-delete-entry-btn"
              >
                <Trash2 size={12} />
              </button>
            )}
            <div className="classic-row">
              <strong>
                <InlineField
                  value={proj.title}
                  onChange={(v) => updateProject(idx, { ...proj, title: v })}
                  isEditable={isEditable}
                  placeholder="Project Title"
                  tag="span"
                />
              </strong>
              <span>
                <InlineField
                  value={proj.link}
                  onChange={(v) => updateProject(idx, { ...proj, link: v })}
                  isEditable={isEditable}
                  placeholder="Live URL / Repo"
                  tag="span"
                />
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "#475569", marginBottom: 3 }}>
              <em>
                Technologies:{" "}
                <InlineField
                  value={proj.techStack}
                  onChange={(v) => updateProject(idx, { ...proj, techStack: v })}
                  isEditable={isEditable}
                  placeholder="Stack details"
                  tag="span"
                />
              </em>
            </div>
            <ul className="classic-bullets">
              {proj.bullets.map((bullet: string, bIdx: number) => (
                <li key={bIdx} className="bullet-row-editable">
                  <InlineField
                    value={bullet}
                    onChange={(v) => {
                      const newBullets = [...proj.bullets];
                      newBullets[bIdx] = v;
                      updateProject(idx, { ...proj, bullets: newBullets });
                    }}
                    isEditable={isEditable}
                    placeholder="Project details..."
                    tag="span"
                  />
                  {isEditable && proj.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newBullets = proj.bullets.filter((_, i) => i !== bIdx);
                        updateProject(idx, { ...proj, bullets: newBullets });
                      }}
                      className="bullet-remove-inline"
                    >
                      <X size={10} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {isEditable && (
              <button
                type="button"
                onClick={() => {
                  updateProject(idx, { ...proj, bullets: [...proj.bullets, "New project impact bullet point"] });
                }}
                className="resume-add-bullet-btn"
              >
                <Plus size={10} /> Add bullet
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Certifications */}
      <section className="classic-section">
        <div className="section-title-row">
          <h2 className="classic-section-title">CERTIFICATIONS & ACHIEVEMENTS</h2>
          {isEditable && (
            <button type="button" onClick={addCertification} className="resume-add-entry-btn">
              <Plus size={11} /> Add
            </button>
          )}
        </div>
        <ul className="classic-bullets">
          {data.certifications.map((cert: CertificationItem, idx: number) => (
            <li key={cert.id || idx} className="relative-item-group bullet-row-editable">
              <strong>
                <InlineField
                  value={cert.name}
                  onChange={(v) => updateCertification(idx, { ...cert, name: v })}
                  isEditable={isEditable}
                  placeholder="Certificate Name"
                  tag="span"
                />
              </strong>
              {" — "}
              <InlineField
                value={cert.issuer}
                onChange={(v) => updateCertification(idx, { ...cert, issuer: v })}
                isEditable={isEditable}
                placeholder="Issuer"
                tag="span"
              />
              {" ("}
              <InlineField
                value={cert.date}
                onChange={(v) => updateCertification(idx, { ...cert, date: v })}
                isEditable={isEditable}
                placeholder="Year"
                tag="span"
              />
              {")"}
              {isEditable && (
                <button
                  type="button"
                  onClick={() => deleteCertification(idx)}
                  className="bullet-remove-inline"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/* =========================================================================
   TEMPLATE 5: COMPACT STANFORD EXECUTIVE
   ========================================================================= */
function CompactStanfordTemplate({
  data,
  colors,
  isEditable,
  updatePersonal,
  updateSkills,
  updateExperience,
  deleteExperience,
  addExperience,
  updateProject,
  deleteProject,
  addProject,
  updateEducation,
  deleteEducation,
  addEducation,
  updateCertification,
  deleteCertification,
  addCertification,
  onPhotoUploadClick,
}: any) {
  const showPhoto = data.personal.showPhoto && data.personal.photoUrl;

  return (
    <div
      className="a4-sheet-container template-compact"
      style={{ "--primary": colors.primary, "--light": colors.light, "--border": colors.border } as any}
    >
      {/* Top Banner Header */}
      <header className="compact-header" style={{ borderLeft: `5px solid ${colors.primary}`, paddingLeft: 14 }}>
        <div className="compact-header-row">
          {(showPhoto || isEditable) && (
            <div className="compact-photo-container">
              {showPhoto ? (
                <div
                  className="compact-photo-wrap"
                  style={{ borderColor: colors.primary }}
                  onClick={isEditable ? onPhotoUploadClick : undefined}
                  title={isEditable ? "Click to change photo" : undefined}
                >
                  <img src={data.personal.photoUrl} alt={data.personal.fullName} className="compact-photo-img" />
                  {isEditable && (
                    <div className="photo-edit-overlay">
                      <Camera size={13} />
                    </div>
                  )}
                </div>
              ) : isEditable ? (
                <button
                  type="button"
                  onClick={onPhotoUploadClick}
                  className="compact-photo-placeholder"
                  style={{ borderColor: colors.border }}
                  title="Add photo"
                >
                  <Camera size={15} style={{ color: colors.primary }} />
                </button>
              ) : null}
            </div>
          )}

          <div className="compact-header-info">
            <h1 className="compact-name" style={{ color: colors.primary }}>
              <InlineField
                value={data.personal.fullName}
                onChange={(v) => updatePersonal("fullName", v)}
                isEditable={isEditable}
                placeholder="Your Full Name"
                tag="span"
              />
            </h1>
            <div className="compact-title">
              <InlineField
                value={data.personal.jobTitle}
                onChange={(v) => updatePersonal("jobTitle", v)}
                isEditable={isEditable}
                placeholder="Software Engineer"
                tag="span"
              />
            </div>
            <div className="compact-contacts">
              <span className="compact-pill" style={{ background: colors.light, color: colors.primary }}>
                <InlineField
                  value={data.personal.email}
                  onChange={(v) => updatePersonal("email", v)}
                  isEditable={isEditable}
                  placeholder="Email"
                  tag="span"
                />
              </span>
              <span className="compact-pill" style={{ background: colors.light, color: colors.primary }}>
                <InlineField
                  value={data.personal.phone}
                  onChange={(v) => updatePersonal("phone", v)}
                  isEditable={isEditable}
                  placeholder="Phone"
                  tag="span"
                />
              </span>
              <span className="compact-pill" style={{ background: colors.light, color: colors.primary }}>
                <InlineField
                  value={data.personal.location}
                  onChange={(v) => updatePersonal("location", v)}
                  isEditable={isEditable}
                  placeholder="Location"
                  tag="span"
                />
              </span>
              {(data.personal.linkedin || isEditable) && (
                <span className="compact-pill" style={{ background: colors.light, color: colors.primary }}>
                  <InlineField
                    value={data.personal.linkedin}
                    onChange={(v) => updatePersonal("linkedin", v)}
                    isEditable={isEditable}
                    placeholder="LinkedIn"
                    tag="span"
                  />
                </span>
              )}
              {(data.personal.github || isEditable) && (
                <span className="compact-pill" style={{ background: colors.light, color: colors.primary }}>
                  <InlineField
                    value={data.personal.github}
                    onChange={(v) => updatePersonal("github", v)}
                    isEditable={isEditable}
                    placeholder="GitHub"
                    tag="span"
                  />
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      {(data.personal.summary || isEditable) && (
        <section className="compact-section">
          <div className="compact-tag-header" style={{ color: colors.primary }}>
            ABOUT ME
          </div>
          <div className="compact-summary">
            <InlineField
              value={data.personal.summary}
              onChange={(v) => updatePersonal("summary", v)}
              isEditable={isEditable}
              placeholder="Summary of qualifications..."
              tag="p"
            />
          </div>
        </section>
      )}

      {/* Technical Skills */}
      <section className="compact-section">
        <div className="compact-tag-header" style={{ color: colors.primary }}>
          SKILLS & EXPERTISE
        </div>
        <div className="compact-skills">
          <div>
            <strong>Languages:</strong>{" "}
            <InlineField
              value={data.skills.languages}
              onChange={(v) => updateSkills("languages", v)}
              isEditable={isEditable}
              placeholder="Java, Python, C++..."
              tag="span"
            />
          </div>
          <div>
            <strong>Frameworks:</strong>{" "}
            <InlineField
              value={data.skills.frameworks}
              onChange={(v) => updateSkills("frameworks", v)}
              isEditable={isEditable}
              placeholder="React, Next.js, Node.js..."
              tag="span"
            />
          </div>
          <div>
            <strong>Tools & DBs:</strong>{" "}
            <InlineField
              value={data.skills.toolsAndDatabases}
              onChange={(v) => updateSkills("toolsAndDatabases", v)}
              isEditable={isEditable}
              placeholder="PostgreSQL, Redis, Docker, Git..."
              tag="span"
            />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="compact-section">
        <div className="section-title-row">
          <div className="compact-tag-header" style={{ color: colors.primary }}>
            EXPERIENCE
          </div>
          {isEditable && (
            <button type="button" onClick={addExperience} className="resume-add-entry-btn">
              <Plus size={11} /> Add
            </button>
          )}
        </div>
        {data.experience.map((exp: ExperienceItem, idx: number) => (
          <div key={exp.id || idx} className="compact-item relative-item-group">
            {isEditable && (
              <button
                type="button"
                onClick={() => deleteExperience(idx)}
                className="resume-delete-entry-btn"
              >
                <Trash2 size={12} />
              </button>
            )}
            <div className="item-heading-row">
              <strong style={{ color: colors.primary }}>
                <InlineField
                  value={exp.role}
                  onChange={(v) => updateExperience(idx, { ...exp, role: v })}
                  isEditable={isEditable}
                  placeholder="Position Role"
                  tag="span"
                />
              </strong>
              <span className="item-dates">
                <InlineField
                  value={exp.startDate}
                  onChange={(v) => updateExperience(idx, { ...exp, startDate: v })}
                  isEditable={isEditable}
                  placeholder="Start"
                  tag="span"
                />
                {" – "}
                <InlineField
                  value={exp.endDate}
                  onChange={(v) => updateExperience(idx, { ...exp, endDate: v })}
                  isEditable={isEditable}
                  placeholder="End"
                  tag="span"
                />
              </span>
            </div>
            <div className="item-subtitle">
              <InlineField
                value={exp.company}
                onChange={(v) => updateExperience(idx, { ...exp, company: v })}
                isEditable={isEditable}
                placeholder="Company"
                tag="span"
              />
              {" | "}
              <InlineField
                value={exp.location}
                onChange={(v) => updateExperience(idx, { ...exp, location: v })}
                isEditable={isEditable}
                placeholder="Location"
                tag="span"
              />
            </div>
            <ul className="item-bullets">
              {exp.bullets.map((b: string, bIdx: number) => (
                <li key={bIdx} className="bullet-row-editable">
                  <InlineField
                    value={b}
                    onChange={(v) => {
                      const newBullets = [...exp.bullets];
                      newBullets[bIdx] = v;
                      updateExperience(idx, { ...exp, bullets: newBullets });
                    }}
                    isEditable={isEditable}
                    placeholder="Impact bullet..."
                    tag="span"
                  />
                  {isEditable && exp.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newBullets = exp.bullets.filter((_, i) => i !== bIdx);
                        updateExperience(idx, { ...exp, bullets: newBullets });
                      }}
                      className="bullet-remove-inline"
                    >
                      <X size={10} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {isEditable && (
              <button
                type="button"
                onClick={() => {
                  updateExperience(idx, { ...exp, bullets: [...exp.bullets, "New achievement bullet point"] });
                }}
                className="resume-add-bullet-btn"
              >
                <Plus size={10} /> Add bullet
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Projects */}
      <section className="compact-section">
        <div className="section-title-row">
          <div className="compact-tag-header" style={{ color: colors.primary }}>
            KEY PROJECTS
          </div>
          {isEditable && (
            <button type="button" onClick={addProject} className="resume-add-entry-btn">
              <Plus size={11} /> Add
            </button>
          )}
        </div>
        {data.projects.map((proj: ProjectItem, idx: number) => (
          <div key={proj.id || idx} className="compact-item relative-item-group">
            {isEditable && (
              <button
                type="button"
                onClick={() => deleteProject(idx)}
                className="resume-delete-entry-btn"
              >
                <Trash2 size={12} />
              </button>
            )}
            <div className="item-heading-row">
              <strong style={{ color: colors.primary }}>
                <InlineField
                  value={proj.title}
                  onChange={(v) => updateProject(idx, { ...proj, title: v })}
                  isEditable={isEditable}
                  placeholder="Project Name"
                  tag="span"
                />
              </strong>
              {(proj.link || isEditable) && (
                <span className="item-link">
                  <InlineField
                    value={proj.link}
                    onChange={(v) => updateProject(idx, { ...proj, link: v })}
                    isEditable={isEditable}
                    placeholder="Link"
                    tag="span"
                  />
                </span>
              )}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 4px" }}>
              <em>
                Stack:{" "}
                <InlineField
                  value={proj.techStack}
                  onChange={(v) => updateProject(idx, { ...proj, techStack: v })}
                  isEditable={isEditable}
                  placeholder="Tech stack"
                  tag="span"
                />
              </em>
            </div>
            <ul className="item-bullets">
              {proj.bullets.map((b: string, bIdx: number) => (
                <li key={bIdx} className="bullet-row-editable">
                  <InlineField
                    value={b}
                    onChange={(v) => {
                      const newBullets = [...proj.bullets];
                      newBullets[bIdx] = v;
                      updateProject(idx, { ...proj, bullets: newBullets });
                    }}
                    isEditable={isEditable}
                    placeholder="Project details..."
                    tag="span"
                  />
                  {isEditable && proj.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newBullets = proj.bullets.filter((_, i) => i !== bIdx);
                        updateProject(idx, { ...proj, bullets: newBullets });
                      }}
                      className="bullet-remove-inline"
                    >
                      <X size={10} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {isEditable && (
              <button
                type="button"
                onClick={() => {
                  updateProject(idx, { ...proj, bullets: [...proj.bullets, "New project impact bullet point"] });
                }}
                className="resume-add-bullet-btn"
              >
                <Plus size={10} /> Add bullet
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="compact-section">
        <div className="section-title-row">
          <div className="compact-tag-header" style={{ color: colors.primary }}>
            EDUCATION
          </div>
          {isEditable && (
            <button type="button" onClick={addEducation} className="resume-add-entry-btn">
              <Plus size={11} /> Add
            </button>
          )}
        </div>
        {data.education.map((edu: EducationItem, idx: number) => (
          <div key={edu.id || idx} className="compact-item relative-item-group">
            {isEditable && (
              <button
                type="button"
                onClick={() => deleteEducation(idx)}
                className="resume-delete-entry-btn"
              >
                <Trash2 size={12} />
              </button>
            )}
            <div className="item-heading-row">
              <strong>
                <InlineField
                  value={edu.degree}
                  onChange={(v) => updateEducation(idx, { ...edu, degree: v })}
                  isEditable={isEditable}
                  placeholder="Degree"
                  tag="span"
                />
                {" in "}
                <InlineField
                  value={edu.field}
                  onChange={(v) => updateEducation(idx, { ...edu, field: v })}
                  isEditable={isEditable}
                  placeholder="Field"
                  tag="span"
                />
              </strong>
              <span className="item-dates">
                <InlineField
                  value={edu.startDate}
                  onChange={(v) => updateEducation(idx, { ...edu, startDate: v })}
                  isEditable={isEditable}
                  placeholder="Start"
                  tag="span"
                />
                {" – "}
                <InlineField
                  value={edu.endDate}
                  onChange={(v) => updateEducation(idx, { ...edu, endDate: v })}
                  isEditable={isEditable}
                  placeholder="End"
                  tag="span"
                />
              </span>
            </div>
            <div className="item-subtitle">
              <InlineField
                value={edu.institution}
                onChange={(v) => updateEducation(idx, { ...edu, institution: v })}
                isEditable={isEditable}
                placeholder="Institution"
                tag="span"
              />
              {" ("}
              <InlineField
                value={edu.grade}
                onChange={(v) => updateEducation(idx, { ...edu, grade: v })}
                isEditable={isEditable}
                placeholder="GPA"
                tag="span"
              />
              {")"}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
