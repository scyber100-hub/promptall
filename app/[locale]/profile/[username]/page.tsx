import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Prompt from '@/models/Prompt';
import { notFound } from 'next/navigation';
import { PromptCard } from '@/components/prompts/PromptCard';
import { FollowButton } from '@/components/social/FollowButton';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { CalendarDays, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: Promise<{ locale: string; username: string }>;
}

async function getProfileData(username: string) {
  await connectDB();
  const user = await User.findOne({ username }).select('-password -email').lean();
  if (!user) return null;

  const rawPrompts = await Prompt.find({ author: (user as any)._id, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  const prompts = rawPrompts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    author: p.author?.toString() ?? null,
    resultImages: p.resultImages ?? [],
    createdAt: p.createdAt?.toISOString() ?? '',
    updatedAt: p.updatedAt?.toISOString() ?? '',
  }));

  const serializedUser = {
    ...(user as any),
    _id: (user as any)._id.toString(),
    createdAt: (user as any).createdAt?.toISOString() ?? '',
    updatedAt: (user as any).updatedAt?.toISOString() ?? '',
  };

  return { user: serializedUser, prompts };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale, username } = await params;
  const data = await getProfileData(username);
  if (!data) notFound();

  const { user, prompts } = data;
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
            <FollowButton username={u.username} targetUserId={u._id} />
          </div>
          {u.bio && <p className="text-gray-600 text-sm mt-2 mt-2">{u.bio}</p>}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {formatDate(u.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {u.promptCount} prompts
            </span>
          </div>
        </div>
      </div>

      {/* Prompts */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Prompts by @{u.username}</h2>
      {prompts.length === 0 ? (
        <p className="text-gray-400 text-sm">No prompts submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt: any) => (
            <PromptCard
              key={prompt._id}
              prompt={prompt}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
