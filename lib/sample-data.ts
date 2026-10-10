export type Skill = { name: string; score: number };
export type Course = { title: string; category: string; progress: number; lessons: string; tone: "purple" | "green" | "orange" };
export type Assessment = { title: string; detail: string; type: string; available: boolean };

export const student = {
  name: "Aarav", fullName: "Aarav Mehta", program: "Computer Science · Class of 2026",
  readiness: 72, readinessTrend: "↑ 8 pts this month", studyHours: 18.5,
  weeklyStudyHours: 4, weeklyGoalHours: 5, completedLessons: 24,
  lessonsTrend: "↑ 4 this week", streak: 6,
};
export const skills: Skill[] = [
  { name: "Data structures", score: 78 }, { name: "Aptitude", score: 64 },
  { name: "Communication", score: 82 }, { name: "Interview prep", score: 58 },
];
export const courses: Course[] = [
  { title: "Data Structures & Algorithms", category: "Technical · 32 lessons", progress: 68, lessons: "21 of 32 lessons", tone: "purple" },
  { title: "Quantitative Aptitude", category: "Aptitude · 24 lessons", progress: 42, lessons: "10 of 24 lessons", tone: "green" },
  { title: "Interview Communication", category: "Career skills · 18 lessons", progress: 35, lessons: "6 of 18 lessons", tone: "orange" },
];
export const assessments: Assessment[] = [
  { title: "Arrays & Strings checkpoint", detail: "5 questions · ~10 min", type: "Practice", available: true },
  { title: "Logical reasoning practice", detail: "4 questions · ~8 min", type: "Recommended", available: true },
  { title: "Mock interview: project walk-through", detail: "Practice · ~15 min", type: "Coming soon", available: false },
];
export const activity = [
  { title: "Completed: Two Pointers practice", time: "Today · 10:42 AM" },
  { title: "Scored 8/10 in Verbal Ability quiz", time: "Yesterday · 4:18 PM" },
  { title: "Finished 3 lessons in DSA Foundations", time: "Oct 6 · 6:05 PM" },
];

export type DashboardData = {
  student: {
    name: string;
    readiness: number;
    readinessTrend?: string;
    studyHours: number;
    weeklyStudyHours: number;
    weeklyGoalHours: number;
    completedLessons: number;
    lessonsTrend?: string;
    streak: number;
  };
  skills: Skill[];
  courses: Course[];
  assessments: Assessment[];
  activity: typeof activity;
  isSample: boolean;
};

export const sampleDashboard: DashboardData = {
  student,
  skills,
  courses,
  assessments,
  activity,
  isSample: true,
};

export function createFreshAccountDashboard(name: string): DashboardData {
  return {
    student: {
      name: name.trim().split(/\s+/)[0] || "there",
      readiness: 0,
      studyHours: 0,
      weeklyStudyHours: 0,
      weeklyGoalHours: 5,
      completedLessons: 0,
      streak: 0,
    },
    skills: skills.map(({ name: skillName }) => ({ name: skillName, score: 0 })),
    courses: [],
    assessments: [],
    activity: [],
    isSample: false,
  };
}
