import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getDhSubmissions } from '@/lib/db';
import AdminLogin from './AdminLogin';

const ADMIN_PASSWORD = process.env.DH_ADMIN_PASSWORD || 'ctbuilds2026';
const SECRET = process.env.SESSION_SECRET || 'dh-default-secret';

function expectedToken() {
  return crypto.createHmac('sha256', SECRET).update(`dh:${ADMIN_PASSWORD}`).digest('hex');
}

async function isAdminAuthed() {
  const c = await cookies();
  return c.get('dh_admin')?.value === expectedToken();
}

const containerStyle: React.CSSProperties = {
  background: '#FAFBFA',
  color: '#111827',
  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  minHeight: '100vh',
};

export default async function DhAdminPage() {
  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <div style={containerStyle}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '120px 24px 24px' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700, marginBottom: 8 }}>CT Builds Admin</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20 }}>Sign in</h1>
          <AdminLogin />
        </div>
      </div>
    );
  }

  const rows = await getDhSubmissions();
  type Row = { id: number; help_type: string; region: string; matched_hub: string; matched_advisor: string; name: string; email: string; notes: string; created_at: string };
  const data = rows as unknown as Row[];

  const total = data.length;
  const byHelp = data.reduce<Record<string, number>>((acc, r) => { acc[r.help_type] = (acc[r.help_type] || 0) + 1; return acc; }, {});
  const byRegion = data.reduce<Record<string, number>>((acc, r) => { acc[r.region] = (acc[r.region] || 0) + 1; return acc; }, {});
  const byHub = data.reduce<Record<string, number>>((acc, r) => { acc[r.matched_hub] = (acc[r.matched_hub] || 0) + 1; return acc; }, {});

  return (
    <div style={containerStyle}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700, marginBottom: 6 }}>CT Builds Admin</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Submissions</h1>
        <p style={{ color: '#6B7280', fontSize: '0.92rem', marginBottom: 32 }}>Every routing form submission, what they asked for, where they were sent.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 32 }}>
          <Card label="Total submissions" value={total} />
          <Breakdown label="By help type" map={byHelp} />
          <Breakdown label="By region" map={byRegion} />
          <Breakdown label="By matched hub" map={byHub} />
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead style={{ background: '#F9FAFB' }}>
                <tr>
                  {['When', 'Help type', 'Region', 'Matched hub', 'Matched advisor', 'Name', 'Email', 'Notes'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700, borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>No submissions yet.</td></tr>
                )}
                {data.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', color: '#6B7280' }}>{new Date(r.created_at).toLocaleString()}</td>
                    <td style={{ padding: '12px 14px' }}>{r.help_type}</td>
                    <td style={{ padding: '12px 14px' }}>{r.region}</td>
                    <td style={{ padding: '12px 14px' }}>{r.matched_hub}</td>
                    <td style={{ padding: '12px 14px' }}>{r.matched_advisor}</td>
                    <td style={{ padding: '12px 14px' }}>{r.name || '-'}</td>
                    <td style={{ padding: '12px 14px' }}>{r.email || '-'}</td>
                    <td style={{ padding: '12px 14px', maxWidth: 280, color: '#4B5563' }}>{r.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: 18 }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}

function Breakdown({ label, map }: { label: string; map: Record<string, number> }) {
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: 18 }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700, marginBottom: 10 }}>{label}</div>
      {entries.length === 0 && <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>No data yet</div>}
      {entries.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '4px 0', borderBottom: '1px dashed #F3F4F6' }}>
          <span style={{ color: '#374151' }}>{k}</span>
          <span style={{ color: '#111827', fontWeight: 700 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}
