import { learningAssessments, learningCourses } from "@/lib/learning-data";

export type QuizResult = {
  id: string;
  title: string;
  score: number;
  total: number;
  date: string;
  answers: number[];
};

export type LearningState = {
  enrolled: string[];
  progress: Record<string, number>;
  results: QuizResult[];
};

export const emptyLearningState: LearningState = {
  enrolled: [],
  progress: {},
  results: [],
};

const coursesById = new Map(learningCourses.map((course) => [course.id, course]));
const assessmentsById = new Map(learningAssessments.map((assessment) => [assessment.id, assessment]));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseLearningState(value: unknown): LearningState | null {
  if (!isRecord(value) || !Array.isArray(value.enrolled) || !isRecord(value.progress) || !Array.isArray(value.results)) return null;

  if (value.enrolled.length > coursesById.size) return null;
  const enrolledIds: string[] = [];
  for (const id of value.enrolled) {
    if (typeof id !== "string" || !coursesById.has(id) || enrolledIds.includes(id)) return null;
    enrolledIds.push(id);
  }

  const enrolled = new Set(enrolledIds);
  const progress: Record<string, number> = {};
  for (const [id, progressValue] of Object.entries(value.progress)) {
    const course = coursesById.get(id);
    if (!course || !enrolled.has(id) || typeof progressValue !== "number" || !Number.isInteger(progressValue) || progressValue < 0 || progressValue > 100) return null;
    const completedLessons = Math.round(progressValue * course.lessons / 100);
    if (Math.round(completedLessons / course.lessons * 100) !== progressValue) return null;
    progress[id] = progressValue;
  }

  if (value.results.length > assessmentsById.size) return null;
  const resultIds = new Set<string>();
  const results: QuizResult[] = [];

  for (const item of value.results) {
    if (!isRecord(item) || typeof item.id !== "string") return null;
    const assessment = assessmentsById.get(item.id);
    if (!assessment || resultIds.has(item.id)) return null;
    if (
      item.title !== assessment.title
      || item.total !== assessment.questions.length
      || typeof item.score !== "number"
      || !Number.isInteger(item.score)
      || item.score < 0
      || item.score > assessment.questions.length
      || !Array.isArray(item.answers)
      || item.answers.length !== assessment.questions.length
      || typeof item.date !== "string"
      || !Number.isFinite(Date.parse(item.date))
    ) return null;

    const answers: number[] = [];
    for (const [index, answer] of item.answers.entries()) {
      if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 0 || answer >= assessment.questions[index].options.length) return null;
      answers.push(answer);
    }

    const calculatedScore = assessment.questions.reduce((score, question, index) => score + (answers[index] === question.answer ? 1 : 0), 0);
    if (item.score !== calculatedScore) return null;

    resultIds.add(item.id);
    results.push({
      id: item.id,
      title: assessment.title,
      score: item.score,
      total: assessment.questions.length,
      date: item.date,
      answers,
    });
  }

  return {
    enrolled: enrolledIds,
    progress,
    results,
  };
}
