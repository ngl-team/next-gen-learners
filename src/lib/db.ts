import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
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
  await db.execute(`
    CREATE TABLE IF NOT EXISTS classrooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      grade TEXT NOT NULL,
      subject TEXT NOT NULL,
      class_size INTEGER DEFAULT 25,
      special_notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tool_outputs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classroom_id INTEGER,
      tool TEXT NOT NULL,
      input_data TEXT DEFAULT '',
      generated_output TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS lesson_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classroom_id INTEGER,
      topic TEXT NOT NULL,
      objectives TEXT DEFAULT '',
      additional_notes TEXT DEFAULT '',
      generated_plan TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS time_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      description TEXT DEFAULT '',
      minutes INTEGER NOT NULL,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      person TEXT NOT NULL,
      action TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      resource_name TEXT DEFAULT '',
      details TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS research_feed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      source_url TEXT DEFAULT '',
      source_name TEXT DEFAULT '',
      relevance TEXT DEFAULT '',
      action_item TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sync_state (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
  // Migrations
  try { await db.execute("ALTER TABLE contacts ADD COLUMN source TEXT DEFAULT 'ryan'"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN channel TEXT DEFAULT ''"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN revenue REAL DEFAULT 0"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN follow_up_date TEXT DEFAULT NULL"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN contact_type TEXT DEFAULT 'outreach'"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN relationship_status TEXT DEFAULT ''"); } catch {}
  try { await db.execute("ALTER TABLE activity_log ADD COLUMN external_id TEXT DEFAULT NULL"); } catch {}
  // Command center migrations
  try { await db.execute("ALTER TABLE contacts ADD COLUMN end_goal TEXT DEFAULT ''"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN priority TEXT DEFAULT 'pipeline'"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN pipeline TEXT DEFAULT ''"); } catch {}
  try { await db.execute("ALTER TABLE contacts ADD COLUMN auto_followup INTEGER DEFAULT 1"); } catch {}

  await db.execute(`
    CREATE TABLE IF NOT EXISTS brain_dumps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      raw_text TEXT NOT NULL,
      action_items TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS quick_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER,
      channel TEXT DEFAULT 'imessage',
      note TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS proposals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      business_name TEXT NOT NULL,
      business_url TEXT DEFAULT '',
      html TEXT NOT NULL,
      proposal_data TEXT DEFAULT '',
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

export async function updateContact(id: number, data: { name: string; title: string; organization: string; email: string; status: string; notes: string; contact_type?: string; relationship_status?: string }) {
  await initDb();
  await db.execute({ sql: 'UPDATE contacts SET name=?, title=?, organization=?, email=?, status=?, notes=?, contact_type=?, relationship_status=? WHERE id=?', args: [data.name, data.title, data.organization, data.email, data.status, data.notes, data.contact_type || 'outreach', data.relationship_status || '', id] });
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

// ── Classrooms ──────────────────────────────────────────────────────
export async function getClassrooms() {
  await initDb();
  return (await db.execute('SELECT * FROM classrooms ORDER BY name')).rows;
}

export async function getClassroom(id: number) {
  await initDb();
  return (await db.execute({ sql: 'SELECT * FROM classrooms WHERE id = ?', args: [id] })).rows[0];
}

export async function insertClassroom(data: { name: string; grade: string; subject: string; class_size: number; special_notes: string }) {
  await initDb();
  const r = await db.execute({ sql: 'INSERT INTO classrooms (name,grade,subject,class_size,special_notes) VALUES (?,?,?,?,?)', args: [data.name, data.grade, data.subject, data.class_size, data.special_notes] });
  return r.lastInsertRowid;
}

export async function updateClassroom(id: number, data: { name: string; grade: string; subject: string; class_size: number; special_notes: string }) {
  await initDb();
  await db.execute({ sql: 'UPDATE classrooms SET name=?, grade=?, subject=?, class_size=?, special_notes=? WHERE id=?', args: [data.name, data.grade, data.subject, data.class_size, data.special_notes, id] });
}

export async function deleteClassroom(id: number) {
  await initDb();
  await db.execute({ sql: 'DELETE FROM classrooms WHERE id = ?', args: [id] });
}

// ── Lesson Plans ────────────────────────────────────────────────────
export async function getLessonPlans() {
  await initDb();
  return (await db.execute('SELECT lp.*, c.name as classroom_name, c.grade, c.subject FROM lesson_plans lp LEFT JOIN classrooms c ON lp.classroom_id = c.id ORDER BY lp.created_at DESC')).rows;
}

export async function getLessonPlan(id: number) {
  await initDb();
  return (await db.execute({ sql: 'SELECT lp.*, c.name as classroom_name, c.grade, c.subject, c.class_size, c.special_notes as classroom_notes FROM lesson_plans lp LEFT JOIN classrooms c ON lp.classroom_id = c.id WHERE lp.id = ?', args: [id] })).rows[0];
}

export async function insertLessonPlan(data: { classroom_id: number; topic: string; objectives: string; additional_notes: string; generated_plan: string }) {
  await initDb();
  const r = await db.execute({ sql: 'INSERT INTO lesson_plans (classroom_id,topic,objectives,additional_notes,generated_plan) VALUES (?,?,?,?,?)', args: [data.classroom_id, data.topic, data.objectives, data.additional_notes, data.generated_plan] });
  return r.lastInsertRowid;
}

export async function deleteLessonPlan(id: number) {
  await initDb();
  await db.execute({ sql: 'DELETE FROM lesson_plans WHERE id = ?', args: [id] });
}

// ── Tool Outputs ────────────────────────────────────────────────────
export async function getToolOutputs(tool: string) {
  await initDb();
  return (await db.execute({ sql: 'SELECT t.*, c.name as classroom_name, c.grade, c.subject FROM tool_outputs t LEFT JOIN classrooms c ON t.classroom_id = c.id WHERE t.tool = ? ORDER BY t.created_at DESC', args: [tool] })).rows;
}

export async function getToolOutput(id: number) {
  await initDb();
  return (await db.execute({ sql: 'SELECT t.*, c.name as classroom_name, c.grade, c.subject, c.class_size, c.special_notes as classroom_notes FROM tool_outputs t LEFT JOIN classrooms c ON t.classroom_id = c.id WHERE t.id = ?', args: [id] })).rows[0];
}

export async function insertToolOutput(data: { classroom_id: number; tool: string; input_data: string; generated_output: string }) {
  await initDb();
  const r = await db.execute({ sql: 'INSERT INTO tool_outputs (classroom_id,tool,input_data,generated_output) VALUES (?,?,?,?)', args: [data.classroom_id, data.tool, data.input_data, data.generated_output] });
  return r.lastInsertRowid;
}

export async function deleteToolOutput(id: number) {
  await initDb();
  await db.execute({ sql: 'DELETE FROM tool_outputs WHERE id = ?', args: [id] });
}

export async function getToolOutputByKey(tool: string, key: string) {
  await initDb();
  const r = await db.execute({ sql: 'SELECT * FROM tool_outputs WHERE tool = ? AND input_data = ? ORDER BY created_at DESC LIMIT 1', args: [tool, key] });
  return r.rows[0] as unknown as { id: number; tool: string; input_data: string; generated_output: string; created_at: string } | undefined;
}

export async function upsertToolOutputByKey(tool: string, key: string, output: string) {
  await initDb();
  const existing = await getToolOutputByKey(tool, key);
  if (existing) {
    await db.execute({ sql: 'UPDATE tool_outputs SET generated_output = ? WHERE id = ?', args: [output, existing.id] });
    return existing.id;
  }
  const r = await db.execute({ sql: 'INSERT INTO tool_outputs (classroom_id, tool, input_data, generated_output) VALUES (?, ?, ?, ?)', args: [0, tool, key, output] });
  return r.lastInsertRowid;
}

// ── Time Tracker ───────────────────────────────────────────────────
export async function getTimeEntries(from?: string, to?: string) {
  await initDb();
  if (from && to) {
    return (await db.execute({ sql: 'SELECT * FROM time_entries WHERE date >= ? AND date <= ? ORDER BY date DESC, id DESC', args: [from, to] })).rows;
  }
  return (await db.execute('SELECT * FROM time_entries ORDER BY date DESC, id DESC')).rows;
}

export async function insertTimeEntry(data: { category: string; description: string; minutes: number; date: string }) {
  await initDb();
  const r = await db.execute({ sql: 'INSERT INTO time_entries (category,description,minutes,date) VALUES (?,?,?,?)', args: [data.category, data.description, data.minutes, data.date] });
  return r.lastInsertRowid;
}

export async function deleteTimeEntry(id: number) {
  await initDb();
  await db.execute({ sql: 'DELETE FROM time_entries WHERE id = ?', args: [id] });
}

export async function getTimeSummary(from: string, to: string) {
  await initDb();
  return (await db.execute({ sql: 'SELECT category, SUM(minutes) as total_minutes, COUNT(*) as entry_count FROM time_entries WHERE date >= ? AND date <= ? GROUP BY category ORDER BY total_minutes DESC', args: [from, to] })).rows;
}

// ── Activity Log ──────────────────────────────────────────────────
export async function logActivity(data: { person: string; action: string; resource_type: string; resource_name: string; details?: string }) {
  await initDb();
  await db.execute({ sql: 'INSERT INTO activity_log (person, action, resource_type, resource_name, details) VALUES (?,?,?,?,?)', args: [data.person, data.action, data.resource_type, data.resource_name, data.details || ''] });
}

export async function getActivityLog(limit = 50) {
  await initDb();
  return (await db.execute({ sql: 'SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?', args: [limit] })).rows;
}

export async function getActivityByPerson(person: string, limit = 50) {
  await initDb();
  return (await db.execute({ sql: 'SELECT * FROM activity_log WHERE person = ? ORDER BY created_at DESC LIMIT ?', args: [person, limit] })).rows;
}

// ── Sync State ──────────────────────────────────────────────────
export async function getSyncState(key: string): Promise<string | null> {
  await initDb();
  const row = (await db.execute({ sql: 'SELECT value FROM sync_state WHERE key = ?', args: [key] })).rows[0];
  return row ? (row.value as string) : null;
}

export async function setSyncState(key: string, value: string) {
  await initDb();
  await db.execute({ sql: 'INSERT OR REPLACE INTO sync_state (key, value) VALUES (?, ?)', args: [key, value] });
}

export async function logActivityIfNew(externalId: string, data: { person: string; action: string; resource_type: string; resource_name: string; details?: string; created_at?: string }): Promise<boolean> {
  await initDb();
  const existing = (await db.execute({ sql: 'SELECT id FROM activity_log WHERE external_id = ?', args: [externalId] })).rows;
  if (existing.length > 0) return false;
  if (data.created_at) {
    await db.execute({ sql: 'INSERT INTO activity_log (person, action, resource_type, resource_name, details, external_id, created_at) VALUES (?,?,?,?,?,?,?)', args: [data.person, data.action, data.resource_type, data.resource_name, data.details || '', externalId, data.created_at] });
  } else {
    await db.execute({ sql: 'INSERT INTO activity_log (person, action, resource_type, resource_name, details, external_id) VALUES (?,?,?,?,?,?)', args: [data.person, data.action, data.resource_type, data.resource_name, data.details || '', externalId] });
  }
  return true;
}

// ── Research Feed ────────────────────────────────────────────────
export async function getResearchFeed(limit = 50, category?: string) {
  await initDb();
  if (category) {
    return (await db.execute({ sql: 'SELECT * FROM research_feed WHERE category = ? ORDER BY created_at DESC LIMIT ?', args: [category, limit] })).rows;
  }
  return (await db.execute({ sql: 'SELECT * FROM research_feed ORDER BY created_at DESC LIMIT ?', args: [limit] })).rows;
}

export async function insertResearchItem(data: { category: string; title: string; summary: string; source_url: string; source_name: string; relevance: string; action_item: string }) {
  await initDb();
  const r = await db.execute({ sql: 'INSERT INTO research_feed (category, title, summary, source_url, source_name, relevance, action_item) VALUES (?,?,?,?,?,?,?)', args: [data.category, data.title, data.summary, data.source_url, data.source_name, data.relevance, data.action_item] });
  return r.lastInsertRowid;
}

export async function getLatestResearchTime() {
  await initDb();
  const row = (await db.execute('SELECT created_at FROM research_feed ORDER BY created_at DESC LIMIT 1')).rows[0];
  return row?.created_at as string | undefined;
}

// ── Proposals ──────────────────────────────────────────────────
export async function getProposal(slug: string) {
  await initDb();
  return (await db.execute({ sql: 'SELECT * FROM proposals WHERE slug = ?', args: [slug] })).rows[0];
}

export async function upsertProposal(data: { slug: string; business_name: string; business_url: string; html: string; proposal_data: string }) {
  await initDb();
  const existing = await getProposal(data.slug);
  if (existing) {
    await db.execute({ sql: 'UPDATE proposals SET html=?, proposal_data=?, business_url=? WHERE slug=?', args: [data.html, data.proposal_data, data.business_url, data.slug] });
    return existing.id;
  } else {
    const r = await db.execute({ sql: 'INSERT INTO proposals (slug, business_name, business_url, html, proposal_data) VALUES (?,?,?,?,?)', args: [data.slug, data.business_name, data.business_url, data.html, data.proposal_data] });
    return r.lastInsertRowid;
  }
}

export async function getAllProposals() {
  await initDb();
  return (await db.execute('SELECT id, slug, business_name, business_url, created_at FROM proposals ORDER BY created_at DESC')).rows;
}

// ── Command Center ──────────────────────────────────────────────
export async function getCommandContacts() {
  await initDb();
  return (await db.execute("SELECT * FROM contacts ORDER BY CASE priority WHEN 'high-touch' THEN 0 WHEN 'active-deal' THEN 1 WHEN 'pipeline' THEN 2 ELSE 3 END, last_contact_date ASC")).rows;
}

export async function getOverdueFollowups() {
  await initDb();
  // Only flag contacts that have an end goal — no goal means no reason to follow up
  return (await db.execute("SELECT * FROM contacts WHERE follow_up_date IS NOT NULL AND follow_up_date <= date('now') AND end_goal != '' ORDER BY follow_up_date ASC")).rows;
}

export async function getGoingCold(days: number = 7) {
  await initDb();
  // Only flag contacts with an end goal — if there's no goal, there's no reason to flag them
  return (await db.execute({ sql: "SELECT * FROM contacts WHERE end_goal != '' AND status NOT IN ('signed','cold') AND (last_contact_date IS NOT NULL AND last_contact_date <= date('now', '-' || ? || ' days')) ORDER BY last_contact_date ASC", args: [days] })).rows;
}

export async function updateContactGoal(id: number, data: { end_goal: string; priority: string; pipeline: string; auto_followup: number }) {
  await initDb();
  await db.execute({ sql: 'UPDATE contacts SET end_goal=?, priority=?, pipeline=?, auto_followup=? WHERE id=?', args: [data.end_goal, data.priority, data.pipeline, data.auto_followup, id] });
}

// ── Brain Dumps ─────────────────────────────────────────────────
export async function getBrainDumps(limit = 20) {
  await initDb();
  return (await db.execute({ sql: 'SELECT * FROM brain_dumps ORDER BY created_at DESC LIMIT ?', args: [limit] })).rows;
}

export async function insertBrainDump(data: { raw_text: string; action_items: string }) {
  await initDb();
  const r = await db.execute({ sql: 'INSERT INTO brain_dumps (raw_text, action_items) VALUES (?,?)', args: [data.raw_text, data.action_items] });
  return r.lastInsertRowid;
}

export async function deleteBrainDump(id: number) {
  await initDb();
  await db.execute({ sql: 'DELETE FROM brain_dumps WHERE id = ?', args: [id] });
}

// ── Quick Logs ──────────────────────────────────────────────────
export async function getQuickLogs(limit = 30) {
  await initDb();
  return (await db.execute({ sql: "SELECT ql.*, c.name as contact_name FROM quick_logs ql LEFT JOIN contacts c ON ql.contact_id = c.id ORDER BY ql.created_at DESC LIMIT ?", args: [limit] })).rows;
}

export async function insertQuickLog(data: { contact_id: number | null; channel: string; note: string }) {
  await initDb();
  const r = await db.execute({ sql: 'INSERT INTO quick_logs (contact_id, channel, note) VALUES (?,?,?)', args: [data.contact_id, data.channel, data.note] });
  // Also update contact's last_contact_date
  if (data.contact_id) {
    await db.execute({ sql: "UPDATE contacts SET last_contact_date = date('now'), times_contacted = times_contacted + 1 WHERE id = ?", args: [data.contact_id] });
  }
  return r.lastInsertRowid;
}
