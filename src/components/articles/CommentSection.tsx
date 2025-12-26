import React, { useEffect, useState } from "react";
import { commentsApi } from "@/lib/api"; 
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { CommentWithUser } from "@/types";

const CommentSection: React.FC<{ articleId: string }> = ({ articleId }) => {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    if (!articleId) return;
    const data = await commentsApi.getCommentsByArticle(articleId);
    setComments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await commentsApi.addComment(articleId, content);
      setContent("");
      toast.success("Komentar terkirim!");
      await loadComments();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <p className="text-center py-10 dark:text-gray-400">Memuat diskusi...</p>;

  return (
    <div className="mt-10 border-t dark:border-neutral-800 pt-10">
      <h3 className="text-2xl font-black mb-6 uppercase dark:text-white">
        Diskusi ({comments.length})
      </h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <textarea 
            // FIXED: Tambahkan dark mode support agar teks terlihat saat mengetik
            className="w-full border-2 p-4 rounded-xl outline-none transition-all
                     bg-white dark:bg-neutral-900 
                     border-gray-200 dark:border-neutral-700 
                     text-gray-900 dark:text-white
                     focus:border-emerald-500 dark:focus:border-emerald-500"
            placeholder="Tulis pendapatmu..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="mt-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors">
            Kirim Komentar
          </button>
        </form>
      ) : (
        <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-xl text-center mb-10 border dark:border-neutral-800">
          <p className="mb-4 dark:text-gray-300">Login untuk ikut berdiskusi</p>
          <a href="/signin" className="text-emerald-600 font-bold uppercase hover:underline">Masuk Disini</a>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-4 p-4 bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl shadow-sm">
            <img 
              src={c.user_avatar_url || `https://ui-avatars.com/api/?name=${c.user_name}&background=10b981&color=fff`} 
              className="w-10 h-10 rounded-full border dark:border-neutral-700"
              alt={c.user_name}
            />
            <div className="flex-1">
              {/* FIXED: Menghapus 'uppercase' agar username tampil sesuai aslinya (Mixed Case) */}
              <p className="font-black text-xs text-emerald-600 dark:text-emerald-400">
                {c.user_name}
              </p>
              {/* FIXED: text-gray-700 diubah agar visible di dark mode */}
              <p className="text-gray-700 dark:text-gray-200 mt-1 leading-relaxed">
                {c.content}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-wider">
                {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;