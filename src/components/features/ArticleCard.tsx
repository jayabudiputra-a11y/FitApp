// =======================================================
//  FITAPP 2025 — ARTICLE CARD (FIXED NESTING LINK ISSUE)
// =======================================================

import { Link } from "react-router-dom";
import { Calendar, Clock, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import Badge from "@/components/ui/Badge";
import FormattedDate from "@/components/features/FormattedDate";
import myAvatar from "@/assets/myAvatar.jpg";
import ShareButtons from "@/components/features/ShareButtons";

// Language
const LANGS = [
  "en", "id", "zh", "ja", "ko",
  "es", "fr", "de", "ru", "ar",
  "th", "vi",
] as const;

type LangCode = (typeof LANGS)[number];

interface ArticleCardProps {
  article: any;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language as LangCode) || "en";

  const title =
    article[`title_${lang}`] ??
    article.title_en ??
    article.title ??
    "";

  const excerpt =
    article[`excerpt_${lang}`] ??
    article.excerpt_en ??
    article.excerpt ??
    "";

  const firstImage =
    article.featured_image
      ?.split(/\n|,|\s+/)
      .map((u: string) => u.trim())
      .filter((u: string) => u !== "")[0] ?? null;

  const authorName = article.author ?? "Anonymous";

  return (
    // === PERUBAHAN 1: Bungkus dengan <article>, bukan <Link> ===
    // Kelas 'group' tetap kita simpan untuk efek hover pada anak-anaknya
    <article className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full group">

      {/* === PERUBAHAN 2: Gambar dan Badge dibungkus dengan Link terpisah === */}
      <Link to={`/article/${article.slug}`} className="block relative w-full aspect-video bg-gray-200 overflow-hidden">
        {firstImage ? (
          <img
            src={firstImage}
            alt={title}
            className="w-full h-full object-cover block group-hover:scale-[1.03] transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-500 text-white text-lg font-bold">
            Fitapp
          </div>
        )}

        <div className="absolute top-2 left-2 pointer-events-none">
          <Badge variant="primary" size="sm">{article.category || "fit"}</Badge>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-3 flex flex-col flex-1">

        {/* === PERUBAHAN 3: Judul juga dibungkus Link terpisah === */}
        <Link to={`/article/${article.slug}`} className="block">
          <h2 className="text-base font-semibold text-gray-900 group-hover:text-emerald-600 transition mb-1 line-clamp-2">
            {title}
          </h2>
        </Link>

        {excerpt ? (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2 flex-1">
            {excerpt}
          </p>
        ) : (
          <div className="flex-1 mb-2" />
        )}

        {/* META */}
        <div className="mt-auto flex items-center justify-between gap-2">

          <div className="flex items-center gap-2">
            <img
              src={myAvatar}
              alt={authorName}
              className="w-6 h-6 rounded-full ring-1 ring-emerald-400 object-cover"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{authorName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <FormattedDate
                dateString={article.published_at}
                formatString="MMMM d, yyyy"
                variant="card"
              />
            </span>

            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.reading_time}m
            </span>

            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views ?? 0}
            </span>
          </div>

        </div>

        {/* SHARE BUTTONS - Sekarang tidak lagi di dalam <a> */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <ShareButtons article={{ title: title, slug: article.slug }} />
        </div>

      </div>
    </article>
  );
}