'use client';
import { useState } from 'react';
import { Languages, Loader2, X } from 'lucide-react';

interface TranslateButtonProps {
  content: string;
  locale: string;
}

export function TranslateButton({ content, locale }: TranslateButtonProps) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (translated) {
      setTranslated(null);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, targetLocale: locale }),
      });
      const data = await res.json();
      if (res.ok) {
        setTranslated(data.translated);
      } else {
        setError('Translation failed');
      }
    } catch {
      setError('Translation failed');
    }
    setLoading(false);
  };

  const LOCALE_LABELS: Record<string, string> = {
    en: 'EN', ko: '한국어', ja: '日本語', zh: '中文', es: 'ES', fr: 'FR',
  };

  return (
    <div className="mt-3">
      <button
        onClick={handleTranslate}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={13} className="animate-spin" />
        ) : translated ? (
          <X size={13} />
        ) : (
          <Languages size={13} />
        )}
        {translated ? 'Hide translation' : `Translate to ${LOCALE_LABELS[locale] || locale}`}
      </button>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {translated && (
        <div className="mt-3 bg-slate-800 rounded-xl p-5 relative border border-slate-700">
          <div className="absolute top-3 right-3">
            <span className="text-xs font-medium text-slate-400 bg-slate-700 px-2 py-0.5 rounded-md">
              {LOCALE_LABELS[locale] || locale}
            </span>
          </div>
          <pre className="text-slate-100 text-sm whitespace-pre-wrap font-mono leading-relaxed pr-16">
            {translated}
          </pre>
        </div>
      )}
    </div>
  );
}
