import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';
import Prompt from '@/models/Prompt';
import { PromptCard } from '@/components/prompts/PromptCard';
import { redirect } from 'next/navigation';
import { Bookmark as BookmarkIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface BookmarksPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function BookmarksPage({ params, searchParams }: BookmarksPageProps) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  const t = await getTranslations('bookmarks');
  const page = Math.max(1, parseInt(pageParam || '1'));
  const limit = 12;

  await connectDB();
  const userId = (session.user as any).id;

  const [total, bookmarks] = await Promise.all([
    Bookmark.countDocuments({ userId }),
    Bookmark.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  const promptIds = bookmarks.map((b: any) => b.promptId);
  const rawPrompts = await Prompt.find({ _id: { $in: promptIds }, status: 'active' }).lean();

  // Preserve bookmark order
  const promptMap = Object.fromEntries(rawPrompts.map((p: any) => [p._id.toString(), p]));
  const prompts = promptIds
    .map((id: any) => promptMap[id.toString()])
    .filter(Boolean)
    .map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      author: p.author?.toString() ?? null,
      resultImages: p.resultImages ?? [],
      createdAt: p.createdAt?.toISOString() ?? '',
      updatedAt: p.updatedAt?.toISOString() ?? '',
    }));

  const totalPages = Math.ceil(total / limit);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <BookmarkIcon className="text-indigo-600" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <span className="text-sm text-gray-400">({total})</span>
      </div>

      {total === 0 ? (
        <div className="text-center py-20">
          <BookmarkIcon className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg mb-2">{t('empty_title')}</p>
          <p className="text-gray-400 text-sm mb-6">
            {t('empty_desc')}
          </p>
          <Link
            href={`/${locale}/prompts`}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            {t('browse')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.map((prompt: any) => (
              <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              {hasPrev ? (
                <Link
                  href={`/${locale}/bookmarks?page=${page - 1}`}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                  {t('prev')}
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 border border-gray-100 rounded-lg cursor-not-allowed">
                  <ChevronLeft size={16} />
                  {t('prev')}
                </span>
              )}

              <span className="text-sm text-gray-400">
                {page} / {totalPages}
              </span>

              {hasNext ? (
                <Link
                  href={`/${locale}/bookmarks?page=${page + 1}`}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('next')}
                  <ChevronRight size={16} />
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 border border-gray-100 rounded-lg cursor-not-allowed">
                  {t('next')}
                  <ChevronRight size={16} />
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
