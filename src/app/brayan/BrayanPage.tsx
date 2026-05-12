const WHATSAPP_NUMBER = '12034604183';
const WHATSAPP_DISPLAY = '+1 (203) 460-4183';

export default function BrayanPage() {
  const waLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;
  const telLink = `tel:+${WHATSAPP_NUMBER}`;

  return (
    <div
      style={{
        background: '#FAFAF9',
        color: '#1C1917',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        :root {
          --cream: #FAFAF9;
          --paper: #F5F5F4;
          --line: rgba(28,25,23,0.10);
          --line-strong: rgba(28,25,23,0.20);
          --ink: #1C1917;
          --ink-soft: #57534E;
          --ink-faint: #78716C;
          --accent: #1C1917;
        }
        .bp-display { font-family: 'Fraunces', 'Times New Roman', serif; font-weight: 400; letter-spacing: -0.035em; }
        .bp-italic { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; letter-spacing: -0.03em; }
        .bp-eyebrow { font-size: 0.7rem; letter-spacing: 0.32em; text-transform: uppercase; font-weight: 500; color: var(--ink-faint); }

        @keyframes bp-fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .bp-fade-1 { animation: bp-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) 60ms both; }
        .bp-fade-2 { animation: bp-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) 220ms both; }
        .bp-fade-3 { animation: bp-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) 380ms both; }
        .bp-fade-4 { animation: bp-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) 540ms both; }
        .bp-fade-5 { animation: bp-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) 700ms both; }

        .bp-btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 28px; border-radius: 999px;
          background: var(--ink); color: var(--cream);
          font-size: 0.95rem; font-weight: 500; letter-spacing: 0.005em;
          text-decoration: none; cursor: pointer;
          transition: transform 220ms ease, box-shadow 220ms ease, background 220ms ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
        }
        .bp-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 14px 30px -10px rgba(28,25,23,0.30); }

        .bp-btn-ghost {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 15px 26px; border-radius: 999px;
          background: transparent; color: var(--ink); border: 1px solid var(--line-strong);
          font-size: 0.95rem; font-weight: 500;
          text-decoration: none; cursor: pointer;
          transition: background 220ms ease, border-color 220ms ease;
        }
        .bp-btn-ghost:hover { background: var(--paper); border-color: var(--ink); }

        .bp-card {
          background: #FFFFFF; border: 1px solid var(--line);
          border-radius: 18px; padding: 28px;
        }

        .bp-row { padding: 16px 0; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 110px 1fr; gap: 18px; align-items: baseline; }
        .bp-row:last-child { border-bottom: 0; }
        .bp-row-key { font-size: 0.68rem; letter-spacing: 0.26em; text-transform: uppercase; font-weight: 500; color: var(--ink-faint); }
        .bp-row-val { font-size: 1rem; color: var(--ink); }

        .bp-link {
          color: var(--ink); text-decoration: none;
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 100% 1px; background-repeat: no-repeat; background-position: 0 100%;
          transition: opacity 200ms ease;
        }
        .bp-link:hover { opacity: 0.7; }

        @media (max-width: 640px) {
          .bp-row { grid-template-columns: 1fr; gap: 4px; padding: 14px 0; }
          .bp-cta-stack { flex-direction: column !important; align-items: stretch !important; }
          .bp-cta-stack > * { width: 100%; }
        }
      `}</style>

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 28px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div
            className="bp-eyebrow bp-fade-1"
            style={{ marginBottom: 28, display: 'inline-flex', alignItems: 'center', gap: 10 }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--ink)',
              }}
            />
            Contact
          </div>

          <h1
            className="bp-display bp-fade-2"
            style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              lineHeight: 0.96,
              margin: '0 0 10px',
              color: 'var(--ink)',
            }}
          >
            Brayan
            <br />
            <span className="bp-italic" style={{ color: 'var(--ink-soft)' }}>
              Tenesaca
            </span>
          </h1>

          <p
            className="bp-fade-3"
            style={{
              fontSize: '1.08rem',
              lineHeight: 1.6,
              color: 'var(--ink-soft)',
              margin: '24px 0 40px',
              maxWidth: 480,
            }}
          >
            Builder. Babson 2029. I make &ldquo;small&rdquo; AI tools for
            schools, small businesses, and friends. If you want to talk, the
            number below is the fastest way. :)
          </p>

          <div
            className="bp-card bp-fade-4"
            style={{ marginBottom: 32 }}
          >
            <div className="bp-row">
              <div className="bp-row-key">WhatsApp</div>
              <div className="bp-row-val">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="bp-link">
                  {WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>
            <div className="bp-row">
              <div className="bp-row-key">Call</div>
              <div className="bp-row-val">
                <a href={telLink} className="bp-link">
                  {WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>
            <div className="bp-row">
              <div className="bp-row-key">Email</div>
              <div className="bp-row-val" style={{ color: 'var(--ink-soft)' }}>
                Available on request
              </div>
            </div>
            <div className="bp-row">
              <div className="bp-row-key">Based</div>
              <div className="bp-row-val">Wellesley, MA &middot; Danbury, CT</div>
            </div>
          </div>

          <div
            className="bp-cta-stack bp-fade-5"
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
          >
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="bp-btn-primary">
              Message on WhatsApp
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1 7h12M7 1l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href={telLink} className="bp-btn-ghost">
              Call
            </a>
          </div>
        </div>
      </main>

      <footer
        style={{
          padding: '24px 28px',
          borderTop: '1px solid var(--line)',
          fontSize: '0.78rem',
          color: 'var(--ink-faint)',
          textAlign: 'center',
          letterSpacing: '0.02em',
        }}
      >
        Brayan Tenesaca &middot; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
