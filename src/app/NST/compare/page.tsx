import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db, initDb } from '@/lib/db';
import { getCurrentUserId, BANK, summarizeTypes } from '@/lib/nst';
import Header from '../_components/Header';

export const dynamic = 'force-dynamic';

async function loadCompare() {
  await initDb();
  const usersRes = await db.execute('SELECT id, name FROM nst_users ORDER BY name');
  const users = usersRes.rows as unknown as Array<{ id: number; name: string }>;

  const data: Array<{ name: string; byClass: Record<string, { count: number; correct: number }> }> = [];
  for (const u of users) {
    const rows = await db.execute({
      sql: `SELECT class_key, COUNT(*) as c, SUM(correct) as s FROM nst_answers WHERE user_id = ? AND mode = 'study' GROUP BY class_key`,
      args: [u.id],
    });
    const byClass: Record<string, { count: number; correct: number }> = {};
    for (const row of rows.rows as unknown as Array<{ class_key: string; c: number; s: number | null }>) {
      byClass[row.class_key] = { count: Number(row.c) || 0, correct: Number(row.s) || 0 };
    }
    data.push({ name: String(u.name), byClass });
  }

  const classKeys = Object.keys(BANK.classes).sort((a, b) => Number(a) - Number(b));
  const classTitles: Record<string, string> = {};
  const classTypes: Record<string, string> = {};
  for (const k of classKeys) {
    classTitles[k] = BANK.classes[k].title;
    classTypes[k] = summarizeTypes(BANK.classes[k].questions);
  }
  const labKeys = Object.keys(BANK.labs);
  const labTitles: Record<string, string> = {};
  for (const k of labKeys) labTitles[k] = BANK.labs[k].title;

  return { data, classKeys, classTitles, classTypes, labKeys, labTitles };
}

export default async function ComparePage() {
  const user = await getCurrentUserId();
  if (!user) redirect('/NST/login');
  const { data, classKeys, classTitles, classTypes, labKeys, labTitles } = await loadCompare();

  return (
    <>
      <Header name={user.name} />
      <main className="wrap">
        <Link className="back" href="/NST">&larr; back</Link>
        <h1>Compare progress</h1>
        <p className="muted">Who has answered what. MC shows correct count. Open shows answered count.</p>
        <table className="cmp">
          <thead>
            <tr>
              <th>Class</th>
              {data.map((u) => (
                <th key={u.name}>{u.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classKeys.map((k) => (
              <tr key={k}>
                <td>
                  <strong>Class {k}</strong>
                  <br />
                  <span className="muted small">{classTitles[k]}</span>
                </td>
                {data.map((u) => {
                  const p = u.byClass[k];
                  return (
                    <td key={u.name}>
                      {p ? (
                        <>
                          {p.count} answered
                          {classTypes[k] !== 'open' && (
                            <>
                              <br />
                              <span className="small muted">{p.correct} correct</span>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="muted">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {labKeys.map((k) => (
              <tr key={k}>
                <td>
                  <strong>{k.toUpperCase()}</strong>
                  <br />
                  <span className="muted small">{labTitles[k]}</span>
                </td>
                {data.map((u) => {
                  const p = u.byClass[k];
                  return (
                    <td key={u.name}>
                      {p ? (
                        <>
                          {p.count} answered
                          <br />
                          <span className="small muted">{p.correct} correct</span>
                        </>
                      ) : (
                        <span className="muted">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
