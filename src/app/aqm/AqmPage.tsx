'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { questions, type Question } from './data/questions';
import { codeSections, codeNotes } from './data/rcode';
import { topics } from './data/topics';
import { traps } from './data/traps';

type Tab = 'quiz' | 'traps' | 'guide' | 'rcode';

const TABS: { id: Tab; label: string; sub: string }[] = [
  { id: 'quiz', label: 'Practice Quiz', sub: '50 Q from your midterm + review' },
  { id: 'traps', label: 'Mistake Drill', sub: 'The 7 things you got wrong' },
  { id: 'guide', label: 'Study Guide', sub: 'Topic by topic' },
  { id: 'rcode', label: 'R Code Reference', sub: 'Every line, explained' },
];

export default function AqmPage() {
  const [tab, setTab] = useState<Tab>('quiz');

  return (
    <main className="min-h-screen bg-[#0F0F1A] text-white">
      <header className="border-b border-white/10 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#0F0F1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-xs text-white/50 hover:text-white/80 uppercase tracking-[0.2em]">
              ← Next Generation Learners
            </Link>
            <span className="text-xs text-white/40 uppercase tracking-[0.2em]">Personal study tool</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold">AQM 2000 — Final Prep</h1>
          <p className="text-white/60 mt-3 max-w-2xl">
            Built from your 13 R scripts, midterm screenshots, course notes, and the final-exam review PDF.
            Drill the practice questions first, then attack the mistake list, then skim the guide and the R reference.
          </p>
        </div>

        <nav className="max-w-5xl mx-auto px-4 sm:px-6 pb-2 flex flex-wrap gap-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 rounded-t-lg text-left transition-colors ${
                tab === t.id
                  ? 'bg-[#0F0F1A] text-white border-t border-x border-white/10'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="text-sm font-semibold">{t.label}</div>
              <div className="text-[11px] text-white/50 mt-0.5">{t.sub}</div>
            </button>
          ))}
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {tab === 'quiz' && <QuizSection />}
        {tab === 'traps' && <TrapsSection />}
        {tab === 'guide' && <GuideSection />}
        {tab === 'rcode' && <RCodeSection />}
      </div>

      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-xs text-white/40">
          AQM 2000 study tool. Final exam in &lt;48h.
        </div>
      </footer>
    </main>
  );
}

/* QUIZ ====================================================== */

function QuizSection() {
  const allTopics = useMemo(() => {
    const set = new Set<string>();
    questions.forEach(q => set.add(q.topic));
    return ['All topics', 'Just the ones you got wrong', ...Array.from(set)];
  }, []);

  const [filter, setFilter] = useState('All topics');
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});

  const filtered = useMemo(() => {
    let list = questions;
    if (filter === 'Just the ones you got wrong') {
      list = questions.filter(q => q.youGotWrong);
    } else if (filter !== 'All topics') {
      list = questions.filter(q => q.topic === filter);
    }
    if (shuffleSeed > 0) {
      list = [...list].sort(() => Math.random() - 0.5);
    }
    return list;
  }, [filter, shuffleSeed]);

  const answered = Object.keys(picked).length;
  const correct = Object.entries(picked).filter(([id, idx]) => {
    const q = questions.find(x => x.id === Number(id));
    return q && q.correctIndex === idx;
  }).length;

  return (
    <div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-xs text-white/50 uppercase tracking-wider mr-2">Filter</label>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-[#1E1B4B] border border-white/20 text-white text-sm rounded-md px-3 py-2"
          >
            {allTopics.map(t => <option key={t}>{t}</option>)}
          </select>
          <button
            onClick={() => { setShuffleSeed(s => s + 1); setPicked({}); }}
            className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md"
          >
            Shuffle &amp; reset
          </button>
        </div>
        <div className="text-sm text-white/70">
          <span className="font-bold text-white">{correct}</span> / {answered} correct ·{' '}
          <span className="text-white/50">{filtered.length} total</span>
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map((q, i) => (
          <QuizCard
            key={q.id}
            q={q}
            index={i}
            chosenIndex={picked[q.id]}
            onPick={(idx) => setPicked(prev => ({ ...prev, [q.id]: idx }))}
          />
        ))}
      </div>
    </div>
  );
}

function QuizCard({
  q,
  index,
  chosenIndex,
  onPick,
}: {
  q: Question;
  index: number;
  chosenIndex: number | undefined;
  onPick: (i: number) => void;
}) {
  const answered = chosenIndex !== undefined;
  const isCorrect = answered && chosenIndex === q.correctIndex;

  return (
    <div className={`rounded-xl border p-5 sm:p-6 transition-colors ${
      !answered ? 'bg-white/5 border-white/10'
      : isCorrect ? 'bg-emerald-500/5 border-emerald-500/30'
      : 'bg-rose-500/5 border-rose-500/30'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/40">#{index + 1}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{q.topic}</span>
          {q.fromMidterm && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">From midterm</span>}
          {q.youGotWrong && <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">You missed this</span>}
        </div>
      </div>

      <p className="text-white whitespace-pre-line mb-3">{q.prompt}</p>

      {q.code && (
        <pre className="bg-black/40 border border-white/10 rounded-md p-3 text-xs sm:text-sm text-white/90 mb-3 overflow-x-auto">
          <code>{q.code}</code>
        </pre>
      )}

      {q.table && (
        <div className="overflow-x-auto mb-3">
          <table className="text-xs sm:text-sm border border-white/10 rounded">
            <thead>
              <tr className="bg-white/10">
                {q.table.headers.map(h => <th key={h} className="px-3 py-2 text-left text-white/80">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {q.table.rows.map((r, ri) => (
                <tr key={ri} className="border-t border-white/10">
                  {r.map((c, ci) => <td key={ci} className="px-3 py-1.5 text-white/70">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isPicked = chosenIndex === i;
          const isAnswer = q.correctIndex === i;
          let cls = 'border-white/15 bg-white/5 hover:bg-white/10';
          if (answered) {
            if (isAnswer) cls = 'border-emerald-500/60 bg-emerald-500/10';
            else if (isPicked && !isAnswer) cls = 'border-rose-500/60 bg-rose-500/10';
            else cls = 'border-white/10 bg-white/[0.02] opacity-60';
          }
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => onPick(i)}
              className={`w-full text-left text-sm sm:text-[15px] px-4 py-3 rounded-lg border transition-colors ${cls} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="text-white/40 font-mono mr-2">{String.fromCharCode(65 + i)}.</span>
              <span className="whitespace-pre-line">{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 text-sm">
          <p className={isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold'}>
            {isCorrect ? '✓ Correct' : '✗ Incorrect — see why below'}
          </p>
          <p className="text-white/80 mt-2"><span className="text-white/50">Why: </span>{q.explanation}</p>
          {q.trap && <p className="text-amber-300/90 mt-2"><span className="text-white/50">Trap: </span>{q.trap}</p>}
        </div>
      )}
    </div>
  );
}

/* TRAPS ===================================================== */

function TrapsSection() {
  return (
    <div className="space-y-6">
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-5 sm:p-6">
        <h2 className="text-xl font-bold text-white mb-1">Your specific weak spots</h2>
        <p className="text-white/70 text-sm">
          These are the exact places you lost points on the midterm + the trap topics on the review PDF.
          Internalize these 7 rules and you will not repeat the same mistakes.
        </p>
      </div>
      {traps.map((t, i) => (
        <div key={t.topic} className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-rose-300 font-mono">#{i + 1}</span>
            <h3 className="text-lg font-bold text-white">{t.topic}</h3>
          </div>
          <p className="text-white text-[15px] mb-3"><span className="text-white/50">Rule: </span>{t.rule}</p>
          <p className="text-amber-300/80 text-sm mb-3"><span className="text-white/50">Why it bit you: </span>{t.why}</p>
          <pre className="bg-black/40 border border-white/10 rounded-md p-3 text-xs sm:text-sm text-white/90 mb-3 whitespace-pre-wrap">
            <code>{t.example}</code>
          </pre>
          <p className="text-emerald-300/90 text-sm"><span className="text-white/50">How to apply: </span>{t.drill}</p>
        </div>
      ))}
    </div>
  );
}

/* GUIDE ===================================================== */

function GuideSection() {
  return (
    <div className="space-y-4">
      {topics.map(t => (
        <details key={t.id} className="bg-white/5 border border-white/10 rounded-xl group">
          <summary className="cursor-pointer p-5 sm:p-6 list-none flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">{t.title}</h3>
              <p className="text-white/60 text-sm mt-1">{t.oneLiner}</p>
            </div>
            <span className="text-white/40 text-xl group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="px-5 sm:px-6 pb-6 -mt-2">
            <MD content={t.body} />
          </div>
        </details>
      ))}
    </div>
  );
}

/* R CODE REFERENCE ========================================== */

function RCodeSection() {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-3">Quick rules</h2>
        <ul className="space-y-1.5">
          {codeNotes.map(n => (
            <li key={n.rule} className="text-sm text-white/80">
              <code className="bg-black/40 text-emerald-300 px-1.5 py-0.5 rounded">{n.rule}</code>
              <span className="text-white/60 ml-2">— {n.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {codeSections.map(sec => (
        <details key={sec.title} className="bg-white/5 border border-white/10 rounded-xl group" open>
          <summary className="cursor-pointer p-5 list-none flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">{sec.title}</h3>
              <p className="text-white/60 text-sm mt-1">{sec.description}</p>
            </div>
            <span className="text-white/40 text-xl group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="px-5 pb-5 space-y-2">
            {sec.lines.map((l, i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-2 sm:gap-4 items-start border-t border-white/5 pt-3">
                <pre className="bg-black/40 border border-white/10 rounded-md p-2.5 text-xs sm:text-[13px] text-emerald-300 overflow-x-auto">
                  <code>{l.code}</code>
                </pre>
                <p className="text-sm text-white/75 sm:pt-1">{l.comment}</p>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

/* Tiny markdown renderer ==================================== */

function MD({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  return <div className="space-y-3">{blocks.map((b, i) => <Block key={i} block={b} />)}</div>;
}

function Block({ block }: { block: string }) {
  if (block.startsWith('```')) {
    const code = block.replace(/^```\w*\n?/, '').replace(/```$/, '');
    return (
      <pre className="bg-black/50 border border-white/10 rounded-md p-3 text-xs sm:text-sm text-emerald-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    );
  }
  if (block.startsWith('| ')) {
    const lines = block.split('\n').filter(l => l.startsWith('|'));
    if (lines.length < 2) return <Inline text={block} />;
    const headers = splitRow(lines[0]);
    const rows = lines.slice(2).map(splitRow);
    return (
      <div className="overflow-x-auto">
        <table className="text-xs sm:text-sm border border-white/10 rounded w-full">
          <thead>
            <tr className="bg-white/10">
              {headers.map((h, i) => <th key={i} className="px-3 py-2 text-left text-white/80"><Inline text={h} /></th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-t border-white/10">
                {r.map((c, ci) => <td key={ci} className="px-3 py-1.5 text-white/75"><Inline text={c} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (/^\s*[-*]\s/.test(block)) {
    const items = block.split('\n').filter(l => /^\s*[-*]\s/.test(l));
    return (
      <ul className="list-disc list-outside ml-5 space-y-1 text-white/80 text-sm sm:text-[15px]">
        {items.map((l, i) => <li key={i}><Inline text={l.replace(/^\s*[-*]\s/, '')} /></li>)}
      </ul>
    );
  }
  return <p className="text-white/80 text-sm sm:text-[15px] leading-relaxed whitespace-pre-line"><Inline text={block} /></p>;
}

function splitRow(line: string) {
  return line
    .replace(/^\||\|$/g, '')
    .split(/(?<!\\)\|/)
    .map(c => c.trim().replace(/\\\|/g, '|'));
}

function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < text.length) {
    if (text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2);
      if (end === -1) { parts.push(text.slice(i)); break; }
      parts.push(<strong key={key++} className="text-white font-semibold">{text.slice(i + 2, end)}</strong>);
      i = end + 2;
    } else if (text[i] === '`') {
      const end = text.indexOf('`', i + 1);
      if (end === -1) { parts.push(text.slice(i)); break; }
      parts.push(<code key={key++} className="bg-black/40 text-emerald-300 px-1.5 py-0.5 rounded text-[0.9em]">{text.slice(i + 1, end)}</code>);
      i = end + 1;
    } else {
      let next = text.length;
      const idxBold = text.indexOf('**', i);
      const idxCode = text.indexOf('`', i);
      if (idxBold !== -1) next = Math.min(next, idxBold);
      if (idxCode !== -1) next = Math.min(next, idxCode);
      parts.push(text.slice(i, next));
      i = next;
    }
  }
  return <>{parts}</>;
}
