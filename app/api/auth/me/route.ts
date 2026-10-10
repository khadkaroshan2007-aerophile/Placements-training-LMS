import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, getSessionUser, updateAccountProfile } from "@/lib/auth";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

const maxAvatarBytes = 2 * 1024 * 1024;
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function isValidAvatar(value: string): boolean {
  const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) return false;
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length === 0 || bytes.length > maxAvatarBytes || bytes.toString("base64") !== match[2]) return false;
  if (match[1] === "png") return bytes.length >= pngSignature.length && bytes.subarray(0, pngSignature.length).equals(pngSignature);
  if (match[1] === "jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  return bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
}

export async function GET() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const name = typeof user?.user_metadata.full_name === "string" ? user.user_metadata.full_name : user?.email?.split("@")[0];
    return NextResponse.json({ user: user && name ? { id: user.id, name, email: user.email ?? "", avatarUrl: user.user_metadata.avatar_url ?? null } : null });
  }
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return NextResponse.json({ user: null });
  return NextResponse.json({ user: await getSessionUser(token) });
}

export async function PATCH(request: Request) {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in to edit your profile." }, { status: 401 });
    try {
      const body = await request.json() as { name?: unknown; email?: unknown };
      const name = typeof body.name === "string" ? body.name.trim() : "";
      const email = typeof body.email === "string" ? body.email.trim() : "";
      if (name.length < 2 || name.length > 80) return NextResponse.json({ error: "Enter a name between 2 and 80 characters." }, { status: 400 });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
      const { data, error } = await supabase.auth.updateUser({ email, data: { ...user.user_metadata, full_name: name } });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ user: { id: user.id, name, email: data.user.email ?? email, avatarUrl: user.user_metadata.avatar_url ?? null } });
    } catch {
      return NextResponse.json({ error: "Could not update your profile. Please try again." }, { status: 400 });
    }
  }
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const currentUser = token ? await getSessionUser(token) : null;
  if (!currentUser) return NextResponse.json({ error: "Sign in to edit your profile." }, { status: 401 });

  try {
    const body = await request.json() as { name?: unknown; email?: unknown; avatarUrl?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (name.length < 2 || name.length > 80) return NextResponse.json({ error: "Enter a name between 2 and 80 characters." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

    let avatarUrl = currentUser.avatarUrl;
    if (body.avatarUrl === null) avatarUrl = null;
    else if (typeof body.avatarUrl === "string" && isValidAvatar(body.avatarUrl)) avatarUrl = body.avatarUrl;
    else if (body.avatarUrl !== undefined) return NextResponse.json({ error: "Choose a PNG, JPEG, or WebP image under 2 MB." }, { status: 400 });

    const user = await updateAccountProfile(currentUser.id, { name, email, avatarUrl });
    if (!user) return NextResponse.json({ error: "Your session has expired. Sign in again." }, { status: 401 });
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) return NextResponse.json({ error: error.message }, { status: 409 });
    return NextResponse.json({ error: "Could not update your profile. Please try again." }, { status: 400 });
  }
}
