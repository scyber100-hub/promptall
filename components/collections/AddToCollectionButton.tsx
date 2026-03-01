'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { FolderPlus, Plus, Check, Loader2, X } from 'lucide-react';

interface Collection {
  _id: string;
  title: string;
  slug: string;
  promptCount: number;
  prompts: string[];
}

interface AddToCollectionButtonProps {
  promptId: string;
}

export function AddToCollectionButton({ promptId }: AddToCollectionButtonProps) {
  const { data: session } = useSession();
  const t = useTranslations('collections');
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !session?.user) return;
    setLoading(true);
    const username = (session.user as any).username;
    fetch(`/api/users/${username}/collections`)
      .then((r) => r.json())
      .then((d) => setCollections(d.collections ?? []))
      .finally(() => setLoading(false));
  }, [open, session]);

  if (!session?.user) return null;

  const handleToggle = async (slug: string) => {
    setActionLoading(slug);
    try {
      const res = await fetch(`/api/collections/${slug}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId }),
      });
      const data = await res.json();
      setCollections((prev) =>
        prev.map((c) => {
          if (c.slug !== slug) return c;
          const prompts = data.added
            ? [...c.prompts, promptId]
            : c.prompts.filter((p) => p !== promptId);
          return { ...c, prompts, promptCount: prompts.length };
        })
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        title={t('add_prompt')}
      >
        <FolderPlus size={15} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-gray-200 w-64 py-2">
            <div className="flex items-center justify-between px-3 pb-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-600">{t('select_collection')}</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 size={18} className="animate-spin text-indigo-400" />
              </div>
            ) : collections.length === 0 ? (
              <div className="px-3 py-3 text-xs text-gray-400 text-center">
                <p className="mb-2">{t('no_collections')}</p>
                <a
                  href={`/collections/new`}
                  className="text-indigo-600 hover:underline"
                >
                  {t('create_new')} →
                </a>
              </div>
            ) : (
              <ul>
                {collections.map((c) => {
                  const isIn = c.prompts.includes(promptId);
                  return (
                    <li key={c._id}>
                      <button
                        onClick={() => handleToggle(c.slug)}
                        disabled={actionLoading === c.slug}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-left">
                          <p className="text-sm text-gray-800 line-clamp-1">{c.title}</p>
                          <p className="text-xs text-gray-400">{c.promptCount} prompts</p>
                        </div>
                        {actionLoading === c.slug ? (
                          <Loader2 size={14} className="animate-spin text-indigo-400" />
                        ) : isIn ? (
                          <Check size={14} className="text-indigo-600" />
                        ) : (
                          <Plus size={14} className="text-gray-400" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
