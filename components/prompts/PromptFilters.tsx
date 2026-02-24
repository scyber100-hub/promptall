'use client';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity', 'other'];
const CATEGORIES = ['writing', 'coding', 'image', 'business', 'education', 'marketing', 'creative', 'productivity', 'research', 'analysis', 'design', 'other'];

export function PromptFilters() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const aiTool = searchParams.get('aiTool') || 'all';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'latest';

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === '') params.delete(key);
    else params.set(key, value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams('q', search);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('common.search_placeholder')}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </form>

      {/* Sort tabs */}
      <div className="flex gap-2">
        {(['latest', 'popular', 'trending'] as const).map((s) => (
          <button
            key={s}
            onClick={() => updateParams('sort', s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              sort === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t(`prompts.sort_${s}`)}
          </button>
        ))}
      </div>

      {/* AI Tools */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('ai_tools.all')}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams('aiTool', 'all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              aiTool === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('ai_tools.all')}
          </button>
          {AI_TOOLS.map((tool) => (
            <button
              key={tool}
              onClick={() => updateParams('aiTool', tool)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                aiTool === tool ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`ai_tools.${tool}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('categories.all')}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams('category', 'all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              category === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('categories.all')}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParams('category', cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
