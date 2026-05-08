import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getTodos, insertTodo, getTodoCounts } from '@/lib/db';

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get('owner') || undefined;
    const status = searchParams.get('status') || undefined;
    const todos = await getTodos({ owner, status });
    const counts = await getTodoCounts();
    return NextResponse.json({ todos, counts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  try {
    const { title, notes, owner, created_by } = await req.json();
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const validOwners = ['brayan', 'ryan', 'either'];
    const ownerValue = validOwners.includes(owner) ? owner : 'either';
    const id = await insertTodo({
      title: title.trim(),
      notes: (notes || '').trim(),
      owner: ownerValue,
      created_by: (created_by || '').trim(),
    });
    return NextResponse.json({ id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
