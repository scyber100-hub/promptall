import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import User from '@/models/User';
import { PromptCard } from '@/components/prompts/PromptCard';
import { FollowingFeed } from '@/components/home/FollowingFeed';
import { AdBanner } from '@/components/ads/AdBanner';
import { AIServiceIcon, AI_BRAND_COLORS } from '@/components/icons/AIServiceIcon';
import {
  ArrowRight, Sparkles, Zap, Globe, Users, TrendingUp, Shield,
  FileText, Image, Video, Code2,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const revalidate = 60; // revalidate every 60 seconds

const AI_TOOLS = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'claude', label: 'Claude' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'dalle', label: 'DALL-E' },
  { id: 'stable-diffusion', label: 'Stable Diffusion' },
  { id: 'copilot', label: 'Copilot' },
  { id: 'perplexity', label: 'Perplexity' },
];

const GENERATION_TYPES = [
  { key: 'text', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { key: 'image', icon: Image, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
  { key: 'video', icon: Video, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { key: 'development', icon: Code2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
];

function serializePrompt(prompt: any) {
  return {
    ...prompt,
    _id: prompt._id.toString(),
    author: prompt.author?.toString() ?? null,
    resultImages: prompt.resultImages ?? [],
    translations: prompt.translations ?? {},
    viewCount: prompt.viewCount ?? 0,
    createdAt: prompt.createdAt?.toISOString() ?? '',
    updatedAt: prompt.updatedAt?.toISOString() ?? '',
  };
}

async function getFeaturedPrompts() {
  try {
    await connectDB();
    const [latest, popular, typeCounts, total, memberCount] = await Promise.all([
      Prompt.find({ status: 'active' }).sort({ createdAt: -1 }).limit(8).lean(),
      Prompt.find({ status: 'active' }).sort({ trendingScore: -1 }).limit(4).lean(),
      Prompt.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$generationType', count: { $sum: 1 } } },
      ]),
      Prompt.countDocuments({ status: 'active' }),
      User.countDocuments(),
    ]);
    const typeCountMap = Object.fromEntries(typeCounts.map((c: any) => [c._id, c.count]));
    return {
      latest: latest.map(serializePrompt),
      popular: popular.map(serializePrompt),
      total,
      memberCount,
      typeCountMap,
    };
  } catch {
    return { latest: [], popular: [], total: 0, memberCount: 0, typeCountMap: {} };
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { latest, popular, total, memberCount, typeCountMap } = await getFeaturedPrompts();
  const t = await getTranslations('home');
  const tGenType = await getTranslations('generation_types');

  const FEATURES = [
    { icon: Sparkles, title: t('feature_quality_title'), desc: t('feature_quality_desc') },
    { icon: Globe, title: t('feature_languages_title'), desc: t('feature_languages_desc') },
    { icon: Zap, title: t('feature_instant_title'), desc: t('feature_instant_desc') },
    { icon: Shield, title: t('feature_community_title'), desc: t('feature_community_desc') },
  ];

  return (
    <div className="min-h-screen">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="dot-pattern w-full h-full" />
        </div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles size={14} className="text-indigo-300" />
            {t('hero_badge')}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            {t('hero_title_1')}
            <span className="block mt-2 bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">
              {t('hero_title_2')}
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/prompts`}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/50 text-base"
            >
              {t('hero_browse')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/prompts/new`}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all backdrop-blur-sm text-base"
            >
              {t('hero_share')}
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-14 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{memberCount > 0 ? `${memberCount}+` : '1K+'}</div>
              <div className="text-xs text-slate-500 mt-0.5">{t('stats_members')}</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{total > 0 ? `${total}+` : '10K+'}</div>
              <div className="text-xs text-slate-500 mt-0.5">{t('stats_prompts')}</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-xs text-slate-500 mt-0.5">{t('stats_ai_tools')}</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">6</div>
              <div className="text-xs text-slate-500 mt-0.5">{t('stats_languages')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AD ─── */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <AdBanner adSlot="1234567890" adFormat="horizontal" />
      </div>

      {/* ─── BROWSE SECTION ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{t('explore_by_ai')}</p>
            <h2 className="text-2xl font-bold text-slate-900">{t('browse_title')}</h2>
          </div>
          <Link href={`/${locale}/explore`} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
            {t('view_all')} <ArrowRight size={14} />
          </Link>
        </div>

        {/* Generation Types — 4 clean cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {GENERATION_TYPES.map(({ key, icon: Icon, color, bg, border }) => (
            <Link
              key={key}
              href={`/${locale}/prompts?generationType=${key}`}
              className={`group flex items-center gap-3 px-4 py-4 rounded-xl border ${bg} ${border} hover:shadow-sm transition-all`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg} border ${border}`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className={`font-semibold text-sm ${color}`}>{tGenType(key as any)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{typeCountMap[key] ?? 0}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <hr className="flex-1 border-gray-100" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('ai_tools_label')}</span>
          <hr className="flex-1 border-gray-100" />
        </div>

        {/* AI Tools — clean horizontal list */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AI_TOOLS.map((tool) => {
            const colors = AI_BRAND_COLORS[tool.id] || AI_BRAND_COLORS.other;
            return (
              <Link
                key={tool.id}
                href={`/${locale}/prompts?aiTool=${tool.id}`}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
              >
                <AIServiceIcon tool={tool.id} size={22} />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{tool.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── POPULAR PROMPTS ─── */}
      {popular.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-indigo-500" />
                  <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{t('trending_badge')}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{t('popular_title')}</h2>
              </div>
              <Link href={`/${locale}/prompts?sort=popular`} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                {t('view_all')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popular.map((prompt: any) => (
                <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FOLLOWING FEED (client, shown only when logged in) ─── */}
      <FollowingFeed locale={locale} />

      {/* ─── LATEST PROMPTS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-violet-500" />
              <span className="text-xs font-semibold text-violet-500 uppercase tracking-wider">{t('fresh_badge')}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t('latest_title')}</h2>
          </div>
          <Link href={`/${locale}/prompts`} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
            {t('view_all')} <ArrowRight size={14} />
          </Link>
        </div>
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latest.map((prompt: any) => (
              <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <Sparkles size={40} className="mx-auto mb-4 opacity-30" />
            <p>{t('no_prompts_empty')}</p>
            <Link href={`/${locale}/prompts/new`} className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
              {t('submit_first')}
            </Link>
          </div>
        )}
      </section>

      {/* ─── FEATURES ─── */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">{t('why_title')}</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">{t('why_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-indigo-300" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-12 overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute inset-0 opacity-10">
            <div className="dot-pattern w-full h-full" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white/90 text-xs font-medium mb-5">
              <Users size={12} /> {t('cta_badge')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              {t('cta_title')}
            </h2>
            <p className="text-indigo-100 mb-8 text-base max-w-xl mx-auto">
              {t('cta_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${locale}/auth/signup`}
                className="px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                {t('cta_primary')}
              </Link>
              <Link href={`/${locale}/prompts`}
                className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 transition-colors">
                {t('cta_secondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM AD ─── */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <AdBanner adSlot="0987654321" />
      </div>
    </div>
  );
}
