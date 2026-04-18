import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUserId, BANK, summarizeTypes } from '@/lib/nst';

export async function GET() {
  const user = await getCurrentUserId();
  if (!user) return NextResponse.json({ error: 'not logged in' }, { status: 401 });
  await initDb();
  const r = await db.execute({
    sql: `SELECT class_key, COUNT(*) as c, SUM(correct) as s
          FROM nst_answers
          WHERE user_id = ? AND mode = 'study'
          GROUP BY class_key`,
    args: [user.id],
  });
  const progress: Record<string, { count: number; correct: number }> = {};
  for (const row of r.rows as unknown as Array<{ class_key: string; c: number; s: number | null }>) {
    progress[row.class_key] = {
      count: Number(row.c) || 0,
      correct: Number(row.s) || 0,
    };
  }

  const classes = Object.entries(BANK.classes)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([key, v]) => ({
      key,
      title: v.title,
      total: v.questions.length,
      type: summarizeTypes(v.questions),
      answered: progress[key]?.count ?? 0,
      correct: progress[key]?.correct ?? 0,
    }));

  const labs = Object.entries(BANK.labs).map(([key, v]) => ({
    key,
    title: v.title,
    total: v.questions.length,
    type: summarizeTypes(v.questions),
    answered: progress[key]?.count ?? 0,
    correct: progress[key]?.correct ?? 0,
  }));

  return NextResponse.json({ name: user.name, classes, labs });
}
