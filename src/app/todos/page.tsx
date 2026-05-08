"use client";

import { useEffect, useState, useCallback } from "react";

interface Todo {
  id: number;
  title: string;
  notes: string;
  status: "open" | "done";
  owner: "brayan" | "ryan" | "either";
  created_by: string;
  created_at: string;
  completed_at: string | null;
}

const ownerColors: Record<string, { bg: string; border: string; text: string; dot: string; label: string }> = {
  brayan: { bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.25)", text: "#22D3EE", dot: "#06B6D4", label: "Brayan" },
  ryan: { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.25)", text: "#C084FC", dot: "#A855F7", label: "Ryan" },
  either: { bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.25)", text: "#94A3B8", dot: "#64748B", label: "Either" },
};

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function TodosPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [owner, setOwner] = useState<"brayan" | "ryan" | "either">("either");
  const [creator, setCreator] = useState<"brayan" | "ryan">("brayan");
  const [adding, setAdding] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch("/api/todos");
      if (res.status === 401) {
        setAuthed(false);
        setLoading(false);
        return;
      }
      const d = await res.json();
      setTodos(d.todos || []);
      setAuthed(true);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, _actor: creator }),
    });
    if (res.ok) {
      setPassword("");
      await fetchTodos();
    } else {
      setLoginError("Invalid password.");
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, notes, owner, created_by: creator }),
    });
    setTitle("");
    setNotes("");
    setAdding(false);
    fetchTodos();
  };

  const toggleDone = async (todo: Todo) => {
    const next = todo.status === "done" ? "open" : "done";
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    fetchTodos();
  };

  const removeTodo = async (id: number) => {
    if (!confirm("Delete this todo?")) return;
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  if (authed === false) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-2xl p-7"
        >
          <h1 className="text-white text-xl font-bold tracking-tight mb-1">Shared Todos</h1>
          <p className="text-white/30 text-sm mb-6">Brayan + Ryan only</p>
          {loginError && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {loginError}
            </div>
          )}
          <div className="mb-3">
            <label className="block text-white/40 text-[10px] tracking-wider uppercase mb-1.5">Who are you</label>
            <div className="flex gap-1.5">
              {(["brayan", "ryan"] as const).map((p) => {
                const c = ownerColors[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCreator(p)}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all"
                    style={{
                      background: creator === p ? c.bg : "transparent",
                      borderColor: creator === p ? c.border : "rgba(255,255,255,0.06)",
                      color: creator === p ? c.text : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-white/40 text-[10px] tracking-wider uppercase mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  if (authed === null || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white/30 text-sm animate-pulse">Loading todos...</div>
      </div>
    );
  }

  const open = todos.filter((t) => t.status === "open");
  const done = todos.filter((t) => t.status === "done");
  const grouped = {
    brayan: open.filter((t) => t.owner === "brayan"),
    ryan: open.filter((t) => t.owner === "ryan"),
    either: open.filter((t) => t.owner === "either"),
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* HEADER */}
      <header className="border-b border-white/[0.06] px-6 py-5">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white text-xl font-bold tracking-tight">Shared Todos</h1>
            <p className="text-white/25 text-sm mt-0.5">Brayan + Ryan</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-center">
              <span className="text-white text-lg font-bold block">{open.length}</span>
              <span className="text-white/20 text-[10px] tracking-wider uppercase">Open</span>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <div className="text-center">
              <span className="text-cyan-400 text-lg font-bold block">{grouped.brayan.length}</span>
              <span className="text-white/20 text-[10px] tracking-wider uppercase">Brayan</span>
            </div>
            <div className="text-center">
              <span className="text-purple-400 text-lg font-bold block">{grouped.ryan.length}</span>
              <span className="text-white/20 text-[10px] tracking-wider uppercase">Ryan</span>
            </div>
            <div className="text-center">
              <span className="text-slate-400 text-lg font-bold block">{grouped.either.length}</span>
              <span className="text-white/20 text-[10px] tracking-wider uppercase">Either</span>
            </div>
            <div className="w-px h-8 bg-white/[0.06]" />
            <a
              href="/command"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 text-[11px] hover:text-white/70 transition-colors"
            >
              ← Command
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* ADD FORM */}
          <div className="col-span-12 lg:col-span-4">
            <h2 className="text-white font-bold text-sm tracking-tight mb-4">New Todo</h2>
            <form onSubmit={addTodo} className="space-y-3">
              <div>
                <label className="block text-white/40 text-[10px] tracking-wider uppercase mb-1.5">Title</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Send Roche June outline"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20"
                />
              </div>
              <div>
                <label className="block text-white/40 text-[10px] tracking-wider uppercase mb-1.5">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Loop in cabinet, attach two-layer doc..."
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-white/40 text-[10px] tracking-wider uppercase mb-1.5">Owner</label>
                <div className="flex gap-1.5">
                  {(["brayan", "ryan", "either"] as const).map((o) => {
                    const c = ownerColors[o];
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOwner(o)}
                        className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all"
                        style={{
                          background: owner === o ? c.bg : "transparent",
                          borderColor: owner === o ? c.border : "rgba(255,255,255,0.06)",
                          color: owner === o ? c.text : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-white/40 text-[10px] tracking-wider uppercase mb-1.5">Created by</label>
                <div className="flex gap-1.5">
                  {(["brayan", "ryan"] as const).map((p) => {
                    const c = ownerColors[p];
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCreator(p)}
                        className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all"
                        style={{
                          background: creator === p ? c.bg : "transparent",
                          borderColor: creator === p ? c.border : "rgba(255,255,255,0.06)",
                          color: creator === p ? c.text : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                type="submit"
                disabled={adding || !title.trim()}
                className="w-full py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors disabled:opacity-30"
              >
                {adding ? "Adding..." : "+ Add Todo"}
              </button>
            </form>
          </div>

          {/* LIST */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {(["brayan", "ryan", "either"] as const).map((o) => {
              const list = grouped[o];
              const c = ownerColors[o];
              return (
                <div key={o}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.dot }} />
                    <h2 className="text-white font-bold text-sm tracking-tight">{c.label}</h2>
                    <span className="text-white/20 text-[11px]">({list.length})</span>
                  </div>
                  {list.length === 0 ? (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                      <p className="text-white/20 text-xs">No open todos</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {list.map((t) => (
                        <TodoRow
                          key={t.id}
                          todo={t}
                          onToggle={() => toggleDone(t)}
                          onDelete={() => removeTodo(t.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* COMPLETED */}
            {done.length > 0 && (
              <div>
                <button
                  onClick={() => setShowCompleted((s) => !s)}
                  className="flex items-center gap-2 text-white/40 hover:text-white/60 text-xs transition-colors"
                >
                  <svg
                    className={`w-3 h-3 transition-transform ${showCompleted ? "rotate-90" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  <span className="tracking-wider uppercase">Completed ({done.length})</span>
                </button>
                {showCompleted && (
                  <div className="mt-3 space-y-2">
                    {done.map((t) => (
                      <TodoRow
                        key={t.id}
                        todo={t}
                        onToggle={() => toggleDone(t)}
                        onDelete={() => removeTodo(t.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.04] px-6 py-4 mt-10">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <span className="text-white/10 text-xs">NGL Shared Todos</span>
          <a
            href="mailto:brayan@nextgenerationlearners.com"
            className="text-white/10 text-xs hover:text-white/25 transition-colors"
          >
            brayan@nextgenerationlearners.com
          </a>
        </div>
      </footer>
    </div>
  );
}

function TodoRow({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const c = ownerColors[todo.owner] || ownerColors.either;
  const isDone = todo.status === "done";
  return (
    <div
      className="rounded-xl border p-3 transition-all hover:bg-white/[0.04]"
      style={{
        background: isDone ? "rgba(255,255,255,0.02)" : c.bg,
        borderColor: isDone ? "rgba(255,255,255,0.06)" : c.border,
      }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className="mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors"
          style={{
            borderColor: isDone ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.2)",
            background: isDone ? "rgba(16,185,129,0.2)" : "transparent",
          }}
          aria-label={isDone ? "Mark as open" : "Mark as done"}
        >
          {isDone && (
            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`text-sm font-medium ${isDone ? "text-white/30 line-through" : "text-white"}`}
            >
              {todo.title}
            </p>
          </div>
          {todo.notes && (
            <p className={`text-xs mt-1 leading-relaxed ${isDone ? "text-white/20" : "text-white/50"}`}>
              {todo.notes}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-white/30">
            {todo.created_by && <span>by {todo.created_by}</span>}
            {todo.created_by && <span className="text-white/10">|</span>}
            <span>{timeAgo(todo.created_at)}</span>
            {isDone && todo.completed_at && (
              <>
                <span className="text-white/10">|</span>
                <span className="text-emerald-400/60">done {timeAgo(todo.completed_at)}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onDelete}
          className="text-white/20 hover:text-red-400 transition-colors p-1 flex-shrink-0"
          aria-label="Delete"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
