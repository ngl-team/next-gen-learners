import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;

export async function initDb() {
  if (initialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pnl_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT DEFAULT '',
      amount REAL NOT NULL,
      person TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  initialized = true;
}

export async function getPnlEntries(from?: string, to?: string) {
  await initDb();
  if (from && to) {
    const r = await db.execute({ sql: 'SELECT * FROM pnl_entries WHERE date >= ? AND date <= ? ORDER BY date DESC, id DESC', args: [from, to] });
    return r.rows;
  }
  const r = await db.execute('SELECT * FROM pnl_entries ORDER BY date DESC, id DESC');
  return r.rows;
}

export async function getPnlSummary(from: string, to: string) {
  await initDb();
  const r = await db.execute({ sql: 'SELECT type, category, SUM(amount) as total FROM pnl_entries WHERE date >= ? AND date <= ? GROUP BY type, category ORDER BY type, total DESC', args: [from, to] });
  return r.rows;
}

export async function getPnlMonthly() {
  await initDb();
  const r = await db.execute("SELECT strftime('%Y-%m', date) as month, type, SUM(amount) as total FROM pnl_entries GROUP BY month, type ORDER BY month");
  return r.rows;
}

export async function insertPnlEntry(data: { date: string; type: string; category: string; description: string; amount: number; person: string }) {
  await initDb();
  const r = await db.execute({ sql: 'INSERT INTO pnl_entries (date,type,category,description,amount,person) VALUES (?,?,?,?,?,?)', args: [data.date, data.type, data.category, data.description, data.amount, data.person] });
  return r.lastInsertRowid;
}

export async function updatePnlEntry(id: number, data: { date: string; type: string; category: string; description: string; amount: number; person: string }) {
  await initDb();
  await db.execute({ sql: 'UPDATE pnl_entries SET date=?, type=?, category=?, description=?, amount=?, person=? WHERE id=?', args: [data.date, data.type, data.category, data.description, data.amount, data.person, id] });
}

export async function deletePnlEntry(id: number) {
  await initDb();
  await db.execute({ sql: 'DELETE FROM pnl_entries WHERE id = ?', args: [id] });
}

export async function bulkInsertPnlEntries(entries: { date: string; type: string; category: string; description: string; amount: number; person: string }[]) {
  await initDb();
  let count = 0;
  for (const e of entries) {
    await db.execute({ sql: 'INSERT INTO pnl_entries (date,type,category,description,amount,person) VALUES (?,?,?,?,?,?)', args: [e.date, e.type, e.category, e.description, e.amount, e.person] });
    count++;
  }
  return count;
}
