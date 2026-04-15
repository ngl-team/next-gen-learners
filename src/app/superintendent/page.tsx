"use client";

import { useEffect, useState, useCallback } from "react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface Email {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  messageId: string;
  snippet: string;
  labels: string[];
}

interface Classification {
  id: string;
  category: "URGENT" | "ACTION_NEEDED" | "DELEGATE" | "FYI" | "SPAM";
  reason: string;
  suggestedAction: string;
  delegateTo?: string;
}

interface ThreadMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  messageId: string;
  body: string;
}

type Category = "URGENT" | "ACTION_NEEDED" | "DELEGATE" | "FYI" | "SPAM" | "ALL";

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  URGENT: { label: "Urgent", color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: "!" },
  ACTION_NEEDED: { label: "Action", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: ">" },
  DELEGATE: { label: "Delegate", color: "#3B82F6", bg: "rgba(59,130,246,0.1)", icon: "D" },
  FYI: { label: "FYI", color: "#94A3B8", bg: "rgba(148,163,184,0.1)", icon: "i" },
  SPAM: { label: "Spam", color: "#64748B", bg: "rgba(100,116,139,0.08)", icon: "x" },
};

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */
function extractName(from: string): string {
  const match = from.match(/^"?([^"<]+)"?\s*</);
  return match ? match[1].trim() : from.split("@")[0];
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function SuperintendentPage() {
  // State
  const [user, setUser] = useState("roche");
  const [emails, setEmails] = useState<Email[]>([]);
  const [classifications, setClassifications] = useState<Map<string, Classification>>(new Map());
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [thread, setThread] = useState<ThreadMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [draftMeta, setDraftMeta] = useState<{ subject: string; replyTo: string; lastMessageId: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");

  // Loading states
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingTriage, setLoadingTriage] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [sending, setSending] = useState(false);

  // Status
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState("");
  const [voiceReady, setVoiceReady] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [filter, setFilter] = useState<"unread" | "all">("unread");

  // Check Gmail connection on mount
  useEffect(() => {
    fetch(`/api/auth/gmail/status?user=${user}`)
      .then(r => r.json())
      .then(data => {
        setGmailConnected(data.connected);
        setGmailEmail(data.email || "");
        if (data.connected) {
          loadInbox();
          initVoice();
        } else {
          setLoadingInbox(false);
        }
      })
      .catch(() => setLoadingInbox(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Load inbox
  const loadInbox = useCallback(async () => {
    setLoadingInbox(true);
    try {
      const res = await fetch(`/api/superintendent/inbox?user=${user}&max=100&filter=${filter}`);
      const data = await res.json();
      if (data.emails) {
        setEmails(data.emails);
        if (data.emails.length > 0) triageEmails(data.emails);
        else setLoadingInbox(false);
      } else {
        setLoadingInbox(false);
      }
    } catch {
      setLoadingInbox(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filter]);

  // Triage emails
  const triageEmails = async (emailList: Email[]) => {
    setLoadingTriage(true);
    try {
      const res = await fetch("/api/superintendent/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: emailList.map(e => ({
            id: e.id,
            from: e.from,
            subject: e.subject,
            snippet: e.snippet,
            date: e.date,
          })),
        }),
      });
      const data = await res.json();
      if (data.classifications) {
        const map = new Map<string, Classification>();
        data.classifications.forEach((c: Classification) => map.set(c.id, c));
        setClassifications(map);
      }
    } catch (e) {
      console.error("Triage error:", e);
    } finally {
      setLoadingTriage(false);
      setLoadingInbox(false);
    }
  };

  // Init voice profile
  const initVoice = async () => {
    setLoadingVoice(true);
    try {
      const res = await fetch("/api/superintendent/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });
      const data = await res.json();
      if (data.profile) setVoiceReady(true);
    } catch {
      // Voice profile is optional, don't block
    } finally {
      setLoadingVoice(false);
    }
  };

  // Load thread
  const selectEmail = async (email: Email) => {
    setSelectedEmail(email);
    setDraft("");
    setDraftMeta(null);
    setSendStatus(null);
    setLoadingThread(true);
    try {
      const res = await fetch(`/api/emails/thread?id=${email.threadId}&user=${user}`);
      const data = await res.json();
      if (data.messages) setThread(data.messages);
    } catch (e) {
      console.error("Thread error:", e);
    } finally {
      setLoadingThread(false);
    }
  };

  // Generate draft
  const generateDraft = async (instruction?: string) => {
    if (!selectedEmail) return;
    setLoadingDraft(true);
    setSendStatus(null);
    try {
      const res = await fetch("/api/superintendent/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: selectedEmail.threadId,
          user,
          instruction,
        }),
      });
      const data = await res.json();
      if (data.draft) {
        setDraft(data.draft);
        setDraftMeta({
          subject: data.subject,
          replyTo: data.replyTo,
          lastMessageId: data.lastMessageId,
        });
      }
    } catch (e) {
      console.error("Draft error:", e);
    } finally {
      setLoadingDraft(false);
    }
  };

  // Send email
  const handleSend = async () => {
    if (!draft || !draftMeta || !selectedEmail) return;
    setSending(true);
    setSendStatus(null);
    try {
      const res = await fetch("/api/superintendent/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user,
          to: draftMeta.replyTo,
          subject: draftMeta.subject,
          body: draft,
          threadId: selectedEmail.threadId,
          messageId: draftMeta.lastMessageId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendStatus({ type: "success", msg: "Sent!" });
        setDraft("");
        setDraftMeta(null);
        // Remove from list
        setEmails(prev => prev.filter(e => e.id !== selectedEmail.id));
        setSelectedEmail(null);
        setThread([]);
      } else {
        setSendStatus({ type: "error", msg: data.error || "Failed to send" });
      }
    } catch {
      setSendStatus({ type: "error", msg: "Network error" });
    } finally {
      setSending(false);
    }
  };

  // Copy to clipboard
  const copyDraft = () => {
    navigator.clipboard.writeText(draft);
    setSendStatus({ type: "success", msg: "Copied to clipboard!" });
  };

  // Filter emails by category
  const filteredEmails = activeCategory === "ALL"
    ? emails.filter(e => classifications.get(e.id)?.category !== "SPAM")
    : emails.filter(e => classifications.get(e.id)?.category === activeCategory);

  // Category counts
  const counts: Record<string, number> = { URGENT: 0, ACTION_NEEDED: 0, DELEGATE: 0, FYI: 0, SPAM: 0 };
  emails.forEach(e => {
    const c = classifications.get(e.id);
    if (c) counts[c.category]++;
  });

  /* ═══════════════════════════════════════════
     NOT CONNECTED STATE
     ═══════════════════════════════════════════ */
  if (!gmailConnected && !loadingInbox) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFBFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>&#9993;</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8, color: "#1E1B4B" }}>Email Command Center</h1>
          <p style={{ color: "#64748B", marginBottom: 24, fontSize: ".9rem", lineHeight: 1.6 }}>
            Connect your Gmail to get started. Your emails are never stored - they are fetched live and processed securely.
          </p>
          <a
            href={`/api/auth/gmail?user=${user}`}
            style={{ display: "inline-block", padding: "12px 32px", background: "#4F46E5", color: "white", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: ".9rem" }}
          >
            Connect Gmail
          </a>
          <p style={{ marginTop: 16, fontSize: ".7rem", color: "#94A3B8" }}>Data secured by Anthropic & Google OAuth</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     MAIN UI
     ═══════════════════════════════════════════ */
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#FAFBFF", fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: "hidden" }}>

      {/* ── Header ── */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid #E2E8F0", background: "white", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontSize: "1rem", fontWeight: 800, color: "#1E1B4B", margin: 0 }}>Email Command Center</h1>
          {loadingVoice && <span style={{ fontSize: ".65rem", color: "#F59E0B", fontWeight: 600 }}>Learning your voice...</span>}
          {voiceReady && <span style={{ fontSize: ".65rem", color: "#10B981", fontWeight: 600 }}>Voice profile ready</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: ".75rem", color: "#64748B" }}>{gmailEmail}</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => { setFilter("unread"); }} style={{ padding: "4px 10px", fontSize: ".65rem", fontWeight: 700, border: "1px solid #E2E8F0", borderRadius: 6, background: filter === "unread" ? "#4F46E5" : "white", color: filter === "unread" ? "white" : "#64748B", cursor: "pointer" }}>Unread</button>
            <button onClick={() => { setFilter("all"); }} style={{ padding: "4px 10px", fontSize: ".65rem", fontWeight: 700, border: "1px solid #E2E8F0", borderRadius: 6, background: filter === "all" ? "#4F46E5" : "white", color: filter === "all" ? "white" : "#64748B", cursor: "pointer" }}>All</button>
          </div>
          <button onClick={() => loadInbox()} style={{ padding: "6px 14px", fontSize: ".7rem", fontWeight: 700, background: "#4F46E5", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Refresh</button>
        </div>
      </header>

      {/* ── Stats Bar ── */}
      <div style={{ display: "flex", gap: 8, padding: "8px 20px", borderBottom: "1px solid #E2E8F0", background: "white", flexShrink: 0 }}>
        <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#1E1B4B" }}>{emails.length} emails</span>
        {Object.entries(counts).filter(([, v]) => v > 0).map(([cat, count]) => (
          <span key={cat} style={{ fontSize: ".7rem", fontWeight: 600, color: CATEGORY_CONFIG[cat]?.color || "#64748B", background: CATEGORY_CONFIG[cat]?.bg || "transparent", padding: "2px 8px", borderRadius: 4 }}>
            {count} {CATEGORY_CONFIG[cat]?.label || cat}
          </span>
        ))}
      </div>

      {/* ── Three Panel Layout ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── LEFT: Inbox List ── */}
        <div style={{ width: "30%", minWidth: 280, borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", background: "white" }}>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 2, padding: "8px 12px", borderBottom: "1px solid #E2E8F0", flexWrap: "wrap" }}>
            <button onClick={() => setActiveCategory("ALL")} style={{ padding: "4px 8px", fontSize: ".6rem", fontWeight: 700, border: "1px solid #E2E8F0", borderRadius: 6, background: activeCategory === "ALL" ? "#1E1B4B" : "transparent", color: activeCategory === "ALL" ? "white" : "#64748B", cursor: "pointer" }}>All</button>
            {(["URGENT", "ACTION_NEEDED", "DELEGATE", "FYI"] as const).map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "4px 8px", fontSize: ".6rem", fontWeight: 700, border: `1px solid ${CATEGORY_CONFIG[cat].color}30`, borderRadius: 6, background: activeCategory === cat ? CATEGORY_CONFIG[cat].color : "transparent", color: activeCategory === cat ? "white" : CATEGORY_CONFIG[cat].color, cursor: "pointer" }}>
                {CATEGORY_CONFIG[cat].label} {counts[cat] > 0 && `(${counts[cat]})`}
              </button>
            ))}
          </div>

          {/* Email list */}
          <div style={{ flex: 1, overflow: "auto" }}>
            {(loadingInbox || loadingTriage) && (
              <div style={{ padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: ".85rem", fontWeight: 600, color: "#4F46E5", marginBottom: 4 }}>
                  {loadingInbox ? "Loading inbox..." : "AI is sorting your emails..."}
                </div>
                <div style={{ fontSize: ".7rem", color: "#94A3B8" }}>This takes a few seconds</div>
              </div>
            )}
            {!loadingInbox && !loadingTriage && filteredEmails.length === 0 && (
              <div style={{ padding: 20, textAlign: "center", color: "#94A3B8", fontSize: ".85rem" }}>
                {emails.length === 0 ? "No emails found" : "No emails in this category"}
              </div>
            )}
            {filteredEmails.map(email => {
              const cls = classifications.get(email.id);
              const isSelected = selectedEmail?.id === email.id;
              const catConfig = cls ? CATEGORY_CONFIG[cls.category] : null;
              return (
                <div
                  key={email.id}
                  onClick={() => selectEmail(email)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #F1F5F9",
                    cursor: "pointer",
                    background: isSelected ? "#EEF2FF" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#1E1B4B", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {extractName(email.from)}
                    </span>
                    <span style={{ fontSize: ".6rem", color: "#94A3B8", flexShrink: 0, marginLeft: 8 }}>{timeAgo(email.date)}</span>
                  </div>
                  <div style={{ fontSize: ".75rem", color: "#334155", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {email.subject || "(no subject)"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {catConfig && (
                      <span style={{ fontSize: ".55rem", fontWeight: 800, color: catConfig.color, background: catConfig.bg, padding: "1px 6px", borderRadius: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>
                        {catConfig.label}
                      </span>
                    )}
                    {cls && <span style={{ fontSize: ".6rem", color: "#94A3B8" }}>{cls.reason}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CENTER: Email Thread ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!selectedEmail ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>&#8592;</div>
                <div style={{ fontSize: ".9rem" }}>Select an email to read</div>
              </div>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", background: "white" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1E1B4B", marginBottom: 4 }}>{selectedEmail.subject}</h2>
                <div style={{ fontSize: ".75rem", color: "#64748B" }}>
                  From: {selectedEmail.from}
                </div>
                {classifications.get(selectedEmail.id) && (
                  <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                    {(() => {
                      const cls = classifications.get(selectedEmail.id)!;
                      const cfg = CATEGORY_CONFIG[cls.category];
                      return (
                        <>
                          <span style={{ fontSize: ".65rem", fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "3px 10px", borderRadius: 6 }}>{cfg.label}</span>
                          <span style={{ fontSize: ".7rem", color: "#64748B" }}>{cls.suggestedAction}</span>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Thread messages */}
              <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
                {loadingThread ? (
                  <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>Loading thread...</div>
                ) : (
                  thread.map((msg, i) => (
                    <div key={msg.id || i} style={{ marginBottom: 20, background: "white", borderRadius: 12, border: "1px solid #E2E8F0", padding: "16px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#1E1B4B" }}>{extractName(msg.from)}</span>
                        <span style={{ fontSize: ".65rem", color: "#94A3B8" }}>{msg.date ? new Date(msg.date).toLocaleDateString() : ""}</span>
                      </div>
                      <div style={{ fontSize: ".82rem", color: "#334155", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {msg.body || "(no content)"}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action buttons */}
              <div style={{ padding: "12px 20px", borderTop: "1px solid #E2E8F0", background: "white", display: "flex", gap: 8 }}>
                <button onClick={() => generateDraft()} disabled={loadingDraft} style={{ flex: 1, padding: "10px 16px", fontSize: ".8rem", fontWeight: 700, background: "#4F46E5", color: "white", border: "none", borderRadius: 8, cursor: loadingDraft ? "wait" : "pointer", opacity: loadingDraft ? 0.6 : 1 }}>
                  {loadingDraft ? "Drafting..." : "Draft Reply"}
                </button>
                <button onClick={() => generateDraft("Write a brief acknowledgment and say I will follow up")} disabled={loadingDraft} style={{ padding: "10px 16px", fontSize: ".8rem", fontWeight: 600, background: "#F1F5F9", color: "#334155", border: "1px solid #E2E8F0", borderRadius: 8, cursor: "pointer" }}>
                  Quick Ack
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT: Draft Panel ── */}
        <div style={{ width: "28%", minWidth: 260, borderLeft: "1px solid #E2E8F0", display: "flex", flexDirection: "column", background: "white" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: ".85rem", fontWeight: 700, color: "#1E1B4B", margin: 0 }}>AI Draft</h3>
          </div>

          {!draft && !loadingDraft ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
              <div style={{ textAlign: "center", color: "#94A3B8" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>&#9997;</div>
                <div style={{ fontSize: ".8rem" }}>Click &quot;Draft Reply&quot; to generate a response</div>
                {voiceReady && <div style={{ fontSize: ".65rem", marginTop: 4, color: "#10B981" }}>Will match your writing style</div>}
              </div>
            </div>
          ) : loadingDraft ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: ".85rem", fontWeight: 600, color: "#4F46E5" }}>Writing draft...</div>
                <div style={{ fontSize: ".7rem", color: "#94A3B8", marginTop: 4 }}>Using your voice profile</div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {draftMeta && (
                <div style={{ padding: "8px 16px", fontSize: ".7rem", color: "#64748B", borderBottom: "1px solid #F1F5F9" }}>
                  To: {draftMeta.replyTo}<br />
                  Subject: {draftMeta.subject}
                </div>
              )}
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                style={{ flex: 1, padding: 16, border: "none", outline: "none", fontSize: ".82rem", lineHeight: 1.7, color: "#1E1B4B", resize: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
              <div style={{ padding: "12px 16px", borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: 8 }}>
                {sendStatus && (
                  <div style={{ fontSize: ".75rem", fontWeight: 600, color: sendStatus.type === "success" ? "#10B981" : "#EF4444", textAlign: "center" }}>
                    {sendStatus.msg}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={handleSend} disabled={sending} style={{ flex: 1, padding: "10px", fontSize: ".85rem", fontWeight: 800, background: "#10B981", color: "white", border: "none", borderRadius: 8, cursor: sending ? "wait" : "pointer", opacity: sending ? 0.6 : 1 }}>
                    {sending ? "Sending..." : "Send"}
                  </button>
                  <button onClick={copyDraft} style={{ padding: "10px 14px", fontSize: ".75rem", fontWeight: 600, background: "#F1F5F9", color: "#334155", border: "1px solid #E2E8F0", borderRadius: 8, cursor: "pointer" }}>
                    Copy
                  </button>
                </div>
                <button onClick={() => generateDraft()} style={{ padding: "6px", fontSize: ".7rem", fontWeight: 600, color: "#64748B", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Regenerate draft
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
