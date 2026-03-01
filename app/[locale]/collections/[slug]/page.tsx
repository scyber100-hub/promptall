import { connectDB } from '@/lib/mongodb';
import Collection from '@/models/Collection';
import Prompt from '@/models/Prompt';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { BookOpen, Lock, ArrowLeft } from 'lucide-react';
import { CollectionManager } from '@/components/collections/CollectionManager';
import { CollectionPromptGrid } from '@/components/collections/CollectionPromptGrid';

export const dynamic = 'force-dynamic';

interface CollectionPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('collections');

  await connectDB();
  const collection = await Collection.findOne({ slug })
    .populate('owner', 'name username image')
    .lean();

  if (!collection) notFound();

  const c = collection as any;
  const session = await getServerSession(authOptions);
  if (!c.isPublic) {
    if (!session?.user || (session.user as any).id !== c.owner._id.toString()) {
      notFound();
    }
  }
  const isOwner = !!session?.user && (session.user as any).id === c.owner._id.toString();

  const rawPrompts = await Prompt.find({ _id: { $in: c.prompts }, status: 'active' })
    .sort({ createdAt: -1 })
    .lean();

  const prompts = rawPrompts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    author: p.author?.toString() ?? null,
    resultImages: p.resultImages ?? [],
    viewCount: p.viewCount ?? 0,
    createdAt: p.createdAt?.toISOString() ?? '',
    updatedAt: p.updatedAt?.toISOString() ?? '',
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href={`/${locale}/profile/${c.owner.username}`} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-4">
          <ArrowLeft size={14} />
          @{c.owner.username}
        </Link>
        <div className="flex items-start gap-3">
          <BookOpen size={24} className="text-indigo-500 mt-1 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{c.title}</h1>
              {!c.isPublic && <Lock size={16} className="text-gray-400" />}
            </div>
            {c.description && <p className="text-gray-500 text-sm mt-1">{c.description}</p>}
            <p className="text-xs text-gray-400 mt-1">
              {t('by_owner', { name: c.owner.name })} · {t('prompts_count', { count: c.promptCount })}
            </p>
          </div>
        </div>
        {isOwner && (
          <CollectionManager
            slug={slug}
            title={c.title}
            description={c.description}
            isPublic={c.isPublic}
            locale={locale}
            ownerUsername={c.owner.username}
          />
        )}
      </div>

      <CollectionPromptGrid
        initialPrompts={prompts}
        slug={slug}
        locale={locale}
        isOwner={isOwner}
      />
    </div>
  );
}
