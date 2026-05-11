import Mermaid from './Mermaid';

const GLOSSARY = [
  {
    term: 'Agent',
    def: 'A small AI program that does one specific job. It reads inputs, follows instructions, and returns a draft. The human stays in charge.',
  },
  {
    term: 'Cabinet',
    def: 'A set of agents built for one person or one institution. Six agents total in this framework.',
  },
  {
    term: 'Framework',
    def: 'The full plan: architecture, agents, build steps, and measurement. Documented so any qualified builder could pick it up and execute it.',
  },
  {
    term: 'Prompt library',
    def: 'The instructions that tell each agent how to behave. Stored as plain text. Wooster owns them and can edit anytime.',
  },
];

const MARCH_ASKS = [
  { id: 'M1', title: 'Required AI integration grades 5 to 12', detail: 'Move beyond optional. Required across the upper grades.' },
  { id: 'M2', title: 'Frictionless for teachers', detail: 'No overwhelming PD load. AI lives where teachers already work.' },
  { id: 'M3', title: 'External partner for design AND implementation', detail: 'Not just a consultant. A builder who ships.' },
  { id: 'M4', title: 'Pilot programs at grades 5, 8, 10, 12', detail: 'Specific grade-level proof points.' },
  { id: 'M5', title: 'Pay-per-school pricing', detail: 'Wooster owns the framework. No per-user vendor lock.' },
];

const TIER1 = [
  {
    code: 'P1',
    title: 'Memo writer in your voice',
    plain: 'Drafts board memos, donor letters, and stewardship notes that sound like you.',
    reads: 'Your past alumni letters, NAIS essays, and public testimony.',
    does: 'Turns a few bullet points into a full first-draft letter in your voice.',
    youDo: 'Edit the draft. Send.',
    timeBack: '6 to 8 hours per week',
    ready: 'Mid-June 2026',
  },
  {
    code: 'P2',
    title: 'Parent and crisis email co-pilot',
    plain: 'Drafts high-stakes parent and crisis emails in a warm, partnership-first tone.',
    reads: "The thread you are answering, relevant student context, and Wooster's stated policies.",
    does: 'Drafts the response in your voice. Flags any sentence that sounds like blame or shame.',
    youDo: 'Read. Adjust. Send.',
    timeBack: '5 hours per week',
    ready: 'Mid-June 2026',
  },
  {
    code: 'P3',
    title: 'Daily briefing agent',
    plain: 'Reads the field every morning and gives you a 5-bullet summary.',
    reads: 'NAIS, CAIS, EdWeek, CT state legislature filings, peer-school news, AI-in-education research.',
    does: 'Produces a daily 5-bullet brief and a monthly memo you can share with the Fairchester Heads.',
    youDo: 'Read it with coffee.',
    timeBack: '4 to 5 hours per week',
    ready: 'Mid-June 2026',
  },
];

const TIER2 = [
  {
    code: 'W1',
    title: 'Faculty prompt library tied to the Deep Learning Initiative',
    plain: 'Ready-to-use AI prompts faculty can paste into the tools they already use, mapped to Wooster course frameworks.',
    reads: 'Existing course maps, assignment templates, and the DLI structure.',
    does: 'Gives each teacher vetted prompts for tutorial-style class prep, research scaffolding, and writing feedback. Wooster owns every prompt.',
    youDo: 'Train faculty in a 90-minute session. Update prompts each term.',
    timeBack: 'Roughly 200 faculty hours per week reclaimed across the school.',
    ready: 'Faculty trained by September 2026',
  },
  {
    code: 'W2',
    title: 'Bridge Program documentation agent',
    plain: 'Drafts weekly progress narratives for each Bridge student and produces the parent-ready letter.',
    reads: "Teacher notes from the week, assignments and grades in Blackbaud onCampus, each student's accommodation plan.",
    does: 'Writes a per-student weekly summary. Flags executive-function or attention drift. Produces the parent letter.',
    youDo: 'Review. Adjust. Send to parents.',
    timeBack: '10 to 15 hours per week across Bridge faculty',
    ready: 'Live by September 2026',
  },
  {
    code: 'W4',
    title: 'Centennial advancement agent',
    plain: 'Personalizes alumni outreach for the centennial year and briefs the Head before every donor coffee.',
    reads: "The alumni database, past giving history, each alum's Wooster touchpoints.",
    does: 'Writes per-alum centennial outreach in your voice. Generates a one-page donor brief before every meeting.',
    youDo: 'Approve outreach. Read briefs.',
    timeBack: 'Direct lift to Generals Fund and centennial campaign performance.',
    ready: 'Ramps September 2026 to March 2027',
  },
];

const PHASE1_TIMELINE = [
  { label: 'Week 1', do: 'Collect voice corpus. Set up Google Workspace access. Build P1 first draft.' },
  { label: 'Week 2', do: 'Test P1 on two real board memos. Build P2 and P3 in parallel.' },
  { label: 'Week 3', do: 'Polish all three. Hand them over to the Head for daily use.' },
];

const PHASE2_TIMELINE = [
  { label: 'June 2026', do: 'Scoping with Pannone and Bazemore. Confirm course maps, Bridge format, and alumni database access.' },
  { label: 'July 2026', do: 'Build W1 prompt library. Build W2 documentation agent.' },
  { label: 'August 2026', do: 'Build W4. Train faculty leads on W1.' },
  { label: 'September 2026', do: 'Faculty rollout of W1. W2 goes live for the Bridge cohort.' },
  { label: 'Oct 2026 to Feb 2027', do: 'W4 ramps with the centennial calendar. Iterate on all six agents based on real use.' },
];

const MEASUREMENTS = [
  {
    name: 'Time given back to the Head',
    how: 'Track hours per week spent on memos, parent comms, and briefings before and after Phase 1.',
    target: '15 or more hours per week reclaimed.',
  },
  {
    name: 'Faculty adoption of W1',
    how: 'Survey faculty in October 2026. Count weekly active users of the prompt library.',
    target: '60 percent or more of grades 5 to 12 faculty.',
  },
  {
    name: 'Bridge parent experience',
    how: 'Compare parent satisfaction scores before and after W2 goes live.',
    target: 'Measurable lift in clarity and timeliness scores.',
  },
  {
    name: 'Centennial fund participation',
    how: 'Track alumni giving participation rate across the centennial year.',
    target: 'Higher than the last three years average.',
  },
  {
    name: 'Speaker series readiness',
    how: 'By February 1, 2027 the Head has a stage-ready story with real metrics from all six agents.',
    target: 'Ready for the March 8, 2027 speaker series.',
  },
];

const HANDOFF = [
  {
    item: 'A Wooster-controlled Google Workspace admin role',
    why: 'To build agents inside the tenant Wooster already owns.',
  },
  {
    item: "Read access to the Head's public writing",
    why: 'To build the voice for P1, P2, and W4.',
  },
  {
    item: 'Read access to Blackbaud onCampus',
    why: 'For W1 (course maps) and W2 (assignments and accommodations).',
  },
  {
    item: 'Read access to the alumni database',
    why: 'For W4 segmentation and per-alum personalization.',
  },
  {
    item: 'A 90-minute scoping call with the Head, Pannone, and Bazemore',
    why: 'To confirm voice, faculty rollout, and Bridge format.',
  },
  {
    item: 'Permission to update the prompt library each term',
    why: 'Prompts compound. Configurations rot. Wooster keeps the source.',
  },
  {
    item: 'A weekly 30-minute review during the first eight weeks',
    why: 'To catch drift early.',
  },
];

const PRINCIPLES = [
  { name: 'Simplicity', mapping: 'Prompt library. No platform lock. Plain English. Six agents on one page.' },
  { name: 'Hard work', mapping: 'Weekly milestones. A builder in the building. No offshore handoff.' },
  { name: 'Intellectual excellence', mapping: 'Deep Learning Initiative shapes every prompt. Tutorial register preserved.' },
  { name: 'Service to others', mapping: 'AI frees teachers to be present with students. No grade-optimization, no productivity-maxing kids.' },
];

const RECEIPTS = [
  {
    quote: 'Roche signed pilot, April 2026. Same architecture, adapted for a Connecticut public superintendent.',
    source: 'Active superintendent, Connecticut public district',
  },
  {
    quote: 'Fifty educators, three days. Every teacher left with something to use Monday morning.',
    source: 'Woodstock PD keynote, April 3, 2026',
  },
  {
    quote: 'AI literacy programming live with families and students across two Connecticut library systems.',
    source: 'Ridgefield and Danbury Library partnerships, Jan to May 2026',
  },
];

const TIMELINE_MMD = `flowchart LR
  subgraph M["MARCH 17, 2026 ASKS"]
    direction TB
    M1["M1. Required AI grades 5 to 12"]
    M2["M2. Frictionless for teachers"]
    M3["M3. Design AND implement"]
    M4["M4. Pilots at 5/8/10/12"]
    M5["M5. Pay-per-school"]
  end
  subgraph T1["PHASE 1: AGENTS FOR YOUR DESK (May to Jun 2026)"]
    direction TB
    P1["P1. Memo writer<br/>in your voice"]
    P2["P2. Parent + crisis<br/>email co-pilot"]
    P3["P3. Daily briefing agent"]
  end
  subgraph T2["PHASE 2: AGENTS FOR THE SCHOOL (Jun to Aug 2026)"]
    direction TB
    W1["W1. DLI prompt library"]
    W2["W2. Bridge documentation"]
    W4["W4. Centennial advancement"]
  end
  subgraph S["MARCH 8, 2027<br/>AI AT WOOSTER<br/>Speaker Series Part 4"]
    STG["The story you tell on stage"]
  end
  M3 ==> P1
  M3 ==> P2
  M3 -.-> P3
  M1 ==> W1
  M2 ==> W1
  M3 ==> W1
  M4 --> W2
  M5 -.-> W1
  M5 -.-> W2
  M5 -.-> W4
  P1 ==> STG
  P3 --> STG
  W1 ==> STG
  W2 --> STG
  W4 ==> STG
  classDef march fill:#fde68a,stroke:#92400e,color:#000
  classDef tier1 fill:#dbeafe,stroke:#1e3a8a,color:#000
  classDef tier2 fill:#dcfce7,stroke:#166534,color:#000
  classDef stage fill:#fecaca,stroke:#991b1b,color:#000
  class M1,M2,M3,M4,M5 march
  class P1,P2,P3 tier1
  class W1,W2,W4 tier2
  class STG stage`;

const ARCH_MMD = `flowchart TB
  subgraph DATA["WOOSTER DATA SOURCES"]
    direction LR
    D1["Voice Corpus<br/>alumni letters<br/>NAIS essays<br/>HB-07277 testimony"]
    D2["Blackbaud onCampus<br/>grades + assignments"]
    D3["Google Workspace<br/>tenant-owned"]
    D4["SSS by NAIS<br/>Financial Aid"]
    D5["Alumni Database<br/>3,000+ records"]
  end
  subgraph CAB["PHASE 1 AGENTS (3 weeks)"]
    direction LR
    P1A["P1. Memo writer"]
    P2A["P2. Email co-pilot"]
    P3A["P3. Daily briefing"]
  end
  subgraph WCAB["PHASE 2 AGENTS (summer)"]
    direction LR
    W1A["W1. DLI prompts"]
    W2A["W2. Bridge docs"]
    W4A["W4. Advancement"]
  end
  subgraph OUT["OUTCOMES"]
    direction LR
    O1["15+ hrs/wk<br/>back to the Head"]
    O2["200+ faculty hrs/wk<br/>reclaimed"]
    O3["Bridge premium<br/>defended weekly"]
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

type AgentCard = (typeof TIER1)[number];

function AgentCard({ a, accent }: { a: AgentCard; accent: 'blue' | 'green' }) {
  const codeStyle =
    accent === 'green'
      ? { background: 'rgba(22,101,52,0.10)', color: '#166534' }
      : { background: 'var(--ws-navy-tint)', color: 'var(--ws-navy-deep)' };
  return (
    <div className="ws-card" style={{ height: '100%' }}>
      <span className="ws-code" style={codeStyle}>
        {a.code}
      </span>
      <div
        className="ws-display"
        style={{ fontSize: '1.32rem', color: 'var(--ws-ink)', margin: '16px 0 10px', letterSpacing: '-0.02em', lineHeight: 1.25 }}
      >
        {a.title}
      </div>
      <p style={{ fontSize: '0.98rem', color: 'var(--ws-ink-soft)', lineHeight: 1.65, margin: '0 0 22px' }}>{a.plain}</p>

      <div className="ws-field">
        <div className="ws-field-label">What it reads</div>
        <div className="ws-field-value">{a.reads}</div>
      </div>
      <div className="ws-field">
        <div className="ws-field-label">What it does</div>
        <div className="ws-field-value">{a.does}</div>
      </div>
      <div className="ws-field">
        <div className="ws-field-label">What you do</div>
        <div className="ws-field-value">{a.youDo}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 16, marginTop: 8, borderTop: '1px solid var(--ws-line)' }}>
        <div>
          <div className="ws-field-label">Time back</div>
          <div style={{ fontSize: '0.94rem', color: 'var(--ws-ink)', fontWeight: 500 }}>{a.timeBack}</div>
        </div>
        <div>
          <div className="ws-field-label">Ready</div>
          <div style={{ fontSize: '0.94rem', color: 'var(--ws-ink)', fontWeight: 500 }}>{a.ready}</div>
        </div>
      </div>
    </div>
  );
}

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
        .ws-section { max-width: 1180px; margin: 0 auto; padding: 112px 32px; }
        .ws-section-tight { max-width: 1180px; margin: 0 auto; padding: 72px 32px; }
        .ws-section-wide { max-width: 1600px; margin: 0 auto; padding: 112px 32px; }
        .ws-diagram-wrap { width: 100%; margin-top: 40px; }
        .ws-rule { display: block; height: 1px; background: var(--ws-line); border: 0; }
        .ws-card {
          background: #FFFFFF; border: 1px solid var(--ws-line); border-radius: 18px; padding: 36px;
          transition: border-color 240ms ease, box-shadow 240ms ease, transform 240ms ease;
        }
        .ws-card:hover { border-color: var(--ws-line-strong); box-shadow: 0 20px 36px -22px rgba(15,23,42,0.18); transform: translateY(-2px); }
        .ws-code {
          display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
          background: var(--ws-navy-tint); color: var(--ws-navy-deep);
          border-radius: 999px; font-size: 0.74rem; font-weight: 600; letter-spacing: 0.06em; font-family: 'Fraunces', serif;
        }
        .ws-field { padding: 12px 0; border-bottom: 1px dashed var(--ws-line); }
        .ws-field:last-of-type { border-bottom: none; }
        .ws-field-label {
          font-size: 0.66rem; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 500;
          color: var(--ws-ink-faint); margin-bottom: 4px;
        }
        .ws-field-value { font-size: 0.94rem; color: 'var(--ws-ink)'; line-height: 1.55; }
        .ws-link { color: var(--ws-ink); text-decoration: underline; text-decoration-color: rgba(15,23,42,0.25); text-underline-offset: 3px; }
        .ws-link:hover { color: var(--ws-navy-deep); text-decoration-color: var(--ws-navy-deep); }
        .ws-h2 { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(2rem, 4.2vw, 3rem); line-height: 1.05; letter-spacing: -0.03em; color: var(--ws-ink); margin: 0 0 16px; }
        .ws-lead { font-size: 1.04rem; line-height: 1.7; color: var(--ws-ink-soft); max-width: 720px; margin: 0 0 16px; }
        .ws-lead-tight { font-size: 1rem; line-height: 1.7; color: var(--ws-ink-soft); max-width: 720px; margin: 0 0 8px; }
        @media (max-width: 880px) {
          .ws-section { padding: 72px 22px !important; }
          .ws-section-tight { padding: 48px 22px !important; }
          .ws-section-wide { padding: 72px 22px !important; }
          .ws-card { padding: 28px !important; }
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
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '140px 32px 96px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 32,
              padding: '8px 16px',
              border: '1px solid var(--ws-line)',
              borderRadius: 999,
              background: '#FFFFFF',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ws-burgundy)' }} />
            <span className="ws-eyebrow" style={{ color: 'var(--ws-ink)' }}>
              Framework draft for Matt Byrnes · May 11, 2026
            </span>
          </div>
          <h1
            className="ws-display"
            style={{ fontSize: 'clamp(2.6rem, 6.4vw, 5.4rem)', lineHeight: 1.02, margin: 0, color: 'var(--ws-ink)', maxWidth: 980 }}
          >
            The architecture for Wooster&apos;s{' '}
            <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
              next 100 years.
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.32rem)', lineHeight: 1.55, color: 'var(--ws-ink-soft)', margin: '28px 0 0', maxWidth: 760 }}>
            Six AI agents answering the brief from March 17, 2026.
          </p>
          <p style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.18rem)', lineHeight: 1.6, color: 'var(--ws-ink-soft)', margin: '12px 0 0', maxWidth: 760 }}>
            Three agents for the Head&apos;s desk in three weeks. Three for the school across summer. Anchored at the
            March 8, 2027 Centennial Speaker Series.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 28,
              marginTop: 72,
              paddingTop: 36,
              borderTop: '1px solid var(--ws-line)',
            }}
          >
            {[
              { k: 'For', v: 'Matt Byrnes, Head of School' },
              { k: 'Institution', v: 'Wooster School, Danbury CT' },
              { k: 'Stack', v: 'Google Workspace · Blackbaud onCampus' },
              { k: 'Public anchor', v: 'March 8, 2027 Speaker Series' },
            ].map((m) => (
              <div key={m.k}>
                <div className="ws-eyebrow" style={{ marginBottom: 8 }}>
                  {m.k}
                </div>
                <div style={{ fontSize: '0.96rem', color: 'var(--ws-ink)', fontWeight: 500 }}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="ws-rule" />

      {/* WHAT THIS IS */}
      <section className="ws-section" id="what-this-is">
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          What this is
        </div>
        <h2 className="ws-h2">
          A complete framework.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            Plain English.
          </span>
        </h2>
        <p className="ws-lead">This document is the whole plan, written so any qualified builder could execute it.</p>
        <p className="ws-lead-tight">Four terms appear throughout. They are defined below.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 40 }}>
          {GLOSSARY.map((g) => (
            <div key={g.term} className="ws-card">
              <div
                className="ws-display"
                style={{ fontSize: '1.42rem', color: 'var(--ws-burgundy)', margin: '0 0 12px', letterSpacing: '-0.02em', fontStyle: 'italic', fontWeight: 300 }}
              >
                {g.term}.
              </div>
              <p style={{ fontSize: '0.96rem', color: 'var(--ws-ink-soft)', lineHeight: 1.65, margin: 0 }}>{g.def}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* MARCH 17 BRIEF */}
      <section className="ws-section" id="march">
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          March 17, 2026 · what you said in your office
        </div>
        <h2 className="ws-h2">The brief, in your own words.</h2>
        <p className="ws-lead">Five asks from our conversation.</p>
        <p className="ws-lead-tight">Everything below is built around them.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginTop: 40 }}>
          {MARCH_ASKS.map((a) => (
            <div key={a.id} className="ws-card">
              <span className="ws-code">{a.id}</span>
              <div
                className="ws-display"
                style={{ fontSize: '1.2rem', color: 'var(--ws-ink)', margin: '14px 0 10px', letterSpacing: '-0.02em', lineHeight: 1.25 }}
              >
                {a.title}
              </div>
              <p style={{ fontSize: '0.94rem', color: 'var(--ws-ink-soft)', lineHeight: 1.6, margin: 0 }}>{a.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* MAPPING MERMAID */}
      <section className="ws-section-wide" id="mapping">
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          The mapping
        </div>
        <h2 className="ws-h2">
          March 17 asks, mapped to{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            March 8, 2027.
          </span>
        </h2>
        <p className="ws-lead">Heavy arrows are direct answers to the brief.</p>
        <p className="ws-lead-tight">Every track converges on the Centennial Speaker Series stage.</p>
        <div className="ws-diagram-wrap">
          <Mermaid chart={TIMELINE_MMD} idPrefix="timeline" />
        </div>
      </section>

      <hr className="ws-rule" />

      {/* PHASE 1 */}
      <section className="ws-section" id="phase-1">
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          Phase 1 · agents for the Head&apos;s desk · 3 weeks
        </div>
        <h2 className="ws-h2">
          Three agents.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            For you.
          </span>{' '}
          Three weeks.
        </h2>
        <p className="ws-lead">You are the pilot user.</p>
        <p className="ws-lead-tight">You feel the architecture daily before any teacher touches it. Roughly 15 hours per week back to your office.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginTop: 40 }}>
          {TIER1.map((a) => (
            <AgentCard key={a.code} a={a} accent="blue" />
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* PHASE 2 */}
      <section className="ws-section" id="phase-2">
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          Phase 2 · agents for the school · summer build
        </div>
        <h2 className="ws-h2">
          Three more agents.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            For Wooster.
          </span>{' '}
          Faculty trained by September.
        </h2>
        <p className="ws-lead">Scoped in June with Pannone and Bazemore.</p>
        <p className="ws-lead-tight">Built July through August. Live for the September required-integration rollout.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginTop: 40 }}>
          {TIER2.map((a) => (
            <AgentCard key={a.code} a={a} accent="green" />
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* ARCHITECTURE */}
      <section className="ws-section-wide" id="architecture">
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          The architecture
        </div>
        <h2 className="ws-h2">
          One system.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            Six agents.
          </span>{' '}
          Wooster-owned data.
        </h2>
        <p className="ws-lead">Data sources on top. Two agent sets in the middle. Outcomes at the bottom.</p>
        <p className="ws-lead-tight">Google Workspace as the tenant. Blackbaud onCampus as the system of record.</p>
        <div className="ws-diagram-wrap">
          <Mermaid chart={ARCH_MMD} idPrefix="arch" />
        </div>
      </section>

      <hr className="ws-rule" />

      {/* BUILD TIMELINE */}
      <section className="ws-section" id="build">
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          Build timeline
        </div>
        <h2 className="ws-h2">
          What happens.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            When.
          </span>
        </h2>
        <p className="ws-lead">Phase 1 is three weeks. Phase 2 is three months.</p>
        <p className="ws-lead-tight">After September, the system iterates on real use until March 8, 2027.</p>

        <div style={{ marginTop: 48 }}>
          <div className="ws-eyebrow" style={{ marginBottom: 18, color: 'var(--ws-navy-deep)' }}>
            Phase 1 · 3 weeks
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {PHASE1_TIMELINE.map((t) => (
              <div key={t.label} className="ws-card">
                <div
                  className="ws-display"
                  style={{ fontSize: '1.5rem', color: 'var(--ws-navy-deep)', margin: '0 0 14px', letterSpacing: '-0.02em' }}
                >
                  {t.label}
                </div>
                <p style={{ fontSize: '0.96rem', color: 'var(--ws-ink-soft)', lineHeight: 1.65, margin: 0 }}>{t.do}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 56 }}>
          <div className="ws-eyebrow" style={{ marginBottom: 18, color: '#166534' }}>
            Phase 2 · summer + fall + winter
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PHASE2_TIMELINE.map((t, i) => (
              <div
                key={t.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr',
                  gap: 24,
                  padding: '24px 0',
                  borderTop: i === 0 ? '1px solid var(--ws-line-strong)' : '1px solid var(--ws-line)',
                  borderBottom: i === PHASE2_TIMELINE.length - 1 ? '1px solid var(--ws-line-strong)' : 'none',
                  alignItems: 'start',
                }}
              >
                <div
                  className="ws-display"
                  style={{ fontSize: '1.32rem', color: '#166534', letterSpacing: '-0.02em' }}
                >
                  {t.label}
                </div>
                <div style={{ fontSize: '0.98rem', color: 'var(--ws-ink)', lineHeight: 1.65 }}>{t.do}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="ws-rule" />

      {/* MEASUREMENT */}
      <section className="ws-section" id="measurement">
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          How to know it is working
        </div>
        <h2 className="ws-h2">
          Five measurements.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            Honest ones.
          </span>
        </h2>
        <p className="ws-lead">Each measurement is something the school can already track.</p>
        <p className="ws-lead-tight">No new dashboards required.</p>

        <div style={{ marginTop: 40 }}>
          {MEASUREMENTS.map((m, i) => (
            <div
              key={m.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '280px 1fr 1fr',
                gap: 28,
                padding: '28px 0',
                borderTop: i === 0 ? '1px solid var(--ws-line-strong)' : '1px solid var(--ws-line)',
                borderBottom: i === MEASUREMENTS.length - 1 ? '1px solid var(--ws-line-strong)' : 'none',
                alignItems: 'start',
              }}
            >
              <div
                className="ws-display"
                style={{ fontSize: '1.22rem', color: 'var(--ws-ink)', letterSpacing: '-0.02em', lineHeight: 1.25 }}
              >
                {m.name}
              </div>
              <div>
                <div className="ws-field-label">How</div>
                <div style={{ fontSize: '0.94rem', color: 'var(--ws-ink-soft)', lineHeight: 1.6, marginTop: 4 }}>{m.how}</div>
              </div>
              <div>
                <div className="ws-field-label">Target</div>
                <div style={{ fontSize: '0.94rem', color: 'var(--ws-ink)', lineHeight: 1.6, marginTop: 4, fontWeight: 500 }}>{m.target}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* HANDOFF */}
      <section className="ws-section" id="handoff">
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          What a builder needs
        </div>
        <h2 className="ws-h2">
          A complete handoff list.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            So this framework is portable.
          </span>
        </h2>
        <p className="ws-lead">If Wooster wants to give this to another builder, here is the checklist.</p>
        <p className="ws-lead-tight">Nothing on it is unusual. All of it is already inside Wooster.</p>

        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {HANDOFF.map((h, i) => (
            <div key={h.item} className="ws-card">
              <div
                className="ws-display"
                style={{ fontSize: '0.82rem', color: 'var(--ws-burgundy)', margin: '0 0 12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}
              >
                #{String(i + 1).padStart(2, '0')}
              </div>
              <div
                className="ws-display"
                style={{ fontSize: '1.18rem', color: 'var(--ws-ink)', margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.3 }}
              >
                {h.item}
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--ws-ink-soft)', lineHeight: 1.6, margin: 0 }}>{h.why}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="ws-rule" />

      {/* PRINCIPLES */}
      <section className="ws-section" id="principles">
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          The four centennial principles
        </div>
        <h2 className="ws-h2">
          1926 to{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-burgundy)' }}>
            2026.
          </span>{' '}
          Same principles. New medium.
        </h2>
        <p className="ws-lead">The four principles Wooster has carried since 1926 are the four design constraints on this framework.</p>
        <p className="ws-lead-tight">The architecture reflects each one.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 40 }}>
          {PRINCIPLES.map((p) => (
            <div key={p.name} className="ws-card">
              <div
                className="ws-display"
                style={{ fontSize: '1.42rem', color: 'var(--ws-burgundy)', margin: '0 0 12px', letterSpacing: '-0.02em', fontStyle: 'italic', fontWeight: 300 }}
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
        <div className="ws-eyebrow" style={{ marginBottom: 20 }}>
          What is already shipping
        </div>
        <h2 className="ws-h2">
          Not theory.{' '}
          <span className="ws-display-italic" style={{ color: 'var(--ws-navy-deep)' }}>
            Receipts.
          </span>
        </h2>
        <p className="ws-lead">The data from what we have already seen, per the offer made in March.</p>
        <p className="ws-lead-tight">Practitioner evidence from the field since our March 17 conversation.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28, marginTop: 40 }}>
          {RECEIPTS.map((r) => (
            <div key={r.source} className="ws-card">
              <div
                className="ws-display"
                style={{ fontSize: '1.08rem', color: 'var(--ws-ink)', lineHeight: 1.5, margin: '0 0 18px', letterSpacing: '-0.01em' }}
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

      {/* CLOSING */}
      <section className="ws-section" id="closing">
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'left' }}>
          <div className="ws-eyebrow" style={{ marginBottom: 28 }}>
            From your alumni letter, Summer 2025
          </div>
          <blockquote
            className="ws-display-italic"
            style={{
              fontSize: 'clamp(2rem, 4.6vw, 3.4rem)',
              lineHeight: 1.15,
              margin: '0 0 24px',
              color: 'var(--ws-navy-deep)',
              borderLeft: '3px solid var(--ws-burgundy)',
              paddingLeft: 28,
            }}
          >
            &ldquo;Plant your feet back on the good earth.&rdquo;
          </blockquote>
          <p style={{ fontSize: '0.86rem', color: 'var(--ws-ink-faint)', letterSpacing: '0.04em', margin: '0 0 48px', paddingLeft: 28 }}>
            — Matt Byrnes
          </p>
          <p style={{ fontSize: '1.12rem', lineHeight: 1.75, color: 'var(--ws-ink-soft)', margin: '0 0 14px', maxWidth: 720 }}>
            This architecture stands on the ground Wooster already stands on.
          </p>
          <p style={{ fontSize: '1.12rem', lineHeight: 1.75, color: 'var(--ws-ink-soft)', margin: '0 0 14px', maxWidth: 720 }}>
            Google Workspace. Blackbaud onCampus. Your alumni database. Your own voice.
          </p>
          <p style={{ fontSize: '1.12rem', lineHeight: 1.75, color: 'var(--ws-ink-soft)', margin: '0 0 14px', maxWidth: 720 }}>
            Nothing imported. Nothing leased. Nothing that can leave when a vendor pivots.
          </p>
          <p style={{ fontSize: '1.12rem', lineHeight: 1.75, color: 'var(--ws-ink-soft)', margin: 0, maxWidth: 720 }}>
            The next 100 years begin from the same earth that built the first.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: 'var(--ws-ink)',
          color: 'rgba(250,248,243,0.65)',
          padding: '40px 28px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.7, margin: '0 0 10px', color: 'rgba(250,248,243,0.78)' }}>
            Drawn for Matt Byrnes on May 11, 2026.
          </p>
          <p style={{ fontSize: '0.78rem', lineHeight: 1.7, margin: 0, color: 'rgba(250,248,243,0.55)' }}>
            Sources: public Wooster centennial page, Summer 2025 alumni letter, HB-07277 testimony, NAIS Independent
            School Magazine 2018-2023, Wooster IRS Form 990 FYE June 2025.
          </p>
        </div>
      </footer>
    </div>
  );
}
