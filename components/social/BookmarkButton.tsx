'use client';
import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
  promptId: string;
  initialBookmarked?: boolean;
  locale: string;
}

export function BookmarkButton({ promptId, initialBookmarked = false, locale }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/prompts/${promptId}/bookmark`, { method: 'POST' });
      const data = await res.json();
      setBookmarked(data.bookmarked);
    } catch {}
    setLoading(false);
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
        bookmarked
          ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
    </button>
  );
}
