'use client';

import { useRef, useState } from 'react';
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
const LAS_LEVELS = [
  { value: '1 (Beginning)', label: '1 - Beginning' },
  { value: '2 (Early Intermediate)', label: '2 - Early Intermediate' },
  { value: '3 (Intermediate)', label: '3 - Intermediate' },
  { value: '4 (Proficient)', label: '4 - Proficient' },
  { value: '5 (Above Proficient)', label: '5 - Above Proficient' },
];

const SEED = {
  grade: '5',
  subject: 'Math',
  standard:
    '5.NF.B.4 - Apply and extend previous understandings of multiplication to multiply a fraction or whole number by a fraction.',
  pog_attribute: 'Critical Thinker',
  language_function: 'Justify',
  las_level: '3 (Intermediate)',
};

type Tab = 'output' | 'prompt';

export default function Demo() {
  const [form, setForm] = useState(SEED);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [output, setOutput] = useState('');
  const [promptUsed, setPromptUsed] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('output');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'output' | 'prompt' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOutput('');
    setPromptUsed('');
    setActiveTab('output');
    setGenerating(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (pdfFile) body.append('pdf', pdfFile);

      const res = await fetch('/api/demo/curriculum', { method: 'POST', body });
      const data = await res.json();
      if (res.ok) {
        setOutput(data.generated_output);
        setPromptUsed(data.prompt_used || '');
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

  const copy = async (which: 'output' | 'prompt') => {
    await navigator.clipboard.writeText(which === 'output' ? output : promptUsed);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearPdf = () => {
    setPdfFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
            Graduate attribute, and a Constructing Meaning language function together with LAS Links
            scaffolds for multilingual learners. Aligned to Common Core State Standards. Built so
            teacher hours go to customization rather than scaffolding from scratch.
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
                placeholder="Paste a CCSS code, a CT state standard, or write a learning target..."
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
                Multilingual learner LAS Links level to scaffold for
              </label>
              <select
                required
                value={form.las_level}
                onChange={(e) => setForm({ ...form, las_level: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] bg-white"
              >
                {LAS_LEVELS.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                Year-long curriculum PDF{' '}
                <span className="text-[#6B7280] font-normal">(optional)</span>
              </label>
              <p className="text-xs text-[#6B7280] mb-2">
                Drop a PDF of your year-long goals, standards, or scope-and-sequence. The unit
                starter will be positioned within the year-long arc and stay faithful to the
                trajectory already established.
              </p>
              {!pdfFile ? (
                <label
                  htmlFor="pdf-upload"
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-[#E5E7EB] rounded-lg text-sm text-[#6B7280] hover:border-[#4F46E5] hover:bg-[#FAFBFF] transition cursor-pointer"
                >
                  <span className="font-medium text-[#4F46E5]">Click to upload PDF</span>
                  <span className="ml-2">or drag and drop</span>
                </label>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 bg-[#F0F0FF] border border-[#C7C5FF] rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[#4F46E5] text-lg">PDF</span>
                    <span className="text-sm text-[#1E1B4B] font-medium truncate">
                      {pdfFile.name}
                    </span>
                    <span className="text-xs text-[#6B7280] flex-shrink-0">
                      {(pdfFile.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearPdf}
                    className="ml-3 text-xs text-[#6B7280] hover:text-[#1E1B4B] font-medium flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPdfFile(f);
                }}
              />
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
                Takes about 15 to 30 seconds. Seed is pre-filled for a Grade 5 math example.
              </p>
            )}
          </div>
        </form>

        {generating && (
          <div className="mt-8 bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#4F46E5] rounded-full animate-pulse" />
              <p className="text-sm text-[#6B7280]">
                {pdfFile
                  ? 'Reading your year-long curriculum and weaving standards into the unit...'
                  : 'Weaving standards, Portrait of the Graduate, and language function...'}
              </p>
            </div>
          </div>
        )}

        {output && (
          <div id="output" className="mt-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 sm:px-8 pt-5 pb-0 border-b border-[#E5E7EB]">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('output')}
                  className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition -mb-px ${
                    activeTab === 'output'
                      ? 'text-[#4F46E5] border-[#4F46E5]'
                      : 'text-[#6B7280] border-transparent hover:text-[#1E1B4B]'
                  }`}
                >
                  Unit Starter
                </button>
                <button
                  onClick={() => setActiveTab('prompt')}
                  className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition -mb-px ${
                    activeTab === 'prompt'
                      ? 'text-[#4F46E5] border-[#4F46E5]'
                      : 'text-[#6B7280] border-transparent hover:text-[#1E1B4B]'
                  }`}
                >
                  Prompt
                </button>
              </div>
              <button
                onClick={() => copy(activeTab)}
                className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md text-[#374151] hover:bg-[#F3F4F6] transition font-medium"
              >
                {copied === activeTab ? 'Copied' : `Copy ${activeTab === 'output' ? 'markdown' : 'prompt'}`}
              </button>
            </div>

            {activeTab === 'output' && (
              <article className="prose-curriculum px-6 sm:px-8 py-8">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
              </article>
            )}

            {activeTab === 'prompt' && (
              <div className="px-6 sm:px-8 py-8">
                <p className="text-sm text-[#6B7280] mb-4">
                  The exact instruction sent to Claude with your inputs filled in. Yours to keep,
                  edit, and run anywhere.
                </p>
                <pre className="bg-[#0F172A] text-[#E2E8F0] p-5 rounded-lg text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap break-words font-mono">
                  {promptUsed}
                </pre>
              </div>
            )}
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
