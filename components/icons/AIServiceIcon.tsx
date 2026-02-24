interface AIServiceIconProps {
  tool: string;
  size?: number;
  className?: string;
}

export function AIServiceIcon({ tool, size = 24, className = '' }: AIServiceIconProps) {
  const s = size;

  switch (tool) {
    case 'chatgpt':
      return (
        <svg width={s} height={s} viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.99-3.109 10.079 10.079 0 0 0-9.618 6.977 9.967 9.967 0 0 0-6.69 4.839 10.081 10.081 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.99 3.109 10.079 10.079 0 0 0 9.618-6.978 9.967 9.967 0 0 0 6.69-4.839 10.081 10.081 0 0 0-1.24-11.816zm-17.023 23.625a7.477 7.477 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.106zm-16.134-6.892a7.477 7.477 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103L14.631 35.78a7.505 7.505 0 0 1-10.255-2.177zm-2.09-17.49a7.477 7.477 0 0 1 3.91-3.293A.127.127 0 0 0 6 13v9.199a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L4.868 25.88a7.505 7.505 0 0 1-2.583-9.768zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.048-4.648a7.498 7.498 0 0 1 11.135 7.766zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V20.5z" fill="currentColor"/>
        </svg>
      );

    case 'claude':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="32" height="32" rx="8" fill="#CC785C"/>
          <path d="M16 7C11.03 7 7 11.03 7 16s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 2c1.49 0 2.87.43 4.04 1.17L9.17 20.04A6.96 6.96 0 0 1 8 16c0-3.86 3.14-7 8-7zm0 14c-1.49 0-2.87-.43-4.04-1.17l10.87-10.87A6.96 6.96 0 0 1 24 16c0 3.86-3.14 7-8 7z" fill="white"/>
          <text x="16" y="20.5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white" fontFamily="serif">C</text>
        </svg>
      );

    case 'gemini':
      return (
        <svg width={s} height={s} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M14 28A14 14 0 0 1 14 0a6.222 6.222 0 0 0 0 28z" fill="url(#gemini-a)"/>
          <path d="M14 0a14 14 0 0 1 0 28A6.222 6.222 0 0 0 14 0z" fill="url(#gemini-b)"/>
          <defs>
            <linearGradient id="gemini-a" x1="14" y1="0" x2="14" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1AA1F1"/>
              <stop offset="1" stopColor="#0066CC"/>
            </linearGradient>
            <linearGradient id="gemini-b" x1="14" y1="0" x2="14" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4285F4"/>
              <stop offset="1" stopColor="#1AA1F1"/>
            </linearGradient>
          </defs>
        </svg>
      );

    case 'midjourney':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="24" height="24" rx="6" fill="#000"/>
          <path d="M12 4L4 19h4.5L12 12l3.5 7H20L12 4z" fill="white"/>
          <path d="M8.5 15.5L12 8l3.5 7.5" stroke="white" strokeWidth="0.5" fill="none"/>
        </svg>
      );

    case 'dalle':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="24" height="24" rx="6" fill="#0F9D8E"/>
          <path d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z" fill="white"/>
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="white" opacity="0.7"/>
        </svg>
      );

    case 'stable-diffusion':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="24" height="24" rx="6" fill="#7C3AED"/>
          <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
          <circle cx="12" cy="12" r="2" fill="white"/>
          <path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );

    case 'copilot':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="24" height="24" rx="6" fill="#1464A0"/>
          <path d="M7 8.5C7 7.12 8.12 6 9.5 6S12 7.12 12 8.5V12H7V8.5z" fill="white" opacity="0.9"/>
          <path d="M12 8.5C12 7.12 13.12 6 14.5 6S17 7.12 17 8.5V12h-5V8.5z" fill="white" opacity="0.7"/>
          <rect x="6" y="12" width="12" height="6" rx="3" fill="white"/>
          <circle cx="9.5" cy="15" r="1" fill="#1464A0"/>
          <circle cx="14.5" cy="15" r="1" fill="#1464A0"/>
        </svg>
      );

    case 'perplexity':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="24" height="24" rx="6" fill="#20B2AA"/>
          <path d="M12 5l2.5 4.5H17l-2.5 2.5L16 16l-4-2.5L8 16l1.5-4L7 9.5h2.5L12 5z" fill="white"/>
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="24" height="24" rx="6" fill="#9CA3AF"/>
          <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
      );
  }
}

// Brand colors for text/badges
export const AI_BRAND_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  chatgpt:          { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  claude:           { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200' },
  gemini:           { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  midjourney:       { bg: 'bg-gray-900',   text: 'text-white',       border: 'border-gray-700' },
  dalle:            { bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200' },
  'stable-diffusion': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  copilot:          { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200' },
  perplexity:       { bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200' },
  other:            { bg: 'bg-gray-50',    text: 'text-gray-600',    border: 'border-gray-200' },
};
