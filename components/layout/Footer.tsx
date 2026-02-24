import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface FooterProps {
  locale: string;
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations('common');
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-xl font-bold text-white">PromptAll</span>
            <p className="mt-2 text-sm">{t('tagline')}</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}`} className="hover:text-white">Home</Link></li>
              <li><Link href={`/${locale}/explore`} className="hover:text-white">Explore</Link></li>
              <li><Link href={`/${locale}/prompts`} className="hover:text-white">All Prompts</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/about`} className="hover:text-white">About</Link></li>
              <li><Link href={`/${locale}/privacy`} className="hover:text-white">Privacy</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
          © {new Date().getFullYear()} PromptAll. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
