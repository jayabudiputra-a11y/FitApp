import { useMutation } from '@tanstack/react-query'
import { subscribersApi } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Subscriber } from '../types/index'

export const useSubscribe = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // 1. Simpan email ke database public (tabel subscribers)
      // Menggunakan fungsi dari api.ts yang sudah disediakan.
      // Kita beri nama default 'Subscriber' karena form halaman Subscription hanya meminta input email.
      await subscribersApi.insertIfNotExists(email, 'Subscriber')

      // 2. Kirim Magic Link (OTP) untuk notifikasi email & login otomatis
      // Ini memenuhi permintaan agar visitor "langsung bisa komen" setelah verifikasi,
      // karena link email ini akan membuat session user aktif.
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Arahkan user kembali ke halaman artikel setelah mereka klik link di email
          emailRedirectTo: `${window.location.origin}/articles`,
        }
      })

      if (error) {
        throw error
      }
    },
    onSuccess: () => {
      toast.success('Link login telah dikirim ke email Anda. Silakan cek inbox!')
    },
    onError: (error: any) => {
      console.error('Subscribe error:', error)
      toast.error(error.message || 'Gagal mengirim email subscribe')
    },
  })
}