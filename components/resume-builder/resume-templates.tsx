"use client";

import React, { useRef } from "react";
import {
  Camera,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Upload,
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

const ACCENT_COLORS: Record<ResumeAccentColor, { primary: string; light: string; border: string }> = {
  purple: { primary: "#4f46e5", light: "#eef2ff", border: "#c7d2fe" },
  blue: { primary: "#0284c7", light: "#f0f9ff", border: "#bae6fd" },
  emerald: { primary: "#059669", light: "#ecfdf5", border: "#a7f3d0" },
  slate: { primary: "#1e293b", light: "#f8fafc", border: "#cbd5e1" },
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

  // Helper updater functions
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
      bullets: ["Describe your impact, achievements, and technologies used (Accomplished X by Y)."],
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
      bullets: ["Engineered responsive application featuring real-time data sync and modern UI."],
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
      grade: "CGPA: 8.5 / 10",
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
        {value || (placeholder ? <span style={{ opacity: 0.4 }}>{placeholder}</span> : null)}
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
   TEMPLATE 1: MODERN TECH EXECUTIVE
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
    <div className="resume-sheet template-modern" style={{ "--primary": colors.primary } as any}>
      {/* Header Banner */}
      <header className="modern-header" style={{ borderBottom: `2px solid ${colors.primary}` }}>
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
                  <ExternalLink size={12} style={{ color: colors.primary }} />
                  <InlineField
                    value={data.personal.github}
                    onChange={(v) => updatePersonal("github", v)}
                    isEditable={isEditable}
                    placeholder="github.com/username"
                    tag="span"
                  />
                </span>
              )}
              {(data.personal.portfolio || isEditable) && (
                <span>
                  <Globe size={12} style={{ color: colors.primary }} />
                  <InlineField
                    value={data.personal.portfolio}
                    onChange={(v) => updatePersonal("portfolio", v)}
                    isEditable={isEditable}
                    placeholder="portfolio.dev"
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
              placeholder="Write a concise professional summary highlighting your key strengths, domain expertise, and career achievements..."
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
                      placeholder="Describe your achievement and impact..."
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
                  title="Remove this project"
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
                        placeholder="Technologies (e.g. Next.js, Go, Redis)"
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
                      placeholder="Describe what you built and the results achieved..."
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
                  title="Remove education"
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
                    placeholder="Field of Study"
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
                  placeholder="Institution Name"
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
                    placeholder="GPA / Score (e.g. 8.8 / 10)"
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
                  title="Remove certification"
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
                    placeholder="Certificate Name"
                    tag="span"
                  />
                </strong>
                <span className="item-dates">
                  <InlineField
                    value={cert.date}
                    onChange={(v) => updateCertification(cIdx, { ...cert, date: v })}
                    isEditable={isEditable}
                    placeholder="Year / Date"
                    tag="span"
                  />
                </span>
              </div>
              <div className="item-subtitle">
                <InlineField
                  value={cert.issuer}
                  onChange={(v) => updateCertification(cIdx, { ...cert, issuer: v })}
                  isEditable={isEditable}
                  placeholder="Issuing Organization (e.g. AWS, Meta)"
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
   TEMPLATE 2: CLASSIC ATS MINIMALIST (Harvard / Google Standard)
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
    <div className="resume-sheet template-classic">
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

      {/* Professional Summary */}
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
                title="Remove education"
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
                  placeholder="Graduation Year"
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
              placeholder="React, Next.js, Node.js, Express..."
              tag="span"
            />
          </div>
          <div>
            <strong>Developer Tools & Databases:</strong>{" "}
            <InlineField
              value={data.skills.toolsAndDatabases}
              onChange={(v) => updateSkills("toolsAndDatabases", v)}
              isEditable={isEditable}
              placeholder="PostgreSQL, MongoDB, Docker, Git, AWS..."
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
                title="Remove experience"
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
                title="Remove project"
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
                  title="Remove certification"
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
   TEMPLATE 3: COMPACT STANFORD EXECUTIVE
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
    <div className="resume-sheet template-compact" style={{ "--primary": colors.primary } as any}>
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
              placeholder="Summary of qualifications and engineering background..."
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
                title="Remove experience"
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
                title="Remove project"
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
                title="Remove education"
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
