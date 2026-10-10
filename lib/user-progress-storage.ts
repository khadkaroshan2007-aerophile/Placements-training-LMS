import { emptyLearningState, type LearningState } from "@/lib/backend/learning-progress";

const ACTIVE_USER_KEY = "placeprep_active_user_id";

/**
 * Returns the currently active user ID in browser local storage.
 * Defaults to "guest" if not authenticated.
 */
export function getActiveUserScope(): string {
  if (typeof window === "undefined") return "guest";
  try {
    return localStorage.getItem(ACTIVE_USER_KEY) || "guest";
  } catch {
    return "guest";
  }
}

/**
 * Sets or clears the active user ID in browser local storage.
 */
export function setActiveUserScope(userId: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (userId && userId.trim()) {
      localStorage.setItem(ACTIVE_USER_KEY, userId.trim());
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Wipes all residual and guest progress data from browser localStorage.
 * Ensures an incoming account or freshly created user never inherits legacy/guest data.
 */
export function clearAllResidualAndGuestData(): void {
  if (typeof window === "undefined") return;
  try {
    // Legacy un-scoped keys
    localStorage.removeItem("placeprep_monthly_reports_v1");
    localStorage.removeItem("placeprep-mock-results-v1");
    localStorage.removeItem("placeprep-learning-v1");

    // Guest scoped keys
    localStorage.removeItem("placeprep_monthly_reports_guest");
    localStorage.removeItem("placeprep_mock_results_guest");
    localStorage.removeItem("placeprep_learning_guest");
  } catch (e) {
    console.error("Could not clear residual guest data", e);
  }
}

/**
 * Initializes a brand-new user account with pure zero-state storage.
 * Guarantees zero previous reports, zero mock attempts, and zero lessons completed.
 */
export function initFreshUserProgress(userId: string): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    clearAllResidualAndGuestData();
    setActiveUserScope(userId);

    const reportsKey = `placeprep_monthly_reports_${userId}`;
    const mocksKey = `placeprep_mock_results_${userId}`;
    const learningKey = `placeprep_learning_${userId}`;

    // Explicitly initialize pure zero arrays & state
    localStorage.setItem(reportsKey, JSON.stringify([]));
    localStorage.setItem(mocksKey, JSON.stringify([]));
    localStorage.setItem(learningKey, JSON.stringify(emptyLearningState));
  } catch (e) {
    console.error("Could not initialize fresh user progress", e);
  }
}

