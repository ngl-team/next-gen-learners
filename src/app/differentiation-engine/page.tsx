'use client';

import { useState, useEffect, useCallback } from 'react';

interface Classroom { id: number; name: string; grade: string; subject: string; class_size: number; special_notes: string; }
interface ToolOutput { id: number; classroom_id: number; classroom_name: string; grade: string; subject: string; tool: string; input_data: string; generated_output: string; created_at: string; }

type View = 'login' | 'main' | 'generate' | 'view';

export default function DifferentiationEngine() {
  const [view, setView] = useState<View>('login');
  const [password, setPassword] = useState('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [outputs, setOutputs] = useState<ToolOutput[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<ToolOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ classroom_id: 0, lesson_topic: '', lesson_content: '', focus_areas: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const authCheck = await fetch('/api/auth/check');
      if (!authCheck.ok) { setView('login'); setLoading(false); return; }
      const [classroomsRes, outputsRes] = await Promise.all([
        fetch('/api/classrooms'),
        fetch('/api/tools/outputs?tool=differentiate'),
      ]);
      if (classroomsRes.ok) setClassrooms(await classroomsRes.json());
      if (outputsRes.ok) setOutputs(await outputsRes.json());
      if (view === 'login') setView('main');
    } catch { setError('Failed to load data'); }
    setLoading(false);
  }, [view]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (res.ok) { setPassword(''); setView('main'); await loadData(); } else { setError('Invalid password.'); }
  };

  const generate = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setGenerating(true);
    try {
      const res = await fetch('/api/tools/differentiate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        await loadData();
        const outputRes = await fetch(`/api/tools/outputs/${data.id}`);
        if (outputRes.ok) { setSelectedOutput(await outputRes.json()); setView('view'); }
        setForm({ classroom_id: 0, lesson_topic: '', lesson_content: '', focus_areas: '' });
      } else { setError(data.error || 'Failed to generate'); }
    } catch { setError('Failed to generate'); }
    setGenerating(false);
  };

  const deleteOutput = async (id: number) => {
    if (!confirm('Delete this output?')) return;
    await fetch(`/api/tools/outputs/${id}`, { method: 'DELETE' });
    setSelectedOutput(null); setView('main'); await loadData();
  };

  const viewOutput = async (id: number) => {
    const res = await fetch(`/api/tools/outputs/${id}`);
    if (res.ok) { setSelectedOutput(await res.json()); setView('view'); }
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white border border-[#E5E7EB] rounded-xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-[#1E1B4B] text-center mb-1">Differentiation Engine</h1>
          <p className="text-sm text-[#6B7280] text-center mb-6">Sign in to get started</p>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#374151] mb-1">Password</label>
            <input type="password" required placeholder="Enter password" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm">Sign In</button>
        </form>
      </div>
    );
  }

  if (loading && classrooms.length === 0) {
    return <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center"><p className="text-[#6B7280]">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      <div className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1B4B]">Differentiation Engine</h1>
            <p className="text-sm text-[#6B7280] mt-1">Adapt any lesson for ELL, advanced, and IEP students</p>
          </div>
          <div className="flex gap-3">
            {view !== 'main' && <button onClick={() => setView('main')} className="px-4 py-2 text-sm border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F3F4F6] transition">Back</button>}
            {view === 'main' && (
              <button onClick={() => { if (classrooms.length === 0) { setError('Create a classroom first in Lesson Planner'); return; } setForm({ ...form, classroom_id: classrooms[0].id }); setView('generate'); }} className="px-4 py-2 text-sm bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium">+ Differentiate a Lesson</button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}<button onClick={() => setError('')} className="float-right font-bold">&times;</button></div>}

        {view === 'main' && (
          <>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-[#1E1B4B]">Saved Differentiations</h2>
              <span className="text-sm text-[#6B7280]">{outputs.length} saved</span>
            </div>
            {outputs.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
                <p className="text-[#6B7280]">No differentiated lessons yet. Adapt your first lesson above.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {outputs.map((o) => {
                  const inputData = JSON.parse(o.input_data || '{}');
                  return (
                    <button key={o.id} onClick={() => viewOutput(o.id)} className="w-full text-left bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#4F46E5] transition flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-[#1E1B4B]">{inputData.lesson_topic || 'Untitled'}</div>
                        <div className="text-sm text-[#6B7280] mt-0.5">{o.classroom_name} &middot; {o.grade} {o.subject}</div>
                      </div>
                      <div className="text-xs text-[#9CA3AF]">{o.created_at?.slice(0, 10)}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {view === 'generate' && (
          <form onSubmit={generate} className="bg-white border border-[#E5E7EB] rounded-xl p-6 max-w-lg">
            <h2 className="text-lg font-semibold text-[#1E1B4B] mb-1">Differentiate a Lesson</h2>
            <p className="text-sm text-[#6B7280] mb-6">Tell us about the lesson and we&apos;ll create adaptations for all learner levels.</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Classroom</label>
              <select required className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.classroom_id} onChange={(e) => setForm({ ...form, classroom_id: Number(e.target.value) })}>
                {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.grade} {c.subject}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Lesson Topic</label>
              <input type="text" required placeholder="e.g., Introduction to fractions, The water cycle" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.lesson_topic} onChange={(e) => setForm({ ...form, lesson_topic: e.target.value })} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Lesson Content / Plan (optional)</label>
              <textarea placeholder="Paste your existing lesson plan or describe the lesson activities..." className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] min-h-[100px]" value={form.lesson_content} onChange={(e) => setForm({ ...form, lesson_content: e.target.value })} />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#374151] mb-1">Focus Areas (optional)</label>
              <textarea placeholder="e.g., Focus on ELL students, I have 2 students with IEPs for reading comprehension..." className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] min-h-[80px]" value={form.focus_areas} onChange={(e) => setForm({ ...form, focus_areas: e.target.value })} />
            </div>

            <button type="submit" disabled={generating} className={`px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {generating ? 'Generating differentiation guide...' : 'Differentiate Lesson'}
            </button>
          </form>
        )}

        {view === 'view' && selectedOutput && (
          <div>
            <div className="flex gap-3 text-sm text-[#6B7280] mb-4">
              <span>{selectedOutput.classroom_name}</span><span>&middot;</span>
              <span>{selectedOutput.grade} {selectedOutput.subject}</span><span>&middot;</span>
              <span>{selectedOutput.created_at?.slice(0, 10)}</span>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedOutput.generated_output
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^- (.*$)/gm, '<li>$1</li>')
                .replace(/\n\n/g, '<br/><br/>')
                .replace(/\n/g, '<br/>')
              }} />
            </div>
            <div className="flex justify-between items-center mt-6">
              <button onClick={() => { setView('generate'); setForm({ ...form, classroom_id: selectedOutput.classroom_id }); }} className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm">Differentiate Another</button>
              <button onClick={() => deleteOutput(selectedOutput.id)} className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
