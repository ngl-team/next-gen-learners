import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getGmailClient } from '@/lib/gmail';

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const threadId = req.nextUrl.searchParams.get('id');
  if (!threadId) return NextResponse.json({ error: 'Thread ID required' }, { status: 400 });

  const gmail = await getGmailClient();
  if (!gmail) return NextResponse.json({ error: 'Gmail not connected' }, { status: 500 });

  try {
    const thread = await gmail.users.threads.get({ userId: 'me', id: threadId, format: 'full' });
    const messages = (thread.data.messages || []).map(msg => {
      const headers = msg.payload?.headers || [];
      const getHeader = (name: string) => headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

      let body = '';
      const payload = msg.payload;
      if (payload?.body?.data) {
        body = Buffer.from(payload.body.data, 'base64url').toString('utf-8');
      } else if (payload?.parts) {
        const textPart = payload.parts.find(p => p.mimeType === 'text/plain');
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64url').toString('utf-8');
        }
      }

      return {
        id: msg.id,
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        date: getHeader('Date'),
        body,
      };
    });

    return NextResponse.json({ threadId, messages });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Thread fetch failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
