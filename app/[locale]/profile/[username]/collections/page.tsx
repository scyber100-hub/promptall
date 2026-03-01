import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Collection from '@/models/Collection';
import { notFound } from 'next/navigation';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CollectionsProfilePageProps {
  params: Promise<{ locale: string; username: string }>;
}

export default async function CollectionsProfilePage({ params }: CollectionsProfilePageProps) {
  const { locale, username } = await params;
  const t = await getTranslations('collections');
  const tp = await getTranslations('profile');

  await connectDB();
  const user = await User.findOne({ username }).lean();
  if (!user) notFound();

  const session = await getServerSession(authOptions);
  const isOwner = session?.user && (session.user as any).id === (user as any)._id.toString();

  const filter = isOwner
    ? { owner: (user as any)._id }
    : { owner: (user as any)._id, isPublic: true };

  const rawCollections = await Collection.find(filter).sort({ createdAt: -1 }).lean();

  const collections = rawCollections.map((c: any) => ({
    ...c,
    _id: c._id.toString(),
    owner: c.owner.toString(),
    prompts: c.prompts.map((p: any) => p.toString()),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/profile/${username}`} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{tp('collections_tab')}</h1>
            <p className="text-sm text-gray-400">@{username}</p>
          </div>
        </div>
        {isOwner && (
          <Link
            href={`/${locale}/collections/new`}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            {t('new_title')}
          </Link>
        )}
      </div>

      {collections.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-12">{t('no_collections')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((c: any) => (
            <CollectionCard key={c._id} collection={c} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
