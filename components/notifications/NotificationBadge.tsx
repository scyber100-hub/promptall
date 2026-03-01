'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  locale: string;
}

export function NotificationBadge({ locale }: NotificationBadgeProps) {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCount = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch('/api/notifications/unread-count');
      if (res.ok) {
        const data = await res.json();
        setCount(data.count ?? 0);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (!session?.user) return;
    fetchCount();
    intervalRef.current = setInterval(fetchCount, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session]);

  if (!session?.user) return null;

  const handleClick = () => {
    setCount(0); // 낙관적 업데이트
    router.push(`/${locale}/notifications`);
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
      aria-label="Notifications"
    >
      <Bell size={18} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
