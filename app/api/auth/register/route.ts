import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_SESSION_LIFETIME_SECONDS, createSession, registerAccount } from "@/lib/auth";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string; email?: string; password?: string };
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";
    if (name.length < 2 || name.length > 80) return NextResponse.json({ error: "Enter a name between 2 and 80 characters." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    if (password.length < 8 || password.length > 128) return NextResponse.json({ error: "Use a password between 8 and 128 characters." }, { status: 400 });

    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
      if (error) return NextResponse.json({ error: error.message }, { status: error.status === 400 ? 409 : 400 });
      if (!data.user) return NextResponse.json({ error: "Supabase did not return an account. Please try again." }, { status: 400 });
      return NextResponse.json({ user: { id: data.user.id, name, email: data.user.email ?? email, avatarUrl: null }, confirmationRequired: !data.session });
    }

    const user = await registerAccount(name, email, password);
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
    if (error instanceof Error && error.message.includes("already exists")) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("Account registration failed", error);
    return NextResponse.json({ error: "Could not create your account. Please try again." }, { status: 500 });
  }
}
