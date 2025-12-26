import React, { useEffect, useState, useRef } from "react";
import { commentsApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getOptimizedImage } from "@/lib/utils";
import type { CommentWithUser } from "@/types";

const CommentSection: React.FC<{ articleId: string }> = ({ articleId }) => {
  const { isAuthenticated } = useAuth();

  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const formRef = useRef<HTMLFormElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

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
      await commentsApi.addComment(articleId, content, replyTo?.id || null);
      setContent("");
      setReplyTo(null);
      toast.success(replyTo ? "Reply sent successfully!" : "Comment sent successfully!");
      await loadComments();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const rootComments = comments.filter(c => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter(c => c.parent_id === parentId);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentRootComments = rootComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(rootComments.length / commentsPerPage);

  if (loading) {
    return (
      <p className="text-center py-10 text-neutral-600 dark:text-neutral-400 font-medium">
        Loading discussion...
      </p>
    );
  }

  return (
    <section className="mt-10 border-t border-gray-100 dark:border-neutral-800 pt-10">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-black uppercase dark:text-white">
          Discussion ({comments.length})
        </h2>
        {totalPages > 1 && (
          <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {isAuthenticated ? (
        <form ref={formRef} onSubmit={handleSubmit} className="mb-10 scroll-mt-32">
          {replyTo && (
            <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/20 p-3 mb-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
              <p className="text-sm text-emerald-900 dark:text-emerald-400 font-medium">
                Replying to <span className="font-bold underline">@{replyTo.name}</span>
              </p>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-[10px] bg-white dark:bg-neutral-800 px-3 py-1 rounded shadow-sm text-red-700 dark:text-red-400 font-black tracking-tighter hover:bg-red-50 transition-colors"
              >
                CANCEL
              </button>
            </div>
          )}

          <textarea
            className="w-full border-2 p-4 rounded-xl outline-none transition-all
                       bg-white dark:bg-neutral-900 
                       border-gray-200 dark:border-neutral-700 
                       text-gray-900 dark:text-white
                       focus:border-emerald-700"
            placeholder={
              replyTo
                ? `Write a reply to ${replyTo.name}...`
                : "Write your opinion..."
            }
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            type="submit"
            className="mt-3 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-lg font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/10 transition-all active:scale-95"
          >
            {replyTo ? "Send Reply" : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl text-center mb-10 border border-neutral-100 dark:border-neutral-800">
          <p className="mb-4 text-neutral-700 dark:text-neutral-300 font-bold uppercase text-xs tracking-wider">
            Log in to join the discussion
          </p>
          <a
            href="/signin"
            className="inline-block bg-neutral-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-[.2em] hover:bg-emerald-700 dark:hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95"
          >
            Sign in here
          </a>
        </div>
      )}

      <div className="space-y-8 min-h-[400px]">
        {currentRootComments.length > 0 ? (
          currentRootComments.map((c) => (
            <div key={c.id}>
              <article className="flex gap-4 p-5 bg-white dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800 rounded-2xl">
                <img
                  src={
                    c.user_avatar_url 
                      ? getOptimizedImage(c.user_avatar_url, 100) 
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user_name)}`
                  }
                  className="w-10 h-10 rounded-full object-cover"
                  alt={`Profile picture of ${c.user_name}`}
                  loading="lazy"
                  width="40"
                  height="40"
                />
                <div className="flex-1">
                  <p className="font-black text-xs uppercase">{c.user_name}</p>
                  <p className="mt-2 text-neutral-800 dark:text-neutral-200">{c.content}</p>
                  <button
                    onClick={() => {
                      setReplyTo({ id: c.id, name: c.user_name });
                      formRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-3 text-xs uppercase font-black text-neutral-500 hover:text-emerald-600 transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </article>

              <div className="ml-12 mt-4 space-y-3">
                {getReplies(c.id).map((reply) => (
                  <div key={reply.id} className="text-sm flex gap-3 items-start">
                    <img 
                       src={reply.user_avatar_url ? getOptimizedImage(reply.user_avatar_url, 80) : `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user_name)}`}
                       className="w-6 h-6 rounded-full object-cover"
                       alt=""
                    />
                    <p className="text-neutral-700 dark:text-neutral-400">
                      <strong className="text-black dark:text-white">{reply.user_name}</strong>: {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-neutral-500 uppercase text-xs font-bold tracking-widest">
            No discussions yet. Be the first to comment.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="mt-16 flex justify-center items-center gap-3" aria-label="Pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>
          <span className="text-xs font-bold">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
        </nav>
      )}
    </section>
  );
};

export default CommentSection;