import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getGmailClient } from '@/lib/gmail';

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const q = req.nextUrl.searchParams.get('q');
  const maxResults = parseInt(req.nextUrl.searchParams.get('max') || '10');
  if (!q) return NextResponse.json({ error: 'Query parameter "q" required' }, { status: 400 });

  const gmail = await getGmailClient();
  if (!gmail) return NextResponse.json({ error: 'Gmail not connected' }, { status: 500 });

  try {
    const list = await gmail.users.messages.list({ userId: 'me', q, maxResults });
    if (!list.data.messages || list.data.messages.length === 0) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const messages = await Promise.all(
      list.data.messages.map(async (msg) => {
        const full = await gmail.users.messages.get({ userId: 'me', id: msg.id!, format: 'full' });
        const headers = full.data.payload?.headers || [];
        const getHeader = (name: string) => headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

        let body = '';
        const payload = full.data.payload;
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
          threadId: msg.threadId,
          from: getHeader('From'),
          to: getHeader('To'),
          subject: getHeader('Subject'),
          date: getHeader('Date'),
          snippet: full.data.snippet || '',
          body: body.substring(0, 2000),
        };
      })
    );

    return NextResponse.json({ results: messages, total: list.data.resultSizeEstimate || messages.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Gmail search failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
