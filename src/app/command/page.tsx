"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface Contact {
  id: number;
  name: string;
  title: string;
  organization: string;
  email: string;
  status: string;
  times_contacted: number;
  last_contact_date: string | null;
  notes: string;
  end_goal: string;
  priority: string;
  pipeline: string;
  auto_followup: number;
  follow_up_date: string | null;
  channel: string;
  contact_type: string;
  relationship_status: string;
}

interface BrainDump {
  id: number;
  raw_text: string;
  action_items: string;
  created_at: string;
}

interface QuickLog {
  id: number;
  contact_id: number | null;
  contact_name: string | null;
  channel: string;
  note: string;
  created_at: string;
}

interface Activity {
  id: number;
  person: string;
  action: string;
  resource_type: string;
  resource_name: string;
  details: string;
  created_at: string;
}

interface DashboardData {
  briefing: {
    needsApproval: Contact[];
    autoSendable: Contact[];
    goingCold: Contact[];
    overdueCount: number;
  };
  contacts: {
    highTouch: Contact[];
    activeDeals: Contact[];
    pipeline: Contact[];
    all: Contact[];
  };
  quickLogs: QuickLog[];
  brainDumps: BrainDump[];
  activity: { brayan: Activity[]; ryan: Activity[] };
}

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
function daysAgo(dateStr: string | null): number {
  if (!dateStr) return 999;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function daysAgoLabel(dateStr: string | null): string {
  if (!dateStr) return "never";
  const d = daysAgo(dateStr);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  return `${d}d ago`;
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const priorityColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  "high-touch": { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", text: "#F87171", dot: "#EF4444" },
  "active-deal": { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", text: "#FBBF24", dot: "#F59E0B" },
  pipeline: { bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.25)", text: "#22D3EE", dot: "#06B6D4" },
};

const statusColors: Record<string, string> = {
  cold: "#64748B",
  emailed: "#3B82F6",
  replied: "#10B981",
  signed: "#8B5CF6",
};

const channelIcons: Record<string, string> = {
  gmail: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
  imessage: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z",
  "in-person": "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
};

/* ═══════════════════════════════════════════
   CONTACT CARD COMPONENT
   ═══════════════════════════════════════════ */
function ContactCard({
  contact,
  onEdit,
}: {
  contact: Contact;
  onEdit: (c: Contact) => void;
}) {
  const p = priorityColors[contact.priority] || priorityColors.pipeline;
  const days = daysAgo(contact.last_contact_date);
  // Only flag as stale if there's an active end goal — no goal means no urgency
  const isStale = days > 5 && contact.status !== "signed" && contact.status !== "cold" && !!contact.end_goal;

  return (
    <div
      className="rounded-xl border p-4 transition-all duration-300 hover:scale-[1.01] cursor-pointer group"
      style={{ background: p.bg, borderColor: p.border }}
      onClick={() => onEdit(contact)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.dot }} />
          <h3 className="text-white font-semibold text-sm">{contact.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isStale && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium">
              GOING COLD
            </span>
          )}
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{
              background: `${statusColors[contact.status] || "#64748B"}20`,
              color: statusColors[contact.status] || "#64748B",
            }}
          >
            {contact.status}
          </span>
        </div>
      </div>

      {contact.organization && (
        <p className="text-white/30 text-xs mb-2">{contact.organization}</p>
      )}

      {contact.end_goal ? (
        <div className="mb-3 p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <p className="text-white/25 text-[10px] tracking-wider uppercase mb-0.5">End Goal</p>
          <p className="text-white/70 text-xs leading-relaxed">{contact.end_goal}</p>
        </div>
      ) : (
        <div className="mb-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <p className="text-white/15 text-[11px] italic">No end goal — click to set one</p>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-white/30">
        <span>
          Last contact: {" "}
          <span className={isStale ? "text-red-400" : "text-white/50"}>
            {daysAgoLabel(contact.last_contact_date)}
          </span>
        </span>
        <span>{contact.times_contacted}x contacted</span>
      </div>

      {contact.follow_up_date && (
        <div className="mt-2 text-[11px]">
          <span className="text-white/25">Follow up: </span>
          <span className={daysAgo(contact.follow_up_date) >= 0 ? "text-amber-400" : "text-white/40"}>
            {contact.follow_up_date}
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CONTACT PROFILE PANEL
   ═══════════════════════════════════════════ */
interface EmailThread {
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
}

interface Interaction {
  id: number;
  type: string;
  subject: string;
  body: string;
  notes: string;
  created_at: string;
}

function ContactPanel({
  contact,
  onClose,
  onSave,
}: {
  contact: Contact;
  onClose: () => void;
  onSave: () => void;
}) {
  const [tab, setTab] = useState<"context" | "settings">("context");
  const [endGoal, setEndGoal] = useState(contact.end_goal || "");
  const [priority, setPriority] = useState(contact.priority || "pipeline");
  const [pipelineName, setPipelineName] = useState(contact.pipeline || "");
  const [autoFollowup, setAutoFollowup] = useState(contact.auto_followup !== 0);
  const [saving, setSaving] = useState(false);

  // Context data
  const [emails, setEmails] = useState<EmailThread[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loadingContext, setLoadingContext] = useState(true);
  const [notes, setNotes] = useState(contact.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  // Load email history + interactions on open
  useEffect(() => {
    async function loadContext() {
      setLoadingContext(true);
      const results = await Promise.allSettled([
        // Search Gmail for emails with this contact
        fetch(`/api/emails/search?q=${encodeURIComponent(contact.email || contact.name)}&max=15`).then(r => r.json()),
        // Get logged interactions
        fetch(`/api/contacts/${contact.id}/interactions`).then(r => r.json()),
      ]);

      if (results[0].status === "fulfilled" && results[0].value.results) {
        setEmails(results[0].value.results.map((m: any) => ({
          subject: m.subject || "(no subject)",
          from: m.from || "",
          to: m.to || "",
          date: m.date || "",
          snippet: m.snippet || "",
        })));
      }

      if (results[1].status === "fulfilled" && Array.isArray(results[1].value)) {
        setInteractions(results[1].value);
      }

      setLoadingContext(false);
    }
    loadContext();
  }, [contact.id, contact.email, contact.name]);

  const save = async () => {
    setSaving(true);
    await fetch("/api/command/contact-goal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: contact.id,
        end_goal: endGoal,
        priority,
        pipeline: pipelineName,
        auto_followup: autoFollowup ? 1 : 0,
      }),
    });
    setSaving(false);
    onSave();
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    await fetch(`/api/contacts/${contact.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contact.name,
        title: contact.title,
        organization: contact.organization,
        email: contact.email,
        status: contact.status,
        notes,
      }),
    });
    setSavingNotes(false);
  };

  const p = priorityColors[contact.priority] || priorityColors.pipeline;

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      {/* slide-out panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 overflow-y-auto">
        {/* header */}
        <div className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.dot }} />
              <h2 className="text-white text-xl font-bold">{contact.name}</h2>
            </div>
            <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* contact meta */}
          <div className="flex items-center gap-4 text-xs text-white/30">
            {contact.title && <span>{contact.title}</span>}
            {contact.organization && (
              <>
                {contact.title && <span className="text-white/10">|</span>}
                <span>{contact.organization}</span>
              </>
            )}
            {contact.email && (
              <>
                <span className="text-white/10">|</span>
                <span className="text-cyan-400/50">{contact.email}</span>
              </>
            )}
          </div>

          {/* stats row */}
          <div className="flex items-center gap-5 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="text-white/20 text-[10px] uppercase tracking-wider">Status</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{
                  background: `${statusColors[contact.status] || "#64748B"}20`,
                  color: statusColors[contact.status] || "#64748B",
                }}
              >
                {contact.status}
              </span>
            </div>
            <div className="text-[11px] text-white/30">
              <span className="text-white/50 font-medium">{contact.times_contacted}</span> interactions
            </div>
            <div className="text-[11px] text-white/30">
              Last: <span className="text-white/50">{daysAgoLabel(contact.last_contact_date)}</span>
            </div>
          </div>

          {/* tabs */}
          <div className="flex gap-1 mt-4">
            {(["context", "settings"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: tab === t ? "rgba(255,255,255,0.08)" : "transparent",
                  color: tab === t ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                }}
              >
                {t === "context" ? "Context & History" : "Goal & Settings"}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5">
          {tab === "context" ? (
            <div className="space-y-6">
              {/* End goal (if set) */}
              {contact.end_goal && (
                <div className="p-3 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/20">
                  <p className="text-cyan-400/50 text-[10px] tracking-wider uppercase mb-1">End Goal</p>
                  <p className="text-white/70 text-sm leading-relaxed">{contact.end_goal}</p>
                </div>
              )}

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white/50 text-xs tracking-wider uppercase">Notes</h3>
                  {notes !== contact.notes && (
                    <button
                      onClick={saveNotes}
                      disabled={savingNotes}
                      className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                    >
                      {savingNotes ? "saving..." : "save"}
                    </button>
                  )}
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add context about this person — who they are, how you met, what they care about..."
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-white/60 text-sm placeholder:text-white/15 focus:outline-none focus:border-white/15 resize-none"
                  rows={3}
                />
              </div>

              {/* Email history from Gmail */}
              <div>
                <h3 className="text-white/50 text-xs tracking-wider uppercase mb-3">
                  Email History
                  {!loadingContext && <span className="text-white/20 ml-2 normal-case">({emails.length} found)</span>}
                </h3>
                {loadingContext ? (
                  <div className="text-white/20 text-xs animate-pulse py-4 text-center">
                    Searching Gmail...
                  </div>
                ) : emails.length === 0 ? (
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
                    <p className="text-white/20 text-xs">No emails found</p>
                    <p className="text-white/10 text-[10px] mt-1">
                      {contact.email ? "Check if the email address matches" : "No email address on file — add one in Settings"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {emails.map((e, i) => {
                      const isFromMe = !e.from.toLowerCase().includes(contact.email?.toLowerCase() || "___");
                      return (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="text-[9px] px-1.5 py-0.5 rounded font-medium tracking-wider"
                                  style={{
                                    background: isFromMe ? "rgba(59,130,246,0.15)" : "rgba(16,185,129,0.15)",
                                    color: isFromMe ? "#60A5FA" : "#34D399",
                                  }}
                                >
                                  {isFromMe ? "SENT" : "RECEIVED"}
                                </span>
                                <span className="text-white/60 text-xs font-medium truncate">
                                  {e.subject}
                                </span>
                              </div>
                              <p className="text-white/25 text-[11px] leading-relaxed line-clamp-2">
                                {e.snippet}
                              </p>
                            </div>
                            <span className="text-white/15 text-[10px] flex-shrink-0 whitespace-nowrap">
                              {e.date ? new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Logged interactions */}
              {interactions.length > 0 && (
                <div>
                  <h3 className="text-white/50 text-xs tracking-wider uppercase mb-3">
                    Logged Interactions
                    <span className="text-white/20 ml-2 normal-case">({interactions.length})</span>
                  </h3>
                  <div className="space-y-1.5">
                    {interactions.map((int) => (
                      <div key={int.id} className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400 font-medium tracking-wider uppercase">
                              {int.type}
                            </span>
                            {int.subject && (
                              <span className="text-white/50 text-xs">{int.subject}</span>
                            )}
                          </div>
                          <span className="text-white/15 text-[10px]">{timeAgo(int.created_at)}</span>
                        </div>
                        {int.notes && (
                          <p className="text-white/25 text-[11px] mt-1">{int.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── SETTINGS TAB ── */
            <div className="space-y-4">
              <div>
                <label className="text-white/40 text-xs tracking-wider uppercase block mb-1.5">End Goal</label>
                <textarea
                  value={endGoal}
                  onChange={(e) => setEndGoal(e.target.value)}
                  placeholder="What is the end goal with this person?"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs tracking-wider uppercase block mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {(["high-touch", "active-deal", "pipeline"] as const).map((pr) => {
                    const c = priorityColors[pr];
                    return (
                      <button
                        key={pr}
                        onClick={() => setPriority(pr)}
                        className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all"
                        style={{
                          background: priority === pr ? c.bg : "transparent",
                          borderColor: priority === pr ? c.border : "rgba(255,255,255,0.06)",
                          color: priority === pr ? c.text : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {pr.replace("-", " ")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-white/40 text-xs tracking-wider uppercase block mb-1.5">Pipeline</label>
                <input
                  value={pipelineName}
                  onChange={(e) => setPipelineName(e.target.value)}
                  placeholder="e.g., library-outreach, superintendent, partnership"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAutoFollowup(!autoFollowup)}
                  className="w-10 h-6 rounded-full transition-colors relative"
                  style={{
                    background: autoFollowup ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                    style={{ left: autoFollowup ? 18 : 2 }}
                  />
                </button>
                <span className="text-white/50 text-sm">Auto-send follow-ups (no approval needed)</span>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/40 text-sm hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   BRAIN DUMP COMPONENT
   ═══════════════════════════════════════════ */
function BrainDumpSection({
  dumps,
  onNew,
}: {
  dumps: BrainDump[];
  onNew: () => void;
}) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [saving, setSaving] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const saveDump = async () => {
    if (!text.trim()) return;
    setSaving(true);

    // Extract action items (lines starting with - or *)
    const lines = text.split(/[.!?\n]+/).filter((l) => l.trim());
    const actionItems = lines.map((l) => l.trim()).filter(Boolean);

    await fetch("/api/command/brain-dump", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw_text: text, action_items: actionItems }),
    });

    setText("");
    setSaving(false);
    onNew();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
        <h2 className="text-white font-bold text-sm tracking-tight">Brain Dump</h2>
      </div>

      <div className="relative mb-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Dump your thoughts here or use voice..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/30 resize-none min-h-[120px]"
          rows={5}
        />
        {/* voice + save buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            onClick={toggleVoice}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              listening
                ? "bg-red-500/30 border border-red-500/50 text-red-400 animate-pulse"
                : "bg-white/[0.06] border border-white/10 text-white/40 hover:text-white/60"
            }`}
            title={listening ? "Stop recording" : "Start voice typing"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </button>
          {text.trim() && (
            <button
              onClick={saveDump}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-400 text-xs font-medium hover:bg-violet-500/30 transition-colors disabled:opacity-50"
            >
              {saving ? "..." : "Save"}
            </button>
          )}
        </div>
      </div>

      {listening && (
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400/70 text-xs">Listening...</span>
        </div>
      )}

      {/* past dumps */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {dumps.map((d) => {
          let actions: string[] = [];
          try { actions = JSON.parse(d.action_items); } catch {}
          return (
            <div key={d.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <p className="text-white/50 text-xs leading-relaxed mb-1">{d.raw_text}</p>
              {actions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {actions.slice(0, 4).map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-violet-400/60 text-[10px] mt-0.5">-</span>
                      <span className="text-white/35 text-[11px]">{a}</span>
                    </div>
                  ))}
                </div>
              )}
              <span className="text-white/15 text-[10px] mt-1 block">{timeAgo(d.created_at)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   QUICK LOG COMPONENT
   ═══════════════════════════════════════════ */
function QuickLogSection({
  contacts,
  logs,
  onNew,
}: {
  contacts: Contact[];
  logs: QuickLog[];
  onNew: () => void;
}) {
  const [note, setNote] = useState("");
  const [contactId, setContactId] = useState<number | null>(null);
  const [channel, setChannel] = useState("imessage");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!note.trim()) return;
    setSaving(true);
    await fetch("/api/command/quick-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact_id: contactId, channel, note }),
    });
    setNote("");
    setContactId(null);
    setSaving(false);
    onNew();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <h2 className="text-white font-bold text-sm tracking-tight">Quick Log</h2>
        <span className="text-white/20 text-[10px]">iMessage, calls, meetings</span>
      </div>

      <div className="space-y-2 mb-3">
        <select
          value={contactId || ""}
          onChange={(e) => setContactId(e.target.value ? Number(e.target.value) : null)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/20 appearance-none"
        >
          <option value="">Select contact (optional)</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#111]">
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-1.5">
          {(["imessage", "in-person", "phone", "other"] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className="flex-1 px-2 py-1.5 rounded-lg text-[11px] border transition-all"
              style={{
                background: channel === ch ? "rgba(16,185,129,0.1)" : "transparent",
                borderColor: channel === ch ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)",
                color: channel === ch ? "#34D399" : "rgba(255,255,255,0.3)",
              }}
            >
              {ch}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="Texted Roche, confirmed Thursday..."
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-emerald-500/20"
          />
          <button
            onClick={save}
            disabled={saving || !note.trim()}
            className="px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors disabled:opacity-30"
          >
            Log
          </button>
        </div>
      </div>

      {/* recent logs */}
      <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
        {logs.map((l) => (
          <div key={l.id} className="flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-white/[0.02]">
            <span className="text-[10px] text-white/20 flex-shrink-0 mt-0.5 w-12">{l.channel}</span>
            {l.contact_name && (
              <span className="text-emerald-400/60 text-[11px] flex-shrink-0 font-medium">
                {l.contact_name}:
              </span>
            )}
            <span className="text-white/40 text-[11px] flex-1">{l.note}</span>
            <span className="text-white/15 text-[10px] flex-shrink-0">{timeAgo(l.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMMAND PAGE
   ═══════════════════════════════════════════ */
export default function CommandPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [contactFilter, setContactFilter] = useState<"all" | "high-touch" | "active-deal" | "pipeline">("all");
  const [activityTab, setActivityTab] = useState<"brayan" | "ryan">("brayan");
  const [syncing, setSyncing] = useState(false);
  const [backfilling, setBackfilling] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncUpdates, setSyncUpdates] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/command");
      const d = await res.json();
      setData(d);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time sync — polls Gmail history every 15 seconds
  const syncGmail = useCallback(async (silent = true) => {
    if (!silent) setSyncing(true);
    try {
      const res = await fetch("/api/command/sync");
      const d = await res.json();
      if (d.updated > 0) {
        setSyncUpdates((prev) => prev + d.updated);
        fetchData(); // Refresh dashboard with new data
      }
      setLastSync(new Date().toLocaleTimeString());
    } catch {
      // silent
    } finally {
      setSyncing(false);
    }
  }, [fetchData]);

  // Backfill from Gmail history
  const runBackfill = useCallback(async () => {
    setBackfilling(true);
    try {
      const res = await fetch("/api/command/backfill", { method: "POST" });
      const d = await res.json();
      if (d.success) {
        setSyncUpdates(d.synced);
        fetchData();
      }
    } catch {
      // silent
    } finally {
      setBackfilling(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    // Initial sync to set history baseline
    syncGmail(true);
    // Poll every 15 seconds for real-time updates
    const interval = setInterval(() => syncGmail(true), 15000);
    return () => clearInterval(interval);
  }, [fetchData, syncGmail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white/30 text-sm animate-pulse">Loading Command Center...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-red-400/60 text-sm">Failed to load dashboard</div>
      </div>
    );
  }

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const filteredContacts =
    contactFilter === "all"
      ? data.contacts.all
      : data.contacts.all.filter((c) => (c.priority || "pipeline") === contactFilter);

  const totalContacts = data.contacts.all.length;
  const overdueCount = data.briefing.overdueCount;
  const coldCount = data.briefing.goingCold.length;
  const highTouchCount = data.contacts.highTouch.length;

  return (
    <>
      <div className="min-h-screen bg-[#050505]">
        {/* ── HEADER ── */}
        <header className="border-b border-white/[0.06] px-6 py-5">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">
                {greeting}, Brayan
              </h1>
              <p className="text-white/25 text-sm mt-0.5">{dateStr}</p>
            </div>
            <div className="flex items-center gap-6">
              {/* quick stats */}
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <span className="text-white text-lg font-bold block">{totalContacts}</span>
                  <span className="text-white/20 text-[10px] tracking-wider uppercase">Contacts</span>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="text-center">
                  <span className={`text-lg font-bold block ${overdueCount > 0 ? "text-amber-400" : "text-white"}`}>
                    {overdueCount}
                  </span>
                  <span className="text-white/20 text-[10px] tracking-wider uppercase">Overdue</span>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="text-center">
                  <span className={`text-lg font-bold block ${coldCount > 0 ? "text-red-400" : "text-white"}`}>
                    {coldCount}
                  </span>
                  <span className="text-white/20 text-[10px] tracking-wider uppercase">Going Cold</span>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="text-center">
                  <span className="text-red-400 text-lg font-bold block">{highTouchCount}</span>
                  <span className="text-white/20 text-[10px] tracking-wider uppercase">High Touch</span>
                </div>
              </div>
              {/* sync status */}
              <div className="flex items-center gap-2">
                {lastSync && (
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${syncing ? "bg-cyan-400 animate-pulse" : "bg-emerald-500"}`} />
                    <span className="text-white/20 text-[10px]">
                      {syncing ? "syncing..." : `synced ${lastSync}`}
                    </span>
                    {syncUpdates > 0 && (
                      <span className="text-cyan-400/60 text-[10px] font-medium">
                        +{syncUpdates}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400/70 text-[11px] font-medium hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
                title="View NGL website"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                Website
              </a>
              <button
                onClick={runBackfill}
                disabled={backfilling}
                className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400/70 text-[11px] font-medium hover:bg-violet-500/20 transition-colors disabled:opacity-50"
                title="Scan Gmail history and backfill contact stats"
              >
                {backfilling ? "Scanning Gmail..." : "Backfill"}
              </button>
              <button
                onClick={() => syncGmail(false)}
                disabled={syncing}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/30 hover:text-white/60 transition-colors disabled:opacity-50"
                title="Sync now"
              >
                <svg className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* ── MAIN GRID ── */}
        <main className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* ════════ LEFT COLUMN: BRIEFING ════════ */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              {/* needs approval */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <h2 className="text-white font-bold text-sm">Needs Your Attention</h2>
                </div>
                {data.briefing.needsApproval.length === 0 && data.briefing.goingCold.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                    <p className="text-white/25 text-xs">All clear — no contacts with active goals need attention</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.briefing.needsApproval.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl bg-red-500/[0.06] border border-red-500/20 cursor-pointer hover:bg-red-500/[0.1] transition-colors"
                        onClick={() => setEditContact(c)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{c.name}</span>
                          <span className="text-red-400/60 text-[10px]">follow-up overdue</span>
                        </div>
                        <p className="text-red-400/40 text-[10px] mt-1 tracking-wider uppercase">Why</p>
                        <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{c.end_goal}</p>
                        <p className="text-white/20 text-[10px] mt-1">
                          Last contact {daysAgoLabel(c.last_contact_date)} &middot; Follow-up was {c.follow_up_date}
                        </p>
                      </div>
                    ))}
                    {data.briefing.goingCold.map((c) => (
                      <div
                        key={`cold-${c.id}`}
                        className="p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 cursor-pointer hover:bg-amber-500/[0.1] transition-colors"
                        onClick={() => setEditContact(c)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{c.name}</span>
                          <span className="text-amber-400/60 text-[10px]">
                            no contact in {daysAgo(c.last_contact_date)}d
                          </span>
                        </div>
                        <p className="text-amber-400/40 text-[10px] mt-1 tracking-wider uppercase">At risk</p>
                        <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{c.end_goal}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* auto-sent summary */}
              {data.briefing.autoSendable.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <h2 className="text-white font-bold text-sm">Auto Follow-ups Ready</h2>
                  </div>
                  <div className="space-y-1.5">
                    {data.briefing.autoSendable.map((c) => (
                      <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/[0.04] border border-cyan-500/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
                        <span className="text-white/60 text-xs">{c.name}</span>
                        <span className="text-white/20 text-[10px] ml-auto">{c.organization}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ryan's activity */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {(["brayan", "ryan"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActivityTab(tab)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                        style={{
                          background: activityTab === tab ? "rgba(255,255,255,0.08)" : "transparent",
                          color: activityTab === tab ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <span className="text-white/15 text-[10px] tracking-wider uppercase">Activity</span>
                </div>
                <div className="space-y-1 max-h-[250px] overflow-y-auto">
                  {(activityTab === "brayan" ? data.activity.brayan : data.activity.ryan).map((a) => (
                    <div key={a.id} className="px-2.5 py-1.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white/40 text-[11px]">{a.action}</span>
                        <span className="text-white/60 text-[11px] font-medium">{a.resource_name}</span>
                      </div>
                      <span className="text-white/15 text-[10px]">{timeAgo(a.created_at)}</span>
                    </div>
                  ))}
                  {(activityTab === "brayan" ? data.activity.brayan : data.activity.ryan).length === 0 && (
                    <p className="text-white/15 text-xs text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>
            </div>

            {/* ════════ CENTER COLUMN: CONTACTS ════════ */}
            <div className="col-span-12 lg:col-span-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-sm tracking-tight">Relationships</h2>
                <div className="flex gap-1">
                  {(["all", "high-touch", "active-deal", "pipeline"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setContactFilter(f)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
                      style={{
                        background: contactFilter === f ? "rgba(255,255,255,0.08)" : "transparent",
                        color: contactFilter === f ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {f === "all" ? "All" : f.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {filteredContacts.length === 0 ? (
                  <div className="p-8 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                    <p className="text-white/25 text-sm">No contacts in this category yet.</p>
                    <p className="text-white/15 text-xs mt-1">Click a contact to set its priority and end goal.</p>
                  </div>
                ) : (
                  filteredContacts.map((c) => (
                    <ContactCard key={c.id} contact={c} onEdit={setEditContact} />
                  ))
                )}
              </div>
            </div>

            {/* ════════ RIGHT COLUMN: BRAIN DUMP + QUICK LOG ════════ */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <BrainDumpSection dumps={data.brainDumps} onNew={fetchData} />

              <div className="h-px bg-white/[0.06]" />

              <QuickLogSection
                contacts={data.contacts.all}
                logs={data.quickLogs}
                onNew={fetchData}
              />
            </div>
          </div>
        </main>

        {/* footer */}
        <footer className="border-t border-white/[0.04] px-6 py-4 mt-10">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <span className="text-white/10 text-xs">NGL Command Center</span>
            <a
              href="mailto:brayan@nextgenerationlearners.com"
              className="text-white/10 text-xs hover:text-white/25 transition-colors"
            >
              brayan@nextgenerationlearners.com
            </a>
          </div>
        </footer>
      </div>

      {/* ── CONTACT PANEL ── */}
      {editContact && (
        <ContactPanel
          contact={editContact}
          onClose={() => setEditContact(null)}
          onSave={() => {
            setEditContact(null);
            fetchData();
          }}
        />
      )}
    </>
  );
}
