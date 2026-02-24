import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';
import Prompt from '@/models/Prompt';
import { PromptCard } from '@/components/prompts/PromptCard';
import { redirect } from 'next/navigation';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BookmarksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  await connectDB();
  const userId = (session.user as any).id;

  const bookmarks = await Bookmark.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <BookmarkIcon className="text-indigo-600" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
        <span className="text-sm text-gray-400">({prompts.length})</span>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-20">
          <BookmarkIcon className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg mb-2">No bookmarks yet</p>
          <p className="text-gray-400 text-sm mb-6">
            Save prompts you love by clicking the bookmark icon.
          </p>
          <Link
            href={`/${locale}/prompts`}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Prompts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt: any) => (
            <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
