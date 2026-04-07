import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { deleteTimeEntry, logActivity } from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  const actor = req.nextUrl.searchParams.get('_actor') || 'ryan';
  await deleteTimeEntry(Number(id));
  await logActivity({ person: actor, action: 'deleted', resource_type: 'time_entry', resource_name: `entry #${id}`, details: '' });
  return NextResponse.json({ success: true });
}
