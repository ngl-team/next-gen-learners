import Mermaid from './Mermaid';

const MASTER_MMD = `flowchart TD
  subgraph LEADS["WHERE LEADS COME FROM"]
    direction LR
    L1["Phone call"]
    L2["Email inquiry"]
    L3["Website visitor"]
    L4["Referral"]
  end
  L3 --> SITE
  SITE --> EST
  L2 --> EMAIL
  subgraph TOOLS["YOUR FOUR TOOLS"]
    direction TB
    SITE["Custom Site<br/>Sprint 4"]
    EST["AI Estimator widget<br/>Sprint 3<br/>(replaces Instant Roofer)"]
    EMAIL["Email Assistant<br/>Sprint 2"]
    CRM["CRM Job Pipeline<br/>SPRINT 1 - START HERE"]
  end
  EST --> EMAIL
  EST --> CRM
  EMAIL --> CRM
  L1 --> CRM
  L4 --> CRM
  CRM --> OWN
  CRM --> KILL
  CRM --> INV
  CRM --> TIME
  EMAIL --> TIME
  subgraph OUT["WHAT YOU GET"]
    direction LR
    OWN["You own<br/>every tool"]
    KILL["Subscriptions<br/>retired"]
    INV["Auto-invoice<br/>on completion"]
    TIME["Hours back<br/>every week"]
  end
  classDef lead fill:#e0e7ff,stroke:#3730a3,color:#000
  classDef tool fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef spine fill:#22c55e,stroke:#15803d,color:#fff
  classDef outcome fill:#fef3c7,stroke:#92400e,color:#000
  class L1,L2,L3,L4 lead
  class SITE,EST,EMAIL tool
  class CRM spine
  class OWN,KILL,INV,TIME outcome`;

const EMAIL_MMD = `flowchart LR
  A["New email arrives"] --> B["Jarvis on laptop"]
  B --> C["Reads voice profile<br/>+ past replies"]
  C --> D["Drafts reply<br/>in your voice"]
  D --> E["He edits 10 sec<br/>and sends"]
  B --> F["Triage:<br/>lead / vendor / customer / crew"]
  F --> G["Routes to<br/>right folder"]
  classDef in fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef ai fill:#22c55e,stroke:#15803d,color:#fff
  classDef out fill:#fef3c7,stroke:#92400e,color:#000
  class A,F in
  class B,C,D ai
  class E,G out`;

const ESTIMATOR_MMD = `flowchart LR
  A["Visitor on your site<br/>enters their address"] --> B["Aerial measurement API"]
  B --> C["Roof area + pitch"]
  D["Your pricing rules"] --> E
  C --> E["Instant estimate<br/>shown on screen"]
  E --> F["Visitor leaves<br/>contact info"]
  F --> G["Lead lands in<br/>your CRM"]
  classDef in fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef ai fill:#22c55e,stroke:#15803d,color:#fff
  classDef out fill:#fef3c7,stroke:#92400e,color:#000
  class A,D in
  class B,C,E ai
  class F,G out`;

const CRM_MMD = `flowchart TD
  A["Lead source<br/>phone / web / referral"] --> B["Job record created"]
  B --> C["Estimate generated<br/>from AI Estimator"]
  C --> D["Contract signed"]
  D --> E["Schedule +<br/>crew assigned"]
  E --> F["Install photos<br/>+ checklist"]
  F --> G["Auto-invoice fires"]
  G --> H["Payment in<br/>QuickBooks sync"]
  classDef in fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef ai fill:#22c55e,stroke:#15803d,color:#fff
  classDef out fill:#fef3c7,stroke:#92400e,color:#000
  class A,D,F in
  class B,C,E,G ai
  class H out`;

const SITE_MMD = `flowchart LR
  A["You edit<br/>content"] --> B["Simple visual editor"]
  B --> C["Auto-deploy"]
  C --> D["tecturalconstruction.com"]
  D --> E["AI Estimator widget<br/>(Sprint 3) lives here"]
  D --> F["Contact form"]
  E --> G["Lead lands in CRM"]
  F --> H["Routes to email assistant"]
  classDef in fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef ai fill:#22c55e,stroke:#15803d,color:#fff
  classDef out fill:#fef3c7,stroke:#92400e,color:#000
  class A in
  class B,C,E ai
  class D,F,G,H out`;

type Sprint = {
  num: string;
  title: string;
  badge: string;
  badgeColor: 'green' | 'gray';
  problem: string;
  plain: string;
  math: string;
  kills: string;
  ship: string;
  chart: string;
  idPrefix: string;
};

const SPRINTS: Sprint[] = [
  {
    num: '01',
    title: 'CRM Job Pipeline',
    badge: 'WE START HERE',
    badgeColor: 'green',
    problem: '"I want a CRM in the spirit of JobNimbus, with invoicing wired in."',
    plain:
      'One dashboard you open every morning. Every job is a row. Lead, estimated, signed, scheduled, installed, invoiced, paid. Click any job to see the photos, the contract, the payment status. Invoicing fires automatically when a job is marked complete. A working V1 is already live - try it before we sit down.',
    math: 'A JobNimbus equivalent runs $400 to $800 a month at your crew size. Kill that and reclaim around four hours a week of paperwork. Real number is closer to $2,000 a month back.',
    kills: 'JobNimbus-style subscriptions. The paper trail across email, text, and the estimator.',
    ship: 'One week for V1 ship. Foundation that every other sprint connects to.',
    chart: CRM_MMD,
    idPrefix: 'crm',
  },
  {
    num: '02',
    title: 'Email Assistant',
    badge: 'SPRINT 2',
    badgeColor: 'gray',
    problem: '"I am two days behind on email."',
    plain:
      'Every morning Jarvis has already read the new emails. Leads, vendors, customers, and crew updates sit in their own bucket. For the replies that need drafting, Jarvis writes them in your voice from past emails. You read, tweak, send. New leads flow straight into the CRM as cards. Twenty minutes instead of two hours.',
    math: 'Five hours a week back. Twenty plus hours a month. At roofer-owner time value, that pays the build back inside the first month.',
    kills: 'The two-day email backlog. The lost leads sitting unread.',
    ship: 'Two weeks once CRM is live. Same pattern already shipped for a CT superintendent.',
    chart: EMAIL_MMD,
    idPrefix: 'email',
  },
  {
    num: '03',
    title: 'In-house AI Estimator widget',
    badge: 'SPRINT 3',
    badgeColor: 'gray',
    problem: '"I like Instant Roofer. I do not like the subscription."',
    plain:
      'A widget that lives on your website. A homeowner visits, types in their address, and sees an instant estimate built from your own pricing. They leave their contact info to get the full breakdown. The lead lands in your CRM as a new job with the estimate already attached. This is what Instant Roofer does today, except you own it.',
    math: 'Kills $250 a month direct. Three thousand a year. Thirty thousand over ten years on a one-time build. The bigger upside is every website visitor who plays with it becomes a qualified lead instead of bouncing.',
    kills: 'Instant Roofer at $250 a month. Cold website visitors who never identified themselves.',
    ship: 'Four to six weeks. Needs aerial measurement API integration, your pricing rules captured, and a clean widget embed.',
    chart: ESTIMATOR_MMD,
    idPrefix: 'estimator',
  },
  {
    num: '04',
    title: 'Custom Site You Edit Yourself',
    badge: 'SPRINT 4',
    badgeColor: 'gray',
    problem: '"No one builds it the way I want it."',
    plain:
      'A clean site, built once, edited by you through a simple editor. The AI estimator widget (Sprint 3) lives on the homepage and turns visitors into qualified leads at the curb. Contact form routes straight to the email assistant, which lands the lead in the CRM. No more waiting on a contractor to change a headline.',
    math: 'Kills the offshore web contractor recurring spend. Lead capture front door starts converting visitors instead of sitting still.',
    kills: 'The offshore web contractor recurring fee. The mismatch between your taste and what gets shipped.',
    ship: 'Three to four weeks once the estimator exists.',
    chart: SITE_MMD,
    idPrefix: 'site',
  },
];

function SprintCard({ s }: { s: Sprint }) {
  const badgeBg = s.badgeColor === 'green' ? '#15803d' : '#475569';
  return (
    <section
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(15,23,42,0.10)',
        borderRadius: 20,
        padding: 'clamp(24px, 4vw, 40px)',
        marginBottom: 32,
        boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#94a3b8', fontSize: 14, letterSpacing: '0.08em' }}>
          SPRINT {s.num}
        </span>
        <span
          style={{
            background: badgeBg,
            color: '#fff',
            fontSize: 11,
            letterSpacing: '0.12em',
            padding: '3px 10px',
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          {s.badge}
        </span>
      </div>
      <h3
        style={{
          fontSize: 'clamp(24px, 3.5vw, 32px)',
          fontWeight: 700,
          color: '#0f172a',
          margin: '0 0 12px',
          lineHeight: 1.15,
        }}
      >
        {s.title}
      </h3>
      <p
        style={{
          fontSize: 18,
          color: '#475569',
          fontStyle: 'italic',
          margin: '0 0 24px',
        }}
      >
        {s.problem}
      </p>

      <div style={{ marginBottom: 24 }}>
        <Mermaid chart={s.chart} idPrefix={s.idPrefix} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        <div>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700 }}>
            HOW IT WORKS
          </p>
          <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.55, margin: 0 }}>{s.plain}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700 }}>
            WHAT IT IS WORTH
          </p>
          <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.55, margin: '0 0 16px' }}>{s.math}</p>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700 }}>
            WHAT IT KILLS
          </p>
          <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.55, margin: '0 0 16px' }}>{s.kills}</p>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#94a3b8', margin: '0 0 6px', fontWeight: 700 }}>
            TIMELINE
          </p>
          <p style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.55, margin: 0 }}>{s.ship}</p>
        </div>
      </div>
    </section>
  );
}

export default function TecturalPage() {
  return (
    <main
      style={{
        background: '#F8FAFC',
        minHeight: '100vh',
        color: '#0f172a',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '12px 24px 0',
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <a
          href="/tectural-construction/es"
          style={{
            fontSize: 13,
            color: '#475569',
            textDecoration: 'none',
            border: '1px solid rgba(15,23,42,0.12)',
            padding: '6px 12px',
            borderRadius: 999,
            fontWeight: 600,
          }}
        >
          ES · Español
        </a>
      </div>

      <header
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #15803d 100%)',
          color: '#fff',
          padding: 'clamp(48px, 10vw, 96px) clamp(24px, 5vw, 64px)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.18em',
              color: '#86efac',
              margin: '0 0 16px',
              fontWeight: 700,
            }}
          >
            TECTURAL CONSTRUCTION · AI BUILD MAP · MAY 2026
          </p>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.05,
              margin: '0 0 20px',
              letterSpacing: '-0.02em',
            }}
          >
            The all-in-one system,
            <br />
            built in-house.
          </h1>
          <p
            style={{
              fontSize: 'clamp(17px, 2vw, 21px)',
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 760,
              margin: '0 0 28px',
            }}
          >
            Four tools, mapped to how Tectural already works. Email, estimates, job
            pipeline, custom site. You own every one. No subscriptions to rent
            forever. End of summer, the whole stack is in-house.
          </p>
          <a
            href="/tectural-construction/crm"
            style={{
              display: 'inline-block',
              background: '#fff',
              color: '#15803d',
              padding: '14px 22px',
              borderRadius: 10,
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: '0.01em',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }}
          >
            See the CRM working now →
          </a>
        </div>
      </header>

      <section
        style={{
          padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 64px)',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: '0.18em',
            color: '#15803d',
            margin: '0 0 12px',
            fontWeight: 700,
          }}
        >
          THE WHOLE PICTURE
        </p>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            margin: '0 0 12px',
            letterSpacing: '-0.01em',
          }}
        >
          How the four tools fit together
        </h2>
        <p
          style={{
            fontSize: 17,
            color: '#475569',
            lineHeight: 1.55,
            maxWidth: 720,
            margin: '0 0 32px',
          }}
        >
          The green node is where we start. The yellow row is what you get out the
          other side. Everything in the middle is built once, owned forever.
        </p>
        <Mermaid chart={MASTER_MMD} idPrefix="tectural-master" />
      </section>

      <section
        style={{
          padding: 'clamp(24px, 4vw, 48px) clamp(24px, 5vw, 64px) clamp(48px, 8vw, 96px)',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: '0.18em',
            color: '#15803d',
            margin: '0 0 12px',
            fontWeight: 700,
          }}
        >
          THE FOUR SPRINTS
        </p>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            margin: '0 0 32px',
            letterSpacing: '-0.01em',
          }}
        >
          One ships first. The rest follow.
        </h2>
        {SPRINTS.map((s) => (
          <SprintCard key={s.num} s={s} />
        ))}
      </section>

      <section
        style={{
          background: '#0f172a',
          color: '#fff',
          padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 64px)',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.18em',
              color: '#86efac',
              margin: '0 0 16px',
              fontWeight: 700,
            }}
          >
            RADICAL TRANSPARENCY
          </p>
          <h2
            style={{
              fontSize: 'clamp(24px, 3.5vw, 34px)',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: '0 0 20px',
            }}
          >
            If you take this map and build it yourself, that is fine.
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.82)',
              margin: '0 0 12px',
            }}
          >
            Hand this to your IT guy. Hire someone else. You have a way forward
            either way. That is the point of the page.
          </p>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.82)',
              margin: 0,
            }}
          >
            The reason you would pay me to do it is speed. Email assistant in your
            laptop in two weeks. The whole system by end of summer. You own every
            piece on the way out.
          </p>
        </div>
      </section>

      <footer
        style={{
          background: '#F8FAFC',
          padding: 'clamp(32px, 5vw, 56px) clamp(24px, 5vw, 64px)',
          textAlign: 'center',
          borderTop: '1px solid rgba(15,23,42,0.08)',
        }}
      >
        <p style={{ fontSize: 14, color: '#475569', margin: '0 0 8px' }}>
          Built for Tectural. May 2026.
        </p>
        <p style={{ fontSize: 14, color: '#475569', margin: 0 }}>
          <a
            href="mailto:brayan@nextgenerationlearners.com"
            style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}
          >
            brayan@nextgenerationlearners.com
          </a>
        </p>
      </footer>
    </main>
  );
}
