import React from 'react';
import Card from '@/components/ui/Card';
import { getOptimizedImage } from '@/lib/utils';
import { useSaveData } from '@/hooks/useSaveData'; 

interface ArticleCoverImageProps {
  imageUrl?: string | null;
  title: string;
  slug: string;
}

const ArticleCoverImage: React.FC<ArticleCoverImageProps> = ({ imageUrl, title, slug }) => {
  const { isEnabled, saveData } = useSaveData(); 

  // Memastikan imageUrl ada dan merupakan string sebelum diolah
  const safeHighQualityUrl = typeof imageUrl === 'string' 
    ? imageUrl.split('\r\n')[0].trim() 
    : null;

  if (!safeHighQualityUrl || safeHighQualityUrl.length === 0) {
    return null;
  }

  const isLowQualityMode = isEnabled && saveData.quality === 'low';
  // Untuk cover utama, 900px adalah standar ketajaman yang baik
  const targetWidth = isLowQualityMode ? 400 : 900;
  
  const displayUrl = getOptimizedImage(safeHighQualityUrl, targetWidth);

  return (
    <div className="px-6 pt-6">
      <Card variant="shadow" className="p-0 overflow-hidden">
        <a 
          href={safeHighQualityUrl} 
          download={`fitapp_${slug}_cover.jpg`} 
          className="block w-full h-full" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <div className="aspect-[16/9] bg-neutral-100 dark:bg-neutral-800 overflow-hidden animate-pulse">
            <img 
              src={displayUrl} 
              alt={title} 
              className="w-full h-full object-cover !m-0 transition-opacity duration-700 ease-in-out" 
              loading="eager" 
              // Menggunakan casting 'as any' untuk menghindari error TypeScript 
              // dan penulisan lowercase 'fetchpriority' agar React tidak memunculkan warning di console
              {...({ fetchpriority: "high" } as any)}
              // Menambahkan dimensi eksplisit untuk mencegah layout shift (CLS)
              width="900"
              height="506"
              onLoad={(e) => {
                e.currentTarget.style.opacity = '1';
                const parent = e.currentTarget.parentElement;
                if (parent) parent.classList.remove('animate-pulse');
              }}
              onError={(e) => {
                e.currentTarget.style.opacity = '0.5';
                const parent = e.currentTarget.parentElement;
                if (parent) parent.classList.remove('animate-pulse');
              }}
              style={{ opacity: 0 }}
            />
          </div>
        </a>
      </Card>
    </div>
  );
};

export default ArticleCoverImage;