import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId, BANK } from '@/lib/nst';

function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUserId();
  if (!user) return NextResponse.json({ error: 'not logged in' }, { status: 401 });

  const url = new URL(req.url);
  const filter = url.searchParams.get('filter') || 'all';
  const seedParam = url.searchParams.get('seed');
  const seed = seedParam ? Number(seedParam) : Date.now();

  const pool: Array<Record<string, unknown>> = [];
  if (filter === 'all' || filter === 'classes') {
    for (const [classKey, cls] of Object.entries(BANK.classes)) {
      for (const q of cls.questions) {
        if (q.type === 'open') pool.push({ ...q, class_key: classKey, class_title: cls.title });
      }
    }
  }
  if (filter === 'all' || filter === 'labs') {
    for (const [classKey, cls] of Object.entries(BANK.labs)) {
      for (const q of cls.questions) {
        if (q.type === 'open') pool.push({ ...q, class_key: classKey, class_title: cls.title });
      }
    }
  }

  const items = shuffleSeeded(pool, seed);
  return NextResponse.json({ items, seed });
}
