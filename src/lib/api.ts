import { supabase } from "./supabase";
import type {
  Article,
  AuthUser,
  CommentWithUser,
  SignUpData,
} from "../types";

/* =====================================================
   UTIL
===================================================== */
const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase Error [${context}]`, error);
  throw error;
};

/* =====================================================
   ARTICLES
===================================================== */
export const articlesApi = {
  getAll: async (limit = 10, offset = 0): Promise<Article[]> => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) handleSupabaseError(error, "articlesApi.getAll");
    return data ?? [];
  },
  getBySlug: async (slug: string): Promise<Article> => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data) handleSupabaseError(error, "articlesApi.getBySlug");
    
    // Increment views background
    void (async () => {
      const { error } = await supabase.rpc("increment_views", { article_id: data.id });
      if (error) console.warn("increment_views skipped:", error.message);
    })();
    
    return data;
  },
};

/* =====================================================
   SUBSCRIBERS (FIXED: Menggunakan Kolom yang Benar)
===================================================== */
export const subscribersApi = {
  insertIfNotExists: async (
    email: string,
    name?: string
  ): Promise<void> => {
    if (!email) return;

    try {
      // Kita hanya mengirim email dan name.
      // is_active dan subscribed_at akan diisi otomatis oleh TRIGGER DB.
      const { error } = await supabase
        .from("subscribers")
        .insert([
          { 
            email: email.toLowerCase(), 
            name: name ?? null 
          }
        ]);

      if (error) {
        // Jika error 400 muncul di sini, biasanya karena cache schema di client.
        console.warn("subscribersApi info:", error.message);
      }
    } catch (error) {
      console.warn("subscribersApi fatal catch:", error);
    }
  },
};

/* =====================================================
   AUTH & COMMENTS
===================================================== */
export const authApi = {
  signUp: async ({ email, password, name }: SignUpData) => {
    if (!name || name.trim().length < 2) throw new Error("Name is required");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) handleSupabaseError(error, "authApi.signUp");
    if (data.user?.email) void subscribersApi.insertIfNotExists(data.user.email, name.trim());
    return data;
  },
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) handleSupabaseError(error, "authApi.signIn");
    return data;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) handleSupabaseError(error, "authApi.signOut");
  },
  getCurrentUser: async (): Promise<AuthUser | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return (user as AuthUser) ?? null;
  },
};

export const commentsApi = {
  getCommentsByArticle: async (articleId: string): Promise<CommentWithUser[]> => {
    const { data, error } = await supabase.rpc("get_comments_with_users", { p_article_id: articleId });
    if (error) handleSupabaseError(error, "commentsApi.getCommentsByArticle");
    return data ?? [];
  },
  addComment: async (articleId: string, content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("You must be logged in to comment");
    const { error } = await supabase.from("comments").insert({ 
      article_id: articleId, 
      user_id: user.id, 
      content 
    });
    if (error) handleSupabaseError(error, "commentsApi.addComment");
  },
};