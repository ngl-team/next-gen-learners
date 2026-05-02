'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../_components/Header';
import flashcardsData from '@/data/nst-flashcards.json';

type Card = { term: string; category: string; definition: string };
type Status = 'unseen' | 'known' | 'review';
type StatusMap = Record<string, Status>;

const STORAGE_KEY = 'nst_flashcard_status_v1';
const CATEGORIES = (flashcardsData as { categories: string[] }).categories;
const ALL_CARDS = (flashcardsData as { cards: Card[] }).cards;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const cardKey = (c: Card) => `${c.category}::${c.term}`;

export default function FlashcardsPage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [showOnly, setShowOnly] = useState<'all' | 'review' | 'unseen'>('all');
  const [deck, setDeck] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState<StatusMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const me = await fetch('/api/nst/me').then((r) => r.json());
      if (!me.name) {
        router.push('/NST/login');
        return;
      }
      setName(me.name);
    })();
  }, [router]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStatus(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
      } catch {}
    }
  }, [status, hydrated]);

  const buildDeck = useCallback(() => {
    let pool = ALL_CARDS;
    if (category !== 'all') pool = pool.filter((c) => c.category === category);
    if (showOnly === 'review') pool = pool.filter((c) => status[cardKey(c)] === 'review');
    if (showOnly === 'unseen') pool = pool.filter((c) => !status[cardKey(c)] || status[cardKey(c)] === 'unseen');
    setDeck(shuffle(pool));
    setIdx(0);
    setFlipped(false);
  }, [category, showOnly, status]);

  useEffect(() => {
    if (hydrated) buildDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, showOnly, hydrated]);

  const stats = useMemo(() => {
    const known = Object.values(status).filter((s) => s === 'known').length;
    const review = Object.values(status).filter((s) => s === 'review').length;
    const total = ALL_CARDS.length;
    const unseen = total - known - review;
    return { known, review, unseen, total };
  }, [status]);

  const current = deck[idx];

  const mark = useCallback((s: Status) => {
    if (!current) return;
    setStatus((prev) => ({ ...prev, [cardKey(current)]: s }));
    if (idx < deck.length - 1) {
      setIdx(idx + 1);
      setFlipped(false);
    } else {
      setFlipped(false);
    }
  }, [current, idx, deck.length]);

  const goPrev = () => { setIdx((i) => Math.max(0, i - 1)); setFlipped(false); };
  const goNext = () => { setIdx((i) => Math.min(deck.length - 1, i + 1)); setFlipped(false); };
  const flip = () => setFlipped((f) => !f);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === ' ') { e.preventDefault(); flip(); }
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === '1') mark('known');
      if (e.key === '2') mark('review');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mark, deck.length]);

  const resetProgress = () => {
    if (confirm('Reset all flashcard progress? You will lose your known/review marks.')) {
      setStatus({});
    }
  };

  const currentStatus = current ? status[cardKey(current)] : undefined;

  return (
    <>
      <Header name={name} />
      <main className="wrap">
        <Link className="back" href="/NST">&larr; back</Link>
        <h1>Flashcards</h1>
        <p className="muted">
          Click the card or hit space to flip. Mark <strong>Got it</strong> (1) or <strong>Review again</strong> (2). Arrow keys navigate. Progress saves automatically in this browser.
        </p>

        <div className="fc-stats">
          <span className="chip"><strong>{stats.known}</strong> known</span>
          <span className="chip review"><strong>{stats.review}</strong> review</span>
          <span className="chip unseen"><strong>{stats.unseen}</strong> unseen</span>
          <span className="chip total"><strong>{stats.total}</strong> total</span>
        </div>

        <div className="fc-controls">
          <div className="fc-row">
            <label className="fc-label">Category</label>
            <select className="fc-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="fc-row">
            <label className="fc-label">Show</label>
            <div className="fc-filters">
              <button className={`pill-btn ${showOnly === 'all' ? 'active' : ''}`} onClick={() => setShowOnly('all')}>All</button>
              <button className={`pill-btn ${showOnly === 'review' ? 'active' : ''}`} onClick={() => setShowOnly('review')}>Review only</button>
              <button className={`pill-btn ${showOnly === 'unseen' ? 'active' : ''}`} onClick={() => setShowOnly('unseen')}>Unseen only</button>
            </div>
          </div>
          <div className="fc-row">
            <button className="ghost" onClick={buildDeck}>Reshuffle</button>
            <button className="ghost" onClick={resetProgress}>Reset progress</button>
          </div>
        </div>

        {!hydrated ? (
          <div className="spinner">Loading…</div>
        ) : deck.length === 0 ? (
          <div className="muted" style={{ padding: '40px 0' }}>
            No cards in this filter. {showOnly === 'review' ? 'Mark some cards "Review again" to drill them.' : ''}
          </div>
        ) : (
          <>
            <div className="fc-counter">
              Card {idx + 1} of {deck.length}
              {currentStatus === 'known' && <span className="fc-tag known">known</span>}
              {currentStatus === 'review' && <span className="fc-tag review">review</span>}
              <div className="drill-progress">
                <div className="bar"><div className="fill" style={{ width: `${((idx + 1) / deck.length) * 100}%` }} /></div>
              </div>
            </div>

            <div className={`fc-card ${flipped ? 'flipped' : ''}`} onClick={flip}>
              <div className="fc-category">{current.category}</div>
              {!flipped ? (
                <div className="fc-term">{current.term}</div>
              ) : (
                <div className="fc-def">{current.definition}</div>
              )}
              <div className="fc-hint">{flipped ? 'click to flip back' : 'click to reveal'}</div>
            </div>

            <div className="fc-actions">
              <button className="ghost big" onClick={goPrev} disabled={idx === 0}>&larr; Prev</button>
              <button className="bad-btn big" onClick={() => mark('review')}>Review again (2)</button>
              <button className="good-btn big" onClick={() => mark('known')}>Got it (1)</button>
              <button className="ghost big" onClick={goNext} disabled={idx >= deck.length - 1}>Next &rarr;</button>
            </div>
            <p className="muted small fc-tip">space = flip · ← → = navigate · 1 = got it · 2 = review again</p>
          </>
        )}
      </main>
    </>
  );
}
