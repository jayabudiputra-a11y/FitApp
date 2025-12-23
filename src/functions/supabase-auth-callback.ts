import { createClient } from "@supabase/supabase-js";

/**
 * =====================================================
 * ENV
 * =====================================================
 */
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables."
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

/**
 * =====================================================
 * HANDLER
 * =====================================================
 */
export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Code missing", { status: 400 });
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), { status: 401 });
    }

    // 1. INSERT TO SUBSCRIBERS
    if (data.user?.email) {
      const { error: subError } = await supabase
        .from("subscribers")
        .upsert({
          email: data.user.email,
          name: data.user.user_metadata?.full_name ?? "Anonymous",
          is_active: true,
        }, { onConflict: "email" });

      if (subError) console.warn("Subscriber upsert skipped:", subError.message);
    }

    // 2. ENSURE USER_PROFILES EXISTS (Inisialisasi Username)
    // Ini memastikan user_profiles row terbentuk dengan default username
    if (data.user?.id) {
      const generatedUsername = 'user_' + data.user.id.substring(0, 8);
      
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert({
          id: data.user.id,
          username: generatedUsername,
          avatar_url: data.user.user_metadata?.avatar_url ?? null,
        }, { onConflict: "id" });

      if (profileError) console.warn("Profile upsert skipped:", profileError.message);
    }

    // 3. REDIRECT
    const headers = new Headers();
    const { access_token, refresh_token, expires_in } = data.session;

    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + expires_in);

    headers.append(
      "Set-Cookie",
      `supabase-access-token=${access_token}; Path=/; Expires=${expirationTime.toUTCString()}; HttpOnly; Secure; SameSite=Lax`
    );
    
    // Redirect ke halaman artikel atau dashboard
    headers.set("Location", "/articles"); 

    return new Response(null, { status: 302, headers });
  } catch (err) {
    console.error("Auth callback error:", err);
    return new Response("Server Error", { status: 500 });
  }
}