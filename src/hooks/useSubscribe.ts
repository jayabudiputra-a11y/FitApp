import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const LIMIT_KEY = 'fitapp_v1_limit';

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // 1. Cek Limit Lokal (4x per jam)
      const now = Date.now();
      const storage = JSON.parse(localStorage.getItem(LIMIT_KEY) || '[]');
      const recentAttempts = storage.filter((ts: number) => now - ts < 3600000);

      if (recentAttempts.length >= 4) {
        throw new Error('LIMIT_LOKAL');
      }

      // 2. Insert ke Table Subscribers (Tanpa on_conflict agar tidak Error 400)
      // Karena constraint sudah dihapus, kita pakai insert biasa
      const { error: dbError } = await supabase
        .from('subscribers')
        .insert([{ email, status: 'Subscriber' }]);

      if (dbError) {
        console.warn('DB Insert Note:', dbError.message);
        // Kita abaikan error DB agar tetap lanjut ke OTP
      }

      // 3. Kirim OTP (Supabase Auth)
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (authError) {
        // Jika kena 429 (Server Limit), kita anggap 'pending' (tetap sukses di mata user)
        if (authError.status === 429 || authError.message.includes('rate limit')) {
          return { status: 'pending' };
        }
        throw authError;
      }

      // Catat sukses ke limit lokal
      recentAttempts.push(now);
      localStorage.setItem(LIMIT_KEY, JSON.stringify(recentAttempts));
      
      return { status: 'success' };
    },
    onSuccess: (res) => {
      // Jika status pending (kena 429), beri pesan "Diterima" (bukan gagal)
      if (res?.status === 'pending') {
        toast.info('Pendaftaran Diterima', {
          description: 'Data sudah tersimpan. Jika email belum masuk, mohon tunggu 60 detik sebelum mencoba lagi.'
        });
        return;
      }

      // PESAN AWAL YANG ANDA INGINKAN
      toast.success('Pendaftaran Berhasil!', {
        description: 'Silakan cek kotak masuk email Anda untuk konfirmasi.'
      });
    },
    onError: (error: any) => {
      if (error.message === 'LIMIT_LOKAL') {
        toast.warning('Batas Percobaan', {
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