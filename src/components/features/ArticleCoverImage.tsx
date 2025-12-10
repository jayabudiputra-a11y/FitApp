import React from 'react';
import Card from '@/components/ui/Card';
import { cleanAndValidateUrl } from '@/components/features/ArticleDetail'; // Impor fungsi helper dari ArticleDetail

interface ArticleCoverImageProps {
  imageUrl?: string | null;
  title: string;
  slug: string;
}

const ArticleCoverImage: React.FC<ArticleCoverImageProps> = ({ imageUrl, title, slug }) => {
  if (!imageUrl) {
    return null; // Jangan render apa-apa jika tidak ada gambar
  }

  const validatedUrl = cleanAndValidateUrl(imageUrl);

  return (
    <div className="px-6 pt-6">
      <Card variant="shadow" className="p-0">
        <a 
          href={validatedUrl} 
          download={`fitapp_${slug}_cover.jpg`} 
          className="block w-full h-full" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <div className="aspect-[16/9] bg-gray-100 animate-pulse">
            <img 
              src={validatedUrl} 
              alt={title} 
              className="w-full h-full object-cover !m-0 transition-opacity duration-300" 
              loading="eager" // Penting untuk gambar utama
              onLoad={(e) => e.currentTarget.style.opacity = '1'}
              style={{ opacity: 0 }}
            />
          </div>
        </a>
      </Card>
    </div>
  );
};

export default ArticleCoverImage;