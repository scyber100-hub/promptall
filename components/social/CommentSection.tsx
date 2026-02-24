'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Trash2, CornerDownRight } from 'lucide-react';
import Image from 'next/image';

interface Comment {
  _id: string;
  authorName: string;
  authorUsername: string;
  authorImage?: string;
  content: string;
  replyCount: number;
  createdAt: string;
  parentId?: string;
}

interface CommentSectionProps {
  promptId: string;
  locale: string;
}

export function CommentSection({ promptId, locale }: CommentSectionProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});

  useEffect(() => {
    loadComments();
  }, [promptId]);

  const loadComments = async () => {
    const res = await fetch(`/api/prompts/${promptId}/comments`);
    const data = await res.json();
    setComments(data.comments || []);
  };

  const loadReplies = async (commentId: string) => {
    const res = await fetch(`/api/prompts/${promptId}/comments?parentId=${commentId}`);
    const data = await res.json();
    setReplies((prev) => ({ ...prev, [commentId]: data.comments || [] }));
    setExpandedReplies((prev) => new Set([...prev, commentId]));
  };

  const submitComment = async (parentId?: string) => {
    if (!session) { router.push(`/${locale}/auth/signin`); return; }
    const text = parentId ? replyContent : content;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId, content: text, parentId }),
      });
      const data = await res.json();
      if (res.ok) {
        if (parentId) {
          setReplies((prev) => ({ ...prev, [parentId]: [data.comment, ...(prev[parentId] || [])] }));
          setReplyContent('');
          setReplyTo(null);
        } else {
          setComments((prev) => [data.comment, ...prev]);
          setContent('');
        }
      }
    } catch {}
    setLoading(false);
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm(t('common.delete'))) return;
    await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  const userId = (session?.user as any)?.id;
  const username = (session?.user as any)?.username;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('comments.title')}</h2>

      {/* Comment form */}
      {session ? (
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('comments.placeholder')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
            />
            <button
              onClick={() => submitComment()}
              disabled={loading || !content.trim()}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {t('comments.submit')}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-6">
          <button onClick={() => router.push(`/${locale}/auth/signin`)} className="text-indigo-600 hover:underline">
            {t('auth.signin_btn')}
          </button>{' '}
          to leave a comment.
        </p>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400">{t('comments.no_comments')}</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm text-gray-900">@{comment.authorUsername}</span>
                  <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                </div>
                {(username === comment.authorUsername) && (
                  <button onClick={() => deleteComment(comment._id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                  className="text-xs text-gray-400 hover:text-indigo-600 flex items-center gap-1"
                >
                  <CornerDownRight size={12} />
                  {t('comments.reply')}
                </button>
                {comment.replyCount > 0 && !expandedReplies.has(comment._id) && (
                  <button onClick={() => loadReplies(comment._id)} className="text-xs text-indigo-600 hover:underline">
                    {t('comments.load_replies', { count: comment.replyCount })}
                  </button>
                )}
              </div>

              {/* Reply form */}
              {replyTo === comment._id && (
                <div className="mt-3 pl-4 border-l-2 border-indigo-200">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={t('comments.reply_placeholder')}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => submitComment(comment._id)}
                      disabled={loading || !replyContent.trim()}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {t('comments.submit')}
                    </button>
                    <button onClick={() => setReplyTo(null)} className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {expandedReplies.has(comment._id) && replies[comment._id]?.map((reply) => (
                <div key={reply._id} className="mt-3 pl-4 border-l-2 border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-xs text-gray-900">@{reply.authorUsername}</span>
                    <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{reply.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
