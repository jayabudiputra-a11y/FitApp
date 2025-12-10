// D:\projects\fitapp-2025\src\pages\Home.tsx

import ArticleList from '@/components/features/ArticleList'
import masculineLogo from '@/assets/masculine-logo.svg'

const Home = () => {
  return (
    <>
      {/* 
        === HERO SECTION ===
        - Section ini menggunakan wadah-nya sendiri (`max-w-xl`) untuk membuat
          teks hero fokus dan menonjol di tengah.
        - Tidak masalah memiliki wadah yang lebih kecil di dalam wadah utama
          dari Layout.tsx, karena ini adalah keputusan desain yang disengaja.
      */}
      <section className="py-16 text-center">
        <div className="max-w-xl mx-auto">
          <img
            src={masculineLogo}
            alt="Fitapp Logo"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold mb-2">
            Fit<span className="text-emerald-600">app</span>
          </h1>
          <p className="text-base text-gray-700">
            LGBTQ+ Fitness • Muscle Worship • Mindset • Wellness
          </p>
          <p className="text-sm text-emerald-600 font-semibold mt-2">
            Built by fellow gay, for gays.
          </p>
        </div>
      </section>

      {/* 
        === LATEST ARTICLES SECTION ===
        - PERUBAHAN PENTING: Kami menghapus `container mx-auto px-4`.
        - Sekarang, section ini akan mengisi lebar penuh yang disediakan oleh
          `Layout.tsx`.
        - `<ArticleList />` di dalamnya akan bertanggung jawab atas grid-nya sendiri
          dan akan menyesuaikan dengan lebar wadah induk.
        - Ini memecahkan masalah "layout kekecilan" karena sekarang menggunakan
          wadah yang lebih lebar (`max-w-screen-xl` dari Layout.tsx).
      */}
      <section className="py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Latest Inspiration</h2>
        <ArticleList selectedTag={null} />
      </section>
    </>
  )
}

export default Home
