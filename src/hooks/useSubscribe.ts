import { useMutation } from '@tanstack/react-query'
import { subscribersApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // 1. Bersihkan sesi lama
      supabase.auth.signOut().catch(() => {});

      // 2. PAKSA masuk ke Database dulu
      try {
        await subscribersApi.insertIfNotExists(email, 'Subscriber');
        console.log('Data berhasil masuk ke tabel subscribers');
      } catch (dbError: any) {
        console.warn('DB Status:', dbError.message);
      }

      // 3. Kirim OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      // Jika error OTP, kita lempar agar ditangkap onError
      if (error) throw error;
    },
    onSuccess: () => {
      // Pesan Sukses Standar
      toast.success('Pendaftaran Berhasil!', {
        description: 'Silakan cek email Anda untuk konfirmasi login.'
      });
    },
    onError: (error: any) => {
      // JIKA ERRORNYA ADALAH LIMIT (429)
      // Kita tetap anggap "Sukses" di mata user karena data sudah masuk DB
      if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
        toast.info('Pendaftaran Diterima', {
          description: 'Data sudah masuk. Jika email konfirmasi belum ada, mohon tunggu 1 menit sebelum mencoba login kembali.'
        });
        return;
      }

      // JIKA ERROR SMTP/KOSONG
      if (!error.message || error.message === "{}" || Object.keys(error).length === 0) {
        toast.warning('Hampir Berhasil!', {
          description: 'Data sudah kami simpan, namun pengiriman email sedang sibuk. Silakan coba masuk (Sign In) beberapa saat lagi.'
        });
        return;
      }
      
      // Error lainnya
      toast.error('Gagal', { description: error.message });
    },
  })
}