'use client';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, FileText, Image, Video, Code2, Layers, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const AI_TOOLS = [
  'chatgpt', 'claude', 'gemini', 'midjourney',
  'dalle', 'stable-diffusion', 'copilot', 'perplexity', 'other',
];

const GENERATION_TYPES = ['text', 'image', 'video', 'development'] as const;

const GENERATION_TYPE_ICONS: Record<string, React.ReactNode> = {
  text: <FileText size={15} />,
  image: <Image size={15} />,
  video: <Video size={15} />,
  development: <Code2 size={15} />,
};

const CATEGORIES_BY_TYPE: Record<string, string[]> = {
  text: ['business', 'academic', 'marketing', 'writing', 'education', 'creative', 'productivity'],
  image: ['illustration', 'photo', 'design', 'art'],
  video: ['script', 'social', 'animation'],
  development: ['frontend', 'backend', 'database', 'devops'],
};

const AI_TOOL_COLORS: Record<string, string> = {
  chatgpt: 'bg-emerald-500',
  claude: 'bg-orange-400',
  gemini: 'bg-blue-500',
  midjourney: 'bg-gray-800',
  dalle: 'bg-teal-500',
  'stable-diffusion': 'bg-pink-500',
  copilot: 'bg-indigo-500',
  perplexity: 'bg-cyan-500',
  other: 'bg-gray-400',
};

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

  const categories = generationType !== 'all'
    ? (CATEGORIES_BY_TYPE[generationType] || [])
    : [];

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
    updateParams({ generationType: gt, category: 'all' });
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('common.search_placeholder')}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        />
      </form>

      {/* Sort */}
      <div className="flex gap-1.5">
        {(['latest', 'popular', 'trending'] as const).map((s) => (
          <button
            key={s}
            onClick={() => updateParams({ sort: s })}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sort === s
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t(`prompts.sort_${s}`)}
          </button>
        ))}
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Generation Type — vertical list */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('prompts.filter_type')}</p>
        <div className="space-y-0.5">
          <button
            onClick={() => handleGenerationTypeChange('all')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
              generationType === 'all'
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${generationType === 'all' ? 'bg-indigo-500' : 'bg-gray-300'}`} />
            <Layers size={15} className="flex-shrink-0" />
            {t('prompts.filter_all')}
          </button>
          {GENERATION_TYPES.map((gt) => (
            <button
              key={gt}
              onClick={() => handleGenerationTypeChange(gt)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                generationType === gt
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${generationType === gt ? 'bg-indigo-500' : 'bg-gray-300'}`} />
              {GENERATION_TYPE_ICONS[gt]}
              {t(`generation_types.${gt}` as any)}
              {generationType === gt && (
                <ChevronRight size={13} className="ml-auto text-indigo-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Category — only shown when a type is selected */}
      {generationType !== 'all' && categories.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('prompts.filter_category')}</p>
          <div className="space-y-0.5">
            <button
              onClick={() => updateParams({ category: 'all' })}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                category === 'all'
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${category === 'all' ? 'bg-indigo-500' : 'bg-gray-300'}`} />
              {t('prompts.filter_all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParams({ category: cat })}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  category === cat
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${category === cat ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                {t(`categories.${cat}` as any)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* AI Tools — vertical list with color dot */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('prompts.filter_ai_tool')}</p>
        <div className="space-y-0.5">
          <button
            onClick={() => updateParams({ aiTool: 'all' })}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
              aiTool === 'all'
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex-shrink-0" />
            {t('ai_tools.all')}
          </button>
          {AI_TOOLS.map((tool) => (
            <button
              key={tool}
              onClick={() => updateParams({ aiTool: tool })}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                aiTool === tool
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${AI_TOOL_COLORS[tool]}`} />
              {t(`ai_tools.${tool}` as any)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
