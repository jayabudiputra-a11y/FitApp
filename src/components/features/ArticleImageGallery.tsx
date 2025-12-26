import React from 'react';
import { useTranslation } from "react-i18next";
import Card from '@/components/ui/Card';
import { generateFullImageUrl } from '@/utils/helpers'; 
import { useSaveData } from '@/hooks/useSaveData';
import { getOptimizedImage } from '@/lib/utils';

interface ArticleImageGalleryProps {
  images: string; 
  title: string;
  slug: string;
  containerClassName?: string;
  downloadPrefix: string;
  startIndex: number;
}

const ArticleImageGallery: React.FC<ArticleImageGalleryProps> = ({ 
  images: rawImagesString, 
  title, 
  slug, 
  containerClassName = "px-6 pb-10 pt-4",
  downloadPrefix,
  startIndex
}) => {
  const { t } = useTranslation();
  const { isEnabled, saveData } = useSaveData(); 

  const imagePaths = rawImagesString 
    ? rawImagesString.split(/[\r\n]+/) 
                     .map(path => path.trim())
                     .filter(path => path.length > 0)
    : [];

  if (imagePaths.length === 0) {
    return null;
  }

  return (
    <div className={containerClassName}>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t(title)}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {imagePaths.map((relativePath: string, i: number) => {
          const highQualityUrl = generateFullImageUrl(relativePath); 
          if (!highQualityUrl) return null;

          const isLowQualityMode = isEnabled && saveData.quality === 'low';
          const targetWidth = isLowQualityMode ? 300 : 500;
          const displayUrl = getOptimizedImage(highQualityUrl, targetWidth);

          return (
            <Card key={i} variant="shadow" className="p-0 aspect-[4/5] overflow-hidden group border-0 bg-neutral-100 dark:bg-neutral-800">
              <a 
                href={highQualityUrl} 
                download={`fitapp_${slug}_${downloadPrefix}_${startIndex + i}.jpg`} 
                className="block w-full h-full" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  src={displayUrl} 
                  loading="lazy" 
                  width="400"
                  height="500"
                  className="w-full h-full object-cover !m-0 transition-all duration-700 ease-in-out group-hover:scale-[1.05] group-hover:brightness-110" 
                  alt={`${t("Gallery image")} ${startIndex + i}`} 
                  onLoad={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  style={{ opacity: 0 }}
                />
              </a>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ArticleImageGallery;