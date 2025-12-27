import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/* ======================
    
   ====================== */
const _0xmask = ['supabase.co', 'width=', 'quality=75&format=webp', 'split', '?'] as const;
const _m = (i: number) => _0xmask[i] as any;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function readingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

/**
 * 
 */

export function getOptimizedImage(url: string | null | undefined, width: number): string {
  if (!url) return "";
  
  const _DOM = _m(0); // 
  const _SEP = _m(4); // '?'
  
  if (url.includes(_DOM)) {
    const hasParams = url.includes(_SEP);
    const connector = hasParams ? '&' : _SEP;
    
    if (url.includes(_m(1))) return url;

    return `${url}${connector}${_m(1)}${width}&${_m(2)}`;
  }
  
  return url;
}