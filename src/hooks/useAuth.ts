import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { authApi } from "@/lib/api";
import type { AuthUser } from "@/types";

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Menggunakan authApi yang sudah diobfuscate
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("[AUTH_SYNC_ERROR]:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listener untuk perubahan session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user as AuthUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Konsisten menggunakan authApi untuk logout
      await authApi.signOut();
      setUser(null);
    } catch (error) {
      console.error("[SIGNOUT_ERROR]:", error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
  };
};