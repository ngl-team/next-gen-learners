'use client';

import { useState } from 'react';

type Props = { phone: string };

export default function PingForm({ phone }: Props) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');

  const canSend = name.trim().length > 0 && contact.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    const lines = [
      `Hi Brayan, I'm ${name.trim()}.`,
      `Contact: ${contact.trim()}`,
    ];
    if (note.trim()) lines.push(`Note: ${note.trim()}`);
    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'block' }}>
      <style>{`
        .bp-field {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: #FFFFFF;
          font-size: 0.96rem;
          color: var(--ink);
          font-family: inherit;
          transition: border-color 200ms ease, box-shadow 200ms ease;
          box-sizing: border-box;
        }
        .bp-field:focus {
          outline: none;
          border-color: var(--ink);
          box-shadow: 0 0 0 3px rgba(28,25,23,0.08);
        }
        .bp-field::placeholder { color: var(--ink-faint); }
        .bp-field-label {
          display: block;
          font-size: 0.68rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          font-weight: 500;
          color: var(--ink-faint);
          margin-bottom: 8px;
        }
        .bp-field-row { margin-bottom: 16px; }
        .bp-btn-send {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 28px; border-radius: 999px;
          background: var(--ink); color: var(--cream);
          font-size: 0.95rem; font-weight: 500;
          border: 0; cursor: pointer;
          font-family: inherit;
          transition: transform 220ms ease, box-shadow 220ms ease, opacity 220ms ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
          width: 100%;
        }
        .bp-btn-send:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 14px 30px -10px rgba(28,25,23,0.30); }
        .bp-btn-send:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div className="bp-field-row">
        <label className="bp-field-label" htmlFor="bp-name">Your name</label>
        <input
          id="bp-name"
          className="bp-field"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          autoComplete="name"
          required
        />
      </div>

      <div className="bp-field-row">
        <label className="bp-field-label" htmlFor="bp-contact">Your phone or email</label>
        <input
          id="bp-contact"
          className="bp-field"
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="+1 555 555 5555 or jane@example.com"
          required
        />
      </div>

      <div className="bp-field-row">
        <label className="bp-field-label" htmlFor="bp-note">Note (optional)</label>
        <textarea
          id="bp-note"
          className="bp-field"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything you want me to know"
          rows={3}
          style={{ resize: 'vertical', minHeight: 80 }}
        />
      </div>

      <button type="submit" className="bp-btn-send" disabled={!canSend}>
        Send via WhatsApp
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p style={{ fontSize: '0.78rem', color: 'var(--ink-faint)', margin: '14px 0 0', lineHeight: 1.5 }}>
        This opens WhatsApp with your info pre-filled. You still have to hit
        send.
      </p>
    </form>
  );
}
