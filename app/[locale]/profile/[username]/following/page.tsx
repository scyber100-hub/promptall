import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Follow from '@/models/Follow';
import { notFound } from 'next/navigation';
import { UserCard } from '@/components/social/UserCard';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface FollowingPageProps {
  params: Promise<{ locale: string; username: string }>;
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  const { locale, username } = await params;
  const t = await getTranslations('profile');

  await connectDB();
  const user = await User.findOne({ username }).lean();
  if (!user) notFound();

  const follows = await Follow.find({ follower: (user as any)._id })
    .populate('following', 'name username image bio followerCount followingCount promptCount')
    .lean();

  const following = follows.map((f: any) => ({
    ...f.following,
    _id: f.following._id.toString(),
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/${locale}/profile/${username}`} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t('following_title')}</h1>
          <p className="text-sm text-gray-400">@{username}</p>
        </div>
      </div>

      {following.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-12">{t('no_following')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {following.map((u: any) => (
            <UserCard key={u._id} user={u} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
