'use client';

import { useState, useEffect, useCallback } from 'react';

interface Classroom { id: number; name: string; grade: string; subject: string; class_size: number; special_notes: string; }
interface ToolOutput { id: number; classroom_id: number; classroom_name: string; grade: string; subject: string; tool: string; input_data: string; generated_output: string; created_at: string; }

type View = 'login' | 'main' | 'generate' | 'view';

export default function ParentEmail() {
  const [view, setView] = useState<View>('login');
  const [password, setPassword] = useState('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [outputs, setOutputs] = useState<ToolOutput[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<ToolOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ classroom_id: 0, parent_name: '', student_name: '', situation: '', email_purpose: '', tone: '', additional_context: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const authCheck = await fetch('/api/auth/check');
      if (!authCheck.ok) { setView('login'); setLoading(false); return; }
      const [classroomsRes, outputsRes] = await Promise.all([
        fetch('/api/classrooms'),
        fetch('/api/tools/outputs?tool=parent-email'),
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
      const res = await fetch('/api/tools/parent-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        await loadData();
        const outputRes = await fetch(`/api/tools/outputs/${data.id}`);
        if (outputRes.ok) { setSelectedOutput(await outputRes.json()); setView('view'); }
        setForm({ classroom_id: 0, parent_name: '', student_name: '', situation: '', email_purpose: '', tone: '', additional_context: '' });
      } else { setError(data.error || 'Failed to generate'); }
    } catch { setError('Failed to generate'); }
    setGenerating(false);
  };

  const deleteOutput = async (id: number) => {
    if (!confirm('Delete this email?')) return;
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
          <h1 className="text-2xl font-bold text-[#1E1B4B] text-center mb-1">Parent Email Partner</h1>
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
            <h1 className="text-2xl font-bold text-[#1E1B4B]">Parent Email Partner</h1>
            <p className="text-sm text-[#6B7280] mt-1">Draft professional parent communications for any situation</p>
          </div>
          <div className="flex gap-3">
            {view !== 'main' && <button onClick={() => setView('main')} className="px-4 py-2 text-sm border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F3F4F6] transition">Back</button>}
            {view === 'main' && (
              <button onClick={() => { setForm({ ...form, classroom_id: classrooms.length > 0 ? classrooms[0].id : 0 }); setView('generate'); }} className="px-4 py-2 text-sm bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium">+ Draft an Email</button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}<button onClick={() => setError('')} className="float-right font-bold">&times;</button></div>}

        {view === 'main' && (
          <>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-[#1E1B4B]">Saved Emails</h2>
              <span className="text-sm text-[#6B7280]">{outputs.length} saved</span>
            </div>
            {outputs.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
                <p className="text-[#6B7280]">No emails drafted yet. Write your first one above.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {outputs.map((o) => {
                  const inputData = JSON.parse(o.input_data || '{}');
                  return (
                    <button key={o.id} onClick={() => viewOutput(o.id)} className="w-full text-left bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#4F46E5] transition flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-[#1E1B4B]">{inputData.email_purpose?.slice(0, 60) || 'Email'}</div>
                        <div className="text-sm text-[#6B7280] mt-0.5">To: {inputData.parent_name || 'Parent'} re: {inputData.student_name || 'Student'}</div>
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
            <h2 className="text-lg font-semibold text-[#1E1B4B] mb-1">Draft a Parent Email</h2>
            <p className="text-sm text-[#6B7280] mb-6">Describe the situation and we&apos;ll draft a professional, ready-to-send email.</p>

            {classrooms.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#374151] mb-1">Classroom (optional)</label>
                <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.classroom_id} onChange={(e) => setForm({ ...form, classroom_id: Number(e.target.value) })}>
                  <option value={0}>No classroom selected</option>
                  {classrooms.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.grade} {c.subject}</option>)}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Parent Name</label>
                <input type="text" placeholder="e.g., Mrs. Johnson" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Student Name</label>
                <input type="text" placeholder="e.g., Alex" className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Purpose of This Email</label>
              <select required className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.email_purpose} onChange={(e) => setForm({ ...form, email_purpose: e.target.value })}>
                <option value="">Select purpose...</option>
                <option value="Sharing positive news about the student's progress or behavior">Positive update / good news</option>
                <option value="Addressing a behavioral concern that needs parent awareness">Behavioral concern</option>
                <option value="Discussing academic struggles and requesting support at home">Academic concern</option>
                <option value="Requesting a parent-teacher conference">Request a meeting</option>
                <option value="Following up on a previous conversation">Follow-up on prior conversation</option>
                <option value="Informing about an upcoming event, field trip, or deadline">Event / deadline reminder</option>
                <option value="Addressing attendance or tardiness concerns">Attendance concern</option>
                <option value="Other — described in the situation field">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Describe the Situation</label>
              <textarea required placeholder="What happened? What do you need to communicate? Be specific — the more context you give, the better the email." className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] min-h-[120px]" value={form.situation} onChange={(e) => setForm({ ...form, situation: e.target.value })} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Tone</label>
              <select className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]" value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}>
                <option value="">Professional and warm (default)</option>
                <option value="Warm and celebratory — this is good news">Celebratory</option>
                <option value="Sensitive and careful — this is a delicate situation">Sensitive / delicate</option>
                <option value="Direct and clear — the parent needs to take action">Direct and urgent</option>
                <option value="Formal — for official communication or documentation purposes">Formal / official</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#374151] mb-1">Additional Context (optional)</label>
              <textarea placeholder="e.g., I've already spoken to the student about this, the parent tends to be defensive, this is a follow-up..." className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] min-h-[80px]" value={form.additional_context} onChange={(e) => setForm({ ...form, additional_context: e.target.value })} />
            </div>

            <button type="submit" disabled={generating} className={`px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {generating ? 'Drafting email...' : 'Draft Email'}
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
              <button onClick={() => setView('generate')} className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm">Draft Another Email</button>
              <button onClick={() => deleteOutput(selectedOutput.id)} className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
