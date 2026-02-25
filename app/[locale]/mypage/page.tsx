import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Prompt from '@/models/Prompt';
import Bookmark from '@/models/Bookmark';
import { redirect } from 'next/navigation';
import { MyPageClient } from '@/components/mypage/MyPageClient';

export const dynamic = 'force-dynamic';

export default async function MyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  await connectDB();
  const userId = (session.user as any).id;

  const [userRaw, rawPrompts, bookmarkDocs] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Prompt.find({ author: userId, status: { $in: ['active', 'hidden'] } })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    Bookmark.find({ userId }).sort({ createdAt: -1 }).limit(50).lean(),
  ]);

  if (!userRaw) redirect(`/${locale}/auth/signin`);

  const user = {
    ...(userRaw as any),
    _id: (userRaw as any)._id.toString(),
    createdAt: (userRaw as any).createdAt?.toISOString() ?? '',
    updatedAt: (userRaw as any).updatedAt?.toISOString() ?? '',
  };

  const prompts = rawPrompts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    author: p.author?.toString() ?? null,
    resultImages: p.resultImages ?? [],
    createdAt: p.createdAt?.toISOString() ?? '',
    updatedAt: p.updatedAt?.toISOString() ?? '',
  }));

  // Fetch bookmarked prompts
  const promptIds = bookmarkDocs.map((b: any) => b.promptId);
  const rawBookmarkedPrompts = await Prompt.find({
    _id: { $in: promptIds },
    status: 'active',
  }).lean();

  const promptMap = Object.fromEntries(
    rawBookmarkedPrompts.map((p: any) => [p._id.toString(), p])
  );
  const bookmarkedPrompts = promptIds
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
    <MyPageClient
      user={user}
      prompts={prompts}
      bookmarkedPrompts={bookmarkedPrompts}
      locale={locale}
    />
  );
}
