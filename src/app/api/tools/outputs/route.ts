import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getToolOutputs } from '@/lib/db';

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const tool = req.nextUrl.searchParams.get('tool') || '';
  return NextResponse.json(await getToolOutputs(tool));
}
