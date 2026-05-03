'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../_components/Header';
import equationsData from '@/data/nst-equations.json';

type Variable = { sym: string; meaning: string };
type Equation = {
  name: string;
  equation: string;
  category: string;
  variables: Variable[];
  use: string;
  appears_in: string;
};

const ALL_EQS = (equationsData as { equations: Equation[] }).equations;

export default function EquationsPage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    (async () => {
      const me = await fetch('/api/nst/me').then((r) => r.json());
      if (!me.name) {
        router.push('/NST/login');
        return;
      }
      setName(me.name);
    })();
  }, [router]);

  const categories = useMemo(() => {
    const set = new Set(ALL_EQS.map((e) => e.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    let pool = ALL_EQS;
    if (category !== 'all') pool = pool.filter((e) => e.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      pool = pool.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.equation.toLowerCase().includes(q) ||
          e.use.toLowerCase().includes(q) ||
          e.variables.some((v) => v.sym.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q))
      );
    }
    return pool;
  }, [category, query]);

  return (
    <>
      <Header name={name} />
      <main className="wrap">
        <Link className="back" href="/NST">&larr; back</Link>
        <h1>Equations Reference</h1>
        <p className="muted">
          Every equation that has appeared in the lectures, labs, and exam questions. Variables defined, when to use, and where it shows up.
        </p>

        <div className="eq-controls">
          <input
            className="eq-search"
            placeholder="Search by name, symbol, or keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="eq-filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`pill-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>

        <p className="small muted">{filtered.length} equation{filtered.length === 1 ? '' : 's'}</p>

        <div className="eq-list">
          {filtered.map((eq) => (
            <div key={eq.name} className="eq-card">
              <div className="eq-head">
                <h3>{eq.name}</h3>
                <span className="pill open">{eq.category}</span>
              </div>
              <div className="eq-formula">{eq.equation}</div>
              <div className="eq-section">
                <div className="eq-label">Variables</div>
                <ul className="eq-vars">
                  {eq.variables.map((v) => (
                    <li key={v.sym}>
                      <span className="eq-sym">{v.sym}</span>
                      <span className="eq-meaning">{v.meaning}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="eq-section">
                <div className="eq-label">When to use</div>
                <p className="eq-use">{eq.use}</p>
              </div>
              <div className="eq-appears">{eq.appears_in}</div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="muted" style={{ padding: '40px 0' }}>
            No equations match. Try a different filter or search term.
          </div>
        )}
      </main>
    </>
  );
}
