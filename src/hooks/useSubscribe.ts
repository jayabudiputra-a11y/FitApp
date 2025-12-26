import { useMutation } from '@tanstack/react-query'
import { subscribersApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const LIMIT_KEY = 'fitapp_v1_limit';

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // 1. Rate Limit Lokal (4x per jam)
      const now = Date.now();
      const storage = JSON.parse(localStorage.getItem(LIMIT_KEY) || '[]');
      const recentAttempts = storage.filter((ts: number) => now - ts < 3600000);

      if (recentAttempts.length >= 4) {
        throw new Error('LIMIT_LOKAL');
      }

      // 2. Clean up Session
      localStorage.removeItem('fitapp-auth-token');
      await supabase.auth.signOut().catch(() => {});

      // 3. Simpan ke Database Subscribers
      await subscribersApi.insertIfNotExists(email, 'Subscriber');

      // 4. Request OTP
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      // 5. Handle Server Rate Limit (429)
      if (authError) {
        if (authError.status === 429 || authError.message.toLowerCase().includes('rate limit')) {
          return { status: 'pending' };
        }
        throw authError;
      }

      // Record success
      recentAttempts.push(now);
      localStorage.setItem(LIMIT_KEY, JSON.stringify(recentAttempts));
      return { status: 'success' };
    },
    onSuccess: (res) => {
      if (res?.status === 'pending') {
        toast.info('Pendaftaran Diterima', {
          description: 'Data sudah masuk. Jika email konfirmasi belum ada, mohon tunggu 60 detik.'
        });
        return;
      }

      // PESAN AWAL ANDA
      toast.success('Pendaftaran Berhasil!', {
        description: 'Silakan cek kotak masuk email Anda untuk konfirmasi.'
      });
    },
    onError: (error: any) => {
      if (error.message === 'LIMIT_LOKAL') {
        toast.warning('Batas Tercapai', {
          description: 'Maksimal 4 kali pendaftaran per jam. Silakan coba lagi nanti.'
        });
        return;
      }
      toast.error('Gagal', { 
        description: error.message || 'Terjadi kesalahan sistem.' 
      });
    },
  })
}