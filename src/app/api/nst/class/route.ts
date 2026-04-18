import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUserId, getClass } from '@/lib/nst';

export async function GET(req: NextRequest) {
  const user = await getCurrentUserId();
  if (!user) return NextResponse.json({ error: 'not logged in' }, { status: 401 });
  const url = new URL(req.url);
  const key = url.searchParams.get('key') || '';
  const cls = getClass(key);
  if (!cls) return NextResponse.json({ error: 'class not found' }, { status: 404 });

  await initDb();
  const r = await db.execute({
    sql: `SELECT question_id, answer, correct FROM nst_answers
          WHERE user_id = ? AND class_key = ? AND mode = 'study'`,
    args: [user.id, key],
  });
  const answered: Record<string, { answer: string; correct: number | null }> = {};
  for (const row of r.rows as unknown as Array<{ question_id: string; answer: string; correct: number | null }>) {
    answered[row.question_id] = { answer: row.answer, correct: row.correct };
  }

  return NextResponse.json({ key, title: cls.title, questions: cls.questions, answered });
}
