import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const ICON_SRC = 'data:image/png;base64,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';

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
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        <img src={ICON_SRC} width={88} height={88} />
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
      <div style={{ display: 'flex', gap: '12px', marginTop: '52px' }}>
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
