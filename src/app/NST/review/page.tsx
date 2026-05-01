'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../_components/Header';
import QuestionItem, { type Question } from '../_components/QuestionItem';

export default function ReviewPage() {
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
      const wrong = await fetch('/api/nst/wrong', { cache: 'no-store' }).then((r) => r.json());
      setItems(wrong.items);
    })();
  }, [router, reloadKey]);

  return (
    <>
      <Header name={name} />
      <main className="wrap">
        <Link className="back" href="/NST">&larr; back</Link>
        <h1>Review wrong answers</h1>
        <p className="muted">
          Every multiple choice question you have ever gotten wrong, cumulative across study and exam modes.
          Get one right here and it leaves this list automatically.
        </p>
        {!items ? (
          <div className="spinner">Loading…</div>
        ) : items.length === 0 ? (
          <div className="card">
            <h3>Nothing to review.</h3>
            <p className="muted">You have no outstanding wrong answers. Keep practicing in study mode or run a simulated final.</p>
            <div className="row">
              <Link href="/NST" className="btn primary">Back to dashboard</Link>
              <Link href="/NST/exam" className="btn ghost">Simulate the Final</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="small muted">{items.length} question{items.length === 1 ? '' : 's'} to review.</p>
            <div className="qlist">
              {items.map((q, i) => (
                <QuestionItem
                  key={q.id + reloadKey}
                  q={q}
                  index={i}
                  classKey={q.class_key || ''}
                  mode="review"
                  showTag
                />
              ))}
            </div>
            <div className="exam-footer">
              <button className="primary big" onClick={() => setReloadKey((k) => k + 1)}>
                Refresh list
              </button>
              <span className="muted">Reload to drop the ones you just got right.</span>
            </div>
          </>
        )}
      </main>
    </>
  );
}
