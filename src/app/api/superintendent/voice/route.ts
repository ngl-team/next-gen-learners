import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getGmailClient } from '@/lib/gmail';
import { upsertToolOutputByKey, getToolOutputByKey } from '@/lib/db';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { user, refresh } = await req.json() as { user: string; refresh?: boolean };
  if (!user) return NextResponse.json({ error: 'User parameter required' }, { status: 400 });

  // Check for cached voice profile
  if (!refresh) {
    const cached = await getToolOutputByKey('voice-profile', user);
    if (cached) {
      return NextResponse.json({ profile: JSON.parse(cached.generated_output), emailsAnalyzed: 0, cached: true });
    }
  }

  const gmail = await getGmailClient(user);
  if (!gmail) return NextResponse.json({ error: `Gmail not connected for ${user}` }, { status: 500 });

  try {
    // Fetch recent sent emails
    const list = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:sent',
      maxResults: 30,
    });

    if (!list.data.messages || list.data.messages.length === 0) {
      return NextResponse.json({ profile: null, emailsAnalyzed: 0 });
    }

    const sentEmails = await Promise.all(
      list.data.messages.slice(0, 30).map(async (msg) => {
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
          to: getHeader('To'),
          subject: getHeader('Subject'),
          body: body.substring(0, 1000),
        };
      })
    );

    const emailSamples = sentEmails
      .filter(e => e.body.length > 20)
      .map((e, i) => `--- Email ${i + 1} ---\nTo: ${e.to}\nSubject: ${e.subject}\n${e.body}`)
      .join('\n\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 1024,
      system: `Analyze the writing style of this school superintendent based on their sent emails. Extract a voice profile that can be used to draft future emails in their exact style.

Return ONLY valid JSON with these fields:
- greeting: how they typically open emails (e.g., "Hi [Name],", "Good morning,")
- signOff: how they close emails (e.g., "Best, Chris", "Thank you,\nChris Roche")
- formalityLevel: "formal", "semi-formal", or "casual"
- toneMarkers: array of 3-5 adjectives describing their tone
- commonPhrases: array of 5-10 phrases they frequently use
- sentenceStyle: "short and direct", "medium with detail", or "long and thorough"
- personalTouches: any recurring personal touches (e.g., mentions family, uses humor)
- avoids: things they never do in emails`,
      messages: [{
        role: 'user',
        content: `Analyze these ${sentEmails.length} sent emails:\n\n${emailSamples}`,
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const profile = JSON.parse(text);

    // Cache the voice profile
    await upsertToolOutputByKey('voice-profile', user, text);

    return NextResponse.json({ profile, emailsAnalyzed: sentEmails.length, cached: false });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Voice analysis failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
