import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Danbury Elementary Schedule Draft',
  description: 'A draft elementary school schedule for Danbury that meets all district non-negotiables, including the 3-week PLC rotation.',
  alternates: { canonical: '/danbury-schedule' },
  openGraph: {
    title: 'Danbury Elementary Schedule Draft',
    description: 'Draft schedule meeting all elementary non-negotiables.',
    locale: 'en_US',
  },
};

type BlockType = 'morning' | 'literacy' | 'math' | 'science' | 'win' | 'special' | 'lunch' | 'recess';

type Block = {
  start: number;
  duration: number;
  type: BlockType;
  label: string;
};

const PX_PER_MIN = 2.5;
const DAY_START = 8 * 60 + 20;
const DAY_END = 14 * 60 + 50;
const DAY_MIN = DAY_END - DAY_START;

const COLORS: Record<BlockType, { bg: string; text: string; border: string }> = {
  morning: { bg: 'bg-indigo-50', text: 'text-indigo-900', border: 'border-indigo-200' },
  literacy: { bg: 'bg-purple-200', text: 'text-purple-900', border: 'border-purple-300' },
  math: { bg: 'bg-blue-200', text: 'text-blue-900', border: 'border-blue-300' },
  science: { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300' },
  win: { bg: 'bg-orange-200', text: 'text-orange-900', border: 'border-orange-300' },
  special: { bg: 'bg-yellow-200', text: 'text-yellow-900', border: 'border-yellow-400' },
  lunch: { bg: 'bg-cyan-200', text: 'text-cyan-900', border: 'border-cyan-300' },
  recess: { bg: 'bg-green-300', text: 'text-green-900', border: 'border-green-400' },
};

const TYPE_LABELS: Record<BlockType, string> = {
  morning: 'Morning Meeting',
  literacy: 'Literacy',
  math: 'Math',
  science: 'SS / Science',
  win: 'WIN / ELD',
  special: 'Special',
  lunch: 'Lunch',
  recess: 'Recess',
};

function t(hours: number, minutes: number): number {
  return hours * 60 + minutes - DAY_START;
}

function fmtTime(absMin: number): string {
  const total = absMin + DAY_START;
  const h = Math.floor(total / 60);
  const m = total % 60;
  const h12 = h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')}`;
}

const SCHEDULES: { grade: string; blocks: Block[] }[] = [
  {
    grade: 'Kindergarten',
    blocks: [
      { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
      { start: t(8, 35), duration: 45, type: 'special', label: 'Special (40+5)' },
      { start: t(9, 20), duration: 105, type: 'literacy', label: 'Literacy (105)' },
      { start: t(11, 5), duration: 30, type: 'recess', label: 'Recess (30)' },
      { start: t(11, 35), duration: 30, type: 'lunch', label: 'Lunch (30)' },
      { start: t(12, 5), duration: 40, type: 'science', label: 'SS / Sci (40)' },
      { start: t(12, 45), duration: 75, type: 'math', label: 'Math (75)' },
      { start: t(14, 0), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
    ],
  },
  {
    grade: '1st Grade',
    blocks: [
      { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
      { start: t(8, 35), duration: 45, type: 'literacy', label: 'Literacy (45)' },
      { start: t(9, 20), duration: 45, type: 'special', label: 'Special (40+5)' },
      { start: t(10, 5), duration: 60, type: 'literacy', label: 'Literacy (60)' },
      { start: t(11, 5), duration: 30, type: 'lunch', label: 'Lunch (30)' },
      { start: t(11, 35), duration: 30, type: 'recess', label: 'Recess (30)' },
      { start: t(12, 5), duration: 40, type: 'science', label: 'SS / Sci (40)' },
      { start: t(12, 45), duration: 75, type: 'math', label: 'Math (75)' },
      { start: t(14, 0), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
    ],
  },
  {
    grade: '2nd Grade',
    blocks: [
      { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
      { start: t(8, 35), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
      { start: t(9, 25), duration: 40, type: 'science', label: 'SS / Sci (40)' },
      { start: t(10, 5), duration: 45, type: 'special', label: 'Special (40+5)' },
      { start: t(10, 50), duration: 30, type: 'recess', label: 'Recess (30)' },
      { start: t(11, 20), duration: 30, type: 'lunch', label: 'Lunch (30)' },
      { start: t(11, 50), duration: 75, type: 'math', label: 'Math (75)' },
      { start: t(13, 5), duration: 105, type: 'literacy', label: 'Literacy (105)' },
    ],
  },
  {
    grade: '3rd Grade',
    blocks: [
      { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
      { start: t(8, 35), duration: 60, type: 'literacy', label: 'Literacy (60)' },
      { start: t(9, 35), duration: 75, type: 'math', label: 'Math (75)' },
      { start: t(10, 50), duration: 45, type: 'special', label: 'Special (40+5)' },
      { start: t(11, 35), duration: 30, type: 'recess', label: 'Recess (30)' },
      { start: t(12, 5), duration: 30, type: 'lunch', label: 'Lunch (30)' },
      { start: t(12, 35), duration: 40, type: 'science', label: 'SS / Sci (40)' },
      { start: t(13, 15), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
      { start: t(14, 5), duration: 45, type: 'literacy', label: 'Literacy (45)' },
    ],
  },
  {
    grade: '4th Grade',
    blocks: [
      { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
      { start: t(8, 35), duration: 75, type: 'math', label: 'Math (75)' },
      { start: t(9, 50), duration: 105, type: 'literacy', label: 'Literacy (105)' },
      { start: t(11, 35), duration: 45, type: 'special', label: 'Special (40+5)' },
      { start: t(12, 20), duration: 30, type: 'lunch', label: 'Lunch (30)' },
      { start: t(12, 50), duration: 30, type: 'recess', label: 'Recess (30)' },
      { start: t(13, 20), duration: 40, type: 'science', label: 'SS / Sci (40)' },
      { start: t(14, 0), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
    ],
  },
  {
    grade: '5th Grade',
    blocks: [
      { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
      { start: t(8, 35), duration: 40, type: 'science', label: 'SS / Sci (40)' },
      { start: t(9, 15), duration: 75, type: 'math', label: 'Math (75)' },
      { start: t(10, 30), duration: 30, type: 'lunch', label: 'Lunch (30)' },
      { start: t(11, 0), duration: 30, type: 'recess', label: 'Recess (30)' },
      { start: t(11, 30), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
      { start: t(12, 20), duration: 45, type: 'special', label: 'Special (40+5)' },
      { start: t(13, 5), duration: 105, type: 'literacy', label: 'Literacy (105)' },
    ],
  },
];

const TIME_TICKS: number[] = [];
for (let m = 0; m <= DAY_MIN; m += 15) {
  TIME_TICKS.push(m);
}

const SPECIAL_SLOTS = [
  { time: '8:35 – 9:20', grade: 'Kindergarten' },
  { time: '9:20 – 10:05', grade: '1st Grade' },
  { time: '10:05 – 10:50', grade: '2nd Grade' },
  { time: '10:50 – 11:35', grade: '3rd Grade' },
  { time: '11:35 – 12:20', grade: '4th Grade' },
  { time: '12:20 – 1:05', grade: '5th Grade' },
];

const LUNCH_SLOTS = [
  { time: '10:30 – 11:00', grades: '5th' },
  { time: '11:05 – 11:35', grades: '1st' },
  { time: '11:20 – 11:50', grades: '2nd (overlaps 1st 11:20–11:35)' },
  { time: '11:35 – 12:05', grades: 'K (overlaps 2nd 11:35–11:50)' },
  { time: '12:05 – 12:35', grades: '3rd' },
  { time: '12:20 – 12:50', grades: '4th (overlaps 3rd 12:20–12:35)' },
];

const CONSTRAINTS_MET = [
  '120 min Literacy daily (Morning Meeting counts as the first 15 min)',
  '75 min Math daily, unbroken',
  '40 min Science / Social Studies daily, one block',
  '50 min WIN / ELD daily',
  '40 min Special + 5 min transition, one grade per slot, zero overlap',
  '30 min Lunch and 30 min Recess daily',
  'All lunches between 10:30 am and 1:30 pm',
  'No more than 2 grades in lunch at any moment',
  'PLC: each grade can take 60 min PLC during their Special block with 20 min grace from adjacent block on rotation day',
];

const OPEN_QUESTIONS = [
  '3rd / 4th literacy and math rotation: the team has been pairing 3rd and 4th for a shared literacy/math swap. This draft keeps them independent. Do we wire the swap in next?',
  'PLC coverage on rotation day: who covers the 4th specials slot when classroom teachers PLC for 60 min? Specials team rotation needs to be drawn next.',
  'Late-start version (8:50 – 3:25): same block structure, all times shift +30 min.',
  'Travelers: which specials teachers travel between buildings? Need to align district-wide special slot order so traveling teachers fit.',
];

export default function DanburySchedulePage() {
  const totalHeight = DAY_MIN * PX_PER_MIN;

  return (
    <main className="min-h-screen bg-[#FAFBFF] text-[#1E1B4B]">
      <header className="border-b border-[#1E1B4B]/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#4F46E5] hover:opacity-70 transition">
            Next Generation Learners
          </Link>
          <span className="text-xs text-[#1E1B4B]/50 font-medium">Draft v1 · May 12, 2026</span>
        </div>
      </header>

      <article className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-3">Elementary schedule draft</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Danbury K–5 Daily Schedule
          </h1>
          <p className="text-base sm:text-lg text-[#1E1B4B]/70 leading-relaxed max-w-3xl">
            Early-start version, 8:20 am – 2:50 pm. One draft layout that hits every district non-negotiable, with staggered specials and only two grades at lunch at any moment.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABELS) as BlockType[]).map((type) => (
            <span key={type} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${COLORS[type].bg} ${COLORS[type].text} ${COLORS[type].border}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${COLORS[type].bg} border ${COLORS[type].border}`} />
              {TYPE_LABELS[type]}
            </span>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#1E1B4B]/10 bg-white p-4 mb-12">
          <div className="flex gap-1" style={{ minWidth: '900px' }}>
            <div className="w-16 flex-shrink-0">
              <div className="h-10 flex items-center justify-end pr-2 text-xs font-semibold text-[#1E1B4B]/60 uppercase tracking-wider">Time</div>
              <div className="relative" style={{ height: `${totalHeight}px` }}>
                {TIME_TICKS.map((m) => (
                  <div
                    key={m}
                    className="absolute right-2 -translate-y-1/2 text-[10px] font-medium text-[#1E1B4B]/50"
                    style={{ top: `${m * PX_PER_MIN}px` }}
                  >
                    {fmtTime(m)}
                  </div>
                ))}
              </div>
            </div>

            {SCHEDULES.map(({ grade, blocks }) => (
              <div key={grade} className="flex-1 min-w-[120px]">
                <div className="h-10 flex items-center justify-center text-sm font-bold text-[#1E1B4B] border-b border-[#1E1B4B]/10">
                  {grade}
                </div>
                <div className="relative" style={{ height: `${totalHeight}px` }}>
                  {TIME_TICKS.map((m) => (
                    <div
                      key={m}
                      className="absolute inset-x-0 border-t border-[#1E1B4B]/5"
                      style={{ top: `${m * PX_PER_MIN}px` }}
                    />
                  ))}
                  {blocks.map((block, idx) => {
                    const c = COLORS[block.type];
                    return (
                      <div
                        key={idx}
                        className={`absolute inset-x-0.5 ${c.bg} ${c.text} ${c.border} border rounded px-1.5 py-1 overflow-hidden`}
                        style={{
                          top: `${block.start * PX_PER_MIN}px`,
                          height: `${block.duration * PX_PER_MIN - 2}px`,
                        }}
                      >
                        <div className="text-[10px] font-semibold leading-tight">{block.label}</div>
                        <div className="text-[9px] opacity-70 leading-tight">
                          {fmtTime(block.start)} – {fmtTime(block.start + block.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-xl border border-[#1E1B4B]/10 bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-4">Specials slots · one grade each</h2>
            <ul className="space-y-2">
              {SPECIAL_SLOTS.map((slot) => (
                <li key={slot.grade} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-[#1E1B4B]/70">{slot.time}</span>
                  <span className="font-semibold text-[#1E1B4B]">{slot.grade}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[#1E1B4B]/10 bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-4">Lunch waves · max 2 grades at once</h2>
            <ul className="space-y-2">
              {LUNCH_SLOTS.map((slot) => (
                <li key={slot.time} className="flex items-center justify-between text-sm gap-3">
                  <span className="font-mono text-[#1E1B4B]/70 whitespace-nowrap">{slot.time}</span>
                  <span className="font-semibold text-[#1E1B4B] text-right">{slot.grades}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-xl border border-[#1E1B4B]/10 bg-white p-6 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-4">Non-negotiables satisfied</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CONSTRAINTS_MET.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#1E1B4B]/80">
                <span className="text-[#4F46E5] font-bold mt-0.5">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 mb-4">Open for next iteration</h2>
          <ul className="space-y-2">
            {OPEN_QUESTIONS.map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="text-amber-700 font-bold mt-0.5">?</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="text-center text-sm text-[#1E1B4B]/50 pt-8 border-t border-[#1E1B4B]/10">
          Draft prepared by Brayan Tenesaca · Next Generation Learners ·{' '}
          <a href="mailto:brayan@nextgenerationlearners.com" className="text-[#4F46E5] hover:underline">
            brayan@nextgenerationlearners.com
          </a>
        </footer>
      </article>
    </main>
  );
}
