import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import { AdBanner } from '@/components/ads/AdBanner';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity', 'other'];
const CATEGORIES = ['writing', 'coding', 'image', 'business', 'education', 'marketing', 'creative', 'productivity', 'research', 'analysis', 'design', 'other'];

const AI_TOOL_COLORS: Record<string, string> = {
  chatgpt: 'bg-green-500', claude: 'bg-orange-500', gemini: 'bg-blue-500', midjourney: 'bg-purple-500',
  dalle: 'bg-teal-500', 'stable-diffusion': 'bg-pink-500', copilot: 'bg-indigo-500', perplexity: 'bg-cyan-500', other: 'bg-gray-400',
};
const CATEGORY_ICONS: Record<string, string> = {
  writing: '✍️', coding: '💻', image: '🎨', business: '💼',
  education: '📚', marketing: '📣', creative: '🌟', productivity: '⚡',
  research: '🔬', analysis: '📊', design: '🖌️', other: '📦',
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
          {AI_TOOLS.map((tool) => (
            <Link
              key={tool}
              href={`/${locale}/prompts?aiTool=${tool}`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className={`w-4 h-4 rounded-full shrink-0 ${AI_TOOL_COLORS[tool]}`} />
              <div>
                <p className="font-medium text-gray-900 text-sm">{tAI(tool as any)}</p>
                <p className="text-xs text-gray-400">{tExplore('prompts_count', { count: aiMap[tool] || 0 })}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AdBanner adSlot="5555555555" adFormat="horizontal" className="mb-12" />

      {/* Categories */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{tExplore('by_category')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/${locale}/prompts?category=${cat}`}
              className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all text-center"
            >
              <span className="text-3xl">{CATEGORY_ICONS[cat]}</span>
              <p className="font-medium text-gray-900 text-sm">{tCat(cat as any)}</p>
              <p className="text-xs text-gray-400">{tExplore('prompts_count', { count: catMap[cat] || 0 })}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
