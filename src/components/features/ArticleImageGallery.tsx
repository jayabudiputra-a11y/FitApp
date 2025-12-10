import React from 'react';
import { useTranslation } from "react-i18next";
import Card from '@/components/ui/Card';
import { cleanAndValidateUrl } from '@/components/features/ArticleDetail'; // Impor fungsi helper

interface ArticleImageGalleryProps {
  images: string[];
  title: string;
  slug: string;
  containerClassName?: string;
  downloadPrefix: string;
  startIndex: number;
}

const ArticleImageGallery: React.FC<ArticleImageGalleryProps> = ({ 
  images, 
  title, 
  slug, 
  containerClassName = "px-6 pb-10 pt-4", // Default class
  downloadPrefix,
  startIndex
}) => {
  const { t } = useTranslation();

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={containerClassName}>
      <h2 className="text-xl font-bold mb-4 text-gray-900">{t(title)}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url: string, i: number) => (
          <Card key={i} variant="shadow" className="p-0 aspect-[4/5] overflow-hidden group">
            <a 
              href={cleanAndValidateUrl(url)} 
              download={`fitapp_${slug}_${downloadPrefix}_${startIndex + i}.jpg`} 
              className="block w-full h-full" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img 
                src={cleanAndValidateUrl(url)} 
                loading="lazy" 
                className="w-full h-full object-cover !m-0 transition-transform duration-300 group-hover:scale-[1.03]" 
                alt={`${t("Gallery image")} ${startIndex + i}`} 
              />
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticleImageGallery;