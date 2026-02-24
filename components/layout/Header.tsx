'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, Globe, ChevronDown, BookmarkIcon, PenSquare, LogOut, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n';

const LOCALE_NAMES: Record<string, string> = {
  en: 'EN', ko: 'KO', ja: 'JA', zh: 'ZH', es: 'ES', fr: 'FR',
};
const LOCALE_FULL: Record<string, string> = {
  en: 'English', ko: '한국어', ja: '日本語', zh: '中文', es: 'Español', fr: 'Français',
};

interface HeaderProps { locale: string; }

export function Header({ locale }: HeaderProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-violet-200 transition-shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10 3.5 L11.6 8.9 L17 10.5 L11.6 12.1 L10 17.5 L8.4 12.1 L3 10.5 L8.4 8.9 Z" fill="white" />
                <path d="M18.5 2.5 L19.3 4.7 L21.5 5.5 L19.3 6.3 L18.5 8.5 L17.7 6.3 L15.5 5.5 L17.7 4.7 Z" fill="white" />
                <circle cx="20.5" cy="13" r="1" fill="white" opacity="0.75" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-logo)' }}>PromptAll</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href={`/${locale}`} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              {t('nav.home')}
            </Link>
            <Link href={`/${locale}/prompts`} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              {t('nav.browse')}
            </Link>
            <Link href={`/${locale}/explore`} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              {t('nav.explore')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Globe size={14} />
                <span className="font-medium">{LOCALE_NAMES[locale]}</span>
                <ChevronDown size={12} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${l === locale ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-slate-700'}`}
                    >
                      {LOCALE_FULL[l]}
                      {l === locale && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/prompts/new`}
                  className="hidden md:flex items-center gap-1.5 text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                >
                  <PenSquare size={14} />
                  {t('nav.submit')}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <ChevronDown size={12} className="text-slate-400" />
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{session.user?.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{session.user?.email}</p>
                      </div>
                      <Link href={`/${locale}/profile/${(session.user as any).username}`} onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <User size={14} className="text-slate-400" /> My Profile
                      </Link>
                      <Link href={`/${locale}/bookmarks`} onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <BookmarkIcon size={14} className="text-slate-400" /> {t('nav.bookmarks')}
                      </Link>
                      <div className="border-t border-slate-100">
                        <button onClick={() => signOut()}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut size={14} /> {t('nav.signout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/auth/signin`}
                  className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                  {t('nav.signin')}
                </Link>
                <Link href={`/${locale}/auth/signup`}
                  className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                  {t('nav.signup')}
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={18} className="text-slate-600" /> : <Menu size={18} className="text-slate-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm px-4 py-4 space-y-1">
          <Link href={`/${locale}`} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">{t('nav.home')}</Link>
          <Link href={`/${locale}/prompts`} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">{t('nav.browse')}</Link>
          <Link href={`/${locale}/explore`} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">{t('nav.explore')}</Link>
          {session ? (
            <>
              <Link href={`/${locale}/prompts/new`} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">{t('nav.submit')}</Link>
              <Link href={`/${locale}/bookmarks`} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">{t('nav.bookmarks')}</Link>
              <button onClick={() => signOut()} className="block w-full text-left px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 text-sm font-medium">{t('nav.signout')}</button>
            </>
          ) : (
            <>
              <Link href={`/${locale}/auth/signin`} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">{t('nav.signin')}</Link>
              <Link href={`/${locale}/auth/signup`} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold text-center mt-2">{t('nav.signup')}</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
