import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Sparkles } from 'lucide-react';

interface FooterProps { locale: string; }

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations('footer');
  const tCommon = await getTranslations('common');

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-10 border-b border-slate-800">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">{tCommon('app_name')}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">{tCommon('tagline')}</p>
            <p className="text-xs mt-4 text-slate-600">{t('tagline')}</p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t('explore')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/prompts`} className="hover:text-white transition-colors">{t('all_prompts')}</Link></li>
              <li><Link href={`/${locale}/explore`} className="hover:text-white transition-colors">{t('explore')}</Link></li>
              <li><Link href={`/${locale}/prompts?sort=trending`} className="hover:text-white transition-colors">{t('trending')}</Link></li>
              <li><Link href={`/${locale}/prompts?sort=popular`} className="hover:text-white transition-colors">{t('popular')}</Link></li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t('ai_tools')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/prompts?aiTool=chatgpt`} className="hover:text-white transition-colors">ChatGPT</Link></li>
              <li><Link href={`/${locale}/prompts?aiTool=claude`} className="hover:text-white transition-colors">Claude</Link></li>
              <li><Link href={`/${locale}/prompts?aiTool=gemini`} className="hover:text-white transition-colors">Gemini</Link></li>
              <li><Link href={`/${locale}/prompts?aiTool=midjourney`} className="hover:text-white transition-colors">Midjourney</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t('account')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/auth/signin`} className="hover:text-white transition-colors">{t('sign_in')}</Link></li>
              <li><Link href={`/${locale}/auth/signup`} className="hover:text-white transition-colors">{t('sign_up')}</Link></li>
              <li><Link href={`/${locale}/prompts/new`} className="hover:text-white transition-colors">{t('submit_prompt')}</Link></li>
              <li><Link href={`/${locale}/bookmarks`} className="hover:text-white transition-colors">{t('bookmarks')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} PromptAll. {t('rights')}</span>
          <div className="flex items-center gap-5">
            <Link href={`/${locale}/privacy`} className="hover:text-slate-400 transition-colors">{t('privacy')}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-slate-400 transition-colors">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
