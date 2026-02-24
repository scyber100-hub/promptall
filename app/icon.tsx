import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(145deg, #8b5cf6 0%, #6d28d9 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '7px',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {/* Main 4-pointed sparkle star */}
        <path
          d="M10 3.5 L11.6 8.9 L17 10.5 L11.6 12.1 L10 17.5 L8.4 12.1 L3 10.5 L8.4 8.9 Z"
          fill="white"
        />
        {/* Small sparkle top-right */}
        <path
          d="M18.5 2.5 L19.3 4.7 L21.5 5.5 L19.3 6.3 L18.5 8.5 L17.7 6.3 L15.5 5.5 L17.7 4.7 Z"
          fill="white"
        />
        {/* Tiny dot accent */}
        <circle cx="20.5" cy="13" r="1" fill="white" opacity="0.75" />
      </svg>
    </div>,
    { ...size }
  );
}
