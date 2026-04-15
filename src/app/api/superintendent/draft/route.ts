import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getGmailClient } from '@/lib/gmail';
import { getToolOutputByKey } from '@/lib/db';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { threadId, user, instruction } = await req.json() as {
    threadId: string;
    user: string;
    instruction?: string;
  };

  if (!threadId || !user) return NextResponse.json({ error: 'threadId and user required' }, { status: 400 });

  const gmail = await getGmailClient(user);
  if (!gmail) return NextResponse.json({ error: `Gmail not connected for ${user}` }, { status: 500 });

  try {
    // Fetch the full thread
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
        from: getHeader('From'),
        to: getHeader('To'),
        subject: getHeader('Subject'),
        date: getHeader('Date'),
        messageId: getHeader('Message-ID'),
        body: body.substring(0, 3000),
      };
    });

    // Load voice profile
    let voiceContext = '';
    const cached = await getToolOutputByKey('voice-profile', user);
    if (cached) {
      voiceContext = `\n\nWrite in this person's voice using this profile:\n${cached.generated_output}`;
    }

    // Build thread context
    const threadText = messages.map(m =>
      `From: ${m.from}\nTo: ${m.to}\nDate: ${m.date}\n\n${m.body}`
    ).join('\n\n---\n\n');

    const lastMessage = messages[messages.length - 1];
    const replyTo = lastMessage?.from || '';

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 1024,
      system: `You are drafting an email reply for a K-8 school district superintendent.${voiceContext}

Rules:
- Keep replies under 150 words unless the situation clearly requires more detail
- Be direct but warm - this is a people-person superintendent
- Never include unnecessary student-identifiable information
- Match the formality level of the incoming email
- If the email requires information you don't have, acknowledge and say you'll follow up
- Do NOT include the subject line in your response - just the body text
- Do NOT include "Re:" prefixes or headers - just the reply content`,
      messages: [{
        role: 'user',
        content: `${instruction ? `Special instruction: ${instruction}\n\n` : ''}Draft a reply to this email thread. The most recent message is at the bottom.\n\n${threadText}`,
      }],
    });

    const draft = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({
      draft,
      replyTo,
      subject: lastMessage?.subject?.startsWith('Re:') ? lastMessage.subject : `Re: ${lastMessage?.subject || ''}`,
      threadId,
      lastMessageId: lastMessage?.messageId || '',
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Draft generation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
