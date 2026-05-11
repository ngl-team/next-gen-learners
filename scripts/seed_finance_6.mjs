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

// Normalize entry descriptions to match subscription descriptions so the
// reconciler's exact-match path stays clean.
const renames = [
  // Email expense (monthly) — Ryan's only — → Email expense (Ryan)
  {
    fromDesc: 'Email expense (monthly)',
    toDesc: 'Email expense (Ryan)',
    personFilter: 'Ryan',
  },
  // Walter (bare) → Walter (consulting)
  {
    fromDesc: 'Walter',
    toDesc: 'Walter (consulting)',
    personFilter: null,
  },
];

for (const r of renames) {
  const args = r.personFilter
    ? { sql: 'UPDATE pnl_entries SET description = ? WHERE description = ? AND person = ?', args: [r.toDesc, r.fromDesc, r.personFilter] }
    : { sql: 'UPDATE pnl_entries SET description = ? WHERE description = ?', args: [r.toDesc, r.fromDesc] };
  const res = await db.execute(args);
  console.log(`Renamed "${r.fromDesc}" -> "${r.toDesc}" (${res.rowsAffected} rows)`);
}

console.log('\nDone.');
