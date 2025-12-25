import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log sederhana untuk memastikan variabel tidak undefined di browser
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase Env missing!");
}

export const supabase = createClient(
  supabaseUrl || "", 
  supabaseAnonKey || "", 
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'fitapp-auth-token',
    },
    // KITA PAKSA MASUKKAN KE GLOBAL HEADERS
    // Ini adalah 'obat' untuk error "No API key found" di endpoint /auth
    global: {
      headers: {
        'apikey': supabaseAnonKey || "",
        'Authorization': `Bearer ${supabaseAnonKey || ""}`
      }
    }
  }
);