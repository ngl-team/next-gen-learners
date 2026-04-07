import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

// NCES Education Data Portal — free, no API key needed
const EDUCATION_DATA_BASE = 'https://educationdata.urban.org/api/v1';

// FIPS state codes
const STATE_FIPS: Record<string, number> = {
  AL: 1, AK: 2, AZ: 4, AR: 5, CA: 6, CO: 8, CT: 9, DE: 10, FL: 12, GA: 13,
  HI: 15, ID: 16, IL: 17, IN: 18, IA: 19, KS: 20, KY: 21, LA: 22, ME: 23, MD: 24,
  MA: 25, MI: 26, MN: 27, MS: 28, MO: 29, MT: 30, NE: 31, NV: 32, NH: 33, NJ: 34,
  NM: 35, NY: 36, NC: 37, ND: 38, OH: 39, OK: 40, OR: 41, PA: 42, RI: 44, SC: 45,
  SD: 46, TN: 47, TX: 48, UT: 49, VT: 50, VA: 51, WA: 53, WV: 54, WI: 55, WY: 56,
  DC: 11,
};

export async function GET(req: NextRequest) {
  const { isAuthenticated } = await import('@/lib/auth');
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const state = req.nextUrl.searchParams.get('state')?.toUpperCase() || '';
  const city = req.nextUrl.searchParams.get('city')?.toLowerCase() || '';
  const level = req.nextUrl.searchParams.get('level') || ''; // elementary, middle, high
  const query = req.nextUrl.searchParams.get('q')?.toLowerCase() || '';
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');

  if (!state) {
    return NextResponse.json({ error: 'State is required (e.g., CT, FL, NY)' }, { status: 400 });
  }

  const fips = STATE_FIPS[state];
  if (!fips) {
    return NextResponse.json({ error: `Invalid state code: ${state}` }, { status: 400 });
  }

  try {
    // Use the most recent available year
    const year = 2022;
    let url = `${EDUCATION_DATA_BASE}/schools/ccd/directory/${year}/?fips=${fips}&school_status=1`;

    // Filter by grade level
    if (level === 'elementary') {
      url += '&lowest_grade_offered_lte=1&highest_grade_offered_lte=5';
    } else if (level === 'middle') {
      url += '&lowest_grade_offered_lte=6&highest_grade_offered_gte=6&highest_grade_offered_lte=8';
    } else if (level === 'high') {
      url += '&highest_grade_offered_gte=9';
    }

    url += `&page=${page}&per_page=50`;

    const resp = await fetch(url, {
      headers: { 'User-Agent': 'NGL-SchoolFinder/1.0' },
      next: { revalidate: 0 },
    });

    if (!resp.ok) {
      return NextResponse.json({ error: `Education Data API: ${resp.status}` }, { status: 502 });
    }

    const data = await resp.json();
    const results = (data.results || [])
      .filter((s: Record<string, unknown>) => {
        if (city && !(s.city_location as string || '').toLowerCase().includes(city)) return false;
        if (query && !(s.school_name as string || '').toLowerCase().includes(query)) return false;
        return true;
      })
      .map((s: Record<string, unknown>) => ({
        name: s.school_name || '',
        nces_id: s.ncessch || '',
        district: s.lea_name || '',
        address: s.street_location || '',
        city: s.city_location || '',
        state: s.state_location || state,
        zip: s.zip_location || '',
        phone: s.phone || '',
        grade_low: s.lowest_grade_offered,
        grade_high: s.highest_grade_offered,
        enrollment: s.enrollment,
        school_type: s.school_type_text || '',
        charter: s.charter === 1,
        magnet: s.magnet === 1,
        title_i: s.title_i_status === 1,
        latitude: s.latitude,
        longitude: s.longitude,
      }));

    return NextResponse.json({
      schools: results,
      total: data.count || results.length,
      page,
      has_more: !!(data.next),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
