import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getOAuth2Client } from '@/lib/gmail';

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const oauth2 = getOAuth2Client();
  if (!oauth2) return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });
  const user = req.nextUrl.searchParams.get('user') || 'ryan';
  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send', 'openid', 'email'],
    state: user,
  });
  return NextResponse.redirect(url);
}
