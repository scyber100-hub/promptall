import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PromptAll - Discover & Share the Best AI Prompts',
  description: 'Discover, share, and explore AI prompts for ChatGPT, Claude, Gemini, Midjourney and more. The global community for AI prompt enthusiasts.',
};

const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const validAdsenseId = adsenseId && !adsenseId.includes('XXXXXXXXX') ? adsenseId : null;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        {validAdsenseId && (
          <>
            <meta name="google-adsense-account" content={validAdsenseId} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${validAdsenseId}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
