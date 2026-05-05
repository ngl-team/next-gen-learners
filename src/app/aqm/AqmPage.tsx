'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { questions, type Question } from './data/questions';
import { extraQuestions } from './data/extraQuestions';
import { codeSections, codeNotes } from './data/rcode';
import { topics } from './data/topics';
import { traps } from './data/traps';
import { guideSections } from './data/topicGuide';

const ALL_QUESTIONS: Question[] = [...questions, ...extraQuestions];

type Tab = 'topics' | 'quiz' | 'traps' | 'guide' | 'rcode';
const USERS = ['Brayan', 'Eli', 'Manu'] as const;
type User = (typeof USERS)[number];

const TABS: { id: Tab; label: string; sub: string }[] = [
  { id: 'topics', label: 'By Topic', sub: 'Walk the official topic guide' },
  { id: 'quiz', label: 'Practice Quiz', sub: 'All questions, mixed' },
  { id: 'traps', label: 'Mistake Drill', sub: 'The 7 traps to memorize' },
  { id: 'guide', label: 'Study Guide', sub: 'Concept reference' },
  { id: 'rcode', label: 'R Code Reference', sub: 'Every line, explained' },
];

const USER_KEY = 'aqm:user';
const progressKey = (u: User) => `aqm:progress:${u}`;

export default function AqmPage() {
  const [tab, setTab] = useState<Tab>('quiz');
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null;
    if (saved && (USERS as readonly string[]).includes(saved)) setUser(saved as User);
    setHydrated(true);
  }, []);

  const pickUser = (u: User) => {
    setUser(u);
    localStorage.setItem(USER_KEY, u);
  };

  const switchUser = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  if (!hydrated) {
    return <main className="min-h-screen bg-[#0F0F1A]" />;
  }

  if (!user) {
    return <SignInScreen onPick={pickUser} />;
  }

  return (
    <main className="min-h-screen bg-[#0F0F1A] text-white">
      <header className="border-b border-white/10 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#0F0F1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <Link href="/" className="text-xs text-white/50 hover:text-white/80 uppercase tracking-[0.2em]">
              ← Next Generation Learners
            </Link>
            <UserBadge user={user} onSwitch={switchUser} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold">AQM 2000 — Final Prep</h1>
          <p className="text-white/60 mt-3 max-w-2xl">
            Hi <span className="text-white font-semibold">{user}</span>. Your progress saves automatically on this device.
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
        {tab === 'topics' && <TopicGuideSection user={user} />}
        {tab === 'quiz' && <QuizSection user={user} />}
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

/* SIGN IN =================================================== */

function SignInScreen({ onPick }: { onPick: (u: User) => void }) {
  return (
    <main className="min-h-screen bg-[#0F0F1A] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <p className="text-xs text-white/40 uppercase tracking-[0.3em] mb-3">AQM 2000 Final Prep</p>
          <h1 className="text-3xl sm:text-4xl font-bold">Who&apos;s studying?</h1>
          <p className="text-white/60 mt-3 text-sm">Pick your name. Your quiz progress saves on this device.</p>
        </div>
        <div className="space-y-3">
          {USERS.map(u => (
            <button
              key={u}
              onClick={() => onPick(u)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-6 py-5 text-left transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-semibold text-white">{u}</span>
                <span className="text-white/30 group-hover:text-white/70 transition-colors">→</span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-white/30 text-xs text-center mt-6">
          Three users. Pick anyone — progress is local to this device, no password needed.
        </p>
      </div>
    </main>
  );
}

function UserBadge({ user, onSwitch }: { user: User; onSwitch: () => void }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-300 font-semibold">
        Signed in as {user}
      </span>
      <button
        onClick={onSwitch}
        className="text-white/50 hover:text-white px-2 py-1 rounded-md hover:bg-white/10"
      >
        Switch
      </button>
    </div>
  );
}

/* QUIZ ====================================================== */

function useUserProgress(user: User) {
  const [picked, setPicked] = useState<Record<number, number>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(progressKey(user));
      setPicked(raw ? JSON.parse(raw) : {});
    } catch {
      setPicked({});
    }
  }, [user]);

  const savePicked = (next: Record<number, number>) => {
    setPicked(next);
    localStorage.setItem(progressKey(user), JSON.stringify(next));
  };

  return { picked, savePicked };
}

function QuizSection({ user }: { user: User }) {
  const allTopics = useMemo(() => {
    const set = new Set<string>();
    ALL_QUESTIONS.forEach(q => set.add(q.topic));
    return ['All topics', 'Just the ones you got wrong', ...Array.from(set)];
  }, []);

  const [filter, setFilter] = useState('All topics');
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const { picked, savePicked } = useUserProgress(user);

  const filtered = useMemo(() => {
    let list = ALL_QUESTIONS;
    if (filter === 'Just the ones you got wrong') {
      list = ALL_QUESTIONS.filter(q => q.youGotWrong);
    } else if (filter !== 'All topics') {
      list = ALL_QUESTIONS.filter(q => q.topic === filter);
    }
    if (shuffleSeed > 0) {
      list = [...list].sort(() => Math.random() - 0.5);
    }
    return list;
  }, [filter, shuffleSeed]);

  const answered = Object.keys(picked).length;
  const correct = Object.entries(picked).filter(([id, idx]) => {
    const q = ALL_QUESTIONS.find(x => x.id === Number(id));
    return q && q.correctIndex === idx;
  }).length;

  const resetProgress = () => {
    if (confirm(`Reset ${user}'s saved progress on every question? This cannot be undone.`)) {
      savePicked({});
    }
  };

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
            onClick={() => setShuffleSeed(s => s + 1)}
            className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md"
          >
            Shuffle order
          </button>
          <button
            onClick={resetProgress}
            className="text-sm bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 px-3 py-2 rounded-md"
          >
            Reset my progress
          </button>
        </div>
        <div className="text-sm text-white/70">
          <span className="font-bold text-emerald-300">{correct}</span> / {answered} correct ·{' '}
          <span className="text-white/50">{ALL_QUESTIONS.length} total in bank</span>
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map((q, i) => (
          <QuizCard
            key={q.id}
            q={q}
            index={i}
            chosenIndex={picked[q.id]}
            onPick={(idx) => savePicked({ ...picked, [q.id]: idx })}
          />
        ))}
      </div>
    </div>
  );
}

/* TOPIC GUIDE =============================================== */

function TopicGuideSection({ user }: { user: User }) {
  const { picked, savePicked } = useUserProgress(user);
  const [openId, setOpenId] = useState<string | null>(guideSections[0]?.id ?? null);

  const onPick = (qid: number, idx: number) => {
    savePicked({ ...picked, [qid]: idx });
  };

  const stats = useMemo(() => {
    const map: Record<string, { answered: number; correct: number; total: number }> = {};
    for (const sec of guideSections) {
      let answered = 0;
      let correct = 0;
      for (const qid of sec.questionIds) {
        const q = ALL_QUESTIONS.find(x => x.id === qid);
        if (!q) continue;
        const chosen = picked[qid];
        if (chosen !== undefined) {
          answered++;
          if (chosen === q.correctIndex) correct++;
        }
      }
      map[sec.id] = { answered, correct, total: sec.questionIds.length };
    }
    return map;
  }, [picked]);

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6">
        <h2 className="text-xl font-bold text-white mb-2">Walk the official topic guide</h2>
        <p className="text-white/70 text-sm">
          Built from the Final Exam Topic Guide PDF. Each section lists what the professor said you need to know,
          followed by practice questions targeting those exact bullets. Your answers save automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {guideSections.map(sec => {
          const s = stats[sec.id];
          const pct = s.total === 0 ? 0 : Math.round((s.correct / Math.max(s.answered, 1)) * 100);
          const isOpen = openId === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => { setOpenId(sec.id); document.getElementById(`sec-${sec.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className={`text-left rounded-lg border px-3 py-2.5 transition-colors ${
                isOpen ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="text-xs sm:text-sm font-semibold text-white">{sec.title}</div>
              <div className="text-[11px] text-white/50 mt-0.5">
                {s.answered}/{s.total} answered
                {s.answered > 0 && <span className="ml-2 text-emerald-300/80">{pct}% correct</span>}
              </div>
            </button>
          );
        })}
      </div>

      {guideSections.map(sec => {
        const s = stats[sec.id];
        const sectionQuestions = sec.questionIds
          .map(id => ALL_QUESTIONS.find(q => q.id === id))
          .filter((q): q is Question => Boolean(q));

        return (
          <div
            key={sec.id}
            id={`sec-${sec.id}`}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden scroll-mt-4"
          >
            <button
              onClick={() => setOpenId(openId === sec.id ? null : sec.id)}
              className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-white/[0.03]"
            >
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{sec.title}</h3>
                <div className="text-sm text-white/50 mt-1">
                  {s.answered}/{s.total} answered ·{' '}
                  <span className="text-emerald-300/80">{s.correct} correct</span>
                </div>
              </div>
              <span className={`text-white/40 text-xl transition-transform ${openId === sec.id ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {openId === sec.id && (
              <div className="px-5 sm:px-6 pb-6 space-y-5">
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <div className="text-xs uppercase tracking-wider text-white/50 mb-2">From the official topic guide</div>
                  <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-white/85">
                    {sec.bullets.map(b => <li key={b}>{b}</li>)}
                  </ul>
                </div>

                {sec.studyTip && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                    <div className="text-xs uppercase tracking-wider text-emerald-300/70 mb-1">Quick framing</div>
                    <p className="text-sm text-white/90 leading-relaxed">{sec.studyTip}</p>
                  </div>
                )}

                <div>
                  <div className="text-xs uppercase tracking-wider text-white/50 mb-3">
                    Practice questions ({sectionQuestions.length})
                  </div>
                  <div className="space-y-4">
                    {sectionQuestions.map((q, i) => (
                      <QuizCard
                        key={q.id}
                        q={q}
                        index={i}
                        chosenIndex={picked[q.id]}
                        onPick={(idx) => onPick(q.id, idx)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
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
