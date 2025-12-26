import { useMutation } from '@tanstack/react-query'
import { subscribersApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // --- PENGAMAN MANDIRI (4x per jam) ---
      const now = Date.now();
      const storageKey = `attempts_${email}`;
      const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Filter hanya percobaan dalam 1 jam terakhir
      const recentAttempts = data.filter((ts: number) => now - ts < 3600000);

      if (recentAttempts.length >= 4) {
        throw new Error('LIMIT_LOKAL');
      }
      // -------------------------------------

      // 1. Simpan ke database (ini biasanya tidak kena rate limit)
      await subscribersApi.insertIfNotExists(email, 'Subscriber');

      // 2. Kirim OTP (ini yang sering memicu error 429)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) throw error;

      // Catat sukses untuk hitungan limit
      recentAttempts.push(now);
      localStorage.setItem(storageKey, JSON.stringify(recentAttempts));
    },
    onSuccess: () => {
      // Kembali ke pesan awal Anda yang simple
      toast.success('Pendaftaran Berhasil!', {
        description: 'Silakan cek kotak masuk email Anda untuk konfirmasi.'
      });
    },
    onError: (error: any) => {
      // Jika kena limit buatan kita sendiri
      if (error.message === 'LIMIT_LOKAL') {
        toast.error('Terlalu sering', {
          description: 'Anda sudah mencoba 4 kali. Mohon tunggu 1 jam lagi.'
        });
        return;
      }

      // Jika tetap kena 429 dari Supabase
      if (error.status === 429) {
        toast.info('Email sudah terdaftar', {
          description: 'Silakan cek folder spam atau tunggu 1 menit untuk mencoba lagi.'
        });
        return;
      }

      toast.error('Gagal', { 
        description: error.message || 'Terjadi kesalahan.' 
      });
    },
  })
}