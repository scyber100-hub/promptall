import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import { PromptCard } from '@/components/prompts/PromptCard';
import { PromptFilters } from '@/components/prompts/PromptFilters';
import { AdBanner } from '@/components/ads/AdBanner';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface SearchParamsObj {
  page?: string;
  aiTool?: string;
  generationType?: string;
  category?: string;
  sort?: string;
  q?: string;
}

interface PromptsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParamsObj>;
}

async function getPrompts(searchParams: SearchParamsObj) {
  try {
  await connectDB();

  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const query: Record<string, unknown> = { status: 'active' };

  if (searchParams.aiTool && searchParams.aiTool !== 'all') query.aiTool = searchParams.aiTool;
  if (searchParams.generationType && searchParams.generationType !== 'all') query.generationType = searchParams.generationType;
  if (searchParams.category && searchParams.category !== 'all') query.category = searchParams.category;
  if (searchParams.q) query.$text = { $search: searchParams.q };

  const sortMap: Record<string, [string, 1 | -1][]> = {
    latest: [['createdAt', -1]],
    popular: [['likeCount', -1]],
    trending: [['trendingScore', -1]],
  };
  const sort = sortMap[searchParams.sort || 'latest'] || sortMap.latest;

  const [rawPrompts, total] = await Promise.all([
    Prompt.find(query).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Prompt.countDocuments(query),
  ]);

  const prompts = rawPrompts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    author: p.author?.toString() ?? null,
    resultImages: p.resultImages ?? [],
    createdAt: p.createdAt?.toISOString() ?? '',
    updatedAt: p.updatedAt?.toISOString() ?? '',
  }));

  return { prompts, total, page, pages: Math.ceil(total / limit) };
  } catch {
    const page = parseInt(searchParams.page || '1');
    return { prompts: [], total: 0, page, pages: 0 };
  }
}

export default async function PromptsPage({ params, searchParams }: PromptsPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const { prompts, total, page, pages } = await getPrompts(resolvedSearchParams);
  const t = await getTranslations('prompts');

  const buildUrl = (p: number) => {
    const urlParams = new URLSearchParams(resolvedSearchParams as Record<string, string>);
    urlParams.set('page', p.toString());
    return `/${locale}/prompts?${urlParams.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Ad top */}
      <AdBanner adSlot="1111111111" adFormat="horizontal" className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-64 shrink-0">
          <PromptFilters />
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{t('found', { count: total })}</p>
          </div>

          {prompts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">{t('no_found')}</p>
              <Link href={`/${locale}/prompts/new`} className="mt-4 inline-block text-indigo-600 hover:underline">
                {t('first_submit')}
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {prompts.map((prompt: any, idx) => (
                  <React.Fragment key={prompt._id}>
                    <PromptCard
                      prompt={prompt}
                      locale={locale}
                    />
                    {/* In-feed ad every 6 cards */}
                    {(idx + 1) % 6 === 0 && (
                      <div className="sm:col-span-2 xl:col-span-3">
                        <AdBanner adSlot="2222222222" adFormat="fluid" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {page > 1 && (
                    <Link href={buildUrl(page - 1)} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                      <ChevronLeft size={16} />
                    </Link>
                  )}
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={buildUrl(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium ${
                        p === page ? 'bg-indigo-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < pages && (
                    <Link href={buildUrl(page + 1)} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                      <ChevronRight size={16} />
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
