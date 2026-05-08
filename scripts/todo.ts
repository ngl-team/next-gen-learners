// Run: npx tsx scripts/todo.ts <command> [options]
//   add "title" --owner brayan|ryan|either [--notes "..."] [--by brayan|ryan]
//   list [--owner brayan|ryan|either] [--status open|done]
//   done <id>
//   open <id>
//   rm <id>
import { createClient } from '@libsql/client';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Auto-load .env.local if Turso vars aren't already set
if (!process.env.TURSO_DATABASE_URL) {
  const envPath = resolve(process.cwd(), '.env.local');
  if (existsSync(envPath) && typeof (process as any).loadEnvFile === 'function') {
    (process as any).loadEnvFile(envPath);
  }
}

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error('Error: TURSO_DATABASE_URL is not set. Run from the repo root, or source .env.local first.');
  process.exit(1);
}

const db = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const VALID_OWNERS = ['brayan', 'ryan', 'either'] as const;
const VALID_STATUSES = ['open', 'done'] as const;

type Owner = (typeof VALID_OWNERS)[number];
type Status = (typeof VALID_STATUSES)[number];

function ensureTable() {
  return db.execute(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      notes TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'open',
      owner TEXT NOT NULL DEFAULT 'either',
      created_by TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT DEFAULT NULL
    )
  `);
}

function parseFlags(args: string[]): { positional: string[]; flags: Record<string, string> } {
  const positional: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = 'true';
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

function fmtRow(r: any) {
  const tag =
    r.owner === 'brayan' ? '[B]' : r.owner === 'ryan' ? '[R]' : '[E]';
  const mark = r.status === 'done' ? 'x' : ' ';
  const idStr = String(r.id).padStart(3, ' ');
  const notes = r.notes ? `\n      ${String(r.notes).replace(/\n/g, '\n      ')}` : '';
  return `${idStr}  [${mark}] ${tag} ${r.title}${notes}`;
}

async function cmdAdd(args: string[]) {
  const { positional, flags } = parseFlags(args);
  const title = positional[0];
  if (!title) {
    console.error('Usage: todo add "title" --owner brayan|ryan|either [--notes "..."] [--by brayan|ryan]');
    process.exit(1);
  }
  const owner = (flags.owner || 'either') as Owner;
  if (!VALID_OWNERS.includes(owner)) {
    console.error(`Invalid --owner: ${owner}. Must be one of: ${VALID_OWNERS.join(', ')}`);
    process.exit(1);
  }
  const notes = flags.notes || '';
  const createdBy = flags.by || '';
  await ensureTable();
  const r = await db.execute({
    sql: 'INSERT INTO todos (title, notes, owner, created_by) VALUES (?,?,?,?)',
    args: [title, notes, owner, createdBy],
  });
  console.log(`Added todo #${r.lastInsertRowid} (${owner}): ${title}`);
}

async function cmdList(args: string[]) {
  const { flags } = parseFlags(args);
  await ensureTable();
  const conditions: string[] = [];
  const sqlArgs: string[] = [];
  if (flags.owner) {
    if (!VALID_OWNERS.includes(flags.owner as Owner)) {
      console.error(`Invalid --owner: ${flags.owner}`);
      process.exit(1);
    }
    conditions.push('owner = ?');
    sqlArgs.push(flags.owner);
  }
  if (flags.status) {
    if (!VALID_STATUSES.includes(flags.status as Status)) {
      console.error(`Invalid --status: ${flags.status}`);
      process.exit(1);
    }
    conditions.push('status = ?');
    sqlArgs.push(flags.status);
  } else {
    // default to open if no status flag passed
    conditions.push('status = ?');
    sqlArgs.push('open');
  }
  const where = 'WHERE ' + conditions.join(' AND ');
  const rows = (await db.execute({
    sql: `SELECT * FROM todos ${where} ORDER BY status ASC, created_at DESC`,
    args: sqlArgs,
  })).rows as any[];
  if (rows.length === 0) {
    console.log('No todos.');
    return;
  }
  for (const r of rows) console.log(fmtRow(r));
}

async function cmdSetStatus(args: string[], status: Status) {
  const id = Number(args[0]);
  if (!Number.isFinite(id)) {
    console.error(`Usage: todo ${status === 'done' ? 'done' : 'open'} <id>`);
    process.exit(1);
  }
  await ensureTable();
  if (status === 'done') {
    await db.execute({ sql: "UPDATE todos SET status = ?, completed_at = datetime('now') WHERE id = ?", args: [status, id] });
  } else {
    await db.execute({ sql: 'UPDATE todos SET status = ?, completed_at = NULL WHERE id = ?', args: [status, id] });
  }
  console.log(`Todo #${id} marked ${status}.`);
}

async function cmdRm(args: string[]) {
  const id = Number(args[0]);
  if (!Number.isFinite(id)) {
    console.error('Usage: todo rm <id>');
    process.exit(1);
  }
  await ensureTable();
  await db.execute({ sql: 'DELETE FROM todos WHERE id = ?', args: [id] });
  console.log(`Deleted todo #${id}.`);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  switch (command) {
    case 'add':
      return cmdAdd(rest);
    case 'list':
    case 'ls':
      return cmdList(rest);
    case 'done':
      return cmdSetStatus(rest, 'done');
    case 'open':
    case 'reopen':
      return cmdSetStatus(rest, 'open');
    case 'rm':
    case 'delete':
      return cmdRm(rest);
    default:
      console.log(`NGL Shared Todos CLI

Usage:
  todo add "title" --owner brayan|ryan|either [--notes "..."] [--by brayan|ryan]
  todo list [--owner brayan|ryan|either] [--status open|done]
  todo done <id>
  todo open <id>
  todo rm <id>

Examples:
  npm run todo -- add "Send Roche June outline" --owner brayan
  npm run todo -- list --owner ryan
  npm run todo -- done 12
`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
