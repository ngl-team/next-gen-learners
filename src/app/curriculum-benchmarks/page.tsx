import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Danbury Curriculum Team',
  description:
    'A pre-meeting brief on what districts inside and outside Connecticut have done with AI on curriculum work in the last 18 months. Wins and cautionary tales both.',
  alternates: { canonical: '/curriculum-benchmarks' },
  openGraph: {
    title: 'Danbury Curriculum Team',
    description:
      'Pre-meeting brief on K-12 AI for curriculum writing. State pilots, district initiatives, vendor data points, and a Texas cautionary tale.',
    locale: 'en_US',
  },
};

type Source = { label: string; url: string };

const CT_STATE: { title: string; body: string }[] = [
  {
    title: 'CT Responsible AI Use Framework (Feb 2024)',
    body: 'Connecticut was one of the first states to publish a formal framework for K-12 AI use. 22 pages, classroom and admin scope.',
  },
  {
    title: 'CSDE AI Pilot Program (Jan to Jun 2025)',
    body: 'Authorized by Public Act 24-151. Grades 7-12 focus. Grants of $50,000 to $100,000 per district. State-approved vendors: MagicSchool AI, SchoolAI, CK-12 Foundation, Cloud Navigator, SNORKL. Seven pilot districts: East Hartford, Lebanon, Rocky Hill, Seymour, Waterford, Westport, and Odyssey Community School (Manchester).',
  },
  {
    title: 'The admin-tier gap',
    body: 'No public Connecticut district has yet reported AI use at the curriculum admin tier (scope and sequence, pacing guides, standards alignment audits, vertical articulation). State pilot work has been student-facing and teacher-facing. The administrative layer of curriculum work remains open ground in Connecticut.',
  },
];

const CT_DISTRICTS: { district: string; body: string }[] = [
  {
    district: 'East Hartford Public Schools',
    body: 'Approximately $100,000 state grant. Phased rollout. Teachers first for curriculum development, lesson planning, and formative assessments, then students. Tools: MagicSchool AI and Cloud Navigator.',
  },
  {
    district: 'Westport Public Schools',
    body: '$100,000 state grant. MagicSchool AI and SchoolAI deployed at Bedford Middle and Staples High. Strategic plan includes a K-12 AI literacy curriculum and a Code of Ethics for student use.',
  },
  {
    district: 'Norwalk Public Schools (AI at NPS)',
    body: 'District-wide initiative outside the state pilot. District-approved prompt library for teachers covering lesson design, rubrics, and formative assessments. MagicSchool PD delivered across six schools. Participates in EDSAFE AI Alliance Policy Labs.',
  },
  {
    district: 'New Haven Public Schools',
    body: 'AI policy drafted August 2025. Frame: AI will support but not substitute teachers. PD partners include AFT and Google.',
  },
];

const REGIONAL: { name: string; body: string }[] = [
  {
    name: 'Massachusetts DESE + MA Tech Collaborative + PLTW',
    body: 'AI curriculum pilot reaching approximately 1,600 students across 30 districts (announced 2025).',
  },
  {
    name: 'Boston Public Schools',
    body: 'First major US district to require AI fluency for high school graduation. Announced March 2026 with a $1M private donation from Paul English. UMass Boston is building the curriculum. Teachers train summer 2026 for fall 2026 instruction.',
  },
  {
    name: 'Rhode Island Department of Education',
    body: '53-page AI guidance released August 2025. Survey data: 20% of Rhode Island students use AI, only 6% of educators do.',
  },
  {
    name: 'Westchester County, NY',
    body: 'Irvington teachers using MagicSchool AI for prompts, quizzes, and leveled reading. Port Chester formed an AI task force with a state grant. Chappaqua hosted an international AI PD event in April 2025.',
  },
];

const NATIONAL: { name: string; body: string }[] = [
  {
    name: 'Houston ISD (Texas)',
    body: 'District-wide ChatGPT Edu deployment for teachers and staff. Formal HISD AI Guidebook published with AI for Education. Launched a "Fundamentals of AI" elective reaching 3,700+ students across 41 campuses. Nine dedicated AI-focused "Future 2" campuses open 2026-27.',
  },
  {
    name: 'Dallas ISD (Texas)',
    body: 'Won a $1.7M Texas Instruments Foundation grant for AI middle school math tooling. AI-powered essay grading deployed in reading and language arts. District-wide rollout planned for 2025-26.',
  },
  {
    name: 'Frisco ISD (Texas)',
    body: 'Locally built an AI tutor named "Captain Solve It" at Izetta Sparks Elementary. Created in-house by the campus digital learning coach. Flags struggling students to teachers.',
  },
  {
    name: 'Rye Country Day School (Rye, NY)',
    body: 'First independent school in the country to pilot OpenAI\'s enterprise platform for educators (spring 2026). Built five overlapping faculty AI groups, named internal AI specialists, customized "AI Friction Scale" for assignment design.',
  },
  {
    name: 'St. Luke\'s School (New Canaan, CT)',
    body: 'Faculty PLC dedicated to AI in education. School-wide workshop led by Dr. John Spencer. Embedded "Emerging Technologies and AI Ethics" curriculum across grades.',
  },
];

const VENDOR_DATA: { label: string; body: string }[] = [
  {
    label: 'MagicSchool AI',
    body: 'Teachers in deployed districts self-report 7 to 10 hours per week saved on planning, differentiation, and assessments. 13,000+ schools globally (vendor claim).',
  },
  {
    label: 'Pricing context',
    body: 'CT state pilot grants ranged from $50,000 to $100,000 per district. Dallas ISD\'s Texas Instruments Foundation grant was $1.7M for AI math tooling specifically.',
  },
];

const ADMIN_GAP_ITEMS = [
  'Scope and sequence drafting',
  'Pacing guide creation',
  'Standards alignment audits',
  'Vertical articulation gap analysis',
  'Curriculum review cycle acceleration',
  'Equity audit assistance',
];

const SOURCES: Source[] = [
  { label: 'CT Responsible AI Framework', url: 'https://portal.ct.gov/-/media/OPM/Fin-General/Policies/CT-Responsible-AI-Policy-Framework-Final-02012024.pdf' },
  { label: 'CSDE AI Pilot announcement', url: 'https://portal.ct.gov/sde/press-room/press-releases/2025/csde-launches-groundbreaking-artificial-intelligence-pilot-program' },
  { label: 'East Hartford rollout', url: 'https://citizenportal.ai/articles/6283796' },
  { label: 'Westport pilot', url: 'https://westportjournal.com/education/westport-schools-to-help-ai-pilot-programs-navigate-classrooms/' },
  { label: 'Norwalk AI at NPS', url: 'https://www.norwalkps.org/departments/technology-and-innovation/ainps' },
  { label: 'New Haven AI policy', url: 'https://www.newhavenindependent.org/2025/08/04/nhps_ai/' },
  { label: 'Massachusetts AI pilot', url: 'https://www.mass.gov/news/new-ai-curriculum-pilot-to-reach-1600-massachusetts-students-across-30-school-districts' },
  { label: 'Boston AI fluency requirement', url: 'https://www.wbur.org/news/2026/03/26/boston-public-schools-ai-literacy' },
  { label: 'Rhode Island guidance', url: 'https://ride.ri.gov/press-releases/rhode-island-department-education-releases-guidance-responsible-use-artificial-intelligence-schools' },
  { label: 'Westchester schools AI', url: 'https://westchestermagazine.com/life-style/ai-future-education/' },
  { label: 'Houston ISD AI Guidebook', url: 'https://www.aiforeducation.io/blog/houston-isd-ai-guidebook' },
  { label: 'Houston ChatGPT Edu rollout', url: 'https://www.houstonisd.org/p/~board/district-news/post/houston-isd-equips-educators-with-newsecure-ai-tools-through-chatgpt-edu-rollout' },
  { label: 'Dallas ISD AI initiative', url: 'https://thehub.dallasisd.org/2025/08/19/district-leads-innovation-with-ai-in-classrooms/' },
  { label: 'Frisco ISD AI tutor', url: 'https://www.nbcdfw.com/news/local/carter-in-the-classroom/frisco-isd-students-ai-math-problems/3944952/' },
  { label: 'Rye Country Day AI program', url: 'https://www.msaevolutionlab.com/blog-full/skills-first-technology-second-how-rye-country-day-school-built-ai-around-competency-based-learning' },
  { label: 'St. Luke\'s School AI', url: 'https://www.stlukesct.org/ms-news-detail?pk=1580912' },
  { label: 'Texas Bluebonnet corrections (TX Tribune)', url: 'https://www.texastribune.org/2026/02/25/texas-board-education-correct-bluebonnet-errors/' },
  { label: 'Texas Bluebonnet adoption (CBS)', url: 'https://www.cbsnews.com/texas/news/some-north-texas-school-districts-adopt-controversial-bluebonnet-learning-curriculum/' },
];

export default function CurriculumBenchmarksPage() {
  return (
    <main className="min-h-screen bg-[#FAFBFF] text-[#1E1B4B]">
      <header className="border-b border-[#1E1B4B]/10 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold uppercase tracking-[0.18em] text-[#4F46E5] hover:opacity-70 transition">
            Next Generation Learners
          </Link>
          <span className="text-xs text-[#1E1B4B]/50 font-medium">May 12, 2026</span>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-3">Pre-meeting brief</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            AI for Curriculum Work: National and Regional Benchmarks
          </h1>
          <p className="text-base sm:text-lg text-[#1E1B4B]/70 leading-relaxed">
            What districts inside and outside Connecticut have publicly done with AI on curriculum work in the last 18 months. Wins, gaps, and one cautionary tale.
          </p>
          <p className="text-sm text-[#1E1B4B]/50 mt-4">
            Prepared by Brayan Tenesaca, Co-Founder, Next Generation Learners
          </p>
        </div>

        <Section title="Connecticut State Context">
          <ul className="space-y-5">
            {CT_STATE.map((item) => (
              <li key={item.title}>
                <h3 className="font-semibold text-[#1E1B4B] mb-1">{item.title}</h3>
                <p className="text-[#1E1B4B]/75 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Connecticut District Activity">
          <ul className="space-y-5">
            {CT_DISTRICTS.map((item) => (
              <li key={item.district}>
                <h3 className="font-semibold text-[#1E1B4B] mb-1">{item.district}</h3>
                <p className="text-[#1E1B4B]/75 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Regional Peers">
          <ul className="space-y-5">
            {REGIONAL.map((item) => (
              <li key={item.name}>
                <h3 className="font-semibold text-[#1E1B4B] mb-1">{item.name}</h3>
                <p className="text-[#1E1B4B]/75 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="National Leaders">
          <ul className="space-y-5">
            {NATIONAL.map((item) => (
              <li key={item.name}>
                <h3 className="font-semibold text-[#1E1B4B] mb-1">{item.name}</h3>
                <p className="text-[#1E1B4B]/75 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="A Cautionary Tale: Texas Bluebonnet Learning">
          <div className="space-y-4 text-[#1E1B4B]/75 leading-relaxed">
            <p>
              <span className="font-semibold text-[#1E1B4B]">What it is.</span>{' '}
              State-published K-5 ELAR, K-3 phonics, and K-8 + Algebra I math curriculum, approved by the Texas State Board of Education in November 2024. Districts that adopt receive $60 per student versus $40 for other state-approved materials.
            </p>
            <p>
              <span className="font-semibold text-[#1E1B4B]">What went wrong.</span>{' '}
              In January and February 2026, the SBOE voted to require approximately 4,200 corrections. These included 500+ images with licensing issues, missing answer keys, factual errors, and content critics flagged as religiously biased.
            </p>
            <p>
              <span className="font-semibold text-[#1E1B4B]">Adoption reality.</span>{' '}
              Only 5 of 59 surveyed North Texas districts adopted the ELAR component.
            </p>
            <p>
              <span className="font-semibold text-[#1E1B4B]">The lesson.</span>{' '}
              Scaling curriculum production through technology without strong local review capacity produces volume but not quality. AI accelerates the writing. Educator review owns the standard.
            </p>
          </div>
        </Section>

        <Section title="Vendor Data Points">
          <ul className="space-y-5">
            {VENDOR_DATA.map((item) => (
              <li key={item.label}>
                <h3 className="font-semibold text-[#1E1B4B] mb-1">{item.label}</h3>
                <p className="text-[#1E1B4B]/75 leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="The Gap">
          <p className="text-[#1E1B4B]/75 leading-relaxed mb-4">
            Across all districts and schools surveyed for this brief, no Connecticut district has publicly reported AI use specifically for the curriculum admin tier:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {ADMIN_GAP_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[#1E1B4B]/75">
                <span className="text-[#4F46E5] font-bold mt-0.5">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[#1E1B4B]/75 leading-relaxed">
            Existing CT initiatives focus on student-facing tools (grades 7-12) or teacher-facing lesson planning. The administrative layer of curriculum work remains open ground in Connecticut.
          </p>
        </Section>

        <section className="mt-16 pt-12 border-t border-[#1E1B4B]/10">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#4F46E5] mb-6">Sources</h2>
          <ul className="space-y-2">
            {SOURCES.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1E1B4B]/75 hover:text-[#4F46E5] underline underline-offset-2 decoration-[#1E1B4B]/20 hover:decoration-[#4F46E5] transition break-words"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 pt-8 border-t border-[#1E1B4B]/10 text-center">
          <p className="text-sm text-[#1E1B4B]/60 mb-2">Questions or want to discuss?</p>
          <a
            href="mailto:brayan@nextgenerationlearners.com"
            className="text-base font-semibold text-[#4F46E5] hover:opacity-70 transition"
          >
            brayan@nextgenerationlearners.com
          </a>
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
