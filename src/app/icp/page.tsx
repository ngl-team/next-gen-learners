import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ideal Client Profile | Next Generation Learners',
  description:
    'The exact buyer Next Generation Learners builds AI for. Domain experts running proven, repeated, high-volume processes with the authority to fix them.',
};

const segments = [
  {
    n: '01',
    title: 'Superintendents and private school heads',
    detail:
      '300+ emails a day. Board prep weekly. Hiring rubrics. Parent communications. PD planning. Strategic plans.',
    anchor: 'Anchor case: Superintendent Christopher Roche, Woodstock Public Schools (CT)',
    marker: 'Comp marker: $175K+, decision authority on $5K–$25K personal or PD reimbursement spend.',
  },
  {
    n: '02',
    title: 'Real estate brokers in $750K+ markets',
    detail:
      'Weekly expired-listing pulls. Skip-tracing. Owner resolution including LLC chains. Kanban pipelines. 24-month lookbacks.',
    anchor: 'Anchor case: Zalen Stason, The Prosperity Group (Wellesley, MA)',
    marker: 'Comp marker: $200K+ commission income. Lead-gen runs as a defined weekly workflow.',
  },
  {
    n: '03',
    title: 'CPAs, attorneys, financial advisors',
    detail:
      'Recurring client document intake. Tax-prep checklists. Partner-letter drafting. Intake call summaries. Independent or small-partner practices.',
    anchor: 'Recognizable shape: 200+ active clients, billed by the hour, owns book of business',
    marker: 'Comp marker: $250K+ partner draw.',
  },
  {
    n: '04',
    title: 'Family-business owners and small CEOs',
    detail:
      'Owner is the bottleneck on hiring, vendor management, customer escalations, internal comms. Has stopped growing because admin eats every hour.',
    anchor: 'Recognizable shape: $1M–$25M revenue, owner-operator, no internal IT or ops team',
    marker: 'Comp marker: 10–50 employees.',
  },
  {
    n: '05',
    title: 'Faith-aligned mission leaders',
    detail:
      'Diocese partnerships. Donor communications. Parishioner triage. Employee benefits roll-outs. Parish business administrators, Catholic CEO/founders, Legatus members.',
    anchor: 'Recognizable shape: leads a faith-mission organization OR runs a private business while serving a Catholic ministry',
    marker: 'Comp marker: institutional or personal authority on $2,500–$5,000 builds.',
  },
];

const disqualifiers = [
  'Committee or board approval required for $5K spend. Public-school RFP cycles. Hospital procurement. Government.',
  'No recurring workflow. "Curious about AI" with no specific weekly process to compound. Send them to ChatGPT and a tutorial.',
  'Wants a SaaS subscription, not a custom build. Direct them to off-the-shelf tools.',
  'Per-seat pricing expectations. Our stack is BYO-key, scraping, or local hosting.',
  'Looking to flip or resell what we build. Single-client artifacts only.',
];

const offerings = [
  {
    name: 'Pilot Single Agent',
    price: '$1,250 founding · $2,500 standard',
    note: 'One workflow. Custom-built. Lives in their environment.',
  },
  {
    name: 'Active Cabinet',
    price: '$2,500–$3,000/m founding · $4,000/m standard',
    note: 'Six agents covering the full operating surface.',
  },
  {
    name: 'Local install (Jarvis)',
    price: '$2,500 founding · $5,000 standard',
    note: 'Persistent memory. Brain dump routing. People files.',
  },
  {
    name: 'Custom builds (agency side)',
    price: 'Project-priced',
    note: 'Hunter (real estate lead-gen) is the prototype.',
  },
];

const credibility = [
  'Signed Superintendent Christopher Roche, Woodstock Public Schools (CT). Summer AI Cabinet build, first agent ships May 7, $14,500 engagement.',
  'Hunter (custom real estate lead-gen tool) shipping for The Prosperity Group, Wellesley MA.',
  'Backed by Chauncey St John (Hallow) and Gary Sheng (Applied AI Society, ex-Google).',
  '18-year-old Babson College student. Founder of Next Generation Learners.',
];

export default function ICPPage() {
  return (
    <div
      style={{
        background: '#FAFAF9',
        color: '#0C0A09',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        minHeight: '100vh',
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .icp-section { page-break-inside: avoid; }
        }
      `}</style>

      {/* Nav */}
      <nav
        className="no-print"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(250,250,249,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(28,25,23,0.08)',
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 880,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <a
            href="https://nextgenerationlearners.com"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#1C1917',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Next Generation Learners
          </a>
          <a
            href="mailto:brayan@nextgenerationlearners.com"
            style={{
              fontSize: '0.85rem',
              color: '#CA8A04',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            brayan@nextgenerationlearners.com
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 880, margin: '0 auto', padding: '96px 24px 64px' }}>
        <div
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#CA8A04',
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          Ideal Client Profile
        </div>
        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 500,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            color: '#1C1917',
            marginBottom: 32,
          }}
        >
          Who we build for, and the question that filters every introduction.
        </h1>
        <p
          style={{
            fontSize: '1.15rem',
            lineHeight: 1.65,
            color: '#44403C',
            maxWidth: 640,
          }}
        >
          A domain expert running a proven, repeated, high-volume process that drains their time, owns their decision authority, and can pay for the lift out of personal or discretionary budget.
        </p>
        <p
          style={{
            fontSize: '0.95rem',
            color: '#78716C',
            marginTop: 16,
            fontStyle: 'italic',
          }}
        >
          Framework: Applied AI Society "ICP Clarity" practitioner playbook.
        </p>
      </section>

      {/* The three signals */}
      <section
        className="icp-section"
        style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px' }}
      >
        <div
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#CA8A04',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          The three qualifying signals
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#1C1917',
            marginBottom: 32,
          }}
        >
          Must hit all three.
        </h2>
        <div style={{ display: 'grid', gap: 20 }}>
          {[
            {
              label: 'Domain expertise',
              body:
                'They know their craft cold. They have run the same process for years, not weeks.',
            },
            {
              label: 'Volume',
              body:
                'The process runs hundreds or thousands of times per year. Not once a quarter. High enough cadence that an AI lift compounds into hours per week back.',
            },
            {
              label: 'Authority',
              body:
                'They can say yes to a $1,250–$5,000 build without a board, a committee, or a procurement cycle. Personal or discretionary budget.',
            },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                background: 'white',
                border: '1px solid rgba(28,25,23,0.08)',
                borderRadius: 16,
                padding: 28,
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#CA8A04',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: '#1C1917',
                  marginBottom: 10,
                }}
              >
                {s.label}
              </h3>
              <p style={{ fontSize: '1rem', lineHeight: 1.65, color: '#44403C' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Segments */}
      <section
        className="icp-section"
        style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px' }}
      >
        <div
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#CA8A04',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Who we serve
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#1C1917',
            marginBottom: 40,
          }}
        >
          Five segments, named.
        </h2>
        <div style={{ display: 'grid', gap: 16 }}>
          {segments.map((s) => (
            <div
              key={s.n}
              style={{
                background: 'white',
                border: '1px solid rgba(28,25,23,0.08)',
                borderRadius: 16,
                padding: 32,
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12 }}>
                <span
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.4rem',
                    color: '#CA8A04',
                    fontWeight: 500,
                  }}
                >
                  {s.n}
                </span>
                <h3
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.4rem',
                    fontWeight: 500,
                    color: '#1C1917',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {s.title}
                </h3>
              </div>
              <p style={{ fontSize: '1rem', lineHeight: 1.65, color: '#44403C', marginBottom: 16 }}>
                {s.detail}
              </p>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#78716C',
                  borderTop: '1px solid rgba(28,25,23,0.06)',
                  paddingTop: 14,
                  display: 'grid',
                  gap: 6,
                }}
              >
                <div>{s.anchor}</div>
                <div>{s.marker}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disqualifiers */}
      <section
        className="icp-section"
        style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px' }}
      >
        <div
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#CA8A04',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Politely route elsewhere
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#1C1917',
            marginBottom: 32,
          }}
        >
          Disqualifying signals.
        </h2>
        <div
          style={{
            background: 'white',
            border: '1px solid rgba(28,25,23,0.08)',
            borderRadius: 16,
            padding: 32,
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 16 }}>
            {disqualifiers.map((d, i) => (
              <li
                key={i}
                style={{
                  paddingLeft: 24,
                  position: 'relative',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: '#44403C',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    color: '#CA8A04',
                    fontWeight: 700,
                  }}
                >
                  ×
                </span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Offerings */}
      <section
        className="icp-section"
        style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px' }}
      >
        <div
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#CA8A04',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          What we deliver
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#1C1917',
            marginBottom: 32,
          }}
        >
          Offerings and price.
        </h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {offerings.map((o) => (
            <div
              key={o.name}
              style={{
                background: 'white',
                border: '1px solid rgba(28,25,23,0.08)',
                borderRadius: 12,
                padding: 24,
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 16,
                alignItems: 'start',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    color: '#1C1917',
                    marginBottom: 6,
                  }}
                >
                  {o.name}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#78716C', lineHeight: 1.5 }}>{o.note}</div>
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#CA8A04',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                }}
              >
                {o.price}
              </div>
            </div>
          ))}
        </div>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#78716C',
            marginTop: 20,
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}
        >
          Industry context: custom AI agent builds run $3,500–$15,000 one-time + $500–$2,250/m maintenance. Founding rates sit at the low end of that range as case-study pricing.
        </p>
      </section>

      {/* The referral question */}
      <section
        className="icp-section"
        style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px' }}
      >
        <div
          style={{
            background: '#1C1917',
            color: '#FAFAF9',
            borderRadius: 24,
            padding: '56px 48px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#CA8A04',
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            How to refer
          </div>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: 400,
              letterSpacing: '-0.015em',
              lineHeight: 1.3,
              color: '#FAFAF9',
              maxWidth: 640,
              margin: '0 auto',
              fontStyle: 'italic',
            }}
          >
            "Is this person running a process they hate, hundreds of times a year, that they have authority to fix on their own?"
          </h2>
          <p
            style={{
              marginTop: 28,
              fontSize: '1rem',
              color: 'rgba(250,250,249,0.7)',
              maxWidth: 480,
              margin: '28px auto 0',
              lineHeight: 1.6,
            }}
          >
            If yes, send them. If no, save the introduction.
          </p>
        </div>
      </section>

      {/* Credibility */}
      <section
        className="icp-section"
        style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px' }}
      >
        <div
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#CA8A04',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Anchors for credibility
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#1C1917',
            marginBottom: 32,
          }}
        >
          Drop these in any introduction.
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
          {credibility.map((c, i) => (
            <li
              key={i}
              style={{
                paddingLeft: 32,
                position: 'relative',
                fontSize: '1.02rem',
                lineHeight: 1.6,
                color: '#44403C',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  fontFamily: "'Fraunces', Georgia, serif",
                  color: '#CA8A04',
                  fontWeight: 500,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {c}
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer
        style={{
          maxWidth: 880,
          margin: '0 auto',
          padding: '64px 24px 96px',
          textAlign: 'center',
          borderTop: '1px solid rgba(28,25,23,0.08)',
          marginTop: 40,
        }}
      >
        <div
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '1.4rem',
            color: '#1C1917',
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          Brayan Tenesaca
        </div>
        <div style={{ fontSize: '0.9rem', color: '#78716C', marginBottom: 20 }}>
          Founder, Next Generation Learners
        </div>
        <a
          href="mailto:brayan@nextgenerationlearners.com"
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: '#1C1917',
            color: '#FAFAF9',
            borderRadius: 12,
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          brayan@nextgenerationlearners.com
        </a>
      </footer>
    </div>
  );
}
