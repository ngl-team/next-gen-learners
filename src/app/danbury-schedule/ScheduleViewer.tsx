'use client';

import { useState } from 'react';

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

const K_BLOCKS: Block[] = [
  { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
  { start: t(8, 35), duration: 45, type: 'special', label: 'Special (40+5)' },
  { start: t(9, 20), duration: 30, type: 'recess', label: 'Recess (30)' },
  { start: t(9, 50), duration: 40, type: 'science', label: 'SS / Sci (40)' },
  { start: t(10, 30), duration: 30, type: 'lunch', label: 'Lunch (30)' },
  { start: t(11, 0), duration: 105, type: 'literacy', label: 'Literacy (105)' },
  { start: t(12, 45), duration: 75, type: 'math', label: 'Math (75)' },
  { start: t(14, 0), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
];

const G1_BLOCKS: Block[] = [
  { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
  { start: t(8, 35), duration: 65, type: 'literacy', label: 'Literacy (65)' },
  { start: t(9, 40), duration: 45, type: 'special', label: 'Special (40+5)' },
  { start: t(10, 25), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
  { start: t(11, 15), duration: 75, type: 'math', label: 'Math (75)' },
  { start: t(12, 30), duration: 30, type: 'lunch', label: 'Lunch (30)' },
  { start: t(13, 0), duration: 30, type: 'recess', label: 'Recess (30)' },
  { start: t(13, 30), duration: 40, type: 'science', label: 'SS / Sci (40)' },
  { start: t(14, 10), duration: 40, type: 'literacy', label: 'Literacy (40)' },
];

const G2_BLOCKS: Block[] = [
  { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
  { start: t(8, 35), duration: 90, type: 'literacy', label: 'Literacy (90)' },
  { start: t(10, 5), duration: 40, type: 'science', label: 'SS / Sci (40)' },
  { start: t(10, 45), duration: 45, type: 'special', label: 'Special (40+5)' },
  { start: t(11, 30), duration: 75, type: 'math', label: 'Math (75)' },
  { start: t(12, 45), duration: 15, type: 'literacy', label: 'Literacy (15)' },
  { start: t(13, 0), duration: 30, type: 'lunch', label: 'Lunch (30)' },
  { start: t(13, 30), duration: 30, type: 'recess', label: 'Recess (30)' },
  { start: t(14, 0), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
];

const G3_LIT: Block[] = [
  { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
  { start: t(8, 35), duration: 60, type: 'literacy', label: 'Literacy (60)' },
  { start: t(9, 35), duration: 75, type: 'math', label: 'Math (75)' },
  { start: t(10, 50), duration: 40, type: 'science', label: 'SS / Sci (40)' },
  { start: t(11, 30), duration: 30, type: 'recess', label: 'Recess (30)' },
  { start: t(12, 0), duration: 45, type: 'special', label: 'Special (40+5)' },
  { start: t(12, 45), duration: 15, type: 'literacy', label: 'Literacy (15)' },
  { start: t(13, 0), duration: 30, type: 'lunch', label: 'Lunch (30)' },
  { start: t(13, 30), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
  { start: t(14, 20), duration: 30, type: 'literacy', label: 'Literacy (30)' },
];

const G3_MATH: Block[] = [
  { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
  { start: t(8, 35), duration: 75, type: 'math', label: 'Math (75)' },
  { start: t(9, 50), duration: 60, type: 'literacy', label: 'Literacy (60)' },
  { start: t(10, 50), duration: 40, type: 'science', label: 'SS / Sci (40)' },
  { start: t(11, 30), duration: 30, type: 'recess', label: 'Recess (30)' },
  { start: t(12, 0), duration: 45, type: 'special', label: 'Special (40+5)' },
  { start: t(12, 45), duration: 15, type: 'literacy', label: 'Literacy (15)' },
  { start: t(13, 0), duration: 30, type: 'lunch', label: 'Lunch (30)' },
  { start: t(13, 30), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
  { start: t(14, 20), duration: 30, type: 'literacy', label: 'Literacy (30)' },
];

const G4_LIT: Block[] = [
  { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
  { start: t(8, 35), duration: 60, type: 'literacy', label: 'Literacy (60)' },
  { start: t(9, 35), duration: 75, type: 'math', label: 'Math (75)' },
  { start: t(10, 50), duration: 40, type: 'science', label: 'SS / Sci (40)' },
  { start: t(11, 30), duration: 30, type: 'recess', label: 'Recess (30)' },
  { start: t(12, 0), duration: 30, type: 'literacy', label: 'Literacy (30)' },
  { start: t(12, 30), duration: 30, type: 'lunch', label: 'Lunch (30)' },
  { start: t(13, 0), duration: 45, type: 'special', label: 'Special (40+5)' },
  { start: t(13, 45), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
  { start: t(14, 35), duration: 15, type: 'literacy', label: 'Literacy (15)' },
];

const G4_MATH: Block[] = [
  { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
  { start: t(8, 35), duration: 75, type: 'math', label: 'Math (75)' },
  { start: t(9, 50), duration: 90, type: 'literacy', label: 'Literacy (90)' },
  { start: t(11, 20), duration: 40, type: 'science', label: 'SS / Sci (40)' },
  { start: t(12, 0), duration: 30, type: 'recess', label: 'Recess (30)' },
  { start: t(12, 30), duration: 30, type: 'lunch', label: 'Lunch (30)' },
  { start: t(13, 0), duration: 45, type: 'special', label: 'Special (40+5)' },
  { start: t(13, 45), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
  { start: t(14, 35), duration: 15, type: 'literacy', label: 'Literacy (15)' },
];

const G5_LIT: Block[] = [
  { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
  { start: t(8, 35), duration: 40, type: 'literacy', label: 'Literacy (40)' },
  { start: t(9, 15), duration: 75, type: 'math', label: 'Math (75)' },
  { start: t(10, 30), duration: 30, type: 'lunch', label: 'Lunch (30)' },
  { start: t(11, 0), duration: 30, type: 'recess', label: 'Recess (30)' },
  { start: t(11, 30), duration: 40, type: 'science', label: 'SS / Sci (40)' },
  { start: t(12, 10), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
  { start: t(13, 0), duration: 65, type: 'literacy', label: 'Literacy (65)' },
  { start: t(14, 5), duration: 45, type: 'special', label: 'Special (40+5)' },
];

const G5_MATH: Block[] = [
  { start: t(8, 20), duration: 15, type: 'morning', label: 'Morning Meeting' },
  { start: t(8, 35), duration: 75, type: 'math', label: 'Math (75)' },
  { start: t(9, 50), duration: 40, type: 'science', label: 'SS / Sci (40)' },
  { start: t(10, 30), duration: 30, type: 'lunch', label: 'Lunch (30)' },
  { start: t(11, 0), duration: 30, type: 'recess', label: 'Recess (30)' },
  { start: t(11, 30), duration: 50, type: 'win', label: 'WIN / ELD (50)' },
  { start: t(12, 20), duration: 105, type: 'literacy', label: 'Literacy (105)' },
  { start: t(14, 5), duration: 45, type: 'special', label: 'Special (40+5)' },
];

const TIME_TICKS: number[] = [];
for (let m = 0; m <= DAY_MIN; m += 15) {
  TIME_TICKS.push(m);
}

type Rotation = 'lit' | 'math';

function getSchedules(rotation: Rotation) {
  return [
    { grade: 'Kindergarten', blocks: K_BLOCKS },
    { grade: '1st Grade', blocks: G1_BLOCKS },
    { grade: '2nd Grade', blocks: G2_BLOCKS },
    { grade: '3rd Grade', blocks: rotation === 'lit' ? G3_LIT : G3_MATH },
    { grade: '4th Grade', blocks: rotation === 'lit' ? G4_LIT : G4_MATH },
    { grade: '5th Grade', blocks: rotation === 'lit' ? G5_LIT : G5_MATH },
  ];
}

export function ScheduleViewer() {
  const [rotation, setRotation] = useState<Rotation>('lit');
  const totalHeight = DAY_MIN * PX_PER_MIN;
  const schedules = getSchedules(rotation);

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_LABELS) as BlockType[]).map((type) => (
            <span key={type} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${COLORS[type].bg} ${COLORS[type].text} ${COLORS[type].border}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${COLORS[type].bg} border ${COLORS[type].border}`} />
              {TYPE_LABELS[type]}
            </span>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-[#1E1B4B]/15 bg-white p-1 self-start">
          <button
            type="button"
            onClick={() => setRotation('lit')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              rotation === 'lit'
                ? 'bg-purple-200 text-purple-900 shadow-sm'
                : 'text-[#1E1B4B]/60 hover:text-[#1E1B4B]'
            }`}
          >
            3rd–5th Literacy Rotation
          </button>
          <button
            type="button"
            onClick={() => setRotation('math')}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              rotation === 'math'
                ? 'bg-blue-200 text-blue-900 shadow-sm'
                : 'text-[#1E1B4B]/60 hover:text-[#1E1B4B]'
            }`}
          >
            3rd–5th Math Rotation
          </button>
        </div>
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

          {schedules.map(({ grade, blocks }, gradeIdx) => {
            const isRotationGrade = gradeIdx >= 3;
            return (
              <div key={grade} className="flex-1 min-w-[120px]">
                <div className={`h-10 flex items-center justify-center text-sm font-bold border-b border-[#1E1B4B]/10 ${
                  isRotationGrade
                    ? rotation === 'lit'
                      ? 'bg-purple-50 text-purple-900'
                      : 'bg-blue-50 text-blue-900'
                    : 'text-[#1E1B4B]'
                }`}>
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
            );
          })}
        </div>
      </div>
    </>
  );
}
