'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NstLoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErr('Name required');
      return;
    }
    setBusy(true);
    setErr(null);
    const r = await fetch('/api/nst/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setErr(data.error || 'Could not sign in');
      setBusy(false);
      return;
    }
    router.push('/NST');
  };

  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <span className="brand">NST Final Prep</span>
        </div>
      </header>
      <main className="wrap">
        <div className="card narrow">
          <h1>Sign in</h1>
          <p className="muted">Just enter your name. First time creates your account. Same name later loads your saved progress.</p>
          {err && <div className="error">{err}</div>}
          <form onSubmit={submit} className="stack">
            <label>
              Your name (or nickname)
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                autoComplete="off"
                placeholder="e.g. brayan"
                required
              />
            </label>
            <button className="primary" type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Enter'}
            </button>
          </form>
          <p className="muted small">Multiple people can study at once. Each name keeps its own progress.</p>
        </div>
      </main>
    </>
  );
}
