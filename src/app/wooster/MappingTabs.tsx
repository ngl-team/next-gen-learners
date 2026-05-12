'use client';

import { useState } from 'react';
import Mermaid from './Mermaid';

const MAPPING_1 = `flowchart LR
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

const MAPPING_2 = `flowchart LR
  subgraph NOW["MAY 2026 — TODAY"]
    direction TB
    N1["Bridge program<br/>language-based LD support"]
    N2["DLI tutorial method<br/>independent inquiry, grades 10-12"]
    N3["Equity &amp; Justice Center<br/>est. 2021"]
    N4["100-year track record"]
  end
  subgraph Y1["YEAR 101 — CENTENNIAL (Sep 2026 to May 2027)"]
    direction TB
    Y1A["Sep 2026<br/>Required AI grades 5-12 launches<br/>with W1 prompt library"]
    Y1B["Oct 2 + Dec 1 2026<br/>Speaker series parts 1-3<br/>(Teachers, History, State of School)"]
    Y1C["Mar 8, 2027<br/>'AI at Wooster' on stage<br/>Speaker Series Part 4"]
    Y1D["May 8, 2027<br/>'Wooster's Impact on the World'<br/>Speaker Series Part 5"]
  end
  subgraph Y2["YEAR 102 (2027-2028)"]
    direction TB
    Y2A["Prompt library in new-faculty onboarding"]
    Y2B["Bridge documentation pattern shared with Fairchester peers"]
    Y2C["NAIS / CAIS case study published"]
    Y2D["E&amp;J Center extends Witness Stones research with W1"]
  end
  subgraph Y3["YEAR 103 (2028-2029)"]
    direction TB
    Y3A["Wooster hosts Fairchester AI convening"]
    Y3B["Students graduate fluent in agent design"]
    Y3C["Variable Tuition enrollment lift visible"]
    Y3D["Wooster cited at NAIS national"]
  end
  N1 ==> Y1A
  N2 ==> Y1A
  N4 ==> Y1B
  Y1A ==> Y1C
  Y1B ==> Y1C
  Y1C ==> Y1D
  Y1A ==> Y2A
  Y1D ==> Y2C
  Y2A ==> Y3A
  Y2B ==> Y3A
  Y2C ==> Y3D
  Y2D ==> Y3B
  classDef now fill:#e0e7ff,stroke:#3730a3,color:#000
  classDef y1 fill:#fecaca,stroke:#991b1b,color:#000
  classDef y2 fill:#dcfce7,stroke:#166534,color:#000
  classDef y3 fill:#fef3c7,stroke:#92400e,color:#000
  class N1,N2,N3,N4 now
  class Y1A,Y1B,Y1C,Y1D y1
  class Y2A,Y2B,Y2C,Y2D y2
  class Y3A,Y3B,Y3C,Y3D y3`;

type LegendGroup = {
  swatch: string;
  swatchBorder: string;
  label: string;
  blurb: string;
  items: { code: string; def: string }[];
};

const LEGEND_1: LegendGroup[] = [
  {
    swatch: '#fde68a',
    swatchBorder: '#92400e',
    label: 'March 17 asks (yellow)',
    blurb: 'The five items you put on the table in your office.',
    items: [
      { code: 'M1', def: 'Required AI grades 5-12. Move from optional to required across upper grades.' },
      { code: 'M2', def: 'Frictionless for teachers. AI lives in the tools they already use. No new PD load.' },
      { code: 'M3', def: 'Design AND implement. A builder who ships, not just a consultant who scopes.' },
      { code: 'M4', def: 'Pilots at grades 5, 8, 10, 12. Specific grade-level proof points.' },
      { code: 'M5', def: 'Pay-per-school. Wooster owns the framework. No per-user vendor lock-in.' },
    ],
  },
  {
    swatch: '#dbeafe',
    swatchBorder: '#1e3a8a',
    label: 'Phase 1 agents (blue, for the Head)',
    blurb: 'Three agents on your desk in three weeks. You feel the architecture daily before any teacher touches it.',
    items: [
      { code: 'P1', def: 'Memo writer in your voice. Drafts board memos, donor letters, and stewardship notes from a few bullets.' },
      { code: 'P2', def: 'Parent + crisis email co-pilot. Drafts high-stakes emails in a warm, partnership-first tone.' },
      { code: 'P3', def: 'Daily briefing agent. Reads NAIS, CAIS, EdWeek, CT legislature, and peer schools each morning. Returns 5 bullets.' },
    ],
  },
  {
    swatch: '#dcfce7',
    swatchBorder: '#166534',
    label: 'Phase 2 agents (green, for the school)',
    blurb: 'Three agents for Wooster across the summer. Faculty trained by September.',
    items: [
      {
        code: 'W1',
        def: 'DLI prompt library. A curated set of vetted AI prompts faculty paste into the tools they already use, mapped to the Deep Learning Initiative tutorial method. Wooster owns every prompt and edits them each term. This is what makes "required AI" actually frictionless.',
      },
      {
        code: 'W2',
        def: 'Bridge documentation agent. Drafts a weekly per-student progress narrative for the Bridge cohort and produces the parent letter. Defends the Bridge premium with consistent, on-time communication.',
      },
      {
        code: 'W4',
        def: 'Centennial advancement agent. Personalizes alumni outreach during the centennial year and gives the Head a one-page brief before every donor meeting.',
      },
    ],
  },
  {
    swatch: '#fecaca',
    swatchBorder: '#991b1b',
    label: 'The stage (red)',
    blurb: 'Where every agent converges.',
    items: [
      {
        code: 'STG',
        def: 'March 8, 2027 — Speaker Series Part Four, "AI at Wooster." The story is not a vendor pitch. It is six agents, ten months of real use, and metrics Wooster owns.',
      },
    ],
  },
];

const LEGEND_2: LegendGroup[] = [
  {
    swatch: '#e0e7ff',
    swatchBorder: '#3730a3',
    label: 'May 2026 — today (purple)',
    blurb: 'What Wooster already has. The architecture attaches to these. It does not replace them.',
    items: [
      { code: 'N1', def: 'Bridge program. Personalized support for students with language-based learning differences. Joulé Bazemore directs.' },
      { code: 'N2', def: 'Deep Learning Initiative (DLI). Oxford tutorial-style independent inquiry courses for grades 10-12.' },
      { code: 'N3', def: 'Equity & Justice Center. Seven-pillar commitment established 2021. Joulé Bazemore directs.' },
      { code: 'N4', def: '100-year track record. The trust capital that lets Wooster move on AI without losing its center.' },
    ],
  },
  {
    swatch: '#fecaca',
    swatchBorder: '#991b1b',
    label: 'Year 101 — centennial year (red)',
    blurb: 'September 2026 through May 2027. The first year AI lives in the building, anchored by the five-part Speaker Series.',
    items: [
      { code: 'Y1A', def: 'September 2026. Required AI grades 5-12 launches alongside the W1 prompt library. Faculty trained over the summer.' },
      { code: 'Y1B', def: 'October 2 + December 1, 2026. Speaker series parts 1-3 (Teachers Then and Now, History of Wooster, State of Our School) prime the community for the AI conversation.' },
      { code: 'Y1C', def: 'March 8, 2027. "AI at Wooster," Speaker Series Part 4. Byrnes on stage with six agents, ten months of use, and metrics.' },
      { code: 'Y1D', def: 'May 8, 2027. "Wooster\'s Impact on the World," Speaker Series Part 5. The centennial closes with the AI work as one chapter of a larger 100-year story.' },
    ],
  },
  {
    swatch: '#dcfce7',
    swatchBorder: '#166534',
    label: 'Year 102 — the harvest year (green)',
    blurb: '2027-2028 academic year. Wooster goes from doing AI to teaching others how.',
    items: [
      { code: 'Y2A', def: 'Prompt library moves from rollout to standard new-faculty onboarding. Every new teacher inherits the system on day one.' },
      { code: 'Y2B', def: 'Bridge documentation pattern shared with Fairchester peers. Wooster becomes the reference implementation in the consortium.' },
      { code: 'Y2C', def: 'NAIS / CAIS case study published. Wooster is cited as the example, not the audience.' },
      { code: 'Y2D', def: 'Equity & Justice Center extends Witness Stones research using the prompt library. The architecture serves the school\'s justice work directly.' },
    ],
  },
  {
    swatch: '#fef3c7',
    swatchBorder: '#92400e',
    label: 'Year 103 — regional leadership (yellow)',
    blurb: '2028-2029 academic year. Wooster as the convener.',
    items: [
      { code: 'Y3A', def: 'Wooster hosts the Fairchester AI convening. Other heads come here for the playbook.' },
      { code: 'Y3B', def: 'First cohort graduates fluent in agent design, not just usage. A measurable Wooster differentiator on the college side.' },
      { code: 'Y3C', def: 'Variable Tuition Program enrollment lift becomes visible. The AI work translates into accessibility, not just efficiency.' },
      { code: 'Y3D', def: 'Wooster cited at NAIS national. The 101st year story is no longer aspiration.' },
    ],
  },
];

const TABS = [
  { id: 'now' as const, label: 'Mapping 1', sub: 'The brief, on stage' },
  { id: 'arc' as const, label: 'Mapping 2', sub: 'The three-year arc' },
];

function LegendBlock({ groups }: { groups: LegendGroup[] }) {
  return (
    <div style={{ marginTop: 40 }}>
      <div className="ws-eyebrow" style={{ marginBottom: 18 }}>
        How to read this diagram
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {groups.map((g) => (
          <div key={g.label} className="ws-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: 14,
                  height: 14,
                  background: g.swatch,
                  border: `1.5px solid ${g.swatchBorder}`,
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              />
              <div
                className="ws-display"
                style={{
                  fontSize: '1.12rem',
                  color: 'var(--ws-ink)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                }}
              >
                {g.label}
              </div>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--ws-ink-soft)', lineHeight: 1.6, margin: '0 0 16px' }}>
              {g.blurb}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {g.items.map((it) => (
                <div key={it.code} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      letterSpacing: '0.06em',
                      color: 'var(--ws-navy-deep)',
                      background: 'var(--ws-navy-tint)',
                      padding: '3px 8px',
                      borderRadius: 999,
                      flexShrink: 0,
                      minWidth: 42,
                      textAlign: 'center',
                    }}
                  >
                    {it.code}
                  </span>
                  <span style={{ fontSize: '0.92rem', color: 'var(--ws-ink-soft)', lineHeight: 1.55 }}>{it.def}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MappingTabs() {
  const [tab, setTab] = useState<'now' | 'arc'>('now');
  const chart = tab === 'now' ? MAPPING_1 : MAPPING_2;
  const idPrefix = tab === 'now' ? 'map-now' : 'map-arc';
  const legend = tab === 'now' ? LEGEND_1 : LEGEND_2;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Mapping diagrams"
        style={{
          display: 'inline-flex',
          gap: 6,
          padding: 6,
          background: '#FFFFFF',
          border: '1px solid var(--ws-line)',
          borderRadius: 999,
          marginBottom: 28,
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              style={{
                appearance: 'none',
                border: 'none',
                background: active ? 'var(--ws-ink)' : 'transparent',
                color: active ? '#FAF8F3' : 'var(--ws-ink-soft)',
                padding: '12px 22px',
                borderRadius: 999,
                fontSize: '0.92rem',
                fontWeight: 500,
                letterSpacing: '0.01em',
                cursor: 'pointer',
                transition: 'background 200ms ease, color 200ms ease',
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
              }}
            >
              <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>{t.label}</span>
              <span style={{ fontSize: '0.82rem', color: active ? 'rgba(250,248,243,0.7)' : 'var(--ws-ink-faint)' }}>
                {t.sub}
              </span>
            </button>
          );
        })}
      </div>

      <div className="ws-diagram-wrap">
        <Mermaid chart={chart} idPrefix={idPrefix} />
      </div>

      <LegendBlock groups={legend} />
    </div>
  );
}
