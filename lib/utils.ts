import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80) + '-' + Date.now().toString(36);
}

export function formatDate(date: Date | string, locale = 'en'): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export const AI_TOOL_LABELS: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  midjourney: 'Midjourney',
  dalle: 'DALL-E',
  'stable-diffusion': 'Stable Diffusion',
  copilot: 'Copilot',
  perplexity: 'Perplexity',
  other: 'Other',
};

export const AI_TOOL_COLORS: Record<string, string> = {
  chatgpt: 'bg-green-100 text-green-800',
  claude: 'bg-orange-100 text-orange-800',
  gemini: 'bg-blue-100 text-blue-800',
  midjourney: 'bg-purple-100 text-purple-800',
  dalle: 'bg-teal-100 text-teal-800',
  'stable-diffusion': 'bg-pink-100 text-pink-800',
  copilot: 'bg-indigo-100 text-indigo-800',
  perplexity: 'bg-cyan-100 text-cyan-800',
  other: 'bg-gray-100 text-gray-800',
};

export const CATEGORY_LABELS: Record<string, string> = {
  // text
  business: 'Business',
  academic: 'Academic',
  marketing: 'Marketing',
  writing: 'Writing',
  education: 'Education',
  creative: 'Creative',
  productivity: 'Productivity',
  // image
  illustration: 'Illustration',
  photo: 'Photo Real',
  design: 'Design',
  art: 'Art',
  // video
  script: 'Script',
  social: 'Social Media',
  animation: 'Animation',
  // development
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  devops: 'DevOps',
  // shared
  other: 'Other',
};
