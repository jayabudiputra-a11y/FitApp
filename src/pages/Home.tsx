import ArticleList from "@/components/features/ArticleList";
import centralGif from "@/assets/fitapp (1).gif";
import leftGif from "@/assets/fitapp3-ezgif.com-gif-maker.gif";
import rightGif from "@/assets/fitapp2-ezgif.com-gif-maker.gif";
import prideMustache from "@/assets/myPride.gif";

const Home = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <section className="relative pt-8 border-b border-gray-100 dark:border-neutral-900 bg-white dark:bg-black">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex flex-row items-start justify-center gap-2 md:gap-6">
            
            {/* Left GIF */}
            <div className="hidden md:flex flex-col items-center w-1/4">
              <img
                src={leftGif}
                alt="Left Decorative"
                width="250"
                height="250"
                loading="eager"
                fetchPriority="high"
                className="w-full h-auto mix-blend-multiply dark:mix-blend-normal"
              />
              {/* REVISI: Ratio 1.78. Jika height 20px (h-5), maka width harus 36px */}
              <img
                src={prideMustache}
                alt="Pride Decoration"
                width="36"
                height="20"
                className="h-5 w-auto object-contain mt-1 opacity-50 dark:opacity-70"
              />
            </div>

            {/* Main Central GIF - LCP Element */}
            <div className="flex flex-col items-center w-full md:w-1/2">
              <img
                src={centralGif}
                alt="Fitapp Main Hero"
                width="500"
                height="500"
                loading="eager"
                fetchPriority="high"
                className="w-full h-auto mix-blend-multiply dark:mix-blend-normal"
              />
              {/* REVISI: Ratio 1.78. Jika height 28px (h-7), maka width harus 50px */}
              <img
                src={prideMustache}
                alt="Pride Central Decoration"
                width="50"
                height="28"
                className="h-7 w-auto object-contain mt-1"
              />
            </div>

            {/* Right GIF */}
            <div className="hidden md:flex flex-col items-center w-1/4">
              <img
                src={rightGif}
                alt="Right Decorative"
                width="250"
                height="250"
                loading="eager"
                fetchPriority="high"
                className="w-full h-auto mix-blend-multiply dark:mix-blend-normal"
              />
              {/* REVISI: Sama dengan Left GIF */}
              <img
                src={prideMustache}
                alt="Pride Decoration Right"
                width="36"
                height="20"
                className="h-5 w-auto object-contain mt-1 opacity-50 dark:opacity-70"
              />
            </div>
          </div>

          <div className="pt-10 pb-12 text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              {/* OPTIMASI: Warna hijau digelapkan sedikit untuk kontras AA */}
              <span className="bg-[#008142] text-white text-[10px] font-black px-2 py-0.5 tracking-[.2em] uppercase shadow-sm">
                Top Story
              </span>
            </div>

            <h1 className="text-[36px] md:text-[64px] leading-[0.85] font-black uppercase tracking-tighter mb-6 text-black dark:text-white">
              The Sexiest Men Photos Handpicked by Me: Fitapp Author
            </h1>

            <p className="text-neutral-600 dark:text-neutral-400 text-[11px] font-bold uppercase tracking-[.25em]">
              By Fitapp Editor
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-[1000px] mx-auto px-4">
          {/* Tambahkan heading h2 tersembunyi jika ArticleList tidak punya h2 di dalamnya */}
          <h2 className="sr-only">Latest Articles</h2>
          <ArticleList selectedTag={null} searchTerm="" />
        </div>
      </section>
    </main>
  );
};

export default Home;