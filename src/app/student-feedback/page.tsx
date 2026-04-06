'use client';

import { useState, useEffect, useCallback } from 'react';

interface Classroom { id: number; name: string; grade: string; subject: string; class_size: number; special_notes: string; }
interface ToolOutput { id: number; classroom_id: number; classroom_name: string; grade: string; subject: string; tool: string; input_data: string; generated_output: string; created_at: string; }

type View = 'login' | 'main' | 'generate' | 'view';

export default function StudentFeedback() {
  const [view, setView] = useState<View>('login');
  const [password, setPassword] = useState('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [outputs, setOutputs] = useState<ToolOutput[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<ToolOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ classroom_id: 0, student_name: '', assignment_description: '', student_work_description: '', strengths: '', areas_for_growth: '', tone: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const authCheck = await fetch('/api/auth/check');
      if (!authCheck.ok) { setView('login'); setLoading(false); return; }
      const [classroomsRes, outputsRes] = await Promise.all([
        fetch('/api/classrooms'),
        fetch('/api/tools/outputs?tool=student-feedback'),
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
      const res = await fetch('/api/tools/student-feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        await loadData();
        const outputRes = await fetch(`/api/tools/outputs/${data.id}`);
        if (outputRes.ok) { setSelectedOutput(await outputRes.json()); setView('view'); }
        setForm({ classroom_id: 0, student_name: '', assignment_description: '', student_work_description: '', strengths: '', areas_for_growth: '', tone: '' });
      } else { setError(data.error || 'Failed to generate'); }
    } catch { setError('Failed to generate'); }
    setGenerating(false);
  };

  const deleteOutput = async (id: number) => {
    if (!confirm('Delete this feedback?')) return;
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
          <h1 className="text-2xl font-bold text-[#1E1B4B] text-center mb-1">Student Feedback Writer</h1>
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
            <h1 className="text-2xl font-bold text-[#1E1B4B]">Student Feedback Writer</h1>
            <p className="text-sm text-[#6B7280] mt-1">Draft growth-focused feedback on student work</p>
          </div>
          <div className="flex gap-3">
            {view !== 'main' && <button onClick={() => setView('main')} className="px-4 py-2 text-sm border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F3F4F6] transition">Back</button>}
            {view === 'main' && (
              <button onClick={() => { setForm({ ...form, classroom_id: classrooms.length > 0 ? classrooms[0].id : 0 }); setView('generate'); }} className="px-4 py-2 text-sm bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium">+ Write Feedback</button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}<button onClick={() => setError('')} className="float-right font-bold">&times;</button></div>}

        {view === 'main' && (
          <>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-[#1E1B4B]">Saved Feedback</h2>
              <span className="text-sm text-[#6B7280]">{outputs.length} saved</span>
            </div>
            {outputs.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
                <p className="text-[#6B7280]">No feedback written yet. Write your first one above.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {outputs.map((o) => {
                  const inputData = JSON.parse(o.input_data || '{}');
                  return (
                    <button key={o.id} onClick={() => viewOutput(o.id)} className="w-full text-left bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#4F46E5] transition flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-[#1E1B4B]">{inputData.student_name || 'Student'} — {inputData.assignment_description?.slice(0, 50) || 'Assignment'}</div>
                        <div className="text-sm text-[#6B7280] mt-0.5">{o.classroom_name || 'No classroom'}</div>
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
            <h2 className="text-lg font-semibold text-[#1E1B4B] mb-1">Write Student Feedback</h2>
            <p className="text-sm text-[#6B7280] mb-6">Describe the assignment and the student&apos;s work. We&apos;ll draft thoughtful, growth-focused feedback.</p>

            {classrooms.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#374151] mb-1">Classroom (optional)</label>
                <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.classroom_id} onChange={(e) => setForm({ ...form, classroom_id: Number(e.target.value) })}>
                  <option value={0}>No classroom selected</option>
                  {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.grade} {c.subject}</option>)}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Student Name</label>
              <input type="text" placeholder="e.g., Maria, Alex" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Assignment Description</label>
              <input type="text" required placeholder="e.g., 5-paragraph persuasive essay on school uniforms" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.assignment_description} onChange={(e) => setForm({ ...form, assignment_description: e.target.value })} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Describe the Student&apos;s Work</label>
              <textarea required placeholder="What did the student submit? How was the quality? What stood out — good or bad?" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] min-h-[100px]" value={form.student_work_description} onChange={(e) => setForm({ ...form, student_work_description: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Strengths (optional)</label>
                <textarea placeholder="What did they do well?" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] min-h-[80px]" value={form.strengths} onChange={(e) => setForm({ ...form, strengths: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Areas for Growth (optional)</label>
                <textarea placeholder="What needs work?" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] min-h-[80px]" value={form.areas_for_growth} onChange={(e) => setForm({ ...form, areas_for_growth: e.target.value })} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#374151] mb-1">Tone (optional)</label>
              <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}>
                <option value="">Warm and encouraging (default)</option>
                <option value="Direct and constructive — this student can handle honest feedback">Direct and constructive</option>
                <option value="Extra encouraging — this student needs confidence building">Extra encouraging</option>
                <option value="Academic and formal — for a report card or portfolio">Formal / report card style</option>
              </select>
            </div>

            <button type="submit" disabled={generating} className={`px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {generating ? 'Writing feedback...' : 'Generate Feedback'}
            </button>
          </form>
        )}

        {view === 'view' && selectedOutput && (
          <div>
            <div className="flex gap-3 text-sm text-[#6B7280] mb-4">
              {selectedOutput.classroom_name && <><span>{selectedOutput.classroom_name}</span><span>&middot;</span></>}
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
              <button onClick={() => setView('generate')} className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm">Write More Feedback</button>
              <button onClick={() => deleteOutput(selectedOutput.id)} className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
