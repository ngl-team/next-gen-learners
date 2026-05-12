'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SUBJECTS = ['Math', 'Science', 'English Language Arts', 'Social Studies', 'World Language'];
const POG_ATTRIBUTES = ['Advocate', 'Collaborator', 'Communicator', 'Critical Thinker', 'Innovator'];
const LANGUAGE_FUNCTIONS = [
  'Describe',
  'Explain',
  'Compare and Contrast',
  'Justify',
  'Analyze',
  'Sequence',
  'Define',
  'Predict',
  'Summarize',
  'Persuade',
];
const WIDA_LEVELS = [
  { value: '1 (Entering)', label: '1 - Entering' },
  { value: '2 (Emerging)', label: '2 - Emerging' },
  { value: '3 (Developing)', label: '3 - Developing' },
  { value: '4 (Expanding)', label: '4 - Expanding' },
  { value: '5 (Bridging)', label: '5 - Bridging' },
];

const SEED = {
  grade: '5',
  subject: 'Math',
  standard:
    '5.NF.B.4 — Apply and extend previous understandings of multiplication to multiply a fraction or whole number by a fraction.',
  pog_attribute: 'Critical Thinker',
  language_function: 'Justify',
  wida_level: '3 (Developing)',
};

export default function Demo() {
  const [form, setForm] = useState(SEED);
  const [output, setOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOutput('');
    setGenerating(true);
    try {
      const res = await fetch('/api/demo/curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setOutput(data.generated_output);
        setTimeout(() => {
          document.getElementById('output')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError(data.error || 'Failed to generate');
      }
    } catch {
      setError('Failed to generate. Try again.');
    }
    setGenerating(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-xs uppercase tracking-[0.16em] text-[#4F46E5] font-semibold mb-3">
            Next Generation Learners / Demo
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B] mb-3">
            Curriculum Unit Starter
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-3xl">
            A first-draft curriculum unit that weaves your content standard, a Portrait of the
            Graduate attribute, and a Constructing Meaning language function together with WIDA
            scaffolds for multilingual learners. Built so teacher hours go to customization rather
            than scaffolding from scratch.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <form
          onSubmit={generate}
          className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Grade</label>
              <select
                required
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] bg-white"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">Subject</label>
              <select
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] bg-white"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                Content standard or learning target
              </label>
              <textarea
                required
                rows={3}
                value={form.standard}
                onChange={(e) => setForm({ ...form, standard: e.target.value })}
                placeholder="Paste a CT state standard, a CCSS code, or write a learning target..."
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                Portrait of the Graduate attribute
              </label>
              <select
                required
                value={form.pog_attribute}
                onChange={(e) => setForm({ ...form, pog_attribute: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] bg-white"
              >
                {POG_ATTRIBUTES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                Language function (Constructing Meaning)
              </label>
              <select
                required
                value={form.language_function}
                onChange={(e) => setForm({ ...form, language_function: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] bg-white"
              >
                {LANGUAGE_FUNCTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                Multilingual learner WIDA level to scaffold for
              </label>
              <select
                required
                value={form.wida_level}
                onChange={(e) => setForm({ ...form, wida_level: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] bg-white"
              >
                {WIDA_LEVELS.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <button
              type="submit"
              disabled={generating}
              className="px-6 py-3 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating unit starter...' : 'Generate Unit Starter'}
            </button>
            {!generating && (
              <p className="text-xs text-[#6B7280]">
                Takes about 15 to 25 seconds. Seed is pre-filled for a Grade 5 math example.
              </p>
            )}
          </div>
        </form>

        {generating && (
          <div className="mt-8 bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse" />
              <p className="text-sm text-[#6B7280]">
                Weaving standards, Portrait of the Graduate, and language function...
              </p>
            </div>
          </div>
        )}

        {output && (
          <div id="output" className="mt-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
            <div className="flex justify-between items-center px-6 sm:px-8 py-4 border-b border-[#E5E7EB]">
              <p className="text-xs uppercase tracking-[0.14em] text-[#4F46E5] font-semibold">
                Generated Unit Starter
              </p>
              <button
                onClick={copy}
                className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md text-[#374151] hover:bg-[#F3F4F6] transition font-medium"
              >
                {copied ? 'Copied' : 'Copy markdown'}
              </button>
            </div>
            <article className="prose-curriculum px-6 sm:px-8 py-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            </article>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-[#6B7280] mb-2">
            Want this calibrated to your district&apos;s exact Portrait of the Graduate attributes
            and standards?
          </p>
          <a
            href="mailto:brayan@nextgenerationlearners.com"
            className="text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition"
          >
            brayan@nextgenerationlearners.com
          </a>
        </div>
      </main>

      <style>{`
        .prose-curriculum { color: #1F2937; line-height: 1.7; font-size: 15px; }
        .prose-curriculum h1 { font-size: 1.75rem; font-weight: 700; color: #1E1B4B; margin: 0 0 1rem; }
        .prose-curriculum h2 { font-size: 1.25rem; font-weight: 700; color: #1E1B4B; margin: 2rem 0 0.75rem; padding-top: 1rem; border-top: 1px solid #F3F4F6; }
        .prose-curriculum h2:first-of-type { border-top: none; padding-top: 0; margin-top: 1.5rem; }
        .prose-curriculum h3 { font-size: 1rem; font-weight: 700; color: #1E1B4B; margin: 1.25rem 0 0.5rem; }
        .prose-curriculum p { margin: 0.75rem 0; }
        .prose-curriculum ul, .prose-curriculum ol { margin: 0.75rem 0; padding-left: 1.5rem; }
        .prose-curriculum li { margin: 0.35rem 0; }
        .prose-curriculum strong { color: #1E1B4B; font-weight: 600; }
        .prose-curriculum blockquote { border-left: 3px solid #4F46E5; padding-left: 1rem; margin: 1rem 0; color: #4B5563; font-style: italic; }
        .prose-curriculum code { background: #F3F4F6; padding: 0.1rem 0.35rem; border-radius: 0.25rem; font-size: 0.875em; }
        .prose-curriculum hr { border: none; border-top: 1px solid #E5E7EB; margin: 2rem 0; }
        .prose-curriculum table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
        .prose-curriculum th, .prose-curriculum td { border: 1px solid #E5E7EB; padding: 0.5rem 0.75rem; text-align: left; }
        .prose-curriculum th { background: #F9FAFB; font-weight: 600; color: #1E1B4B; }
      `}</style>
    </div>
  );
}
