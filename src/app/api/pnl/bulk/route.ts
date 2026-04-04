import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { bulkInsertPnlEntries } from '@/lib/db';

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { entries } = await req.json();
  if (!entries || !entries.length) return NextResponse.json({ error: 'entries array required' }, { status: 400 });
  const count = await bulkInsertPnlEntries(entries);
  return NextResponse.json({ imported: count });
}
