'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserPlus, UserCheck } from 'lucide-react';

interface FollowButtonProps {
  username: string;
  targetUserId: string;
}

export function FollowButton({ username, targetUserId }: FollowButtonProps) {
  const { data: session } = useSession();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentUserId = (session?.user as any)?.id;

  useEffect(() => {
    if (!session?.user) return;
    fetch(`/api/users/${username}/follow`)
      .then((r) => r.json())
      .then((d) => setFollowing(d.following))
      .catch(() => {});
  }, [session, username]);

  if (!session?.user || currentUserId === targetUserId) return null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${username}/follow`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) setFollowing(data.following);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        following
          ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      }`}
    >
      {following ? <UserCheck size={15} /> : <UserPlus size={15} />}
      {following ? 'Following' : 'Follow'}
    </button>
  );
}
