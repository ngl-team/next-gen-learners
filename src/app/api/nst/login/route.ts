import { NextRequest, NextResponse } from 'next/server';
import { upsertUser, COOKIE_NAME } from '@/lib/nst';

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const trimmed = (name || '').toString().trim();
  if (!trimmed) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  const user = await upsertUser(trimmed);
  const res = NextResponse.json({ success: true, name: user.name });
  res.cookies.set(COOKIE_NAME, encodeURIComponent(user.name), {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 90,
    path: '/',
  });
  return res;
}
