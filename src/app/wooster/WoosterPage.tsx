import Mermaid from './Mermaid';

const MARCH_ASKS = [
  { id: 'M1', title: 'Required AI integration grades 5 to 12', detail: 'Move beyond optional. Required across the upper grades.' },
  { id: 'M2', title: 'Frictionless for teachers', detail: 'No overwhelming PD load. Integration where teachers already work.' },
  { id: 'M3', title: 'External partner for design AND implementation', detail: 'Not just a consultant. A builder who ships.' },
  { id: 'M4', title: 'Pilot programs at grades 5, 8, 10, 12', detail: 'Specific grade-level proof points.' },
  { id: 'M5', title: 'Data from what we have already seen', detail: 'Outstanding offer to share Woodstock PD + Roche + Library learnings.' },
  { id: 'M6', title: 'Pay-per-school pricing', detail: 'Wooster owns the framework. No per-user vendor lock.' },
  { id: 'M7', title: 'Brewster intro to Michelle Gosh', detail: 'Downstream district unlocked once Wooster ships.' },
];

const TIER1 = [
  {
    code: 'P1',
    title: 'Voice Cabinet: Board, Donor, Stewardship',
    description:
      "Trained on the Head's public corpus (Summer 2025 alumni letter, NAIS essays, HB-07277 testimony). Drafts board memos, donor cultivation, stewardship letters in his literary register.",
    impact: '6 to 8 hours per week back',
    ship: 'Live demo at 2pm. Shipped by mid-June 2026.',
  },
  {
    code: 'P2',
    title: 'Parent and Crisis Comms Co-Pilot',
    description:
      'Pulls student and family context. First-pass draft in his voice. Tone-check against the toxic-achievement-culture frame: no shame language, partnership framing throughout.',
    impact: '5 hours per week back',
    ship: 'Shipped by mid-June 2026',
  },
  {
    code: 'P3',
    title: 'Fairchester + NAIS Briefing Agent',
    description:
      'Daily 5-bullet morning brief: NAIS, CAIS, EdWeek, CT CGA, peer-school news, AI-in-edu research. Monthly memo he repurposes for the Fairchester Heads Association.',
    impact: '4 to 5 hours per week back. Region-wide AI thought leadership.',
    ship: 'Shipped by mid-June 2026',
  },
];

const TIER2 = [
  {
    code: 'W1',
    title: 'Faculty Prompt Library tied to the Deep Learning Initiative',
    description:
      'Wooster-owned prompts (no platform lock) for Socratic tutorial prep, research scaffolding, writing-feedback rubrics, Oxford-style question generation. Keyed to existing course maps.',
    impact: '~200 faculty hours per week reclaimed. Executes the September required-integration rollout.',
    ship: 'Faculty trained by September 2026',
  },
  {
    code: 'W2',
    title: 'Bridge Program Documentation and Accommodation Agent',
    description:
      'Ingests teacher notes plus Blackbaud onCampus assignments. Drafts weekly per-student progress narratives. Flags drift on executive-function targets. Produces a parent-ready letter.',
    impact:
      '10 to 15 hours per week reclaimed across Bridge faculty. Defends the $70,120 premium tuition with weekly evidence of progress.',
    ship: 'Live by September 2026',
  },
  {
    code: 'W4',
    title: 'Centennial Advancement Agent',
    description:
      '3,000+ alumni segmented by class, geography, prior giving. Per-alum personalized centennial outreach. Auto-generated donor briefings for the Head before every coffee. Compounds P1.',
    impact: 'Direct lift to Generals Fund and the centennial campaign.',
    ship: 'Ramps September 2026 to March 2027',
  },
];

const PRINCIPLES = [
  {
    name: 'Simplicity',
    mapping: 'Prompt library. No platform lock. Plain-English diagrams. Six boxes on one page.',
  },
  {
    name: 'Hard work',
    mapping: 'Weekly milestones. Builder in the building. No outsourced offshore dev. Same cadence as the Roche pilot.',
  },
  {
    name: 'Intellectual excellence',
    mapping:
      'Deep Learning Initiative is the prompt shape. Oxford-tutorial register preserved. Socratic prep and writing feedback at the core.',
  },
  {
    name: 'Service to others',
    mapping:
      'AI frees teachers to be present with students. No grade-optimization, no productivity-maxing kids. The opposite of toxic-achievement-culture tools.',
  },
];

const RECEIPTS = [
  {
    quote:
      "Roche signed pilot. April 2026. $2,500 plus $1,500 monthly retainer. Summer Cabinet shipping in three weeks. Same architecture proposed here, adapted to Wooster's tenant.",
    source: 'Active superintendent, Connecticut public district',
  },
  {
    quote:
      'Fifty educators across three days. Every teacher left with something to implement Monday morning. Demonstrated the practitioner-not-theorist stance the framework needs.',
    source: 'Woodstock PD keynote, April 3, 2026',
  },
  {
    quote:
      'Live AI literacy programming with families and students across two Connecticut library systems. Operating now.',
    source: 'Ridgefield + Danbury Library partnerships, Jan to May 2026',
  },
  {
    quote:
      'Backed by Gary Sheng (Applied AI Society, Forbes 30 Under 30) and Chauncey St. John (Hallow). Independent reinforcement of the operating model.',
    source: 'NGL advisors, May 2026',
  },
];

const TIMELINE_MMD = `flowchart LR
  subgraph M["MARCH 17, 2026 ASKS"]
    direction TB
    M1["M1. Required AI grades 5 to 12"]
    M2["M2. Frictionless for teachers"]
    M3["M3. Design AND implement"]
    M4["M4. Pilots at 5/8/10/12"]
    M6["M6. Pay-per-school"]
    M7["M7. Brewster intro"]
  end
  subgraph T1["TIER 1: BYRNES CABINET (May to Jun 2026)"]
    direction TB
    P1["P1. Voice Cabinet<br/>Board + Donor memos"]
    P2["P2. Parent + Crisis Comms"]
    P3["P3. Fairchester + NAIS Brief"]
  end
  subgraph T2["TIER 2: WOOSTER CABINET (Jun to Aug 2026)"]
    direction TB
    W1["W1. Faculty DLI Prompt Library"]
    W2["W2. Bridge Documentation"]
    W4["W4. Centennial Advancement"]
  end
  subgraph S["MARCH 8, 2027<br/>SPEAKER SERIES PART 4<br/>AI AT WOOSTER"]
    STG["Byrnes on stage<br/>centennial story"]
  end
  M3 ==> P1
  M3 ==> P2
  M3 -.-> P3
  M1 ==> W1
  M2 ==> W1
  M3 ==> W1
  M4 --> W2
  M6 -.-> W1
  M6 -.-> W2
  M6 -.-> W4
  M7 -.-> W1
  P1 ==> STG
  P3 --> STG
  W1 ==> STG
  W2 --> STG
  W4 ==> STG
  classDef march fill:#fde68a,stroke:#92400e,color:#000
  classDef tier1 fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef tier2 fill:#dcfce7,stroke:#166534,color:#000
  classDef stage fill:#fecaca,stroke:#991b1b,color:#000
  class M1,M2,M3,M4,M6,M7 march
  class P1,P2,P3 tier1
  class W1,W2,W4 tier2
  class STG stage`;

const ARCH_MMD = `flowchart TB
  subgraph DATA["WOOSTER DATA SOURCES"]
    direction LR
    D1["Voice Corpus<br/>alumni letters<br/>NAIS essays<br/>HB-07277 testimony"]
    D2["Blackbaud onCampus<br/>LMS + SIS"]
    D3["Productivity Stack<br/>M365 or Google<br/>(scope at meeting)"]
    D4["SSS by NAIS<br/>Financial Aid data"]
    D5["Finalsite + Alumni DB<br/>3,000+ records"]
  end
  subgraph CAB["BYRNES CABINET (Tier 1, 3 weeks)"]
    direction LR
    P1A["P1. Voice Memo Agent"]
    P2A["P2. Comms Co-Pilot"]
    P3A["P3. Briefing Agent"]
  end
  subgraph WCAB["WOOSTER CABINET (Tier 2, summer)"]
    direction LR
    W1A["W1. DLI Prompt Library"]
    W2A["W2. Bridge Documentation"]
    W4A["W4. Advancement Agent"]
  end
  subgraph OUT["OUTCOMES"]
    direction LR
    O1["18 to 22 hrs/wk<br/>back to Byrnes"]
    O2["~200 faculty hrs/wk<br/>reclaimed"]
    O3["Defensible<br/>premium tuition"]
    O4["March 8, 2027<br/>stage story"]
  end
  D1 --> P1A
  D1 --> P2A
  D1 --> W4A
  D2 --> W1A
  D2 --> W2A
  D3 --> P1A
  D3 --> P2A
  D3 --> W1A
  D4 --> W4A
  D5 --> W4A
  P1A --> O1
  P2A --> O1
  P3A --> O1
  W1A --> O2
  W2A --> O2
  W2A --> O3
  W4A --> O4
  P1A --> O4
  W1A --> O4
  classDef data fill:#e0e7ff,stroke:#3730a3,color:#000
  classDef tier1 fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef tier2 fill:#dcfce7,stroke:#166534,color:#000
  classDef outcome fill:#fef3c7,stroke:#92400e,color:#000
  class D1,D2,D3,D4,D5 data
  class P1A,P2A,P3A tier1
  class W1A,W2A,W4A tier2
  class O1,O2,O3,O4 outcome`;

export default function WoosterPage() {
  return (
    <div
      style={{
        background: '#FAF8F3',
        color: '#0F172A',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        :root {
          --ws-paper: #FAF8F3;
          --ws-cream: #F5F2EA;
          --ws-line: rgba(15,23,42,0.10);
          --ws-line-strong: rgba(15,23,42,0.18);
          --ws-ink: #0F172A;
          --ws-ink-soft: #475569;
          --ws-ink-faint: #64748B;
          --ws-navy: #1E3A8A;
          --ws-navy-deep: #1E2A6B;
          --ws-navy-tint: rgba(30,58,138,0.10);
          --ws-burgundy: #7C2D12;
        }
        .ws-display { font-family: 'Fraunces', 'Times New Roman', serif; font-weight: 400; letter-spacing: -0.03em; }
        .ws-display-italic { font-family: 'Fraunces', 'Times New Roman', serif; font-style: italic; font-weight: 300; letter-spacing: -0.025em; }
        .ws-eyebrow { font-size: 0.72rem; letter-spacing: 0.32em; text-transform: uppercase; font-weight: 500; color: var(--ws-ink-faint); }
        .ws-section { max-width: 1140px; margin: 0 auto; padding: 80px 28px; }
        .ws-section-tight { max-width: 1140px; margin: 0 auto; padding: 48px 28px; }
        .ws-rule { display: block; height: 1px; background: var(--ws-line); border: 0; }
        .ws-card {
          background: #FFFFFF; border: 1px solid var(--ws-line); border-radius: 16px; padding: 28px;
          transition: border-color 240ms ease, box-shadow 240ms ease, transform 240ms ease;
        }
        .ws-card:hover { border-color: var(--ws-line-strong); box-shadow: 0 20px 36px -22px rgba(15,23,42,0.18); transform: translateY(-2px); }
        .ws-code {
          display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
          background: var(--ws-navy-tint); color: var(--ws-navy-deep);
          border-radius: 999px; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.06em; font-family: 'Fraunces', serif;
        }
        .ws-btn-primary {
          display: inline-flex; align-items: center; gap: 12px; padding: 16px 28px;
          background: var(--ws-ink); color: var(--ws-paper); border-radius: 999px;
          font-size: 0.92rem; font-weight: 500; letter-spacing: 0.01em; text-decoration: none;
          transition: background 220ms ease, transform 220ms ease;
        }
        .ws-btn-primary:hover { background: var(--ws-navy-deep); transform: translateY(-1px); }
        .ws-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px; padding: 15px 26px;
          background: transparent; color: var(--ws-ink); border: 1px solid var(--ws-line-strong);
          border-radius: 999px; font-size: 0.92rem; font-weight: 500; text-decoration: none;
          transition: background 220ms ease, border-color 220ms ease;
        }
        .ws-btn-ghost:hover { background: var(--ws-cream); border-color: var(--ws-ink); }
        .ws-link { color: var(--ws-ink); text-decoration: underline; text-decoration-color: rgba(15,23,42,0.25); text-underline-offset: 3px; }
        .ws-link:hover { color: var(--ws-navy-deep); text-decoration-color: var(--ws-navy-deep); }
        @media (max-width: 880px) {
          .ws-section { padding: 56px 22px !important; }
          .ws-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-180px',
            right: '-120px',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,58,138,0.14), transparent 65%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '112px 28px 64px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 28,
              padding: '8px 16px',
              border: '1px solid var(--ws-line)',
              borderRadius: 999,
              background: '#FFFFFF',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ws-burgundy)' }} />
            <span className="ws-eyebrow" style={{ color: 'var(--ws-ink)' }}>
              Built for May 11, 2026 · Confidential to Matt Byrnes
            </span>
          </div>
          <h1
            className="ws-display"
            style={{
              fontSize: 'clamp(2.6rem, 6.4vw, 5.4rem)',
              lineHeight: 1.02,
              margin: 0,
              color: 'var(--ws-ink)',
              maxWidth: 980,
            }}
          >
            The architecture for Wooster&apos;s{' '}
            <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
              next 100 years.
            </span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.6vw, 1.28rem)',
              lineHeight: 1.55,
              color: 'var(--ws-ink-soft)',
              margin: '24px 0 0',
              maxWidth: 760,
            }}
          >
            A six-agent Cabinet answering the framework brief from March 17, 2026. Tier 1 ships in three weeks. Tier 2
            ships across summer. Everything backward-planned to the March 8, 2027 Centennial Speaker Series.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 36 }}>
            <a href="#tier1" className="ws-btn-primary">
              See the Cabinet
            </a>
            <a href="#timeline" className="ws-btn-ghost">
              The centennial timeline
            </a>
          </div>
          <div
            className="ws-hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
              marginTop: 56,
              paddingTop: 32,
              borderTop: '1px solid var(--ws-line)',
            }}
          >
            {[
              { k: 'Audience', v: 'Matt Byrnes, Head of School' },
              { k: 'Institution', v: 'Wooster School, Danbury CT' },
              { k: 'Anchor', v: 'March 8, 2027 Speaker Series' },
              { k: 'Builder', v: 'Brayan Tenesaca, NGL' },
            ].map((m) => (
              <div key={m.k}>
                <div className="ws-eyebrow" style={{ marginBottom: 6 }}>
                  {m.k}
                </div>
                <div style={{ fontSize: '0.96rem', color: 'var(--ws-ink)', fontWeight: 500 }}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="ws-rule" />

      {/* MARCH 17 PROMISE */}
      <section className="ws-section" id="march">
        <div className="ws-eyebrow" style={{ marginBottom: 16 }}>
          March 17, 2026 · what you said in your office
        </div>
        <h2
          className="ws-display"
          style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.05, margin: '0 0 16px', color: 'var(--ws-ink)' }}
        >
          The brief, in your own words.
        </h2>
        <p style={{ fontSize: '1.04rem', lineHeight: 1.7, color: 'var(--ws-ink-soft)', maxWidth: 760, margin: '0 0 40px' }}>
          The framework brief from our conversation. Six asks, one outstanding offer of data, and one downstream
          introduction. Everything below is built around these.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {MARCH_ASKS.map((a) => (
            <div key={a.id} className="ws-card">
              <span className="ws-code">{a.id}</span>
              <div
                className="ws-display"
                style={{
                  fontSize: '1.18rem',
                  color: 'var(--ws-ink)',
                  margin: '14px 0 8px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                }}
              >
                {a.title}
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--ws-ink-soft)', lineHeight: 1.6, margin: 0 }}>{a.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* TIMELINE MERMAID */}
      <section className="ws-section" id="timeline">
        <div className="ws-eyebrow" style={{ marginBottom: 16 }}>
          The mapping
        </div>
        <h2
          className="ws-display"
          style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.05, margin: '0 0 16px', color: 'var(--ws-ink)' }}
        >
          March 17 asks, mapped to{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            March 8, 2027.
          </span>
        </h2>
        <p style={{ fontSize: '1.04rem', lineHeight: 1.7, color: 'var(--ws-ink-soft)', maxWidth: 760, margin: '0 0 32px' }}>
          Heavy arrows are direct answers to your asks. Dotted arrows are honored constraints or proof of execution.
          Every track converges on the Centennial Speaker Series stage.
        </p>
        <Mermaid chart={TIMELINE_MMD} idPrefix="timeline" />
      </section>

      <hr className="ws-rule" />

      {/* TIER 1 */}
      <section className="ws-section" id="tier1">
        <div className="ws-eyebrow" style={{ marginBottom: 16 }}>
          Tier 1 · the Byrnes Cabinet · 3-week sprint
        </div>
        <h2
          className="ws-display"
          style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.05, margin: '0 0 16px', color: 'var(--ws-ink)' }}
        >
          Your personal operating layer.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            Built first.
          </span>
        </h2>
        <p style={{ fontSize: '1.04rem', lineHeight: 1.7, color: 'var(--ws-ink-soft)', maxWidth: 760, margin: '0 0 40px' }}>
          You are the pilot user. You feel the architecture daily before any teacher touches it. Three agents, three
          weeks, demoable today on your public voice corpus. Total leverage if all three ship: 18 to 22 hours per week
          back to your office.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          {TIER1.map((t) => (
            <div key={t.code} className="ws-card" style={{ height: '100%' }}>
              <span className="ws-code">{t.code}</span>
              <div
                className="ws-display"
                style={{
                  fontSize: '1.3rem',
                  color: 'var(--ws-ink)',
                  margin: '14px 0 10px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                }}
              >
                {t.title}
              </div>
              <p style={{ fontSize: '0.96rem', color: 'var(--ws-ink-soft)', lineHeight: 1.65, margin: '0 0 18px' }}>
                {t.description}
              </p>
              <div style={{ paddingTop: 14, borderTop: '1px solid var(--ws-line)' }}>
                <div className="ws-eyebrow" style={{ fontSize: '0.62rem', marginBottom: 6 }}>
                  Impact
                </div>
                <div style={{ fontSize: '0.94rem', color: 'var(--ws-ink)', marginBottom: 12, fontWeight: 500 }}>
                  {t.impact}
                </div>
                <div className="ws-eyebrow" style={{ fontSize: '0.62rem', marginBottom: 6 }}>
                  Ship
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--ws-ink-soft)' }}>{t.ship}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* TIER 2 */}
      <section className="ws-section" id="tier2">
        <div className="ws-eyebrow" style={{ marginBottom: 16 }}>
          Tier 2 · the Wooster Cabinet · summer build
        </div>
        <h2
          className="ws-display"
          style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.05, margin: '0 0 16px', color: 'var(--ws-ink)' }}
        >
          The school&apos;s operating layer.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            Faculty trained by September.
          </span>
        </h2>
        <p style={{ fontSize: '1.04rem', lineHeight: 1.7, color: 'var(--ws-ink-soft)', maxWidth: 760, margin: '0 0 40px' }}>
          Three institutional agents scoped together in June with Pannone, Bazemore, and the Head&apos;s office. Built
          July through August. Live for the September required-integration rollout. Pay-per-school per your March ask.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          {TIER2.map((t) => (
            <div key={t.code} className="ws-card" style={{ height: '100%' }}>
              <span
                className="ws-code"
                style={{ background: 'rgba(22,101,52,0.10)', color: '#166534' }}
              >
                {t.code}
              </span>
              <div
                className="ws-display"
                style={{
                  fontSize: '1.3rem',
                  color: 'var(--ws-ink)',
                  margin: '14px 0 10px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                }}
              >
                {t.title}
              </div>
              <p style={{ fontSize: '0.96rem', color: 'var(--ws-ink-soft)', lineHeight: 1.65, margin: '0 0 18px' }}>
                {t.description}
              </p>
              <div style={{ paddingTop: 14, borderTop: '1px solid var(--ws-line)' }}>
                <div className="ws-eyebrow" style={{ fontSize: '0.62rem', marginBottom: 6 }}>
                  Impact
                </div>
                <div style={{ fontSize: '0.94rem', color: 'var(--ws-ink)', marginBottom: 12, fontWeight: 500 }}>
                  {t.impact}
                </div>
                <div className="ws-eyebrow" style={{ fontSize: '0.62rem', marginBottom: 6 }}>
                  Ship
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--ws-ink-soft)' }}>{t.ship}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* ARCHITECTURE */}
      <section className="ws-section" id="architecture">
        <div className="ws-eyebrow" style={{ marginBottom: 16 }}>
          The architecture
        </div>
        <h2
          className="ws-display"
          style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.05, margin: '0 0 16px', color: 'var(--ws-ink)' }}
        >
          One system.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            Six agents.
          </span>{' '}
          Wooster-owned data.
        </h2>
        <p style={{ fontSize: '1.04rem', lineHeight: 1.7, color: 'var(--ws-ink-soft)', maxWidth: 760, margin: '0 0 32px' }}>
          Data sources on top. Two Cabinets in the middle. Outcomes at the bottom. M365-versus-Google is the one
          scoping question to resolve at our meeting; everything else assumes Wooster owns the data and the framework.
        </p>
        <Mermaid chart={ARCH_MMD} idPrefix="arch" />
      </section>

      <hr className="ws-rule" />

      {/* PRINCIPLES */}
      <section className="ws-section">
        <div className="ws-eyebrow" style={{ marginBottom: 16 }}>
          The four centennial principles
        </div>
        <h2
          className="ws-display"
          style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.05, margin: '0 0 16px', color: 'var(--ws-ink)' }}
        >
          1926 to{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-burgundy)' }}>
            2026.
          </span>{' '}
          Same principles. New medium.
        </h2>
        <p style={{ fontSize: '1.04rem', lineHeight: 1.7, color: 'var(--ws-ink-soft)', maxWidth: 760, margin: '0 0 40px' }}>
          The four enduring principles Wooster has carried since 1926 are the same four design constraints on this
          framework. The architecture is engineered to reflect them.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          {PRINCIPLES.map((p) => (
            <div key={p.name} className="ws-card">
              <div
                className="ws-display"
                style={{
                  fontSize: '1.42rem',
                  color: 'var(--ws-burgundy)',
                  margin: '0 0 12px',
                  letterSpacing: '-0.02em',
                  fontStyle: 'italic',
                  fontWeight: 300,
                }}
              >
                {p.name}.
              </div>
              <p style={{ fontSize: '0.96rem', color: 'var(--ws-ink-soft)', lineHeight: 1.65, margin: 0 }}>{p.mapping}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* RECEIPTS */}
      <section className="ws-section" id="receipts">
        <div className="ws-eyebrow" style={{ marginBottom: 16 }}>
          What is already shipping
        </div>
        <h2
          className="ws-display"
          style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.05, margin: '0 0 16px', color: 'var(--ws-ink)' }}
        >
          Not theory.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            Receipts.
          </span>
        </h2>
        <p style={{ fontSize: '1.04rem', lineHeight: 1.7, color: 'var(--ws-ink-soft)', maxWidth: 760, margin: '0 0 40px' }}>
          The data from what we&apos;ve already seen, per the offer made in March. Practitioner evidence from the field
          since our March 17 conversation.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {RECEIPTS.map((r) => (
            <div key={r.source} className="ws-card">
              <div
                className="ws-display"
                style={{
                  fontSize: '1.06rem',
                  color: 'var(--ws-ink)',
                  lineHeight: 1.5,
                  margin: '0 0 18px',
                  letterSpacing: '-0.01em',
                }}
              >
                {r.quote}
              </div>
              <div className="ws-eyebrow" style={{ fontSize: '0.64rem' }}>
                {r.source}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* REACH */}
      <section className="ws-section" id="reach">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            alignItems: 'start',
          }}
        >
          <div>
            <div className="ws-eyebrow" style={{ marginBottom: 16 }}>
              What we lock today
            </div>
            <h2
              className="ws-display"
              style={{
                fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)',
                lineHeight: 1.05,
                margin: '0 0 16px',
                color: 'var(--ws-ink)',
              }}
            >
              Three weeks from a handshake to{' '}
              <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
                your first agent in your inbox.
              </span>
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--ws-ink-soft)', maxWidth: 520, margin: '0 0 28px' }}>
              At our meeting today we lock Tier 1 dates, Tier 2 summer scoping with Pannone and Bazemore, the M365
              versus Google answer, and pay-per-school pricing. Brewster intro stays on the downstream list.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="mailto:brayan@nextgenerationlearners.com?subject=Wooster%20Cabinet%20-%20next%20steps" className="ws-btn-primary">
                Reach Brayan
              </a>
              <a href="#march" className="ws-btn-ghost">
                Back to the brief
              </a>
            </div>
          </div>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--ws-line)',
              borderRadius: 18,
              padding: 32,
            }}
          >
            <div className="ws-eyebrow" style={{ marginBottom: 18 }}>
              Today&apos;s asks
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Greenlight Tier 1 starting the week of May 18',
                'Lock pay-per-school pricing for both tiers',
                'Confirm M365 versus Google for SSO + drafting',
                'June scoping call with Pannone and Bazemore',
                'How you will measure whether this worked',
                'Brewster intro (Michelle Gosh) after Tier 1 ships',
              ].map((ask, i) => (
                <li
                  key={ask}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 1fr',
                    gap: 12,
                    paddingBottom: 12,
                    borderBottom: i < 5 ? '1px solid var(--ws-line)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: 'var(--ws-navy-tint)',
                      color: 'var(--ws-navy-deep)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 600,
                      fontSize: '0.82rem',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ fontSize: '0.96rem', color: 'var(--ws-ink)', lineHeight: 1.55 }}>{ask}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: 'var(--ws-ink)',
          color: 'rgba(250,248,243,0.7)',
          paddingTop: 56,
          paddingBottom: 32,
        }}
      >
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 28px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 32,
              marginBottom: 40,
              alignItems: 'start',
            }}
          >
            <div>
              <div
                className="ws-display"
                style={{ fontSize: '1.5rem', color: 'var(--ws-paper)', letterSpacing: '-0.02em', marginBottom: 12 }}
              >
                Wooster Cabinet
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.7, margin: 0, maxWidth: 320 }}>
                A six-agent AI architecture proposed for Wooster School in its centennial year. Confidential draft for
                Matt Byrnes.
              </p>
            </div>
            <div>
              <div className="ws-eyebrow" style={{ color: 'rgba(250,248,243,0.45)', marginBottom: 14 }}>
                Built by
              </div>
              <p style={{ fontSize: '0.94rem', color: 'rgba(250,248,243,0.9)', lineHeight: 1.6, margin: '0 0 6px' }}>
                Brayan Tenesaca
              </p>
              <p style={{ fontSize: '0.84rem', lineHeight: 1.7, margin: '0 0 12px' }}>
                Founder, Next Generation Learners
              </p>
              <a
                href="mailto:brayan@nextgenerationlearners.com"
                style={{ fontSize: '0.84rem', color: 'rgba(250,248,243,0.9)', textDecoration: 'underline' }}
              >
                brayan@nextgenerationlearners.com
              </a>
            </div>
            <div>
              <div className="ws-eyebrow" style={{ color: 'rgba(250,248,243,0.45)', marginBottom: 14 }}>
                Sources
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.84rem' }}>
                <li>Public Wooster centennial page (March 8, 2027 speaker series)</li>
                <li>Matt Byrnes Summer 2025 alumni letter</li>
                <li>HB-07277 testimony, April 2025</li>
                <li>NAIS Independent School Magazine, 2018-2023</li>
                <li>Wooster IRS Form 990, FYE June 2025</li>
              </ul>
            </div>
          </div>
          <div
            style={{
              paddingTop: 22,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.76rem',
              color: 'rgba(250,248,243,0.45)',
            }}
          >
            <p style={{ margin: 0 }}>
              Draft prepared for the May 11, 2026 meeting. Not an offer. All commitments require written scope.
            </p>
            <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Next Generation Learners</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
