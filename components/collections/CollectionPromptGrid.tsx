'use client';
import { useState } from 'react';
import { PromptCard } from '@/components/prompts/PromptCard';
import { X } from 'lucide-react';

interface Prompt {
  _id: string;
  title: string;
  description?: string;
  aiTool: string;
  category: string;
  resultImages: string[];
  authorName: string;
  authorUsername: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  slug: string;
}

interface CollectionPromptGridProps {
  initialPrompts: Prompt[];
  slug: string;
  locale: string;
  isOwner: boolean;
}

export function CollectionPromptGrid({
  initialPrompts, slug, locale, isOwner,
}: CollectionPromptGridProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  const handleRemove = async (promptId: string) => {
    setRemoving((prev) => new Set([...prev, promptId]));
    await fetch(`/api/collections/${slug}/prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId }),
    });
    setPrompts((prev) => prev.filter((p) => p._id !== promptId));
    setRemoving((prev) => { const s = new Set(prev); s.delete(promptId); return s; });
  };

  if (prompts.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-12">No prompts in this collection.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <div key={prompt._id} className="relative">
          <PromptCard prompt={prompt} locale={locale} />
          {isOwner && (
            <button
              onClick={() => handleRemove(prompt._id)}
              disabled={removing.has(prompt._id)}
              className="absolute top-2 right-2 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 disabled:opacity-50 shadow-sm transition-colors"
              title="Remove from collection"
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
