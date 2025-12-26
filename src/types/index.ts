import type { ReactNode } from "react";

/* =========================
   Article & Content
========================= */
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  category: string;
  author: string;
  published_at: string;
  updated_at: string;
  views: number;
  reading_time: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order_index: number;
}

/* =========================
   Subscriber (Selaras dengan Column: subscribed_at)
========================= */
export interface Subscriber {
  id?: string;
  email: string;
  name?: string | null;
  subscribed_at?: string; // Sesuai dengan database trigger
  is_active?: boolean;
  preferences?: {
    categories: string[];
    frequency: string;
  };
}

/* =========================
   Profile (Selaras dengan Column: username)
========================= */
export interface UserProfile {
  id?: string;
  username: string; // Bukan display_name
  avatar_url: string | null;
  updated_at?: string;
}

/* =========================
   User & Auth
========================= */
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface AuthPageLayoutProps {
  children: ReactNode; // Menggunakan import ReactNode di atas
  title: string;
}

/* =========================
   Comments (Selaras dengan Relasi user_profiles)
========================= */
export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  // Join ke user_profiles, bukan schema auth internal
  user_profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
}

export interface NewComment {
  article_id: string;
  content: string;
}

export interface CommentWithUser {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name: string; // Dipetakan dari user_profiles.username
  user_avatar_url: string | null;
}

/* =========================
   Preferences
========================= */
export interface SaveDataPreference {
  enabled: boolean;
  quality: "low" | "medium" | "high";
}