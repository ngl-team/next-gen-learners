'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../_components/Header';
import QuestionItem, { type Question } from '../_components/QuestionItem';

export default function ExamPage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [items, setItems] = useState<Question[] | null>(null);
  const [score, setScore] = useState<string>('');

  useEffect(() => {
    (async () => {
      const me = await fetch('/api/nst/me').then((r) => r.json());
      if (!me.name) {
        router.push('/NST/login');
        return;
      }
      setName(me.name);
      const exam = await fetch('/api/nst/exam').then((r) => r.json());
      setItems(exam.items);
    })();
  }, [router]);

  const computeScore = () => {
    const qs = document.querySelectorAll('.q');
    let answered = 0;
    let correct = 0;
    let total = 0;
    qs.forEach((q) => {
      const choices = q.querySelectorAll('.choice');
      if (!choices.length) return;
      total++;
      const c = q.querySelector('.choice.correct');
      const i = q.querySelector('.choice.incorrect');
      if (c || i) answered++;
      if (c && !i) correct++;
    });
    setScore(`Score: ${correct} / ${total}  (${answered} answered)`);
  };

  return (
    <>
      <Header name={name} />
      <main className="wrap">
        <Link className="back" href="/NST">&larr; back</Link>
        <h1>Simulated Final</h1>
        <p className="muted">
          Mixed MC and open response drawn from all classes. Answers save automatically.
        </p>
        {!items ? (
          <div className="spinner">Loading exam…</div>
        ) : (
          <>
            <div className="qlist">
              {items.map((q, i) => (
                <QuestionItem
                  key={q.id + i}
                  q={q}
                  index={i}
                  classKey={q.class_key || ''}
                  mode="exam"
                  showTag
                />
              ))}
            </div>
            <div className="exam-footer">
              <button className="primary big" onClick={computeScore}>
                Score my multiple choice
              </button>
              <span className="muted">{score}</span>
            </div>
          </>
        )}
      </main>
    </>
  );
}
