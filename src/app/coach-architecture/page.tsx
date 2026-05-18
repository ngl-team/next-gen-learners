import type { Metadata } from 'next';
import Link from 'next/link';
import { MermaidDiagram } from '@/components/MermaidDiagram';

export const metadata: Metadata = {
  title: 'Teaching Coach Tool — Architecture',
  description:
    'Local-only teaching coach tool. Teacher records, gets private feedback on delivery, and iterates. Built for Danbury Public Schools.',
  alternates: { canonical: '/coach-architecture' },
  openGraph: {
    title: 'Teaching Coach Tool — Architecture',
    description:
      'Local-only architecture for the teaching coach tool. Teacher autonomy is non-negotiable.',
    locale: 'en_US',
  },
};

const COACH_CHART = `flowchart TB
    Teacher(["Teacher decides to record"])

    subgraph laptop["Teacher's laptop. All local."]
        direction TB
        Record["Record lesson<br/>microphone + optional camera"]
        Whisper["Local transcription<br/>converts audio to text on this laptop"]
        Analyze["Analysis<br/>runs locally on the transcript and video frames"]
        Report["Feedback report<br/>teacher-only view"]
        Decide{"Teacher chooses what happens next"}
        Iterate["Record again<br/>apply the feedback"]
        Storage[("Encrypted local files<br/>only the teacher can open")]
    end

    subgraph optional["Optional outbound. Teacher-initiated only."]
        direction TB
        ShareOne["Share with a coach or peer<br/>teacher picks the recipient"]
        DeleteAll["Delete recording<br/>and all derived feedback"]
    end

    Teacher --> Record
    Record --> Whisper
    Whisper --> Analyze
    Analyze --> Report
    Report --> Decide
    Decide -->|Keep private| Iterate
    Decide -->|Share| ShareOne
    Decide -->|Delete| DeleteAll
    Iterate --> Record
    Record -.-> Storage
    Whisper -.-> Storage
    Report -.-> Storage

    classDef bound fill:#e8f5e9,stroke:#2e7d32,stroke-width:3px
    classDef optBound fill:#fff8e1,stroke:#f57f17,stroke-width:2px,stroke-dasharray: 5 5
    class laptop bound
    class optional optBound`;

const PRIVACY_POINTS = [
  {
    title: 'Recording stays on the teacher\'s laptop',
    body: 'Audio and video files are written to an encrypted local folder. No upload, no sync, no cloud copy.',
  },
  {
    title: 'Transcription runs on-device',
    body: 'A local Whisper model handles transcription. The audio is never sent to OpenAI or any other transcription service.',
  },
  {
    title: 'Analysis runs locally',
    body: 'The analysis engine runs against the local transcript and (optionally) the local video frames. Model choice is local-only or BYO API key. Teacher picks at install.',
  },
  {
    title: 'Feedback is teacher-only',
    body: 'Feedback reports are written to local storage and visible only to the teacher.',
  },
  {
    title: 'Nothing leaves without an explicit teacher action',
    body: 'Sharing is opt-in per recording. The tool is structurally incapable of auto-sharing.',
  },
  {
    title: 'No retention for training',
    body: 'Recordings and transcripts are never sent to NGL or any model provider for training.',
  },
];

const SIGNALS: { signal: string; measured: string }[] = [
  { signal: 'Tone of voice', measured: 'Energy, warmth, monotone vs varied' },
  { signal: 'Intonation', measured: 'Question vs statement patterns, emphasis placement' },
  { signal: 'Scaffolding language', measured: 'Use of leading questions, wait time, reframing' },
  { signal: 'Student question count', measured: 'How many student-initiated questions in the session' },
  { signal: 'Student question type', measured: 'Procedural vs conceptual, surface vs deep' },
  { signal: 'Movement (if video)', measured: 'Time at front of room vs circulating, eye contact patterns' },
];

const NOT_THIS = [
  {
    title: 'Not an evaluation tool',
    body: 'Administrators never see recordings or feedback. The tool is structurally incapable of producing administrator-facing reports.',
  },
  {
    title: 'Not a student-monitoring tool',
    body: 'Student faces and voices are processed locally and discarded after the session-level analysis runs. No student data is retained for later inspection.',
  },
  {
    title: 'Not a compliance archive',
    body: 'The tool does not exist to document teacher conduct. Recordings older than a configurable window auto-delete.',
  },
  {
    title: 'Not a coaching platform',
    body: 'There is no NGL-side dashboard, no admin login, no district-wide analytics. NGL ships the tool and the tool runs on the teacher\'s machine.',
  },
];

const CAFE_DIFFS: { axis: string; cafe: string; ngl: string }[] = [
  { axis: 'Hosting', cafe: 'Cloud-based', ngl: 'Local on teacher\'s laptop' },
  { axis: 'Where the audio lives', cafe: 'Their servers', ngl: 'Teacher\'s machine, encrypted' },
  { axis: 'Turnaround', cafe: '48 hours', ngl: 'Real-time, on-device' },
  { axis: 'Vendor relationship', cafe: 'Unresponsive', ngl: 'One person who answers his email' },
  { axis: 'Cost model', cafe: 'Per-school institutional license', ngl: 'Per-teacher install, BYO key option' },
];

export default function CoachArchitecturePage() {
  return (
    <main className="min-h-screen bg-[#FAFBFF] text-[#1E1B4B]">
      <header className="border-b border-[#1E1B4B]/10 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-[0.18em] text-[#4F46E5] hover:opacity-70 transition"
          >
            Next Generation Learners
          </Link>
          <span className="text-xs text-[#1E1B4B]/50 font-medium">May 15, 2026</span>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-3">
            Architecture brief
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Teaching Coach Tool
          </h1>
          <p className="text-base sm:text-lg text-[#1E1B4B]/70 leading-relaxed">
            A tool that lets a teacher record themselves, get private feedback on delivery, and iterate. Local-only. Teacher-autonomous. Never used for evaluation.
          </p>
          <p className="text-sm text-[#1E1B4B]/50 mt-4">
            Prepared by Brayan Tenesaca, Co-Founder, Next Generation Learners
          </p>
        </div>

        <Section title="The loop in one line">
          <p className="text-[#1E1B4B]/75 leading-relaxed">
            The teacher records a lesson. The tool returns private feedback on tone, intonation, scaffolding language, student questions, and movement. The teacher applies the feedback and records again.
          </p>
        </Section>

        <Section title="Architecture">
          <MermaidDiagram chart={COACH_CHART} id="coach" />
        </Section>

        <Section title="Privacy boundaries">
          <ul className="space-y-5">
            {PRIVACY_POINTS.map((p) => (
              <li key={p.title}>
                <h3 className="font-semibold text-[#1E1B4B] mb-1">{p.title}</h3>
                <p className="text-[#1E1B4B]/75 leading-relaxed">{p.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="What the analysis surfaces">
          <p className="text-[#1E1B4B]/75 leading-relaxed mb-4">
            Per Gina Williams&apos;s written brief.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1B4B]/10">
                  <th className="text-left py-3 pr-4 font-semibold text-[#1E1B4B]">Signal</th>
                  <th className="text-left py-3 font-semibold text-[#1E1B4B]">What gets measured</th>
                </tr>
              </thead>
              <tbody>
                {SIGNALS.map((s) => (
                  <tr key={s.signal} className="border-b border-[#1E1B4B]/5">
                    <td className="py-3 pr-4 font-semibold text-[#1E1B4B] align-top">{s.signal}</td>
                    <td className="py-3 text-[#1E1B4B]/75">{s.measured}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[#1E1B4B]/75 leading-relaxed mt-4">
            The feedback is descriptive, not graded. No score. No rubric. The teacher reads it as a self-coaching mirror.
          </p>
        </Section>

        <Section title="The iterative loop">
          <p className="text-[#1E1B4B]/75 leading-relaxed">
            The point of the tool is repetition. A teacher records once, reads the feedback, records again with one thing changed. Over a semester, the loop is the product. Single recordings are not.
          </p>
        </Section>

        <Section title="What this is not">
          <ul className="space-y-5">
            {NOT_THIS.map((p) => (
              <li key={p.title}>
                <h3 className="font-semibold text-[#1E1B4B] mb-1">{p.title}</h3>
                <p className="text-[#1E1B4B]/75 leading-relaxed">{p.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="How this differs from Project CAFE">
          <p className="text-[#1E1B4B]/75 leading-relaxed mb-4">
            Project CAFE (Urban Assembly + AIR) was the closest existing match to this brief. Gina tried for six months to reach them. They never returned her calls.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1B4B]/10">
                  <th className="text-left py-3 pr-4 font-semibold text-[#1E1B4B]"></th>
                  <th className="text-left py-3 pr-4 font-semibold text-[#1E1B4B]">Project CAFE</th>
                  <th className="text-left py-3 font-semibold text-[#1E1B4B]">NGL Teaching Coach</th>
                </tr>
              </thead>
              <tbody>
                {CAFE_DIFFS.map((d) => (
                  <tr key={d.axis} className="border-b border-[#1E1B4B]/5">
                    <td className="py-3 pr-4 font-semibold text-[#1E1B4B] align-top">{d.axis}</td>
                    <td className="py-3 pr-4 text-[#1E1B4B]/75 align-top">{d.cafe}</td>
                    <td className="py-3 text-[#1E1B4B]/75 align-top">{d.ngl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[#1E1B4B]/75 leading-relaxed mt-4">
            The NGL moat is two things: local-only architecture by default, and a vendor who returns calls.
          </p>
        </Section>

        <Section title="Pilot shape">
          <ul className="space-y-2">
            {[
              'One consenting teacher',
              'Two recordings minimum across the pilot window',
              'Teacher applies the feedback between recordings',
              'Teacher reviews the experience with Gina at the end',
              'No district reporting, no data export, no scaling decision before the teacher says it was useful',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[#1E1B4B]/75">
                <span className="text-[#4F46E5] font-bold mt-0.5">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Build effort">
          <p className="text-[#1E1B4B]/75 leading-relaxed">
            Refinement of an existing prototype, not from scratch. The core record + transcribe + analyze loop already exists in NGL&apos;s stack. Refinement work targets the specific signals (tone, intonation, scaffolding, student questions, movement) and the local-only privacy posture.
          </p>
        </Section>

        <section className="mt-16 pt-12 border-t border-[#1E1B4B]/10">
          <p className="text-sm text-[#1E1B4B]/60 leading-relaxed">
            Questions or feedback?{' '}
            <a
              href="mailto:brayan@nextgenerationlearners.com"
              className="text-[#4F46E5] hover:opacity-70 transition underline underline-offset-2"
            >
              brayan@nextgenerationlearners.com
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1B4B] mb-6 pb-3 border-b border-[#1E1B4B]/10">
        {title}
      </h2>
      {children}
    </section>
  );
}
