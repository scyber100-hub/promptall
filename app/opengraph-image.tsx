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
          background: 'rgba(99, 102, 241, 0.18)',
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
          background: 'rgba(124, 58, 237, 0.15)',
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
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(99,102,241,0.5)',
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: '48px',
              fontWeight: '800',
              fontFamily: 'sans-serif',
            }}
          >
            P
          </span>
        </div>
        <span
          style={{
            color: 'white',
            fontSize: '64px',
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

      {/* URL tag */}
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
