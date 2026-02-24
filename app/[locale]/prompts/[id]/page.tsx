import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import { notFound } from 'next/navigation';
import { LikeButton } from '@/components/social/LikeButton';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { CommentSection } from '@/components/social/CommentSection';
import { AdBanner } from '@/components/ads/AdBanner';
import Image from 'next/image';
import Link from 'next/link';
import { CopyPromptButton } from '@/components/prompts/CopyPromptButton';
import { AI_TOOL_LABELS, AI_TOOL_COLORS, CATEGORY_LABELS, formatDate } from '@/lib/utils';
import { Eye, Copy } from 'lucide-react';
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

  return {
    title: `${(prompt as any).title} | PromptAll`,
    description: (prompt as any).description || (prompt as any).content.slice(0, 160),
    openGraph: {
      title: (prompt as any).title,
      description: (prompt as any).description || (prompt as any).content.slice(0, 160),
      images: (prompt as any).resultImages?.[0] ? [(prompt as any).resultImages[0]] : [],
      type: 'article',
    },
  };
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { locale, id } = await params;
  const prompt = await getPrompt(id);
  if (!prompt) notFound();

  const p = prompt;

  // Increment view count (fire and forget)
  Prompt.findByIdAndUpdate(p._id, { $inc: { viewCount: 1 } }).exec();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${AI_TOOL_COLORS[p.aiTool] || 'bg-gray-100 text-gray-800'}`}>
                {AI_TOOL_LABELS[p.aiTool] || p.aiTool}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                {CATEGORY_LABELS[p.category] || p.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{p.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link href={`/${locale}/profile/${p.authorUsername}`} className="hover:text-indigo-600 font-medium">
                @{p.authorUsername}
              </Link>
              <span>{formatDate(p.createdAt)}</span>
              <span className="flex items-center gap-1"><Eye size={14} /> {p.viewCount}</span>
            </div>
          </div>

          {/* Prompt Content */}
          <div className="bg-gray-900 rounded-xl p-6 mb-6 relative">
            <pre className="text-gray-100 text-sm whitespace-pre-wrap font-mono leading-relaxed pr-16">
              {p.content}
            </pre>
            <CopyPromptButton promptId={p._id.toString()} content={p.content} locale={locale} />
          </div>

          {/* Result Images */}
          {p.resultImages.length > 0 && (
            <div className="mb-6">
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
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Result Text</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{p.resultText}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
            <LikeButton promptId={p._id.toString()} initialCount={p.likeCount} locale={locale} />
            <BookmarkButton promptId={p._id.toString()} locale={locale} />
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
              <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
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
