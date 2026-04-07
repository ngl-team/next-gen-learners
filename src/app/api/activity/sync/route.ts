import { NextRequest, NextResponse } from 'next/server';
import { logActivityIfNew, getSyncState, setSyncState } from '@/lib/db';

export const maxDuration = 30;

// Map known names/emails/usernames to people
function identifyPerson(name: string, email?: string): string {
  const lower = (name || '').toLowerCase().trim();
  if (lower.includes('brayan') || lower.includes('tenesaca')) return 'brayan';
  if (lower.includes('ryan') || lower.includes('vincent')) return 'ryan';
  if (email) {
    const e = email.toLowerCase();
    if (e.includes('brayan') || e.includes('tenesaca')) return 'brayan';
    if (e.includes('ryan') || e.includes('vincent')) return 'ryan';
  }
  return lower || 'unknown';
}

// ── Gmail Sync — Sent Emails ────────────────────────────────────────
async function syncGmail(): Promise<{ synced: number; errors: string[] }> {
  let synced = 0;
  const errors: string[] = [];

  try {
    const { getGmailClient } = await import('@/lib/gmail');
    const gmail = await getGmailClient();
    if (!gmail) return { synced: 0, errors: ['Gmail not connected'] };

    // Last 24 hours of sent emails
    const after = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
    const list = await gmail.users.messages.list({
      userId: 'me',
      q: `in:sent after:${after}`,
      maxResults: 20,
    });

    if (!list.data.messages) return { synced, errors };

    for (const msg of list.data.messages) {
      const full = await gmail.users.messages.get({
        userId: 'me', id: msg.id!, format: 'metadata',
        metadataHeaders: ['From', 'To', 'Subject', 'Date'],
      });
      const headers = full.data.payload?.headers || [];
      const getH = (n: string) => headers.find(h => h.name?.toLowerCase() === n.toLowerCase())?.value || '';

      const from = getH('From');
      const to = getH('To');
      const subject = getH('Subject');
      const date = getH('Date');

      const fromName = from.match(/^([^<]+)/)?.[1]?.trim() || from;
      const fromEmail = from.match(/<(.+?)>/)?.[1] || from;
      const person = identifyPerson(fromName, fromEmail);

      const toName = to.match(/^([^<]+)/)?.[1]?.trim() || to;
      const toEmail = to.match(/<(.+?)>/)?.[1] || to;
      const recipientDisplay = toName !== toEmail ? toName : toEmail;

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

    // Also check inbox for received emails (to see what's coming in)
    const inboxList = await gmail.users.messages.list({
      userId: 'me',
      q: `in:inbox is:unread after:${after}`,
      maxResults: 10,
    });

    if (inboxList.data.messages) {
      for (const msg of inboxList.data.messages) {
        const full = await gmail.users.messages.get({
          userId: 'me', id: msg.id!, format: 'metadata',
          metadataHeaders: ['From', 'To', 'Subject', 'Date'],
        });
        const headers = full.data.payload?.headers || [];
        const getH = (n: string) => headers.find(h => h.name?.toLowerCase() === n.toLowerCase())?.value || '';

        const from = getH('From');
        const subject = getH('Subject');
        const date = getH('Date');

        const fromName = from.match(/^([^<]+)/)?.[1]?.trim() || from;
        const fromEmail = from.match(/<(.+?)>/)?.[1] || from;

        let createdAt: string | undefined;
        try {
          const d = new Date(date);
          if (!isNaN(d.getTime())) createdAt = d.toISOString().replace('T', ' ').slice(0, 19);
        } catch {}

        const added = await logActivityIfNew(`gmail-in:${msg.id}`, {
          person: 'inbox',
          action: 'received email',
          resource_type: 'email',
          resource_name: fromName !== fromEmail ? fromName : fromEmail,
          details: subject ? `Subject: ${subject}` : '',
          created_at: createdAt,
        });
        if (added) synced++;
      }
    }
  } catch (e) {
    errors.push(`Gmail: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }

  return { synced, errors };
}

// ── GitHub Sync — Commits + PRs ─────────────────────────────────────
async function syncGitHub(): Promise<{ synced: number; errors: string[] }> {
  let synced = 0;
  const errors: string[] = [];
  const repo = 'ngl-team/next-gen-learners';
  const ghHeaders: Record<string, string> = {
    'User-Agent': 'NGL-Activity-Sync',
    ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {}),
  };

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Sync commits
    const commitResp = await fetch(
      `https://api.github.com/repos/${repo}/commits?since=${since}&per_page=30`,
      { headers: ghHeaders, next: { revalidate: 0 } },
    );

    if (commitResp.ok) {
      const commits = await commitResp.json();
      for (const commit of commits) {
        const sha = commit.sha?.slice(0, 7);
        const authorName = commit.commit?.author?.name || '';
        const authorDate = commit.commit?.author?.date || '';
        const message = commit.commit?.message?.split('\n')[0] || '';

        if (message.includes('Co-Authored-By: Claude')) continue;

        const person = identifyPerson(authorName);
        let createdAt: string | undefined;
        try {
          const d = new Date(authorDate);
          if (!isNaN(d.getTime())) createdAt = d.toISOString().replace('T', ' ').slice(0, 19);
        } catch {}

        const added = await logActivityIfNew(`github:${commit.sha}`, {
          person,
          action: 'pushed code',
          resource_type: 'github',
          resource_name: message.slice(0, 80),
          details: `Commit ${sha}`,
          created_at: createdAt,
        });
        if (added) synced++;
      }
    }

    // Sync pull requests (open + recently closed)
    const prResp = await fetch(
      `https://api.github.com/repos/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=10`,
      { headers: ghHeaders, next: { revalidate: 0 } },
    );

    if (prResp.ok) {
      const prs = await prResp.json();
      for (const pr of prs) {
        const author = pr.user?.login || '';
        const person = identifyPerson(author);
        const title = pr.title || '';
        const state = pr.merged_at ? 'merged' : pr.state;
        const updatedAt = pr.updated_at || '';

        // Only sync PRs updated in last 24h
        if (updatedAt && Date.now() - new Date(updatedAt).getTime() > 24 * 60 * 60 * 1000) continue;

        let createdAt: string | undefined;
        try {
          const d = new Date(pr.created_at);
          if (!isNaN(d.getTime())) createdAt = d.toISOString().replace('T', ' ').slice(0, 19);
        } catch {}

        const action = state === 'merged' ? 'merged PR' : state === 'open' ? 'opened PR' : 'closed PR';

        const added = await logActivityIfNew(`github-pr:${pr.id}:${state}`, {
          person,
          action,
          resource_type: 'github',
          resource_name: title.slice(0, 80),
          details: `PR #${pr.number}`,
          created_at: createdAt,
        });
        if (added) synced++;
      }
    }
  } catch (e) {
    errors.push(`GitHub: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }

  return { synced, errors };
}

// ── Vercel Deployment Sync ──────────────────────────────────────────
async function syncVercel(): Promise<{ synced: number; errors: string[] }> {
  let synced = 0;
  const errors: string[] = [];

  if (!process.env.VERCEL_TOKEN) {
    return { synced, errors: ['VERCEL_TOKEN not set'] };
  }

  try {
    const projectId = process.env.VERCEL_PROJECT_ID || '';
    const teamId = process.env.VERCEL_TEAM_ID || '';

    let url = `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=10`;
    if (teamId) url += `&teamId=${teamId}`;

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
      next: { revalidate: 0 },
    });

    if (!resp.ok) {
      errors.push(`Vercel API: ${resp.status}`);
      return { synced, errors };
    }

    const data = await resp.json();
    const deployments = data.deployments || [];

    for (const dep of deployments) {
      // Only last 24h
      if (Date.now() - dep.created > 24 * 60 * 60 * 1000) continue;

      const creator = dep.creator?.username || dep.creator?.email || '';
      const person = identifyPerson(creator, dep.creator?.email);
      const state = dep.state || dep.readyState || 'unknown';
      const commitMsg = dep.meta?.githubCommitMessage?.split('\n')[0] || '';

      let createdAt: string | undefined;
      try {
        const d = new Date(dep.created);
        if (!isNaN(d.getTime())) createdAt = d.toISOString().replace('T', ' ').slice(0, 19);
      } catch {}

      const stateLabel = state === 'READY' ? 'deployed' : state === 'ERROR' ? 'failed deploy' : 'deploying';

      const added = await logActivityIfNew(`vercel:${dep.uid}`, {
        person,
        action: stateLabel,
        resource_type: 'vercel',
        resource_name: commitMsg || `deployment ${dep.uid?.slice(0, 8)}`,
        details: dep.url ? `URL: ${dep.url}` : '',
        created_at: createdAt,
      });
      if (added) synced++;
    }
  } catch (e) {
    errors.push(`Vercel: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }

  return { synced, errors };
}

// ── Route Handlers ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
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
  const [gmail, github, vercel] = await Promise.all([
    syncGmail(),
    syncGitHub(),
    syncVercel(),
  ]);

  const totalSynced = gmail.synced + github.synced + vercel.synced;
  const allErrors = [...gmail.errors, ...github.errors, ...vercel.errors];

  await setSyncState('last_sync', new Date().toISOString());

  return NextResponse.json({
    ok: true,
    synced: {
      gmail: gmail.synced,
      github: github.synced,
      vercel: vercel.synced,
      total: totalSynced,
    },
    errors: allErrors.length > 0 ? allErrors : undefined,
  });
}
