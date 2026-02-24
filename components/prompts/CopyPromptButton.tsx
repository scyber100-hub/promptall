'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

interface CopyPromptButtonProps {
  promptId: string;
  content: string;
  locale: string;
}

export function CopyPromptButton({ promptId, content, locale }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    try {
      await fetch(`/api/prompts/${promptId}/copy`, { method: 'POST' });
      trackEvent('prompt_copy', { prompt_id: promptId });
    } catch {}
  };

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
