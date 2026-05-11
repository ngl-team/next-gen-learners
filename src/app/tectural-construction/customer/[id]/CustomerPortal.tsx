'use client';

import { useEffect, useState } from 'react';

type Status =
  | 'lead'
  | 'estimated'
  | 'drafted'
  | 'signed'
  | 'scheduled'
  | 'installed'
  | 'invoiced'
  | 'paid';

type ServiceType = 'roofing' | 'solar' | 'painting' | 'construction';
type LeadSource = 'phone' | 'website' | 'referral';
type ContractTier = 'basic' | 'medium' | 'complex';

type Job = {
  id: string;
  customer: string;
  address: string;
  jobType: string;
  amount: number;
  status: Status;
  notes: string;
  updatedAt: string;
  serviceType: ServiceType;
  leadSource: LeadSource;
  contractTier?: ContractTier;
  contractMaterial?: string;
};

const CUSTOMER_STAGES: { status: Status; label: string; hint: string }[] = [
  { status: 'lead', label: 'Inquiry received', hint: 'We have your request and will reach out to schedule a walk-through.' },
  { status: 'estimated', label: 'Estimate prepared', hint: 'A detailed scope and ballpark is on the way to your inbox.' },
  { status: 'drafted', label: 'Contract drafted', hint: 'We have prepared a contract matching the scope. Review when ready.' },
  { status: 'signed', label: 'Contract signed', hint: 'Thank you. We are ordering materials and locking the crew.' },
  { status: 'scheduled', label: 'Job scheduled', hint: 'Your install date is on our calendar.' },
  { status: 'installed', label: 'Work complete', hint: 'The crew is finished. Final inspection is in progress.' },
  { status: 'invoiced', label: 'Invoice sent', hint: 'Final invoice is in your inbox.' },
  { status: 'paid', label: 'Paid in full', hint: 'Thank you. Your warranty is active.' },
];

const STORAGE_KEY = 'tectural_crm_v4';

const FALLBACK_JOBS: Job[] = [
  {
    id: 'j1',
    customer: 'Maria Santos',
    address: '88 Hillcrest Ave, Danbury',
    jobType: 'Metal roof repair',
    amount: 4800,
    status: 'lead',
    notes: '',
    updatedAt: '2h ago',
    serviceType: 'roofing',
    leadSource: 'phone',
  },
  {
    id: 'j2',
    customer: 'Robert Chen',
    address: '142 Oak Ridge Rd, Newtown',
    jobType: 'Asphalt reroof',
    amount: 14200,
    status: 'estimated',
    notes: '',
    updatedAt: '1d ago',
    serviceType: 'roofing',
    leadSource: 'website',
  },
  {
    id: 'j10',
    customer: 'Aronson Estate',
    address: '14 Ridgewood Pl, Ridgefield',
    jobType: 'Full reroof + chimney rebuild',
    amount: 58000,
    status: 'drafted',
    notes: '',
    updatedAt: '12h ago',
    serviceType: 'roofing',
    leadSource: 'referral',
    contractTier: 'medium',
    contractMaterial: 'Slate',
  },
  {
    id: 'j3',
    customer: 'The Bradley Estate',
    address: '27 Plumtrees Rd, Bethel',
    jobType: 'EPDM flat reroof',
    amount: 22400,
    status: 'signed',
    notes: '',
    updatedAt: '3d ago',
    serviceType: 'roofing',
    leadSource: 'referral',
    contractTier: 'medium',
    contractMaterial: 'EPDM rubber',
  },
  {
    id: 'j4',
    customer: 'The Kowalskis',
    address: '156 Mt Pleasant Rd, Newtown',
    jobType: 'Copper accents + repair',
    amount: 8900,
    status: 'scheduled',
    notes: '',
    updatedAt: '4d ago',
    serviceType: 'roofing',
    leadSource: 'phone',
    contractTier: 'basic',
    contractMaterial: 'Metal standing seam',
  },
  {
    id: 'j5',
    customer: "Old St. Mary's Parish",
    address: '312 Church Hill Rd, Sandy Hook',
    jobType: 'Historic slate repair',
    amount: 18500,
    status: 'installed',
    notes: '',
    updatedAt: '1d ago',
    serviceType: 'roofing',
    leadSource: 'referral',
    contractTier: 'basic',
    contractMaterial: 'Slate',
  },
  {
    id: 'j6',
    customer: 'Vance Family',
    address: '47 Wasserman Way, Newtown',
    jobType: 'Tesla Solar + reroof',
    amount: 42000,
    status: 'invoiced',
    notes: '',
    updatedAt: '5d ago',
    serviceType: 'solar',
    leadSource: 'website',
    contractTier: 'medium',
    contractMaterial: 'Tesla Solar Roof',
  },
  {
    id: 'j7',
    customer: 'Henderson',
    address: '91 Currituck Rd, Newtown',
    jobType: 'Annual maintenance + clean',
    amount: 1200,
    status: 'paid',
    notes: '',
    updatedAt: '1w ago',
    serviceType: 'roofing',
    leadSource: 'referral',
    contractTier: 'basic',
    contractMaterial: 'Asphalt shingle',
  },
  {
    id: 'j8',
    customer: 'Aldana Family',
    address: '21 Lakeview Dr, Brookfield',
    jobType: 'Rooftop solar array',
    amount: 28500,
    status: 'lead',
    notes: '',
    updatedAt: '6h ago',
    serviceType: 'solar',
    leadSource: 'referral',
  },
  {
    id: 'j9',
    customer: 'Whitmer Auto Body',
    address: '418 Federal Rd, Danbury',
    jobType: 'Commercial solar + carport',
    amount: 96000,
    status: 'estimated',
    notes: '',
    updatedAt: '2d ago',
    serviceType: 'solar',
    leadSource: 'website',
  },
  {
    id: 'j11',
    customer: "Bertelli's Garage",
    address: '603 Federal Rd, Brookfield',
    jobType: 'Residential solar + battery',
    amount: 19500,
    status: 'drafted',
    notes: '',
    updatedAt: '8h ago',
    serviceType: 'solar',
    leadSource: 'phone',
    contractTier: 'basic',
    contractMaterial: 'Battery + storage',
  },
  {
    id: 'j12',
    customer: 'The Petrov Family',
    address: '78 Ridge Rd, Ridgefield',
    jobType: 'Whole-home interior repaint',
    amount: 11200,
    status: 'estimated',
    notes: '',
    updatedAt: '1d ago',
    serviceType: 'painting',
    leadSource: 'referral',
  },
  {
    id: 'j13',
    customer: 'Caraballo Properties',
    address: '12 Sugar Hollow Rd, Danbury',
    jobType: 'Two-story addition + kitchen remodel',
    amount: 168000,
    status: 'signed',
    notes: '',
    updatedAt: '3d ago',
    serviceType: 'construction',
    leadSource: 'phone',
    contractTier: 'complex',
    contractMaterial: 'Addition / build-out',
  },
  {
    id: 'j14',
    customer: 'Linda Reyes',
    address: '305 Mill Plain Rd, Danbury',
    jobType: 'Exterior repaint + deck stain',
    amount: 6400,
    status: 'lead',
    notes: '',
    updatedAt: '4h ago',
    serviceType: 'painting',
    leadSource: 'phone',
  },
  {
    id: 'j15',
    customer: 'Holloway Renovation',
    address: '44 South St, New Milford',
    jobType: 'Master bath gut + framing',
    amount: 38500,
    status: 'scheduled',
    notes: '',
    updatedAt: '2d ago',
    serviceType: 'construction',
    leadSource: 'website',
    contractTier: 'medium',
    contractMaterial: 'Bathroom remodel',
  },
];

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function CustomerPortal({ id }: { id: string }) {
  const [job, setJob] = useState<Job | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let found: Job | null = null;
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Job[];
        if (Array.isArray(parsed)) found = parsed.find((j) => j.id === id) ?? null;
      }
    } catch {
      // fall through
    }
    if (!found) found = FALLBACK_JOBS.find((j) => j.id === id) ?? null;
    setJob(found);
    setHydrated(true);
  }, [id]);

  if (!hydrated) {
    return (
      <main
        style={{
          background: '#0b1220',
          minHeight: '100vh',
          color: '#e2e8f0',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      />
    );
  }

  if (!job) {
    return (
      <main
        style={{
          background: '#0b1220',
          minHeight: '100vh',
          color: '#e2e8f0',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.2em', color: '#94a3b8', margin: '0 0 12px', fontWeight: 700 }}>
            TECTURAL CONSTRUCTION
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px' }}>This project link isn&apos;t active</h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}>
            The link may have expired, or the office sent the wrong one. Reach out and we will send a fresh link.
          </p>
        </div>
      </main>
    );
  }

  const currentIdx = CUSTOMER_STAGES.findIndex((s) => s.status === job.status);
  const current = CUSTOMER_STAGES[currentIdx];
  const ACCENT_BY_SERVICE: Record<ServiceType, string> = {
    roofing: '#3b82f6',
    solar: '#f59e0b',
    painting: '#7c3aed',
    construction: '#dc2626',
  };
  const SERVICE_LABEL: Record<ServiceType, string> = {
    roofing: 'Roofing work',
    solar: 'Solar install',
    painting: 'Painting project',
    construction: 'Construction project',
  };
  const accent = ACCENT_BY_SERVICE[job.serviceType];

  return (
    <main
      style={{
        background: '#0b1220',
        minHeight: '100vh',
        color: '#e2e8f0',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <header
        style={{
          background: `linear-gradient(135deg, #0b1220 0%, #111827 60%, ${accent}33 100%)`,
          padding: 'clamp(40px, 6vw, 72px) clamp(20px, 4vw, 48px) clamp(28px, 4vw, 48px)',
          borderBottom: '1px solid rgba(148,163,184,0.15)',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.22em', color: accent, margin: 0, fontWeight: 700 }}>
            TECTURAL CONSTRUCTION
          </p>
          <h1
            style={{
              fontSize: 'clamp(28px, 4.5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '10px 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            Your project at {job.address}
          </h1>
          <p style={{ fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(226,232,240,0.7)', margin: 0 }}>
            {job.jobType} · {SERVICE_LABEL[job.serviceType]}
          </p>
        </div>
      </header>

      <section style={{ maxWidth: 880, margin: '0 auto', padding: 'clamp(28px, 4vw, 44px) clamp(20px, 4vw, 48px)' }}>
        <div
          style={{
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(148,163,184,0.18)',
            borderRadius: 18,
            padding: 'clamp(20px, 3vw, 32px)',
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: '0.18em', color: accent, margin: '0 0 6px', fontWeight: 700 }}>
            CURRENT STATUS
          </p>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>
            {current?.label ?? 'In progress'}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(226,232,240,0.75)', margin: 0, lineHeight: 1.55 }}>
            {current?.hint ?? 'Your project is in progress.'}
          </p>
        </div>

        <h3 style={{ fontSize: 14, letterSpacing: '0.12em', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 16px' }}>
          Project timeline
        </h3>
        <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'grid', gap: 8 }}>
          {CUSTOMER_STAGES.map((stage, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            return (
              <li
                key={stage.status}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '12px 14px',
                  background: active ? 'rgba(59,130,246,0.08)' : 'transparent',
                  border: active ? `1px solid ${accent}55` : '1px solid transparent',
                  borderRadius: 10,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: done ? '#15803d' : active ? accent : 'rgba(148,163,184,0.18)',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {done ? '✓' : idx + 1}
                </span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: active ? '#fff' : done ? '#e2e8f0' : '#94a3b8' }}>
                    {stage.label}
                  </p>
                  {active && (
                    <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.7)', margin: '4px 0 0', lineHeight: 1.5 }}>
                      {stage.hint}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 36 }}>
          <DetailCard label="Scope" value={job.jobType} />
          <DetailCard label="Project value" value={formatMoney(job.amount)} />
          {job.contractTier && (
            <DetailCard
              label="Contract"
              value={`${job.contractTier.charAt(0).toUpperCase()}${job.contractTier.slice(1)} template${job.contractMaterial ? ` · ${job.contractMaterial}` : ''}`}
            />
          )}
        </div>

        <SectionStub
          title="Photos from the crew"
          body="As soon as the crew uploads progress photos, they will appear here. Before, during, and after."
        />
        <SectionStub
          title="Messages"
          body="Every email and text on this project, in one thread. Tap any message to see the full history."
        />
        <SectionStub
          title="Documents"
          body="Contract, change orders, invoice, and warranty. All in one place, signed copies attached."
        />

        <div
          style={{
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(148,163,184,0.18)',
            borderRadius: 14,
            padding: 22,
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.7)', margin: '0 0 4px' }}>
            Questions about your project?
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Call the office or reply to your last email. We will be right with you.</p>
        </div>
      </section>

      <footer style={{ padding: '24px 20px 40px', textAlign: 'center', color: 'rgba(148,163,184,0.6)', fontSize: 12 }}>
        Tectural Construction · Project page · Private link
      </footer>
    </main>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.55)',
        border: '1px solid rgba(148,163,184,0.18)',
        borderRadius: 14,
        padding: 16,
      }}
    >
      <p style={{ fontSize: 11, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700, textTransform: 'uppercase' }}>
        {label}
      </p>
      <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#e2e8f0', lineHeight: 1.35 }}>{value}</p>
    </div>
  );
}

function SectionStub({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.55)',
        border: '1px dashed rgba(148,163,184,0.25)',
        borderRadius: 14,
        padding: '18px 20px',
        marginBottom: 14,
      }}
    >
      <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#e2e8f0' }}>{title}</p>
      <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.65)', margin: 0, lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}
