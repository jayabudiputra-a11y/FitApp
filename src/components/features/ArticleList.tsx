// D:\projects\fitapp-2025\src\components\features\ArticleList.tsx

import { useArticles } from "@/hooks/useArticles";
import ArticleCard from "./ArticleCard";
import ScrollToTopButton from "./ScrollToTopButton";

interface Props {
  selectedTag: string | null;
}

export default function ArticleList({ selectedTag }: Props) {
  const { data: articles, isLoading, error } = useArticles(selectedTag);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 mx-auto animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center py-10 text-red-500 text-sm">Gagal memuat data</p>;
  }

  if (!articles || articles.length === 0) {
    return (
      <p className="text-center py-10 text-gray-600 text-sm">
        Belum ada artikel
      </p>
    );
  }

  return (
    <>
      {/* 
        === REVISI: GRID LEBIH RINGKAS & BANYAK KOLOM ===
        - grid-cols-1: 1 kolom di mobile.
        - md:grid-cols-2: 2 kolom di tablet.
        - lg:grid-cols-3: 3 kolom di desktop.
        - xl:grid-cols-4: 4 kolom di layar lebar.
        - gap-4: Jarak antar kartu diperkecil (dari 24px menjadi 16px).
        - mt-4: Jarak atas diperkecil.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {articles.map((a: any) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
      <ScrollToTopButton />
    </>
  );
}
