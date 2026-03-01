import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Prompt from '@/models/Prompt';
import { notFound } from 'next/navigation';
import { ProfilePrompts } from '@/components/profile/ProfilePrompts';
import { FollowButton } from '@/components/social/FollowButton';
import { EditProfileButton } from '@/components/profile/EditProfileButton';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, FileText, Heart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: Promise<{ locale: string; username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  await connectDB();
  const user = await User.findOne({ username }).select('name username bio image').lean();
  if (!user) return { title: 'Not Found' };
  const u = user as any;
  return {
    title: `${u.name} (@${u.username}) | PromptAll`,
    description: u.bio || `${u.name}'s prompts on PromptAll`,
    openGraph: {
      title: `${u.name} (@${u.username})`,
      description: u.bio || `${u.name}'s prompts on PromptAll`,
      images: u.image ? [{ url: u.image }] : [{ url: '/opengraph-image' }],
    },
  };
}

async function getProfileData(username: string) {
  await connectDB();
  const user = await User.findOne({ username }).select('-password -email').lean();
  if (!user) return null;

  const [rawPrompts, promptTotal] = await Promise.all([
    Prompt.find({ author: (user as any)._id, status: 'active' })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean(),
    Prompt.countDocuments({ author: (user as any)._id, status: 'active' }),
  ]);

  const prompts = rawPrompts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    author: p.author?.toString() ?? null,
    resultImages: p.resultImages ?? [],
    viewCount: p.viewCount ?? 0,
    createdAt: p.createdAt?.toISOString() ?? '',
    updatedAt: p.updatedAt?.toISOString() ?? '',
    slug: p.slug ?? p._id.toString(),
  }));

  const serializedUser = {
    ...(user as any),
    _id: (user as any)._id.toString(),
    createdAt: (user as any).createdAt?.toISOString() ?? '',
    updatedAt: (user as any).updatedAt?.toISOString() ?? '',
  };

  return { user: serializedUser, prompts, promptTotal };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale, username } = await params;
  const t = await getTranslations('profile');
  const data = await getProfileData(username);
  if (!data) notFound();

  const { user, prompts, promptTotal } = data;
  const u = user as any;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 flex items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
          {u.image ? (
            <Image src={u.image} alt={u.name} width={80} height={80} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-indigo-600">{u.name[0]}</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{u.name}</h1>
              <p className="text-gray-500 text-sm">@{u.username}</p>
            </div>
            <div className="flex items-center gap-2">
              <EditProfileButton targetUserId={u._id} locale={locale} />
              <FollowButton username={u.username} targetUserId={u._id} />
            </div>
          </div>
          {u.bio && <p className="text-gray-600 text-sm mt-2">{u.bio}</p>}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {formatDate(u.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {u.promptCount} prompts
            </span>
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {u.likeCount ?? 0} likes
            </span>
            <Link href={`/${locale}/profile/${u.username}/followers`} className="hover:text-indigo-600 transition-colors">
              <span className="font-semibold text-gray-700">{u.followerCount ?? 0}</span> {t('followers')}
            </Link>
            <Link href={`/${locale}/profile/${u.username}/following`} className="hover:text-indigo-600 transition-colors">
              <span className="font-semibold text-gray-700">{u.followingCount ?? 0}</span> {t('following')}
            </Link>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
        <span className="px-4 py-2 text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600">{t('prompts_tab')}</span>
        <Link href={`/${locale}/profile/${u.username}/collections`} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">{t('collections_tab')}</Link>
      </div>

      {/* Prompts */}
      <h2 className="sr-only">Prompts by @{u.username}</h2>
      <ProfilePrompts
        initialPrompts={prompts}
        total={promptTotal}
        username={u.username}
        locale={locale}
      />
    </div>
  );
}
