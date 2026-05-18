'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

export function MermaidDiagram({ chart, id = 'mermaid' }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const uniqueId = useRef(`${id}-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#E8F5E9',
            primaryTextColor: '#1E1B4B',
            primaryBorderColor: '#2E7D32',
            lineColor: '#4F46E5',
            secondaryColor: '#FFF8E1',
            tertiaryColor: '#FFCDD2',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
          },
          flowchart: {
            curve: 'basis',
            padding: 20,
            useMaxWidth: true,
          },
          securityLevel: 'loose',
        });
        const { svg: rendered } = await mermaid.render(uniqueId.current, chart);
        if (!cancelled) setSvg(rendered);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
        <p className="font-semibold mb-2">Diagram failed to render:</p>
        <pre className="text-xs overflow-auto whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-[#1E1B4B]/10 rounded-lg p-4 sm:p-8 overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:block [&_svg]:mx-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
