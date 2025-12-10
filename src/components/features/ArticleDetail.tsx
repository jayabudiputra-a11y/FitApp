import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, Eye } from "lucide-react";
// Import Komponen/Helper
import FormattedDate from "@/components/features/FormattedDate";
import StructuredData from "../seo/StructuredData"; 
import myAvatar from "@/assets/myAvatar.jpg"; 
import myPride from "@/assets/myPride.gif"; 
import Card from "@/components/ui/Card";
import ScrollToTopButton from "@/components/features/ScrollToTopButton";

// Import Custom Hooks
import { useArticleData } from "@/hooks/useArticleData"; 
import { useArticleViews } from "@/hooks/useArticleViews"; // HOOK KRITIS

// Import Komponen Gambar Baru
import ArticleCoverImage from "@/components/features/ArticleCoverImage";
import ArticleImageGallery from "@/components/features/ArticleImageGallery";


// --- Tipe dan Helper Functions ---

// Definisi bahasa
const LANGS = ["en", "id", "zh", "ja", "ko", "es", "fr", "de", "ru", "ar", "th", "vi"] as const;
export type LangCode = (typeof LANGS)[number];

// Fungsi validasi URL (dipindahkan ke sini agar bisa diimpor oleh komponen lain)
export const cleanAndValidateUrl = (url: string): string => {
  if (!url) return "";
  const cleanedUrl = url.trim();
  if (cleanedUrl.startsWith("http")) {
    return cleanedUrl;
  }
  return "";
};

// Interface data artikel (PENTING: Pastikan ID artikel adalah string yang sesuai dengan UUID Supabase)
export interface Article {
    id: string; // Harus sesuai dengan tipe data article_id di Supabase (UUID yang direpresentasikan sebagai string)
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    featured_image: string;
    published_at: string;
    views: number; // Nilai Awal Views (dari data artikel itu sendiri)
    reading_time: number;
    tags: string[];
    [key: string]: any; 
}
// --------------------------------------------------------------------------

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const slugValue = slug ?? "unknown";

  // 1. FETCH DATA UTAMA ARTIKEL
  const { processedData, isLoading, article } = useArticleData();
  
  // 2. SIAPKAN initialViews (VIEWS DARI SUMBER DATA ARTIKEL)
  const initialViewsFromArticle = article?.views ?? 0;
  
    // DEBUG KRITIS: Log ID artikel yang diambil dari sumber data (useArticleData)
    // Nilai ini HARUS berupa UUID yang valid.
    console.log("DEBUG SOURCE: ID from useArticleData:", article?.id);
    
  // 3. Panggil Hook Views dengan data ID dan Views Awal
  const { liveViewCount } = useArticleViews({ 
    // Pastikan article?.id berisi UUID
    id: article?.id ?? '', 
    slug: slugValue,
    initialViews: initialViewsFromArticle, 
  });

  // =======================================================
  // EARLY RETURNS
  // =======================================================

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-5xl font-black text-emerald-600 animate-pulse">
          {t("loading....babe")}
        </p>
      </div>
    );

  if (!processedData || !article)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-7xl font-black text-red-600 mb-6">404</h1>
        <Link
          to="/"
          className="bg-emerald-600 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-emerald-700 transition duration-200"
        >
          {t("back")}
        </Link>
        <p className="mt-4 text-gray-500">
          {t("Article not found or article data is incomplete.")}
        </p>
      </div>
    );
    
  // Destructure data setelah memastikan ia ada
  const { 
    title, 
    excerpt, 
    paragraphs, 
    coverImage, 
    midGallery, 
    bottomGallery 
  } = processedData;

  // =======================================================
  // RENDER PAGE
  // =======================================================
  return (
    <>
      {/* SEO & Helmet */}
      <Helmet>
        <title>{title} — Fitapp 2025</title>
        <meta name="description" content={excerpt} />
        <meta property="og:image" content={cleanAndValidateUrl(coverImage ?? "")} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Structured Data JSON-LD */}
      <StructuredData
        article={{
          title,
          excerpt,
          featured_image: cleanAndValidateUrl(coverImage ?? ""),
          published_at: article.published_at,
        }}
      />

      <div className="min-h-screen">
        {/* HERO SECTION */}
        <div className="bg-gradient-to-br from-emerald-800 via-teal-700 to-purple-800 text-white py-16 text-center shadow-md">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-black mb-3">{title}</h1>
            {excerpt && <p className="text-base opacity-90">{excerpt}</p>}
          </div>
        </div>

        {/* MAIN BOX */}
        <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10">
          <article className="bg-white rounded-2xl shadow-xl border overflow-hidden">
            {/* AUTHOR & METADATA */}
            <div className="p-6 border-b">
              <div className="flex flex-col items-center text-center gap-3">
                <img src={myAvatar} className="w-20 h-20 rounded-full ring-4 ring-emerald-400 shadow-md object-cover" alt="Author avatar" />
                <div className="flex items-center gap-3 text-2xl font-black text-gray-900">
                  <span>Budi</span>
                  <span className="relative flex flex-col items-center">
                    Putra
                    <img src={myPride} className="w-14 h-6 -mt-1 pointer-events-none" alt="Pride flag" />
                  </span>
                  <span>Jaya</span>
                </div>

                <div className="flex items-center gap-5 text-sm text-gray-700 mt-2">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <FormattedDate dateString={article.published_at} formatString="MMMM d, yyyy" />
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    {article.reading_time} {t("minRead")}
                  </span>
                  {/* TAMPILAN LIVE VIEWS DARI HOOK */}
                  <span className="flex items-center gap-2 font-bold text-teal-600">
                    <Eye className="w-4 h-4" />
                    {liveViewCount.toLocaleString()} {t("views")}
                  </span>
                </div>
              </div>
            </div>

            {/* COVER IMAGE - MENGGUNAKAN KOMPONEN BARU */}
            <ArticleCoverImage imageUrl={coverImage} title={title} slug={slugValue} />

            {/* CONTENT & GALLERY */}
            <div className="px-6 py-8">
              <div className="prose prose-sm max-w-none">
                {paragraphs.map((line: string, originalIndex: number) => {
                  // Regex processing for bold and italic text
                  const processedLine = line
                    .trim()
                    .replace(/\*\*(.*?)\*\*/g, `<strong class="font-bold text-emerald-700">$1</strong>`)
                    .replace(/\*(.*?)\*/g, `<em class="italic text-purple-600">$1</em>`);

                  return (
                    <div key={originalIndex}>
                      <p
                        className="text-[17px] leading-[30px] mb-6 text-gray-800"
                        dangerouslySetInnerHTML={{ __html: processedLine }}
                      />
                      
                      {/* MID GALLERY - MENGGUNAKAN KOMPONEN BARU */}
                      {originalIndex === 2 && (
                        <ArticleImageGallery
                          images={midGallery}
                          title="Gallery"
                          slug={slugValue}
                          containerClassName="my-10 -mx-6 px-6"
                          downloadPrefix="mid"
                          startIndex={1}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM GALLERY - MENGGUNAKAN KOMPONEN BARU */}
            <ArticleImageGallery
              images={bottomGallery}
              title="More Photos"
              slug={slugValue}
              downloadPrefix="bottom"
              startIndex={7}
            />
            
            {/* TAGS SECTION */}
            {article.tags && article.tags.length > 0 && (
              <div className="p-6 border-t">
                  <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm font-semibold text-gray-600">{t("Tags")}:</span>
                      {article.tags.map((tag: string, index: number) => ( 
                          <Link 
                              key={index}
                              to={`/tag/${tag.toLowerCase()}`} // Pastikan tag dlm lowercase
                              className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full hover:bg-emerald-200 transition"
                          >
                              {tag}
                          </Link>
                      ))}
                  </div>
              </div>
            )}
          </article>
        </div>
      </div>

      <ScrollToTopButton />
    </>
  );
}