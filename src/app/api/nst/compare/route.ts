import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { getCurrentUserId, BANK, summarizeTypes } from '@/lib/nst';

export async function GET() {
  const user = await getCurrentUserId();
  if (!user) return NextResponse.json({ error: 'not logged in' }, { status: 401 });
  await initDb();

  const usersRes = await db.execute('SELECT id, name FROM nst_users ORDER BY name');
  const users = usersRes.rows as unknown as Array<{ id: number; name: string }>;

  const data: Array<{ name: string; by_class: Record<string, { count: number; correct: number }> }> = [];
  for (const u of users) {
    const rows = await db.execute({
      sql: `SELECT class_key, COUNT(*) as c, SUM(correct) as s
            FROM nst_answers WHERE user_id = ? AND mode = 'study' GROUP BY class_key`,
      args: [u.id],
    });
    const by: Record<string, { count: number; correct: number }> = {};
    for (const row of rows.rows as unknown as Array<{ class_key: string; c: number; s: number | null }>) {
      by[row.class_key] = { count: Number(row.c) || 0, correct: Number(row.s) || 0 };
    }
    data.push({ name: String(u.name), by_class: by });
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

  return NextResponse.json({ data, classKeys, classTitles, classTypes, labKeys, labTitles });
}
