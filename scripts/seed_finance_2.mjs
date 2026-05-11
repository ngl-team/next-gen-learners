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

const stripeFee = (gross) => Math.round((gross * 0.029 + 0.30) * 100) / 100;

const entries = [
  // Ridgefield $300 check — deposited 2026-05-08 — Brayan's account
  {
    date: '2026-05-08',
    type: 'revenue',
    category: 'Client Revenue',
    description: 'Ridgefield (check deposited)',
    amount: 300,
    person: 'Brayan',
    account: 'Brayan personal',
    payment_method: 'check',
  },
  // Roche $1,250 — 2026-04-23 — Brayan's Stripe
  {
    date: '2026-04-23',
    type: 'revenue',
    category: 'Client Revenue',
    description: 'Roche consulting',
    amount: 1250,
    person: 'Brayan',
    account: 'Brayan Stripe',
    payment_method: 'stripe',
  },
  {
    date: '2026-04-23',
    type: 'expense',
    category: 'Stripe Fees',
    description: 'Stripe fee — Roche ($1,250 @ 2.9% + $0.30)',
    amount: stripeFee(1250),
    person: 'Brayan',
    account: 'Brayan Stripe',
    payment_method: 'stripe',
  },
  // Walter $50 — 2026-05-01 — Ryan's Stripe
  {
    date: '2026-05-01',
    type: 'revenue',
    category: 'Client Revenue',
    description: 'Walter',
    amount: 50,
    person: 'Ryan',
    account: 'Ryan Stripe',
    payment_method: 'stripe',
  },
  {
    date: '2026-05-01',
    type: 'expense',
    category: 'Stripe Fees',
    description: 'Stripe fee — Walter ($50 @ 2.9% + $0.30)',
    amount: stripeFee(50),
    person: 'Ryan',
    account: 'Ryan Stripe',
    payment_method: 'stripe',
  },
];

for (const e of entries) {
  // Skip if an entry with same date + description already exists
  const existing = await db.execute({
    sql: 'SELECT id FROM pnl_entries WHERE date = ? AND description = ?',
    args: [e.date, e.description],
  });
  if (existing.rows.length) {
    console.log(`Already logged: ${e.date} ${e.description}`);
    continue;
  }
  await db.execute({
    sql: 'INSERT INTO pnl_entries (date,type,category,description,amount,person,account,payment_method) VALUES (?,?,?,?,?,?,?,?)',
    args: [e.date, e.type, e.category, e.description, e.amount, e.person, e.account, e.payment_method],
  });
  console.log(`Logged: ${e.date} ${e.type === 'revenue' ? '+' : '-'}$${e.amount} ${e.description} [${e.account}/${e.payment_method}]`);
}

console.log('\nDone.');
