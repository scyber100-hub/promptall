'use client';
import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleXShare = () => {
    const text = encodeURIComponent(document.title);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://x.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopyLink}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
          copied
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
        title="Copy link"
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>

      <button
        onClick={handleXShare}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        title="Share on X"
      >
        <XIcon />
        Share
      </button>
    </div>
  );
}
