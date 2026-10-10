import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { AUTH_COOKIE, getSessionUser } from "@/lib/auth";
import { emptyLearningState, parseLearningState } from "@/lib/backend/learning-progress";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

const maxRequestBytes = 64 * 1024;
const localStorePath = path.join(process.cwd(), ".data", "learning_progress.json");
let localWriteQueue: Promise<unknown> = Promise.resolve();

async function readLocalLearningStore(): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await readFile(localStorePath, "utf8")) as Record<string, unknown>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    return {};
  }
}

async function updateLocalLearningStore(update: (store: Record<string, unknown>) => void): Promise<void> {
  const operation = localWriteQueue.then(async () => {
    const store = await readLocalLearningStore();
    update(store);
    await mkdir(path.dirname(localStorePath), { recursive: true });
    const tempPath = `${localStorePath}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
    await writeFile(tempPath, JSON.stringify(store, null, 2), { mode: 0o600 });
    await rename(tempPath, localStorePath);
  });
  localWriteQueue = operation.catch(() => undefined);
  return operation;
}

export async function GET() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ configured: true, authenticated: false, state: null });
    const { data, error } = await supabase.from("learning_progress").select("state").eq("user_id", user.id).maybeSingle();
    if (error) {
      console.error("Learning data load failed", error.message);
      return NextResponse.json({ error: "Could not load saved learning progress." }, { status: 500 });
    }
    if (!data) return NextResponse.json({ configured: true, authenticated: true, hasSavedState: false, state: emptyLearningState });
    const state = parseLearningState(data.state);
    if (!state) {
      return NextResponse.json({ configured: true, authenticated: true, hasSavedState: false, state: emptyLearningState });
    }
    return NextResponse.json({ configured: true, authenticated: true, hasSavedState: true, state });
  }

  // Local session fallback
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return NextResponse.json({ configured: true, authenticated: false, state: null });
  const user = await getSessionUser(token);
  if (!user) return NextResponse.json({ configured: true, authenticated: false, state: null });

  const store = await readLocalLearningStore();
  const rawState = store[user.id];
  if (!rawState) {
    // Fresh user starts with pure zero state
    return NextResponse.json({ configured: true, authenticated: true, hasSavedState: false, state: emptyLearningState });
  }
  const state = parseLearningState(rawState);
  if (!state) {
    return NextResponse.json({ configured: true, authenticated: true, hasSavedState: false, state: emptyLearningState });
  }
  return NextResponse.json({ configured: true, authenticated: true, hasSavedState: true, state });
}

export async function PUT(request: Request) {
  let userId: string | null = null;
  let useSupabase = false;

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!authError && user) {
      userId = user.id;
      useSupabase = true;
    }
  } else {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (token) {
      const user = await getSessionUser(token);
      if (user) userId = user.id;
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "Sign in to save learning progress." }, { status: 401 });
  }

  try {
    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > maxRequestBytes) {
      return NextResponse.json({ error: "Learning progress data is too large." }, { status: 413 });
    }
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > maxRequestBytes) {
      return NextResponse.json({ error: "Learning progress data is too large." }, { status: 413 });
    }
    const state = parseLearningState(JSON.parse(body) as unknown);
    if (!state) {
      return NextResponse.json({ error: "Learning progress data is invalid." }, { status: 400 });
    }

    if (useSupabase) {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.from("learning_progress").upsert({ user_id: userId, state, updated_at: new Date().toISOString() });
      if (error) {
        console.error("Learning data save failed", error.message);
        return NextResponse.json({ error: "Could not save learning progress." }, { status: 500 });
      }
    } else {
      await updateLocalLearningStore((store) => {
        store[userId] = state;
      });
    }

    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: "Learning progress data is invalid." }, { status: 400 });
  }
}
