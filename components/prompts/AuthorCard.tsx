'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { FollowButton } from '@/components/social/FollowButton';

interface AuthorCardProps {
  author: {
    _id: string;
    name: string;
    username: string;
    image: string | null;
    bio: string | null;
    followerCount: number;
  };
  locale: string;
}

export function AuthorCard({ author, locale }: AuthorCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <Link
        href={`/${locale}/profile/${author.username}`}
        className="flex items-center gap-3 mb-3 group"
      >
        {author.image ? (
          <Image
            src={author.image}
            alt={author.name}
            width={44}
            height={44}
            className="rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {author.name[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
            {author.name}
          </p>
          <p className="text-xs text-gray-400">@{author.username}</p>
        </div>
      </Link>

      {author.bio && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{author.bio}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Users size={12} />
          {author.followerCount.toLocaleString()} followers
        </span>
        <FollowButton username={author.username} targetUserId={author._id} />
      </div>
    </div>
  );
}
