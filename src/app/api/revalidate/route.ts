import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/*
 * Refreshes every page right after content is changed in /admin.
 *
 * Who may call it: a signed-in label admin. The caller sends their Supabase
 * session token (Authorization: Bearer <access token>); we ask Supabase, as
 * that user, whether they are a portal admin (public.portal_is_admin()).
 * No extra secret to configure. Optionally, REVALIDATE_SECRET (if set in
 * Vercel) also works as `x-revalidate-secret` for scripts and webhooks.
 *
 * Even without calling this, pages refresh on their own within 60 seconds.
 */

export const dynamic = "force-dynamic";

async function isAdmin(token: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !token) return false;
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await supabase.rpc("portal_is_admin");
  return !error && data === true;
}

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = req.headers.get("x-revalidate-secret");
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";

  const allowed = (secret && given && given === secret) || (await isAdmin(token));
  if (!allowed) {
    return NextResponse.json({ revalidated: false, error: "Not allowed" }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
