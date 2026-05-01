'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type SplitWordsProps = {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  style?: CSSProperties;
  baseDelay?: number;
  perWordDelay?: number;
  duration?: number;
  triggerOnLoad?: boolean;
  startVisible?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export default function SplitWords({
  children,
  as: Tag = 'h2',
  className,
  style,
  baseDelay = 0,
  perWordDelay = 70,
  duration = 900,
  triggerOnLoad = false,
  startVisible = false,
  prefix,
  suffix,
}: SplitWordsProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(startVisible);

  useEffect(() => {
    if (triggerOnLoad) {
      const t = window.setTimeout(() => setShown(true), 30);
      return () => window.clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerOnLoad]);

  const words = children.split(' ');

  const wrapStyle: CSSProperties = {
    display: 'inline-block',
    overflow: 'hidden',
    verticalAlign: 'bottom',
    paddingBottom: '0.08em',
    paddingTop: '0.04em',
    lineHeight: 'inherit',
    marginRight: '0.28em',
  };

  const innerBase: CSSProperties = {
    display: 'inline-block',
    transform: shown ? 'translateY(0)' : 'translateY(110%)',
    opacity: shown ? 1 : 0,
    willChange: 'transform, opacity',
  };

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement> as never}
      className={className}
      style={{ ...style, lineHeight: style?.lineHeight ?? 1.04 }}
      aria-label={children}
    >
      {prefix}
      {words.map((w, i) => {
        const delay = baseDelay + i * perWordDelay;
        return (
          <span key={`${w}-${i}`} style={wrapStyle} aria-hidden="true">
            <span
              style={{
                ...innerBase,
                transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity ${Math.round(duration * 0.7)}ms ease ${delay}ms`,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
      {suffix}
    </Tag>
  );
}
