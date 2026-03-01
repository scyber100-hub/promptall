'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Check, X } from 'lucide-react';

interface CollectionManagerProps {
  slug: string;
  title: string;
  description?: string;
  isPublic: boolean;
  locale: string;
  ownerUsername: string;
}

export function CollectionManager({
  slug, title, description, isPublic, locale, ownerUsername,
}: CollectionManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [titleVal, setTitleVal] = useState(title);
  const [descVal, setDescVal] = useState(description ?? '');
  const [isPublicVal, setIsPublicVal] = useState(isPublic);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!titleVal.trim()) return;
    setLoading(true);
    await fetch(`/api/collections/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleVal, description: descVal, isPublic: isPublicVal }),
    });
    setLoading(false);
    setEditing(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('Delete this collection?')) return;
    await fetch(`/api/collections/${slug}`, { method: 'DELETE' });
    router.push(`/${locale}/profile/${ownerUsername}/collections`);
  };

  if (editing) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-3">
        <input
          value={titleVal}
          onChange={(e) => setTitleVal(e.target.value)}
          maxLength={100}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <textarea
          value={descVal}
          onChange={(e) => setDescVal(e.target.value)}
          maxLength={500}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublicVal}
            onChange={(e) => setIsPublicVal(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
          />
          Public
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading || !titleVal.trim()}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            <Check size={14} />
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
          >
            <X size={14} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Pencil size={14} />
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  );
}
