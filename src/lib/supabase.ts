import { createClient } from "@supabase/supabase-js";

/* ======================
    CORE ENGINE OBFUSCATOR
   ====================== */
const _0xsys = [
  "VITE_SUPABASE_URL", 
  "VITE_SUPABASE_ANON_KEY",
  "persistSession",
  "autoRefreshToken",
  "detectSessionInUrl"
] as const;

// Accessor dinamis untuk konfigurasi
const _s = (i: number) => _0xsys[i] as string;

// Mengambil environment variables menggunakan key yang diabstraksi
const _u = import.meta.env[_s(0)];
const _k = import.meta.env[_s(1)];

/**
 * Inisialisasi Client dengan Obfuscated Config
 * Mengekspor instans 'supabase' yang akan digunakan oleh api.ts
 */
export const supabase = createClient(
  _u || "", 
  _k || "", 
  {
    auth: {
      [_s(2)]: true,      // persistSession
      [_s(3)]: true,      // autoRefreshToken
      [_s(4)]: true,      // detectSessionInUrl
    }
  }
);