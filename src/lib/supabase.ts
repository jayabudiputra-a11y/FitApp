import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || "", 
  supabaseAnonKey || "", 
  {
    auth: {
      persistSession: true,      // WAJIB TRUE: Agar user tetap login saat refresh
      autoRefreshToken: true,    // WAJIB TRUE: Agar login tidak expired tiap jam
      detectSessionInUrl: true,  // WAJIB TRUE: Agar klik link dari email otomatis login
    }
  }
);