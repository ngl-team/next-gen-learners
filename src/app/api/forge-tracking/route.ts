import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { logClientVisit, getClientVisits, getClientTrackingSummary } from '@/lib/db';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.product) return NextResponse.json({ error: 'product required' }, { status: 400, headers: CORS_HEADERS });
  const ua = req.headers.get('user-agent') || '';
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
  const referrer = req.headers.get('referer') || '';
  await logClientVisit({ product: data.product, page: data.page || '/', user_agent: ua, ip, referrer });
  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const summary = req.nextUrl.searchParams.get('summary');
  if (summary === '1') {
    return NextResponse.json(await getClientTrackingSummary());
  }
  const product = req.nextUrl.searchParams.get('product') || undefined;
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');
  return NextResponse.json(await getClientVisits(product, limit));
}
