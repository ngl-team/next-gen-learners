import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

interface EmailInput {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
}

interface Classification {
  id: string;
  category: 'URGENT' | 'ACTION_NEEDED' | 'DELEGATE' | 'FYI' | 'SPAM';
  reason: string;
  suggestedAction: string;
  delegateTo?: string;
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { emails } = await req.json() as { emails: EmailInput[] };
  if (!emails || emails.length === 0) return NextResponse.json({ classifications: [] });

  try {
    const emailList = emails.map((e, i) =>
      `[${i}] ID: ${e.id}\nFrom: ${e.from}\nSubject: ${e.subject}\nPreview: ${e.snippet}\nDate: ${e.date}`
    ).join('\n\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 4096,
      system: `You are an email triage assistant for a K-8 school district superintendent. Your job is to classify incoming emails so the superintendent can focus on what matters most.

Classify each email into exactly ONE category:
- URGENT: Safety issues, legal matters, board emergencies, media inquiries, parent escalations about student safety
- ACTION_NEEDED: Requires the superintendent's personal response or decision. Policy questions, budget approvals, personnel matters, meeting requests from board members or principals.
- DELEGATE: Can be handled by office staff, assistant principal, or department heads. Routine scheduling, vendor follow-ups, supply requests, standard parent inquiries.
- FYI: Informational only. Newsletters, district-wide announcements, vendor marketing, professional development opportunities, conference invites.
- SPAM: Irrelevant commercial email, unsolicited sales pitches, unsubscribe candidates.

Return ONLY a valid JSON array. No markdown, no code fences, no explanation. Each object must have:
- id: the email ID exactly as provided
- category: one of URGENT, ACTION_NEEDED, DELEGATE, FYI, SPAM
- reason: max 10 words explaining why
- suggestedAction: max 15 words on what to do
- delegateTo: (only if DELEGATE) who should handle it`,
      messages: [{
        role: 'user',
        content: `Classify these ${emails.length} emails:\n\n${emailList}`,
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const classifications: Classification[] = JSON.parse(text);

    return NextResponse.json({ classifications });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Triage failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
