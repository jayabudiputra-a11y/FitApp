import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase Environment Variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return Response.redirect(`${url.origin}/subscribe?error=missing_code`, 302);
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      return Response.redirect(`${url.origin}/subscribe?error=auth_failed`, 302);
    }

    const { user, session } = data;

    // 1. SYNC SUBSCRIBERS
    if (user?.email) {
      await supabase.from("subscribers").upsert({
        email: user.email,
        name: user.user_metadata?.full_name ?? "Subscriber",
        is_active: true,
      }, { onConflict: "email" });
    }

    // 2. SYNC USER_PROFILES
    if (user?.id) {
      const generatedUsername = 'user_' + user.id.substring(0, 8);
      await supabase.from("user_profiles").upsert({
        id: user.id,
        username: generatedUsername,
        avatar_url: user.user_metadata?.avatar_url ?? null,
      }, { onConflict: "id" });
    }

    // 3. SET COOKIE & REDIRECT
    const responseHeaders = new Headers();
    const cookieOptions = `Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${session.expires_in}`;
    
    responseHeaders.append("Set-Cookie", `sb-access-token=${session.access_token}; ${cookieOptions}`);
    responseHeaders.append("Set-Cookie", `sb-refresh-token=${session.refresh_token}; ${cookieOptions}`);
    
    // Redirect ke Home agar user langsung melihat status login
    responseHeaders.set("Location", "/"); 

    return new Response(null, { status: 302, headers: responseHeaders });
  } catch (err) {
    console.error("Callback error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}