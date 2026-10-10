"use client";

import React from "react";
import {
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { ResumeAccentColor, ResumeData, ResumeTemplateId } from "@/lib/resume-data";

const ACCENT_COLORS: Record<ResumeAccentColor, { primary: string; light: string; border: string }> = {
  purple: { primary: "#4f46e5", light: "#eef2ff", border: "#c7d2fe" },
  blue: { primary: "#0284c7", light: "#f0f9ff", border: "#bae6fd" },
  emerald: { primary: "#059669", light: "#ecfdf5", border: "#a7f3d0" },
  slate: { primary: "#1e293b", light: "#f8fafc", border: "#cbd5e1" },
};

export function ResumeRenderer({
  data,
  templateId,
  accentColor,
}: {
  data: ResumeData;
  templateId: ResumeTemplateId;
  accentColor: ResumeAccentColor;
}) {
  const colors = ACCENT_COLORS[accentColor] || ACCENT_COLORS.purple;

  if (templateId === "classic") {
    return <ClassicATSTemplate data={data} colors={colors} />;
  }

  if (templateId === "compact") {
    return <CompactStanfordTemplate data={data} colors={colors} />;
  }

  return <ModernTechTemplate data={data} colors={colors} />;
}

/* =========================================================================
   TEMPLATE 1: MODERN TECH EXECUTIVE
   ========================================================================= */
function ModernTechTemplate({
  data,
  colors,
}: {
  data: ResumeData;
  colors: { primary: string; light: string; border: string };
}) {
  return (
    <div className="resume-sheet template-modern" style={{ "--primary": colors.primary } as any}>
      {/* Header Banner */}
      <header className="modern-header" style={{ borderBottom: `2px solid ${colors.primary}` }}>
        <h1 className="modern-name" style={{ color: colors.primary }}>
          {data.personal.fullName || "Your Full Name"}
        </h1>
        <div className="modern-title">
          {data.personal.jobTitle || "Target Job Title"}
        </div>

        {/* Contact Links */}
        <div className="modern-contacts">
          {data.personal.email && (
            <span>
              <Mail size={12} style={{ color: colors.primary }} /> {data.personal.email}
            </span>
          )}
          {data.personal.phone && (
            <span>
              <Phone size={12} style={{ color: colors.primary }} /> {data.personal.phone}
            </span>
          )}
          {data.personal.location && (
            <span>
              <MapPin size={12} style={{ color: colors.primary }} /> {data.personal.location}
            </span>
          )}
          {data.personal.linkedin && (
            <span>
              <Globe size={12} style={{ color: colors.primary }} /> {data.personal.linkedin}
            </span>
          )}
          {data.personal.github && (
            <span>
              <ExternalLink size={12} style={{ color: colors.primary }} /> {data.personal.github}
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.personal.summary && (
        <section className="modern-section">
          <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
            Professional Summary
          </h2>
          <p className="modern-summary">{data.personal.summary}</p>
        </section>
      )}

      {/* Technical Skills */}
      {(data.skills.languages || data.skills.frameworks || data.skills.toolsAndDatabases) && (
        <section className="modern-section">
          <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
            Technical Skills
          </h2>
          <div className="modern-skills-grid">
            {data.skills.languages && (
              <div>
                <strong>Languages:</strong> <span>{data.skills.languages}</span>
              </div>
            )}
            {data.skills.frameworks && (
              <div>
                <strong>Frameworks & Libraries:</strong> <span>{data.skills.frameworks}</span>
              </div>
            )}
            {data.skills.toolsAndDatabases && (
              <div>
                <strong>Tools & Databases:</strong> <span>{data.skills.toolsAndDatabases}</span>
              </div>
            )}
            {data.skills.coreConcepts && (
              <div>
                <strong>Core Competencies:</strong> <span>{data.skills.coreConcepts}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {data.experience.length > 0 && (
        <section className="modern-section">
          <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
            Work Experience
          </h2>
          <div className="modern-items-list">
            {data.experience.map((exp) => (
              <article key={exp.id} className="modern-item">
                <div className="item-heading-row">
                  <div>
                    <strong className="item-title">{exp.role}</strong>
                    <span className="item-subtitle"> · {exp.company}</span>
                  </div>
                  <span className="item-dates">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate} | {exp.location}
                  </span>
                </div>
                <ul className="item-bullets">
                  {exp.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {data.projects.length > 0 && (
        <section className="modern-section">
          <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
            Featured Projects
          </h2>
          <div className="modern-items-list">
            {data.projects.map((proj) => (
              <article key={proj.id} className="modern-item">
                <div className="item-heading-row">
                  <div>
                    <strong className="item-title">{proj.title}</strong>
                    {proj.techStack && (
                      <span className="item-tech-stack"> | <em>{proj.techStack}</em></span>
                    )}
                  </div>
                  {proj.link && <span className="item-link">{proj.link}</span>}
                </div>
                <ul className="item-bullets">
                  {proj.bullets.filter(Boolean).map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications Split */}
      <div className="modern-two-col">
        {/* Education */}
        {data.education.length > 0 && (
          <section className="modern-section">
            <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="modern-edu-item">
                <div className="item-heading-row">
                  <strong className="item-title">{edu.degree} in {edu.field}</strong>
                  <span className="item-dates">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="item-subtitle">{edu.institution}, {edu.location}</div>
                {edu.grade && <div className="item-grade">{edu.grade}</div>}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section className="modern-section">
            <h2 className="modern-section-title" style={{ color: colors.primary, borderColor: colors.border }}>
              Certifications & Honors
            </h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="modern-cert-item">
                <div className="item-heading-row">
                  <strong className="item-title">{cert.name}</strong>
                  <span className="item-dates">{cert.date}</span>
                </div>
                <div className="item-subtitle">{cert.issuer}</div>
              </div>
            ))}
          </section>
        )}
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
}: {
  data: ResumeData;
  colors: { primary: string; light: string; border: string };
}) {
  return (
    <div className="resume-sheet template-classic">
      {/* Centered Clean Header */}
      <header className="classic-header">
        <h1 className="classic-name">{data.personal.fullName || "Your Full Name"}</h1>
        <div className="classic-contacts">
          {[
            data.personal.location,
            data.personal.phone,
            data.personal.email,
            data.personal.linkedin,
            data.personal.github,
          ]
            .filter(Boolean)
            .join("  |  ")}
        </div>
      </header>

      {/* Professional Summary */}
      {data.personal.summary && (
        <section className="classic-section">
          <h2 className="classic-section-title">SUMMARY</h2>
          <p className="classic-summary">{data.personal.summary}</p>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-section-title">EDUCATION</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="classic-item">
              <div className="classic-row">
                <strong>{edu.institution}</strong>
                <span>{edu.location}</span>
              </div>
              <div className="classic-row">
                <span>{edu.degree} in {edu.field} {edu.grade ? `(${edu.grade})` : ""}</span>
                <span>{edu.startDate} – {edu.endDate}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Technical Skills */}
      {(data.skills.languages || data.skills.frameworks || data.skills.toolsAndDatabases) && (
        <section className="classic-section">
          <h2 className="classic-section-title">TECHNICAL SKILLS</h2>
          <div className="classic-skills-list">
            {data.skills.languages && (
              <div><strong>Languages:</strong> {data.skills.languages}</div>
            )}
            {data.skills.frameworks && (
              <div><strong>Frameworks & Libraries:</strong> {data.skills.frameworks}</div>
            )}
            {data.skills.toolsAndDatabases && (
              <div><strong>Developer Tools & Databases:</strong> {data.skills.toolsAndDatabases}</div>
            )}
            {data.skills.coreConcepts && (
              <div><strong>Core Competencies:</strong> {data.skills.coreConcepts}</div>
            )}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-section-title">WORK EXPERIENCE</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="classic-item">
              <div className="classic-row">
                <strong>{exp.role}</strong>
                <span>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              <div className="classic-row">
                <em>{exp.company}</em>
                <span>{exp.location}</span>
              </div>
              <ul className="classic-bullets">
                {exp.bullets.filter(Boolean).map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-section-title">PROJECTS</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="classic-item">
              <div className="classic-row">
                <strong>{proj.title}</strong>
                {proj.link && <span>{proj.link}</span>}
              </div>
              {proj.techStack && (
                <div style={{ fontSize: "11px", color: "#475569", marginBottom: 3 }}>
                  <em>Technologies: {proj.techStack}</em>
                </div>
              )}
              <ul className="classic-bullets">
                {proj.bullets.filter(Boolean).map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section className="classic-section">
          <h2 className="classic-section-title">CERTIFICATIONS & ACHIEVEMENTS</h2>
          <ul className="classic-bullets">
            {data.certifications.map((cert) => (
              <li key={cert.id}>
                <strong>{cert.name}</strong> — {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* =========================================================================
   TEMPLATE 3: COMPACT STANFORD EXECUTIVE
   ========================================================================= */
function CompactStanfordTemplate({
  data,
  colors,
}: {
  data: ResumeData;
  colors: { primary: string; light: string; border: string };
}) {
  return (
    <div className="resume-sheet template-compact" style={{ "--primary": colors.primary } as any}>
      {/* Top Banner Header */}
      <header className="compact-header" style={{ borderLeft: `5px solid ${colors.primary}`, paddingLeft: 14 }}>
        <h1 className="compact-name" style={{ color: colors.primary }}>
          {data.personal.fullName || "Your Full Name"}
        </h1>
        <div className="compact-title">{data.personal.jobTitle || "Job Title"}</div>
        <div className="compact-contacts">
          {[
            data.personal.email,
            data.personal.phone,
            data.personal.location,
            data.personal.linkedin,
            data.personal.github,
          ]
            .filter(Boolean)
            .map((c, i) => (
              <span key={i} className="compact-pill" style={{ background: colors.light, color: colors.primary }}>
                {c}
              </span>
            ))}
        </div>
      </header>

      {/* Summary */}
      {data.personal.summary && (
        <section className="compact-section">
          <div className="compact-tag-header" style={{ color: colors.primary }}>
            ABOUT ME
          </div>
          <p className="compact-summary">{data.personal.summary}</p>
        </section>
      )}

      {/* Technical Skills */}
      {(data.skills.languages || data.skills.frameworks || data.skills.toolsAndDatabases) && (
        <section className="compact-section">
          <div className="compact-tag-header" style={{ color: colors.primary }}>
            SKILLS & EXPERTISE
          </div>
          <div className="compact-skills">
            {data.skills.languages && (
              <div><strong>Languages:</strong> {data.skills.languages}</div>
            )}
            {data.skills.frameworks && (
              <div><strong>Frameworks:</strong> {data.skills.frameworks}</div>
            )}
            {data.skills.toolsAndDatabases && (
              <div><strong>Tools & DBs:</strong> {data.skills.toolsAndDatabases}</div>
            )}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="compact-section">
          <div className="compact-tag-header" style={{ color: colors.primary }}>
            EXPERIENCE
          </div>
          {data.experience.map((exp) => (
            <div key={exp.id} className="compact-item">
              <div className="item-heading-row">
                <strong style={{ color: colors.primary }}>{exp.role}</strong>
                <span className="item-dates">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
              </div>
              <div className="item-subtitle">{exp.company} | {exp.location}</div>
              <ul className="item-bullets">
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="compact-section">
          <div className="compact-tag-header" style={{ color: colors.primary }}>
            KEY PROJECTS
          </div>
          {data.projects.map((proj) => (
            <div key={proj.id} className="compact-item">
              <div className="item-heading-row">
                <strong style={{ color: colors.primary }}>{proj.title}</strong>
                {proj.link && <span className="item-link">{proj.link}</span>}
              </div>
              {proj.techStack && (
                <div style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 4px" }}>
                  <em>Stack: {proj.techStack}</em>
                </div>
              )}
              <ul className="item-bullets">
                {proj.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="compact-section">
          <div className="compact-tag-header" style={{ color: colors.primary }}>
            EDUCATION
          </div>
          {data.education.map((edu) => (
            <div key={edu.id} className="compact-item">
              <div className="item-heading-row">
                <strong>{edu.degree} in {edu.field}</strong>
                <span className="item-dates">{edu.startDate} – {edu.endDate}</span>
              </div>
              <div className="item-subtitle">{edu.institution} {edu.grade ? `(${edu.grade})` : ""}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

