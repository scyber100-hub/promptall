'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Heart, MessageCircle, Copy, Bookmark } from 'lucide-react';
import { AI_TOOL_LABELS, AI_TOOL_COLORS, CATEGORY_LABELS, formatDate } from '@/lib/utils';
import { useState } from 'react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

interface PromptCardProps {
  prompt: {
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
    createdAt: string;
    slug: string;
  };
  locale: string;
}

export function PromptCard({ prompt, locale }: PromptCardProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/prompts/${prompt._id}/copy`, { method: 'POST' });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('prompt_copy_card', { prompt_id: prompt._id, ai_tool: prompt.aiTool });
    } catch {}
  };

  return (
    <Link href={`/${locale}/prompts/${prompt.slug || prompt._id}`}>
      <div className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 overflow-hidden group">
        {/* Result image */}
        {prompt.resultImages?.[0] && (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={prompt.resultImages?.[0] ?? ''}
              alt={prompt.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-4">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${AI_TOOL_COLORS[prompt.aiTool] || 'bg-gray-100 text-gray-800'}`}>
              {AI_TOOL_LABELS[prompt.aiTool] || prompt.aiTool}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {CATEGORY_LABELS[prompt.category] || prompt.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
            {prompt.title}
          </h3>

          {/* Description */}
          {prompt.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{prompt.description}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span suppressHydrationWarning>@{prompt.authorUsername} · {formatDate(prompt.createdAt)}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart size={12} />
                {prompt.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {prompt.commentCount}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 hover:text-indigo-600"
                title={copied ? t('common.copied') : t('common.copy')}
              >
                <Copy size={12} />
                {copied ? '✓' : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
