import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getPnlEntries, insertPnlEntry } from '@/lib/db';

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const from = req.nextUrl.searchParams.get('from') || undefined;
  const to = req.nextUrl.searchParams.get('to') || undefined;
  return NextResponse.json(await getPnlEntries(from, to));
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { date, type, category, description, amount, person } = await req.json();
  if (!date || !type || !category || !amount) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  const id = await insertPnlEntry({ date, type, category, description: description || '', amount: parseFloat(amount), person: person || '' });
  return NextResponse.json({ id });
}
