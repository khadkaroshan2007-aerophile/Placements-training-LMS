import { cookies } from "next/headers";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, CalendarDays, Clock3, Flame, Target } from "lucide-react";
import { AUTH_COOKIE, getSessionUser } from "@/lib/auth";
import { createFreshAccountDashboard, sampleDashboard } from "@/lib/sample-data";
import { learningAssessments } from "@/lib/learning-data";
import { AppShell } from "@/components/app-shell";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AssessmentCard, CourseCard, EmptyState, ReadinessSummary, SkillProgress } from "@/components/dashboard-ui";

export default async function DashboardPage() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const demoAccount = token ? await getSessionUser(token) : null;
  const supabaseAccount = isSupabaseConfigured()
    ? await (async () => {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        return { id: user.id, name: typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : user.email?.split("@")[0] ?? "Student", email: user.email ?? "", avatarUrl: null };
      })()
    : null;
  const account = isSupabaseConfigured() ? supabaseAccount : demoAccount;
  const { student, skills, courses, assessments, activity, isSample } = createFreshAccountDashboard(account?.name ?? "Candidate");
  const weeklyGoal = Math.max(student.weeklyGoalHours, 0);
  const weeklyStudyHours = Math.max(student.weeklyStudyHours, 0);
  const weeklyGoalProgress = weeklyGoal > 0 ? Math.min(weeklyStudyHours / weeklyGoal * 100, 100) : 0;
  const todayLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", month: "long", day: "numeric", timeZone: "Asia/Kolkata" }).format(new Date());

  return <AppShell initialUser={account}><div className="content">
    <div className="welcome"><div><div className="eyebrow">YOUR LEARNING OVERVIEW</div><h1>Good morning, {student.name} <span aria-hidden="true">✦</span></h1><p>{isSample ? "You’re building momentum. Here’s your progress at a glance." : "Welcome to your learning space. Your progress starts here."}</p></div><div className="date-pill"><CalendarDays size={15} /> {todayLabel}</div></div>
    <div className="grid stats-grid">
      <Stat icon={<Target size={16} />} label="Placement readiness" value={`${student.readiness}%`} foot={isSample ? "Illustrative score · sample data" : "No learning data yet"} trend={student.readinessTrend} />
      <Stat icon={<BookOpen size={16} />} label="Learning progress" value={`${student.completedLessons}`} foot="Lessons completed across courses" trend={student.lessonsTrend} />
      <Stat icon={<Clock3 size={16} />} label="Study time" value={`${student.studyHours}h`} foot="Focused learning this week" />
      <Stat icon={<Flame size={16} />} label="Current streak" value={`${student.streak} days`} foot="A little progress adds up" />
    </div>
    <div className="grid main-grid">
      <section className="card section-card min-w-0"><div className="card-title-row"><div><h2>Your readiness snapshot</h2><p className="subtle">{isSample ? "An illustrative view based on sample activity" : "Your starting point; no activity has been recorded"}</p></div>{isSample && <span className="tag">SAMPLE DATA</span>}</div><div className="readiness"><ReadinessSummary readiness={student.readiness} isSample={isSample} href="/progress" /><div className="goal-bar"><span>Weekly learning goal</span><strong>{weeklyStudyHours} of {weeklyGoal} hours</strong><div className="bar" role="progressbar" aria-label="Weekly study goal" aria-valuemin={0} aria-valuemax={weeklyGoal} aria-valuenow={Math.min(weeklyStudyHours, weeklyGoal)}><i style={{ width: `${weeklyGoalProgress}%` }} /></div><small>{Math.max(weeklyGoal - weeklyStudyHours, 0)} {weeklyGoal - weeklyStudyHours === 1 ? "hour" : "hours"} to reach your goal</small></div></div><div className="skills">{skills.map((skill) => <SkillProgress skill={skill} key={skill.name} />)}</div></section>
      <section className="card section-card min-w-0"><div className="card-title-row"><div><h2>Recommended assessments</h2><p className="subtle">Keep your skills sharp with practice</p></div><Link href="/assessments" className="text-link">See all <ArrowRight size={12} /></Link></div><div className="assessment-list">{assessments.length ? assessments.map((item) => {
        const assessment = learningAssessments.find((candidate) => candidate.title === item.title);
        return <AssessmentCard assessment={item} href={assessment ? `/assessments/${assessment.id}` : undefined} key={item.title} />;
      }) : <EmptyState title="No assessments yet" description="Assessment recommendations will appear here when they’re available." />}</div></section>
    </div>
    <div className="card section-card" style={{ marginBottom: 18 }}><div className="card-title-row"><div><h2>Continue learning</h2><p className="subtle">Pick up where you left off</p></div><Link href="/courses" className="text-link">Browse courses <ArrowRight size={12} /></Link></div><div className="grid courses-grid" style={{ marginTop: 16, marginBottom: 0 }}>{courses.length ? courses.map((course) => <CourseCard course={course} key={course.title} />) : <EmptyState title="No enrolled courses yet" description="Course recommendations and lesson progress will appear here when you enroll." />}</div></div>
    <div className="grid activity">
      <section className="card section-card">
        <div className="card-title-row">
          <div>
            <h2>Timed Mock Tests (25 Mins)</h2>
            <p className="subtle">Simulate real placement exams with 20 questions across DSA, Aptitude, CS Core & HR</p>
          </div>
          <span className="tag" style={{ background: "#ede9fe", color: "#6d28d9" }}>20 QUESTIONS</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.6, margin: "10px 0 16px" }}>
          Practice under authentic placement exam conditions with live timers, question palettes, instant scorecards, and verified solutions.
        </p>
        <Link className="learning-button" href="/mock-tests" style={{ display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content" }}>
          Explore Mock Tests <ArrowRight size={13} />
        </Link>
      </section>
      <section className="card section-card next-step">
        <div className="eyebrow">MOCK INTERVIEW READY</div>
        <h2>Turn interview nerves into interview know-how</h2>
        <p>Try a realistic mock interview. Rehearse spoken answers with automated AI evaluations and second-person proctoring.</p>
        <Link className="step-button" href="/interview-coach">Explore interview coach <ArrowRight size={13} /></Link>
        <div className="sample-note">Real-time Gemini voice analysis & speech clarity evaluation enabled.</div>
      </section>
    </div>
    <p className="sample-note" style={{ textAlign: "center", marginTop: 19 }}>{isSample ? "Dashboard metrics and activity are illustrative sample data; no account, analytics, or saved progress is connected." : "This account has no saved course or assessment activity yet."}</p>
  </div></AppShell>;
}

function Stat({ icon, label, value, foot, trend }: { icon: ReactNode; label: string; value: string; foot: string; trend?: string }) {
  return <article className="card stat-card"><div className="stat-head"><span>{label}</span><span className="stat-icon">{icon}</span></div><div className="stat-value"><strong>{value}</strong>{trend && <span className="trend">{trend}</span>}</div><div className="stat-foot">{foot}</div></article>;
}
