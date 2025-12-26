import { useMutation } from '@tanstack/react-query'
import { subscribersApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // 1. Bersihkan sesi lama agar tidak konflik
      localStorage.removeItem('fitapp-auth-token');
      await supabase.auth.signOut().catch(() => {});

      try {
        await subscribersApi.insertIfNotExists(email, 'Subscriber');
        console.log('Input DB sukses untuk:', email);
      } catch (dbErr) {
        console.warn('DB Insert Skip:', dbErr);
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error && error.status === 429) {
        return { rateLimited: true };
      }

      if (error) throw error;
      return { success: true };
    },
    onSuccess: (result) => {
      if (result?.rateLimited) {
        toast.info('Pendaftaran Diterima', {
          description: 'Data sudah kami simpan. Mohon tunggu 60 detik sebelum mencoba kirim ulang email.'
        });
        return;
      }

      toast.success('Pendaftaran Berhasil!', {
        description: 'Silakan cek kotak masuk email Anda untuk konfirmasi.'
      });
    },
    onError: (error: any) => {
      toast.error('Gagal', { 
        description: error.message || 'Terjadi kesalahan sistem.' 
      });
      console.error('Error detail:', error);
    },
  })
}