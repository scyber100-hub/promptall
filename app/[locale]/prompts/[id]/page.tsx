import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import { notFound } from 'next/navigation';
import { LikeButton } from '@/components/social/LikeButton';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { CommentSection } from '@/components/social/CommentSection';
import { AdBanner } from '@/components/ads/AdBanner';
import { AIServiceIcon, AI_BRAND_COLORS } from '@/components/icons/AIServiceIcon';
import Image from 'next/image';
import Link from 'next/link';
import { CopyPromptButton } from '@/components/prompts/CopyPromptButton';
import { TranslateButton } from '@/components/prompts/TranslateButton';
import { ReportButton } from '@/components/prompts/ReportButton';
import { CATEGORY_LABELS, formatDate } from '@/lib/utils';
import { Eye, ExternalLink, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PromptDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

async function getPrompt(id: string) {
  await connectDB();
  const raw = await Prompt.findOne({
    $or: [
      ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : []),
      { slug: id },
    ],
    status: 'active',
  }).lean();
  if (!raw) return null;
  const p = raw as any;
  return {
    ...p,
    _id: p._id.toString(),
    author: p.author?.toString() ?? null,
    resultImages: p.resultImages ?? [],
    tags: p.tags ?? [],
    createdAt: p.createdAt?.toISOString() ?? '',
    updatedAt: p.updatedAt?.toISOString() ?? '',
  };
}

export async function generateMetadata({ params }: PromptDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const prompt = await getPrompt(id);
  if (!prompt) return { title: 'Not Found' };

  const p = prompt as any;
  const title = `${p.title} | PromptAll`;
  const description = p.description || p.content.slice(0, 160);
  const ogImage = p.resultImages?.[0]
    ? [{ url: p.resultImages[0], width: 800, height: 500, alt: p.title }]
    : [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PromptAll' }];

  return {
    title,
    description,
    openGraph: {
      title: p.title,
      description,
      images: ogImage,
      type: 'article',
      siteName: 'PromptAll',
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description,
      images: ogImage.map((i) => i.url),
    },
  };
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { locale, id } = await params;
  const prompt = await getPrompt(id);
  if (!prompt) notFound();

  const p = prompt;
  const brandColors = AI_BRAND_COLORS[p.aiTool] || AI_BRAND_COLORS.other;

  // Increment view count (fire and forget)
  Prompt.findByIdAndUpdate(p._id, { $inc: { viewCount: 1 } }).exec();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {/* AI Tool badge with logo */}
              <span className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium border ${brandColors.bg} ${brandColors.text} ${brandColors.border}`}>
                <AIServiceIcon tool={p.aiTool} size={16} />
                {p.aiTool === 'chatgpt' ? 'ChatGPT'
                  : p.aiTool === 'claude' ? 'Claude'
                  : p.aiTool === 'gemini' ? 'Gemini'
                  : p.aiTool === 'midjourney' ? 'Midjourney'
                  : p.aiTool === 'dalle' ? 'DALL-E'
                  : p.aiTool === 'stable-diffusion' ? 'Stable Diffusion'
                  : p.aiTool === 'copilot' ? 'Copilot'
                  : p.aiTool === 'perplexity' ? 'Perplexity'
                  : p.aiTool}
              </span>
              <span className="text-sm px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {CATEGORY_LABELS[p.category] || p.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{p.title}</h1>
            {p.description && (
              <p className="text-gray-500 text-sm mb-3">{p.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <Link href={`/${locale}/profile/${p.authorUsername}`} className="hover:text-indigo-600 font-medium text-gray-600">
                @{p.authorUsername}
              </Link>
              <span>{formatDate(p.createdAt)}</span>
              <span className="flex items-center gap-1"><Eye size={14} /> {p.viewCount}</span>
            </div>
          </div>

          {/* Prompt Content */}
          <div className="bg-slate-900 rounded-xl p-6 mb-4 relative">
            <pre className="text-slate-100 text-sm whitespace-pre-wrap font-mono leading-relaxed pr-16">
              {p.content}
            </pre>
            <CopyPromptButton promptId={p._id.toString()} content={p.content} locale={locale} />
          </div>

          {/* Translate button */}
          <TranslateButton content={p.content} locale={locale} />

          {/* Result Link */}
          {p.resultLink && (
            <div className="mt-6 mb-4 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-indigo-800">View AI Result</p>
                <p className="text-xs text-indigo-500 mt-0.5 truncate max-w-xs">{p.resultLink}</p>
              </div>
              <a
                href={p.resultLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ExternalLink size={14} />
                Open
              </a>
            </div>
          )}

          {/* Result Images */}
          {p.resultImages.length > 0 && (
            <div className="mt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Result</h2>
              <div className="grid grid-cols-1 gap-4">
                {p.resultImages.map((img: string, idx: number) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-gray-200">
                    <Image
                      src={img}
                      alt={`Result ${idx + 1}`}
                      width={800}
                      height={500}
                      className="w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result Text */}
          {p.resultText && (
            <div className="mt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Result Text</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{p.resultText}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200 mt-6">
            <LikeButton promptId={p._id.toString()} initialCount={p.likeCount} locale={locale} />
            <BookmarkButton promptId={p._id.toString()} locale={locale} />
            <div className="ml-auto">
              <ReportButton promptId={p._id.toString()} />
            </div>
          </div>

          {/* Ad banner */}
          <AdBanner adSlot="3333333333" adFormat="horizontal" className="mb-8" />

          {/* Comments */}
          <CommentSection promptId={p._id.toString()} locale={locale} />
        </div>

        {/* Sidebar */}
        <aside className="lg:w-80 shrink-0 space-y-4">
          <AdBanner adSlot="4444444444" adFormat="rectangle" />

          {/* Tags */}
          {p.tags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                <Tag size={14} className="text-gray-400" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/${locale}/prompts?q=${encodeURIComponent(tag)}`}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Stats</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Likes</dt>
                <dd className="font-medium">{p.likeCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Comments</dt>
                <dd className="font-medium">{p.commentCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Views</dt>
                <dd className="font-medium">{p.viewCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Copies</dt>
                <dd className="font-medium">{p.copyCount}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
