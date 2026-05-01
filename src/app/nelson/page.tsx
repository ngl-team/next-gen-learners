import type { Metadata } from 'next';
import Reveal from '../danburyhackerspace/Reveal';
import Counter from '../danburyhackerspace/Counter';
import SplitWords from './SplitWords';

export const metadata: Metadata = {
  title: 'Nelson Merchan. Greater Danbury’s entry point for entrepreneurs.',
  description:
    'Nelson Merchan is a Business Advisor with the Connecticut Small Business Development Center. For more than a decade, he has been the first call entrepreneurs in Danbury, Ridgefield, New Milford, and Southbury make when they want to build something real.',
  openGraph: {
    title: 'Nelson Merchan',
    description:
      'For more than a decade, Greater Danbury’s entrepreneurs have started with one phone call. This is his.',
    images: ['/nelson-merchan.jpg'],
  },
};

const ROLES = [
  { org: 'CT Small Business Development Center', role: 'Business Advisor', sub: 'University of Connecticut. Greater Danbury, Ridgefield, New Milford, Southbury corridor.' },
  { org: 'CLICROI, LLC', role: 'Founder', sub: 'Hispanic online marketing. Founded 2006.' },
  { org: 'Western CT SCORE Chapter', role: 'Former Chairman', sub: 'Volunteer counselor since 2010.' },
  { org: 'Housatonic Habitat for Humanity', role: 'Board of Directors', sub: 'Workforce housing in Greater Danbury.' },
  { org: 'WCSU Foundation', role: 'Board Member', sub: 'Western Connecticut State University.' },
  { org: 'Friends of the Danbury Library', role: 'Co-President', sub: 'Civic stewardship of the library that hosts the city’s innovation center.' },
];

const TESTIMONIALS = [
  {
    quote: 'The advisor Nelson Merchan didn’t just step in as an advisor; he became a mentor who genuinely cared about our goals and our journey.',
    name: 'Dominika Smaga',
    role: 'Owner, Rehydrate IV Infusion',
    where: 'Shelton, CT',
  },
  {
    quote: 'Nelson is a very attentive and trusted business advisor. He’s my go-to person for every business decision I’d like to bounce off of from an experienced and empathetic advisor.',
    name: 'Neviana Zhgaba',
    role: 'Co-Owner, Aquila’s Nest Vineyards',
    where: 'Sandy Hook, CT',
  },
  {
    quote: 'The SBDC and Nelson Merchan have been an integral factor in the success of our company. Receiving great quality advice, even before we launched, allowed us to create an intelligent and comprehensive business plan that works.',
    name: 'Michael Sauvageau',
    role: 'Founder, Noteworthy Chocolates',
    where: 'Bethel, CT',
  },
  {
    quote: 'Our local CTSBDC contact, Nelson Merchan, is an energetic, thoughtful and well-informed resource for our business. Always enthusiastic, with constant information and support for starting successful businesses.',
    name: 'Jim Barber',
    role: 'Co-Founder, Luke’s Toy Factory',
    where: 'Danbury, CT',
  },
  {
    quote: 'A mind expander who applies success stories from various companies and maintains wide contacts with state resources.',
    name: 'Martha Yaney',
    role: 'Vista Group International',
    where: 'Norwalk, CT',
  },
  {
    quote: 'Nelson’s knowledge and love of the Greater Danbury community shows up in every meeting. Ideas, connections, information, and encouragement.',
    name: 'Andrea Gartner',
    role: 'Owner, Pour Me Coffee & Wine Café',
    where: 'Danbury, CT',
  },
];

const RECOGNITION = [
  { year: '2025', body: 'Hispanic Innovators Honoree', org: 'Westfair Business Journal' },
  { year: '2024', body: 'Community Impact Leaders Award', org: 'KeyBank' },
  { year: '2013', body: 'Connecticut Home-Based Business Champion', org: 'U.S. Small Business Administration' },
];

const SERVICES = [
  {
    label: 'Start it right',
    body: 'Business plan review, market validation, and the unglamorous structural decisions that decide whether a company survives year three.',
  },
  {
    label: 'Fund it',
    body: 'Loan and grant guidance. Banker introductions. The quiet preparation that turned a vineyard pitch into a $190,000 financing package and 29 jobs.',
  },
  {
    label: 'Grow it',
    body: 'Marketing strategy, social media, export pathways, and the kind of long-arc mentorship that lasts a decade after the first meeting.',
  },
];

export default function NelsonMerchanPage() {
  return (
    <div
      style={{
        background: '#FAFAF9',
        color: '#1C1917',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..900,0..100&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        :root {
          --nm-cream: #FAFAF9;
          --nm-paper: #F5F5F4;
          --nm-line: rgba(28,25,23,0.08);
          --nm-line-strong: rgba(28,25,23,0.16);
          --nm-ink: #1C1917;
          --nm-ink-soft: #57534E;
          --nm-ink-faint: #78716C;
          --nm-gold: #CA8A04;
          --nm-gold-deep: #854D0E;
          --nm-gold-tint: rgba(202,138,4,0.10);
        }

        .nm-display {
          font-family: 'Fraunces', 'Times New Roman', serif;
          font-weight: 400;
          letter-spacing: -0.035em;
          font-feature-settings: "ss01", "ss02";
        }
        .nm-display-italic {
          font-family: 'Fraunces', 'Times New Roman', serif;
          font-style: italic;
          font-weight: 300;
          letter-spacing: -0.03em;
        }
        .nm-eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-weight: 500;
          color: var(--nm-ink-faint);
        }

        @keyframes nm-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes nm-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes nm-blob-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-20px) scale(1.08); } }
        @keyframes nm-blob-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,30px) scale(1.06); } }
        @keyframes nm-pulse-dot { 0%,100% { opacity: 0.85; } 50% { opacity: 1; } }
        @keyframes nm-rule-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes nm-rule-grow-x { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }
        @keyframes nm-ken-burns {
          0% { transform: scale(1.0) translate(0, 0); }
          100% { transform: scale(1.06) translate(-1.2%, -0.8%); }
        }
        @keyframes nm-photo-sweep {
          0% { transform: translateX(-130%) skewX(-14deg); opacity: 0; }
          22% { opacity: 1; }
          100% { transform: translateX(160%) skewX(-14deg); opacity: 0; }
        }
        @keyframes nm-photo-frame-in {
          from { opacity: 0; clip-path: inset(0 0 100% 0); }
          to { opacity: 1; clip-path: inset(0 0 0 0); }
        }
        @keyframes nm-meta-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes nm-dark-sweep {
          0% { transform: translateX(-100%) skewX(-12deg); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateX(180%) skewX(-12deg); opacity: 0; }
        }

        .nm-hero-eyebrow { animation: nm-meta-in 600ms cubic-bezier(0.22, 1, 0.36, 1) 40ms both; }
        .nm-hero-tag { animation: nm-meta-in 700ms cubic-bezier(0.22, 1, 0.36, 1) 460ms both; }
        .nm-hero-meta { animation: nm-meta-in 700ms cubic-bezier(0.22, 1, 0.36, 1) 600ms both; }
        .nm-hero-rule {
          transform-origin: left;
          animation: nm-rule-grow 800ms cubic-bezier(0.22, 1, 0.36, 1) 540ms both;
        }
        .nm-hero-photo-frame {
          animation: nm-photo-frame-in 900ms cubic-bezier(0.7, 0, 0.2, 1) 140ms both;
        }
        .nm-hero-photo-img {
          animation: nm-ken-burns 14s ease-in-out 800ms infinite alternate;
        }
        .nm-hero-photo-sweep {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(252,211,77,0.55) 50%, transparent 70%);
          mix-blend-mode: screen;
          animation: nm-photo-sweep 1200ms cubic-bezier(0.7, 0, 0.2, 1) 380ms 1 both;
          pointer-events: none;
          z-index: 4;
        }

        .nm-link {
          color: var(--nm-ink);
          text-decoration: none;
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 100% 1px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          transition: color 200ms ease, background-size 250ms ease;
        }
        .nm-link:hover { color: var(--nm-gold-deep); }

        .nm-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 28px;
          background: var(--nm-ink);
          color: var(--nm-cream);
          border-radius: 999px;
          font-size: 0.92rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: background 220ms ease, transform 220ms ease, box-shadow 220ms ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .nm-btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 35%, rgba(252,211,77,0.35) 50%, transparent 65%);
          transform: translateX(-110%) skewX(-14deg);
          transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nm-btn-primary:hover {
          background: var(--nm-gold-deep);
          transform: translateY(-1px);
          box-shadow: 0 14px 30px -10px rgba(133,77,14,0.35);
        }
        .nm-btn-primary:hover::after {
          transform: translateX(120%) skewX(-14deg);
        }

        .nm-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 26px;
          background: transparent;
          color: var(--nm-ink);
          border: 1px solid var(--nm-line-strong);
          border-radius: 999px;
          font-size: 0.92rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          text-decoration: none;
          transition: background 220ms ease, border-color 220ms ease;
          cursor: pointer;
        }
        .nm-btn-ghost:hover {
          background: var(--nm-paper);
          border-color: var(--nm-ink);
        }

        .nm-card {
          background: #FFFFFF;
          border: 1px solid var(--nm-line);
          border-radius: 16px;
          padding: 28px;
          transition: border-color 320ms ease, box-shadow 320ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nm-card:hover {
          border-color: var(--nm-line-strong);
          box-shadow: 0 24px 40px -24px rgba(28,25,23,0.18);
          transform: translateY(-3px);
        }

        .nm-quote-card {
          background: #FFFFFF;
          border: 1px solid var(--nm-line);
          border-radius: 18px;
          padding: 32px;
          position: relative;
          transition: border-color 320ms ease, box-shadow 320ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nm-quote-card:hover {
          border-color: rgba(202,138,4,0.45);
          box-shadow: 0 28px 50px -28px rgba(202,138,4,0.28);
          transform: translateY(-3px);
        }
        .nm-quote-card::before {
          content: "“";
          position: absolute;
          top: 8px;
          left: 22px;
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 5rem;
          line-height: 1;
          color: var(--nm-gold);
          opacity: 0.22;
          pointer-events: none;
        }

        .nm-rule { display: block; height: 1px; background: var(--nm-line); border: 0; }

        .nm-section { max-width: 1140px; margin: 0 auto; padding: 88px 28px; }
        .nm-section-tight { max-width: 1140px; margin: 0 auto; padding: 56px 28px; }

        .nm-section-h {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: clamp(2.2rem, 4.6vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -0.035em;
          color: var(--nm-ink);
          margin: 0 0 18px;
        }
        .nm-section-lead {
          font-size: 1.06rem;
          line-height: 1.7;
          color: var(--nm-ink-soft);
          max-width: 640px;
          margin: 0 0 48px;
        }

        .nm-grid-overlay {
          background-image:
            linear-gradient(var(--nm-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--nm-line) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        .nm-rec-row {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: 24px;
          padding: 28px 0;
          align-items: baseline;
        }
        .nm-contact-row {
          display: grid;
          grid-template-columns: 90px 1fr;
          gap: 18px;
          padding: 14px 0;
          align-items: baseline;
        }
        .nm-contact-value { word-break: break-word; overflow-wrap: anywhere; }

        .nm-dark-block { position: relative; }
        .nm-dark-block::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 35%, rgba(252,211,77,0.18) 50%, transparent 65%);
          transform: translateX(-110%) skewX(-12deg);
          pointer-events: none;
          z-index: 1;
        }
        .nm-dark-block.is-in::after {
          animation: nm-dark-sweep 2200ms cubic-bezier(0.7, 0, 0.2, 1) 200ms 1 both;
        }

        .nm-headline-stack { display: block; }
        .nm-headline-stack > * { display: block; }

        @media (max-width: 880px) {
          .nm-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: left !important; }
          .nm-hero-photo-wrap { order: -1; max-width: 320px !important; margin: 0 !important; }
          .nm-hero-meta-row { grid-template-columns: 1fr !important; }
          .nm-section { padding: 64px 22px !important; }
          .nm-section-tight { padding: 40px 22px !important; }
          .nm-cta-stack { flex-direction: column !important; align-items: stretch !important; }
          .nm-cta-stack > * { justify-content: center; }
        }
        @media (max-width: 640px) {
          .nm-rec-row {
            grid-template-columns: 1fr;
            gap: 6px;
            padding: 22px 0;
          }
          .nm-rec-row .nm-rec-org { text-align: left !important; min-width: 0 !important; }
          .nm-contact-row { grid-template-columns: 1fr; gap: 4px; padding: 12px 0; }
          .nm-contact-row .nm-contact-key { font-size: 0.62rem; }
          .nm-contact-value { font-size: 0.92rem !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .nm-hero-eyebrow, .nm-hero-tag, .nm-hero-meta, .nm-hero-rule, .nm-hero-photo-frame, .nm-hero-photo-img, .nm-hero-photo-sweep, .nm-dark-block.is-in::after { animation: none !important; }
          .nm-hero-photo-sweep { display: none !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden="true"
          className="nm-grid-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.5,
            maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at top, black 30%, transparent 75%)',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-220px',
            right: '-140px',
            width: 540,
            height: 540,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(202,138,4,0.18), transparent 65%)',
            filter: 'blur(60px)',
            animation: 'nm-blob-a 22s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-260px',
            left: '-160px',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(133,77,14,0.10), transparent 65%)',
            filter: 'blur(70px)',
            animation: 'nm-blob-b 26s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '120px 28px 80px' }}>
          <div
            className="nm-hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.25fr 1fr',
              alignItems: 'center',
              gap: 64,
            }}
          >
            <div>
              <div
                className="nm-hero-eyebrow"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 28,
                  padding: '8px 16px',
                  border: '1px solid var(--nm-line)',
                  borderRadius: 999,
                  background: '#FFFFFF',
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: 'var(--nm-gold)',
                    animation: 'nm-pulse-dot 2.4s ease-in-out infinite',
                  }}
                />
                <span className="nm-eyebrow" style={{ color: 'var(--nm-ink)' }}>
                  Greater Danbury &middot; Western Connecticut
                </span>
              </div>

              <div className="nm-headline-stack" style={{ marginBottom: 24 }}>
                <SplitWords
                  as="h1"
                  className="nm-display"
                  style={{
                    fontSize: 'clamp(3.4rem, 8.4vw, 6.6rem)',
                    lineHeight: 0.95,
                    margin: 0,
                    color: 'var(--nm-ink)',
                  }}
                  baseDelay={60}
                  perWordDelay={70}
                  duration={760}
                  triggerOnLoad
                >
                  Nelson
                </SplitWords>
                <SplitWords
                  as="span"
                  className="nm-display-italic"
                  style={{
                    fontSize: 'clamp(3.4rem, 8.4vw, 6.6rem)',
                    lineHeight: 0.95,
                    margin: 0,
                    color: 'var(--nm-gold-deep)',
                  }}
                  baseDelay={200}
                  perWordDelay={70}
                  duration={760}
                  triggerOnLoad
                >
                  Merchan.
                </SplitWords>
              </div>

              <p
                className="nm-hero-tag"
                style={{
                  fontSize: 'clamp(1.18rem, 1.8vw, 1.42rem)',
                  lineHeight: 1.45,
                  color: 'var(--nm-ink)',
                  fontWeight: 400,
                  margin: '0 0 18px',
                  maxWidth: 580,
                  letterSpacing: '-0.005em',
                }}
              >
                Greater Danbury&apos;s entry point for entrepreneurs.
                For more than a decade, the first call when someone in Western Connecticut decides to build something real.
              </p>

              <div
                className="nm-hero-rule"
                aria-hidden="true"
                style={{
                  width: 88,
                  height: 2,
                  background: 'var(--nm-gold)',
                  margin: '28px 0 32px',
                }}
              />

              <div
                className="nm-hero-meta nm-hero-meta-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, auto)',
                  gap: 28,
                  marginBottom: 36,
                  alignItems: 'baseline',
                }}
              >
                {[
                  { k: 'Role', v: 'Business Advisor' },
                  { k: 'Org', v: 'CT SBDC · UConn' },
                  { k: 'Languages', v: 'English / Spanish' },
                ].map((m) => (
                  <div key={m.k}>
                    <div className="nm-eyebrow" style={{ marginBottom: 6 }}>{m.k}</div>
                    <div style={{ fontSize: '0.98rem', color: 'var(--nm-ink)', fontWeight: 500 }}>{m.v}</div>
                  </div>
                ))}
              </div>

              <div className="nm-hero-meta nm-cta-stack" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href="#reach"
                  className="nm-btn-primary"
                >
                  Start the conversation
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="#receipts" className="nm-btn-ghost">
                  See the work
                </a>
              </div>
            </div>

            <div
              className="nm-hero-photo-frame nm-hero-photo-wrap"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 460,
                margin: '0 0 0 auto',
                aspectRatio: '4 / 5',
                borderRadius: 18,
                overflow: 'hidden',
                border: '1px solid var(--nm-line-strong)',
                boxShadow: '0 40px 80px -40px rgba(28,25,23,0.35), 0 6px 18px -8px rgba(28,25,23,0.15)',
                background: 'var(--nm-paper)',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: -2,
                  background:
                    'linear-gradient(135deg, rgba(202,138,4,0.0) 35%, rgba(202,138,4,0.18) 100%)',
                  pointerEvents: 'none',
                  zIndex: 3,
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nelson-merchan.jpg"
                alt="Nelson Merchan, Business Advisor at the Connecticut Small Business Development Center"
                className="nm-hero-photo-img"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'contrast(1.02) saturate(0.96)',
                  transformOrigin: 'center',
                }}
              />
              <div className="nm-hero-photo-sweep" aria-hidden="true" />
              <div
                style={{
                  position: 'absolute',
                  left: 18,
                  bottom: 18,
                  zIndex: 5,
                  background: 'rgba(28,25,23,0.78)',
                  color: '#FAFAF9',
                  padding: '8px 14px',
                  borderRadius: 999,
                  fontSize: '0.72rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 500,
                  animation: 'nm-meta-in 600ms cubic-bezier(0.22, 1, 0.36, 1) 900ms both',
                }}
              >
                CT SBDC &middot; UConn
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reveal as="div"><hr className="nm-rule" /></Reveal>

      {/* THE WORK */}
      <section className="nm-section" id="work">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 48, maxWidth: 980 }}>
          <Reveal><div className="nm-eyebrow">The work</div></Reveal>
          <SplitWords
            as="p"
            className="nm-display"
            style={{
              fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)',
              lineHeight: 1.18,
              color: 'var(--nm-ink)',
              margin: 0,
              maxWidth: 920,
            }}
            perWordDelay={16}
            duration={550}
          >
            {`Nelson advises Greater Danbury entrepreneurs at no cost. He is the version of Connecticut’s Small Business Development Center that picks up the phone.`}
          </SplitWords>
        </div>
      </section>

      <Reveal as="div"><hr className="nm-rule" /></Reveal>

      {/* STATS */}
      <section className="nm-section-tight">
        <StatsGrid />
      </section>

      <Reveal as="div"><hr className="nm-rule" /></Reveal>

      {/* WHAT HE DOES */}
      <section className="nm-section" id="services">
        <Reveal><div className="nm-eyebrow" style={{ marginBottom: 16 }}>What he does</div></Reveal>
        <div className="nm-headline-stack" style={{ marginBottom: 18 }}>
          <SplitWords as="h2" className="nm-display" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.4rem)', lineHeight: 1.04, margin: 0, color: 'var(--nm-ink)' }} baseDelay={0} perWordDelay={36}>
            No-cost.
          </SplitWords>
          <SplitWords as="span" className="nm-display-italic" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.4rem)', lineHeight: 1.04, color: 'var(--nm-gold-deep)' }} baseDelay={80} perWordDelay={36}>
            Confidential.
          </SplitWords>
          <SplitWords as="span" className="nm-display" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.4rem)', lineHeight: 1.04, color: 'var(--nm-ink)' }} baseDelay={170} perWordDelay={28}>
            The kind of help most founders never know is free.
          </SplitWords>
        </div>
        <Reveal delay={220}>
          <p className="nm-section-lead" style={{ marginTop: 24 }}>
            The CT SBDC is a partnership between UConn and the U.S. Small Business Administration. Every meeting with Nelson is paid for by that mandate. Founders bring the work. He brings two decades of Connecticut market knowledge, a network of bankers, and the patience to walk a plan through five revisions.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="nm-card" style={{ height: '100%' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'var(--nm-gold-tint)',
                    color: 'var(--nm-gold-deep)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    fontFamily: "'Fraunces', serif",
                    marginBottom: 22,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div
                  className="nm-display"
                  style={{
                    fontSize: '1.5rem',
                    color: 'var(--nm-ink)',
                    marginBottom: 10,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.label}
                </div>
                <p style={{ fontSize: '0.96rem', color: 'var(--nm-ink-soft)', lineHeight: 1.7, margin: 0 }}>
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="div"><hr className="nm-rule" /></Reveal>

      {/* RECEIPTS / TESTIMONIALS */}
      <section className="nm-section" id="receipts">
        <Reveal><div className="nm-eyebrow" style={{ marginBottom: 16 }}>The receipts</div></Reveal>
        <div className="nm-headline-stack" style={{ marginBottom: 18 }}>
          <SplitWords as="h2" className="nm-display" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.4rem)', lineHeight: 1.04, margin: 0, color: 'var(--nm-ink)' }} perWordDelay={32}>
            The people who built things
          </SplitWords>
          <SplitWords as="span" className="nm-display-italic" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.4rem)', lineHeight: 1.04, color: 'var(--nm-gold-deep)' }} baseDelay={220} perWordDelay={38}>
            with him in the room.
          </SplitWords>
        </div>
        <Reveal delay={260}>
          <p className="nm-section-lead" style={{ marginTop: 24 }}>
            Six businesses across Greater Danbury and Western Connecticut, in their own words. Pulled from public CT SBDC records and the Greater Danbury Chamber of Commerce.
          </p>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 18,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 60}>
              <figure className="nm-quote-card" style={{ height: '100%', margin: 0 }}>
                <blockquote
                  className="nm-display"
                  style={{
                    fontSize: '1.18rem',
                    lineHeight: 1.45,
                    color: 'var(--nm-ink)',
                    fontWeight: 400,
                    margin: '12px 0 28px',
                    fontStyle: 'normal',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {t.quote}
                </blockquote>
                <figcaption style={{ borderTop: '1px solid var(--nm-line)', paddingTop: 18 }}>
                  <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--nm-ink)', marginBottom: 2 }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--nm-ink-soft)', marginBottom: 2 }}>
                    {t.role}
                  </div>
                  <div className="nm-eyebrow" style={{ fontSize: '0.66rem' }}>
                    {t.where}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="div"><hr className="nm-rule" /></Reveal>

      {/* CASE STUDY: AQUILA'S NEST */}
      <section className="nm-section">
        <DarkSweepBlock />
      </section>

      <Reveal as="div"><hr className="nm-rule" /></Reveal>

      {/* ROLES & AFFILIATIONS */}
      <section className="nm-section" id="roles">
        <Reveal><div className="nm-eyebrow" style={{ marginBottom: 16 }}>Roles &amp; affiliations</div></Reveal>
        <div className="nm-headline-stack" style={{ marginBottom: 18 }}>
          <SplitWords as="h2" className="nm-display" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.4rem)', lineHeight: 1.04, margin: 0, color: 'var(--nm-ink)' }} perWordDelay={36}>
            One man.
          </SplitWords>
          <SplitWords as="span" className="nm-display-italic" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.4rem)', lineHeight: 1.04, color: 'var(--nm-gold-deep)' }} baseDelay={120} perWordDelay={40}>
            Six chairs.
          </SplitWords>
        </div>
        <Reveal delay={160}>
          <p className="nm-section-lead" style={{ marginTop: 24 }}>
            Nelson&apos;s reach is structural. He sits on the boards and committees that decide where Greater Danbury invests its civic energy. The same network entrepreneurs benefit from when he routes them somewhere only a board seat can open.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {ROLES.map((r, i) => (
            <Reveal key={r.org} delay={i * 50}>
              <div className="nm-card" style={{ height: '100%' }}>
                <div className="nm-eyebrow" style={{ fontSize: '0.66rem', marginBottom: 14, color: 'var(--nm-gold-deep)' }}>
                  {r.role}
                </div>
                <div
                  className="nm-display"
                  style={{
                    fontSize: '1.32rem',
                    color: 'var(--nm-ink)',
                    lineHeight: 1.2,
                    marginBottom: 10,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {r.org}
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--nm-ink-soft)', lineHeight: 1.6 }}>
                  {r.sub}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="div"><hr className="nm-rule" /></Reveal>

      {/* RECOGNITION */}
      <section className="nm-section">
        <Reveal><div className="nm-eyebrow" style={{ marginBottom: 16 }}>Recognition</div></Reveal>
        <div className="nm-headline-stack">
          <SplitWords as="h2" className="nm-display" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.4rem)', lineHeight: 1.04, margin: 0, color: 'var(--nm-ink)' }} perWordDelay={32}>
            Three awards in twelve years.
          </SplitWords>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0, marginTop: 32 }}>
          {RECOGNITION.map((r, i) => (
            <div
              key={r.year}
              className="nm-rec-row"
              style={{
                borderTop: i === 0 ? '1px solid var(--nm-line-strong)' : '1px solid var(--nm-line)',
                borderBottom: i === RECOGNITION.length - 1 ? '1px solid var(--nm-line-strong)' : 'none',
              }}
            >
              <div
                className="nm-display"
                style={{
                  fontSize: '2.2rem',
                  color: 'var(--nm-gold-deep)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                {r.year}
              </div>
              <div
                className="nm-display"
                style={{
                  fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)',
                  color: 'var(--nm-ink)',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
              >
                {r.body}
              </div>
              <div
                className="nm-rec-org"
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--nm-ink-soft)',
                  textAlign: 'right',
                  minWidth: 200,
                  letterSpacing: '0.01em',
                }}
              >
                {r.org}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Reveal as="div"><hr className="nm-rule" /></Reveal>

      {/* THROUGHLINE — DANBURY ECOSYSTEM */}
      <section className="nm-section" id="throughline">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', maxWidth: 920 }}>
          <Reveal><div className="nm-eyebrow" style={{ marginBottom: 24 }}>The Danbury throughline</div></Reveal>
          <div className="nm-headline-stack" style={{ marginBottom: 32 }}>
            <SplitWords as="h2" className="nm-display" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', lineHeight: 1.04, margin: 0, color: 'var(--nm-ink)' }} perWordDelay={28}>
              158 Main Street is a small building.
            </SplitWords>
            <SplitWords as="span" className="nm-display-italic" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', lineHeight: 1.04, color: 'var(--nm-gold-deep)' }} baseDelay={220} perWordDelay={36}>
              The decade that came out of it is not.
            </SplitWords>
          </div>
          <Reveal delay={260}>
            <div
              style={{
                fontSize: '1.06rem',
                lineHeight: 1.8,
                color: 'var(--nm-ink-soft)',
                maxWidth: 760,
              }}
            >
              <p style={{ margin: '0 0 22px' }}>
                In 2012, CT Next funded the launch of Danbury Hackerspace inside the Danbury Library. CT SBDC moved into the same building. SCORE Western Connecticut moved into the same building. For more than a decade those three organizations have shared an address with a coffee shop and a public library, and the shared address turned into a shared phone tree.
              </p>
              <p style={{ margin: '0 0 22px' }}>
                Nelson has been on the SBDC end of that phone tree since the start. The Hackerspace member who needs a banker, the SBDC client who needs a laser cutter, the volunteer at SCORE who needs a translator: he is one of the people who routes them. Greater Danbury’s entrepreneur ecosystem is not a building. It is the people who answer when the building forwards the call.
              </p>
              <p style={{ margin: 0 }}>
                Fourteen years on, that ecosystem is being asked to scale statewide. Whoever does that work will start by knowing the names already on the door. Nelson&apos;s is one of the first.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal as="div"><hr className="nm-rule" /></Reveal>

      {/* REACH HIM */}
      <section className="nm-section" id="reach">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            alignItems: 'start',
          }}
        >
          <div>
            <Reveal><div className="nm-eyebrow" style={{ marginBottom: 16 }}>Reach him</div></Reveal>
            <div className="nm-headline-stack" style={{ marginBottom: 24 }}>
              <SplitWords as="h2" className="nm-display" style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.04, margin: 0, color: 'var(--nm-ink)' }} perWordDelay={26}>
                If you&apos;re a Greater Danbury entrepreneur,
              </SplitWords>
              <SplitWords as="span" className="nm-display-italic" style={{ fontSize: 'clamp(2rem, 4.2vw, 3rem)', lineHeight: 1.04, color: 'var(--nm-gold-deep)' }} baseDelay={240} perWordDelay={38}>
                start here.
              </SplitWords>
            </div>
            <Reveal delay={260}>
              <p
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.7,
                  color: 'var(--nm-ink-soft)',
                  margin: '0 0 28px',
                  maxWidth: 460,
                }}
              >
                CT SBDC advising is free, confidential, and publicly funded. Email Nelson directly, sign up through the official portal, or stop by the Greater Danbury Chamber of Commerce.
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="nm-cta-stack" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="mailto:nelson.2.merchan@uconn.edu" className="nm-btn-primary">
                  Email Nelson
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="https://ctsbdc.ecenterdirect.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nm-btn-ghost"
                >
                  Request free advising
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--nm-line)',
                borderRadius: 18,
                padding: 32,
              }}
            >
              {[
                {
                  k: 'Email',
                  v: 'nelson.2.merchan@uconn.edu',
                  href: 'mailto:nelson.2.merchan@uconn.edu',
                },
                {
                  k: 'Office',
                  v: 'Greater Danbury Chamber of Commerce',
                  v2: '1 Ives Street #301, Danbury, CT 06810',
                  href: 'https://maps.google.com/?q=1+Ives+Street+Danbury+CT',
                },
                {
                  k: 'Phone',
                  v: '(203) 743-5565',
                  href: 'tel:+12037435565',
                },
                {
                  k: 'LinkedIn',
                  v: 'linkedin.com/in/panelrecruitment',
                  href: 'https://www.linkedin.com/in/panelrecruitment',
                },
                {
                  k: 'Hours',
                  v: 'Mon–Fri, 8:30am–4:30pm',
                  href: null,
                },
              ].map((row, i, arr) => (
                <div
                  key={row.k}
                  className="nm-contact-row"
                  style={{
                    borderBottom: i < arr.length - 1 ? '1px solid var(--nm-line)' : 'none',
                  }}
                >
                  <div className="nm-eyebrow nm-contact-key" style={{ fontSize: '0.66rem' }}>{row.k}</div>
                  <div className="nm-contact-value" style={{ fontSize: '0.94rem', color: 'var(--nm-ink)', lineHeight: 1.55 }}>
                    {row.href ? (
                      <a href={row.href} className="nm-link" {...(row.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {row.v}
                      </a>
                    ) : (
                      row.v
                    )}
                    {row.v2 && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--nm-ink-faint)', marginTop: 4 }}>{row.v2}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: 'var(--nm-ink)',
          color: 'rgba(250,250,249,0.7)',
          paddingTop: 64,
          paddingBottom: 36,
        }}
      >
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 28px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 36,
              marginBottom: 48,
              alignItems: 'start',
            }}
          >
            <div>
              <div
                className="nm-display"
                style={{
                  fontSize: '1.6rem',
                  color: 'var(--nm-cream)',
                  letterSpacing: '-0.02em',
                  marginBottom: 14,
                }}
              >
                Nelson Merchan
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.7, margin: 0, maxWidth: 320 }}>
                Business Advisor, Connecticut Small Business Development Center. Greater Danbury, Connecticut.
              </p>
            </div>

            <div>
              <div className="nm-eyebrow" style={{ color: 'rgba(250,250,249,0.45)', marginBottom: 14 }}>
                Sources for this page
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.84rem' }}>
                <li>
                  <a href="https://ctsbdc.uconn.edu/person/nelson-merchan/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(250,250,249,0.7)', textDecoration: 'none' }} className="nm-link">
                    CT SBDC profile
                  </a>
                </li>
                <li>
                  <a href="https://www.danburychamber.com/community/ctsbdc/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(250,250,249,0.7)', textDecoration: 'none' }} className="nm-link">
                    Greater Danbury Chamber
                  </a>
                </li>
                <li>
                  <a href="https://ctsbdc.uconn.edu/news_events/ctsbdc-advisor-nelson-merchan-honored-as-innovator/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(250,250,249,0.7)', textDecoration: 'none' }} className="nm-link">
                    Westfair Hispanic Innovators
                  </a>
                </li>
                <li>
                  <a href="https://patch.com/connecticut/danbury/nelson-merchan-elected-habitat-board-directors" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(250,250,249,0.7)', textDecoration: 'none' }} className="nm-link">
                    Patch: Habitat board
                  </a>
                </li>
                <li>
                  <a href="https://ctsbdc.uconn.edu/success_stories/aquilas-nest-vineyards/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(250,250,249,0.7)', textDecoration: 'none' }} className="nm-link">
                    Aquila&apos;s Nest case study
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="nm-eyebrow" style={{ color: 'rgba(250,250,249,0.45)', marginBottom: 14 }}>
                Site gifted by
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 8px', color: 'rgba(250,250,249,0.85)' }}>
                Brayan Tenesaca
              </p>
              <p style={{ fontSize: '0.84rem', lineHeight: 1.7, margin: '0 0 14px' }}>
                Next Generation Learners.
              </p>
              <a
                href="mailto:brayan@nextgenerationlearners.com"
                style={{ fontSize: '0.84rem', color: 'rgba(250,250,249,0.85)', textDecoration: 'none' }}
                className="nm-link"
              >
                brayan@nextgenerationlearners.com
              </a>
            </div>
          </div>

          <div
            style={{
              paddingTop: 24,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem',
              color: 'rgba(250,250,249,0.45)',
            }}
          >
            <p style={{ margin: 0 }}>
              Independent tribute page. Not officially affiliated with the University of Connecticut or CT SBDC. All quotes and facts cited from public sources above.
            </p>
            <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatsGrid() {
  const STATS = [
    { num: 100, suffix: '+', label: 'Small businesses advised', sub: 'one-on-one, per public record' },
    { num: 19, suffix: ' yrs', label: 'Building CLICROI', sub: 'founded 2006' },
    { num: 16, suffix: ' yrs', label: 'Counseling Connecticut', sub: 'SCORE since 2010, SBDC for over a decade' },
    { num: 2, suffix: ' langs', label: 'English & Spanish', sub: 'fluent advising in both' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 0,
        border: '1px solid var(--nm-line)',
        borderRadius: 18,
        overflow: 'hidden',
        background: '#FFFFFF',
      }}
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          style={{
            padding: '36px 28px',
            borderRight: i < STATS.length - 1 ? '1px solid var(--nm-line)' : 'none',
            borderBottom: 'none',
          }}
        >
          <div
            className="nm-display"
            style={{
              fontSize: 'clamp(2.6rem, 4.6vw, 3.6rem)',
              color: 'var(--nm-ink)',
              lineHeight: 1,
              marginBottom: 12,
              letterSpacing: '-0.04em',
            }}
          >
            <Counter to={s.num} suffix={s.suffix} />
          </div>
          <div style={{ fontSize: '0.96rem', color: 'var(--nm-ink)', fontWeight: 500, marginBottom: 4 }}>
            {s.label}
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--nm-ink-faint)', lineHeight: 1.55 }}>
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

function DarkSweepBlock() {
  return (
    <div
      className="nm-dark-block is-in"
      style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        padding: 'clamp(40px, 5vw, 72px)',
        background: 'var(--nm-ink)',
        color: 'var(--nm-cream)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-180px',
          right: '-100px',
          width: 460,
          height: 460,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(202,138,4,0.32), transparent 65%)',
          filter: 'blur(70px)',
          animation: 'nm-blob-a 24s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        className="nm-grid-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.07,
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', maxWidth: 760, zIndex: 2 }}>
        <div className="nm-eyebrow" style={{ color: 'rgba(250,250,249,0.6)', marginBottom: 20 }}>
          One of many
        </div>
        <div className="nm-headline-stack" style={{ marginBottom: 24 }}>
          <SplitWords
            as="h3"
            className="nm-display"
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 3.2rem)',
              lineHeight: 1.04,
              margin: 0,
              color: 'var(--nm-cream)',
            }}
            perWordDelay={28}
          >
            A vineyard in Sandy Hook walked in with a plan.
          </SplitWords>
          <SplitWords
            as="span"
            className="nm-display-italic"
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 3.2rem)',
              lineHeight: 1.04,
              color: '#FCD34D',
            }}
            baseDelay={300}
            perWordDelay={36}
          >
            Nelson walked them out with $190,000 and a building permit.
          </SplitWords>
        </div>
        <Reveal delay={420}>
          <p
            style={{
              fontSize: '1.04rem',
              lineHeight: 1.7,
              color: 'rgba(250,250,249,0.78)',
              margin: '0 0 36px',
              maxWidth: 640,
            }}
          >
            Nelson reviewed the business plan, evaluated funding paths, introduced the founders to local banks, and shepherded the working capital application through approval. Aquila&apos;s Nest Vineyards opened with a $120,000 SBA 7(a) loan and a $70,000 commercial bank loan secured. The facility has since exceeded its business goals and created twenty-nine jobs in Western Connecticut.
          </p>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 16,
          }}
        >
          {[
            { num: '$190K', label: 'Financing secured' },
            { num: '29', label: 'Jobs created' },
            { num: '7(a)', label: 'SBA loan structure' },
            { num: '1', label: 'Patient advisor' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={520 + i * 60}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '20px 22px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  className="nm-display"
                  style={{
                    fontSize: '1.8rem',
                    color: '#FCD34D',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'rgba(250,250,249,0.6)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
