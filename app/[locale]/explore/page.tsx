import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import { AdBanner } from '@/components/ads/AdBanner';
import { AIServiceIcon, AI_BRAND_COLORS } from '@/components/icons/AIServiceIcon';
import { getTranslations } from 'next-intl/server';
import {
  PenLine, Briefcase, GraduationCap, Megaphone, Sparkles, Zap,
  ImageIcon, Camera, Palette, Paintbrush2,
  Video, Share2, Film,
  Code2, Server, Database, Terminal,
  Package,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity', 'other'];

type GenerationTypeKey = 'text' | 'image' | 'video' | 'development';

const GENERATION_TYPES: { key: GenerationTypeKey; color: string; bg: string; border: string }[] = [
  { key: 'text', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { key: 'image', color: 'text-pink-700', bg: 'bg-pink-50', border: 'border-pink-200' },
  { key: 'video', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'development', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
];

const CATEGORIES_BY_TYPE: Record<GenerationTypeKey, string[]> = {
  text: ['business', 'academic', 'marketing', 'writing', 'education', 'creative', 'productivity', 'other'],
  image: ['illustration', 'photo', 'design', 'art', 'other'],
  video: ['script', 'social', 'animation', 'other'],
  development: ['frontend', 'backend', 'database', 'devops', 'other'],
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  business: Briefcase,
  academic: GraduationCap,
  marketing: Megaphone,
  writing: PenLine,
  education: GraduationCap,
  creative: Sparkles,
  productivity: Zap,
  illustration: Paintbrush2,
  photo: Camera,
  design: Palette,
  art: ImageIcon,
  script: Video,
  social: Share2,
  animation: Film,
  frontend: Code2,
  backend: Server,
  database: Database,
  devops: Terminal,
  other: Package,
};

const CATEGORY_COLORS: Record<string, string> = {
  business: 'text-amber-600 bg-amber-50',
  academic: 'text-violet-600 bg-violet-50',
  marketing: 'text-orange-600 bg-orange-50',
  writing: 'text-blue-600 bg-blue-50',
  education: 'text-purple-600 bg-purple-50',
  creative: 'text-indigo-600 bg-indigo-50',
  productivity: 'text-yellow-600 bg-yellow-50',
  illustration: 'text-pink-600 bg-pink-50',
  photo: 'text-rose-600 bg-rose-50',
  design: 'text-fuchsia-600 bg-fuchsia-50',
  art: 'text-red-600 bg-red-50',
  script: 'text-amber-600 bg-amber-50',
  social: 'text-sky-600 bg-sky-50',
  animation: 'text-orange-600 bg-orange-50',
  frontend: 'text-cyan-600 bg-cyan-50',
  backend: 'text-emerald-600 bg-emerald-50',
  database: 'text-teal-600 bg-teal-50',
  devops: 'text-green-600 bg-green-50',
  other: 'text-gray-600 bg-gray-100',
};

async function getCounts() {
  try {
    await connectDB();
    const [aiCounts, catCounts] = await Promise.all([
      Prompt.aggregate([{ $match: { status: 'active' } }, { $group: { _id: '$aiTool', count: { $sum: 1 } } }]),
      Prompt.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: { generationType: '$generationType', category: '$category' }, count: { $sum: 1 } } },
      ]),
    ]);
    const aiMap = Object.fromEntries(aiCounts.map((c: any) => [c._id, c.count]));
    // Build nested map: catCountMap[generationType][category] = count
    const catCountMap: Record<string, Record<string, number>> = {};
    for (const c of catCounts) {
      const gt = c._id.generationType;
      const cat = c._id.category;
      if (!catCountMap[gt]) catCountMap[gt] = {};
      catCountMap[gt][cat] = c.count;
    }
    return { aiMap, catCountMap };
  } catch {
    return { aiMap: {}, catCountMap: {} };
  }
}

export default async function ExplorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { aiMap, catCountMap } = await getCounts();
  const tExplore = await getTranslations('explore');
  const tAI = await getTranslations('ai_tools');
  const tCat = await getTranslations('categories');
  const tGenType = await getTranslations('generation_types');

  const generationTypeLabels: Record<GenerationTypeKey, string> = {
    text: tGenType('text'),
    image: tGenType('image'),
    video: tGenType('video'),
    development: tGenType('development'),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{tExplore('title')}</h1>

      {/* Generation Type sections */}
      <div className="space-y-10 mb-12">
        {GENERATION_TYPES.map(({ key, color, bg, border }) => {
          const cats = CATEGORIES_BY_TYPE[key];
          const typeCatMap = catCountMap[key] || {};
          return (
            <section key={key}>
              <div className={`flex items-center gap-3 mb-4 px-4 py-2.5 rounded-xl ${bg} border ${border}`}>
                <h2 className={`text-lg font-semibold ${color}`}>{generationTypeLabels[key]}</h2>
                <span className={`text-sm ${color} opacity-70`}>
                  ({cats.reduce((sum, cat) => sum + (typeCatMap[cat] || 0), 0)} {tExplore('prompts_total')})
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {cats.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat] || Package;
                  const colorClass = CATEGORY_COLORS[cat] || 'text-gray-600 bg-gray-100';
                  const count = typeCatMap[cat] || 0;
                  return (
                    <Link
                      key={cat}
                      href={`/${locale}/prompts?generationType=${key}&category=${cat}`}
                      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all text-center group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                        <Icon size={20} />
                      </div>
                      <p className="font-medium text-gray-900 text-sm leading-tight">{tCat(cat as any)}</p>
                      <p className="text-xs text-gray-400">{tExplore('prompts_count', { count })}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <AdBanner adSlot="5555555555" adFormat="horizontal" className="mb-12" />

      {/* AI Tools */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{tExplore('by_ai')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {AI_TOOLS.map((tool) => {
            const colors = AI_BRAND_COLORS[tool] || AI_BRAND_COLORS.other;
            return (
              <Link
                key={tool}
                href={`/${locale}/prompts?aiTool=${tool}`}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${colors.bg} ${colors.border} border`}
              >
                <div className="shrink-0">
                  <AIServiceIcon tool={tool} size={32} />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${colors.text}`}>{tAI(tool as any)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{tExplore('prompts_count', { count: aiMap[tool] || 0 })}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
