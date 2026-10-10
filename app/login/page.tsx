"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpenCheck, Sparkles } from "lucide-react";
import { clearAllResidualAndGuestData, initFreshUserProgress, setActiveUserScope } from "@/lib/user-progress-storage";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">(searchParams.get("mode") === "signup" ? "register" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode === "register" ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json() as { error?: string; user?: { id: string; name: string; email: string }; confirmationRequired?: boolean };
      if (!response.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      if (result.confirmationRequired) {
        setError("Account created. Check your email to confirm it, then sign in.");
        setMode("login");
        return;
      }

      // Guarantee pure zero state for fresh registered account
      if (mode === "register") {
        clearAllResidualAndGuestData();
        if (result.user?.id) {
          initFreshUserProgress(result.user.id);
        }
      } else if (result.user?.id) {
        setActiveUserScope(result.user.id);
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="auth-page">
    <Link href="/" className="auth-back"><ArrowLeft size={15} /> Back to home</Link>
    <section className="auth-card">
      <Link href="/" className="brand auth-brand"><span className="brand-mark"><Sparkles size={18} /></span><span>PlacePrep AI</span></Link>
      <div className="auth-heading"><span className="auth-icon"><BookOpenCheck size={20} /></span><div className="eyebrow">YOUR CAREER, IN FOCUS</div><h1>{mode === "register" ? "Create your account" : "Welcome back"}</h1><p>{mode === "register" ? "Start a fresh account and make your next step count." : "Sign in to continue your placement journey."}</p></div>
      <div className="auth-tabs" role="tablist" aria-label="Account access"><button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "selected" : ""} onClick={() => { setMode("login"); setError(""); }}>Sign in</button><button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "selected" : ""} onClick={() => { setMode("register"); setError(""); }}>Create account</button></div>
      <form className="auth-form" onSubmit={submit}>
        {mode === "register" && <label>Full name<input autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>}
        <label>Email address<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
        <label>Password<input type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={mode === "register" ? 8 : undefined} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "register" ? "At least 8 characters" : "Your password"} /></label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}<ArrowRight size={16} /></button>
      </form>
      <p className="auth-security">Your password is securely hashed before it is saved.</p>
    </section>
    <p className="auth-footer">A focused space for learning and career readiness</p>
  </main>;
}

export default function LoginPage() {
  return <Suspense><AuthForm /></Suspense>;
}
