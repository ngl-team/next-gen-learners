import { NextRequest, NextResponse } from 'next/server';
import { logActivityIfNew, getSyncState, setSyncState } from '@/lib/db';

export const maxDuration = 30;

// Map known email addresses / GitHub usernames to people
const PEOPLE_MAP: Record<string, string> = {
  // GitHub usernames (lowercase)
  'btenesaca': 'brayan',
  'brayan-t': 'brayan',
  'brayantenesaca': 'brayan',
  'brayan tenesaca': 'brayan',
  'ryanvincent': 'ryan',
  'ryan vincent': 'ryan',
  // Add more mappings as needed
};

function identifyPerson(name: string, email?: string): string {
  const lower = (name || '').toLowerCase().trim();
  if (PEOPLE_MAP[lower]) return PEOPLE_MAP[lower];
  if (lower.includes('brayan') || lower.includes('tenesaca')) return 'brayan';
  if (lower.includes('ryan') || lower.includes('vincent')) return 'ryan';
  if (email) {
    const emailLower = email.toLowerCase();
    if (emailLower.includes('brayan') || emailLower.includes('tenesaca')) return 'brayan';
    if (emailLower.includes('ryan') || emailLower.includes('vincent')) return 'ryan';
  }
  return lower || 'unknown';
}

// ── Gmail Sync ──────────────────────────────────────────────────────
async function syncGmail(): Promise<{ synced: number; errors: string[] }> {
  let synced = 0;
  const errors: string[] = [];

  try {
    const { getGmailClient } = await import('@/lib/gmail');
    const gmail = await getGmailClient();
    if (!gmail) return { synced: 0, errors: ['Gmail not connected'] };

    // Get recent sent emails (last 24 hours)
    const after = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
    const list = await gmail.users.messages.list({
      userId: 'me',
      q: `in:sent after:${after}`,
      maxResults: 20,
    });

    if (!list.data.messages || list.data.messages.length === 0) return { synced, errors };

    for (const msg of list.data.messages) {
      const full = await gmail.users.messages.get({ userId: 'me', id: msg.id!, format: 'metadata', metadataHeaders: ['From', 'To', 'Subject', 'Date'] });
      const headers = full.data.payload?.headers || [];
      const getH = (n: string) => headers.find(h => h.name?.toLowerCase() === n.toLowerCase())?.value || '';

      const from = getH('From');
      const to = getH('To');
      const subject = getH('Subject');
      const date = getH('Date');

      // Figure out who sent it
      const fromName = from.match(/^([^<]+)/)?.[1]?.trim() || from;
      const fromEmail = from.match(/<(.+?)>/)?.[1] || from;
      const person = identifyPerson(fromName, fromEmail);

      // Extract recipient name/email
      const toName = to.match(/^([^<]+)/)?.[1]?.trim() || to;
      const toEmail = to.match(/<(.+?)>/)?.[1] || to;
      const recipientDisplay = toName !== toEmail ? toName : toEmail;

      // Parse date for created_at
      let createdAt: string | undefined;
      try {
        const d = new Date(date);
        if (!isNaN(d.getTime())) createdAt = d.toISOString().replace('T', ' ').slice(0, 19);
      } catch {}

      const added = await logActivityIfNew(`gmail:${msg.id}`, {
        person,
        action: 'sent email',
        resource_type: 'email',
        resource_name: recipientDisplay,
        details: subject ? `Subject: ${subject}` : '',
        created_at: createdAt,
      });
      if (added) synced++;
    }
  } catch (e) {
    errors.push(`Gmail: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }

  return { synced, errors };
}

// ── GitHub Sync ─────────────────────────────────────────────────────
async function syncGitHub(): Promise<{ synced: number; errors: string[] }> {
  let synced = 0;
  const errors: string[] = [];

  const repos = [
    'ngl-team/next-gen-learners',
    'ngl-team/brayan-jarvis',
    'ngl-team/ryan-jarvis',
  ];

  for (const repo of repos) {
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const resp = await fetch(`https://api.github.com/repos/${repo}/commits?since=${since}&per_page=30`, {
        headers: {
          'User-Agent': 'NGL-Activity-Sync',
          ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {}),
        },
        next: { revalidate: 0 },
      });

      if (!resp.ok) {
        // Skip repos that don't exist yet (404)
        if (resp.status !== 404) {
          errors.push(`GitHub API (${repo}): ${resp.status} ${resp.statusText}`);
        }
        continue;
      }

      const commits = await resp.json();
      const repoShort = repo.split('/')[1];

      for (const commit of commits) {
        const sha = commit.sha?.slice(0, 7);
        const authorName = commit.commit?.author?.name || '';
        const authorDate = commit.commit?.author?.date || '';
        const message = commit.commit?.message?.split('\n')[0] || '';

        // Skip bot commits
        if (message.includes('Co-Authored-By: Claude')) continue;

        const person = identifyPerson(authorName);

        // For Jarvis repos, label the action differently
        const isJarvis = repoShort.includes('jarvis');
        const action = isJarvis ? 'updated jarvis' : 'pushed code';

        let createdAt: string | undefined;
        try {
          const d = new Date(authorDate);
          if (!isNaN(d.getTime())) createdAt = d.toISOString().replace('T', ' ').slice(0, 19);
        } catch {}

        const added = await logActivityIfNew(`github:${commit.sha}`, {
          person,
          action,
          resource_type: 'github',
          resource_name: message.slice(0, 80),
          details: `Commit ${sha} in ${repoShort}`,
          created_at: createdAt,
        });
        if (added) synced++;
      }
    } catch (e) {
      errors.push(`GitHub (${repo}): ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  return { synced, errors };
}

// ── Route Handlers ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return runSync();
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const { isAuthenticated } = await import('@/lib/auth');
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return runSync();
}

async function runSync() {
  const [gmail, github] = await Promise.all([syncGmail(), syncGitHub()]);

  const totalSynced = gmail.synced + github.synced;
  const allErrors = [...gmail.errors, ...github.errors];

  await setSyncState('last_sync', new Date().toISOString());

  return NextResponse.json({
    ok: true,
    synced: { gmail: gmail.synced, github: github.synced, total: totalSynced },
    errors: allErrors.length > 0 ? allErrors : undefined,
  });
}
