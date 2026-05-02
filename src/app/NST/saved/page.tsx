'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../_components/Header';
import QuestionItem, { type Question } from '../_components/QuestionItem';

export default function SavedPage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [items, setItems] = useState<Question[] | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    (async () => {
      const me = await fetch('/api/nst/me').then((r) => r.json());
      if (!me.name) {
        router.push('/NST/login');
        return;
      }
      setName(me.name);
      const data = await fetch('/api/nst/bookmark', { cache: 'no-store' }).then((r) => r.json());
      setItems(data.items || []);
    })();
  }, [router, reloadKey]);

  const handleBookmarkChange = (questionId: string, bookmarked: boolean) => {
    if (!bookmarked) {
      setItems((prev) => (prev ? prev.filter((q) => q.id !== questionId) : prev));
    }
  };

  return (
    <>
      <Header name={name} />
      <main className="wrap">
        <Link className="back" href="/NST">&larr; back</Link>
        <h1>Saved for review</h1>
        <p className="muted">
          Every question you starred. Tap the ★ on any question to save it; tap again to remove. Bookmarks are kept across study, exam, drill, and review.
        </p>
        {!items ? (
          <div className="spinner">Loading…</div>
        ) : items.length === 0 ? (
          <div className="card">
            <h3>No saved questions yet.</h3>
            <p className="muted">
              While studying, hit <strong>☆ Save for review</strong> on any question to add it here. Useful for concepts you got right but want to lock in, or open responses with rubrics you want to keep nearby.
            </p>
            <div className="row">
              <Link href="/NST" className="btn primary">Back to dashboard</Link>
              <Link href="/NST/drill" className="btn ghost">Drill open response</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="small muted">{items.length} question{items.length === 1 ? '' : 's'} saved.</p>
            <div className="qlist">
              {items.map((q, i) => (
                <QuestionItem
                  key={q.id + reloadKey}
                  q={q}
                  index={i}
                  classKey={q.class_key || ''}
                  mode="review"
                  initialBookmarked
                  onBookmarkChange={(on) => handleBookmarkChange(q.id, on)}
                  showTag
                />
              ))}
            </div>
            <div className="exam-footer">
              <button className="primary big" onClick={() => setReloadKey((k) => k + 1)}>
                Refresh list
              </button>
              <span className="muted">Pulls fresh from the database.</span>
            </div>
          </>
        )}
      </main>
    </>
  );
}
