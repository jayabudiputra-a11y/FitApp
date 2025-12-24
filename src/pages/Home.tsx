import { useState } from 'react'
import ArticleList from '@/components/features/ArticleList'
import centralGif from '@/assets/fitapp (1).gif'
import leftGif from '@/assets/fitapp3-ezgif.com-gif-maker.gif'
import rightGif from '@/assets/fitapp2-ezgif.com-gif-maker.gif'
import prideMustache from '@/assets/myPride.gif'
import SearchBar from '@/components/features/SearchBar'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase())
  }

  return (
    <>
      {/* =========================
          HERO / BRAND SECTION
      ========================== */}
      <section
        className="
          relative
          py-24
          text-center
          overflow-hidden

          bg-gradient-to-br
          from-red-400
          via-yellow-300
          via-emerald-400
          via-sky-400
          to-purple-500

          dark:from-red-500
          dark:via-yellow-400
          dark:via-emerald-500
          dark:via-sky-500
          dark:to-purple-600
        "
      >
        {/* Contrast overlay */}
        <div
          className="
            absolute inset-0 pointer-events-none
            bg-gradient-to-t
            from-white/60 via-transparent to-white/40
            dark:from-black/60 dark:to-black/50
          "
        />

        <div className="relative max-w-5xl mx-auto flex justify-center items-center gap-0">
          {/* LEFT GIF */}
          <img
            src={leftGif}
            alt="Fitapp Left Decoration"
            className="
              w-1/4 h-auto hidden md:block
              saturate-150
              contrast-110
              brightness-105
            "
          />

          {/* CENTER GIF */}
          <img
            src={centralGif}
            alt="Fitapp Main Inspiration GIF"
            className="
              w-1/2 h-auto
              saturate-150
              contrast-115
              brightness-105

              drop-shadow-[0_0_50px_rgba(255,255,255,0.7)]
              dark:drop-shadow-[0_0_45px_rgba(255,255,255,0.35)]
            "
          />

          {/* RIGHT GIF */}
          <img
            src={rightGif}
            alt="Fitapp Right Decoration"
            className="
              w-1/4 h-auto hidden md:block
              saturate-150
              contrast-110
              brightness-105
            "
          />
        </div>
      </section>

      {/* =========================
          LATEST INSPIRATION
      ========================== */}
      <section className="py-24 relative">
        {/* Ambient rainbow — NEVER pudar */}
        <div
          className="
            absolute inset-0 pointer-events-none
            bg-gradient-to-b
            from-transparent
            via-emerald-300/30
            via-sky-300/30
            via-purple-400/30
            to-transparent
            dark:via-purple-500/20
          "
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* PRIDE GIF */}
          <div className="flex justify-center mb-6">
            <img
              src={prideMustache}
              alt="Pride Mustache"
              className="
                h-16 w-auto
                saturate-150
                drop-shadow-[0_0_16px_rgba(255,255,255,0.6)]
              "
            />
          </div>

          {/* TITLE — PURE RAINBOW */}
          <h2
            className="
              text-4xl sm:text-5xl font-extrabold text-center mb-12

              bg-gradient-to-r
              from-red-500
              via-yellow-400
              via-emerald-400
              via-sky-400
              to-purple-500

              bg-clip-text text-transparent
              drop-shadow-[0_0_16px_rgba(255,255,255,0.55)]
            "
          >
            Latest Inspiration
          </h2>

          <div className="max-w-xl mx-auto mb-16">
            <SearchBar onSearch={handleSearch} />
          </div>

          <ArticleList
            selectedTag={null}
            searchTerm={searchTerm}
          />
        </div>
      </section>
    </>
  )
}

export default Home
