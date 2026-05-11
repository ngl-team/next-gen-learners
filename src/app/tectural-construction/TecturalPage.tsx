import Mermaid from './Mermaid';

const MASTER_MMD = `flowchart TD
  subgraph FD["FRONT DOOR"]
    direction LR
    WEB["Custom site<br/>he edits himself"]
    PHONE["Phone +<br/>referrals"]
  end
  subgraph LEAD["LEAD CAPTURE"]
    direction LR
    FORM["Web form"]
    EST["In-house AI estimator<br/>kills Instant Roofer"]
  end
  subgraph BRAIN["JARVIS - brain on your laptop"]
    direction TB
    EMAIL["Email assistant<br/>SPRINT 1 - start here"]
    VOICE["Voice profile +<br/>people files"]
  end
  subgraph OPS["OPERATIONS DASHBOARD"]
    direction LR
    CRM["Job pipeline<br/>estimate to install to invoice"]
    INV["Auto-invoice<br/>on completion"]
  end
  subgraph OUT["OUTCOMES"]
    direction LR
    OWN["He owns<br/>every tool"]
    KILL["Subscriptions<br/>retired"]
    TIME["Hours back<br/>every week"]
  end
  WEB --> FORM
  PHONE --> EMAIL
  FORM --> EST
  EST --> CRM
  EMAIL --> CRM
  EMAIL --> VOICE
  CRM --> INV
  INV --> OWN
  CRM --> KILL
  EMAIL --> TIME
  classDef front fill:#e0e7ff,stroke:#3730a3,color:#000
  classDef lead fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef brain fill:#22c55e,stroke:#15803d,color:#fff
  classDef brain2 fill:#dcfce7,stroke:#15803d,color:#000
  classDef ops fill:#fde68a,stroke:#92400e,color:#000
  classDef outcome fill:#fef3c7,stroke:#92400e,color:#000
  class WEB,PHONE front
  class FORM,EST lead
  class EMAIL brain
  class VOICE brain2
  class CRM,INV ops
  class OWN,KILL,TIME outcome`;

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
  A["Address typed in<br/>web form or by crew"] --> B["Aerial measurement API"]
  B --> C["Roof area + pitch"]
  C --> D["Tectural pricing rules"]
  E["Material costs<br/>wood / metal / EPDM / copper"] --> D
  D --> F["Branded PDF estimate"]
  F --> G["Sent to lead<br/>+ saved to job file"]
  classDef in fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef ai fill:#22c55e,stroke:#15803d,color:#fff
  classDef out fill:#fef3c7,stroke:#92400e,color:#000
  class A,E in
  class B,C,D ai
  class F,G out`;

const CRM_MMD = `flowchart TD
  A["Lead source<br/>phone / web / referral"] --> B["Job record created"]
  B --> C["Estimate generated<br/>from Sprint 2 tool"]
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
  E["Estimator from<br/>Sprint 2"] --> D
  D --> F["Contact form"]
  F --> G["Routes to<br/>email assistant"]
  classDef in fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef ai fill:#22c55e,stroke:#15803d,color:#fff
  classDef out fill:#fef3c7,stroke:#92400e,color:#000
  class A,F in
  class B,C,E ai
  class D,G out`;

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
    title: 'Email assistant',
    badge: 'WE START HERE',
    badgeColor: 'green',
    problem: '"I am two days behind on email."',
    plain:
      "Every morning Jarvis has already read the new emails. Leads, vendors, customers, and crew updates sit in their own bucket. For the replies that need drafting, Jarvis writes them in your voice from past emails. You read, tweak, send. Twenty minutes instead of two hours.",
    math: 'Five hours a week back. Twenty plus hours a month. At roofer-owner time value, that pays the build back inside the first month.',
    kills: 'The two-day email backlog. The lost leads sitting unread.',
    ship: 'Two weeks. Same pattern already shipped for a CT superintendent.',
    chart: EMAIL_MMD,
    idPrefix: 'email',
  },
  {
    num: '02',
    title: 'In-house AI estimator',
    badge: 'PHASE 2',
    badgeColor: 'gray',
    problem: '"I like Instant Roofer. I do not like the subscription."',
    plain:
      "A lead types an address. The tool pulls roof measurements from aerial data, runs them through your pricing for wood, metal, EPDM, copper, and Tesla Solar, and produces a branded PDF estimate. You own the math, the layout, the data. No subscription forever.",
    math: 'Kills $250 a month direct. Three thousand a year. Thirty thousand over ten years on a one-time build.',
    kills: 'Instant Roofer at $250 a month.',
    ship: 'Four to six weeks. Needs aerial measurement API integration and pricing rules captured.',
    chart: ESTIMATOR_MMD,
    idPrefix: 'estimator',
  },
  {
    num: '03',
    title: 'Job pipeline + invoicing',
    badge: 'PHASE 3',
    badgeColor: 'gray',
    problem: '"I want a CRM in the spirit of JobNimbus, with invoicing wired in."',
    plain:
      'One dashboard you open every morning. Every job is a row. Which jobs are in estimate, signed, scheduled, today on the truck, ready to invoice. Click a job and see the photos, the contract, the payment status. Invoicing fires automatically when a job is marked complete.',
    math: 'A JobNimbus equivalent runs $400 to $800 a month at your crew size. Kill that and reclaim around four hours a week of paperwork on top. Real number is closer to $1,500 a month back.',
    kills: 'JobNimbus-style subscriptions. The paper trail across email, text, and the estimator.',
    ship: 'Six to eight weeks. Integrates Sprint 1 and Sprint 2 into one view.',
    chart: CRM_MMD,
    idPrefix: 'crm',
  },
  {
    num: '04',
    title: 'Custom site you edit yourself',
    badge: 'PHASE 4',
    badgeColor: 'gray',
    problem: '"No one builds it the way I want it."',
    plain:
      'A clean site, built once, edited by you through a simple editor. The Sprint 2 estimator lives on the homepage and captures leads at the curb. Contact form routes straight to the email assistant. No more waiting on a contractor to change a headline.',
    math: 'Kills the offshore web contractor recurring spend. Lead capture front door starts converting visitors instead of sitting still.',
    kills: 'The offshore web contractor recurring fee. The mismatch between your taste and what gets shipped.',
    ship: 'Three to four weeks once Sprint 2 exists.',
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
              margin: 0,
            }}
          >
            Four tools, mapped to how Tectural already works. Email, estimates, job
            pipeline, custom site. You own every one. No subscriptions to rent
            forever. End of summer, the whole stack is in-house.
          </p>
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
