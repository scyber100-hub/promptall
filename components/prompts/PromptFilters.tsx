'use client';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';

const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity', 'other'];
const GENERATION_TYPES = ['text', 'image', 'video', 'development'];
const CATEGORIES_BY_TYPE: Record<string, string[]> = {
  text: ['business', 'academic', 'marketing', 'writing', 'education', 'creative', 'productivity', 'other'],
  image: ['illustration', 'photo', 'design', 'art', 'other'],
  video: ['script', 'social', 'animation', 'other'],
  development: ['frontend', 'backend', 'database', 'devops', 'other'],
};
const ALL_CATEGORIES = ['business', 'academic', 'marketing', 'writing', 'education', 'creative', 'productivity', 'illustration', 'photo', 'design', 'art', 'script', 'social', 'animation', 'frontend', 'backend', 'database', 'devops', 'other'];

export function PromptFilters() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const aiTool = searchParams.get('aiTool') || 'all';
  const generationType = searchParams.get('generationType') || 'all';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'latest';

  const categories = generationType !== 'all' ? CATEGORIES_BY_TYPE[generationType] || ALL_CATEGORIES : ALL_CATEGORIES;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === 'all' || value === '') params.delete(key);
      else params.set(key, value);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: search });
  };

  const handleGenerationTypeChange = (gt: string) => {
    // When switching generation type, also reset category
    updateParams({ generationType: gt, category: 'all' });
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
            onClick={() => updateParams({ sort: s })}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              sort === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t(`prompts.sort_${s}`)}
          </button>
        ))}
      </div>

      {/* Generation Types */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('generation_types.all')}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGenerationTypeChange('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              generationType === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('generation_types.all')}
          </button>
          {GENERATION_TYPES.map((gt) => (
            <button
              key={gt}
              onClick={() => handleGenerationTypeChange(gt)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                generationType === gt ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`generation_types.${gt}` as any)}
            </button>
          ))}
        </div>
      </div>

      {/* Categories (dynamic based on generation type) */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('categories.all')}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams({ category: 'all' })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              category === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('categories.all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParams({ category: cat })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`categories.${cat}` as any)}
            </button>
          ))}
        </div>
      </div>

      {/* AI Tools */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('ai_tools.all')}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams({ aiTool: 'all' })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              aiTool === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('ai_tools.all')}
          </button>
          {AI_TOOLS.map((tool) => (
            <button
              key={tool}
              onClick={() => updateParams({ aiTool: tool })}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                aiTool === tool ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`ai_tools.${tool}` as any)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
