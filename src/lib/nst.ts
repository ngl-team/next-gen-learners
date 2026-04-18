import { cookies } from 'next/headers';
import { db, initDb } from './db';
import questions from '@/data/nst-questions.json';

export type QType = 'mc' | 'open';

export type Question = {
  id: string;
  type: QType;
  prompt: string;
  choices?: string[];
  answer?: number;
  rubric?: string;
};

export type ClassGroup = {
  title: string;
  questions: Question[];
};

export type QuestionBank = {
  classes: Record<string, ClassGroup>;
  labs: Record<string, ClassGroup>;
};

export const BANK = questions as unknown as QuestionBank;

export function summarizeTypes(qs: Question[]): 'mc' | 'open' | 'both' {
  const types = new Set(qs.map((q) => q.type || 'mc'));
  if (types.size === 1 && types.has('mc')) return 'mc';
  if (types.size === 1 && types.has('open')) return 'open';
  return 'both';
}

export function getClass(key: string): ClassGroup | null {
  return BANK.classes[key] ?? BANK.labs[key] ?? null;
}

export const COOKIE_NAME = 'nst_user';

export async function getCurrentUserName(): Promise<string | null> {
  const c = await cookies();
  const v = c.get(COOKIE_NAME)?.value;
  return v ? decodeURIComponent(v) : null;
}

export async function getCurrentUserId(): Promise<{ id: number; name: string } | null> {
  const name = await getCurrentUserName();
  if (!name) return null;
  await initDb();
  const r = await db.execute({
    sql: 'SELECT id, name FROM nst_users WHERE name = ?',
    args: [name],
  });
  if (!r.rows.length) return null;
  const row = r.rows[0] as unknown as { id: number; name: string };
  return { id: Number(row.id), name: String(row.name) };
}

export async function upsertUser(name: string): Promise<{ id: number; name: string }> {
  await initDb();
  const normalized = name.trim().toLowerCase();
  await db.execute({
    sql: 'INSERT OR IGNORE INTO nst_users (name) VALUES (?)',
    args: [normalized],
  });
  const r = await db.execute({
    sql: 'SELECT id, name FROM nst_users WHERE name = ?',
    args: [normalized],
  });
  const row = r.rows[0] as unknown as { id: number; name: string };
  return { id: Number(row.id), name: String(row.name) };
}
