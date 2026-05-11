'use client';

import { useEffect, useRef } from 'react';

let mermaidPromise: Promise<unknown> | null = null;

function loadMermaid() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const w = window as unknown as { mermaid?: unknown };
  if (w.mermaid) return Promise.resolve(w.mermaid);
  if (mermaidPromise) return mermaidPromise;
  mermaidPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.async = true;
    script.onload = () => resolve((window as unknown as { mermaid: unknown }).mermaid);
    script.onerror = () => reject(new Error('Failed to load mermaid'));
    document.head.appendChild(script);
  });
  return mermaidPromise;
}

type MermaidLib = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, chart: string) => Promise<{ svg: string }>;
};

export default function Mermaid({ chart, idPrefix }: { chart: string; idPrefix: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const m = (await loadMermaid()) as MermaidLib | null;
      if (!m || cancelled || !ref.current) return;
      m.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        themeVariables: {
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
          fontSize: '14px',
        },
        flowchart: { htmlLabels: true, curve: 'basis', useMaxWidth: true },
      });
      const id = `${idPrefix}-${Math.random().toString(36).slice(2, 8)}`;
      try {
        const { svg } = await m.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = `<pre style="color:#b91c1c;font-size:12px;white-space:pre-wrap">${String(err)}</pre>`;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, idPrefix]);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        background: '#FFFFFF',
        border: '1px solid rgba(15,23,42,0.10)',
        borderRadius: 16,
        padding: 28,
        overflowX: 'auto',
      }}
    />
  );
}
