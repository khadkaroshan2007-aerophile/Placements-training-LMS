import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
    || "";

  if (!supabaseUrl && !supabaseKey) return null;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase configuration is incomplete. Set both NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(supabaseUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be HTTPS, or HTTP on a local loopback host.");
  }
  const isLoopbackHost = ["localhost", "127.0.0.1", "[::1]"].includes(parsedUrl.hostname);
  if ((parsedUrl.protocol !== "https:" && !(parsedUrl.protocol === "http:" && isLoopbackHost)) || parsedUrl.username || parsedUrl.password) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be HTTPS, or HTTP on a local loopback host.");
  }

  return { supabaseUrl, supabaseKey };
}

export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null;
}

export async function createSupabaseServerClient() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");

  const cookieStore = await cookies();
  return createServerClient(config.supabaseUrl, config.supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; route handlers and middleware can.
        }
      },
    },
  });
}
