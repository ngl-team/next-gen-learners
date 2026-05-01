import { NextResponse } from 'next/server';
import { getCurrentUserId, BANK } from '@/lib/nst';

function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function GET() {
  const user = await getCurrentUserId();
  if (!user) return NextResponse.json({ error: 'not logged in' }, { status: 401 });

  const mcPool: Array<Record<string, unknown>> = [];
  const openPool: Array<Record<string, unknown>> = [];
  for (const [classKey, cls] of Object.entries(BANK.classes)) {
    for (const q of cls.questions) {
      const item = { ...q, class_key: classKey, class_title: cls.title };
      if (q.type === 'mc') mcPool.push(item);
      else openPool.push(item);
    }
  }

  const seed = user.id + Math.floor(Date.now() / (1000 * 60 * 60));
  const mc = shuffleSeeded(mcPool, seed).slice(0, 25);
  const open = shuffleSeeded(openPool, seed + 1).slice(0, 5);
  return NextResponse.json({ items: [...mc, ...open] });
}
