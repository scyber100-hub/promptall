import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import Prompt from '@/models/Prompt';
import User from '@/models/User';

export const revalidate = 86400; // revalidate every 24 hours

const locales = ['en', 'ko', 'ja', 'zh', 'es', 'fr'];

const GENERATION_TYPES = ['text', 'image', 'video', 'development'];
const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://promptall.net';

  try {
    await connectDB();
    const [prompts, users] = await Promise.all([
      Prompt.find({ status: 'active' }).select('slug updatedAt').limit(5000).lean(),
      User.find({ status: 'active' }).select('username updatedAt').limit(2000).lean(),
    ]);

    const promptUrls = prompts.flatMap((prompt: any) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/prompts/${prompt.slug}`,
        lastModified: new Date(prompt.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    );

    const userUrls = users.flatMap((user: any) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/profile/${user.username}`,
        lastModified: new Date(user.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    );

    const staticUrls = locales.flatMap((locale) => [
      { url: `${baseUrl}/${locale}`, priority: 1.0, changeFrequency: 'daily' as const },
      { url: `${baseUrl}/${locale}/prompts`, priority: 0.9, changeFrequency: 'hourly' as const },
      { url: `${baseUrl}/${locale}/explore`, priority: 0.7, changeFrequency: 'daily' as const },
      ...GENERATION_TYPES.map((type) => ({
        url: `${baseUrl}/${locale}/prompts?generationType=${type}`,
        priority: 0.7,
        changeFrequency: 'daily' as const,
      })),
      ...AI_TOOLS.map((tool) => ({
        url: `${baseUrl}/${locale}/prompts?aiTool=${tool}`,
        priority: 0.65,
        changeFrequency: 'daily' as const,
      })),
    ]);

    return [...staticUrls, ...promptUrls, ...userUrls];
  } catch {
    return locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      priority: 1.0,
    }));
  }
}
