'use client';

import { useEffect, useState } from 'react';

type Item = { id: string; label: string };

export default function PaperNav({ items }: { items: Item[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  const handleClick = () => setMobileOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open table of contents"
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden fixed top-4 right-4 z-30 bg-white border border-[#E5E5E0] rounded-md px-3 py-2 text-sm font-medium shadow-sm"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {mobileOpen ? 'Close' : 'Sections'}
      </button>

      <aside
        className={`${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed top-0 left-0 z-20 h-screen w-72 bg-[#F4F2EC] border-r border-[#E5E5E0] overflow-y-auto transition-transform duration-200 ease-out`}
      >
        <div className="px-6 py-8">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#777] mb-4"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Contents
          </p>
          <nav>
            <ul className="space-y-1">
              {items.map((it) => {
                const active = activeId === it.id;
                return (
                  <li key={it.id}>
                    <a
                      href={`#${it.id}`}
                      onClick={handleClick}
                      className={`block py-2 px-3 rounded-md text-sm leading-snug transition-colors ${
                        active
                          ? 'bg-white text-[#1A1A1A] font-semibold shadow-sm'
                          : 'text-[#444] hover:bg-white/60 hover:text-[#1A1A1A]'
                      }`}
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {it.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div
            className="mt-8 pt-6 border-t border-[#E5E5E0] text-[11px] text-[#888]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Brayan Tenesaca. May 2026.
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-10 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
