import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type PublicUser = { id: string; name: string; email: string; avatarUrl: string | null };
type Account = Omit<PublicUser, "avatarUrl"> & { avatarUrl?: string | null; passwordHash: string; createdAt: string };
type Session = { tokenHash: string; userId: string; expiresAt: number };
type AuthStore = { accounts: Account[]; sessions: Session[] };

const storePath = path.join(process.cwd(), ".data", "auth.json");
const sessionLifetime = 30 * 24 * 60 * 60 * 1000;
let writeQueue: Promise<unknown> = Promise.resolve();

async function readStore(): Promise<AuthStore> {
  try {
    return JSON.parse(await readFile(storePath, "utf8")) as AuthStore;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { accounts: [], sessions: [] };
    throw error;
  }
}

async function updateStore<T>(update: (store: AuthStore) => T | Promise<T>): Promise<T> {
  const operation = writeQueue.then(async () => {
    const store = await readStore();
    const result = await update(store);
    await mkdir(path.dirname(storePath), { recursive: true });
    const tempPath = `${storePath}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
    await writeFile(tempPath, JSON.stringify(store, null, 2), { mode: 0o600 });
    await rename(tempPath, storePath);
    return result;
  });
  writeQueue = operation.catch(() => undefined);
  return operation;
}

function passwordDigest(password: string, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) return false;
  const expected = Buffer.from(digest, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function toPublicUser(account: Account): PublicUser {
  return { id: account.id, name: account.name, email: account.email, avatarUrl: account.avatarUrl ?? null };
}

export async function registerAccount(name: string, email: string, password: string) {
  return updateStore((store) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (store.accounts.some((account) => account.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }
    const user: Account = {
      id: randomBytes(16).toString("hex"),
      name: name.trim(),
      email: normalizedEmail,
      avatarUrl: null,
      passwordHash: passwordDigest(password),
      createdAt: new Date().toISOString(),
    };
    store.accounts.push(user);
    return toPublicUser(user);
  });
}

export async function authenticateAccount(email: string, password: string) {
  const store = await readStore();
  const account = store.accounts.find((item) => item.email === email.trim().toLowerCase());
  if (!account || !verifyPassword(password, account.passwordHash)) return null;
  return toPublicUser(account);
}

export async function updateAccountProfile(userId: string, profile: { name: string; email: string; avatarUrl: string | null }) {
  return updateStore((store) => {
    const account = store.accounts.find((item) => item.id === userId);
    if (!account) return null;
    const normalizedEmail = profile.email.trim().toLowerCase();
    if (store.accounts.some((item) => item.id !== userId && item.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }
    account.name = profile.name.trim();
    account.email = normalizedEmail;
    account.avatarUrl = profile.avatarUrl;
    return toPublicUser(account);
  });
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = Date.now() + sessionLifetime;
  await updateStore((store) => {
    store.sessions = store.sessions.filter((session) => session.expiresAt > Date.now());
    store.sessions.push({ tokenHash: hashSessionToken(token), userId, expiresAt });
  });
  return { token, expiresAt };
}

export async function getSessionUser(token: string): Promise<PublicUser | null> {
  const store = await readStore();
  const session = store.sessions.find((item) => item.tokenHash === hashSessionToken(token) && item.expiresAt > Date.now());
  const account = session && store.accounts.find((item) => item.id === session.userId);
  return account ? toPublicUser(account) : null;
}

export async function deleteSession(token: string) {
  const tokenHash = hashSessionToken(token);
  await updateStore((store) => {
    store.sessions = store.sessions.filter((item) => item.tokenHash !== tokenHash);
  });
}

export const AUTH_COOKIE = "placeprep_session";
export const AUTH_SESSION_LIFETIME_SECONDS = sessionLifetime / 1000;
