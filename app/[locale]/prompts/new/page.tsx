'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

const AI_TOOLS = ['chatgpt', 'claude', 'gemini', 'midjourney', 'dalle', 'stable-diffusion', 'copilot', 'perplexity', 'other'];
const CATEGORIES = ['writing', 'coding', 'image', 'business', 'education', 'marketing', 'creative', 'productivity', 'research', 'analysis', 'design', 'other'];

export default function NewPromptPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const t = useTranslations();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '', content: '', description: '',
    aiTool: 'chatgpt', category: 'writing',
    tags: '', resultText: '', resultLink: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push(`/${locale}/auth/signin`);
    }
  }, [session, status, locale, router]);

  if (status === 'loading') return null;
  if (!session) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files.slice(0, 5)) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) uploaded.push(data.url);
    }
    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5),
          resultImages: images,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        trackEvent('prompt_create', { ai_tool: form.aiTool, category: form.category });
        router.push(`/${locale}/prompts/${data.prompt.slug}`);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('prompts.new_title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('prompts.title_label')} *</label>
          <input
            name="title" value={form.title} onChange={handleChange} maxLength={100}
            placeholder={t('prompts.title_placeholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('prompts.ai_tool_label')} *</label>
            <select name="aiTool" value={form.aiTool} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AI_TOOLS.map((tool) => (
                <option key={tool} value={tool}>{t(`ai_tools.${tool}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('prompts.category_label')} *</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('prompts.content_label')} *</label>
          <textarea
            name="content" value={form.content} onChange={handleChange} rows={8} maxLength={5000}
            placeholder={t('prompts.content_placeholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-y"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{form.content.length}/5000</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('prompts.description_label')}</label>
          <input
            name="description" value={form.description} onChange={handleChange} maxLength={200}
            placeholder={t('prompts.description_placeholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('prompts.tags_label')}</label>
          <input
            name="tags" value={form.tags} onChange={handleChange}
            placeholder={t('prompts.tags_placeholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-400 mt-1">Separate with commas (max 5)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('prompts.result_text_label')}</label>
          <textarea
            name="resultText" value={form.resultText} onChange={handleChange} rows={4} maxLength={3000}
            placeholder={t('prompts.result_text_placeholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('prompts.result_link_label')}</label>
          <input
            name="resultLink" value={form.resultLink} onChange={handleChange} maxLength={500}
            placeholder={t('prompts.result_link_placeholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-400 mt-1">{t('prompts.result_link_hint')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('prompts.result_images_label')}</label>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="text-sm" />
          {uploading && <p className="text-sm text-indigo-600 mt-1">Uploading...</p>}
          {images.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                  <button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Submitting...' : t('prompts.submit_btn')}
        </button>
      </form>
    </div>
  );
}
