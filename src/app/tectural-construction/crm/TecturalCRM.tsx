'use client';

import { useEffect, useMemo, useState } from 'react';

type Status =
  | 'lead'
  | 'estimated'
  | 'drafted'
  | 'signed'
  | 'scheduled'
  | 'installed'
  | 'invoiced'
  | 'paid';

type ServiceType = 'roofing' | 'solar';
type LeadSource = 'phone' | 'website' | 'referral';
type ServiceFilter = 'all' | ServiceType;
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

const STATUS_ORDER: Status[] = [
  'lead',
  'estimated',
  'drafted',
  'signed',
  'scheduled',
  'installed',
  'invoiced',
  'paid',
];

const STATUS_META: Record<Status, { label: string; bg: string; border: string; chip: string }> = {
  lead: { label: 'Lead', bg: '#f1f5f9', border: '#cbd5e1', chip: '#475569' },
  estimated: { label: 'Estimated', bg: '#dbeafe', border: '#93c5fd', chip: '#1d4ed8' },
  drafted: { label: 'Contract Drafted', bg: '#fce7f3', border: '#f9a8d4', chip: '#be185d' },
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

const TIER_META: Record<ContractTier, { label: string; range: string; pages: string; bg: string; fg: string }> = {
  basic: { label: 'Basic', range: '$5K - $20K', pages: '2 pages', bg: '#dcfce7', fg: '#15803d' },
  medium: { label: 'Medium', range: '$20K - $100K', pages: '4-6 pages', bg: '#fef3c7', fg: '#b45309' },
  complex: { label: 'Complex', range: '$100K+', pages: '8-10 pages', bg: '#fce7f3', fg: '#be185d' },
};

const ROOFING_MATERIALS = ['Asphalt shingle', 'Architectural shingle', 'Metal standing seam', 'EPDM rubber', 'TPO membrane', 'Slate', 'Cedar shake'];
const SOLAR_MATERIALS = ['Panel array (residential)', 'Tesla Solar Roof', 'Battery + storage', 'Commercial solar array', 'Solar carport'];

function materialsForService(service: ServiceType): string[] {
  return service === 'roofing' ? ROOFING_MATERIALS : SOLAR_MATERIALS;
}

function suggestTier(amount: number): ContractTier {
  if (amount >= 100000) return 'complex';
  if (amount >= 20000) return 'medium';
  return 'basic';
}

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
    id: 'j10',
    customer: 'Aronson Estate',
    address: '14 Ridgewood Pl, Ridgefield',
    jobType: 'Full reroof + chimney rebuild',
    amount: 58000,
    status: 'drafted',
    notes: 'Contract drafted Tuesday. Sent to attorney for review. Tier is Medium because of estate liability rider.',
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
    notes: 'Contract signed. 30% deposit received. Order materials next week.',
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
    notes: 'On the calendar for May 19. Crew of three. Two-day job.',
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
    notes: 'Finished Saturday. Father Doyle inspected. Invoice goes out Monday.',
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
    notes: 'Invoice sent Wednesday. 50% due on receipt, balance Net 30.',
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
    notes: 'Paid in full. Repeat customer. Schedule annual check-in for next May.',
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
  {
    id: 'j11',
    customer: "Bertelli's Garage",
    address: '603 Federal Rd, Brookfield',
    jobType: 'Residential solar + battery',
    amount: 19500,
    status: 'drafted',
    notes: 'Basic contract drafted. Battery rider added for the Powerwall. Awaiting signature.',
    updatedAt: '8h ago',
    serviceType: 'solar',
    leadSource: 'phone',
    contractTier: 'basic',
    contractMaterial: 'Battery + storage',
  },
];

const STORAGE_KEY = 'tectural_crm_v3';

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
  | { mode: 'intake' }
  | { mode: 'share'; job: Job }
  | { mode: 'proposal'; job: Job };

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
      drafted: [],
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
            <p style={{ fontSize: 11, letterSpacing: '0.2em', color: '#86efac', margin: 0, fontWeight: 700 }}>
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
            Every job, every stage, every dollar. Roofing and solar in separate tabs.
            Contracts drafted by tier. Customers get a private link to their own project page.
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
            gridTemplateColumns: `repeat(${STATUS_ORDER.length}, minmax(220px, 1fr))`,
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
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '0.06em',
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
                      onShare={() => setEdit({ mode: 'share', job })}
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
            <li>The Generate Proposal tool emits a real PDF tied to state and federal terms by tier</li>
            <li>Contract auto-fills with customer signature line, ready to send through the email assistant</li>
            <li>Mark Installed and the invoice fires to the customer without you typing it</li>
            <li>QuickBooks sync, so paid jobs close themselves</li>
            <li>Customer portal lives at tecturalconstruction.com slash address, with photos and message history</li>
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
          onOpenProposal={(j) => setEdit({ mode: 'proposal', job: j })}
        />
      )}
      {edit.mode === 'intake' && (
        <IntakeWizard
          onSave={(job) => saveJob(job, true)}
          onClose={() => setEdit({ mode: 'closed' })}
        />
      )}
      {edit.mode === 'share' && (
        <ShareModal job={edit.job} onClose={() => setEdit({ mode: 'closed' })} />
      )}
      {edit.mode === 'proposal' && (
        <ProposalModal
          job={edit.job}
          onClose={() => setEdit({ mode: 'closed' })}
          onApply={(tier, material, notesAppend) => {
            setJobs((prev) =>
              prev.map((j) =>
                j.id === edit.job.id
                  ? {
                      ...j,
                      contractTier: tier,
                      contractMaterial: material,
                      notes: j.notes ? `${j.notes}\n\n${notesAppend}` : notesAppend,
                      status: j.status === 'lead' ? 'estimated' : j.status,
                      updatedAt: 'just now',
                    }
                  : j
              )
            );
            setEdit({ mode: 'closed' });
          }}
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
            <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, opacity: 0.85 }}>
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
  onShare,
  canMoveLeft,
  canMoveRight,
}: {
  job: Job;
  onClick: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onShare: () => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}) {
  const service = SERVICE_META[job.serviceType];
  const source = SOURCE_META[job.leadSource];
  const tier = job.contractTier ? TIER_META[job.contractTier] : null;
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
        style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', marginBottom: 8 }}
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
        {tier && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span
              style={{
                background: tier.bg,
                color: tier.fg,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '2px 6px',
                borderRadius: 999,
              }}
            >
              {tier.label} contract
            </span>
            {job.contractMaterial && (
              <span style={{ fontSize: 11, color: '#64748b' }}>{job.contractMaterial}</span>
            )}
          </div>
        )}
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
          onClick={onShare}
          style={{
            flex: 1.2,
            background: '#eef2ff',
            border: 'none',
            padding: '6px 0',
            borderRadius: 6,
            fontSize: 11,
            cursor: 'pointer',
            color: '#4338ca',
            fontWeight: 800,
            fontFamily: 'inherit',
            letterSpacing: '0.04em',
          }}
        >
          SHARE
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
    <Backdrop onClose={onClose}>
      <ModalShell maxWidth={560}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.18em', color: '#15803d', margin: 0, fontWeight: 700 }}>
            NEW LEAD · STEP {step} OF 3
          </p>
          <CloseX onClick={onClose} />
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
            <h2 style={titleStyle}>Where did this lead come from?</h2>
            <p style={subTextStyle}>Pick the source. The rest of the intake adapts to it.</p>
            <div style={{ display: 'grid', gap: 10 }}>
              <SourceButton label="Phone call" hint="They called you. You are writing it down right now." onClick={() => pickSource('phone')} />
              <SourceButton label="Website" hint="They filled out the contact form or estimator." onClick={() => pickSource('website')} />
              <SourceButton label="Referral" hint="Someone you know sent them your way." onClick={() => pickSource('referral')} />
            </div>
          </>
        )}

        {step === 2 && leadSource && (
          <>
            <h2 style={titleStyle}>Who is it and what do they need?</h2>
            <p style={subTextStyle}>
              Source: <strong style={{ color: '#0f172a' }}>{SOURCE_META[leadSource].label}</strong>. Capture what they told you. You can fill in the rest later.
            </p>
            <Field label="Customer name">
              <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. Maria Santos" style={inputStyle} autoFocus />
            </Field>
            <Field label="Address">
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 88 Hillcrest Ave, Danbury" style={inputStyle} />
            </Field>
            <Field label="What they need (short)">
              <input value={jobType} onChange={(e) => setJobType(e.target.value)} placeholder="e.g. Leak above kitchen, wants estimate" style={inputStyle} />
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
              <button onClick={() => setStep(1)} style={ghostBtn}>← Back</button>
              <button onClick={continueToService} style={primaryBtn}>Next: pick service type →</button>
            </div>
          </>
        )}

        {step === 3 && leadSource && (
          <>
            <h2 style={titleStyle}>Roofing or solar?</h2>
            <p style={subTextStyle}>This routes the job into the right pipeline. Each side has its own contract templates and crew flow.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <ServiceButton serviceType="roofing" title="Roofing" hint="Reroof, repair, slate, metal, EPDM." onClick={() => finish('roofing')} />
              <ServiceButton serviceType="solar" title="Solar" hint="Panels, batteries, Tesla, carport, commercial." onClick={() => finish('solar')} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 20 }}>
              <button onClick={() => setStep(2)} style={ghostBtn}>← Back</button>
            </div>
          </>
        )}
      </ModalShell>
    </Backdrop>
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
  onOpenProposal,
}: {
  job: Job;
  onSave: (j: Job, isNew: boolean) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onOpenProposal: (j: Job) => void;
}) {
  const [customer, setCustomer] = useState(job.customer);
  const [address, setAddress] = useState(job.address);
  const [jobType, setJobType] = useState(job.jobType);
  const [amount, setAmount] = useState<number>(job.amount);
  const [status, setStatus] = useState<Status>(job.status);
  const [notes, setNotes] = useState(job.notes);
  const [serviceType, setServiceType] = useState<ServiceType>(job.serviceType);
  const [leadSource, setLeadSource] = useState<LeadSource>(job.leadSource);
  const [contractTier, setContractTier] = useState<ContractTier | ''>(job.contractTier ?? '');
  const [contractMaterial, setContractMaterial] = useState<string>(job.contractMaterial ?? '');

  const materials = materialsForService(serviceType);

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
        contractTier: contractTier || undefined,
        contractMaterial: contractMaterial || undefined,
      },
      false
    );
  }

  return (
    <Backdrop onClose={onClose}>
      <ModalShell maxWidth={560}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>Edit job</h2>
          <CloseX onClick={onClose} />
        </div>

        <Field label="Customer">
          <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. Robert Chen" style={inputStyle} />
        </Field>
        <Field label="Address">
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 142 Oak Ridge Rd, Newtown" style={inputStyle} />
        </Field>
        <Field label="Job type">
          <input value={jobType} onChange={(e) => setJobType(e.target.value)} placeholder="e.g. Asphalt reroof" style={inputStyle} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Service">
            <select
              value={serviceType}
              onChange={(e) => {
                const next = e.target.value as ServiceType;
                setServiceType(next);
                if (contractMaterial && !materialsForService(next).includes(contractMaterial)) {
                  setContractMaterial('');
                }
              }}
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
            onChange={(e) => {
              const n = Number(e.target.value);
              setAmount(n);
              if (!contractTier) setContractTier(suggestTier(n));
            }}
            placeholder="14200"
            style={inputStyle}
          />
        </Field>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', color: '#475569', margin: 0, textTransform: 'uppercase' }}>
              Contract
            </p>
            <button
              onClick={() => onOpenProposal({
                ...job,
                customer, address, jobType, amount: Number(amount) || 0, status, notes, serviceType, leadSource,
                contractTier: contractTier || undefined, contractMaterial: contractMaterial || undefined,
              })}
              style={{
                background: '#0f172a',
                color: '#fff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.04em',
              }}
            >
              GENERATE PROPOSAL
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Contract tier">
              <select
                value={contractTier}
                onChange={(e) => setContractTier(e.target.value as ContractTier | '')}
                style={{ ...inputStyle, background: '#fff' }}
              >
                <option value="">Pick tier</option>
                <option value="basic">Basic ($5K - $20K)</option>
                <option value="medium">Medium ($20K - $100K)</option>
                <option value="complex">Complex ($100K+)</option>
              </select>
            </Field>
            <Field label="Material / template">
              <select
                value={contractMaterial}
                onChange={(e) => setContractMaterial(e.target.value)}
                style={{ ...inputStyle, background: '#fff' }}
              >
                <option value="">Pick material</option>
                {materials.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

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
            <button onClick={onClose} style={ghostBtn}>Cancel</button>
            <button onClick={handleSave} style={primaryBtn}>Save</button>
          </div>
        </div>
      </ModalShell>
    </Backdrop>
  );
}

function ShareModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('https://www.nextgenerationlearners.com');

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin);
  }, []);

  const url = `${origin}/tectural-construction/customer/${job.id}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this link', url);
    }
  }

  return (
    <Backdrop onClose={onClose}>
      <ModalShell maxWidth={520}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.18em', color: '#4338ca', margin: 0, fontWeight: 700 }}>
            CUSTOMER LINK
          </p>
          <CloseX onClick={onClose} />
        </div>
        <h2 style={titleStyle}>Send {job.customer} their own project page</h2>
        <p style={subTextStyle}>
          One link, scoped to this job. Customer sees the timeline, contract status, photos, and messages from the install. Nothing else.
        </p>

        <div
          style={{
            background: '#0f172a',
            color: '#a5b4fc',
            padding: 14,
            borderRadius: 10,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13,
            wordBreak: 'break-all',
            marginBottom: 14,
          }}
        >
          {url}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={copy} style={{ ...primaryBtn, background: copied ? '#15803d' : '#4338ca' }}>
            {copied ? 'Copied ✓' : 'Copy link'}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{ ...ghostBtn, display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}
          >
            Preview as customer →
          </a>
        </div>

        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16, lineHeight: 1.5 }}>
          V1 reads from this browser. V2 will sync the customer view to the cloud so any device that opens the link sees live status.
        </p>
      </ModalShell>
    </Backdrop>
  );
}

function ProposalModal({
  job,
  onClose,
  onApply,
}: {
  job: Job;
  onClose: () => void;
  onApply: (tier: ContractTier, material: string, notesAppend: string) => void;
}) {
  const isRoofing = job.serviceType === 'roofing';
  const [pitch, setPitch] = useState('6/12');
  const [layers, setLayers] = useState('1');
  const [material, setMaterial] = useState<string>(job.contractMaterial ?? (isRoofing ? 'Architectural shingle' : 'Panel array (residential)'));
  const [squares, setSquares] = useState<string>(isRoofing ? '24' : '');
  const [panels, setPanels] = useState<string>(!isRoofing ? '18' : '');
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const tier = useMemo<ContractTier>(() => suggestTier(job.amount || 0), [job.amount]);

  function run() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 900);
  }

  function apply() {
    const summary = isRoofing
      ? `Proposal generated: ${material}, ${pitch} pitch, ${layers} layer, ${squares || '?'} squares. Tier ${TIER_META[tier].label}.`
      : `Proposal generated: ${material}, ${panels || '?'} panels. Tier ${TIER_META[tier].label}.`;
    onApply(tier, material, summary);
  }

  return (
    <Backdrop onClose={onClose}>
      <ModalShell maxWidth={620}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.18em', color: '#0f172a', margin: 0, fontWeight: 700 }}>
            GENERATE PROPOSAL · {job.serviceType.toUpperCase()}
          </p>
          <CloseX onClick={onClose} />
        </div>
        <h2 style={titleStyle}>{job.customer}</h2>
        <p style={subTextStyle}>
          Drop in the key inputs. Jarvis picks the right contract tier from the dollar amount, pulls the matching template, and pre-fills the breakdown.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
          <Field label="Material">
            <select value={material} onChange={(e) => setMaterial(e.target.value)} style={{ ...inputStyle, background: '#fff' }}>
              {materialsForService(job.serviceType).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>
          {isRoofing ? (
            <Field label="Pitch">
              <input value={pitch} onChange={(e) => setPitch(e.target.value)} placeholder="e.g. 6/12" style={inputStyle} />
            </Field>
          ) : (
            <Field label="Panel count">
              <input value={panels} onChange={(e) => setPanels(e.target.value)} placeholder="e.g. 18" style={inputStyle} />
            </Field>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
          {isRoofing ? (
            <>
              <Field label="Existing layers">
                <input value={layers} onChange={(e) => setLayers(e.target.value)} placeholder="1 or 2" style={inputStyle} />
              </Field>
              <Field label="Roof squares (approx)">
                <input value={squares} onChange={(e) => setSquares(e.target.value)} placeholder="e.g. 24" style={inputStyle} />
              </Field>
            </>
          ) : (
            <Field label="Including battery">
              <select style={{ ...inputStyle, background: '#fff' }} defaultValue="no">
                <option value="no">No</option>
                <option value="yes">Yes, Powerwall</option>
              </select>
            </Field>
          )}
        </div>

        <div
          style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 12,
            padding: 16,
            marginTop: 8,
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700, textTransform: 'uppercase' }}>
            Suggested tier from job amount
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 20, fontWeight: 800, margin: 0, color: TIER_META[tier].fg }}>
              {TIER_META[tier].label} contract
            </p>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              {TIER_META[tier].pages} · covers {TIER_META[tier].range}
            </p>
          </div>
        </div>

        {!generated && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 22 }}>
            <button onClick={onClose} style={ghostBtn}>Cancel</button>
            <button onClick={run} disabled={generating} style={{ ...primaryBtn, background: generating ? '#94a3b8' : '#0f172a' }}>
              {generating ? 'Generating...' : 'Generate proposal →'}
            </button>
          </div>
        )}

        {generated && (
          <>
            <div
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 18,
                marginTop: 16,
                boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
              }}
            >
              <p style={{ fontSize: 11, letterSpacing: '0.12em', color: '#15803d', margin: '0 0 8px', fontWeight: 700, textTransform: 'uppercase' }}>
                Proposal preview · Tectural Construction
              </p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{job.customer}</p>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 14px' }}>{job.address}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14, color: '#0f172a' }}>
                {isRoofing ? (
                  <>
                    <ProposalLine label={`${material}, ${squares || '?'} squares`} value={formatMoney(Math.round((job.amount || 0) * 0.62))} />
                    <ProposalLine label={`Tear-off (${layers} layer)`} value={formatMoney(Math.round((job.amount || 0) * 0.12))} />
                    <ProposalLine label="Underlayment + flashing" value={formatMoney(Math.round((job.amount || 0) * 0.08))} />
                    <ProposalLine label="Labor + crew" value={formatMoney(Math.round((job.amount || 0) * 0.16))} />
                    <ProposalLine label="Disposal + permits" value={formatMoney(Math.round((job.amount || 0) * 0.02))} />
                  </>
                ) : (
                  <>
                    <ProposalLine label={`${material}, ${panels || '?'} panels`} value={formatMoney(Math.round((job.amount || 0) * 0.55))} />
                    <ProposalLine label="Inverter + monitoring" value={formatMoney(Math.round((job.amount || 0) * 0.15))} />
                    <ProposalLine label="Mounting + racking" value={formatMoney(Math.round((job.amount || 0) * 0.08))} />
                    <ProposalLine label="Labor + crew" value={formatMoney(Math.round((job.amount || 0) * 0.18))} />
                    <ProposalLine label="Permits + interconnection" value={formatMoney(Math.round((job.amount || 0) * 0.04))} />
                  </>
                )}
              </ul>
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 15, color: '#0f172a' }}>Total</strong>
                <strong style={{ fontSize: 15, color: '#15803d' }}>{formatMoney(job.amount || 0)}</strong>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', margin: '14px 0 0', lineHeight: 1.5 }}>
                {TIER_META[tier].label} contract template attached. State and federal terms baked in. Customer signature line ready.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 22 }}>
              <button onClick={() => setGenerated(false)} style={ghostBtn}>Adjust inputs</button>
              <button onClick={apply} style={primaryBtn}>Attach to job + advance to Estimated</button>
            </div>
          </>
        )}
      </ModalShell>
    </Backdrop>
  );
}

function ProposalLine({ label, value }: { label: string; value: string }) {
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #e2e8f0' }}>
      <span style={{ color: '#475569' }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </li>
  );
}

function Backdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
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
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

function ModalShell({ children, maxWidth = 520 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth,
        padding: 28,
        marginTop: '5vh',
        boxShadow: '0 20px 60px rgba(15,23,42,0.3)',
      }}
    >
      {children}
    </div>
  );
}

function CloseX({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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

const titleStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  margin: '0 0 8px',
  color: '#0f172a',
  lineHeight: 1.2,
};

const subTextStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#64748b',
  margin: '0 0 20px',
  lineHeight: 1.5,
};
