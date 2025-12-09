// hooks/useArticleData.ts

import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";

// 🟢 PERBAIKAN: Gunakan 'import type' untuk tipe data (Article dan LangCode)
import { cleanAndValidateUrl } from "@/components/features/ArticleDetail"; 
import type { Article, LangCode } from "@/components/features/ArticleDetail"; 
// Pastikan path import ini sudah benar: "@/components/features/ArticleDetail"

/**
 * Hook Kustom untuk Mengambil dan Memproses Data Artikel.
 */
export const useArticleData = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation();
  const lang = (i18n.language as LangCode) || "en";
  
  // 1. FETCH ARTICLE DATA
  const { data: article, isLoading } = useQuery<Article | null>({ 
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      return data as Article | null;
    },
    enabled: !!slug,
    retry: false,
  });
  
  // Helper untuk mendapatkan bidang bahasa dengan fallback
  const getField = (base: string) => {
    if (!article) return '';
    // Cast here aman karena 'article' dijamin memiliki properti dynamic
    const articleFields = article as Article & Record<string, any>; 
    const langKey = lang === 'en' ? '' : `_${lang}`; 
    
    return articleFields[`${base}${langKey}`] || 
          articleFields[`${base}_en`] || 
          articleFields[base];
  }

  // 2. LANGUAGE FIELDS & PARSING (useMemo)
  const processedData = useMemo(() => {
    if (!article) {
      return null;
    }

    const title = getField("title") || t("Article Title");
    const excerpt = getField("excerpt") || t("A short excerpt about the article.");
    const content = getField("content") || t("Content not available.");

    // IMAGE PARSER
    const allImages = article.featured_image
      ? article.featured_image
          .split(/[\n,]+/) 
          .map(cleanAndValidateUrl)
          .filter(Boolean) 
      : [];

    const coverImage = allImages[0] ?? null;
    const remainingImages = allImages.slice(1);
    const midGallery: string[] = remainingImages.slice(0, 5);
    const bottomGallery: string[] = remainingImages.slice(5);

    // Content Parser
    const paragraphs = content
      .replace(/\r\n/g, "\n")
      .replace(/\\n/g, "\n")
      .split("\n")
      .filter(Boolean);

    return {
      article,
      title,
      excerpt,
      content,
      paragraphs,
      coverImage,
      midGallery,
      bottomGallery,
    };
  }, [article, lang, t]);

  return { 
    processedData, 
    isLoading, 
    article: article, 
  };
};
