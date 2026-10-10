import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, BrainCircuit, ClipboardCheck, Code2, MessageCircle } from "lucide-react";
import type { Assessment, Course, Skill } from "@/lib/sample-data";

function boundedPercent(value: number) {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

export function CourseCard({ course, href }: { course: Course; href?: string }) {
  const Icon = course.tone === "green" ? BrainCircuit : course.tone === "orange" ? MessageCircle : Code2;
  const progress = boundedPercent(course.progress);
  const content = <>
    <div className="course-ui-top">
      <span className={`course-icon ${course.tone}`} aria-hidden="true"><Icon size={18} /></span>
      <span className="tag">IN PROGRESS</span>
    </div>
    <h3>{course.title}</h3>
    <p className="course-ui-category">{course.category}</p>
    <div className="course-ui-progress-head"><span>{course.lessons}</span><b>{progress}%</b></div>
    <div className="course-ui-progress" role="progressbar" aria-label={`${course.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
      <span style={{ width: `${progress}%` }} />
    </div>
    {href && <span className="course-ui-action">Continue course <ArrowRight size={13} /></span>}
  </>;

  return <article className={`card course-ui-card${href ? " is-linked" : ""}`}>
    {href ? <Link className="course-ui-link" href={href}>{content}</Link> : content}
  </article>;
}

export function AssessmentCard({ assessment, href }: { assessment: Assessment; href?: string }) {
  const actionHref = assessment.available ? href : undefined;
  const content = <>
    <span className="assessment-ui-icon" aria-hidden="true"><ClipboardCheck size={16} /></span>
    <span className="assessment-ui-body">
      <strong>{assessment.title}</strong>
      <small>{assessment.detail}</small>
    </span>
    <span className={`tag ${assessment.available ? "" : "soon"}`}>{assessment.type}</span>
    {actionHref && <span className="assessment-ui-action">Open assessment <ArrowRight size={13} /></span>}
  </>;

  return <article className="assessment-ui-card">
    {actionHref ? <Link className="assessment-ui-link" href={actionHref}>{content}</Link> : content}
  </article>;
}

export function SkillProgress({ skill }: { skill: Skill }) {
  const score = boundedPercent(skill.score);

  return <div className="skill-ui-row">
    <span className="skill-ui-name">{skill.name}</span>
    <div className="skill-ui-track" role="progressbar" aria-label={`${skill.name} skill progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}>
      <span style={{ width: `${score}%` }} />
    </div>
    <span className="skill-ui-score">{score}</span>
  </div>;
}

export function ReadinessSummary({
  readiness,
  isSample,
  href,
}: {
  readiness: number;
  isSample: boolean;
  href?: string;
}) {
  const score = boundedPercent(readiness);
  const title = isSample ? "You’re building a strong foundation" : "Your readiness starts at zero";
  const description = isSample
    ? "Your communication skills are a bright spot. A bit more interview practice could help round out your preparation."
    : "Complete learning activities to build your placement-readiness profile.";

  return <div className="readiness-ui">
    <div className="readiness-ui-ring" role="progressbar" aria-label="Placement readiness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} style={{ "--readiness-pct": `${score}%` } as CSSProperties}>
      <span><strong>{score}</strong><small>OUT OF 100</small></span>
    </div>
    <div className="readiness-ui-copy">
      <h3>{title}</h3>
      <p>{description}</p>
      {href && <Link href={href} className="text-link">View skill breakdown <ArrowRight size={13} /></Link>}
    </div>
  </div>;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return <div className="dashboard-empty-state" role="status">
    <strong>{title}</strong>
    <p>{description}</p>
    {actionHref && actionLabel && <Link className="text-link" href={actionHref}>{actionLabel} <ArrowRight size={13} /></Link>}
  </div>;
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return <div className="dashboard-loading-state" role="status" aria-live="polite" aria-busy="true">
    <span className="dashboard-loading-spinner" aria-hidden="true" />
    <span>{label}…</span>
  </div>;
}
