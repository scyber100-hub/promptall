import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-logo',
  weight: ['700'],
});

const BASE_URL = 'https://promptall.net';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PromptAll — Discover & Share the Best AI Prompts',
    template: '%s | PromptAll',
  },
  description:
    'Discover, share, and explore top-quality AI prompts for ChatGPT, Claude, Gemini, Midjourney, DALL-E and more. The global community for AI prompt enthusiasts.',
  keywords: ['AI prompts', 'ChatGPT prompts', 'Claude prompts', 'Midjourney prompts', 'prompt engineering', 'AI tools'],
  authors: [{ name: 'PromptAll' }],
  creator: 'PromptAll',
  openGraph: {
    type: 'website',
    siteName: 'PromptAll',
    url: BASE_URL,
    title: 'PromptAll — Discover & Share the Best AI Prompts',
    description:
      'Discover, share, and explore top-quality AI prompts for ChatGPT, Claude, Gemini, Midjourney, DALL-E and more.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'PromptAll — Discover & Share the Best AI Prompts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptAll — Discover & Share the Best AI Prompts',
    description:
      'Discover, share, and explore top-quality AI prompts for ChatGPT, Claude, Gemini, Midjourney and more.',
    images: ['/opengraph-image'],
    creator: '@promptall',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon',
  },
  alternates: {
    canonical: BASE_URL,
  },
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
      <body className={`${inter.className} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  );
}
