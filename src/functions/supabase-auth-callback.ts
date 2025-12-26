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

    const { user } = data;

    if (user?.email) {
      // Kita abaikan hasilnya (silent fail) agar login tetap jalan walau insert gagal
      await supabase.from("subscribers").insert({
        email: user.email.toLowerCase(),
        name: user.user_metadata?.full_name ?? "Subscriber",
      });
    }

    if (user?.id) {
      const generatedUsername = 'user_' + user.id.substring(0, 8);
      await supabase.from("user_profiles").upsert({
        id: user.id,
        username: generatedUsername,
        avatar_url: user.user_metadata?.avatar_url ?? null,
      });
    }

    const responseHeaders = new Headers();
    responseHeaders.set("Location", `${url.origin}/`); 

    return new Response(null, { status: 302, headers: responseHeaders });
  } catch (err: unknown) {
    console.error("Callback fatal error:", err);
    return Response.redirect(`${url.origin}/subscribe?error=server_error`, 302);
  }
}