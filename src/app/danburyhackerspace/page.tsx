import type { Metadata } from 'next';
import HubFinder from './HubFinder';
import Reveal from './Reveal';
import Counter from './Counter';
import Marquee from './Marquee';

export const metadata: Metadata = {
  title: 'Danbury Hackerspace | Build what does not exist yet.',
  description:
    'A 501(c)(3) makerspace in downtown Danbury, CT. 3D printers, laser cutters, CNC, machine shop, wood shop. 24×7 member access. Free open house every Thursday 7–10pm.',
};

const HUBS = [
  { name: 'MakeHaven', city: 'New Haven', region: 'New Haven area', url: 'https://www.makehaven.org' },
  { name: 'Makerspace CT', city: 'Hartford', region: 'Greater Hartford', url: 'https://makerspacect.com' },
  { name: 'Danbury Hackerspace', city: 'Danbury', region: 'Western CT', url: 'https://danburyhackerspace.com' },
  { name: 'Fairfield County Makers Guild', city: 'Norwalk', region: 'Fairfield County', url: 'https://www.fcmakersguild.com' },
  { name: 'Nesit', city: 'Meriden', region: 'Greater Hartford', url: 'https://nesit.org' },
  { name: 'Cure Labs & Spark', city: 'New London', region: 'New London area', url: 'https://thespark.org' },
];

const PARTNERS = [
  { name: 'CT SBDC', url: 'https://ctsbdc.com' },
  { name: 'SCORE', url: 'https://www.score.org' },
  { name: 'WBDC', url: 'https://ctwbdc.org' },
  { name: 'FORGE', url: 'https://forgemfg.com' },
];

const EQUIPMENT = [
  { count: 11, label: '3D filament printers', sub: 'Lulzbot Mini, Taz, three delta-style, more' },
  { count: 'SLA', label: 'Resin printers', sub: 'High-detail prototyping' },
  { count: '50W', label: 'Epilog Helix CO₂ laser', sub: 'Wood, acrylic, textiles, etched aluminum' },
  { count: 'CNC', label: 'Shopbot CNC router', sub: 'Wood and soft metals' },
  { count: 'Mill', label: 'Bridgeport milling machine', sub: 'Metal machining' },
  { count: 'Shop', label: 'Full wood & metal shop', sub: 'Drill press, table saw, chop saw, routers' },
];

const BOARD = [
  { name: 'Mike Kaltschnee', role: 'Co-founder' },
  { name: 'Jon Gatrell', role: 'Co-founder' },
  { name: 'Bruce Tuomala', role: 'Sisu Group' },
  { name: 'Dan Bertram', role: 'BRT Corporation' },
  { name: 'Lambert Shell', role: 'Director, Danbury Library' },
  { name: 'Chris Furey', role: 'Virtual Density' },
];

const SPONSORS = ['City of Danbury', 'CT Next', 'CT Innovations', 'Wilson Elser', 'BRT Corporation', 'Cohen & Wolf', 'Danbury Library', 'SCORE Western CT'];

const eyebrow: React.CSSProperties = { fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(165,180,252,0.95)', fontWeight: 700, marginBottom: 12 };
const sectionTitle: React.CSSProperties = { fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 18, color: '#FFFFFF', lineHeight: 1.05 };
const sectionLead: React.CSSProperties = { fontSize: '1.06rem', color: 'rgba(226,232,240,0.65)', maxWidth: 640, lineHeight: 1.7, marginBottom: 32 };
const cardBase: React.CSSProperties = { background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, backdropFilter: 'blur(14px)' };

export default function DanburyHackerspacePage() {
  return (
    <div style={{ background: '#08080F', color: '#E2E8F0', fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif", minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes dh-blob-a { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(60px,-40px) scale(1.12)} }
        @keyframes dh-blob-b { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-70px,50px) scale(1.18)} }
        @keyframes dh-blob-c { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,40px) scale(0.92)} }
        @keyframes dh-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dh-pulse-dot { 0%,100% { transform: scale(1); opacity: .85; } 50% { transform: scale(1.5); opacity: 1; } }
        @keyframes dh-pulse-ring { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2.4); opacity: 0; } }
        @keyframes dh-grid-pan { from { background-position: 0 0; } to { background-position: 60px 60px; } }
        @keyframes dh-cta-rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .dh-hero-headline { animation: dh-fade-up 1000ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .dh-hero-sub { animation: dh-fade-up 1000ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both; }
        .dh-hero-eyebrow { animation: dh-fade-up 800ms cubic-bezier(0.22, 1, 0.36, 1) 60ms both; }
        .dh-hero-ctas { animation: dh-fade-up 1000ms cubic-bezier(0.22, 1, 0.36, 1) 320ms both; }

        .dh-tilt { transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1), border-color 400ms ease, box-shadow 400ms ease, background 400ms ease; }
        .dh-tilt:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.4); box-shadow: 0 20px 50px -10px rgba(99,102,241,0.25); background: linear-gradient(180deg, rgba(99,102,241,0.06), rgba(255,255,255,0.02)); }

        .dh-pulse-dot { animation: dh-pulse-dot 2.4s ease-in-out infinite; }
        .dh-pulse-ring { animation: dh-pulse-ring 2.4s ease-out infinite; }
        .dh-cta-fab { animation: dh-cta-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) 1.2s both; }

        .dh-grid-overlay {
          background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: dh-grid-pan 28s linear infinite;
        }

        .dh-link { color: rgba(165,180,252,0.95); text-decoration: none; transition: color 200ms ease; }
        .dh-link:hover { color: #FFFFFF; }

        .dh-btn-primary { background: linear-gradient(135deg, #6366F1, #8B5CF6); color: #FFFFFF; padding: 14px 28px; border-radius: 999px; font-weight: 600; font-size: 0.94rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: transform 220ms ease, box-shadow 220ms ease; box-shadow: 0 10px 30px rgba(99,102,241,0.35); }
        .dh-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(99,102,241,0.45); }

        .dh-btn-ghost { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); color: #FFFFFF; padding: 13px 26px; border-radius: 999px; font-weight: 600; font-size: 0.94rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; backdrop-filter: blur(10px); transition: background 220ms ease, border-color 220ms ease; }
        .dh-btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }

        nav.dh-nav { position: sticky; top: 0; z-index: 50; background: rgba(8,8,15,0.6); backdrop-filter: blur(18px); border-bottom: 1px solid rgba(255,255,255,0.06); }

        @media (prefers-reduced-motion: reduce) {
          .dh-blob, .dh-pulse-dot, .dh-pulse-ring, .dh-grid-overlay, .dh-hero-headline, .dh-hero-sub, .dh-hero-eyebrow, .dh-hero-ctas, .dh-cta-fab { animation: none !important; }
        }
      `}</style>

      {/* Sticky glassmorphic nav */}
      <nav className="dh-nav">
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, letterSpacing: '-0.01em' }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #6366F1, #10B981)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>DH</span>
            <span style={{ fontSize: '0.96rem' }}>Danbury Hackerspace</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {[
              { label: 'Equipment', href: '#equipment' },
              { label: 'Membership', href: '#membership' },
              { label: 'Bright Ravens', href: '#bright-ravens' },
              { label: 'CT Next 2.0', href: '#ctnext', highlight: true },
              { label: 'About', href: '#about' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={l.highlight
                  ? { fontSize: '0.86rem', textDecoration: 'none', fontWeight: 600, padding: '6px 14px', borderRadius: 999, background: 'linear-gradient(90deg, rgba(99,102,241,0.18), rgba(244,114,182,0.18))', border: '1px solid rgba(165,180,252,0.3)', color: '#FFFFFF' }
                  : { color: 'rgba(226,232,240,0.7)', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 500 }
                }
                className="dh-link-nav"
              >{l.label}</a>
            ))}
            <a href="#visit" className="dh-btn-primary" style={{ padding: '10px 20px', fontSize: '0.86rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A7F3D0' }}></span>
              Visit Thursday
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" style={{ position: 'relative', padding: '120px 24px 100px', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div className="dh-grid-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.55, maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }} />
          <div className="dh-blob" style={{ position: 'absolute', top: '-180px', left: '-160px', width: 620, height: 620, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.45), transparent 65%)', filter: 'blur(60px)', animation: 'dh-blob-a 16s ease-in-out infinite' }} />
          <div className="dh-blob" style={{ position: 'absolute', top: '-100px', right: '-200px', width: 680, height: 680, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.32), transparent 65%)', filter: 'blur(70px)', animation: 'dh-blob-b 20s ease-in-out infinite' }} />
          <div className="dh-blob" style={{ position: 'absolute', bottom: '-220px', left: '30%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,114,182,0.22), transparent 65%)', filter: 'blur(60px)', animation: 'dh-blob-c 18s ease-in-out infinite' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div className="dh-hero-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.85)', marginBottom: 28, fontWeight: 700, padding: '10px 20px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999 }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
              <span className="dh-pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10B981' }} />
              <span className="dh-pulse-dot" style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
            </span>
            Founded 2012 &middot; 501(c)(3) &middot; Downtown Danbury, CT
          </div>
          <h1 className="dh-hero-headline" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.6rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.98, marginBottom: 28, color: '#FFFFFF' }}>
            Build what doesn&apos;t<br />
            <span style={{ background: 'linear-gradient(90deg, #818CF8, #6EE7B7, #F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>exist yet.</span>
          </h1>
          <p className="dh-hero-sub" style={{ fontSize: '1.18rem', color: 'rgba(226,232,240,0.72)', maxWidth: 680, margin: '0 auto 36px', lineHeight: 1.7 }}>
            A non-profit makerspace in downtown Danbury. 3D printers, lasers, CNC, a full machine and wood shop. Hundreds of entrepreneurs, artists, and engineers have launched real things from this room since 2012. Walk in any Thursday and see why.
          </p>
          <div className="dh-hero-ctas" style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <a href="#visit" className="dh-btn-primary">Visit free Thursday →</a>
            <a href="#equipment" className="dh-btn-ghost">See what&apos;s in the shop</a>
          </div>
        </div>
      </section>

      {/* STATS BENTO */}
      <Reveal as="section" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { num: 14, suffix: '', label: 'Years building in Danbury' },
            { num: 11, suffix: '', label: '3D printers active' },
            { num: 24, suffix: '×7', label: 'Member access' },
            { num: 25000, suffix: ' sq ft', label: 'Coming at Bright Ravens' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="dh-tilt" style={{ ...cardBase, padding: 26, height: '100%' }}>
                <div style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF', lineHeight: 1, marginBottom: 8 }}>
                  <Counter to={s.num} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: '0.86rem', color: 'rgba(226,232,240,0.55)', lineHeight: 1.5 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* EQUIPMENT */}
      <Reveal as="section" id="equipment" style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 96px' }}>
        <div style={eyebrow}>The shop</div>
        <h2 style={sectionTitle}>Real machines. Industrial grade.</h2>
        <p style={sectionLead}>The reason people drive forty minutes to a Thursday open house. Members get 24×7 access to all of it once they sign in.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {EQUIPMENT.map((e, i) => (
            <Reveal key={e.label} delay={i * 70}>
              <div className="dh-tilt" style={{ ...cardBase, height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.66rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(165,180,252,0.85)', fontWeight: 700, marginBottom: 16 }}>
                  {String(e.count)}
                </div>
                <div style={{ fontSize: '1.18rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 8, letterSpacing: '-0.01em' }}>{e.label}</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(226,232,240,0.6)', lineHeight: 1.6 }}>{e.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* MEMBERSHIP */}
      <Reveal as="section" id="membership" style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 96px' }}>
        <div style={eyebrow}>Membership</div>
        <h2 style={sectionTitle}>Three tiers. 24×7 access on every one.</h2>
        <p style={sectionLead}>No application fees. No equipment fees. Cancel anytime through PayPal. The only thing you cannot do is skip the in-person walkthrough.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { tier: 'Student', price: '$25', cadence: '/month', desc: 'Same 24×7 access. ID required at signup.', highlight: false },
            { tier: 'Monthly', price: '$50', cadence: '/month', desc: 'Standard membership. Cancel anytime.', highlight: false },
            { tier: 'Annual', price: '$500', cadence: '/year', desc: 'Two months free vs monthly. Best value.', highlight: true },
          ].map((m, i) => (
            <Reveal key={m.tier} delay={i * 90}>
              <div className="dh-tilt" style={{
                ...cardBase,
                height: '100%',
                padding: 28,
                position: 'relative',
                background: m.highlight ? 'linear-gradient(180deg, rgba(99,102,241,0.14), rgba(139,92,246,0.06))' : cardBase.background,
                borderColor: m.highlight ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)',
              }}>
                {m.highlight && (
                  <div style={{ position: 'absolute', top: 16, right: 16, fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FFFFFF', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', padding: '5px 12px', borderRadius: 999, fontWeight: 700 }}>Best value</div>
                )}
                <div style={{ fontSize: '0.78rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.6)', fontWeight: 700, marginBottom: 16 }}>{m.tier}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14 }}>
                  <div style={{ fontSize: '2.6rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF', lineHeight: 1 }}>{m.price}</div>
                  <div style={{ fontSize: '0.92rem', color: 'rgba(226,232,240,0.5)' }}>{m.cadence}</div>
                </div>
                <div style={{ fontSize: '0.92rem', color: 'rgba(226,232,240,0.7)', lineHeight: 1.65, marginBottom: 22 }}>{m.desc}</div>
                <a href="#visit" className="dh-link" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sign up Thursday →</a>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* OPEN HOUSE / VISIT */}
      <Reveal as="section" id="visit" style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 96px' }}>
        <div style={{ position: 'relative', borderRadius: 28, padding: '56px 44px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(16,185,129,0.10) 60%, rgba(244,114,182,0.10))' }}>
          <div aria-hidden="true" className="dh-grid-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.4, maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
            <div>
              <div style={eyebrow}>Open house</div>
              <h2 style={{ ...sectionTitle, marginBottom: 14 }}>Thursdays. 7–10pm. Free.</h2>
              <p style={{ fontSize: '1.04rem', color: 'rgba(226,232,240,0.78)', lineHeight: 1.7, marginBottom: 22 }}>
                Walk in. No appointment. No pitch. A current member shows you the shop, you see what people are working on, and you decide if it&apos;s your kind of room.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="https://maps.google.com/?q=158+Main+Street+Danbury+CT" target="_blank" rel="noopener noreferrer" className="dh-btn-primary">Get directions →</a>
                <a href="tel:+12034934225" className="dh-btn-ghost">Call 203-493-HACK</a>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { k: 'Address', v: '158 Main Street, Danbury, CT' },
                { k: 'Inside', v: 'Danbury Innovation Center, attached to Danbury Library' },
                { k: 'Co-tenants', v: 'SCORE Western CT, CT SBDC, K’s Cafe' },
                { k: 'Parking', v: '$1/hr or $45/month' },
              ].map((row) => (
                <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 16px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                  <span style={{ fontSize: '0.74rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.5)', fontWeight: 700 }}>{row.k}</span>
                  <span style={{ fontSize: '0.88rem', color: '#FFFFFF', textAlign: 'right' }}>{row.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* BRIGHT RAVENS — cinematic */}
      <Reveal as="section" id="bright-ravens" style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 96px' }}>
        <div style={{ position: 'relative', borderRadius: 28, padding: '64px 44px', overflow: 'hidden', background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.35), transparent 55%), radial-gradient(ellipse at bottom right, rgba(16,185,129,0.28), transparent 55%), #0A0A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div aria-hidden="true" className="dh-grid-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.45 }} />
          <div style={{ position: 'relative', maxWidth: 880 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', fontWeight: 700, padding: '8px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, marginBottom: 24 }}>
              <span className="dh-pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
              In construction &middot; Exit 2, Danbury
            </div>
            <h2 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800, letterSpacing: '-0.035em', color: '#FFFFFF', lineHeight: 1.02, marginBottom: 22 }}>
              Bright Ravens<br />Innovation Studios.
            </h2>
            <p style={{ fontSize: '1.08rem', color: 'rgba(226,232,240,0.78)', lineHeight: 1.7, marginBottom: 36, maxWidth: 660 }}>
              The next chapter is 25,000 square feet at the former Crowne Plaza Hotel at Exit 2. One of the largest business incubators in the region. Industrial lasers, CNC routers, a full machine shop, wood shop, artist studios, plus residences for builders to actually live where they make.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 32 }}>
              {[
                { k: 'Footprint', v: '25,000 sq ft' },
                { k: 'Location', v: 'Exit 2, Danbury' },
                { k: 'Status', v: 'Under build' },
                { k: 'Funding', v: 'Privately led' },
              ].map((s) => (
                <div key={s.k} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 18px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.5)', fontWeight: 700, marginBottom: 6 }}>{s.k}</div>
                  <div style={{ fontSize: '1.08rem', fontWeight: 700, color: '#FFFFFF' }}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {['Industrial lasers', 'CNC routers', 'Full machine shop', 'Wood shop', 'Artist studio spaces', 'Residences for makers'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', color: 'rgba(226,232,240,0.85)' }}>
                  <span style={{ width: 18, height: 18, borderRadius: 6, background: 'linear-gradient(135deg, #6366F1, #10B981)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#FFFFFF' }}>+</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* CT NEXT 2.0 — vibrant promotional section */}
      <section id="ctnext" style={{ position: 'relative', padding: '80px 0 0', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div className="dh-blob" style={{ position: 'absolute', top: '5%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 60%)', filter: 'blur(80px)', animation: 'dh-blob-a 18s ease-in-out infinite' }} />
          <div className="dh-blob" style={{ position: 'absolute', top: '40%', right: '-15%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,114,182,0.28), transparent 60%)', filter: 'blur(80px)', animation: 'dh-blob-b 22s ease-in-out infinite' }} />
          <div className="dh-blob" style={{ position: 'absolute', bottom: '-10%', left: '30%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.28), transparent 60%)', filter: 'blur(80px)', animation: 'dh-blob-c 20s ease-in-out infinite' }} />
        </div>

        <Reveal style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 32px', position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: 28, fontWeight: 700, padding: '10px 22px', background: 'linear-gradient(90deg, rgba(99,102,241,0.25), rgba(244,114,182,0.25))', backdropFilter: 'blur(10px)', border: '1px solid rgba(165,180,252,0.35)', borderRadius: 999 }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
              <span className="dh-pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#F472B6' }} />
              <span className="dh-pulse-dot" style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#F472B6' }} />
            </span>
            Mike Kaltschnee&apos;s vision &middot; unfunded prototype
          </div>
          <h2 style={{ fontSize: 'clamp(3rem, 7vw, 5.4rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.98, marginBottom: 26, color: '#FFFFFF' }}>
            <span style={{ background: 'linear-gradient(90deg, #818CF8, #F472B6, #6EE7B7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CT Next 2.0.</span>
          </h2>
          <p style={{ fontSize: '1.24rem', color: 'rgba(226,232,240,0.78)', maxWidth: 720, margin: '0 auto 12px', lineHeight: 1.6 }}>
            A statewide network where every entrepreneur in Connecticut can find the closest place to build and the right person to help. Six makerspaces. Four advisor organizations. One front door.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'rgba(226,232,240,0.5)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Proposed by Mike Kaltschnee, co-director of Danbury Hackerspace, in a December 2025 email to CT SBDC.
          </p>
        </Reveal>

        {/* Full-circle narrative */}
        <Reveal style={{ maxWidth: 1180, margin: '0 auto', padding: '48px 24px', position: 'relative' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(244,114,182,0.10) 50%, rgba(16,185,129,0.10))', border: '1px solid rgba(165,180,252,0.25)', borderRadius: 28, padding: '48px 36px', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden="true" className="dh-grid-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.35, maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 75%)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ ...eyebrow, color: 'rgba(255,255,255,0.85)' }}>The throughline</div>
              <h3 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: 18, lineHeight: 1.15 }}>
                CT Next funded Danbury Hackerspace in 2012.<br />Fourteen years later, the same room is proposing CT Next 2.0.
              </h3>
              <p style={{ fontSize: '1.04rem', color: 'rgba(226,232,240,0.78)', lineHeight: 1.7, maxWidth: 760 }}>
                Danbury Hackerspace already shares a building with CT SBDC, SCORE Western CT, and K&apos;s Cafe. Mike has been living the model for years. CT Next 2.0 is what happens when you take that one room and stretch it across the state.
              </p>
            </div>
          </div>
        </Reveal>

        {/* The model — three layers */}
        <Reveal style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 24px 56px', position: 'relative' }}>
          <div style={{ ...eyebrow, color: 'rgba(165,180,252,0.95)' }}>How it works</div>
          <h3 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: 32, lineHeight: 1.15 }}>Three layers. The pieces already exist.</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { tone: '#818CF8', k: 'Layer 1', n: '6', v: 'Physical hubs', d: 'Makerspaces across CT. Tools, members, walls, electricity. Builders walk in here.' },
              { tone: '#6EE7B7', k: 'Layer 2', n: '4', v: 'Advisor orgs', d: 'SBDC, SCORE, WBDC, FORGE. Free expertise. Already serving CT entrepreneurs.' },
              { tone: '#F472B6', k: 'Layer 3', n: '1', v: 'Front door', d: 'This page. Routes builders to the right hub and advisor. Tracks every handoff.' },
            ].map((c, i) => (
              <Reveal key={c.k} delay={i * 90}>
                <div className="dh-tilt" style={{ ...cardBase, height: '100%', padding: 28, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: '3.4rem', fontWeight: 800, letterSpacing: '-0.04em', color: c.tone, lineHeight: 1 }}>{c.n}</div>
                    <div style={{ fontSize: '0.66rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: c.tone, fontWeight: 700 }}>{c.k}</div>
                  </div>
                  <div style={{ fontSize: '1.18rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>{c.v}</div>
                  <div style={{ fontSize: '0.92rem', color: 'rgba(226,232,240,0.6)', lineHeight: 1.7 }}>{c.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* The six hubs */}
        <Reveal style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 24px 56px', position: 'relative' }}>
          <div style={{ ...eyebrow, color: 'rgba(165,180,252,0.95)' }}>The six hubs</div>
          <h3 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: 14, lineHeight: 1.15 }}>Connecticut already has the buildings.</h3>
          <p style={{ ...sectionLead, marginBottom: 28 }}>Six makerspaces from New Haven to New London. The network proposal does not require building anything new. It requires connecting what is already here.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {HUBS.map((h, i) => (
              <Reveal key={h.name} delay={i * 60}>
                <a href={h.url} target="_blank" rel="noopener noreferrer" className="dh-tilt" style={{ ...cardBase, padding: 20, textDecoration: 'none', color: '#FFFFFF', display: 'block', height: '100%' }}>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(165,180,252,0.85)', fontWeight: 700, marginBottom: 8 }}>{h.city}</div>
                  <div style={{ fontSize: '1.04rem', fontWeight: 700 }}>{h.name}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* The four advisors */}
        <Reveal style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 24px 56px', position: 'relative' }}>
          <div style={{ ...eyebrow, color: 'rgba(110,231,183,0.95)' }}>The four advisors</div>
          <h3 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: 14, lineHeight: 1.15 }}>The expertise already exists.</h3>
          <p style={{ ...sectionLead, marginBottom: 28 }}>Four organizations already serve Connecticut entrepreneurs at no or low cost. The network connects them to the hubs and to each other.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {PARTNERS.map((p, i) => (
              <Reveal key={p.name} delay={i * 70}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="dh-tilt" style={{ ...cardBase, padding: '22px 20px', textDecoration: 'none', color: '#FFFFFF', display: 'block', textAlign: 'center', height: '100%' }}>
                  <div style={{ fontSize: '1.08rem', fontWeight: 700 }}>{p.name}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* The form */}
        <Reveal style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 24px 56px', position: 'relative' }}>
          <div style={{ ...eyebrow, color: 'rgba(244,114,182,0.95)' }}>Try the front door</div>
          <h3 style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', marginBottom: 14, lineHeight: 1.15 }}>Two questions. One match.</h3>
          <p style={{ ...sectionLead, marginBottom: 28 }}>The same routing form Mike described in his December email, working today. Tell us what you need and where you are. We point you to the closest hub and a suggested advisor, and log the referral.</p>
          <HubFinder hubs={HUBS} partners={PARTNERS} />
        </Reveal>

        {/* Why now / get involved */}
        <Reveal style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 24px 96px', position: 'relative' }}>
          <div style={{ background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.4), transparent 60%), radial-gradient(ellipse at bottom right, rgba(244,114,182,0.35), transparent 60%), #0A0A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: '52px 36px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
            <div aria-hidden="true" className="dh-grid-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
            <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
              <div style={{ ...eyebrow, color: 'rgba(255,255,255,0.85)' }}>Why now</div>
              <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: 20, lineHeight: 1.1 }}>
                Stand up a thousand referrals. The state notices.
              </h3>
              <p style={{ fontSize: '1.05rem', color: 'rgba(226,232,240,0.78)', lineHeight: 1.7, marginBottom: 32 }}>
                Mike&apos;s December email made one thing clear: tracking the network state-wide is the path to formal funding. Every submission through this site is a row in a private database. A thousand rows is the data the legislature needs to fund CT Next 2.0 for real. We start by sharing the link.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="mailto:?subject=CT%20Next%202.0&body=Connecticut%20entrepreneurs%20need%20one%20front%20door.%20Take%20a%20look%3A%20https%3A%2F%2Fnextgenerationlearners.com%2Fdanburyhackerspace%23ctnext" className="dh-btn-primary">Share with a builder →</a>
                <a href="mailto:mike@danburyhackerspace.com?subject=CT%20Next%202.0" className="dh-btn-ghost">Email Mike directly</a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SPONSORS marquee */}
      <Reveal as="section" style={{ padding: '40px 0 80px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 24px' }}>
          <div style={{ ...eyebrow, textAlign: 'center', marginBottom: 24 }}>Sponsors and partners since 2012</div>
        </div>
        <Marquee speed={36}>
          {SPONSORS.map((s) => (
            <div key={s} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(226,232,240,0.6)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{s}</div>
          ))}
        </Marquee>
      </Reveal>

      {/* ABOUT / BOARD */}
      <Reveal as="section" id="about" style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 96px' }}>
        <div style={eyebrow}>The team</div>
        <h2 style={sectionTitle}>Founded 2012. Still volunteer-led.</h2>
        <p style={sectionLead}>
          Started by Jon Gatrell and Mike Kaltschnee in 2012 with launch funding from CT Next. 501(c)(3) nonprofit since 2014. The board still runs the room.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {BOARD.map((b, i) => (
            <Reveal key={b.name} delay={i * 60}>
              <div className="dh-tilt" style={{ ...cardBase, padding: 22, height: '100%' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #6366F1, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.92rem', color: '#FFFFFF', marginBottom: 16 }}>
                  {b.name.split(' ').map((p) => p[0]).join('')}
                </div>
                <div style={{ fontSize: '1.04rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>{b.name}</div>
                <div style={{ fontSize: '0.86rem', color: 'rgba(226,232,240,0.55)' }}>{b.role}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.4)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 24px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 36, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #6366F1, #10B981)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 800 }}>DH</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>Danbury Hackerspace</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(226,232,240,0.55)', lineHeight: 1.7 }}>
                501(c)(3) nonprofit makerspace.<br />
                158 Main Street, Danbury, CT 06810<br />
                Inside the Danbury Innovation Center.
              </p>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.4)', fontWeight: 700, marginBottom: 14 }}>Contact</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem' }}>
                <a href="mailto:danburyhackerspace@gmail.com" className="dh-link">danburyhackerspace@gmail.com</a>
                <a href="mailto:mike@danburyhackerspace.com" className="dh-link">mike@danburyhackerspace.com</a>
                <a href="tel:+12034934225" className="dh-link">203-493-HACK</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.4)', fontWeight: 700, marginBottom: 14 }}>Follow</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem' }}>
                <a href="https://twitter.com/danburyhackers" target="_blank" rel="noopener noreferrer" className="dh-link">Twitter / @danburyhackers</a>
                <a href="https://facebook.com/DanburyHackerspace" target="_blank" rel="noopener noreferrer" className="dh-link">Facebook</a>
                <a href="https://meetup.com/Danbury-Hackerspace/" target="_blank" rel="noopener noreferrer" className="dh-link">Meetup</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.4)', fontWeight: 700, marginBottom: 14 }}>Donate</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem' }}>
                <a href="https://paypal.me/danburyhackerspace" target="_blank" rel="noopener noreferrer" className="dh-link">PayPal</a>
                <a href="https://venmo.com/code?user_id=3597001094596334013" target="_blank" rel="noopener noreferrer" className="dh-link">Venmo</a>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'rgba(226,232,240,0.4)', marginTop: 12, lineHeight: 1.6 }}>
                Donations are tax-deductible to the extent allowed by law.
              </p>
            </div>
          </div>
          <div style={{ paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(226,232,240,0.4)' }}>
              &copy; {new Date().getFullYear()} Danbury Hackerspace, Inc. Concept redesign by Brayan Tenesaca at Next Generation Learners. Not officially affiliated.
            </p>
            <a href="mailto:brayan@nextgenerationlearners.com" style={{ fontSize: '0.78rem', color: 'rgba(226,232,240,0.4)', textDecoration: 'none' }} className="dh-link">brayan@nextgenerationlearners.com</a>
          </div>
        </div>
      </footer>

      {/* Floating Visit CTA */}
      <a href="#visit" className="dh-cta-fab" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 40, padding: '12px 20px', borderRadius: 999, background: 'rgba(8,8,15,0.85)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)', color: '#FFFFFF', fontSize: '0.84rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}>
        <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
          <span className="dh-pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10B981' }} />
          <span className="dh-pulse-dot" style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
        </span>
        Open Thursday 7–10pm
      </a>
    </div>
  );
}
