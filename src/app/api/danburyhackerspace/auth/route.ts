import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.DH_ADMIN_PASSWORD || 'ctbuilds2026';
const SECRET = process.env.SESSION_SECRET || 'dh-default-secret';

function expectedToken() {
  return crypto.createHmac('sha256', SECRET).update(`dh:${ADMIN_PASSWORD}`).digest('hex');
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set('dh_admin', expectedToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  return res;
}
