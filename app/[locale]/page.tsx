import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import { PromptCard } from '@/components/prompts/PromptCard';
import { AdBanner } from '@/components/ads/AdBanner';
import { Zap, TrendingUp, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity'];
const AI_TOOL_LABELS: Record<string, string> = {
  chatgpt: 'ChatGPT', claude: 'Claude', gemini: 'Gemini', midjourney: 'Midjourney',
  dalle: 'DALL-E', 'stable-diffusion': 'Stable Diffusion', copilot: 'Copilot', perplexity: 'Perplexity',
};
const AI_TOOL_COLORS: Record<string, string> = {
  chatgpt: 'bg-green-500', claude: 'bg-orange-500', gemini: 'bg-blue-500', midjourney: 'bg-purple-500',
  dalle: 'bg-teal-500', 'stable-diffusion': 'bg-pink-500', copilot: 'bg-indigo-500', perplexity: 'bg-cyan-500',
};

function serializePrompt(prompt: any) {
  return {
    ...prompt,
    _id: prompt._id.toString(),
    author: prompt.author?.toString() ?? null,
    resultImages: prompt.resultImages ?? [],
    createdAt: prompt.createdAt?.toISOString() ?? '',
    updatedAt: prompt.updatedAt?.toISOString() ?? '',
  };
}

async function getFeaturedPrompts() {
  try {
    await connectDB();
    const [latest, popular] = await Promise.all([
      Prompt.find({ status: 'active' }).sort({ createdAt: -1 }).limit(8).lean(),
      Prompt.find({ status: 'active' }).sort({ likeCount: -1 }).limit(4).lean(),
    ]);
    return {
      latest: latest.map(serializePrompt),
      popular: popular.map(serializePrompt),
    };
  } catch {
    return { latest: [], popular: [] };
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { latest, popular } = await getFeaturedPrompts();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover the Best AI Prompts
          </h1>
          <p className="text-xl text-indigo-100 mb-8">
            Share, explore, and get inspired by thousands of prompts for ChatGPT, Claude, Midjourney and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/prompts`}
              className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
            >
              Browse Prompts
            </Link>
            <Link
              href={`/${locale}/prompts/new`}
              className="px-8 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-400 border border-indigo-400 transition-colors"
            >
              Submit Prompt
            </Link>
          </div>
        </div>
      </section>

      {/* AdBanner - Top */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <AdBanner adSlot="1234567890" adFormat="horizontal" />
      </div>

      {/* Explore by AI Tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore by AI Tool</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AI_TOOLS.map((tool) => (
            <Link
              key={tool}
              href={`/${locale}/prompts?aiTool=${tool}`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className={`w-3 h-3 rounded-full ${AI_TOOL_COLORS[tool]}`} />
              <span className="font-medium text-gray-700">{AI_TOOL_LABELS[tool]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Prompts */}
      {popular.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-indigo-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Most Popular</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map((prompt: any) => (
              <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Prompts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="text-indigo-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Latest Prompts</h2>
          </div>
          <Link href={`/${locale}/prompts`} className="text-indigo-600 hover:underline text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latest.map((prompt: any) => (
            <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
          ))}
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <AdBanner adSlot="0987654321" />
      </div>
    </div>
  );
}
