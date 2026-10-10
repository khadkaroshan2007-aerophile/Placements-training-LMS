import { getActiveUserScope } from "@/lib/user-progress-storage";
import type { SupportedLanguage } from "./coding-problems-data";

export interface CodeSubmission {
  id: string;
  problemId: string;
  language: SupportedLanguage;
  code: string;
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded" | "Compile Error";
  passedTests: number;
  totalTests: number;
  runtimeMs: number;
  memoryMb: number;
  timestamp: string;
}

export function getCodeDraftStorageKey(problemId: string, language: SupportedLanguage, userId?: string | null): string {
  const uid = userId && userId.trim() ? userId.trim() : getActiveUserScope();
  return `placeprep_code_draft_${uid || "guest"}_${problemId}_${language}`;
}

export function saveCodeDraft(problemId: string, language: SupportedLanguage, code: string, userId?: string | null) {
  if (typeof window === "undefined") return;
  try {
    const key = getCodeDraftStorageKey(problemId, language, userId);
    localStorage.setItem(key, code);
  } catch (e) {
    console.error("Failed to save code draft", e);
  }
}

export function getCodeDraft(problemId: string, language: SupportedLanguage, userId?: string | null): string | null {
  if (typeof window === "undefined") return null;
  try {
    const key = getCodeDraftStorageKey(problemId, language, userId);
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getSubmissionsStorageKey(userId?: string | null): string {
  const uid = userId && userId.trim() ? userId.trim() : getActiveUserScope();
  return `placeprep_code_submissions_${uid || "guest"}`;
}

export function getStoredSubmissions(userId?: string | null): CodeSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const key = getSubmissionsStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCodeSubmission(submission: CodeSubmission, userId?: string | null) {
  if (typeof window === "undefined") return;
  try {
    const key = getSubmissionsStorageKey(userId);
    const current = getStoredSubmissions(userId);
    const updated = [submission, ...current.slice(0, 100)];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save code submission", e);
  }
}

export function getSolvedProblemIds(userId?: string | null): string[] {
  const subs = getStoredSubmissions(userId);
  const solved = new Set<string>();
  subs.forEach((sub) => {
    if (sub.status === "Accepted") {
      solved.add(sub.problemId);
    }
  });
  return Array.from(solved);
}

