import { supabase } from "@/lib/supabase";

export const commentsApi = {
  async getCommentsByArticle(articleId: string) {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        content,
        created_at,
        user_id,
        user_profiles (
          username,
          avatar_url
        )
      `)
      .eq("article_id", articleId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((c: any) => {
      // Sesuaikan dengan nama kolom di user_profiles (username)
      const profile = c.user_profiles;

      return {
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        user_name: profile?.username ?? "Anonymous",
        user_avatar_url: profile?.avatar_url ?? null,
      };
    });
  },

  async addComment(articleId: string, content: string) {
    // Pastikan user sedang login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Login diperlukan untuk berkomentar");

    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      user_id: user.id, // Sangat penting menyertakan user_id
      content,
    });

    if (error) throw error;
  },
};