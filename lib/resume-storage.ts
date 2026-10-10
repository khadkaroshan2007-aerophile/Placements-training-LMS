import { getActiveUserScope } from "@/lib/user-progress-storage";
import {
  sampleResumeData,
  type ResumeAccentColor,
  type ResumeData,
  type ResumeTemplateId,
} from "./resume-data";

export function getResumeStorageKey(userId?: string | null): string {
  const uid = userId && userId.trim() ? userId.trim() : getActiveUserScope();
  return `placeprep_resume_data_${uid || "guest"}`;
}

export function saveResumeDraft(data: ResumeData, userId?: string | null) {
  if (typeof window === "undefined") return;
  try {
    const key = getResumeStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save resume draft", e);
  }
}

export function getStoredResumeDraft(userId?: string | null): ResumeData {
  if (typeof window === "undefined") return sampleResumeData;
  try {
    const key = getResumeStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return sampleResumeData;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && parsed.personal ? parsed : sampleResumeData;
  } catch {
    return sampleResumeData;
  }
}

export function getResumeSettingsStorageKey(userId?: string | null): string {
  const uid = userId && userId.trim() ? userId.trim() : getActiveUserScope();
  return `placeprep_resume_settings_${uid || "guest"}`;
}

export function saveResumeSettings(
  settings: { templateId: ResumeTemplateId; accentColor: ResumeAccentColor },
  userId?: string | null
) {
  if (typeof window === "undefined") return;
  try {
    const key = getResumeSettingsStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save resume settings", e);
  }
}

export function getStoredResumeSettings(userId?: string | null): {
  templateId: ResumeTemplateId;
  accentColor: ResumeAccentColor;
} {
  if (typeof window === "undefined") return { templateId: "modern", accentColor: "purple" };
  try {
    const key = getResumeSettingsStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return { templateId: "modern", accentColor: "purple" };
    return JSON.parse(raw);
  } catch {
    return { templateId: "modern", accentColor: "purple" };
  }
}

