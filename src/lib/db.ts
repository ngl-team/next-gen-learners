import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;

export async function initDb() {
  if (initialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT DEFAULT '',
      organization TEXT DEFAULT '',
      email TEXT DEFAULT '',
      status TEXT DEFAULT 'cold',
      times_contacted INTEGER DEFAULT 0,
      last_contact_date TEXT DEFAULT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER NOT NULL,
      type TEXT DEFAULT 'email',
      subject TEXT DEFAULT '',
      body TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS oauth_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL DEFAULT 'gmail',
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      expiry TEXT NOT NULL,
      email TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
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
  // Migrations
  try { await db.execute("ALTER TABLE contacts ADD COLUMN source TEXT DEFAULT 'brayan'"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN channel TEXT DEFAULT ''"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN revenue REAL DEFAULT 0"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN follow_up_date TEXT DEFAULT NULL"); } catch {}

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

// ── Metrics ──────────────────────────────────────────────────────────
export async function getMetrics() {
  await initDb();
  const replyByChannel = (await db.execute(
    "SELECT channel, COUNT(*) as total, SUM(CASE WHEN status IN ('replied','signed') THEN 1 ELSE 0 END) as replied, SUM(revenue) as revenue FROM contacts WHERE channel != '' GROUP BY channel ORDER BY total DESC"
  )).rows;
  const replyBySource = (await db.execute(
    "SELECT source, COUNT(*) as total, SUM(CASE WHEN status IN ('replied','signed') THEN 1 ELSE 0 END) as replied, SUM(revenue) as revenue FROM contacts GROUP BY source ORDER BY total DESC"
  )).rows;
  const replyByOrg = (await db.execute(
    "SELECT organization, COUNT(*) as total, SUM(CASE WHEN status IN ('replied','signed') THEN 1 ELSE 0 END) as replied, SUM(revenue) as revenue FROM contacts WHERE organization != '' GROUP BY organization ORDER BY replied DESC, total DESC LIMIT 15"
  )).rows;
  const staleContacts = (await db.execute(
    "SELECT * FROM contacts WHERE status = 'emailed' AND (last_contact_date IS NULL OR last_contact_date <= date('now', '-7 days') OR (last_contact_date IS NULL AND created_at <= datetime('now', '-7 days'))) ORDER BY created_at"
  )).rows;
  const statusCounts = (await db.execute(
    "SELECT status, COUNT(*) as count FROM contacts GROUP BY status ORDER BY count DESC"
  )).rows;
  const totalRevenue = (await db.execute("SELECT SUM(revenue) as total FROM contacts")).rows[0];

  return { replyByChannel, replyBySource, replyByOrg, staleContacts, statusCounts, totalRevenue };
}

// ── CRM ─────────────────────────────────────────────────────────────
export async function getContacts() {
  await initDb();
  return (await db.execute('SELECT * FROM contacts ORDER BY created_at DESC')).rows;
}

export async function getContact(id: number) {
  await initDb();
  return (await db.execute({ sql: 'SELECT * FROM contacts WHERE id = ?', args: [id] })).rows[0];
}

export async function insertContact(data: { name: string; title: string; organization: string; email: string; status: string; notes: string }) {
  await initDb();
  const r = await db.execute({ sql: 'INSERT INTO contacts (name,title,organization,email,status,notes) VALUES (?,?,?,?,?,?)', args: [data.name, data.title, data.organization, data.email, data.status || 'cold', data.notes] });
  return r.lastInsertRowid;
}

export async function updateContact(id: number, data: { name: string; title: string; organization: string; email: string; status: string; notes: string }) {
  await initDb();
  await db.execute({ sql: 'UPDATE contacts SET name=?, title=?, organization=?, email=?, status=?, notes=? WHERE id=?', args: [data.name, data.title, data.organization, data.email, data.status, data.notes, id] });
}

export async function deleteContact(id: number) {
  await initDb();
  await db.execute({ sql: 'DELETE FROM contacts WHERE id = ?', args: [id] });
}

export async function updateContactStatus(id: number, status: string, lastContactDate?: string) {
  await initDb();
  if (lastContactDate) {
    await db.execute({ sql: 'UPDATE contacts SET status=?, last_contact_date=?, times_contacted=times_contacted+1 WHERE id=?', args: [status, lastContactDate, id] });
  } else {
    await db.execute({ sql: 'UPDATE contacts SET status=? WHERE id=?', args: [status, id] });
  }
}

// ── Interactions ─────────────────────────────────────────────────────
export async function getInteractions(contactId: number) {
  await initDb();
  return (await db.execute({ sql: 'SELECT * FROM interactions WHERE contact_id = ? ORDER BY created_at DESC', args: [contactId] })).rows;
}

export async function insertInteraction(data: { contact_id: number; type: string; subject: string; body: string; notes: string }) {
  await initDb();
  const r = await db.execute({ sql: 'INSERT INTO interactions (contact_id,type,subject,body,notes) VALUES (?,?,?,?,?)', args: [data.contact_id, data.type, data.subject, data.body, data.notes] });
  return r.lastInsertRowid;
}

// ── OAuth ────────────────────────────────────────────────────────────
export async function getOAuthToken(provider: string) {
  await initDb();
  return (await db.execute({ sql: 'SELECT * FROM oauth_tokens WHERE provider = ?', args: [provider] })).rows[0];
}

export async function upsertOAuthToken(data: { provider: string; access_token: string; refresh_token: string; expiry: string; email: string }) {
  await initDb();
  const existing = await getOAuthToken(data.provider);
  if (existing) {
    await db.execute({ sql: 'UPDATE oauth_tokens SET access_token=?, refresh_token=?, expiry=?, email=?, updated_at=datetime(\'now\') WHERE provider=?', args: [data.access_token, data.refresh_token, data.expiry, data.email, data.provider] });
  } else {
    await db.execute({ sql: 'INSERT INTO oauth_tokens (provider,access_token,refresh_token,expiry,email) VALUES (?,?,?,?,?)', args: [data.provider, data.access_token, data.refresh_token, data.expiry, data.email] });
  }
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
