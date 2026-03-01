'use client';
import { useState } from 'react';
import { PromptCard } from '@/components/prompts/PromptCard';

interface ProfilePromptsProps {
  initialPrompts: any[];
  total: number;
  username: string;
  locale: string;
}

export function ProfilePrompts({ initialPrompts, total, username, locale }: ProfilePromptsProps) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = prompts.length < total;

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const res = await fetch(`/api/users/${username}/prompts?page=${nextPage}&limit=12`);
    const data = await res.json();
    setPrompts((prev) => [...prev, ...data.prompts]);
    setPage(nextPage);
    setLoading(false);
  };

  return (
    <>
      {prompts.length === 0 ? (
        <p className="text-gray-400 text-sm">No prompts submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt: any) => (
            <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}
