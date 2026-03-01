'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Heart, MessageCircle, UserPlus, CornerDownRight } from 'lucide-react';

interface NotificationItemProps {
  notification: {
    _id: string;
    type: 'follow' | 'like' | 'comment' | 'comment_reply';
    actorName: string;
    actorUsername: string;
    actorImage?: string;
    promptTitle?: string;
    promptSlug?: string;
    read: boolean;
    createdAt: string;
  };
  locale: string;
  onRead: (id: string) => void;
}

function timeAgo(iso: string, t: ReturnType<typeof useTranslations<'notifications'>>): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return t('just_now');
  if (minutes < 60) return t('minutes_ago', { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t('hours_ago', { count: hours });
  return t('days_ago', { count: Math.floor(hours / 24) });
}

const TYPE_ICON = {
  follow: <UserPlus size={14} className="text-indigo-500" />,
  like: <Heart size={14} className="text-red-500" />,
  comment: <MessageCircle size={14} className="text-emerald-500" />,
  comment_reply: <CornerDownRight size={14} className="text-amber-500" />,
};

export function NotificationItem({ notification: n, locale, onRead }: NotificationItemProps) {
  const t = useTranslations('notifications');

  const href =
    n.type === 'follow'
      ? `/${locale}/profile/${n.actorUsername}`
      : `/${locale}/prompts/${n.promptSlug}`;

  const message =
    n.type === 'follow'
      ? t('follow', { name: n.actorName })
      : n.type === 'like'
      ? t('like', { name: n.actorName, title: n.promptTitle ?? '' })
      : n.type === 'comment'
      ? t('comment', { name: n.actorName, title: n.promptTitle ?? '' })
      : t('comment_reply', { name: n.actorName });

  const handleClick = () => {
    if (!n.read) onRead(n._id);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
        !n.read ? 'bg-indigo-50/40' : ''
      }`}
    >
      {/* Actor avatar */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
          {n.actorImage ? (
            <Image src={n.actorImage} alt={n.actorName} width={40} height={40} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-indigo-600">{n.actorName[0]}</span>
          )}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
          {TYPE_ICON[n.type]}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${!n.read ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
          {message}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.createdAt, t)}</p>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
      )}
    </Link>
  );
}
