import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getResearchFeed } from '@/lib/db';

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const category = req.nextUrl.searchParams.get('category') || undefined;
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');
  return NextResponse.json(await getResearchFeed(limit, category));
}
