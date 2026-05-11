import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { updateSubscription, deleteSubscription, logActivity } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  const { type, category, description, person, account, payment_method, amount, day_of_month, start_date, end_date, active } = data;
  await updateSubscription(parseInt(id), {
    type,
    category,
    description: description || '',
    person: person || '',
    account: account || '',
    payment_method: payment_method || '',
    amount: parseFloat(amount),
    day_of_month: parseInt(day_of_month) || 1,
    start_date,
    end_date: end_date || null,
    active: active === 0 || active === '0' ? 0 : 1,
  });
  await logActivity({ person: data._actor || person || 'unknown', action: 'updated subscription', resource_type: 'subscription', resource_name: `${type} — ${category}`, details: `$${amount}/mo` });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const actor = req.nextUrl.searchParams.get('_actor') || 'unknown';
  await deleteSubscription(parseInt(id));
  await logActivity({ person: actor, action: 'deleted subscription', resource_type: 'subscription', resource_name: `#${id}` });
  return NextResponse.json({ success: true });
}
