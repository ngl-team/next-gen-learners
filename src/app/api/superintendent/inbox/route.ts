import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getGmailClient } from '@/lib/gmail';

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = req.nextUrl.searchParams.get('user');
  const max = parseInt(req.nextUrl.searchParams.get('max') || '100');
  const pageToken = req.nextUrl.searchParams.get('pageToken') || undefined;
  const filter = req.nextUrl.searchParams.get('filter') || 'unread';

  if (!user) return NextResponse.json({ error: 'User parameter required' }, { status: 400 });

  const gmail = await getGmailClient(user);
  if (!gmail) return NextResponse.json({ error: `Gmail not connected for ${user}` }, { status: 500 });

  try {
    const q = filter === 'unread' ? 'is:unread category:primary' : 'category:primary';
    const list = await gmail.users.messages.list({
      userId: 'me',
      q,
      maxResults: max,
      pageToken,
    });

    if (!list.data.messages || list.data.messages.length === 0) {
      return NextResponse.json({ emails: [], nextPageToken: null, total: 0 });
    }

    const emails = await Promise.all(
      list.data.messages.map(async (msg) => {
        const meta = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!,
          format: 'metadata',
          metadataHeaders: ['From', 'To', 'Subject', 'Date', 'Message-ID'],
        });
        const headers = meta.data.payload?.headers || [];
        const getHeader = (name: string) =>
          headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

        return {
          id: msg.id,
          threadId: msg.threadId,
          from: getHeader('From'),
          to: getHeader('To'),
          subject: getHeader('Subject'),
          date: getHeader('Date'),
          messageId: getHeader('Message-ID'),
          snippet: meta.data.snippet || '',
          labels: meta.data.labelIds || [],
        };
      })
    );

    return NextResponse.json({
      emails,
      nextPageToken: list.data.nextPageToken || null,
      total: list.data.resultSizeEstimate || emails.length,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Inbox fetch failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
