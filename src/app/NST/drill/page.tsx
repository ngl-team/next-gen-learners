'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../_components/Header';
import QuestionItem, { type Question } from '../_components/QuestionItem';

type Filter = 'all' | 'classes' | 'labs';

export default function DrillPage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [items, setItems] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [filter, setFilter] = useState<Filter>('all');
  const [seed, setSeed] = useState<number>(0);

  const load = useCallback(async (f: Filter, s?: number) => {
    const params = new URLSearchParams({ filter: f });
    if (s) params.set('seed', String(s));
    const data = await fetch(`/api/nst/drill?${params.toString()}`).then((r) => r.json());
    setItems(data.items || []);
    setSeed(data.seed);
    setIdx(0);
  }, []);

  useEffect(() => {
    (async () => {
      const me = await fetch('/api/nst/me').then((r) => r.json());
      if (!me.name) {
        router.push('/NST/login');
        return;
      }
      setName(me.name);
      await load('all');
    })();
  }, [router, load]);

  const onFilter = (f: Filter) => {
    setFilter(f);
    load(f);
  };

  const reshuffle = () => load(filter);

  const total = items?.length ?? 0;
  const current = items?.[idx];
  const goPrev = () => setIdx((i) => Math.max(0, i - 1));
  const goNext = () => setIdx((i) => Math.min(total - 1, i + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) return;
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  return (
    <>
      <Header name={name} />
      <main className="wrap">
        <Link className="back" href="/NST">&larr; back</Link>
        <h1>Open Response Drill</h1>
        <p className="muted">
          One open response question at a time. Type your answer cold, reveal the rubric, count what you missed. Arrow keys navigate. Answers auto-save.
        </p>

        <div className="drill-controls">
          <div className="drill-filters">
            <button
              className={`pill-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => onFilter('all')}
            >
              All
            </button>
            <button
              className={`pill-btn ${filter === 'classes' ? 'active' : ''}`}
              onClick={() => onFilter('classes')}
            >
              Classes only
            </button>
            <button
              className={`pill-btn ${filter === 'labs' ? 'active' : ''}`}
              onClick={() => onFilter('labs')}
            >
              Labs only
            </button>
          </div>
          <button className="ghost" onClick={reshuffle}>Reshuffle</button>
        </div>

        {!items ? (
          <div className="spinner">Loading drill…</div>
        ) : total === 0 ? (
          <div className="muted">No open response questions in this filter.</div>
        ) : (
          <>
            <div className="drill-counter">
              Question {idx + 1} of {total}
              <div className="drill-progress">
                <div className="bar"><div className="fill" style={{ width: `${((idx + 1) / total) * 100}%` }} /></div>
              </div>
            </div>

            {current && (
              <QuestionItem
                key={`${seed}-${current.id}`}
                q={current}
                index={idx}
                classKey={current.class_key || ''}
                mode="drill"
                showTag
              />
            )}

            <div className="drill-nav">
              <button className="ghost big" onClick={goPrev} disabled={idx === 0}>
                &larr; Previous
              </button>
              <span className="muted small">Tip: arrow keys also work</span>
              <button className="primary big" onClick={goNext} disabled={idx >= total - 1}>
                Next &rarr;
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
