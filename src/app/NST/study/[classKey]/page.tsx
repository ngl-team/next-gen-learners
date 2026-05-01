import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { db, initDb } from '@/lib/db';
import { getCurrentUserId, getClass } from '@/lib/nst';
import Header from '../../_components/Header';
import QuestionItem, { type Question } from '../../_components/QuestionItem';

export const dynamic = 'force-dynamic';

export default async function StudyPage({ params }: { params: Promise<{ classKey: string }> }) {
  const { classKey } = await params;
  const user = await getCurrentUserId();
  if (!user) redirect('/NST/login');
  const cls = getClass(classKey);
  if (!cls) notFound();

  await initDb();
  const r = await db.execute({
    sql: `SELECT question_id, answer, correct FROM nst_answers WHERE user_id = ? AND class_key = ? AND mode = 'study'`,
    args: [user.id, classKey],
  });
  const answered: Record<string, { answer: string; correct: number | null }> = {};
  for (const row of r.rows as unknown as Array<{ question_id: string; answer: string; correct: number | null }>) {
    answered[row.question_id] = { answer: row.answer, correct: row.correct };
  }

  return (
    <>
      <Header name={user.name} />
      <main className="wrap">
        <Link className="back" href="/NST">&larr; back</Link>
        <h1>{cls.title}</h1>
        <p className="muted">Multiple choice auto-grades. Open response auto-saves; reveal rubric to self-grade. Keep open answers tight — 3 words to 3 sentences per part.</p>
        <div className="qlist">
          {cls.questions.map((q, i) => (
            <QuestionItem
              key={q.id}
              q={q as Question}
              index={i}
              classKey={classKey}
              initial={answered[q.id]}
            />
          ))}
        </div>
      </main>
    </>
  );
}
