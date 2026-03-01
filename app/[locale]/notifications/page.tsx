'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Bell, Loader2 } from 'lucide-react';

interface NotificationData {
  _id: string;
  type: 'follow' | 'like' | 'comment' | 'comment_reply';
  actorName: string;
  actorUsername: string;
  actorImage?: string;
  promptTitle?: string;
  promptSlug?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const t = useTranslations('notifications');
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?limit=50');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 페이지 진입 시 전체 읽음 처리
  const markAllRead = useCallback(async () => {
    await fetch('/api/notifications/read', { method: 'PATCH' }).catch(() => {});
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/signin`);
      return;
    }
    if (status === 'authenticated') {
      fetchNotifications();
      markAllRead();
    }
  }, [status]);

  const handleRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    fetch(`/api/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {});
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch('/api/notifications/read', { method: 'PATCH' }).catch(() => {});
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-indigo-500" />
          <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
          {unreadCount > 0 && (
            <span className="text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-indigo-600 hover:underline"
          >
            {t('mark_all_read')}
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Bell size={36} className="opacity-30 mb-3" />
            <p className="text-sm">{t('no_notifications')}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <li key={n._id}>
                <NotificationItem
                  notification={n}
                  locale={locale}
                  onRead={handleRead}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
