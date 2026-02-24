'use client';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

interface LikeButtonProps {
  promptId: string;
  initialCount: number;
  initialLiked?: boolean;
  locale: string;
}

export function LikeButton({ promptId, initialCount, initialLiked = false, locale }: LikeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/prompts/${promptId}/like`, { method: 'POST' });
      const data = await res.json();
      setLiked(data.liked);
      setCount((prev) => data.liked ? prev + 1 : prev - 1);
      trackEvent(data.liked ? 'prompt_like' : 'prompt_unlike', { prompt_id: promptId });
    } catch {}
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
      <span>{count}</span>
    </button>
  );
}
