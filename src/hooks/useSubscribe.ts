import { useMutation } from '@tanstack/react-query'
import { subscribersApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const RATE_LIMIT_KEY = 'fitapp_sub_attempts';
const MAX_ATTEMPTS = 4;

const checkLocalLimit = () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  let data = stored ? JSON.parse(stored) : { date: today, count: 0 };
  
  if (data.date !== today) {
    data = { date: today, count: 0 };
  }
  
  return { allowed: data.count < MAX_ATTEMPTS, data };
};

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const limit = checkLocalLimit();
      if (!limit.allowed) {
        throw new Error("LOCAL_LIMIT_REACHED");
      }

      try {
        await subscribersApi.insertIfNotExists(email, 'Subscriber');
      } catch (dbError: any) {
        console.warn('DB Insert skipped:', dbError.message);
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/articles`,
        }
      });

      if (error) {
        throw error;
      }

      const updated = { ...limit.data, count: limit.data.count + 1 };
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(updated));
    },
    onSuccess: () => {
      toast.success('Link Login Terkirim!', {
        description: 'Silakan cek email Anda untuk masuk.'
      });
    },
    onError: (error: any) => {
      if (error.status === 429 || error.message?.includes('rate limit')) {
        toast.error('Sistem Sedang Sibuk', {
          description: 'Keamanan server aktif. Silakan tunggu 30 detik lalu coba lagi.'
        });
        return;
      }

      if (error.message === "LOCAL_LIMIT_REACHED") {
        toast.error('Jatah Harian Habis', {
          description: 'Anda sudah mencoba 4 kali hari ini. Silakan coba lagi besok.'
        });
        return;
      }

      toast.error('Terjadi Kesalahan', {
        description: error.message || 'Gagal mengirim permintaan subscribe.'
      });
    },
  })
}