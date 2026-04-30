import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { insertDhSubmission, getDhSubmissions } from '@/lib/db';
import { sendEmail } from '@/lib/gmail';

const ADMIN_PASSWORD = process.env.DH_ADMIN_PASSWORD || 'ctbuilds2026';
const SECRET = process.env.SESSION_SECRET || 'dh-default-secret';

function expectedToken() {
  return crypto.createHmac('sha256', SECRET).update(`dh:${ADMIN_PASSWORD}`).digest('hex');
}

async function isAdminAuthed() {
  const c = await cookies();
  const v = c.get('dh_admin')?.value;
  return v === expectedToken();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const help_type = String(body.help_type || '').slice(0, 200);
    const region = String(body.region || '').slice(0, 200);
    const matched_hub = String(body.matched_hub || '').slice(0, 200);
    const matched_advisor = String(body.matched_advisor || '').slice(0, 200);
    const name = String(body.name || '').slice(0, 200);
    const email = String(body.email || '').slice(0, 200);
    const notes = String(body.notes || '').slice(0, 2000);
    if (!help_type || !region) {
      return NextResponse.json({ error: 'help_type and region required' }, { status: 400 });
    }
    await insertDhSubmission({ help_type, region, matched_hub, matched_advisor, name, email, notes });

    // Best-effort email notification. Never block submission if Gmail is unavailable.
    try {
      const lines = [
        'New CT Builds submission',
        '',
        `Help type: ${help_type}`,
        `Region: ${region}`,
        `Matched hub: ${matched_hub}`,
        `Matched advisor: ${matched_advisor}`,
        '',
        `Name: ${name || '(not provided)'}`,
        `Email: ${email || '(not provided)'}`,
        `Notes: ${notes || '(none)'}`,
      ];
      await sendEmail('brayan@nextgenerationlearners.com', 'New CT Builds submission', lines.join('\n'));
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Submit failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const rows = await getDhSubmissions();
  return NextResponse.json({ rows });
}
