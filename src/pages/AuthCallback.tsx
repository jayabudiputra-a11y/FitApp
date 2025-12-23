import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { subscribersApi } from "@/lib/api";
import { toast } from "sonner"; // Bisa diganti alert jika tidak pakai sonner

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Ambil code dari URL
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (!code) {
          throw new Error("Authorization code not found in URL");
        }

        console.log("🔑 Processing Magic Link...");

        // Tukar code menjadi session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data.session) {
          console.error("❌ Auth error:", error);
          toast.error("Login failed. Please try again.");
          navigate("/subscribe");
          return;
        }

        const user = data.user;

        console.log("✅ Auth successful:", user?.email);

        // Masukkan user ke tabel subscribers jika belum ada
        if (user?.email) {
          await subscribersApi.insertIfNotExists(
            user.email,
            user.user_metadata?.full_name || null
          );
        }

        toast.success("Logged in successfully!");

        // Redirect ke halaman utama
        navigate("/");
      } catch (err: unknown) {
        console.error("❌ Auth callback error:", err);
        toast.error("An error occurred during login.");
        navigate("/subscribe");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Confirming your email…</p>
        <p className="text-sm text-gray-500">You will be redirected shortly.</p>
      </div>
    </div>
  );
}
