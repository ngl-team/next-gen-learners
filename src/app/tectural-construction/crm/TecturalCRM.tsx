'use client';

import { useEffect, useMemo, useState } from 'react';

type Status = 'lead' | 'estimated' | 'signed' | 'scheduled' | 'installed' | 'invoiced' | 'paid';
type ServiceType = 'roofing' | 'solar';
type LeadSource = 'phone' | 'website' | 'referral';
type ServiceFilter = 'all' | ServiceType;

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
};

const STATUS_ORDER: Status[] = ['lead', 'estimated', 'signed', 'scheduled', 'installed', 'invoiced', 'paid'];

const STATUS_META: Record<Status, { label: string; bg: string; border: string; chip: string }> = {
  lead: { label: 'Lead', bg: '#f1f5f9', border: '#cbd5e1', chip: '#475569' },
  estimated: { label: 'Estimated', bg: '#dbeafe', border: '#93c5fd', chip: '#1d4ed8' },
  signed: { label: 'Signed', bg: '#e0e7ff', border: '#a5b4fc', chip: '#4338ca' },
  scheduled: { label: 'Scheduled', bg: '#fef3c7', border: '#fcd34d', chip: '#b45309' },
  installed: { label: 'Installed', bg: '#dcfce7', border: '#86efac', chip: '#15803d' },
  invoiced: { label: 'Invoiced', bg: '#d1fae5', border: '#6ee7b7', chip: '#047857' },
  paid: { label: 'Paid', bg: '#064e3b', border: '#10b981', chip: '#a7f3d0' },
};

const SERVICE_META: Record<ServiceType, { label: string; bg: string; fg: string; accent: string }> = {
  roofing: { label: 'Roofing', bg: '#dbeafe', fg: '#1d4ed8', accent: '#1d4ed8' },
  solar: { label: 'Solar', bg: '#fef3c7', fg: '#b45309', accent: '#f59e0b' },
};

const SOURCE_META: Record<LeadSource, { label: string }> = {
  phone: { label: 'Phone call' },
  website: { label: 'Website' },
  referral: { label: 'Referral' },
};

const SEED_JOBS: Job[] = [
  {
    id: 'j1',
    customer: 'Maria Santos',
    address: '88 Hillcrest Ave, Danbury',
    jobType: 'Metal roof repair',
    amount: 4800,
    status: 'lead',
    notes: 'Called Friday. Said she has a leak above the kitchen. Wants estimate this week.',
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
    notes: 'Sent estimate Monday. Comparing with one other contractor. Follow up Thursday.',
    updatedAt: '1d ago',
    serviceType: 'roofing',
    leadSource: 'website',
  },
  {
    id: 'j3',
    customer: 'The Bradley Estate',
    address: '27 Plumtrees Rd, Bethel',
    jobType: 'EPDM flat reroof',
    amount: 22400,
    status: 'signed',
    notes: 'Contract signed. 30% deposit received. Order materials next week.',
    updatedAt: '3d ago',
    serviceType: 'roofing',
    leadSource: 'referral',
  },
  {
    id: 'j4',
    customer: 'The Kowalskis',
    address: '156 Mt Pleasant Rd, Newtown',
    jobType: 'Copper accents + repair',
    amount: 8900,
    status: 'scheduled',
    notes: 'On the calendar for May 19. Crew of three. Two-day job.',
    updatedAt: '4d ago',
    serviceType: 'roofing',
    leadSource: 'phone',
  },
  {
    id: 'j5',
    customer: "Old St. Mary's Parish",
    address: '312 Church Hill Rd, Sandy Hook',
    jobType: 'Historic slate repair',
    amount: 18500,
    status: 'installed',
    notes: 'Finished Saturday. Father Doyle inspected. Invoice goes out Monday.',
    updatedAt: '1d ago',
    serviceType: 'roofing',
    leadSource: 'referral',
  },
  {
    id: 'j6',
    customer: 'Vance Family',
    address: '47 Wasserman Way, Newtown',
    jobType: 'Tesla Solar + reroof',
    amount: 42000,
    status: 'invoiced',
    notes: 'Invoice sent Wednesday. 50% due on receipt, balance Net 30.',
    updatedAt: '5d ago',
    serviceType: 'solar',
    leadSource: 'website',
  },
  {
    id: 'j7',
    customer: 'Henderson',
    address: '91 Currituck Rd, Newtown',
    jobType: 'Annual maintenance + clean',
    amount: 1200,
    status: 'paid',
    notes: 'Paid in full. Repeat customer. Schedule annual check-in for next May.',
    updatedAt: '1w ago',
    serviceType: 'roofing',
    leadSource: 'referral',
  },
  {
    id: 'j8',
    customer: 'Aldana Family',
    address: '21 Lakeview Dr, Brookfield',
    jobType: 'Rooftop solar array',
    amount: 28500,
    status: 'lead',
    notes: 'Referred by the Vances. Wants the same Tesla setup. Free for a walk-through Saturday.',
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
    notes: 'Owner wants to offset shop electric. Aurora design in progress. Estimate sent Tuesday.',
    updatedAt: '2d ago',
    serviceType: 'solar',
    leadSource: 'website',
  },
];

const STORAGE_KEY = 'tectural_crm_v2';

function loadJobs(): Job[] {
  if (typeof window === 'undefined') return SEED_JOBS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_JOBS;
    const parsed = JSON.parse(raw) as Job[];
    if (!Array.isArray(parsed)) return SEED_JOBS;
    return parsed;
  } catch {
    return SEED_JOBS;
  }
}

function saveJobs(jobs: Job[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch {
    // ignore quota errors
  }
}

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function newId() {
  return 'j' + Math.random().toString(36).slice(2, 9);
}

type EditState =
  | { mode: 'closed' }
  | { mode: 'edit'; job: Job }
  | { mode: 'intake' };

export default function TecturalCRM() {
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS);
  const [edit, setEdit] = useState<EditState>({ mode: 'closed' });
  const [filter, setFilter] = useState<ServiceFilter>('all');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setJobs(loadJobs());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveJobs(jobs);
  }, [jobs, hydrated]);

  const visible = useMemo(
    () => (filter === 'all' ? jobs : jobs.filter((j) => j.serviceType === filter)),
    [jobs, filter]
  );

  const totals = useMemo(() => {
    const pipeline = visible.filter((j) => j.status !== 'paid').reduce((sum, j) => sum + j.amount, 0);
    const paid = visible.filter((j) => j.status === 'paid').reduce((sum, j) => sum + j.amount, 0);
    const roofing = jobs.filter((j) => j.serviceType === 'roofing').length;
    const solar = jobs.filter((j) => j.serviceType === 'solar').length;
    return { pipeline, paid, roofing, solar };
  }, [jobs, visible]);

  const byStatus = useMemo(() => {
    const m: Record<Status, Job[]> = {
      lead: [],
      estimated: [],
      signed: [],
      scheduled: [],
      installed: [],
      invoiced: [],
      paid: [],
    };
    visible.forEach((j) => m[j.status].push(j));
    return m;
  }, [visible]);

  function moveJob(id: string, direction: -1 | 1) {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        const idx = STATUS_ORDER.indexOf(j.status);
        const nextIdx = Math.max(0, Math.min(STATUS_ORDER.length - 1, idx + direction));
        return { ...j, status: STATUS_ORDER[nextIdx], updatedAt: 'just now' };
      })
    );
  }

  function saveJob(updated: Job, isNew: boolean) {
    if (isNew) {
      setJobs((prev) => [{ ...updated, id: newId(), updatedAt: 'just now' }, ...prev]);
    } else {
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? { ...updated, updatedAt: 'just now' } : j)));
    }
    setEdit({ mode: 'closed' });
  }

  function deleteJob(id: string) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setEdit({ mode: 'closed' });
  }

  function resetSeed() {
    if (typeof window !== 'undefined' && window.confirm('Reset all jobs to the original demo set? This wipes your changes.')) {
      setJobs(SEED_JOBS);
    }
  }

  return (
    <main
      style={{
        background: '#F8FAFC',
        minHeight: '100vh',
        color: '#0f172a',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <header
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #15803d 100%)',
          color: '#fff',
          padding: 'clamp(32px, 6vw, 56px) clamp(20px, 4vw, 48px)',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: '0.2em',
                color: '#86efac',
                margin: 0,
                fontWeight: 700,
              }}
            >
              TECTURAL CRM · V1 · LIVE BUILD
            </p>
            <a
              href="/tectural-construction"
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 12px',
                borderRadius: 999,
                fontWeight: 600,
              }}
            >
              ← Back to the full map
            </a>
          </div>
          <h1
            style={{
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              fontWeight: 800,
              lineHeight: 1.1,
              margin: '12px 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            Your job pipeline, in one view.
          </h1>
          <p
            style={{
              fontSize: 'clamp(15px, 1.6vw, 17px)',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 720,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Every job, every stage, every dollar. Roofing and solar live in separate tabs.
            Take a new lead in three taps. Move cards as the job moves.
          </p>
        </div>
      </header>

      <section style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(20px, 3vw, 32px) clamp(20px, 4vw, 48px)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <StatCard label="Active pipeline" value={formatMoney(totals.pipeline)} accent="#15803d" />
          <StatCard label="Paid this view" value={formatMoney(totals.paid)} accent="#064e3b" />
          <StatCard label="Roofing jobs" value={String(totals.roofing)} accent={SERVICE_META.roofing.accent} />
          <StatCard label="Solar jobs" value={String(totals.solar)} accent={SERVICE_META.solar.accent} />
        </div>

        <ServiceTabs filter={filter} setFilter={setFilter} jobs={jobs} />

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <button
            onClick={() => setEdit({ mode: 'intake' })}
            style={{
              background: '#15803d',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 1px 3px rgba(21,128,61,0.3)',
            }}
          >
            + New Lead
          </button>
          <button
            onClick={resetSeed}
            style={{
              background: '#fff',
              color: '#475569',
              border: '1px solid #cbd5e1',
              padding: '12px 16px',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Reset to demo data
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(240px, 1fr))',
            gap: 12,
            overflowX: 'auto',
            paddingBottom: 16,
          }}
        >
          {STATUS_ORDER.map((status) => {
            const meta = STATUS_META[status];
            const items = byStatus[status];
            const colTotal = items.reduce((s, j) => s + j.amount, 0);
            return (
              <div
                key={status}
                style={{
                  background: meta.bg,
                  border: `1px solid ${meta.border}`,
                  borderRadius: 14,
                  padding: 12,
                  minHeight: 200,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <h3
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: meta.chip,
                      margin: 0,
                    }}
                  >
                    {meta.label}
                  </h3>
                  <span style={{ fontSize: 11, color: meta.chip, fontWeight: 700 }}>
                    {items.length} · {formatMoney(colTotal)}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={() => setEdit({ mode: 'edit', job })}
                      onMoveLeft={() => moveJob(job.id, -1)}
                      onMoveRight={() => moveJob(job.id, 1)}
                      canMoveLeft={STATUS_ORDER.indexOf(job.status) > 0}
                      canMoveRight={STATUS_ORDER.indexOf(job.status) < STATUS_ORDER.length - 1}
                    />
                  ))}
                  {items.length === 0 && (
                    <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '20px 0', margin: 0 }}>
                      Empty
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        style={{
          background: '#0f172a',
          color: '#fff',
          padding: 'clamp(32px, 6vw, 64px) clamp(20px, 4vw, 48px)',
          marginTop: 24,
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#86efac', margin: '0 0 12px', fontWeight: 700 }}>
            WHAT IS NEXT
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.2 }}>
            This is V1. Here is what V2 adds.
          </h2>
          <ul style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0, paddingLeft: 20 }}>
            <li>Auto-sync across your laptop, phone, and the office tablet</li>
            <li>New leads from your website form land here as a card automatically</li>
            <li>Auto-generated contracts by job tier (basic, medium, complex) the moment you move a card to Signed</li>
            <li>Mark Installed and the invoice fires to the customer without you typing it</li>
            <li>QuickBooks sync, so paid jobs close themselves</li>
            <li>Job photos and crew checklists attached to each card</li>
          </ul>
        </div>
      </section>

      <footer
        style={{
          background: '#F8FAFC',
          padding: 'clamp(24px, 4vw, 40px) clamp(20px, 4vw, 48px)',
          textAlign: 'center',
          borderTop: '1px solid rgba(15,23,42,0.08)',
        }}
      >
        <p style={{ fontSize: 13, color: '#475569', margin: '0 0 6px' }}>
          V1 saves to this browser. Full version syncs across all your devices.
        </p>
        <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
          <a
            href="mailto:brayan@nextgenerationlearners.com"
            style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}
          >
            brayan@nextgenerationlearners.com
          </a>
        </p>
      </footer>

      {edit.mode === 'edit' && (
        <EditModal
          job={edit.job}
          onSave={saveJob}
          onDelete={deleteJob}
          onClose={() => setEdit({ mode: 'closed' })}
        />
      )}
      {edit.mode === 'intake' && (
        <IntakeWizard
          onSave={(job) => saveJob(job, true)}
          onClose={() => setEdit({ mode: 'closed' })}
        />
      )}
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(15,23,42,0.08)',
        borderRadius: 14,
        padding: 18,
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <p style={{ fontSize: 11, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700, textTransform: 'uppercase' }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.01em' }}>{value}</p>
    </div>
  );
}

function ServiceTabs({
  filter,
  setFilter,
  jobs,
}: {
  filter: ServiceFilter;
  setFilter: (f: ServiceFilter) => void;
  jobs: Job[];
}) {
  const tabs: { key: ServiceFilter; label: string; count: number; accent: string }[] = [
    { key: 'all', label: 'All jobs', count: jobs.length, accent: '#0f172a' },
    { key: 'roofing', label: 'Roofing', count: jobs.filter((j) => j.serviceType === 'roofing').length, accent: SERVICE_META.roofing.accent },
    { key: 'solar', label: 'Solar', count: jobs.filter((j) => j.serviceType === 'solar').length, accent: SERVICE_META.solar.accent },
  ];
  return (
    <div
      style={{
        display: 'inline-flex',
        background: '#fff',
        border: '1px solid rgba(15,23,42,0.08)',
        borderRadius: 999,
        padding: 4,
        marginBottom: 20,
        boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
      }}
    >
      {tabs.map((tab) => {
        const active = filter === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              background: active ? tab.accent : 'transparent',
              color: active ? '#fff' : '#475569',
              border: 'none',
              padding: '10px 18px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 120ms ease',
            }}
          >
            {tab.label}
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                fontWeight: 700,
                opacity: 0.85,
              }}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function JobCard({
  job,
  onClick,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
}: {
  job: Job;
  onClick: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}) {
  const service = SERVICE_META[job.serviceType];
  const source = SOURCE_META[job.leadSource];
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 10,
        padding: 12,
        boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
        border: '1px solid rgba(15,23,42,0.06)',
        borderLeft: `3px solid ${service.accent}`,
      }}
    >
      <button
        onClick={onClick}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
            {job.customer}
          </p>
          <span
            style={{
              background: service.bg,
              color: service.fg,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '2px 6px',
              borderRadius: 999,
              flexShrink: 0,
            }}
          >
            {service.label}
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px', lineHeight: 1.3 }}>{job.address}</p>
        <p style={{ fontSize: 12, color: '#475569', margin: '0 0 8px', lineHeight: 1.3 }}>{job.jobType}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#15803d' }}>{formatMoney(job.amount)}</span>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>{source.label} · {job.updatedAt}</span>
        </div>
      </button>
      <div style={{ display: 'flex', gap: 6, borderTop: '1px solid rgba(15,23,42,0.06)', paddingTop: 8 }}>
        <button
          onClick={onMoveLeft}
          disabled={!canMoveLeft}
          style={{
            flex: 1,
            background: canMoveLeft ? '#f1f5f9' : '#f8fafc',
            border: 'none',
            padding: '6px 0',
            borderRadius: 6,
            fontSize: 13,
            cursor: canMoveLeft ? 'pointer' : 'not-allowed',
            color: canMoveLeft ? '#475569' : '#cbd5e1',
            fontWeight: 700,
            fontFamily: 'inherit',
          }}
        >
          ←
        </button>
        <button
          onClick={onMoveRight}
          disabled={!canMoveRight}
          style={{
            flex: 1,
            background: canMoveRight ? '#dcfce7' : '#f8fafc',
            border: 'none',
            padding: '6px 0',
            borderRadius: 6,
            fontSize: 13,
            cursor: canMoveRight ? 'pointer' : 'not-allowed',
            color: canMoveRight ? '#15803d' : '#cbd5e1',
            fontWeight: 700,
            fontFamily: 'inherit',
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}

function IntakeWizard({
  onSave,
  onClose,
}: {
  onSave: (j: Job) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [leadSource, setLeadSource] = useState<LeadSource | null>(null);
  const [customer, setCustomer] = useState('');
  const [address, setAddress] = useState('');
  const [jobType, setJobType] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  function pickSource(s: LeadSource) {
    setLeadSource(s);
    setStep(2);
  }

  function continueToService() {
    if (!customer.trim()) {
      window.alert('Customer name is required');
      return;
    }
    setStep(3);
  }

  function finish(service: ServiceType) {
    if (!leadSource) return;
    onSave({
      id: '',
      customer: customer.trim(),
      address: address.trim(),
      jobType: jobType.trim() || (service === 'roofing' ? 'Roofing - to scope' : 'Solar - to scope'),
      amount: Number(amount) || 0,
      status: 'lead',
      notes: notes.trim(),
      updatedAt: 'just now',
      serviceType: service,
      leadSource,
    });
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.55)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 20,
        zIndex: 50,
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 560,
          padding: 28,
          marginTop: '5vh',
          boxShadow: '0 20px 60px rgba(15,23,42,0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.18em', color: '#15803d', margin: 0, fontWeight: 700 }}>
            NEW LEAD · STEP {step} OF 3
          </p>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#94a3b8',
              padding: 4,
              lineHeight: 1,
              fontFamily: 'inherit',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                height: 4,
                flex: 1,
                borderRadius: 999,
                background: n <= step ? '#15803d' : '#e2e8f0',
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#0f172a', lineHeight: 1.2 }}>
              Where did this lead come from?
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>
              Pick the source. The rest of the intake adapts to it.
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              <SourceButton
                label="Phone call"
                hint="They called you. You are writing it down right now."
                onClick={() => pickSource('phone')}
              />
              <SourceButton
                label="Website"
                hint="They filled out the contact form or estimator."
                onClick={() => pickSource('website')}
              />
              <SourceButton
                label="Referral"
                hint="Someone you know sent them your way."
                onClick={() => pickSource('referral')}
              />
            </div>
          </>
        )}

        {step === 2 && leadSource && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#0f172a', lineHeight: 1.2 }}>
              Who is it and what do they need?
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>
              Source: <strong style={{ color: '#0f172a' }}>{SOURCE_META[leadSource].label}</strong>. Capture what they told you. You can fill in the rest later.
            </p>
            <Field label="Customer name">
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. Maria Santos"
                style={inputStyle}
                autoFocus
              />
            </Field>
            <Field label="Address">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 88 Hillcrest Ave, Danbury"
                style={inputStyle}
              />
            </Field>
            <Field label="What they need (short)">
              <input
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                placeholder="e.g. Leak above kitchen, wants estimate"
                style={inputStyle}
              />
            </Field>
            <Field label="Rough ballpark (USD, optional)">
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Leave blank if you do not know yet"
                style={inputStyle}
              />
            </Field>
            <Field label="Anything else worth remembering">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What they said, deadlines, who referred them, when to follow up"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 20 }}>
              <button onClick={() => setStep(1)} style={ghostBtn}>
                ← Back
              </button>
              <button onClick={continueToService} style={primaryBtn}>
                Next: pick service type →
              </button>
            </div>
          </>
        )}

        {step === 3 && leadSource && (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#0f172a', lineHeight: 1.2 }}>
              Roofing or solar?
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>
              This routes the job into the right pipeline. Each side has its own contract template and crew flow.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <ServiceButton
                serviceType="roofing"
                title="Roofing"
                hint="Reroof, repair, slate, metal, EPDM."
                onClick={() => finish('roofing')}
              />
              <ServiceButton
                serviceType="solar"
                title="Solar"
                hint="Panels, batteries, Tesla, carport, commercial."
                onClick={() => finish('solar')}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 20 }}>
              <button onClick={() => setStep(2)} style={ghostBtn}>
                ← Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SourceButton({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #cbd5e1',
        borderRadius: 12,
        padding: '16px 18px',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'border-color 120ms ease, background 120ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#15803d';
        e.currentTarget.style.background = '#f0fdf4';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#cbd5e1';
        e.currentTarget.style.background = '#fff';
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{hint}</p>
    </button>
  );
}

function ServiceButton({
  serviceType,
  title,
  hint,
  onClick,
}: {
  serviceType: ServiceType;
  title: string;
  hint: string;
  onClick: () => void;
}) {
  const meta = SERVICE_META[serviceType];
  return (
    <button
      onClick={onClick}
      style={{
        background: '#fff',
        border: `2px solid ${meta.accent}`,
        borderRadius: 14,
        padding: '20px 18px',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 120ms ease, transform 120ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = meta.bg;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#fff';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <p style={{ fontSize: 11, letterSpacing: '0.12em', color: meta.fg, margin: '0 0 4px', fontWeight: 800, textTransform: 'uppercase' }}>
        {meta.label} pipeline
      </p>
      <p style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>{title}</p>
      <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.4 }}>{hint}</p>
    </button>
  );
}

function EditModal({
  job,
  onSave,
  onDelete,
  onClose,
}: {
  job: Job;
  onSave: (j: Job, isNew: boolean) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [customer, setCustomer] = useState(job.customer);
  const [address, setAddress] = useState(job.address);
  const [jobType, setJobType] = useState(job.jobType);
  const [amount, setAmount] = useState<number>(job.amount);
  const [status, setStatus] = useState<Status>(job.status);
  const [notes, setNotes] = useState(job.notes);
  const [serviceType, setServiceType] = useState<ServiceType>(job.serviceType);
  const [leadSource, setLeadSource] = useState<LeadSource>(job.leadSource);

  function handleSave() {
    if (!customer.trim()) {
      window.alert('Customer name is required');
      return;
    }
    onSave(
      {
        id: job.id,
        customer: customer.trim(),
        address: address.trim(),
        jobType: jobType.trim(),
        amount: Number(amount) || 0,
        status,
        notes: notes.trim(),
        updatedAt: job.updatedAt,
        serviceType,
        leadSource,
      },
      false
    );
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.55)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 20,
        zIndex: 50,
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 520,
          padding: 28,
          marginTop: '5vh',
          boxShadow: '0 20px 60px rgba(15,23,42,0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>Edit job</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#94a3b8',
              padding: 4,
              lineHeight: 1,
              fontFamily: 'inherit',
            }}
          >
            ×
          </button>
        </div>

        <Field label="Customer">
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="e.g. Robert Chen"
            style={inputStyle}
          />
        </Field>
        <Field label="Address">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 142 Oak Ridge Rd, Newtown"
            style={inputStyle}
          />
        </Field>
        <Field label="Job type">
          <input
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            placeholder="e.g. Asphalt reroof"
            style={inputStyle}
          />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Service">
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as ServiceType)}
              style={{ ...inputStyle, background: '#fff' }}
            >
              <option value="roofing">Roofing</option>
              <option value="solar">Solar</option>
            </select>
          </Field>
          <Field label="Lead source">
            <select
              value={leadSource}
              onChange={(e) => setLeadSource(e.target.value as LeadSource)}
              style={{ ...inputStyle, background: '#fff' }}
            >
              <option value="phone">Phone call</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
            </select>
          </Field>
        </div>
        <Field label="Amount (USD)">
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="14200"
            style={inputStyle}
          />
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            style={{ ...inputStyle, background: '#fff' }}
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Notes">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Where the job stands, what is next, anything to remember"
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </Field>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
          <button
            onClick={() => {
              if (window.confirm('Delete this job? This cannot be undone.')) onDelete(job.id);
            }}
            style={{
              background: '#fff',
              color: '#dc2626',
              border: '1px solid #fecaca',
              padding: '10px 16px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Delete
          </button>
          <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
            <button onClick={onClose} style={ghostBtn}>
              Cancel
            </button>
            <button onClick={handleSave} style={primaryBtn}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: 15,
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

const primaryBtn: React.CSSProperties = {
  background: '#15803d',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const ghostBtn: React.CSSProperties = {
  background: '#fff',
  color: '#475569',
  border: '1px solid #cbd5e1',
  padding: '10px 18px',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
