import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';

export const dynamic = 'force-dynamic';

const locales = ['en', 'ko', 'ja', 'zh', 'es', 'fr'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://promptall.net';

  try {
    await connectDB();
    const prompts = await Prompt.find({ status: 'active' })
      .select('slug updatedAt')
      .limit(1000)
      .lean();

    const promptUrls = prompts.flatMap((prompt: any) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/prompts/${prompt.slug}`,
        lastModified: new Date(prompt.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    );

    const staticUrls = locales.flatMap((locale) => [
      { url: `${baseUrl}/${locale}`, priority: 1.0, changeFrequency: 'daily' as const },
      { url: `${baseUrl}/${locale}/prompts`, priority: 0.9, changeFrequency: 'hourly' as const },
      { url: `${baseUrl}/${locale}/explore`, priority: 0.7, changeFrequency: 'daily' as const },
    ]);

    return [...staticUrls, ...promptUrls];
  } catch {
    return locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      priority: 1.0,
    }));
  }
}
