import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { updatePnlEntry, deletePnlEntry } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const { date, type, category, description, amount, person } = await req.json();
  await updatePnlEntry(parseInt(id), { date, type, category, description: description || '', amount: parseFloat(amount), person: person || '' });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  await deletePnlEntry(parseInt(id));
  return NextResponse.json({ success: true });
}
