import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { old_person, new_person, resource_name } = await req.json();
  if (!old_person || !new_person) return NextResponse.json({ error: 'old_person and new_person required' }, { status: 400 });

  let sql = 'UPDATE activity_log SET person = ? WHERE person = ?';
  const args: string[] = [new_person, old_person];

  if (resource_name) {
    sql += ' AND resource_name = ?';
    args.push(resource_name);
  }

  const result = await db.execute({ sql, args });
  return NextResponse.json({ ok: true, updated: result.rowsAffected });
}
