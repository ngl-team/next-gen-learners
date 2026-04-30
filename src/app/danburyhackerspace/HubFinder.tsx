'use client';

import { useMemo, useState } from 'react';

type Hub = { name: string; city: string; region: string; url: string; blurb?: string };
type Partner = { name: string; url: string; tag?: string };

const HELP_TYPES = [
  { value: 'funding', label: 'Funding', advisor: 'CT SBDC' },
  { value: 'prototyping', label: 'Prototyping & fabrication', advisor: 'FORGE' },
  { value: 'mentorship', label: 'Mentorship', advisor: 'SCORE' },
  { value: 'legal', label: 'Legal & compliance', advisor: 'CT SBDC' },
  { value: 'marketing', label: 'Marketing & growth', advisor: 'CT SBDC' },
  { value: 'women-founder', label: 'Women founder support', advisor: 'WBDC' },
  { value: 'exploring', label: 'Just exploring', advisor: 'SCORE' },
];

const REGIONS = [
  { value: 'Western CT', match: 'Danbury Hackerspace' },
  { value: 'New Haven area', match: 'MakeHaven' },
  { value: 'Greater Hartford', match: 'Makerspace CT' },
  { value: 'Fairfield County', match: 'Fairfield County Makers Guild' },
  { value: 'New London area', match: 'Cure Labs & Spark' },
  { value: 'Other', match: 'Makerspace CT' },
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  fontSize: '0.95rem',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.04)',
  fontFamily: 'inherit',
  color: '#F1F5F9',
  backdropFilter: 'blur(8px)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.74rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.6)',
  marginBottom: 10,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

export default function HubFinder({ hubs, partners }: { hubs: Hub[]; partners: Partner[] }) {
  const [helpType, setHelpType] = useState('');
  const [region, setRegion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const matchedHub = useMemo(() => {
    if (!region) return null;
    const target = REGIONS.find((r) => r.value === region)?.match;
    return hubs.find((h) => h.name === target) || null;
  }, [region, hubs]);

  const matchedAdvisor = useMemo(() => {
    if (!helpType) return null;
    const target = HELP_TYPES.find((h) => h.value === helpType)?.advisor;
    return partners.find((p) => p.name === target) || null;
  }, [helpType, partners]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!helpType || !region) {
      setError('Pick a help type and a region.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/danburyhackerspace/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          help_type: HELP_TYPES.find((h) => h.value === helpType)?.label || helpType,
          region,
          matched_hub: matchedHub?.name || '',
          matched_advisor: matchedAdvisor?.name || '',
          name,
          email,
          notes,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Submit failed');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 32, backdropFilter: 'blur(14px)' }}>
      <style>{`
        @keyframes dh-match-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dh-success-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .dh-match { animation: dh-match-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .dh-success { animation: dh-success-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .dh-input:focus { outline: none; border-color: rgba(99,102,241,0.6); box-shadow: 0 0 0 4px rgba(99,102,241,0.18); background: rgba(255,255,255,0.06); }
        .dh-input::placeholder { color: rgba(255,255,255,0.3); }
        .dh-input option { background: #0F0F1A; color: #F1F5F9; }
        .dh-submit { transition: transform 200ms ease, box-shadow 200ms ease; }
        .dh-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(99,102,241,0.35); }
        .dh-submit:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={labelStyle} htmlFor="help_type">What kind of help?</label>
          <select id="help_type" value={helpType} onChange={(e) => setHelpType(e.target.value)} className="dh-input" style={inputStyle} required>
            <option value="">Pick one</option>
            {HELP_TYPES.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle} htmlFor="region">Where in CT?</label>
          <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} className="dh-input" style={inputStyle} required>
            <option value="">Pick one</option>
            {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.value}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={labelStyle} htmlFor="name">Name (optional)</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="dh-input" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="email">Email (optional)</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="dh-input" style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle} htmlFor="notes">Anything else? (optional)</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="dh-input" style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
      </div>

      {matchedHub && matchedAdvisor && !submitted && (
        <div key={`${matchedHub.name}-${matchedAdvisor.name}`} className="dh-match" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(165,180,252,0.95)', fontWeight: 700, marginBottom: 10 }}>Suggested match</div>
          <div style={{ fontSize: '0.95rem', color: '#E2E8F0', lineHeight: 1.7 }}>
            Closest hub: <a href={matchedHub.url} target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF', fontWeight: 600 }}>{matchedHub.name}</a> in {matchedHub.city}.
            <br />
            Advisor: <a href={matchedAdvisor.url} target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF', fontWeight: 600 }}>{matchedAdvisor.name}</a>{matchedAdvisor.tag ? `. ${matchedAdvisor.tag}` : ''}.
          </div>
        </div>
      )}

      {error && <div style={{ color: '#FCA5A5', fontSize: '0.88rem', marginBottom: 16 }}>{error}</div>}

      {submitted ? (
        <div className="dh-success" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, color: '#6EE7B7', marginBottom: 6 }}>Logged. Welcome to the network.</div>
          <div style={{ fontSize: '0.92rem', color: '#A7F3D0', lineHeight: 1.7 }}>
            {matchedHub && <>Closest hub: <a href={matchedHub.url} target="_blank" rel="noopener noreferrer" style={{ color: '#D1FAE5', fontWeight: 600 }}>{matchedHub.name}</a> in {matchedHub.city}. </>}
            {matchedAdvisor && <>Advisor: <a href={matchedAdvisor.url} target="_blank" rel="noopener noreferrer" style={{ color: '#D1FAE5', fontWeight: 600 }}>{matchedAdvisor.name}</a>.</>}
          </div>
        </div>
      ) : (
        <button type="submit" disabled={submitting} className="dh-submit" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#FFFFFF', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: '0.96rem', fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 20px rgba(99,102,241,0.25)' }}>
          {submitting ? 'Submitting...' : 'Find my match →'}
        </button>
      )}
    </form>
  );
}
