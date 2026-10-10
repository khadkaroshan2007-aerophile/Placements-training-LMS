import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_SESSION_LIFETIME_SECONDS, authenticateAccount, createSession } from "@/lib/auth";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";
    if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
      const name = typeof data.user.user_metadata.full_name === "string" ? data.user.user_metadata.full_name : email.split("@")[0];
      return NextResponse.json({ user: { id: data.user.id, name, email: data.user.email ?? email, avatarUrl: null } });
    }
    const user = await authenticateAccount(email, password);
    if (!user) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    const session = await createSession(user.id);
    const response = NextResponse.json({ user });
    response.cookies.set(AUTH_COOKIE, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_SESSION_LIFETIME_SECONDS,
      expires: new Date(session.expiresAt),
    });
    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ error: "Could not sign in. Please try again." }, { status: 500 });
  }
}
