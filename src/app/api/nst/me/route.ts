import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/nst';

export async function GET() {
  const user = await getCurrentUserId();
  if (!user) return NextResponse.json({ name: null });
  return NextResponse.json({ name: user.name });
}
