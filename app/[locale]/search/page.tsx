import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import User from '@/models/User';
import { PromptCard } from '@/components/prompts/PromptCard';
import { getTranslations } from 'next-intl/server';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; tab?: string }>;
}

async function searchPrompts(q: string) {
  try {
    await connectDB();
    const rawPrompts = await Prompt.find(
      { status: 'active', $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(24)
      .lean();

    return rawPrompts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      author: p.author?.toString() ?? null,
      resultImages: p.resultImages ?? [],
      translations: p.translations ?? {},
      viewCount: p.viewCount ?? 0,
      createdAt: p.createdAt?.toISOString() ?? '',
      updatedAt: p.updatedAt?.toISOString() ?? '',
    }));
  } catch {
    return [];
  }
}

async function searchUsers(q: string) {
  try {
    await connectDB();
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    const rawUsers = await User.find({
      $or: [{ name: regex }, { username: regex }],
      status: 'active',
    })
      .select('_id name username image bio followerCount promptCount')
      .limit(20)
      .lean();

    return rawUsers.map((u: any) => ({
      ...u,
      _id: u._id.toString(),
    }));
  } catch {
    return [];
  }
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q = '', tab = 'prompts' } = await searchParams;
  const t = await getTranslations('search');
  const tPrompts = await getTranslations('prompts');

  const activeTab = tab === 'users' ? 'users' : 'prompts';

  const [prompts, users] = q
    ? await Promise.all([searchPrompts(q), searchUsers(q)])
    : [[], []];

  const tabBase = `/${locale}/search?q=${encodeURIComponent(q)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
      {q && (
        <p className="text-gray-500 text-sm mb-6">
          &ldquo;<span className="font-medium text-gray-800">{q}</span>&rdquo;
        </p>
      )}

      {!q ? (
        <p className="text-gray-400 text-center py-20">{t('no_query')}</p>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
            <Link
              href={`${tabBase}&tab=prompts`}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'prompts'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t('prompts_tab')}
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                {prompts.length}
              </span>
            </Link>
            <Link
              href={`${tabBase}&tab=users`}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'users'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t('users_tab')}
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                {users.length}
              </span>
            </Link>
          </div>

          {/* Prompts tab */}
          {activeTab === 'prompts' && (
            prompts.length === 0 ? (
              <p className="text-gray-400 text-center py-16">{t('no_results_prompts', { query: q })}</p>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">{t('results_prompts', { count: prompts.length })}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prompts.map((prompt: any) => (
                    <PromptCard key={prompt._id} prompt={prompt} locale={locale} />
                  ))}
                </div>
              </>
            )
          )}

          {/* Users tab */}
          {activeTab === 'users' && (
            users.length === 0 ? (
              <p className="text-gray-400 text-center py-16">{t('no_results_users', { query: q })}</p>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">{t('results_users', { count: users.length })}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {users.map((user: any) => (
                    <Link
                      key={user._id}
                      href={`/${locale}/profile/${user.username}`}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
                        {user.image ? (
                          <Image src={user.image} alt={user.name} width={48} height={48} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-indigo-600">{user.name?.[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                        <p className="text-gray-400 text-xs">@{user.username}</p>
                        {user.bio && <p className="text-gray-500 text-xs mt-0.5 truncate">{user.bio}</p>}
                      </div>
                      <div className="text-right shrink-0 text-xs text-gray-400">
                        <p>{user.promptCount ?? 0} {tPrompts('sort_latest').includes('최') ? '개' : 'prompts'}</p>
                        <p>{user.followerCount ?? 0} followers</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )
          )}
        </>
      )}
    </div>
  );
}
