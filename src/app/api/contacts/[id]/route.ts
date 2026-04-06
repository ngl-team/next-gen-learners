import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { updateContact, deleteContact } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  await updateContact(parseInt(id), { name: data.name, title: data.title || '', organization: data.organization || '', email: data.email || '', status: data.status || 'cold', notes: data.notes || '', contact_type: data.contact_type || 'outreach', relationship_status: data.relationship_status || '' });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  await deleteContact(parseInt(id));
  return NextResponse.json({ success: true });
}
