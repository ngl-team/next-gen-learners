import { createClient } from '@libsql/client';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const db = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

// Backfill Brayan's Anthropic Claude for past billing cycles.
// Assumed day 1; user will correct if different.
const entries = [
  { date: '2026-04-01', desc: 'Anthropic Claude (Brayan)', person: 'Brayan' },
  { date: '2026-05-01', desc: 'Anthropic Claude (Brayan)', person: 'Brayan' },
];

for (const e of entries) {
  const existing = await db.execute({
    sql: 'SELECT id FROM pnl_entries WHERE date = ? AND description = ?',
    args: [e.date, e.desc],
  });
  if (existing.rows.length) {
    console.log(`Already logged: ${e.date} ${e.desc}`);
    continue;
  }
  await db.execute({
    sql: 'INSERT INTO pnl_entries (date,type,category,description,amount,person,account,payment_method) VALUES (?,?,?,?,?,?,?,?)',
    args: [e.date, 'expense', 'Software / SaaS', e.desc, 106.35, e.person, '', 'card'],
  });
  console.log(`Logged: ${e.date} -$106.35 ${e.desc}`);
}

console.log('\nDone.');
