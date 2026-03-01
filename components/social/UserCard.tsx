import Image from 'next/image';
import Link from 'next/link';
import { FollowButton } from './FollowButton';

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    username: string;
    image?: string;
    bio?: string;
    followerCount?: number;
    followingCount?: number;
    promptCount?: number;
  };
  locale: string;
}

export function UserCard({ user, locale }: UserCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
      <Link href={`/${locale}/profile/${user.username}`} className="shrink-0">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
          {user.image ? (
            <Image src={user.image} alt={user.name} width={48} height={48} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-indigo-600">{user.name[0]}</span>
          )}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/${locale}/profile/${user.username}`} className="hover:underline">
            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
            <p className="text-gray-400 text-xs">@{user.username}</p>
          </Link>
          <FollowButton username={user.username} targetUserId={user._id} />
        </div>
        {user.bio && (
          <p className="text-gray-500 text-xs mt-1 line-clamp-2">{user.bio}</p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span>{user.promptCount ?? 0} prompts</span>
          <span>{user.followerCount ?? 0} followers</span>
        </div>
      </div>
    </div>
  );
}
