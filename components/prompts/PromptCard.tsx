'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Heart, MessageCircle, Copy, Eye } from 'lucide-react';
import { AI_TOOL_LABELS, CATEGORY_LABELS, formatDate } from '@/lib/utils';
import { AIServiceIcon } from '@/components/icons/AIServiceIcon';
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
    viewCount: number;
    createdAt: string;
    slug: string;
  };
  locale: string;
}

export function PromptCard({ prompt, locale }: PromptCardProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const displayTitle = prompt.title;
  const displayDescription = prompt.description;

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
      <div className="card-hover bg-white rounded-2xl border border-slate-200/80 overflow-hidden group h-full flex flex-col">

        {/* Result image or gradient header */}
        {prompt.resultImages?.[0] ? (
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={prompt.resultImages[0]}
              alt={prompt.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
        )}

        <div className="p-5 flex flex-col flex-1">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              <AIServiceIcon tool={prompt.aiTool} size={14} />
              {AI_TOOL_LABELS[prompt.aiTool] || prompt.aiTool}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
              {CATEGORY_LABELS[prompt.category] || prompt.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors leading-snug flex-1">
            {displayTitle}
          </h3>

          {/* Description */}
          {displayDescription && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">{displayDescription}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
            <span className="text-xs text-slate-400" suppressHydrationWarning>
              @{prompt.authorUsername} · {formatDate(prompt.createdAt)}
            </span>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1 text-xs hover:text-rose-500 transition-colors">
                <Heart size={12} />
                {prompt.likeCount}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <MessageCircle size={12} />
                {prompt.commentCount}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Eye size={12} />
                {prompt.viewCount}
              </span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1 text-xs transition-colors ${copied ? 'text-emerald-500' : 'hover:text-indigo-500'}`}
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
