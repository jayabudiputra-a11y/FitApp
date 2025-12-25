import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { subscribersApi } from "@/lib/api";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    const handleAuth = async () => {
      if (processed.current) return;
      processed.current = true;

      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (!code) {
          navigate("/");
          return;
        }

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data.session) {
          toast.error("Sesi telah kadaluarsa atau tidak valid.");
          navigate("/");
          return;
        }

        const user = data.user;

        if (user?.email) {
          await subscribersApi.insertIfNotExists(
            user.email,
            'Subscriber'
          );
        }

        toast.success("Konfirmasi Berhasil!", {
          description: "Selamat bergabung di Fitapp."
        });

        navigate("/");
      } catch (err) {
        console.error("Callback error:", err);
        navigate("/");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg font-bold text-black dark:text-white uppercase tracking-tighter">Memverifikasi...</p>
        <p className="text-xs text-neutral-500 uppercase tracking-widest">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}