import type { Metadata } from 'next';
import Link from 'next/link';
import { ScheduleViewer } from './ScheduleViewer';

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

const SPECIAL_SLOTS = [
  { time: '8:35 – 9:20', grade: 'Kindergarten', grace: 'after: 20 min' },
  { time: '9:40 – 10:25', grade: '1st Grade', grace: 'before: 20 · after: 20' },
  { time: '10:45 – 11:30', grade: '2nd Grade', grace: 'before: 20 · after: 30 (specials lunch)' },
  { time: '11:30 – 12:00', grade: 'SPECIALS TEACHER LUNCH', grace: '—' },
  { time: '12:00 – 12:45', grade: '3rd Grade', grace: 'before: 30 (specials lunch)' },
  { time: '1:00 – 1:45', grade: '4th Grade', grace: 'after: 20 min' },
  { time: '2:05 – 2:50', grade: '5th Grade', grace: 'before: 20 min' },
];

const LUNCH_SLOTS = [
  { time: '10:30 – 11:00', grades: 'K + 5th' },
  { time: '12:30 – 1:00', grades: '1st + 4th' },
  { time: '1:00 – 1:30', grades: '2nd + 3rd' },
];

const CONSTRAINTS_MET = [
  '120 min Literacy daily (Morning Meeting counts as the first 15 min)',
  '75 min Math daily, unbroken',
  '40 min Science / Social Studies daily, one block',
  '50 min WIN / ELD daily',
  '40 min Special + 5 min transition, one grade per slot, zero overlap',
  '20 min open before or after each Special block (PLC grace)',
  '30 min uninterrupted lunch for specials teachers (11:30 – 12:00)',
  'Specials spread across the full day from 8:35 to 2:50',
  '30 min Lunch and 30 min Recess daily',
  'All lunches between 10:30 am and 1:30 pm',
  'Lunch waves never partially overlap — they run together or fully separate',
  'No more than 2 grades in lunch at the same time',
  '3rd–5th can flip between literacy-first and math-first openers',
];

const OPEN_QUESTIONS = [
  'Three grades have a 15-min closing literacy chunk to reach 120 min total — flag if that violates the "no chunk under 30" preference.',
  'PLC coverage on rotation day: who covers the 4th specials slot when classroom teachers PLC for 60 min? Specials team rotation needs to be drawn next.',
  'Late-start version (8:50 – 3:25): same block structure, all times shift +30 min.',
  'Travelers: which specials teachers travel between buildings? Need to align district-wide special slot order so traveling teachers fit.',
];

export default function DanburySchedulePage() {
  return (
    <main className="min-h-screen bg-[#FAFBFF] text-[#1E1B4B]">
      <header className="border-b border-[#1E1B4B]/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#4F46E5] hover:opacity-70 transition">
            Next Generation Learners
          </Link>
          <span className="text-xs text-[#1E1B4B]/50 font-medium">Draft v3 · May 12, 2026</span>
        </div>
      </header>

      <article className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-3">Elementary schedule draft</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Danbury K–5 Daily Schedule
          </h1>
          <p className="text-base sm:text-lg text-[#1E1B4B]/70 leading-relaxed max-w-3xl">
            Early-start version, 8:20 am – 2:50 pm. Toggle the 3rd–5th rotation between a literacy-first opener and a math-first opener. K–2 stay fixed across both views.
          </p>
        </div>

        <ScheduleViewer />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-xl border border-[#1E1B4B]/10 bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-4">Specials slots · 20 min grace · teacher lunch</h2>
            <ul className="space-y-2">
              {SPECIAL_SLOTS.map((slot) => (
                <li key={slot.grade} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#1E1B4B]/70">{slot.time}</span>
                    <span className={`font-semibold ${slot.grade === 'SPECIALS TEACHER LUNCH' ? 'text-cyan-700' : 'text-[#1E1B4B]'}`}>{slot.grade}</span>
                  </div>
                  {slot.grace !== '—' && (
                    <div className="text-xs text-[#1E1B4B]/50 text-right mt-0.5">{slot.grace}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[#1E1B4B]/10 bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-4">Lunch waves · paired or fully separate, no partial overlap</h2>
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
