import { NextRequest, NextResponse } from 'next/server';
import { shelveContact } from '@/lib/db';

export async function PUT(req: NextRequest) {
  try {
    const { id, shelved } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await shelveContact(id, shelved !== false);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
