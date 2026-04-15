import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { sendEmailAsUser } from '@/lib/gmail';

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { user, to, subject, body, threadId, messageId, references } = await req.json() as {
    user: string;
    to: string;
    subject: string;
    body: string;
    threadId?: string;
    messageId?: string;
    references?: string;
  };

  if (!user || !to || !subject || !body) {
    return NextResponse.json({ error: 'user, to, subject, and body are required' }, { status: 400 });
  }

  try {
    const result = await sendEmailAsUser(user, to, subject, body, {
      threadId,
      messageId,
      references,
    });

    return NextResponse.json({ success: true, messageId: result.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Send failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
