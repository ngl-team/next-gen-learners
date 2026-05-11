import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { updatePnlEntry, deletePnlEntry, logActivity } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  const { date, type, category, description, amount, person, account, payment_method, reimbursable, reimbursed_at } = data;
  await updatePnlEntry(parseInt(id), { date, type, category, description: description || '', amount: parseFloat(amount), person: person || '', account: account || '', payment_method: payment_method || '', reimbursable: reimbursable ? 1 : 0, reimbursed_at: reimbursed_at || null });
  await logActivity({ person: data._actor || person || 'unknown', action: 'updated', resource_type: 'pnl_entry', resource_name: `${type} — ${category}`, details: `$${amount}` });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const actor = req.nextUrl.searchParams.get('_actor') || 'unknown';
  await deletePnlEntry(parseInt(id));
  await logActivity({ person: actor, action: 'deleted', resource_type: 'pnl_entry', resource_name: `#${id}` });
  return NextResponse.json({ success: true });
}
