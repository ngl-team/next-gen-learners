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

// ─── 1. Fix Ryan's Anthropic subscription: $108.38 on the 5th ─────────────
const sub = await db.execute({
  sql: "SELECT id FROM recurring_subscriptions WHERE description = ?",
  args: ['Anthropic Claude (Ryan)'],
});
if (sub.rows.length) {
  await db.execute({
    sql: "UPDATE recurring_subscriptions SET amount = ?, day_of_month = ?, start_date = ? WHERE id = ?",
    args: [108.38, 5, '2026-04-05', sub.rows[0].id],
  });
  console.log('Updated subscription: Anthropic Claude (Ryan) -> $108.38 on day 5');
}

// Fix existing logged Anthropic (Ryan) entries: date day 1 -> day 5; amount 106.35 -> 108.38
const ryanAnth = await db.execute({
  sql: "SELECT id, date FROM pnl_entries WHERE description = ? ORDER BY date",
  args: ['Anthropic Claude (Ryan)'],
});
for (const r of ryanAnth.rows) {
  // old: 2026-04-01 / 2026-05-01 -> new: 2026-04-05 / 2026-05-05
  const newDate = r.date.replace(/-(\d{2})$/, (_, d) => d === '01' ? '-05' : `-${d}`);
  await db.execute({
    sql: 'UPDATE pnl_entries SET date = ?, amount = ? WHERE id = ?',
    args: [newDate, 108.38, r.id],
  });
  console.log(`Updated entry #${r.id}: Ryan Anthropic -> ${newDate} $108.38`);
}

// ─── 2. Add subscriptions Ryan listed (skip if already exists) ────────────
const newSubs = [
  {
    description: 'Email expense (Ryan)',
    type: 'expense',
    category: 'Software / SaaS',
    person: 'Ryan',
    account: '',
    payment_method: 'card',
    amount: 18.21,
    day_of_month: 1,
    start_date: '2026-02-01',
  },
  {
    description: 'SuperWhisper (Ryan)',
    type: 'expense',
    category: 'Software / SaaS',
    person: 'Ryan',
    account: '',
    payment_method: 'card',
    amount: 8.49,
    day_of_month: 4,
    start_date: '2026-04-04',
  },
  {
    description: 'Walter (consulting)',
    type: 'revenue',
    category: 'Client Revenue',
    person: 'Ryan',
    account: 'Ryan Stripe',
    payment_method: 'stripe',
    amount: 50,
    day_of_month: 1,
    start_date: '2026-05-01',
  },
];

for (const s of newSubs) {
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

// ─── 3. Backfill missing past actuals ─────────────────────────────────────
// SuperWhisper (Ryan): 2026-04-04 and 2026-05-04
const swRyan = [
  { date: '2026-04-04', desc: 'SuperWhisper (Ryan)', amount: 8.49 },
  { date: '2026-05-04', desc: 'SuperWhisper (Ryan)', amount: 8.49 },
];
for (const e of swRyan) {
  const exists = await db.execute({
    sql: 'SELECT id FROM pnl_entries WHERE date = ? AND description = ?',
    args: [e.date, e.desc],
  });
  if (exists.rows.length) {
    console.log(`Already logged: ${e.date} ${e.desc}`);
    continue;
  }
  await db.execute({
    sql: 'INSERT INTO pnl_entries (date,type,category,description,amount,person,account,payment_method) VALUES (?,?,?,?,?,?,?,?)',
    args: [e.date, 'expense', 'Software / SaaS', e.desc, e.amount, 'Ryan', '', 'card'],
  });
  console.log(`Logged: ${e.date} -$${e.amount} ${e.desc}`);
}

// Email expense (Ryan): backfill 2026-04-01 and 2026-05-01 if missing
const emailRyan = [
  { date: '2026-04-01', desc: 'Email expense (monthly)', amount: 18.21 },
  { date: '2026-05-01', desc: 'Email expense (monthly)', amount: 18.21 },
];
for (const e of emailRyan) {
  const exists = await db.execute({
    sql: "SELECT id FROM pnl_entries WHERE date = ? AND description LIKE 'Email expense%'",
    args: [e.date],
  });
  if (exists.rows.length) {
    console.log(`Already logged: ${e.date} Email expense`);
    continue;
  }
  await db.execute({
    sql: 'INSERT INTO pnl_entries (date,type,category,description,amount,person,account,payment_method) VALUES (?,?,?,?,?,?,?,?)',
    args: [e.date, 'expense', 'Software / SaaS', e.desc, e.amount, 'Ryan', '', 'card'],
  });
  console.log(`Logged: ${e.date} -$${e.amount} ${e.desc}`);
}

console.log('\nDone.');
