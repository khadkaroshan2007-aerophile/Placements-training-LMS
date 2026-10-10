"use client";

import { useEffect, useState } from "react";
import { emptyLearningState, parseLearningState, type LearningState } from "@/lib/backend/learning-progress";
import { getActiveUserScope } from "@/lib/user-progress-storage";

export type { LearningState, QuizResult } from "@/lib/backend/learning-progress";
const emptyState = emptyLearningState;

function getStorageKey(): string {
  const uid = getActiveUserScope();
  return uid ? `placeprep_learning_${uid}` : "placeprep_learning_guest";
}

export function useLearningState() {
  const [state, setState] = useState<LearningState>(emptyState);
  const [ready, setReady] = useState(false);
  const [serverSync, setServerSync] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    void Promise.resolve().then(() => {
      try {
        const key = getStorageKey();
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = parseLearningState(JSON.parse(saved) as unknown);
          if (parsed) setState(parsed);
          else {
            localStorage.removeItem(key);
            setSyncError("Saved browser progress was invalid and has been reset.");
          }
        } else {
          // Fresh zero state
          setState(emptyState);
        }
      } catch (error) {
        setState(emptyState);
        setSyncError(error instanceof Error ? error.message : "Could not load saved browser progress.");
      } finally {
        setReady(true);
      }
    });
  }, []);

  useEffect(() => {
    void fetch("/api/learning").then(async (response) => {
      const result = await response.json() as { authenticated?: boolean; state?: Partial<LearningState> | null; hasSavedState?: boolean };
      if (!response.ok) throw new Error("Could not load account progress. Local progress is still available in this browser.");
      if (result.authenticated) {
        if (result.hasSavedState && result.state) {
          setState({ ...emptyState, ...result.state });
        } else {
          // Fresh user starting at 0
          setState(emptyState);
          try {
            localStorage.setItem(getStorageKey(), JSON.stringify(emptyState));
          } catch {}
        }
      }
      setSyncEnabled(Boolean(result.authenticated));
    }).catch((error: unknown) => setSyncError(error instanceof Error ? error.message : "Could not load account progress."))
      .finally(() => setServerSync(true));
  }, []);

  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(getStorageKey(), JSON.stringify(state)); }
      catch (error) { console.error("Could not save learning progress in this browser", error); }
    }
  }, [ready, state]);

  useEffect(() => {
    if (!ready || !serverSync || !syncEnabled) return;
    void fetch("/api/learning", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state) })
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json() as { error?: string };
          throw new Error(body.error ?? "Could not sync your learning progress.");
        }
        setSyncError("");
      }).catch((error: unknown) => setSyncError(error instanceof Error ? error.message : "Could not sync your learning progress."));
  }, [ready, serverSync, state, syncEnabled]);

  return { state, setState, ready, syncEnabled, syncError };
}
