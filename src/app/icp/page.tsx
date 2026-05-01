import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Who we build for | Next Generation Learners',
  description:
    'Custom AI for people running a proven, repeated, high-volume process they hate. Three sections: what we have done, who we work with, the pains we take off their plate.',
};

const segments = [
  {
    label: 'Superintendents and private school heads',
    pain:
      'You wake up to 300 unread emails before your first call. Board prep eats Sunday night. By the time you finish the parent escalations, you have not made a single strategic decision. Your team has stopped bringing you problems because they know you are buried.',
    fix:
      'Email Voice Agent that drafts replies in your voice. Cabinet that handles board prep, hiring rubrics, parent communications, PD planning. Lives in your tenant. Your data never leaves.',
    proof: 'Building this right now for Superintendent Christopher Roche, Woodstock Public Schools (CT). First agent ships May 7.',
  },
  {
    label: 'Real estate brokers in $750K+ markets',
    pain:
      'Saturday mornings are MLS pulls. Sunday is skip-tracing. You spend more hours owning your lead-gen process than you do in front of buyers. Spokeo lapsed last month because you ran out of time to manage the subscription.',
    fix:
      'Custom lead-gen tool: weekly expired-listing pulls, owner resolution including LLC chains, skip-tracing with grandkids included, kanban pipeline that auto-advances on outreach result. You wake up Monday to 100 leads, not a workflow.',
    proof: 'Hunter, shipping for Zalen Stason, The Prosperity Group (Wellesley, MA).',
  },
  {
    label: 'CPAs, attorneys, financial advisors',
    pain:
      'Tax season is fourteen-hour days. You bill seventy hours a month on intake, document prep, and partner letters that AI could draft in two minutes. Your strategic clients get whatever attention you have left, which is none.',
    fix:
      'Document intake agent. Partner-letter drafter trained on your voice. Intake-call summarizer. Recurring-client checklist automation. Your hours go back to the strategic work that actually compounds your book.',
    proof: 'Buildable on the same architecture as the superintendent Cabinet.',
  },
  {
    label: 'Family-business owners and small CEOs',
    pain:
      'You are the bottleneck. Hiring, vendor calls, customer escalations, internal comms. You stopped growing eighteen months ago because every new dollar created two new tasks for you personally. You cannot delegate what you cannot document.',
    fix:
      'AI agents that absorb the parts of your job no one else can do yet. Vendor follow-up, customer triage, hiring intake, weekly all-hands prep. Documents your tribal knowledge into prompts your team can run.',
    proof: 'Same agency stack used to build custom tools for our retainer clients.',
  },
  {
    label: 'Faith-aligned mission leaders',
    pain:
      'Donor communications eat the hours you wanted for ministry. Diocese coordination is in spreadsheets and email threads. You came into this work to serve people, and now you serve email.',
    fix:
      'Donor outreach drafted in your voice. Parishioner triage that flags the urgent and drafts the rest. Mission-aligned tools built by someone who shares the why.',
    proof:
      'Backed by Chauncey St John (Hallow) and Gary Sheng (Applied AI Society, ex-Google).',
  },
];

const wins = [
  'Signed Superintendent Christopher Roche, Woodstock Public Schools (CT). $14,500 summer Cabinet engagement. First agent ships May 7.',
  'Hunter (custom real estate lead-gen tool) shipping for The Prosperity Group, Wellesley MA.',
  'Backed by Chauncey St John (Hallow) and Gary Sheng (Applied AI Society, ex-Google).',
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
      <section style={{ maxWidth: 880, margin: '0 auto', padding: '96px 24px 48px' }}>
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
          Who we build for
        </div>
        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 500,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            color: '#1C1917',
            marginBottom: 28,
          }}
        >
          Custom AI for people running a process they hate, hundreds of times a year.
        </h1>
        <p
          style={{
            fontSize: '1.15rem',
            lineHeight: 1.65,
            color: '#44403C',
            maxWidth: 660,
          }}
        >
          We build for domain experts with proven, high-volume work and the authority to fix it themselves. Not committees. Not curious shoppers. Operators who feel the cost of their own admin every week.
        </p>
      </section>

      {/* Section 1: Who we are + what we've done */}
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
          01 — Who we are, what we have done
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#1C1917',
            marginBottom: 28,
            lineHeight: 1.15,
          }}
        >
          A two-person agency that ships custom AI in days, not quarters.
        </h2>
        <div
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.7,
            color: '#44403C',
            display: 'grid',
            gap: 18,
            marginBottom: 36,
          }}
        >
          <p>
            Next Generation Learners is run by Brayan Tenesaca, an 18-year-old Babson College founder, and his co-founder Ryan Vincent. We started by running AI literacy programs in Connecticut libraries and schools. We pivoted to building custom AI agents and operating systems for people whose time is too expensive to keep losing to admin.
          </p>
          <p>
            Our edge is speed and specificity. We do not sell a SaaS subscription. We do not run a long discovery cycle. We meet you, listen, and ship a working tool inside two weeks that lives in your environment, on your data, in your voice.
          </p>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
          {wins.map((w, i) => (
            <li
              key={i}
              style={{
                paddingLeft: 32,
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
                  fontFamily: "'Fraunces', Georgia, serif",
                  color: '#CA8A04',
                  fontWeight: 500,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {w}
            </li>
          ))}
        </ul>
      </section>

      {/* Section 2: Who we like to work with */}
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
          02 — Who we like to work with
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#1C1917',
            marginBottom: 28,
            lineHeight: 1.15,
          }}
        >
          Three signals. All three required.
        </h2>
        <div style={{ display: 'grid', gap: 16, marginBottom: 40 }}>
          {[
            {
              label: 'Domain expertise',
              body: 'They know their craft cold. Years, not weeks.',
            },
            {
              label: 'Volume',
              body:
                'The process runs hundreds or thousands of times per year. Cadence high enough that an AI lift compounds into hours per week back.',
            },
            {
              label: 'Authority',
              body:
                'They can say yes to a $1,250 to $5,000 build without a board, a committee, or a procurement cycle.',
            },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                background: 'white',
                border: '1px solid rgba(28,25,23,0.08)',
                borderRadius: 14,
                padding: 24,
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 20,
                alignItems: 'baseline',
              }}
            >
              <div
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.4rem',
                  color: '#CA8A04',
                  fontWeight: 500,
                  minWidth: 36,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: '#1C1917',
                    marginBottom: 6,
                  }}
                >
                  {s.label}
                </div>
                <div style={{ fontSize: '0.98rem', lineHeight: 1.6, color: '#44403C' }}>
                  {s.body}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            background: '#1C1917',
            color: '#FAFAF9',
            borderRadius: 20,
            padding: '40px 36px',
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
              marginBottom: 18,
            }}
          >
            The single referral question
          </div>
          <p
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(1.3rem, 2.8vw, 1.7rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.4,
              maxWidth: 640,
              margin: '0 auto',
            }}
          >
            "Is this person running a process they hate, hundreds of times a year, that they have authority to fix on their own?"
          </p>
          <p
            style={{
              marginTop: 22,
              fontSize: '0.95rem',
              color: 'rgba(250,250,249,0.7)',
            }}
          >
            If yes, send them. If no, save the introduction.
          </p>
        </div>
      </section>

      {/* Section 3: How we can help — pain heavy */}
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
          03 — How we can help
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#1C1917',
            marginBottom: 16,
            lineHeight: 1.15,
          }}
        >
          The pains we take off their plate.
        </h2>
        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.65,
            color: '#44403C',
            marginBottom: 40,
            maxWidth: 660,
          }}
        >
          Read these out loud. If you recognize someone in the pain, they are who we build for.
        </p>
        <div style={{ display: 'grid', gap: 24 }}>
          {segments.map((s, i) => (
            <div
              key={s.label}
              style={{
                background: 'white',
                border: '1px solid rgba(28,25,23,0.08)',
                borderRadius: 18,
                padding: 32,
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
                  marginBottom: 10,
                }}
              >
                {String(i + 1).padStart(2, '0')} — {s.label}
              </div>
              <p
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  color: '#1C1917',
                  marginBottom: 22,
                  letterSpacing: '-0.005em',
                }}
              >
                {s.pain}
              </p>
              <div
                style={{
                  borderTop: '1px solid rgba(28,25,23,0.08)',
                  paddingTop: 20,
                  display: 'grid',
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#78716C',
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    What we build
                  </div>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#44403C' }}>{s.fix}</p>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#78716C',
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    Proof
                  </div>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#44403C' }}>
                    {s.proof}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p
          style={{
            fontSize: '0.9rem',
            color: '#78716C',
            marginTop: 32,
            fontStyle: 'italic',
            lineHeight: 1.6,
            maxWidth: 660,
          }}
        >
          Pricing for context: a single-agent Pilot starts at $1,250 founding rate. A full operating Cabinet runs $2,500 to $3,000 a month. Custom agency builds are project-priced. Industry standard for this kind of work is $3,500 to $15,000 plus monthly maintenance. We sit at the low end while we stack case studies.
        </p>
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
