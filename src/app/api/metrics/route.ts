import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getMetrics } from '@/lib/db';

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return NextResponse.json(await getMetrics());
}
