import React, { useState, useRef, useCallback } from "react";
import { PageShell } from "../components/aptitude/PageShell";
import {
  FlaskConical, FileSearch, PenTool, Library, Upload,
  CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronUp,
  BookOpen, Flag, Clock, Scale, FileText, Search,
} from "lucide-react";

/* ─── Agent definitions ──────────────────────────────────────────── */
const AGENTS = [
  {
    id: "analyst",
    icon: FileSearch,
    name: "Analyst",
    tag: "Agent 01",
    role: "Reads your document and returns a structured legal summary — issues, parties, exposure, missing facts.",
  },
  {
    id: "researcher",
    icon: Library,
    name: "Researcher",
    tag: "Agent 02",
    role: "Finds comparable Oregon cases and ORS sections, surfaces precedent, and flags appellate trends.",
  },
  {
    id: "draft",
    icon: PenTool,
    name: "Draft Counsel",
    tag: "Agent 03",
    role: "Co-drafts letters, motions, declarations, and complaints — from a chosen template, never auto-filed.",
    disabled: true,
  },
  {
    id: "informer",
    icon: FlaskConical,
    name: "Informer",
    tag: "Agent 04",
    role: "Plain-language explainer for clients and self-represented users. Translates jargon, not advice.",
    disabled: true,
  },
];

/* ─── Strength badge ─────────────────────────────────────────────── */
function StrengthBadge({ value }) {
  const map = {
    Strong: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    Moderate: "text-gold border-gold/30 bg-gold/10",
    Weak: "text-amber-500 border-amber-500/30 bg-amber-500/10",
    Speculative: "text-red-400 border-red-400/30 bg-red-400/10",
  };
  return (
    <span className={`text-[10px] uppercase tracking-[0.3em] px-2 py-0.5 rounded border ${map[value] || "text-ivory-dim border-white/10"}`}>
      {value}
    </span>
  );
}

/* ─── Collapsible section ────────────────────────────────────────── */
function Section({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-gold" strokeWidth={1.25} />}
          <span className="text-[11px] uppercase tracking-[0.3em] text-ivory">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-ivory-dim" /> : <ChevronDown className="w-4 h-4 text-ivory-dim" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

/* ─── Analyst results ───────────────────────────────────────────── */
function AnalystResults({ analysis }) {
  if (!analysis) return null;
  return (
    <div className="space-y-3 mt-6">
      <div className="p-5 bg-white/3 rounded-xl border border-white/8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Summary</div>
        <p className="text-ivory-dim text-sm leading-relaxed">{analysis.summary}</p>
      </div>

      {analysis.parties?.length > 0 && (
        <Section title="Parties" icon={Scale} defaultOpen>
          <div className="space-y-2 pt-1">
            {analysis.parties.map((p, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-ivory font-medium min-w-[140px]">{p.name}</span>
                <span className="text-ivory-dim">{p.role}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {analysis.key_issues?.length > 0 && (
        <Section title={`Key Issues (${analysis.key_issues.length})`} icon={BookOpen} defaultOpen>
          <ul className="space-y-2 pt-1">
            {analysis.key_issues.map((issue, i) => (
              <li key={i} className="text-sm text-ivory-dim flex gap-2">
                <span className="text-gold mt-0.5">•</span><span>{issue}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {analysis.events?.length > 0 && (
        <Section title={`Event Timeline (${analysis.events.length})`} icon={Clock}>
          <div className="space-y-4 pt-2">
            {analysis.events.map((ev, i) => (
              <div key={i} className="border-l border-gold/30 pl-4">
                <div className="flex items-center gap-3 mb-1">
                  {ev.date && <span className="text-[10px] text-gold tracking-wider">{ev.date}</span>}
                  <span className="text-[10px] uppercase tracking-[0.25em] text-ivory-dim">{ev.event_type}</span>
                  {ev.page && <span className="text-[10px] text-ivory-dim">p.{ev.page}</span>}
                </div>
                {ev.quote && (
                  <blockquote className="text-sm text-ivory-dim italic mb-1">"{ev.quote}"</blockquote>
                )}
                {ev.legal_effect && <p className="text-xs text-ivory/60">{ev.legal_effect}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {analysis.flags?.length > 0 && (
        <Section title={`Flags (${analysis.flags.length})`} icon={Flag} defaultOpen>
          <ul className="space-y-2 pt-1">
            {analysis.flags.map((flag, i) => (
              <li key={i} className="text-sm text-amber-400 flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{flag}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {analysis.missing_elements?.length > 0 && (
        <Section title="Missing Elements" icon={FileText}>
          <ul className="space-y-1 pt-1">
            {analysis.missing_elements.map((el, i) => (
              <li key={i} className="text-sm text-ivory-dim flex gap-2">
                <span className="text-red-400 mt-0.5">○</span><span>{el}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

/* ─── Researcher results ────────────────────────────────────────── */
function ResearcherResults({ research }) {
  if (!research) return null;
  return (
    <div className="space-y-3 mt-6">
      <div className="p-5 bg-white/3 rounded-xl border border-white/8">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Legal Framework</div>
          {research.strength_assessment && <StrengthBadge value={research.strength_assessment} />}
        </div>
        <p className="text-ivory-dim text-sm leading-relaxed">{research.governing_framework}</p>
        {research.strength_rationale && (
          <p className="text-xs text-ivory/50 mt-2 italic">{research.strength_rationale}</p>
        )}
      </div>

      {research.primary_statutes?.length > 0 && (
        <Section title={`Oregon Statutes (${research.primary_statutes.length})`} icon={BookOpen} defaultOpen>
          <div className="space-y-4 pt-2">
            {research.primary_statutes.map((s, i) => (
              <div key={i} className="border border-white/8 rounded-lg p-4">
                <div className="text-[11px] text-gold tracking-wider mb-1">{s.citation}</div>
                <div className="text-sm text-ivory font-medium mb-2">{s.title}</div>
                {s.relevant_text && (
                  <blockquote className="text-xs text-ivory-dim italic border-l-2 border-gold/30 pl-3 mb-2">
                    {s.relevant_text}
                  </blockquote>
                )}
                <p className="text-xs text-ivory/60">{s.application}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {research.court_rules?.length > 0 && (
        <Section title={`Court Rules (${research.court_rules.length})`} icon={Scale}>
          <div className="space-y-3 pt-2">
            {research.court_rules.map((r, i) => (
              <div key={i}>
                <div className="text-[11px] text-gold tracking-wider">{r.citation}</div>
                <div className="text-sm text-ivory-dim mt-0.5">{r.application}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {research.case_law?.length > 0 && (
        <Section title={`Case Law (${research.case_law.length})`} icon={Library}>
          <div className="space-y-4 pt-2">
            {research.case_law.map((c, i) => (
              <div key={i} className="border border-white/8 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[11px] text-gold tracking-wider">{c.citation}</span>
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    c.certainty === "high" ? "bg-emerald-400/15 text-emerald-400" :
                    c.certainty === "medium" ? "bg-gold/15 text-gold" : "bg-white/10 text-ivory-dim"
                  }`}>{c.certainty}</span>
                </div>
                <p className="text-sm text-ivory-dim mb-1">{c.holding}</p>
                <p className="text-xs text-ivory/50">{c.application}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {research.deadlines?.length > 0 && (
        <Section title={`Deadlines & Time Rules (${research.deadlines.length})`} icon={Clock} defaultOpen>
          <div className="space-y-3 pt-2">
            {research.deadlines.map((d, i) => (
              <div key={i} className="flex gap-4 text-sm">
                <span className="text-gold min-w-[80px]">{d.period}</span>
                <div>
                  <div className="text-ivory-dim">{d.trigger}</div>
                  <div className="text-xs text-ivory/50">{d.rule} — {d.consequence}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {research.counterarguments?.length > 0 && (
        <Section title="Likely Opposition" icon={Flag}>
          <ul className="space-y-2 pt-1">
            {research.counterarguments.map((c, i) => (
              <li key={i} className="text-sm text-ivory-dim flex gap-2">
                <span className="text-amber-400 mt-0.5">↔</span><span>{c}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {research.remedies_available?.length > 0 && (
        <Section title="Available Remedies" icon={CheckCircle}>
          <ul className="space-y-1 pt-1">
            {research.remedies_available.map((r, i) => (
              <li key={i} className="text-sm text-ivory-dim flex gap-2">
                <span className="text-gold mt-0.5">→</span><span>{r}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {research.research_gaps?.length > 0 && (
        <Section title="Research Gaps">
          <ul className="space-y-1 pt-1">
            {research.research_gaps.map((g, i) => (
              <li key={i} className="text-xs text-ivory/50 flex gap-2">
                <span>□</span><span>{g}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────── */
export default function JurisLab() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadState, setUploadState] = useState("idle");
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [caseNumber, setCaseNumber] = useState("");
  const [activeAgent, setActiveAgent] = useState(null);
  const [agentState, setAgentState] = useState("idle");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [researchResult, setResearchResult] = useState(null);
  const [researchIssue, setResearchIssue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setUploadState("uploading");
    setErrorMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("case_number", caseNumber || "unassigned");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");
      setUploadedDoc(data);
      setUploadState("uploaded");
    } catch (err) {
      setErrorMsg(err.message);
      setUploadState("error");
    }
  }, [caseNumber]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const runAnalyst = async () => {
    if (!uploadedDoc) return;
    setActiveAgent("analyst");
    setAgentState("running");
    setAnalysisResult(null);
    setErrorMsg("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: uploadedDoc.document_id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Analysis failed");
      setAnalysisResult(data.analysis);
      setAgentState("done");
    } catch (err) {
      setErrorMsg(err.message);
      setAgentState("error");
    }
  };

  const runResearcher = async () => {
    if (!researchIssue.trim()) return;
    setActiveAgent("researcher");
    setAgentState("running");
    setResearchResult(null);
    setErrorMsg("");
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: uploadedDoc?.case_id || null,
          issue: researchIssue,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Research failed");
      setResearchResult(data.research);
      setAgentState("done");
    } catch (err) {
      setErrorMsg(err.message);
      setAgentState("error");
    }
  };

  const isRunning = agentState === "running";

  return (
    <PageShell
      testId="juris-lab-page"
      eyebrow="Your Tools"
      title="Juris Lab."
      italicTitle="A workshop, not a vending machine."
      intro="Bring your own documents. Four agents take it from there — analyze, inform, research, draft. Nothing is filed for you. Everything is yours."
    >
      {/* ── Upload zone ─────────────────────────────────────── */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`card-3d-raised p-10 md:p-14 mb-6 text-center border-dashed transition-colors duration-200 ${dragOver ? "border-gold/60 bg-gold/5" : ""}`}
        data-testid="juris-upload"
      >
        {uploadState === "uploaded" ? (
          <>
            <CheckCircle className="w-7 h-7 text-emerald-400 mx-auto mb-4" strokeWidth={1.25} />
            <h3 className="font-display text-3xl text-ivory mb-2">{uploadedDoc.filename}</h3>
            <p className="text-[10px] uppercase tracking-[0.3em] text-ivory-dim mb-1">
              Document stored · Chain of custody established
            </p>
            <p className="text-[10px] text-ivory/40 font-mono">{uploadedDoc.document_id}</p>
          </>
        ) : uploadState === "uploading" ? (
          <>
            <Loader2 className="w-7 h-7 text-gold mx-auto mb-4 animate-spin" strokeWidth={1.25} />
            <h3 className="font-display text-3xl text-ivory">Storing document…</h3>
          </>
        ) : uploadState === "error" ? (
          <>
            <AlertCircle className="w-7 h-7 text-red-400 mx-auto mb-4" strokeWidth={1.25} />
            <h3 className="font-display text-3xl text-ivory mb-2">Upload failed</h3>
            <p className="text-sm text-red-400 mb-4">{errorMsg}</p>
            <button onClick={() => setUploadState("idle")} className="text-[10px] uppercase tracking-[0.3em] text-gold underline">
              Try again
            </button>
          </>
        ) : (
          <>
            <Upload className="w-7 h-7 text-gold mx-auto mb-5 opacity-80" strokeWidth={1.25} />
            <h3 className="font-display text-3xl md:text-4xl text-ivory mb-3">Drop a document.</h3>
            <p className="font-serif-h italic text-ivory-dim max-w-xl mx-auto mb-4">
              PDF, DOCX, plain text. The Analyst reads it first; then you choose which agent works next.
            </p>
            <input
              type="text"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="Case number (optional)"
              className="mb-5 block mx-auto w-full max-w-sm bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm text-ivory placeholder:text-ivory/30 text-center focus:outline-none focus:border-gold/40"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.32em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:brightness-110 transition-all"
            >
              Select File
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </>
        )}
      </div>

      {/* ── Agents ──────────────────────────────────────────── */}
      <div className="mb-6 text-[11px] uppercase tracking-[0.36em] text-gold">The Four Agents</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10" data-testid="juris-agents">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isActive = activeAgent === agent.id;
          const isThisRunning = isActive && isRunning;
          return (
            <div
              key={agent.id}
              className={`card-3d-raised p-7 transition-all duration-200 ${isActive ? "ring-1 ring-gold/30" : ""} ${agent.disabled ? "opacity-50" : ""}`}
              data-testid={`juris-agent-${agent.id}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <Icon className="w-5 h-5 text-gold" strokeWidth={1.25} />
                <div>
                  <div className="text-[10.5px] uppercase tracking-[0.36em] text-secondary">{agent.tag}</div>
                  <h3 className="font-display text-2xl text-ivory">{agent.name}</h3>
                </div>
              </div>
              <p className="text-ivory-dim text-[14.5px] leading-relaxed mb-5">{agent.role}</p>

              {agent.id === "analyst" && !agent.disabled && (
                <button
                  onClick={runAnalyst}
                  disabled={!uploadedDoc || isRunning}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10.5px] uppercase tracking-[0.3em] transition-all ${
                    uploadedDoc && !isRunning
                      ? "bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25"
                      : "bg-white/5 text-ivory/30 border border-white/10 cursor-not-allowed"
                  }`}
                >
                  {isThisRunning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isThisRunning ? "Analyzing…" : uploadedDoc ? "Analyze Document" : "Upload a document first"}
                </button>
              )}

              {agent.id === "researcher" && !agent.disabled && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-ivory/30 shrink-0" strokeWidth={1.25} />
                    <input
                      type="text"
                      value={researchIssue}
                      onChange={(e) => setResearchIssue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !isRunning && runResearcher()}
                      placeholder="Enter legal issue to research…"
                      className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold/40"
                    />
                  </div>
                  <button
                    onClick={runResearcher}
                    disabled={!researchIssue.trim() || isRunning}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10.5px] uppercase tracking-[0.3em] transition-all ${
                      researchIssue.trim() && !isRunning
                        ? "bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25"
                        : "bg-white/5 text-ivory/30 border border-white/10 cursor-not-allowed"
                    }`}
                  >
                    {isThisRunning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {isThisRunning ? "Researching…" : "Research Issue"}
                  </button>
                </div>
              )}

              {agent.disabled && (
                <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/25">Coming next iteration</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Error ───────────────────────────────────────────── */}
      {agentState === "error" && (
        <div className="card-3d-raised p-6 mb-6 border border-red-400/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" strokeWidth={1.25} />
            <p className="text-sm text-red-400">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* ── Analyst results ──────────────────────────────────── */}
      {analysisResult && activeAgent === "analyst" && (
        <div className="card-3d-raised p-7 mb-6" data-testid="analyst-results">
          <div className="flex items-center gap-3 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={1.25} />
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Analyst · Complete</div>
            {analysisResult.document_type && (
              <span className="text-[10px] text-ivory-dim">— {analysisResult.document_type}</span>
            )}
          </div>
          <AnalystResults analysis={analysisResult} />
        </div>
      )}

      {/* ── Researcher results ───────────────────────────────── */}
      {researchResult && activeAgent === "researcher" && (
        <div className="card-3d-raised p-7 mb-6" data-testid="researcher-results">
          <div className="flex items-center gap-3 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={1.25} />
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Researcher · Complete</div>
          </div>
          <ResearcherResults research={researchResult} />
        </div>
      )}
    </PageShell>
  );
}
