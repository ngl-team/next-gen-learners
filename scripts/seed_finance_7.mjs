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

// 1. Schema migration (idempotent)
try { await db.execute("ALTER TABLE pnl_entries ADD COLUMN reimbursable INTEGER DEFAULT 0"); console.log('Added reimbursable column'); }
catch (e) { console.log('reimbursable column exists'); }
try { await db.execute("ALTER TABLE pnl_entries ADD COLUMN reimbursed_at TEXT DEFAULT NULL"); console.log('Added reimbursed_at column'); }
catch (e) { console.log('reimbursed_at column exists'); }

// 2. Auto-mark all existing Brayan/Ryan non-Stripe-Fees expenses as reimbursable
const res = await db.execute({
  sql: `UPDATE pnl_entries
        SET reimbursable = 1
        WHERE type = 'expense'
          AND category != 'Stripe Fees'
          AND person IN ('Brayan', 'Ryan')
          AND reimbursable = 0`,
});
console.log(`Marked ${res.rowsAffected} existing expense entries as reimbursable`);

// 3. Show per-person owed totals
const totals = await db.execute({
  sql: `SELECT person, SUM(amount) AS total, COUNT(*) AS cnt
        FROM pnl_entries
        WHERE reimbursable = 1 AND reimbursed_at IS NULL
        GROUP BY person`,
});
console.log('\nReimbursable pending by person:');
for (const r of totals.rows) {
  console.log(`  ${r.person}: $${Number(r.total).toFixed(2)} (${r.cnt} entries)`);
}

console.log('\nDone.');
