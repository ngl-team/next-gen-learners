import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUserId, getClass } from '@/lib/nst';

export async function GET() {
  const user = await getCurrentUserId();
  if (!user) return NextResponse.json({ error: 'not logged in' }, { status: 401 });

  await initDb();
  const r = await db.execute({
    sql: 'SELECT question_id, class_key, created_at FROM nst_bookmarks WHERE user_id = ? ORDER BY created_at DESC',
    args: [user.id],
  });

  const ids: string[] = [];
  const items: Array<Record<string, unknown>> = [];
  for (const row of r.rows as unknown as Array<{ question_id: string; class_key: string; created_at: string }>) {
    ids.push(row.question_id);
    const cls = getClass(row.class_key);
    if (!cls) continue;
    const q = cls.questions.find((x) => x.id === row.question_id);
    if (!q) continue;
    items.push({ ...q, class_key: row.class_key, class_title: cls.title, bookmarked_at: row.created_at });
  }

  return NextResponse.json({ ids, items, count: items.length });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUserId();
  if (!user) return NextResponse.json({ error: 'not logged in' }, { status: 401 });

  const { question_id, class_key, on } = await req.json();
  if (!question_id || !class_key) {
    return NextResponse.json({ error: 'missing question_id or class_key' }, { status: 400 });
  }
  const cls = getClass(class_key);
  if (!cls || !cls.questions.find((q) => q.id === question_id)) {
    return NextResponse.json({ error: 'question not found' }, { status: 404 });
  }

  await initDb();
  if (on) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO nst_bookmarks (user_id, question_id, class_key) VALUES (?, ?, ?)',
      args: [user.id, question_id, class_key],
    });
  } else {
    await db.execute({
      sql: 'DELETE FROM nst_bookmarks WHERE user_id = ? AND question_id = ?',
      args: [user.id, question_id],
    });
  }
  return NextResponse.json({ ok: true, bookmarked: !!on });
}
