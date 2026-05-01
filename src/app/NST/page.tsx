import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db, initDb } from '@/lib/db';
import { getCurrentUserId, BANK, summarizeTypes } from '@/lib/nst';
import Header from './_components/Header';

export const dynamic = 'force-dynamic';

async function loadDashboard(userId: number) {
  await initDb();
  const progRes = await db.execute({
    sql: `SELECT class_key, COUNT(*) as c, SUM(correct) as s FROM nst_answers WHERE user_id = ? AND mode = 'study' GROUP BY class_key`,
    args: [userId],
  });
  const progress: Record<string, { count: number; correct: number }> = {};
  for (const row of progRes.rows as unknown as Array<{ class_key: string; c: number; s: number | null }>) {
    progress[row.class_key] = { count: Number(row.c) || 0, correct: Number(row.s) || 0 };
  }
  const usersRes = await db.execute('SELECT name FROM nst_users ORDER BY name');
  const allUsers = (usersRes.rows as unknown as Array<{ name: string }>).map((r) => String(r.name));

  const wrongRes = await db.execute({
    sql: `SELECT COUNT(DISTINCT question_id) as c
          FROM nst_answers
          WHERE user_id = ? AND correct = 0
            AND question_id NOT IN (
              SELECT question_id FROM nst_answers WHERE user_id = ? AND correct = 1
            )`,
    args: [userId, userId],
  });
  const wrongCount = Number((wrongRes.rows[0] as unknown as { c: number })?.c || 0);

  const classes = Object.entries(BANK.classes)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([key, v]) => ({
      key,
      title: v.title,
      type: summarizeTypes(v.questions),
      total: v.questions.length,
      answered: progress[key]?.count ?? 0,
      correct: progress[key]?.correct ?? 0,
    }));
  const labs = Object.entries(BANK.labs).map(([key, v]) => ({
    key,
    title: v.title,
    type: summarizeTypes(v.questions),
    total: v.questions.length,
    answered: progress[key]?.count ?? 0,
    correct: progress[key]?.correct ?? 0,
  }));

  return { classes, labs, allUsers, wrongCount };
}

export default async function NstDashboardPage() {
  const user = await getCurrentUserId();
  if (!user) redirect('/NST/login');
  const { classes, labs, allUsers, wrongCount } = await loadDashboard(user.id);

  return (
    <>
      <Header name={user.name} />
      <main className="wrap">
        <section className="hero">
          <h1>Welcome back, {user.name}.</h1>
          <p className="muted">Classes 1-9 are multiple choice. Classes 10-15 and labs have MC + open response.</p>
          <div className="row">
            <Link href="/NST/exam" className="btn primary big">Simulate the Final</Link>
            <Link href="/NST/review" className="btn ghost big">
              Review wrong{wrongCount > 0 ? ` (${wrongCount})` : ''}
            </Link>
            <Link href="/NST/compare" className="btn ghost big">Compare with friends</Link>
          </div>
        </section>

        <h2>Classes</h2>
        <div className="grid">
          {classes.map((c) => (
            <Link key={c.key} href={`/NST/study/${c.key}`} className="card clickable">
              <div className="class-head">
                <span className="class-num">Class {c.key}</span>
                <span className={`pill ${c.type}`}>
                  {c.type === 'mc' ? 'MC' : c.type === 'open' ? 'Open' : 'MC + Open'}
                </span>
              </div>
              <h3>{c.title}</h3>
              <div className="progress">
                <div className="bar">
                  <div className="fill" style={{ width: `${c.total ? (c.answered / c.total) * 100 : 0}%` }} />
                </div>
                <span className="small muted">
                  {c.answered} / {c.total} answered{c.answered > 0 ? ` · ${c.correct} correct` : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <h2>Labs</h2>
        <div className="grid">
          {labs.map((l) => (
            <Link key={l.key} href={`/NST/study/${l.key}`} className="card clickable">
              <div className="class-head">
                <span className="class-num">{l.key.toUpperCase()}</span>
                <span className={`pill ${l.type}`}>
                  {l.type === 'mc' ? 'MC' : l.type === 'open' ? 'Open' : 'MC + Open'}
                </span>
              </div>
              <h3>{l.title}</h3>
              <div className="progress">
                <div className="bar">
                  <div className="fill" style={{ width: `${l.total ? (l.answered / l.total) * 100 : 0}%` }} />
                </div>
                <span className="small muted">
                  {l.answered} / {l.total} answered{l.answered > 0 ? ` · ${l.correct} correct` : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {allUsers.length > 1 && (
          <>
            <h2>Studying with you</h2>
            <p className="muted">
              {allUsers.map((n) => (
                <span key={n} className="chip">{n}</span>
              ))}
            </p>
          </>
        )}
      </main>
    </>
  );
}
