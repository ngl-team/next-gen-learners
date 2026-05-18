import type { Metadata } from 'next';
import Link from 'next/link';
import { MermaidDiagram } from '@/components/MermaidDiagram';

export const metadata: Metadata = {
  title: 'Curriculum Unit Starter — Architecture',
  description:
    'A tool that gives Danbury teachers a working draft of a year-long course to refine. Built from Melissa Nadeau\'s template, the Unit Components doc, Backward Design, and the Language Function framework.',
  alternates: { canonical: '/curriculum-architecture' },
  openGraph: {
    title: 'Curriculum Unit Starter — Architecture',
    description:
      'Local-aligned curriculum unit starter for Danbury Public Schools. Year-long, six-unit course, written in the order the team already uses.',
    locale: 'en_US',
  },
};

const CURRICULUM_CHART = `flowchart TB
    A["<b>Step 1. Set the course context</b><br/>Academy, Pathway, Course, Grade Level"]
    B["<b>Step 2. Upload existing materials</b><br/>Prior course documents, certifications, anchor resources"]
    C["<b>Step 3. AI drafts the six units</b><br/>Essential questions, standards, topics, assessments"]
    D["<b>Step 4. Teacher refines each unit</b><br/>Edit content, swap standards, adjust language functions"]
    E["<b>Step 5. AI fills the course overview</b><br/>Pages 1 and 2 are written after the units, in the order your template uses"]

    A --> B --> C --> D --> E

    classDef step fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    class A,B,C,D,E step`;

const AUTO_FILLED = [
  'The mandatory Introduction Topic row (POG attribute, CELP Standard 4, intro to the unit essential question, real-world connection)',
  'The mandatory End of Unit Reflections (Portfolio Requirement: Essential Question and Portfolio Requirement: POG Reflection)',
  'Multilingual Language Learner Strategies block (CELP framework boilerplate)',
  'Spanish and Portuguese cognates for the Key Academic Vocabulary',
  'Dropdown values: POG Attribute, CELP Standard, Language Function, Assessment Type, Opportunity Type',
];

const REFINED = [
  'Course Description (drafted after the six units, per your workflow)',
  'Overarching Course Essential Question',
  'Per-unit Essential Question, Enduring Understanding, and Guiding Questions',
  'Career Connected Lens and Real World Connection for each unit',
  'Per-topic content goals and the variable parts of the Assessment Description sentence stem',
  'Aligned Resources and Topic Resources links',
];

const NOT_THIS = [
  'Not an evaluation tool. Drafts are the teacher\'s, not shared with administrators automatically.',
  'Not a standards replacement. Pathway-specific national standards (NCHSE, ITEEA, CS Standards, FCS, National Art Standards, and the rest) remain the source of truth.',
  'Not a one-shot. The point is six units feeding into a course, with the course overview written last.',
  'Not student-facing. The tool runs on the teacher\'s side. Student data does not flow through it.',
];

export default function CurriculumArchitecturePage() {
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
          <span className="text-xs text-[#1E1B4B]/50 font-medium">May 18, 2026</span>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-3">
            Architecture brief
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Curriculum Unit Starter
          </h1>
          <p className="text-base sm:text-lg text-[#1E1B4B]/70 leading-relaxed">
            A tool that gives Danbury teachers a working draft of a full year-long course to refine. Six units, in the order your template already uses. Teachers get their contractual hours back for refinement.
          </p>
          <p className="text-sm text-[#1E1B4B]/50 mt-4">
            Prepared by Brayan Tenesaca, Co-Founder, Next Generation Learners
          </p>

          <div className="mt-8 rounded-lg border border-[#4F46E5]/20 bg-[#4F46E5]/5 px-5 py-4">
            <p className="text-sm">
              <span className="font-semibold text-[#4F46E5]">Try it: </span>
              <Link
                href="/demo"
                className="text-[#4F46E5] hover:opacity-70 transition underline underline-offset-2 font-medium"
              >
                nextgenerationlearners.com/demo
              </Link>
            </p>
            <p className="text-sm text-[#1E1B4B]/70 mt-1">
              A working prototype. Open it, drop in a lesson plan, see what comes back.
            </p>
          </div>
        </div>

        <Section title="What you can do with this">
          <p className="text-[#1E1B4B]/75 leading-relaxed mb-5">
            Built from the year-long course template you sent on May 18, the Unit Components descriptions, Backward Design, and the Language Function framework. The five steps below are mapped to your exact workflow: write units first, fill pages 1 and 2 last.
          </p>
          <p className="text-[#1E1B4B]/75 leading-relaxed mb-4">
            Three ways this page is yours to use:
          </p>
          <ol className="space-y-3">
            <li className="flex items-start gap-3 text-[#1E1B4B]/75 leading-relaxed">
              <span className="text-[#4F46E5] font-bold mt-0.5 shrink-0">1.</span>
              <span><strong className="text-[#1E1B4B] font-semibold">Validate the workflow.</strong> Read it cold and tell me if steps 1 through 5 match how your teachers actually move through the template.</span>
            </li>
            <li className="flex items-start gap-3 text-[#1E1B4B]/75 leading-relaxed">
              <span className="text-[#4F46E5] font-bold mt-0.5 shrink-0">2.</span>
              <span><strong className="text-[#1E1B4B] font-semibold">Show your team without me on the call.</strong> Christy, Danielle, or any teacher you would pilot with can see the proposed flow before committing.</span>
            </li>
            <li className="flex items-start gap-3 text-[#1E1B4B]/75 leading-relaxed">
              <span className="text-[#4F46E5] font-bold mt-0.5 shrink-0">3.</span>
              <span><strong className="text-[#1E1B4B] font-semibold">Define pilot success criteria.</strong> Each step has a concrete output we can agree on as the bar for &ldquo;this worked.&rdquo;</span>
            </li>
          </ol>
        </Section>

        <Section title="How it works">
          <MermaidDiagram chart={CURRICULUM_CHART} id="curriculum" />
        </Section>

        <Section title="More information">
          <p className="text-sm text-[#1E1B4B]/60 mb-4">
            Tap any section to read more.
          </p>
          <div className="space-y-3">
            <Disclosure title="What gets auto-filled">
              <p className="text-[#1E1B4B]/75 leading-relaxed mb-4">
                The pieces that follow your template the same way every unit, every course:
              </p>
              <ul className="space-y-2">
                {AUTO_FILLED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[#1E1B4B]/75 leading-relaxed">
                    <span className="text-[#4F46E5] font-bold mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Disclosure>

            <Disclosure title="What teachers refine">
              <p className="text-[#1E1B4B]/75 leading-relaxed mb-4">
                The content that actually requires teacher expertise:
              </p>
              <ul className="space-y-2">
                {REFINED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[#1E1B4B]/75 leading-relaxed">
                    <span className="text-[#4F46E5] font-bold mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Disclosure>

            <Disclosure title="What this is not">
              <ul className="space-y-2">
                {NOT_THIS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[#1E1B4B]/75 leading-relaxed">
                    <span className="text-[#4F46E5] font-bold mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Disclosure>
          </div>
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

function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-lg border border-[#1E1B4B]/10 bg-white">
      <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-[#1E1B4B] flex items-center justify-between hover:bg-[#FAFBFF] transition select-none">
        <span>{title}</span>
        <span className="text-[#4F46E5] text-2xl font-light leading-none group-open:rotate-45 transition-transform">+</span>
      </summary>
      <div className="px-5 pb-5 pt-2 border-t border-[#1E1B4B]/10">
        {children}
      </div>
    </details>
  );
}
