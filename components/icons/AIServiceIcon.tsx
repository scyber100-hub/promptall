interface AIServiceIconProps {
  tool: string;
  size?: number;
  className?: string;
}

export function AIServiceIcon({ tool, size = 24, className = '' }: AIServiceIconProps) {
  const s = size;

  switch (tool) {
    // ── ChatGPT: official OpenAI logo (simple-icons openai path, 24x24)
    case 'chatgpt':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width={s} height={s} rx={s * 0.2} fill="#10A37F"/>
          <path
            d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"
            fill="white"
            transform="scale(0.83) translate(1.7, 1.7)"
          />
        </svg>
      );

    // ── Claude: official Anthropic "A" logo (simple-icons anthropic path)
    case 'claude':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width={s} height={s} rx={s * 0.2} fill="#D97757"/>
          <path
            d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"
            fill="white"
            transform="scale(0.75) translate(4, 3)"
          />
        </svg>
      );

    // ── Gemini: official Google Gemini 4-pointed star (simple-icons googlegemini)
    case 'gemini':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width={s} height={s} rx={s * 0.2} fill="#4285F4"/>
          <path
            d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"
            fill="white"
            transform="scale(0.67) translate(4, 4)"
          />
        </svg>
      );

    // ── Midjourney: official boat/sail logo approximation
    case 'midjourney':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width={s} height={s} rx={s * 0.2} fill="#000000"/>
          <g transform="translate(3, 3) scale(0.75)">
            {/* Midjourney boat/sail shape */}
            <path d="M12 2 L5 20 H19 Z" fill="white" opacity="0.95"/>
            <path d="M12 2 L5 20 H12 Z" fill="white"/>
            <path d="M12 7 L7 20 H12 Z" fill="#555" opacity="0.5"/>
          </g>
        </svg>
      );

    // ── DALL-E: OpenAI logo in teal
    case 'dalle':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width={s} height={s} rx={s * 0.2} fill="#0F9D8E"/>
          <path
            d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"
            fill="white"
            transform="scale(0.83) translate(1.7, 1.7)"
          />
        </svg>
      );

    // ── Stable Diffusion: Stability AI inspired gradient circle
    case 'stable-diffusion':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width={s} height={s} rx={s * 0.2} fill="#7C3AED"/>
          <g transform="translate(3, 3) scale(0.75)">
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
            <circle cx="12" cy="12" r="2" fill="white"/>
            <line x1="12" y1="3" x2="12" y2="1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="23" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="12" x2="1" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="23" y1="12" x2="21" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </g>
        </svg>
      );

    // ── Copilot: official GitHub Copilot logo (simple-icons githubcopilot)
    case 'copilot':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width={s} height={s} rx={s * 0.2} fill="#0078D4"/>
          <path
            d="M23.922 16.997C23.061 18.492 18.063 22.02 12 22.02 5.937 22.02.939 18.492.078 16.997A.641.641 0 0 1 0 16.741v-2.869a.883.883 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.098 10.098 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952C7.255 2.937 9.248 1.98 11.978 1.98c2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.841.841 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256Zm-11.75-5.992h-.344a4.359 4.359 0 0 1-.355.508c-.77.947-1.918 1.492-3.508 1.492-1.725 0-2.989-.359-3.782-1.259a2.137 2.137 0 0 1-.085-.104L4 11.746v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.359 4.359 0 0 1-.355-.508Zm2.328 3.25c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm-5 0c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm3.313-6.185c.136 1.057.403 1.913.878 2.497.442.544 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.15.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.319-.862-2.824-1.025-1.487-.161-2.192.138-2.533.529-.269.307-.437.808-.438 1.578v.021c0 .265.021.562.063.893Zm-1.626 0c.042-.331.063-.628.063-.894v-.02c-.001-.77-.169-1.271-.438-1.578-.341-.391-1.046-.69-2.533-.529-1.505.163-2.347.537-2.824 1.025-.462.472-.705 1.179-.705 2.319 0 1.211.175 1.926.558 2.361.365.414 1.084.751 2.657.751 1.21 0 1.902-.394 2.344-.938.475-.584.742-1.44.878-2.497Z"
            fill="white"
            transform="scale(0.78) translate(2.6, 2.6)"
          />
        </svg>
      );

    // ── Perplexity: official Perplexity logo (simple-icons perplexity)
    case 'perplexity':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width={s} height={s} rx={s * 0.2} fill="#1FB8CD"/>
          <path
            d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z"
            fill="white"
            transform="scale(0.7) translate(3.5, 3.5)"
          />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width={s} height={s} rx={s * 0.2} fill="#9CA3AF"/>
          <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M12 9v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
  }
}

export const AI_BRAND_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  chatgpt:            { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
  claude:             { bg: 'bg-orange-50',   text: 'text-orange-700',  border: 'border-orange-200' },
  gemini:             { bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200' },
  midjourney:         { bg: 'bg-gray-900',    text: 'text-white',       border: 'border-gray-700' },
  dalle:              { bg: 'bg-teal-50',     text: 'text-teal-700',    border: 'border-teal-200' },
  'stable-diffusion': { bg: 'bg-purple-50',   text: 'text-purple-700',  border: 'border-purple-200' },
  copilot:            { bg: 'bg-sky-50',      text: 'text-sky-700',     border: 'border-sky-200' },
  perplexity:         { bg: 'bg-cyan-50',     text: 'text-cyan-700',    border: 'border-cyan-200' },
  other:              { bg: 'bg-gray-50',     text: 'text-gray-600',    border: 'border-gray-200' },
};
