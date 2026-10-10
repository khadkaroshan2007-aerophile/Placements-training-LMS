export type FacultyMaterial = {
  id: string;
  title: string;
  category: "DSA & Coding" | "Aptitude & Math" | "Core CS" | "HR & Soft Skills" | "Company Past Papers";
  type: "PDF Guide" | "Code Sheet" | "Formula Bank" | "Question Bank" | "Rubric";
  description: string;
  topic: string;
  targetBatch: string;
  dateAdded: string;
  fileSize: string;
  downloadsCount: number;
  externalLink?: string;
  contentSummary: string[];
};

export type StudentRecord = {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  batch: string;
  readinessScore: number;
  totalCorrectAnswers: number;
  totalQuestionsAttempted: number;
  assessmentsCompleted: number;
  mockTestsCompleted: number;
  studyHours: number;
  streakDays: number;
  status: "Tier-1 Ready" | "On Track" | "Needs Attention";
  weakestTopic: string;
  strongestTopic: string;
  lastActive: string;
};

export type AssignedTest = {
  id: string;
  title: string;
  batch: string;
  topic: string;
  questionCount: number;
  timeLimitMinutes: number;
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
  avgScore: number;
  status: "Active" | "Scheduled" | "Completed";
};

export const defaultTeachingMaterials: FacultyMaterial[] = [
  {
    id: "mat-dsa-75",
    title: "Blind 75 & SDE Core Algorithms Problem Sheet",
    category: "DSA & Coding",
    type: "Code Sheet",
    description: "Curated 75 indispensable coding problems categorized by pattern: Sliding Window, Two Pointers, Trees DFS/BFS, and Dynamic Programming.",
    topic: "Data Structures & Algorithms",
    targetBatch: "All Final Year Batches",
    dateAdded: "Oct 04, 2026",
    fileSize: "1.8 MB",
    downloadsCount: 142,
    externalLink: "https://github.com/khadkaroshan2007-aerophile/Placements-training-LMS",
    contentSummary: [
      "15 Array & Hash Map Two-Sum to Subarray Sum patterns",
      "12 Binary Tree LCA & Level Order Traversals with dry-runs",
      "18 Graph Topological Sort & Shortest Path algorithms",
      "15 DP memoization to tabulation step-by-step templates",
      "15 String parsing and Trie prefix tree implementations",
    ],
  },
  {
    id: "mat-apt-formula",
    title: "Quantitative Aptitude 100 Speed-Math Formula Cheatsheet",
    category: "Aptitude & Math",
    type: "Formula Bank",
    description: "Master quick shortcuts for Time & Work, Speed-Distance, Profit & Loss, Modular Arithmetic, and Permutations & Combinations.",
    topic: "Quantitative Aptitude",
    targetBatch: "CSE & IT Class of 2026",
    dateAdded: "Oct 02, 2026",
    fileSize: "1.2 MB",
    downloadsCount: 189,
    contentSummary: [
      "Unit digit calculation and cyclicity tables (2, 3, 7, 8)",
      "Relative speed formulas for trains and river streams",
      "Pipes & cisterns inverse work equation shortcuts",
      "Compound interest difference formula for 2 & 3 years: D = P(R/100)²",
      "Probability Bayes' theorem and conditional distribution guide",
    ],
  },
  {
    id: "mat-cs-core",
    title: "Core CS Interview Rapid Revision Guide (DBMS, OS, Networks)",
    category: "Core CS",
    type: "PDF Guide",
    description: "High-yield summary covering ACID transactions, indexing B+ trees, process synchronization (Mutex/Semaphore), and OSI 7 layers.",
    topic: "Core Computer Science",
    targetBatch: "CSE Class of 2026 - Sections A & B",
    dateAdded: "Sep 28, 2026",
    fileSize: "2.4 MB",
    downloadsCount: 215,
    contentSummary: [
      "Database Normalization forms (1NF, 2NF, 3NF, BCNF) with anomaly examples",
      "Deadlock 4 Coffman conditions and Banker's Algorithm walkthrough",
      "Virtual Memory paging, TLB hit rates, and LRU page replacement",
      "TCP 3-way handshake vs UDP header differences and congestion control",
    ],
  },
  {
    id: "mat-hr-star",
    title: "STAR Framework Behavioral Interview Rubric & Sample Scripts",
    category: "HR & Soft Skills",
    type: "Rubric",
    description: "Grading rubric and recommended storytelling frameworks for leadership, conflict resolution, failure recovery, and career aspirations.",
    topic: "Career & HR Skills",
    targetBatch: "All Placement Candidates",
    dateAdded: "Sep 22, 2026",
    fileSize: "950 KB",
    downloadsCount: 167,
    contentSummary: [
      "Situation-Task-Action-Result sentence stems for fresh graduates",
      "Faculty grading criteria: Articulation (25%), Impact Metrics (35%), Ownership (40%)",
      "Top 10 common pitfalls in 'Tell me about yourself' responses",
      "Salary negotiation and company preference ethical guidelines",
    ],
  },
  {
    id: "mat-tcs-nqt",
    title: "Tier-1 Tech Companies Past Campus Placement Test Papers",
    category: "Company Past Papers",
    type: "Question Bank",
    description: "Actual memory-based questions and patterns from recent online assessment rounds (Amazon, TCS Digital, Infosys SP, Cognizant GenC).",
    topic: "Full-Length Practice",
    targetBatch: "All Final Year Batches",
    dateAdded: "Sep 15, 2026",
    fileSize: "3.1 MB",
    downloadsCount: 298,
    contentSummary: [
      "Amazon SDE Online Assessment 2024-2025 coding questions with test cases",
      "TCS NQT Advanced Quantitative and Reasoning sectional benchmarks",
      "Infosys Specialist Programmer graph & grid traversal problems",
      "Wipro Elite automated cognitive aptitude drill sets",
    ],
  },
];

export const defaultStudentRecords: StudentRecord[] = [
  {
    id: "std-01",
    rollNo: "22CSE014",
    name: "Aarav Mehta",
    email: "aarav.mehta@college.edu",
    batch: "CSE - Section A",
    readinessScore: 88,
    totalCorrectAnswers: 142,
    totalQuestionsAttempted: 160,
    assessmentsCompleted: 15,
    mockTestsCompleted: 4,
    studyHours: 32,
    streakDays: 8,
    status: "Tier-1 Ready",
    weakestTopic: "System Design Basics",
    strongestTopic: "Dynamic Programming & Trees",
    lastActive: "Today",
  },
  {
    id: "std-02",
    rollNo: "22CSE029",
    name: "Priya Sharma",
    email: "priya.sharma@college.edu",
    batch: "CSE - Section A",
    readinessScore: 84,
    totalCorrectAnswers: 126,
    totalQuestionsAttempted: 145,
    assessmentsCompleted: 13,
    mockTestsCompleted: 3,
    studyHours: 27,
    streakDays: 6,
    status: "Tier-1 Ready",
    weakestTopic: "Work-Rate Math",
    strongestTopic: "DBMS & SQL Normalization",
    lastActive: "Today",
  },
  {
    id: "std-03",
    rollNo: "22CSE045",
    name: "Rohan Varma",
    email: "rohan.varma@college.edu",
    batch: "CSE - Section A",
    readinessScore: 72,
    totalCorrectAnswers: 98,
    totalQuestionsAttempted: 135,
    assessmentsCompleted: 10,
    mockTestsCompleted: 2,
    studyHours: 19,
    streakDays: 4,
    status: "On Track",
    weakestTopic: "Graph BFS/DFS",
    strongestTopic: "Quantitative Aptitude",
    lastActive: "Yesterday",
  },
  {
    id: "std-04",
    rollNo: "22CSE052",
    name: "Ananya Iyer",
    email: "ananya.iyer@college.edu",
    batch: "CSE - Section A",
    readinessScore: 78,
    totalCorrectAnswers: 110,
    totalQuestionsAttempted: 140,
    assessmentsCompleted: 12,
    mockTestsCompleted: 3,
    studyHours: 23,
    streakDays: 5,
    status: "On Track",
    weakestTopic: "Operating Systems Paging",
    strongestTopic: "Two Pointers & Binary Search",
    lastActive: "Today",
  },
  {
    id: "std-05",
    rollNo: "22CSE061",
    name: "Kabir Das",
    email: "kabir.das@college.edu",
    batch: "CSE - Section A",
    readinessScore: 48,
    totalCorrectAnswers: 44,
    totalQuestionsAttempted: 92,
    assessmentsCompleted: 5,
    mockTestsCompleted: 1,
    studyHours: 9,
    streakDays: 0,
    status: "Needs Attention",
    weakestTopic: "Data Structures & Recursion",
    strongestTopic: "HR Communication",
    lastActive: "3 days ago",
  },
  {
    id: "std-06",
    rollNo: "22CSE078",
    name: "Sneha Patil",
    email: "sneha.patil@college.edu",
    batch: "CSE - Section B",
    readinessScore: 82,
    totalCorrectAnswers: 122,
    totalQuestionsAttempted: 148,
    assessmentsCompleted: 13,
    mockTestsCompleted: 3,
    studyHours: 26,
    streakDays: 7,
    status: "Tier-1 Ready",
    weakestTopic: "Probability & Permutations",
    strongestTopic: "Core Java & OOPs",
    lastActive: "Today",
  },
  {
    id: "std-07",
    rollNo: "22CSE089",
    name: "Dev Malhotra",
    email: "dev.malhotra@college.edu",
    batch: "CSE - Section B",
    readinessScore: 54,
    totalCorrectAnswers: 58,
    totalQuestionsAttempted: 108,
    assessmentsCompleted: 6,
    mockTestsCompleted: 1,
    studyHours: 11,
    streakDays: 1,
    status: "Needs Attention",
    weakestTopic: "Dynamic Programming",
    strongestTopic: "Logical Deduction",
    lastActive: "2 days ago",
  },
  {
    id: "std-08",
    rollNo: "22IT012",
    name: "Tanvi Kulkarni",
    email: "tanvi.k@college.edu",
    batch: "IT - Section A",
    readinessScore: 90,
    totalCorrectAnswers: 154,
    totalQuestionsAttempted: 170,
    assessmentsCompleted: 16,
    mockTestsCompleted: 5,
    studyHours: 35,
    streakDays: 12,
    status: "Tier-1 Ready",
    weakestTopic: "OS Deadlocks",
    strongestTopic: "Competitive Coding & Trees",
    lastActive: "Today",
  },
];

export const defaultAssignedTests: AssignedTest[] = [
  {
    id: "test-wk-01",
    title: "Weekly Mandatory Assessment: Dynamic Programming & Binary Trees",
    batch: "CSE - Section A",
    topic: "Data Structures & Algorithms",
    questionCount: 15,
    timeLimitMinutes: 25,
    dueDate: "Oct 15, 2026",
    submissionsCount: 48,
    totalStudents: 62,
    avgScore: 78,
    status: "Active",
  },
  {
    id: "test-wk-02",
    title: "Campus Mock Exam 1: 20 Questions Timed Speed-Math & Reasoning",
    batch: "All Batches",
    topic: "Quantitative & Logical Aptitude",
    questionCount: 20,
    timeLimitMinutes: 25,
    dueDate: "Oct 18, 2026",
    submissionsCount: 112,
    totalStudents: 174,
    avgScore: 71,
    status: "Active",
  },
  {
    id: "test-wk-03",
    title: "Core CS Diagnostic: DBMS Transactions, Locks & Normalization",
    batch: "CSE - Section B",
    topic: "Core Computer Science",
    questionCount: 15,
    timeLimitMinutes: 20,
    dueDate: "Oct 20, 2026",
    submissionsCount: 0,
    totalStudents: 58,
    avgScore: 0,
    status: "Scheduled",
  },
];

const STORAGE_MATERIALS_KEY = "placeprep_faculty_materials_v1";

export function getStoredFacultyMaterials(): FacultyMaterial[] {
  if (typeof window === "undefined") return defaultTeachingMaterials;
  try {
    const raw = localStorage.getItem(STORAGE_MATERIALS_KEY);
    if (!raw) return defaultTeachingMaterials;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultTeachingMaterials;
  } catch {
    return defaultTeachingMaterials;
  }
}

export function saveFacultyMaterial(mat: FacultyMaterial) {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredFacultyMaterials();
    const updated = [mat, ...current.filter((m) => m.id !== mat.id)];
    localStorage.setItem(STORAGE_MATERIALS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save faculty material", e);
  }
}

export function deleteFacultyMaterial(id: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredFacultyMaterials();
    const updated = current.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_MATERIALS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to delete faculty material", e);
  }
}
