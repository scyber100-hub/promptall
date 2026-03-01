import Link from 'next/link';
import { BookOpen, Lock } from 'lucide-react';

interface CollectionCardProps {
  collection: {
    _id: string;
    title: string;
    description?: string;
    slug: string;
    isPublic: boolean;
    promptCount: number;
    owner?: { name: string; username: string };
  };
  locale: string;
}

export function CollectionCard({ collection, locale }: CollectionCardProps) {
  return (
    <Link href={`/${locale}/collections/${collection.slug}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-500 shrink-0 mt-0.5" />
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{collection.title}</h3>
          </div>
          {!collection.isPublic && <Lock size={14} className="text-gray-400 shrink-0" />}
        </div>
        {collection.description && (
          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{collection.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{collection.promptCount} prompts</span>
          {collection.owner && <span>@{collection.owner.username}</span>}
        </div>
      </div>
    </Link>
  );
}
