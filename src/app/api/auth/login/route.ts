import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateSessionToken, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });

  const hash = hashPassword(password);
  if (hash !== process.env.NGL_AUTH_HASH) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const token = generateSessionToken();
  const sig = signToken(token);
  const response = NextResponse.json({ success: true });
  response.cookies.set('ngl_session', `${token}.${sig}`, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  return response;
}
