import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSubscriptions, insertSubscription, logActivity } from '@/lib/db';

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return NextResponse.json(await getSubscriptions());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const data = await req.json();
  const { type, category, description, person, account, payment_method, amount, day_of_month, start_date, end_date, active, _actor } = data;
  if (!type || !category || !amount || !start_date) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  const id = await insertSubscription({
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
  await logActivity({ person: _actor || person || 'unknown', action: 'added subscription', resource_type: 'subscription', resource_name: `${type} — ${category}`, details: `$${amount}/mo ${description || ''}`.trim() });
  return NextResponse.json({ id });
}
