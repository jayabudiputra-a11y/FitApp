import React from 'react';
import Card from '@/components/ui/Card';
import { getOptimizedImage } from '@/lib/utils'; // Ganti ke helper baru kita
import { useSaveData } from '@/hooks/useSaveData'; 

interface ArticleCoverImageProps {
  imageUrl?: string | null;
  title: string;
  slug: string;
}

const ArticleCoverImage: React.FC<ArticleCoverImageProps> = ({ imageUrl, title, slug }) => {
  const { isEnabled, saveData } = useSaveData(); 

  if (!imageUrl) {
    return null;
  }
    
  // Membersihkan URL dari karakter tersembunyi
  const safeHighQualityUrl = imageUrl.split('\r\n')[0].trim();
    
  if (safeHighQualityUrl.length === 0) {
    return null;
  }

  /**
   * OPTIMASI PAGESPEED:
   * 1. Jika mode Hemat Data aktif, kita minta lebar 400px.
   * 2. Jika mode Normal, kita minta 800px-1000px (sudah cukup untuk layar HP/Tablet).
   * Jangan kirim 1280px+ jika tidak perlu.
   */
  const isLowQualityMode = isEnabled && saveData.quality === 'low';
  const targetWidth = isLowQualityMode ? 400 : 800;
  
  const displayUrl = getOptimizedImage(safeHighQualityUrl, targetWidth);

  return (
    <div className="px-6 pt-6">
      <Card variant="shadow" className="p-0">
        <a 
          href={safeHighQualityUrl} 
          download={`fitapp_${slug}_cover.jpg`} 
          className="block w-full h-full" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <div className="aspect-[16/9] bg-gray-100 dark:bg-neutral-800 overflow-hidden">
            <img 
              src={displayUrl} 
              alt={title} 
              className="w-full h-full object-cover !m-0 transition-opacity duration-500" 
              // LCP Optimization: Eager karena ini gambar utama atas
              loading="eager" 
              // Memberitahu browser bahwa ini prioritas utama
              fetchPriority="high"
              onLoad={(e) => {
                e.currentTarget.style.opacity = '1';
                // Hapus animasi pulse pada parent jika sudah load
                const parent = e.currentTarget.parentElement;
                if(parent) parent.classList.remove('animate-pulse');
              }}
              onError={(e) => {
                  e.currentTarget.style.opacity = '0.5'; 
                  console.error("Gagal memuat cover image:", displayUrl);
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