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

// Ensure schema (idempotent)
try { await db.execute("ALTER TABLE pnl_entries ADD COLUMN account TEXT DEFAULT ''"); } catch {}
try { await db.execute("ALTER TABLE pnl_entries ADD COLUMN payment_method TEXT DEFAULT ''"); } catch {}
await db.execute(`
  CREATE TABLE IF NOT EXISTS recurring_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT DEFAULT '',
    person TEXT DEFAULT '',
    account TEXT DEFAULT '',
    payment_method TEXT DEFAULT '',
    amount REAL NOT NULL,
    day_of_month INTEGER DEFAULT 1,
    start_date TEXT NOT NULL,
    end_date TEXT DEFAULT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

const subs = [
  {
    type: 'expense',
    category: 'Software / SaaS',
    description: 'Anthropic Claude (Brayan)',
    person: 'Brayan',
    account: '',
    payment_method: 'card',
    amount: 106.35,
    day_of_month: 1,
    start_date: '2026-04-01',
  },
  {
    type: 'expense',
    category: 'Software / SaaS',
    description: 'Anthropic Claude (Ryan)',
    person: 'Ryan',
    account: '',
    payment_method: 'card',
    amount: 106.35,
    day_of_month: 1,
    start_date: '2026-04-01',
  },
  {
    type: 'expense',
    category: 'Software / SaaS',
    description: 'SuperWhisper (Brayan)',
    person: 'Brayan',
    account: '',
    payment_method: 'card',
    amount: 8.49,
    day_of_month: 2,
    start_date: '2026-04-02',
  },
];

// Skip if already seeded (match on description)
for (const s of subs) {
  const existing = await db.execute({
    sql: 'SELECT id FROM recurring_subscriptions WHERE description = ?',
    args: [s.description],
  });
  if (existing.rows.length) {
    console.log(`Already exists: ${s.description}`);
    continue;
  }
  await db.execute({
    sql: 'INSERT INTO recurring_subscriptions (type,category,description,person,account,payment_method,amount,day_of_month,start_date,end_date,active) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    args: [s.type, s.category, s.description, s.person, s.account, s.payment_method, s.amount, s.day_of_month, s.start_date, null, 1],
  });
  console.log(`Added subscription: ${s.description}`);
}

// Backfill SuperWhisper actuals for 2026-04-02 and 2026-05-02
const swPast = [
  { date: '2026-04-02', amount: 8.49 },
  { date: '2026-05-02', amount: 8.49 },
];
for (const p of swPast) {
  const existing = await db.execute({
    sql: "SELECT id FROM pnl_entries WHERE description LIKE 'SuperWhisper%' AND date = ?",
    args: [p.date],
  });
  if (existing.rows.length) {
    console.log(`Already logged: SuperWhisper ${p.date}`);
    continue;
  }
  await db.execute({
    sql: 'INSERT INTO pnl_entries (date,type,category,description,amount,person,account,payment_method) VALUES (?,?,?,?,?,?,?,?)',
    args: [p.date, 'expense', 'Software / SaaS', 'SuperWhisper (Brayan)', p.amount, 'Brayan', '', 'card'],
  });
  console.log(`Logged: SuperWhisper ${p.date} -$${p.amount}`);
}

console.log('\nDone.');
