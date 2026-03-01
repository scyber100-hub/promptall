'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface EditProfileButtonProps {
  targetUserId: string;
  locale: string;
}

export function EditProfileButton({ targetUserId, locale }: EditProfileButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('profile');

  const isOwner = (session?.user as any)?.id === targetUserId;
  if (!isOwner) return null;

  return (
    <button
      onClick={() => router.push(`/${locale}/settings/profile`)}
      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
    >
      <Pencil size={14} />
      {t('edit_profile')}
    </button>
  );
}
