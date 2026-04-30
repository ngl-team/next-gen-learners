'use client';

import type { ReactNode } from 'react';

export default function Marquee({ children, speed = 40 }: { children: ReactNode; speed?: number }) {
  return (
    <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
      <style>{`
        @keyframes dh-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .dh-marquee-track { display: flex; width: max-content; animation: dh-marquee ${speed}s linear infinite; }
        .dh-marquee-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .dh-marquee-track { animation: none; } }
      `}</style>
      <div className="dh-marquee-track">
        <div style={{ display: 'flex', gap: 48, paddingRight: 48 }}>{children}</div>
        <div aria-hidden="true" style={{ display: 'flex', gap: 48, paddingRight: 48 }}>{children}</div>
      </div>
    </div>
  );
}
