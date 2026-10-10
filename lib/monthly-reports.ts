import { getActiveUserScope } from "@/lib/user-progress-storage";

export type MonthlyReport = {
  id: string; // e.g. "2026-09"
  monthName: string; // e.g. "September 2026"
  shortMonth: string; // e.g. "Sep '26"
  startDate: string; // e.g. "2026-09-01"
  endDate: string; // e.g. "2026-09-30"
  displayDateRange: string; // e.g. "Sep 01, 2026 – Sep 30, 2026"
  readinessScore: number; // e.g. 84%
  totalCorrectAnswers: number;
  totalQuestionsAttempted: number;
  accuracyRate: number; // percentage
  assessmentsCompleted: number;
  mockTestsCompleted: number;
  studyHours: number;
  lessonsCompleted: number;
  topicBreakdown: {
    dsaCorrect: number;
    dsaTotal: number;
    aptitudeCorrect: number;
    aptitudeTotal: number;
    logicalCorrect: number;
    logicalTotal: number;
    coreCsCorrect: number;
    coreCsTotal: number;
    hrCorrect: number;
    hrTotal: number;
  };
  keyHighlights: string[];
  growthInsight: string;
};

export const LEGACY_STORAGE_KEY = "placeprep_monthly_reports_v1";

// 12 Months of realistic historical monthly progress data (Oct 2025 - Sep 2026)
export const initialMonthlyArchive: MonthlyReport[] = [
  {
    id: "2026-09",
    monthName: "September 2026",
    shortMonth: "Sep '26",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    displayDateRange: "Sep 01, 2026 – Sep 30, 2026",
    readinessScore: 86,
    totalCorrectAnswers: 112,
    totalQuestionsAttempted: 130,
    accuracyRate: 86,
    assessmentsCompleted: 14,
    mockTestsCompleted: 3,
    studyHours: 28,
    lessonsCompleted: 18,
    topicBreakdown: {
      dsaCorrect: 34,
      dsaTotal: 38,
      aptitudeCorrect: 26,
      aptitudeTotal: 30,
      logicalCorrect: 20,
      logicalTotal: 22,
      coreCsCorrect: 18,
      coreCsTotal: 22,
      hrCorrect: 14,
      hrTotal: 18,
    },
    keyHighlights: [
      "Achieved 89% in Dynamic Programming & Graph BFS/DFS assessments",
      "Completed 2 Full-Length 25m Mocks with average score of 18/20",
      "Maintained 28 total hours of focused technical prep",
    ],
    growthInsight: "Advanced into Tier 1 corporate placement readiness; consistent strength in algorithms and modular arithmetic.",
  },
  {
    id: "2026-08",
    monthName: "August 2026",
    shortMonth: "Aug '26",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    displayDateRange: "Aug 01, 2026 – Aug 31, 2026",
    readinessScore: 82,
    totalCorrectAnswers: 98,
    totalQuestionsAttempted: 120,
    accuracyRate: 82,
    assessmentsCompleted: 12,
    mockTestsCompleted: 2,
    studyHours: 24,
    lessonsCompleted: 15,
    topicBreakdown: {
      dsaCorrect: 30,
      dsaTotal: 36,
      aptitudeCorrect: 22,
      aptitudeTotal: 28,
      logicalCorrect: 18,
      logicalTotal: 22,
      coreCsCorrect: 16,
      coreCsTotal: 20,
      hrCorrect: 12,
      hrTotal: 14,
    },
    keyHighlights: [
      "Mastered Two Pointers, Binary Search, and Sliding Window patterns",
      "Scored 85% on Quantitative Aptitude Time-Work-Distance drills",
      "First successful 25-minute mock test cleared under 21 minutes",
    ],
    growthInsight: "+6% improvement over previous month; significant acceleration in solving complex work-rate problems.",
  },
  {
    id: "2026-07",
    monthName: "July 2026",
    shortMonth: "Jul '26",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    displayDateRange: "Jul 01, 2026 – Jul 31, 2026",
    readinessScore: 78,
    totalCorrectAnswers: 86,
    totalQuestionsAttempted: 110,
    accuracyRate: 78,
    assessmentsCompleted: 11,
    mockTestsCompleted: 2,
    studyHours: 22,
    lessonsCompleted: 13,
    topicBreakdown: {
      dsaCorrect: 26,
      dsaTotal: 34,
      aptitudeCorrect: 20,
      aptitudeTotal: 26,
      logicalCorrect: 16,
      logicalTotal: 20,
      coreCsCorrect: 14,
      coreCsTotal: 18,
      hrCorrect: 10,
      hrTotal: 12,
    },
    keyHighlights: [
      "Consolidated Core CS fundamentals: ACID properties & OS concurrency",
      "Completed Arrays & Hash Tables Foundation and Intermediate tiers",
      "Formulated STAR storytelling stories for technical project interviews",
    ],
    growthInsight: "Crossed the 75% interview readiness threshold with solid foundational problem solving.",
  },
  {
    id: "2026-06",
    monthName: "June 2026",
    shortMonth: "Jun '26",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    displayDateRange: "Jun 01, 2026 – Jun 30, 2026",
    readinessScore: 74,
    totalCorrectAnswers: 74,
    totalQuestionsAttempted: 100,
    accuracyRate: 74,
    assessmentsCompleted: 10,
    mockTestsCompleted: 1,
    studyHours: 20,
    lessonsCompleted: 11,
    topicBreakdown: {
      dsaCorrect: 22,
      dsaTotal: 30,
      aptitudeCorrect: 18,
      aptitudeTotal: 24,
      logicalCorrect: 14,
      logicalTotal: 18,
      coreCsCorrect: 12,
      coreCsTotal: 16,
      hrCorrect: 8,
      hrTotal: 12,
    },
    keyHighlights: [
      "Solved 40+ LeetCode style questions across strings and arrays",
      "Passed Level 2 Intermediate Logical Reasoning assessments",
      "Rehearsed behavioral answers with Voice Interview Coach",
    ],
    growthInsight: "Steadily reduced unforced errors in unit digit cyclicity and off-by-one pointer index bounds.",
  },
  {
    id: "2026-05",
    monthName: "May 2026",
    shortMonth: "May '26",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    displayDateRange: "May 01, 2026 – May 31, 2026",
    readinessScore: 71,
    totalCorrectAnswers: 67,
    totalQuestionsAttempted: 95,
    accuracyRate: 71,
    assessmentsCompleted: 9,
    mockTestsCompleted: 1,
    studyHours: 19,
    lessonsCompleted: 10,
    topicBreakdown: {
      dsaCorrect: 20,
      dsaTotal: 28,
      aptitudeCorrect: 16,
      aptitudeTotal: 22,
      logicalCorrect: 13,
      logicalTotal: 18,
      coreCsCorrect: 11,
      coreCsTotal: 16,
      hrCorrect: 7,
      hrTotal: 11,
    },
    keyHighlights: [
      "Strengthened B+ Tree indexing & relational normalization understanding",
      "Reduced time per quantitative problem from 110s down to 80s",
      "Completed 10 lessons across Data Structures Foundations",
    ],
    growthInsight: "Solid baseline progress established; recommended focus on graph BFS/DFS and dynamic programming.",
  },
  {
    id: "2026-04",
    monthName: "April 2026",
    shortMonth: "Apr '26",
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    displayDateRange: "Apr 01, 2026 – Apr 30, 2026",
    readinessScore: 68,
    totalCorrectAnswers: 61,
    totalQuestionsAttempted: 90,
    accuracyRate: 68,
    assessmentsCompleted: 8,
    mockTestsCompleted: 1,
    studyHours: 18,
    lessonsCompleted: 9,
    topicBreakdown: {
      dsaCorrect: 18,
      dsaTotal: 26,
      aptitudeCorrect: 14,
      aptitudeTotal: 22,
      logicalCorrect: 12,
      logicalTotal: 18,
      coreCsCorrect: 10,
      coreCsTotal: 14,
      hrCorrect: 7,
      hrTotal: 10,
    },
    keyHighlights: [
      "Mastered decimal multipliers and compound percentage formulas",
      "Practiced in-place array partitioning and two-sum hash map lookup",
    ],
    growthInsight: "Demonstrated strong grasp of foundational math and Big-O asymptotic analysis.",
  },
  {
    id: "2026-03",
    monthName: "March 2026",
    shortMonth: "Mar '26",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    displayDateRange: "Mar 01, 2026 – Mar 31, 2026",
    readinessScore: 65,
    totalCorrectAnswers: 55,
    totalQuestionsAttempted: 85,
    accuracyRate: 65,
    assessmentsCompleted: 8,
    mockTestsCompleted: 1,
    studyHours: 16,
    lessonsCompleted: 8,
    topicBreakdown: {
      dsaCorrect: 16,
      dsaTotal: 24,
      aptitudeCorrect: 13,
      aptitudeTotal: 20,
      logicalCorrect: 11,
      logicalTotal: 18,
      coreCsCorrect: 9,
      coreCsTotal: 13,
      hrCorrect: 6,
      hrTotal: 10,
    },
    keyHighlights: [
      "Completed Syllogisms & Venn diagram deductive reasoning tests",
      "Reviewed Operating System virtual memory paging and TLB mechanics",
    ],
    growthInsight: "Consistent participation across technical and aptitude practice sets.",
  },
  {
    id: "2026-02",
    monthName: "February 2026",
    shortMonth: "Feb '26",
    startDate: "2026-02-01",
    endDate: "2026-02-28",
    displayDateRange: "Feb 01, 2026 – Feb 28, 2026",
    readinessScore: 61,
    totalCorrectAnswers: 49,
    totalQuestionsAttempted: 80,
    accuracyRate: 61,
    assessmentsCompleted: 7,
    mockTestsCompleted: 1,
    studyHours: 15,
    lessonsCompleted: 7,
    topicBreakdown: {
      dsaCorrect: 14,
      dsaTotal: 22,
      aptitudeCorrect: 12,
      aptitudeTotal: 20,
      logicalCorrect: 10,
      logicalTotal: 16,
      coreCsCorrect: 8,
      coreCsTotal: 12,
      hrCorrect: 5,
      hrTotal: 10,
    },
    keyHighlights: [
      "Completed Foundation assessments in Arrays and Strings",
      "Practiced Elevator pitch delivery and self-introduction scripts",
    ],
    growthInsight: "Building fundamental muscle memory for campus recruitment aptitude tests.",
  },
  {
    id: "2026-01",
    monthName: "January 2026",
    shortMonth: "Jan '26",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    displayDateRange: "Jan 01, 2026 – Jan 31, 2026",
    readinessScore: 58,
    totalCorrectAnswers: 43,
    totalQuestionsAttempted: 75,
    accuracyRate: 58,
    assessmentsCompleted: 6,
    mockTestsCompleted: 0,
    studyHours: 14,
    lessonsCompleted: 6,
    topicBreakdown: {
      dsaCorrect: 12,
      dsaTotal: 20,
      aptitudeCorrect: 11,
      aptitudeTotal: 18,
      logicalCorrect: 9,
      logicalTotal: 16,
      coreCsCorrect: 7,
      coreCsTotal: 12,
      hrCorrect: 4,
      hrTotal: 9,
    },
    keyHighlights: [
      "Kickstarted structured placement preparation roadmap",
      "Completed first assessment checkpoint on time complexity",
    ],
    growthInsight: "Initial diagnostics completed; roadmap configured for technical interview skills.",
  },
  {
    id: "2025-12",
    monthName: "December 2025",
    shortMonth: "Dec '25",
    startDate: "2025-12-01",
    endDate: "2025-12-31",
    displayDateRange: "Dec 01, 2025 – Dec 31, 2025",
    readinessScore: 54,
    totalCorrectAnswers: 38,
    totalQuestionsAttempted: 70,
    accuracyRate: 54,
    assessmentsCompleted: 5,
    mockTestsCompleted: 0,
    studyHours: 12,
    lessonsCompleted: 5,
    topicBreakdown: {
      dsaCorrect: 11,
      dsaTotal: 20,
      aptitudeCorrect: 9,
      aptitudeTotal: 18,
      logicalCorrect: 8,
      logicalTotal: 14,
      coreCsCorrect: 6,
      coreCsTotal: 10,
      hrCorrect: 4,
      hrTotal: 8,
    },
    keyHighlights: [
      "Enrolled in Data Structures and Quantitative Aptitude foundational tracks",
      "Reviewed basic recursion and pointer manipulation",
    ],
    growthInsight: "Foundational exposure to computer science interview patterns.",
  },
  {
    id: "2025-11",
    monthName: "November 2025",
    shortMonth: "Nov '25",
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    displayDateRange: "Nov 01, 2025 – Nov 30, 2025",
    readinessScore: 50,
    totalCorrectAnswers: 32,
    totalQuestionsAttempted: 65,
    accuracyRate: 50,
    assessmentsCompleted: 4,
    mockTestsCompleted: 0,
    studyHours: 10,
    lessonsCompleted: 4,
    topicBreakdown: {
      dsaCorrect: 9,
      dsaTotal: 18,
      aptitudeCorrect: 8,
      aptitudeTotal: 16,
      logicalCorrect: 7,
      logicalTotal: 14,
      coreCsCorrect: 5,
      coreCsTotal: 10,
      hrCorrect: 3,
      hrTotal: 7,
    },
    keyHighlights: [
      "Completed initial aptitude assessments on percentages and sequences",
      "Set up target goal of 5 hours weekly study time",
    ],
    growthInsight: "Beginning stages of technical readiness; starting curve established.",
  },
  {
    id: "2025-10",
    monthName: "October 2025",
    shortMonth: "Oct '25",
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    displayDateRange: "Oct 01, 2025 – Oct 31, 2025",
    readinessScore: 45,
    totalCorrectAnswers: 25,
    totalQuestionsAttempted: 55,
    accuracyRate: 45,
    assessmentsCompleted: 3,
    mockTestsCompleted: 0,
    studyHours: 8,
    lessonsCompleted: 3,
    topicBreakdown: {
      dsaCorrect: 7,
      dsaTotal: 16,
      aptitudeCorrect: 6,
      aptitudeTotal: 14,
      logicalCorrect: 5,
      logicalTotal: 12,
      coreCsCorrect: 4,
      coreCsTotal: 8,
      hrCorrect: 3,
      hrTotal: 5,
    },
    keyHighlights: [
      "First month of placement preparation onboarding",
      "Identified baseline strengths in logical reasoning and algebra",
    ],
    growthInsight: "Initial diagnostic baseline score (45%).",
  },
];

export function getMonthlyReportsStorageKey(userId?: string | null): string {
  const uid = userId && userId.trim() ? userId.trim() : getActiveUserScope();
  return uid ? `placeprep_monthly_reports_${uid}` : "placeprep_monthly_reports_guest";
}

export function getStoredMonthlyReports(userId?: string | null): MonthlyReport[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getMonthlyReportsStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Clean 0 reports for fresh user
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadSampleHistoricalArchive(userId?: string | null): MonthlyReport[] {
  if (typeof window === "undefined") return initialMonthlyArchive;
  try {
    const key = getMonthlyReportsStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(initialMonthlyArchive));
  } catch (e) {
    console.error("Could not load sample historical archive", e);
  }
  return initialMonthlyArchive;
}

export function clearMonthlyArchive(userId?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const key = getMonthlyReportsStorageKey(userId);
    localStorage.removeItem(key);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch (e) {
    console.error("Could not clear monthly archive", e);
  }
}

export function saveMonthlyReport(report: MonthlyReport, userId?: string | null) {
  if (typeof window === "undefined") return;
  try {
    const key = getMonthlyReportsStorageKey(userId);
    const current = getStoredMonthlyReports(userId);
    const updated = [report, ...current.filter((r) => r.id !== report.id)];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save monthly report", e);
  }
}

export function archiveCurrentMonthProgress(
  currentCorrect: number,
  currentTotal: number,
  assessmentCount: number,
  mockCount: number,
  studyHours: number,
  lessonsCount: number,
  userId?: string | null
): MonthlyReport {
  const now = new Date();
  const year = now.getFullYear();
  const monthNum = String(now.getMonth() + 1).padStart(2, "0");
  const monthName = now.toLocaleString("default", { month: "long" }) + " " + year;
  const shortMonth = now.toLocaleString("default", { month: "short" }) + " '" + String(year).slice(-2);
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  const startDate = `${year}-${monthNum}-01`;
  const endDate = `${year}-${monthNum}-${String(lastDay).padStart(2, "0")}`;
  const displayDateRange = `${now.toLocaleString("default", { month: "short" })} 01, ${year} – ${now.toLocaleString("default", { month: "short" })} ${lastDay}, ${year}`;

  const accuracy = currentTotal > 0 ? Math.round((currentCorrect / currentTotal) * 100) : 75;

  const newReport: MonthlyReport = {
    id: `${year}-${monthNum}`,
    monthName,
    shortMonth,
    startDate,
    endDate,
    displayDateRange,
    readinessScore: accuracy,
    totalCorrectAnswers: currentCorrect,
    totalQuestionsAttempted: currentTotal,
    accuracyRate: accuracy,
    assessmentsCompleted: assessmentCount,
    mockTestsCompleted: mockCount,
    studyHours: studyHours || 20,
    lessonsCompleted: lessonsCount || 12,
    topicBreakdown: {
      dsaCorrect: Math.round(currentCorrect * 0.35),
      dsaTotal: Math.round(currentTotal * 0.35) || 1,
      aptitudeCorrect: Math.round(currentCorrect * 0.25),
      aptitudeTotal: Math.round(currentTotal * 0.25) || 1,
      logicalCorrect: Math.round(currentCorrect * 0.20),
      logicalTotal: Math.round(currentTotal * 0.20) || 1,
      coreCsCorrect: Math.round(currentCorrect * 0.12),
      coreCsTotal: Math.round(currentTotal * 0.12) || 1,
      hrCorrect: Math.round(currentCorrect * 0.08),
      hrTotal: Math.round(currentTotal * 0.08) || 1,
    },
    keyHighlights: [
      `Recorded ${currentCorrect} verified correct answers in assessments & mock exams`,
      `Completed ${assessmentCount} assessment checkpoints and ${mockCount} timed mock exams`,
      `Maintained active learning streak across technical and aptitude tracks`,
    ],
    growthInsight: `Monthly cycle closed with ${accuracy}% accuracy rating across overall topics.`,
  };

  saveMonthlyReport(newReport, userId);
  return newReport;
}

