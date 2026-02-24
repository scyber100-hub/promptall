'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

interface CopyPromptButtonProps {
  promptId: string;
  content: string;
  locale: string;
}

const DAILY_GUEST_LIMIT = 3;

function getGuestCopyCount(): number {
  const today = new Date().toISOString().slice(0, 10);
  const raw = localStorage.getItem(`copy_count_${today}`);
  return raw ? parseInt(raw, 10) : 0;
}

function incrementGuestCopyCount(): void {
  const today = new Date().toISOString().slice(0, 10);
  const current = getGuestCopyCount();
  localStorage.setItem(`copy_count_${today}`, String(current + 1));
}

export function CopyPromptButton({ promptId, content, locale }: CopyPromptButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const handleCopy = async () => {
    // 비로그인 사용자 복사 횟수 제한
    if (!session?.user) {
      const count = getGuestCopyCount();
      if (count >= DAILY_GUEST_LIMIT) {
        setLimitReached(true);
        setTimeout(() => setLimitReached(false), 4000);
        return;
      }
      incrementGuestCopyCount();
    }

    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    try {
      await fetch(`/api/prompts/${promptId}/copy`, { method: 'POST' });
      trackEvent('prompt_copy', { prompt_id: promptId });
    } catch {}
  };

  if (limitReached) {
    return (
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500 text-white">
        <span>Sign in to copy more</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
