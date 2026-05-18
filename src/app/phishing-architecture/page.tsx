import type { Metadata } from 'next';
import Link from 'next/link';
import { MermaidDiagram } from '@/components/MermaidDiagram';

export const metadata: Metadata = {
  title: 'Phishing Detection Chrome Extension — Architecture',
  description:
    'Local-only Chrome extension that catches display-name impersonation phishing in Gmail. Built for Danbury Public Schools.',
  alternates: { canonical: '/phishing-architecture' },
  openGraph: {
    title: 'Phishing Detection Chrome Extension — Architecture',
    description:
      'Local-only Chrome extension architecture. Display-name impersonation detection in Gmail.',
    locale: 'en_US',
  },
};

const PHISHING_CHART = `flowchart TB
    A["Step 1. Email arrives<br/>in the teacher's Gmail tab"]
    B["Step 2. Extension reads<br/>the sender's display name and domain<br/>(runs on the teacher's device)"]
    C["Step 3. Compare against<br/>the trusted contacts list<br/>(stored on the same device)"]
    D["Step 4. If the display name matches<br/>but the domain does not,<br/>a red warning appears above the email"]

    A --> B --> C --> D

    classDef step fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    class A,B,C,D step`;

const PRIVACY_POINTS = [
  {
    title: 'Everything stays in the browser',
    body: 'No email content, metadata, or user behavior leaves the teacher\'s machine. The extension never talks to an NGL server. There is no NGL server.',
  },
  {
    title: 'Local browser storage is the only data store',
    body: 'Contains the trusted contacts list and the teacher\'s mark-safe decisions. Lives on the teacher\'s device only. Wiped when the extension is uninstalled.',
  },
  {
    title: 'No telemetry, no analytics, no update pings',
    body: 'Updates flow through Chrome\'s standard extension auto-update mechanism. Nothing else.',
  },
];

const FLAG_CASES: { scenario: string; flag: 'Yes' | 'No' }[] = [
  {
    scenario: 'Display name "Kara Casimiro" + domain danbury.k12.ct.us (known good)',
    flag: 'No',
  },
  {
    scenario: 'Display name "Kara Casimiro" + domain gmail-securl.com (mismatch)',
    flag: 'Yes',
  },
  {
    scenario: 'Display name "Random Vendor" + domain random-vendor.com (not in list)',
    flag: 'No',
  },
  {
    scenario: 'Empty display name + suspicious domain',
    flag: 'No',
  },
];

const NOT_THIS = [
  'Not a spam filter (Gmail already does that)',
  'Not a URL scanner (browsers already do that)',
  'Not an attachment sandbox',
  'Not a SOC-style detection platform',
  'Not a teacher-monitoring tool. It never reports teacher behavior anywhere.',
];

export default function PhishingArchitecturePage() {
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
            Phishing Detection Chrome Extension
          </h1>
          <p className="text-base sm:text-lg text-[#1E1B4B]/70 leading-relaxed">
            A single-purpose Chrome extension that catches the most common phishing pattern teachers fall for: display-name impersonation of someone they already trust. Not a platform. Not a security suite. One job.
          </p>
          <p className="text-sm text-[#1E1B4B]/50 mt-4">
            Prepared by Brayan Tenesaca, Co-Founder, Next Generation Learners
          </p>
        </div>

        <Section title="The detection logic in one line">
          <p className="text-[#1E1B4B]/75 leading-relaxed">
            If the sender&apos;s display name matches a trusted contact but the domain does not match that contact&apos;s known domain, flag it. Otherwise, leave the email alone.
          </p>
        </Section>

        <Section title="What you can do with this">
          <p className="text-[#1E1B4B]/75 leading-relaxed mb-5">
            Built from what you described about phishing at Danbury on May 12. The four steps below show how a focused defense would work and what someone would need to do to build it.
          </p>
          <p className="text-[#1E1B4B]/75 leading-relaxed mb-4">
            Three ways this page is yours to use:
          </p>
          <ol className="space-y-3">
            <li className="flex items-start gap-3 text-[#1E1B4B]/75 leading-relaxed">
              <span className="text-[#4F46E5] font-bold mt-0.5 shrink-0">1.</span>
              <span><strong className="text-[#1E1B4B] font-semibold">Walk anyone through the tool in thirty seconds.</strong> No engineer, vendor, or admin needs me on the line for the page to land.</span>
            </li>
            <li className="flex items-start gap-3 text-[#1E1B4B]/75 leading-relaxed">
              <span className="text-[#4F46E5] font-bold mt-0.5 shrink-0">2.</span>
              <span><strong className="text-[#1E1B4B] font-semibold">Evaluate any vendor against it.</strong> If a vendor cannot honor every step, especially where the data lives, they do not match your need.</span>
            </li>
            <li className="flex items-start gap-3 text-[#1E1B4B]/75 leading-relaxed">
              <span className="text-[#4F46E5] font-bold mt-0.5 shrink-0">3.</span>
              <span><strong className="text-[#1E1B4B] font-semibold">Hand it to a builder.</strong> A developer has a clear specification to implement without further explanation from me.</span>
            </li>
          </ol>
        </Section>

        <Section title="How it works">
          <MermaidDiagram chart={PHISHING_CHART} id="phishing" />
        </Section>

        <Section title="More information">
          <p className="text-sm text-[#1E1B4B]/60 mb-4">
            Tap any section to read more.
          </p>
          <div className="space-y-3">
            <Disclosure title="Privacy boundaries">
              <ul className="space-y-5">
                {PRIVACY_POINTS.map((p) => (
                  <li key={p.title}>
                    <h3 className="font-semibold text-[#1E1B4B] mb-1">{p.title}</h3>
                    <p className="text-[#1E1B4B]/75 leading-relaxed">{p.body}</p>
                  </li>
                ))}
              </ul>
            </Disclosure>

            <Disclosure title="How trusted contacts gets populated">
              <p className="text-[#1E1B4B]/75 leading-relaxed mb-4">
                Two paths. The teacher controls both.
              </p>
              <ol className="space-y-3 text-[#1E1B4B]/75 leading-relaxed">
                <li>
                  <span className="font-semibold text-[#1E1B4B]">Auto-bootstrap (opt-in).</span>{' '}
                  On first install the extension can scan the user&apos;s last 90 days of sent mail and build a list of people they regularly email. The mapping is name to known domain.
                </li>
                <li>
                  <span className="font-semibold text-[#1E1B4B]">Manual add.</span>{' '}
                  The teacher can add or edit entries any time. Useful for new colleagues, family members, vendors.
                </li>
              </ol>
              <p className="text-[#1E1B4B]/75 leading-relaxed mt-4">
                The list lives on the teacher&apos;s machine only.
              </p>
            </Disclosure>

            <Disclosure title="What gets flagged vs left alone">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1E1B4B]/10">
                      <th className="text-left py-3 pr-4 font-semibold text-[#1E1B4B]">Scenario</th>
                      <th className="text-left py-3 font-semibold text-[#1E1B4B] w-20">Flag?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FLAG_CASES.map((c) => (
                      <tr key={c.scenario} className="border-b border-[#1E1B4B]/5">
                        <td className="py-3 pr-4 text-[#1E1B4B]/75">{c.scenario}</td>
                        <td
                          className={
                            c.flag === 'Yes'
                              ? 'py-3 font-bold text-[#c62828]'
                              : 'py-3 font-semibold text-[#2e7d32]'
                          }
                        >
                          {c.flag}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[#1E1B4B]/75 leading-relaxed mt-4">
                V1 is intentionally narrow. It catches the impersonation case (the most damaging) and ignores everything else. No false-positive noise.
              </p>
            </Disclosure>

            <Disclosure title="What this is not">
              <ul className="space-y-2">
                {NOT_THIS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[#1E1B4B]/75">
                    <span className="text-[#4F46E5] font-bold mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Disclosure>

            <Disclosure title="Deployment model">
              <ul className="space-y-3 text-[#1E1B4B]/75 leading-relaxed">
                <li>
                  <span className="font-semibold text-[#1E1B4B]">Distribution.</span>{' '}
                  A .crx file or a private Chrome Web Store listing scoped to the danbury.k12.ct.us domain.
                </li>
                <li>
                  <span className="font-semibold text-[#1E1B4B]">Install.</span>{' '}
                  One click per teacher. No IT touch required after the initial push.
                </li>
                <li>
                  <span className="font-semibold text-[#1E1B4B]">Update.</span>{' '}
                  Standard Chrome extension auto-update.
                </li>
                <li>
                  <span className="font-semibold text-[#1E1B4B]">Removal.</span>{' '}
                  Standard uninstall. Takes the local storage with it.
                </li>
              </ul>
            </Disclosure>
          </div>
        </Section>

        <Section title="Build effort">
          <p className="text-[#1E1B4B]/75 leading-relaxed">
            Weekend-scale. Single content script, single background service worker, single options page for the trusted contacts editor. No backend to stand up.
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
