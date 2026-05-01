import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUserId, getClass } from '@/lib/nst';

export async function GET() {
  const user = await getCurrentUserId();
  if (!user) return NextResponse.json({ error: 'not logged in' }, { status: 401 });

  await initDb();
  const r = await db.execute({
    sql: `SELECT DISTINCT question_id, class_key
          FROM nst_answers
          WHERE user_id = ?
            AND correct = 0
            AND question_id NOT IN (
              SELECT question_id FROM nst_answers
              WHERE user_id = ? AND correct = 1
            )`,
    args: [user.id, user.id],
  });

  const items: Array<Record<string, unknown>> = [];
  for (const row of r.rows as unknown as Array<{ question_id: string; class_key: string }>) {
    const cls = getClass(row.class_key);
    if (!cls) continue;
    const q = cls.questions.find((x) => x.id === row.question_id);
    if (!q || q.type !== 'mc') continue;
    items.push({ ...q, class_key: row.class_key, class_title: cls.title });
  }

  return NextResponse.json({ items, count: items.length });
}
