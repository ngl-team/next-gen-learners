'use client';

import { useState, useEffect, useCallback } from 'react';

interface Classroom {
  id: number;
  name: string;
  grade: string;
  subject: string;
  class_size: number;
  special_notes: string;
}

interface LessonPlan {
  id: number;
  classroom_id: number;
  classroom_name: string;
  grade: string;
  subject: string;
  topic: string;
  objectives: string;
  additional_notes: string;
  generated_plan: string;
  created_at: string;
}

type View = 'login' | 'dashboard' | 'setup' | 'generate' | 'view';

export default function LessonPlanner() {
  const [view, setView] = useState<View>('login');
  const [password, setPassword] = useState('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Classroom form
  const [classroomForm, setClassroomForm] = useState({ name: '', grade: '', subject: '', class_size: 25, special_notes: '' });

  // Lesson plan form
  const [planForm, setPlanForm] = useState({ classroom_id: 0, topic: '', objectives: '', additional_notes: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const authCheck = await fetch('/api/auth/check');
      if (!authCheck.ok) {
        setView('login');
        setLoading(false);
        return;
      }
      const [classroomsRes, plansRes] = await Promise.all([
        fetch('/api/classrooms'),
        fetch('/api/lesson-plans'),
      ]);
      if (classroomsRes.ok) setClassrooms(await classroomsRes.json());
      if (plansRes.ok) setPlans(await plansRes.json());
      if (view === 'login') setView('dashboard');
    } catch {
      setError('Failed to load data');
    }
    setLoading(false);
  }, [view]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword('');
      setView('dashboard');
      await loadData();
    } else {
      setError('Invalid password.');
    }
  };

  const createClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/classrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classroomForm),
    });
    if (res.ok) {
      setClassroomForm({ name: '', grade: '', subject: '', class_size: 25, special_notes: '' });
      await loadData();
      setView('dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to create classroom');
    }
  };

  const generatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGenerating(true);
    try {
      const res = await fetch('/api/lesson-plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planForm),
      });
      const data = await res.json();
      if (res.ok) {
        await loadData();
        // Show the generated plan
        const planRes = await fetch(`/api/lesson-plans/${data.id}`);
        if (planRes.ok) {
          setSelectedPlan(await planRes.json());
          setView('view');
        }
        setPlanForm({ classroom_id: 0, topic: '', objectives: '', additional_notes: '' });
      } else {
        setError(data.error || 'Failed to generate lesson plan');
      }
    } catch {
      setError('Failed to generate lesson plan');
    }
    setGenerating(false);
  };

  const deletePlan = async (id: number) => {
    if (!confirm('Delete this lesson plan?')) return;
    await fetch(`/api/lesson-plans/${id}`, { method: 'DELETE' });
    setSelectedPlan(null);
    setView('dashboard');
    await loadData();
  };

  const viewPlan = async (id: number) => {
    const res = await fetch(`/api/lesson-plans/${id}`);
    if (res.ok) {
      setSelectedPlan(await res.json());
      setView('view');
    }
  };

  if (loading && classrooms.length === 0 && view !== 'login') {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <p className="text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white border border-[#E5E7EB] rounded-xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-[#1E1B4B] text-center mb-1">Lesson Plan Partner</h1>
          <p className="text-sm text-[#6B7280] text-center mb-6">Sign in to get started</p>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#374151] mb-1">Password</label>
            <input
              type="password" required placeholder="Enter password"
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm">
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF]">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1B4B]">Lesson Plan Partner</h1>
            <p className="text-sm text-[#6B7280] mt-1">AI-powered lesson plans tailored to your classroom</p>
          </div>
          <div className="flex gap-3">
            {view !== 'dashboard' && (
              <button onClick={() => setView('dashboard')} className="px-4 py-2 text-sm border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F3F4F6] transition">
                Back
              </button>
            )}
            {view === 'dashboard' && (
              <>
                <button onClick={() => setView('setup')} className="px-4 py-2 text-sm border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F3F4F6] transition">
                  + Classroom
                </button>
                <button
                  onClick={() => {
                    if (classrooms.length === 0) {
                      setError('Create a classroom first');
                      return;
                    }
                    setPlanForm({ ...planForm, classroom_id: classrooms[0].id });
                    setView('generate');
                  }}
                  className="px-4 py-2 text-sm bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium"
                >
                  + New Lesson Plan
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">&times;</button>
          </div>
        )}

        {/* ── Dashboard View ── */}
        {view === 'dashboard' && (
          <>
            {/* Classrooms */}
            <h2 className="text-lg font-semibold text-[#1E1B4B] mb-3">Your Classrooms</h2>
            {classrooms.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center mb-8">
                <p className="text-[#6B7280] mb-4">No classrooms yet. Set up your first classroom to get started.</p>
                <button onClick={() => setView('setup')} className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm">
                  Set Up Classroom
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {classrooms.map((c) => (
                  <div key={c.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#4F46E5] transition">
                    <h3 className="font-semibold text-[#1E1B4B]">{c.name}</h3>
                    <p className="text-sm text-[#6B7280] mt-1">{c.grade} &middot; {c.subject} &middot; {c.class_size} students</p>
                    {c.special_notes && <p className="text-xs text-[#9CA3AF] mt-2">{c.special_notes}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Saved Plans */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-[#1E1B4B]">Saved Lesson Plans</h2>
              <span className="text-sm text-[#6B7280]">{plans.length} plan{plans.length !== 1 ? 's' : ''}</span>
            </div>
            {plans.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
                <p className="text-[#6B7280]">No lesson plans yet. Generate your first one.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {plans.map((p) => (
                  <button key={p.id} onClick={() => viewPlan(p.id)} className="w-full text-left bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#4F46E5] transition flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-[#1E1B4B]">{p.topic}</div>
                      <div className="text-sm text-[#6B7280] mt-0.5">{p.classroom_name} &middot; {p.grade} {p.subject}</div>
                    </div>
                    <div className="text-xs text-[#9CA3AF]">{p.created_at?.slice(0, 10)}</div>
                  </button>
                ))}
              </div>
            )}

            {/* More Tools */}
            <h2 className="text-lg font-semibold text-[#1E1B4B] mt-10 mb-3">More Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'Differentiation Engine', desc: 'Adapt lessons for ELL, advanced, and IEP students', href: '/differentiation-engine' },
                { name: 'Student Feedback Writer', desc: 'Draft growth-focused feedback on student work', href: '/student-feedback' },
                { name: 'Parent Email Partner', desc: 'Draft professional parent communications', href: '/parent-email' },
              ].map((tool) => (
                <a key={tool.name} href={tool.href} className="bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#4F46E5] transition cursor-pointer">
                  <h3 className="font-semibold text-[#1E1B4B] text-sm">{tool.name}</h3>
                  <p className="text-xs text-[#9CA3AF] mt-1">{tool.desc}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-[#EEF2FF] text-[#4F46E5] rounded font-medium">Open</span>
                </a>
              ))}
            </div>
          </>
        )}

        {/* ── Classroom Setup View ── */}
        {view === 'setup' && (
          <form onSubmit={createClassroom} className="bg-white border border-[#E5E7EB] rounded-xl p-6 max-w-lg">
            <h2 className="text-lg font-semibold text-[#1E1B4B] mb-1">Set Up a Classroom</h2>
            <p className="text-sm text-[#6B7280] mb-6">Tell us about your class so we can tailor every lesson plan.</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Classroom Name</label>
              <input
                type="text" required placeholder="e.g., Period 3 Science, Room 204"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]"
                value={classroomForm.name} onChange={(e) => setClassroomForm({ ...classroomForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Grade Level</label>
                <select
                  required className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]"
                  value={classroomForm.grade} onChange={(e) => setClassroomForm({ ...classroomForm, grade: e.target.value })}
                >
                  <option value="">Select grade...</option>
                  {['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((g) => (
                    <option key={g} value={g}>{g === 'K' ? 'Kindergarten' : `${g} Grade`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">Subject</label>
                <input
                  type="text" required placeholder="e.g., Math, ELA, Science"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]"
                  value={classroomForm.subject} onChange={(e) => setClassroomForm({ ...classroomForm, subject: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Class Size</label>
              <input
                type="number" min={1} max={100}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]"
                value={classroomForm.class_size} onChange={(e) => setClassroomForm({ ...classroomForm, class_size: Number(e.target.value) })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#374151] mb-1">Special Notes</label>
              <textarea
                placeholder="e.g., 3 ELL students, 2 students on IEPs, advanced group..."
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] min-h-[80px]"
                value={classroomForm.special_notes} onChange={(e) => setClassroomForm({ ...classroomForm, special_notes: e.target.value })}
              />
            </div>

            <button type="submit" className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm">
              Save Classroom
            </button>
          </form>
        )}

        {/* ── Generate View ── */}
        {view === 'generate' && (
          <form onSubmit={generatePlan} className="bg-white border border-[#E5E7EB] rounded-xl p-6 max-w-lg">
            <h2 className="text-lg font-semibold text-[#1E1B4B] mb-1">Generate a Lesson Plan</h2>
            <p className="text-sm text-[#6B7280] mb-6">Tell us what you&apos;re teaching. We&apos;ll build a complete plan for your classroom.</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Classroom</label>
              <select
                required className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]"
                value={planForm.classroom_id} onChange={(e) => setPlanForm({ ...planForm, classroom_id: Number(e.target.value) })}
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.grade} {c.subject} ({c.class_size} students)</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">What are you teaching?</label>
              <input
                type="text" required placeholder="e.g., Introduction to fractions, The water cycle, Persuasive writing"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5]"
                value={planForm.topic} onChange={(e) => setPlanForm({ ...planForm, topic: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#374151] mb-1">Learning Objectives (optional)</label>
              <textarea
                placeholder="What should students know by the end? Leave blank and we'll suggest objectives."
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] min-h-[80px]"
                value={planForm.objectives} onChange={(e) => setPlanForm({ ...planForm, objectives: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#374151] mb-1">Anything else? (optional)</label>
              <textarea
                placeholder="e.g., This is a review lesson, I want a hands-on activity, I only have 30 minutes..."
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#4F46E5] min-h-[80px]"
                value={planForm.additional_notes} onChange={(e) => setPlanForm({ ...planForm, additional_notes: e.target.value })}
              />
            </div>

            <button
              type="submit" disabled={generating}
              className={`px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {generating ? 'Generating your lesson plan...' : 'Generate Lesson Plan'}
            </button>
          </form>
        )}

        {/* ── View Plan ── */}
        {view === 'view' && selectedPlan && (
          <div>
            <div className="flex gap-3 text-sm text-[#6B7280] mb-4">
              <span>{selectedPlan.classroom_name}</span>
              <span>&middot;</span>
              <span>{selectedPlan.grade} {selectedPlan.subject}</span>
              <span>&middot;</span>
              <span>{selectedPlan.created_at?.slice(0, 10)}</span>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{
                __html: selectedPlan.generated_plan
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                  .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                  .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                  .replace(/^- (.*$)/gm, '<li>$1</li>')
                  .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
                  .replace(/<\/ul>\s*<ul>/g, '')
                  .replace(/\n\n/g, '<br/><br/>')
                  .replace(/\n/g, '<br/>')
              }} />
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => { setView('generate'); setPlanForm({ ...planForm, classroom_id: selectedPlan.classroom_id }); }}
                className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition font-medium text-sm"
              >
                Generate Another
              </button>
              <button
                onClick={() => deletePlan(selectedPlan.id)}
                className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Delete Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
