import React, { useEffect, useState, useRef } from "react";
import { commentsApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { getOptimizedImage } from "@/lib/utils";
import type { CommentWithUser } from "@/types";
import FormattedDate from "@/components/features/FormattedDate";

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
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">
          Discussion ({comments.length})
        </h2>
        {totalPages > 1 && (
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {isAuthenticated ? (
        <form ref={formRef} onSubmit={handleSubmit} className="mb-12 scroll-mt-32">
          {replyTo && (
            <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/20 p-3 mb-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
              <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium">
                Replying to <span className="font-bold">@{replyTo.name}</span>
              </p>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-[10px] bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-lg shadow-sm text-red-600 dark:text-red-400 font-black tracking-wider hover:bg-red-50 transition-all"
              >
                CANCEL
              </button>
            </div>
          )}

          <textarea
            className="w-full border-2 p-4 rounded-2xl outline-none transition-all
                       bg-white dark:bg-neutral-900 
                       border-gray-200 dark:border-neutral-800 
                       text-gray-900 dark:text-neutral-100
                       focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5"
            placeholder={replyTo ? `Reply to ${replyTo.name}...` : "Share your thoughts..."}
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            type="submit"
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            {replyTo ? "Send Reply" : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="p-10 bg-neutral-50 dark:bg-neutral-900/30 rounded-[2rem] text-center mb-12 border border-dashed border-neutral-200 dark:border-neutral-800">
          <p className="mb-5 text-neutral-600 dark:text-neutral-400 font-bold uppercase text-[10px] tracking-[.2em]">
            Join the conversation
          </p>
          <a
            href="/signin"
            className="inline-block bg-black dark:bg-white text-white dark:text-black px-10 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-[.2em] hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95"
          >
            Sign in to Comment
          </a>
        </div>
      )}

      <div className="space-y-10">
        {currentRootComments.length > 0 ? (
          currentRootComments.map((c) => (
            <div key={c.id} className="group">
              <article className="flex gap-5">
                <img
                  src={c.user_avatar_url ? getOptimizedImage(c.user_avatar_url, 120) : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user_name)}&background=random`}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-neutral-100 dark:ring-neutral-800"
                  alt={c.user_name}
                  width="48"
                  height="48"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {c.user_name}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                      <Clock className="w-2.5 h-2.5" />
                      <FormattedDate dateString={c.created_at} formatString="MMM d, yyyy" />
                    </span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {c.content}
                  </p>
                  <button
                    onClick={() => {
                      setReplyTo({ id: c.id, name: c.user_name });
                      formRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-3 text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-500 hover:underline tracking-widest"
                  >
                    Reply
                  </button>
                </div>
              </article>

              {/* Replies Section */}
              <div className="ml-12 md:ml-16 mt-6 space-y-6 border-l-2 border-neutral-50 dark:border-neutral-900 pl-6">
                {getReplies(c.id).map((reply) => (
                  <div key={reply.id} className="flex gap-4 items-start">
                    <img 
                       src={reply.user_avatar_url ? getOptimizedImage(reply.user_avatar_url, 80) : `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user_name)}&background=random`}
                       className="w-8 h-8 rounded-xl object-cover"
                       alt=""
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-xs dark:text-white">{reply.user_name}</span>
                        <span className="text-[9px] font-bold text-neutral-400 uppercase">
                          <FormattedDate dateString={reply.created_at} formatString="MMM d" />
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-neutral-50/50 dark:bg-neutral-900/20 rounded-[2.5rem] border-2 border-dotted border-neutral-100 dark:border-neutral-800">
            <p className="text-neutral-400 uppercase text-[10px] font-black tracking-[.3em]">
              No discussions yet
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="mt-20 flex justify-center items-center gap-6" aria-label="Pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(p => p - 1);
              window.scrollTo({ top: formRef.current?.offsetTop ? formRef.current.offsetTop - 200 : 0, behavior: 'smooth' });
            }}
            className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-900 disabled:opacity-20 hover:bg-emerald-600 hover:text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-[10px] font-black uppercase tracking-[.2em] text-neutral-500">
            {currentPage} <span className="mx-2">/</span> {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(p => p + 1);
              window.scrollTo({ top: formRef.current?.offsetTop ? formRef.current.offsetTop - 200 : 0, behavior: 'smooth' });
            }}
            className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-900 disabled:opacity-20 hover:bg-emerald-600 hover:text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </nav>
      )}
    </section>
  );
};

export default CommentSection;