'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SettingsProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('settings');

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/${locale}/auth/signin`);
    }
  }, [status, locale, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/users/me')
      .then((r) => r.json())
      .then(({ user }) => {
        if (user) {
          setName(user.name ?? '');
          setBio(user.bio ?? '');
          setImage(user.image ?? '');
          setUsername(user.username ?? '');
        }
      })
      .finally(() => setLoading(false));
  }, [status]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.url) setImage(data.url);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError(t('name_label') + ' is required');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), bio: bio.trim(), image: image.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t('save_error'));
        return;
      }

      await update({ name: name.trim(), image: image.trim() });
      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/profile/${username}`), 1000);
    } catch {
      setError(t('save_error'));
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center text-gray-400">
        Loading...
      </div>
    );
  }

  const avatarSrc = image || session?.user?.image || '';

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link
        href={`/${locale}/profile/${username}`}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        {t('back')}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('profile_title')}</h1>

      {/* Avatar preview */}
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              onError={() => setImage('')}
            />
          ) : (
            <span className="text-3xl font-bold text-indigo-600">
              {name ? name[0].toUpperCase() : '?'}
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('name_label')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('name_placeholder')}
            maxLength={50}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{name.length}/50</p>
        </div>

        {/* Username (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('username_label')}
          </label>
          <input
            type="text"
            value={`@${username}`}
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">{t('username_hint')}</p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('bio_label')}
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t('bio_placeholder')}
            maxLength={200}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/200</p>
        </div>

        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('image_label')}
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Upload size={16} />
              {uploading ? 'Uploading...' : 'Upload Photo'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
            {image && (
              <button
                type="button"
                onClick={() => setImage('')}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">{t('image_hint')}</p>
        </div>

        {/* Error / Success */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{t('save_success')}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? t('saving') : t('save_btn')}
        </button>
      </form>
    </div>
  );
}
