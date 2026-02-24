'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n';

const LOCALE_NAMES: Record<string, string> = {
  en: 'English', ko: '한국어', ja: '日本語',
  zh: '中文', es: 'Español', fr: 'Français',
};

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">PromptAll</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href={`/${locale}`} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              {t('nav.home')}
            </Link>
            <Link href={`/${locale}/explore`} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              {t('nav.explore')}
            </Link>
            {session && (
              <Link href={`/${locale}/prompts/new`} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                {t('nav.submit')}
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100"
              >
                <Globe size={16} />
                <span>{LOCALE_NAMES[locale]}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${l === locale ? 'text-indigo-600 font-medium' : 'text-gray-700'}`}
                    >
                      {LOCALE_NAMES[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/bookmarks`}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium hidden md:block"
                >
                  {t('nav.bookmarks')}
                </Link>
                <Link
                  href={`/${locale}/profile/${(session.user as any).username}`}
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  {session.user?.name}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {t('nav.signout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/auth/signin`}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {t('nav.signin')}
                </Link>
                <Link
                  href={`/${locale}/auth/signup`}
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <Link href={`/${locale}`} className="block text-gray-700">{t('nav.home')}</Link>
          <Link href={`/${locale}/explore`} className="block text-gray-700">{t('nav.explore')}</Link>
          {session ? (
            <>
              <Link href={`/${locale}/prompts/new`} className="block text-gray-700">{t('nav.submit')}</Link>
              <Link href={`/${locale}/bookmarks`} className="block text-gray-700">{t('nav.bookmarks')}</Link>
              <button onClick={() => signOut()} className="block text-gray-700">{t('nav.signout')}</button>
            </>
          ) : (
            <>
              <Link href={`/${locale}/auth/signin`} className="block text-gray-700">{t('nav.signin')}</Link>
              <Link href={`/${locale}/auth/signup`} className="block text-gray-700">{t('nav.signup')}</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
