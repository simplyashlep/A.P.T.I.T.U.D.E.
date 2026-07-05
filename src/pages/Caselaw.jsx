import React, { useState, useCallback } from "react";
import { PageShell } from "../components/aptitude/PageShell";
import axios from "axios";
import {
  Search,
  Loader2,
  ExternalLink,
  Scale,
  FlaskConical,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const API = `${import.meta.env.VITE_BACKEND_URL || ""}/api`;

/* ─── Failure mode tags ──────────────────────────────────────────── */
const FAILURE_MODES = {
  documentation_failure:  { label: "Documentation Failure",  cls: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  notice_failure:         { label: "Notice Failure",          cls: "text-orange-400 bg-orange-400/10 border-orange-400/30" },
  timing_failure:         { label: "Timing Failure",          cls: "text-red-400 bg-red-400/10 border-red-400/30" },
  evidentiary_failure:    { label: "Evidentiary Failure",     cls: "text-purple-400 bg-purple-400/10 border-purple-400/30" },
  due_process_failure:    { label: "Due Process",             cls: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  excessive_force:        { label: "Excessive Force",         cls: "text-red-500 bg-red-500/10 border-red-500/30" },
  fourth_amendment:       { label: "Fourth Amendment",        cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  first_amendment:        { label: "First Amendment",         cls: "text-sky-400 bg-sky-400/10 border-sky-400/30" },
  equal_protection:       { label: "Equal Protection",        cls: "text-violet-400 bg-violet-400/10 border-violet-400/30" },
  reasonable_efforts:     { label: "Reasonable Efforts",      cls: "text-teal-400 bg-teal-400/10 border-teal-400/30" },
  section_1983:           { label: "§ 1983",                  cls: "text-gold bg-gold/10 border-gold/30" },
  other:                  { label: "Other",                   cls: "text-secondary bg-white/5 border-white/10" },
};

/* ─── Court scope presets ────────────────────────────────────────── */
const SCOPES = [
  { id: "federal", label: "Federal Courts",       desc: "SCOTUS · 9th Cir. · D.Or." },
  { id: "oregon",  label: "Oregon Courts",         desc: "Supreme Ct. · Court of Appeals" },
  { id: "all",     label: "All Jurisdictions",     desc: "Federal + Oregon state courts" },
];

/* ─── Quick-search chips ─────────────────────────────────────────── */
const CHIPS = [
  "42 USC 1983 Oregon excessive force",
  "DHS reasonable efforts reunification ORS 419B",
  "Fourth Amendment warrantless search Oregon",
  "Monell municipal liability policy practice",
  "qualified immunity clearly established law",
  "due process liberty interest deprivation",
  "FCRA willful noncompliance credit reporting",
  "ORS 90 landlord prohibited lease provisions",
];

/* ─── Friendly court label ───────────────────────────────────────── */
const COURT_LABELS = {
  scotus:    "U.S. Supreme Court",
  ca9:       "9th Circuit",
  ord:       "D. Oregon",
  or:        "Oregon Supreme Court",
  orctapp:   "Oregon Court of Appeals",
};

/* ─── Case card ──────────────────────────────────────────────────── */
function CaseCard({ result, onTakeToLab }) {
  const [expanded, setExpanded] = useState(false);
  const fm  = FAILURE_MODES[result.failure_mode] || FAILURE_MODES.other;
  const court = COURT_LABELS[result.court] || result.court_label || result.court;
  const year  = result.date ? result.date.slice(0, 4) : "";

  return (
    <article className="border border-white/8 rounded-xl bg-[rgba(13,18,28,0.5)] hover:border-white/16 transition-all duration-300 overflow-hidden">

      {/* Header strip */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.32em] text-gold font-medium">{court}</span>
          {year       && <span className="text-[10px] text-secondary">· {year}</span>}
          {result.citation && <span className="text-[10px] text-secondary/70 font-mono">{result.citation}</span>}
          {result.status && result.status !== "Published" && (
            <span className="text-[9.5px] uppercase tracking-[0.24em] text-secondary border border-white/10 rounded px-1.5 py-0.5">
              {result.status}
            </span>
          )}
        </div>
        {result.failure_mode && (
          <span className={`text-[9.5px] uppercase tracking-[0.28em] px-2 py-0.5 rounded border shrink-0 ${fm.cls}`}>
            {fm.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">

        {/* Case name */}
        <h3 className="font-display text-[1.1rem] text-ivory leading-tight tracking-wide">
          {result.caseName}
        </h3>

        {/* Plain summary */}
        {result.plain_summary && (
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-gold mb-1.5">What This Means</div>
            <p className="text-ivory-dim text-[14px] leading-relaxed">{result.plain_summary}</p>
          </div>
        )}

        {/* Institutional burden */}
        {result.institutional_burden && (
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-secondary mb-1.5">Who Carried the Burden</div>
            <p className="text-ivory-dim text-[13.5px] leading-relaxed italic">{result.institutional_burden}</p>
          </div>
        )}

        {/* Key quote */}
        {result.best_quote && (
          <div className="border-l-2 border-gold/40 pl-4 py-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-1.5">Key Quote</div>
            <blockquote className="text-[13px] text-ivory-dim leading-relaxed">
              "{result.best_quote}"
            </blockquote>
          </div>
        )}

        {/* Fallback: raw snippet when no AI summary */}
        {!result.plain_summary && result.snippet && (
          <p className="text-ivory-dim text-[13.5px] leading-relaxed line-clamp-4">
            {result.snippet}
          </p>
        )}

        {/* Expandable full excerpt */}
        {result.snippet && result.plain_summary && (
          <div>
            <button
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.24em] text-secondary hover:text-ivory transition-colors"
            >
              {expanded ? (
                <><ChevronUp className="w-3 h-3" /> Hide Court Language</>
              ) : (
                <><ChevronDown className="w-3 h-3" /> Show Court Language</>
              )}
            </button>
            {expanded && (
              <div className="mt-3 p-4 bg-white/3 rounded-lg border border-white/5 text-[13px] text-ivory-dim leading-relaxed">
                {result.snippet}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-6 py-4 border-t border-white/5 flex items-center gap-6 flex-wrap">
        <a
          href={result.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ivory-dim hover:text-gold transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Full Opinion
        </a>
        <button
          onClick={() => onTakeToLab(result)}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold hover:text-ivory transition-colors"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Take to Juris Lab
        </button>
      </div>
    </article>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function Caselaw() {
  const [q, setQ]           = useState("");
  const [scope, setScope]   = useState("federal");
  const [dateMin, setDateMin] = useState("");
  const [dateMax, setDateMax] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData]     = useState(null);
  const [searchErr, setSearchErr] = useState(null);
  const navigate = useNavigate();

  const runSearch = useCallback(
    async (query, overrideScope) => {
      const finalQ = (query || q).trim();
      if (!finalQ || loading) return;
      setLoading(true);
      setSearchErr(null);
      setData(null);
      try {
        const params = { q: finalQ, scope: overrideScope || scope };
        if (dateMin) params.date_min = dateMin;
        if (dateMax) params.date_max = dateMax;
        const res = await axios.get(`${API}/caselaw`, { params });
        setData(res.data);
      } catch (err) {
        const msg = err.response?.data?.error || err.message || "Search failed.";
        setSearchErr(msg);
        toast.error("The search returned an error. Try different terms.");
      } finally {
        setLoading(false);
      }
    },
    [q, scope, dateMin, dateMax, loading]
  );

  const onChip = (chip) => {
    setQ(chip);
    runSearch(chip);
  };

  const onTakeToLab = (result) => {
    navigate("/juris-lab", {
      state: {
        caseContext: {
          caseName:    result.caseName,
          citation:    result.citation,
          court:       result.court_label || result.court,
          date:        result.date,
          summary:     result.plain_summary,
          quote:       result.best_quote,
          url:         result.url,
          burden:      result.institutional_burden,
          failureMode: result.failure_mode,
        },
      },
    });
  };

  return (
    <PageShell
      eyebrow="Case Law"
      title="The Record"
      italicTitle="of What Was Required"
      intro="Where courts have held institutions to their obligations — and where they've failed to. Every case here answers what the institution had to prove, what rule controlled, and how you can use that case next."
      testId="caselaw-page"
    >

      {/* ── Search interface ── */}
      <div className="mb-12 max-w-4xl">

        {/* Search bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); runSearch(); }}
          className="apt-search-soft group relative flex items-center mb-5"
        >
          <Search className="w-4 h-4 text-gold mr-4 flex-shrink-0 opacity-80" strokeWidth={1.4} />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by issue, statute, party, agency, or ORS section…"
            className="flex-1 text-base md:text-xl outline-none border-0 bg-transparent py-4 md:py-5"
            aria-label="Case law search"
          />
          <button
            type="submit"
            disabled={loading || !q.trim()}
            className="ml-3 inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[10.5px] uppercase tracking-[0.32em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:bg-[var(--apt-gold-soft)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <Scale className="w-3 h-3" />
                Search
              </span>
            )}
          </button>
        </form>

        {/* Court scope + date filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="text-[10px] uppercase tracking-[0.3em] text-secondary shrink-0">
            Court scope:
          </span>
          {SCOPES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScope(s.id)}
              title={s.desc}
              className={`text-[10.5px] uppercase tracking-[0.22em] px-3 py-1.5 rounded border transition-all ${
                scope === s.id
                  ? "border-gold/50 text-gold bg-gold/8"
                  : "border-white/10 text-secondary hover:border-white/25 hover:text-ivory"
              }`}
            >
              {s.label}
            </button>
          ))}

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] uppercase tracking-[0.24em] text-secondary">From:</span>
            <input
              type="date"
              value={dateMin}
              onChange={(e) => setDateMin(e.target.value)}
              className="bg-transparent border border-white/10 rounded px-2 py-1 text-[12px] text-ivory-dim focus:outline-none focus:border-gold/40"
            />
            <span className="text-[10px] text-secondary">–</span>
            <input
              type="date"
              value={dateMax}
              onChange={(e) => setDateMax(e.target.value)}
              className="bg-transparent border border-white/10 rounded px-2 py-1 text-[12px] text-ivory-dim focus:outline-none focus:border-gold/40"
            />
          </div>
        </div>

        {/* Quick-search chips */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] tracking-[0.18em] uppercase text-secondary">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChip(c)}
              className="link-quiet"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center gap-4 py-16 text-ivory-dim">
          <Loader2 className="w-5 h-5 animate-spin text-gold" />
          <span className="font-serif-h italic text-lg">Searching the record…</span>
        </div>
      )}

      {/* ── Error ── */}
      {searchErr && !loading && (
        <div className="flex items-start gap-3 py-8 text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <div className="text-[13px] font-medium mb-1">Search error</div>
            <div className="text-[12px] text-secondary">{searchErr}</div>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {data && !loading && (
        <div>
          {/* Result count */}
          <div className="flex items-baseline gap-3 mb-7">
            <span className="text-[11px] uppercase tracking-[0.3em] text-secondary">
              {data.count > 0
                ? `${data.count.toLocaleString()} results — showing top ${data.results.length}`
                : "No cases found"}
            </span>
            {data.query && (
              <span className="text-[12px] text-ivory-dim">
                for "{data.query}"
              </span>
            )}
          </div>

          {data.results.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif-h italic text-xl text-ivory-dim mb-3">No cases found.</p>
              <p className="text-[13px] text-secondary">
                Try broader terms, switch to "All Jurisdictions," or adjust the date range.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.results.map((r, i) => (
                <CaseCard
                  key={r.id || `${r.caseName}-${i}`}
                  result={r}
                  onTakeToLab={onTakeToLab}
                />
              ))}
            </div>
          )}

          {/* Attribution */}
          <div className="mt-12 pt-8 border-t border-white/5 text-[11px] text-secondary leading-relaxed">
            Case data from{" "}
            <a
              href="https://www.courtlistener.com"
              target="_blank"
              rel="noreferrer"
              className="text-gold/60 hover:text-gold transition-colors"
            >
              CourtListener
            </a>{" "}
            (Free Law Project) · Summaries generated by Gemini Flash · Always verify holdings before
            relying on them in litigation. This is not legal advice.
          </div>
        </div>
      )}
    </PageShell>
  );
}
