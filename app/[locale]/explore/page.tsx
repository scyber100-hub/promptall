import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import { AdBanner } from '@/components/ads/AdBanner';
import { AIServiceIcon, AI_BRAND_COLORS } from '@/components/icons/AIServiceIcon';
import { getTranslations } from 'next-intl/server';
import {
  PenLine, Code2, ImageIcon, Briefcase,
  BookOpen, Megaphone, Sparkles, Zap,
  FlaskConical, BarChart2, Palette, Package,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity', 'other'];
const CATEGORIES = ['writing', 'coding', 'image', 'business', 'education', 'marketing', 'creative', 'productivity', 'research', 'analysis', 'design', 'other'];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  writing: PenLine,
  coding: Code2,
  image: ImageIcon,
  business: Briefcase,
  education: BookOpen,
  marketing: Megaphone,
  creative: Sparkles,
  productivity: Zap,
  research: FlaskConical,
  analysis: BarChart2,
  design: Palette,
  other: Package,
};

const CATEGORY_COLORS: Record<string, string> = {
  writing: 'text-blue-600 bg-blue-50',
  coding: 'text-green-600 bg-green-50',
  image: 'text-pink-600 bg-pink-50',
  business: 'text-amber-600 bg-amber-50',
  education: 'text-violet-600 bg-violet-50',
  marketing: 'text-orange-600 bg-orange-50',
  creative: 'text-indigo-600 bg-indigo-50',
  productivity: 'text-yellow-600 bg-yellow-50',
  research: 'text-teal-600 bg-teal-50',
  analysis: 'text-cyan-600 bg-cyan-50',
  design: 'text-rose-600 bg-rose-50',
  other: 'text-gray-600 bg-gray-100',
};

async function getCounts() {
  try {
    await connectDB();
    const [aiCounts, catCounts] = await Promise.all([
      Prompt.aggregate([{ $match: { status: 'active' } }, { $group: { _id: '$aiTool', count: { $sum: 1 } } }]),
      Prompt.aggregate([{ $match: { status: 'active' } }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);
    const aiMap = Object.fromEntries(aiCounts.map((c: any) => [c._id, c.count]));
    const catMap = Object.fromEntries(catCounts.map((c: any) => [c._id, c.count]));
    return { aiMap, catMap };
  } catch {
    return { aiMap: {}, catMap: {} };
  }
}

export default async function ExplorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { aiMap, catMap } = await getCounts();
  const tExplore = await getTranslations('explore');
  const tAI = await getTranslations('ai_tools');
  const tCat = await getTranslations('categories');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{tExplore('title')}</h1>

      {/* AI Tools */}
      <section className="mb-12">
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

      <AdBanner adSlot="5555555555" adFormat="horizontal" className="mb-12" />

      {/* Categories */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{tExplore('by_category')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || Package;
            const colorClass = CATEGORY_COLORS[cat] || 'text-gray-600 bg-gray-100';
            return (
              <Link
                key={cat}
                href={`/${locale}/prompts?category=${cat}`}
                className="flex flex-col items-center gap-2.5 p-5 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all text-center group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                  <Icon size={22} />
                </div>
                <p className="font-medium text-gray-900 text-sm">{tCat(cat as any)}</p>
                <p className="text-xs text-gray-400">{tExplore('prompts_count', { count: catMap[cat] || 0 })}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
