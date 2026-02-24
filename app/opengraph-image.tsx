import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow blobs */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '200px',
          width: '400px',
          height: '400px',
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '180px',
          width: '340px',
          height: '340px',
          background: 'rgba(109, 40, 217, 0.18)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />

      {/* Logo row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Icon box */}
        <div
          style={{
            background: 'linear-gradient(145deg, #8b5cf6 0%, #6d28d9 100%)',
            width: '88px',
            height: '88px',
            borderRadius: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 48px rgba(139,92,246,0.55)',
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path
              d="M10 3.5 L11.6 8.9 L17 10.5 L11.6 12.1 L10 17.5 L8.4 12.1 L3 10.5 L8.4 8.9 Z"
              fill="white"
            />
            <path
              d="M18.5 2.5 L19.3 4.7 L21.5 5.5 L19.3 6.3 L18.5 8.5 L17.7 6.3 L15.5 5.5 L17.7 4.7 Z"
              fill="white"
            />
            <circle cx="20.5" cy="13" r="1" fill="white" opacity="0.75" />
          </svg>
        </div>

        {/* Wordmark */}
        <span
          style={{
            color: 'white',
            fontSize: '68px',
            fontWeight: '800',
            letterSpacing: '-2px',
            fontFamily: 'sans-serif',
          }}
        >
          PromptAll
        </span>
      </div>

      {/* Tagline */}
      <p
        style={{
          color: '#94a3b8',
          fontSize: '30px',
          textAlign: 'center',
          maxWidth: '760px',
          lineHeight: 1.45,
          margin: '0',
          fontFamily: 'sans-serif',
        }}
      >
        Discover &amp; Share the Best AI Prompts
      </p>

      {/* AI tool chips */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '52px',
        }}
      >
        {['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'DALL-E'].map((tool) => (
          <div
            key={tool}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '999px',
              padding: '10px 24px',
              color: 'rgba(255,255,255,0.65)',
              fontSize: '20px',
              fontFamily: 'sans-serif',
            }}
          >
            {tool}
          </div>
        ))}
      </div>

      {/* URL */}
      <p
        style={{
          position: 'absolute',
          bottom: '36px',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '18px',
          fontFamily: 'sans-serif',
          letterSpacing: '0.5px',
        }}
      >
        promptall.net
      </p>
    </div>,
    { ...size }
  );
}
