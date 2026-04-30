'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/danburyhackerspace/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Login failed');
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: 24 }}>
      <label htmlFor="pw" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Password</label>
      <input
        id="pw"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        style={{ width: '100%', padding: '12px 14px', fontSize: '0.95rem', border: '1px solid #D1D5DB', borderRadius: 10, background: '#FFFFFF', fontFamily: 'inherit', color: '#111827', marginBottom: 14 }}
      />
      {error && <div style={{ color: '#B91C1C', fontSize: '0.85rem', marginBottom: 12 }}>{error}</div>}
      <button type="submit" disabled={submitting} style={{ background: '#111827', color: '#FFFFFF', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: '0.92rem', fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit', width: '100%' }}>
        {submitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
