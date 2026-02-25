'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PromptCard } from '@/components/prompts/PromptCard';
import { Users, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface FollowingFeedProps {
  locale: string;
}

export function FollowingFeed({ locale }: FollowingFeedProps) {
  const { data: session, status } = useSession();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!session?.user || fetched) return;
    setLoading(true);
    fetch('/api/feed')
      .then((r) => r.json())
      .then((d) => {
        setPrompts(d.prompts ?? []);
        setFetched(true);
      })
      .catch(() => setFetched(true))
      .finally(() => setLoading(false));
  }, [session, fetched]);

  if (status === 'loading' || !session?.user) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Following</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">팔로우 피드</h2>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-indigo-400" size={32} />
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">팔로우한 사용자가 없습니다.</p>
          <Link href={`/${locale}/prompts`} className="mt-3 inline-block text-sm text-indigo-600 hover:underline">
            프롬프트 탐색 →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prompts.map((prompt: any) => (
            <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}
