import { supabase } from "@/lib/supabase";
import type { AuthUser } from "../types"; // Pastikan path types benar

export const authApi = {
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return (user as AuthUser) ?? null;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};