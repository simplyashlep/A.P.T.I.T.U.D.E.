import React, { useMemo, useState, useRef } from "react";
import staticJudges from "../data/judges.json";
import { Gavel, SlidersHorizontal, ExternalLink, AlertTriangle, Award, MapPin } from "lucide-react";
import { TopNav } from "../components/aptitude/TopNav";
import { Footer } from "../components/aptitude/Footer";
import FilterPanel from "../components/judiciary/FilterPanel";
import { applyJudgeFilters } from "../components/judiciary/filters";

const RISK_STYLES = {
  pending:  { label: "Pending",    color: "#5B7B9A", bg: "rgba(91,123,154,0.12)"   },
  low:      { label: "Low Risk",   color: "#7CA88B", bg: "rgba(124,168,139,0.12)"  },
  moderate: { label: "Moderate",   color: "#C8A97E", bg: "rgba(200,169,126,0.14)"  },
  high:     { label: "High Risk",  color: "#D9966A", bg: "rgba(217,150,106,0.14)"  },
  critical: { label: "Critical",   color: "#CF6B6B", bg: "rgba(207,107,107,0.14)"  },
};

const fmt = (value, suffix = "") => (value == null ? "—" : `${value}${suffix}`);

// Generate Ballotpedia URL from judge name — strips middle initials
const toBallotpedia = (name) => {
  if (!name) return null;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return `https://ballotpedia.org/${parts[0]}`;
  const first = parts[0];
  const last = parts[parts.length - 1];
  const middle = parts.slice(1, -1).filter(m => !(m.length <= 2 && /^[A-Z]\.?$/.test(m)));
  return `https://ballotpedia.org/${[first, ...middle, last].join("_")}`;
};

const buildStats = (judges) => {
  const counties = [...new Set(judges.map((j) => j.county).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const courts   = [...new Set(judges.map((j) => j.category || j.court).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return {
    totals: {
      judges:            judges.length,
      judgesWithMetrics: judges.filter((j) => j.metricsVerified).length,
      presidingJudges:   judges.filter((j) => j.isPresiding).length,
    },
    counties: counties.map((name) => ({ name })),
    courts,
  };
};

const RiskBadge = ({ risk, score }) => {
  const r = RISK_STYLES[risk] || RISK_STYLES.pending;
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] uppercase tracking-[0.28em]"
      style={{ borderColor: `${r.color}55`, color: r.color, background: r.bg }}
      data-testid="risk-badge"
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />
      {r.label}
      {score != null && <span className="opacity-70">· {score}</span>}
    </div>
  );
};

const JudgeAvatar = ({ judge, size = 88 }) => {
  const [errored, setErrored] = useState(false);
  const initials = (judge.name || "?")
    .split(" ").filter(Boolean)
    .map((p) => p[0]).slice(0, 2).join("");

  if (!judge.officialPhotoUrl || errored) {
    return (
      <div
        className="rounded-full border-2 border-[rgba(200,169,126,0.55)] bg-[#0E1420] flex items-center justify-center flex-shrink-0 gold-circle"
        style={{ width: size, height: size }}
        data-testid="judge-avatar-initials"
      >
        <span className="font-display text-gold" style={{ fontSize: size * 0.42 }}>{initials}</span>
      </div>
    );
  }
  return (
    <img
      src={judge.officialPhotoUrl}
      alt={judge.name}
      onError={() => setErrored(true)}
      className="rounded-full object-cover border-2 border-[rgba(200,169,126,0.55)] flex-shrink-0 gold-circle"
      style={{ width: size, height: size, objectPosition: "center top" }}
      data-testid="judge-avatar-photo"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};

const MetricBar = ({ label, value, suffix = "%", max = 100 }) => {
  if (value == null) return null;
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="uppercase tracking-[0.24em] text-secondary text-[10px]">{label}</span>
        <span className="font-display text-ivory text-[15px]">
          {value}<span className="text-gold ml-0.5 text-[12px]">{suffix}</span>
        </span>
      </div>
      <div className="h-px bg-[rgba(245,241,230,0.07)] relative overflow-hidden rounded-full">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, rgba(200,169,126,0.5), rgba(200,169,126,0.95))",
            transition: "width 900ms cubic-bezier(.22,.61,.36,1)",
          }}
        />
      </div>
    </div>
  );
};

const Stat = ({ label, value, suffix }) => (
  <div className="bg-[#0A0F1A] p-5 md:p-6">
    <div className="text-[10px] uppercase tracking-[0.32em] text-gold mb-2">{label}</div>
    <div className="font-display text-3xl md:text-4xl text-ivory counter-tabular">{value?.toLocaleString?.() ?? value}</div>
    <div className="text-[10.5px] uppercase tracking-[0.22em] text-secondary mt-1">{suffix}</div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   JUDGE CARD
   Fix: removed zIndex toggling on both faces (was causing mirror/backwards text).
        Relying purely on backface-visibility + correct pre-rotation on back face.
        Added spring easing + explicit webkit transform-style for Safari.
   Design: larger fonts, deeper shadow stack, brighter top edge, spring flip feel.
───────────────────────────────────────────────────────────────────────────── */
const cardSurface = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(160deg, rgba(18,25,42,0.90) 0%, rgba(10,15,26,0.85) 100%)",
  backdropFilter: "blur(22px) saturate(140%)",
  WebkitBackdropFilter: "blur(22px) saturate(140%)",
  border: "1px solid rgba(245,241,230,0.10)",
  borderTop: "1px solid rgba(245,241,230,0.20)",   // bright top edge = raised
  borderRadius: 4,
  boxShadow: [
    "0 1px 0 rgba(255,255,255,0.10) inset",
    "0 -1px 0 rgba(0,0,0,0.70) inset",
    "0 4px 8px -2px rgba(0,0,0,0.55)",
    "0 16px 32px -12px rgba(0,0,0,0.70)",
    "0 32px 64px -24px rgba(0,0,0,0.65)",
    "0 56px 96px -40px rgba(0,0,0,0.45)",
    "0 0 0 0.5px rgba(200,169,126,0.06)",          // gold halo — barely perceptible
  ].join(", "),
  padding: "1.5rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  cursor: "pointer",
  overflow: "hidden",
};

const cardSurfaceBack = {
  ...cardSurface,
  background: "linear-gradient(160deg, rgba(14,20,34,0.92) 0%, rgba(8,12,22,0.88) 100%)",
  borderTop: "1px solid rgba(200,169,126,0.18)",   // gold top edge on back face
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  transform: "rotateY(180deg)",                    // pre-rotated: sits face-down until parent flips
};

const JudgeCard = ({ judge }) => {
  const [hovered, setHovered] = useState(false);
  const [locked,  setLocked]  = useState(false);
  const flipped     = hovered || locked;
  const isCritical  = judge.riskLevel === "critical";

  return (
    <div
      className="judge-card"
      style={{ perspective: "1600px", height: "480px" }}
      data-testid={`judge-card-${judge.id}`}
      onMouseEnter={() => !locked && setHovered(true)}
      onMouseLeave={() => !locked && setHovered(false)}
      onClick={() => setLocked((v) => !v)}
      role="button"
      tabIndex={0}
      aria-pressed={locked}
    >
      {/* Inner container — rotates on flip. BOTH faces use backface-visibility:hidden.
          No z-index toggling: that was the source of the mirror bug. */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",         // Safari
          willChange: "transform",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)", // spring — overshoots then snaps
        }}
      >

        {/* ── FRONT FACE ── */}
        <div
          style={{
            ...cardSurface,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            // NO zIndex here — backface-visibility alone controls visibility
          }}
        >
          {/* Grain texture */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 4,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.03 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            opacity: 0.5, mixBlendMode: "overlay",
          }} />

          <div>
            <div className="flex items-start justify-between mb-5">
              <span className="text-[10px] uppercase tracking-[0.34em] text-gold">
                {judge.isPresiding ? "Presiding Judge" : "Sitting Judge"}
              </span>
              {judge.isPresiding && (
                <span className="text-[9.5px] uppercase tracking-[0.28em] text-gold border border-[rgba(200,169,126,0.45)] px-2 py-0.5">
                  Presiding
                </span>
              )}
            </div>

            <div className="flex items-start gap-5">
              <JudgeAvatar judge={judge} size={88} />
              <div className="min-w-0 flex-1">
                <h3
                  className="font-display text-[26px] md:text-[30px] text-ivory leading-tight"
                  title={judge.name}
                >
                  {judge.name}
                </h3>
                <div className="mt-2 text-[11px] uppercase tracking-[0.26em] text-secondary">
                  {judge.category}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-[14px]">
              <div className="flex items-center gap-2 text-ivory-dim">
                <MapPin className="w-3.5 h-3.5 text-gold opacity-60 flex-shrink-0" strokeWidth={1.4} />
                {judge.county} County
                {judge.district != null && (
                  <span className="text-secondary">· District {Math.round(judge.district)}</span>
                )}
              </div>
              <div className="text-ivory-dim leading-snug">{judge.roleTitle}</div>
              <div className="text-secondary text-[13px] italic font-serif-h">
                {judge.tenureDisplay || "—"}
              </div>
            </div>

            <div className="mt-5">
              <RiskBadge risk={judge.riskLevel} score={judge.score} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.07)]">
            <span className="text-[10px] uppercase tracking-[0.28em] text-secondary">
              {locked ? "Tap again to settle" : "Hover or tap to flip"}
            </span>
            <a
              href={toBallotpedia(judge.name)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 border border-line text-secondary hover:text-gold hover:border-[rgba(200,169,126,0.45)] transition-colors"
              title="View on Ballotpedia"
              data-testid={`judge-bio-${judge.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* ── BACK FACE ──
            Pre-rotated 180deg. When parent flips to 180deg, net = 360deg = 0deg = readable.
            This is what makes text read left-to-right on the back. */}
        <div style={cardSurfaceBack}>
          {/* Gold top accent line */}
          <div style={{
            position: "absolute", top: 0, left: "12%", right: "12%", height: 1,
            background: "linear-gradient(90deg, transparent, rgba(200,169,126,0.5), transparent)",
            pointerEvents: "none",
          }} />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] uppercase tracking-[0.34em] text-gold">
                {judge.metricsVerified ? "Verified Metrics" : "Pending Verification"}
              </span>
              <RiskBadge risk={judge.riskLevel} score={judge.score} />
            </div>

            {judge.metricsVerified ? (
              <div className="space-y-4">
                <MetricBar label="Prison Usage"      value={judge.prisonUsage}      />
                <MetricBar label="Reversal Rate"     value={judge.reversalRate}     />
                <MetricBar label="Counsel Disparity" value={judge.counselDisparity} />
                <MetricBar label="Racial Disparity"  value={judge.racialDisparity}  />
                <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-[0.24em] text-secondary text-[10px]">2024 Caseload</span>
                    <span className="font-display text-ivory text-[18px]">{fmt(judge.caseload2024)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="uppercase tracking-[0.24em] text-secondary text-[10px]">2024 Appeals</span>
                    <span className="font-display text-ivory text-[18px]">{fmt(judge.appeals2024)}</span>
                  </div>
                </div>
                {isCritical && judge.flags?.length > 0 && (
                  <div className="border-t border-[rgba(207,107,107,0.25)] pt-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.24em] text-[#CF6B6B] mb-2">
                      <AlertTriangle className="w-3 h-3" />Flags
                    </div>
                    <div className="text-[12px] text-ivory-dim leading-snug">{judge.flags[0]}</div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="font-serif-h italic text-ivory-dim/80 text-[15px] leading-relaxed">
                  Tier II analytics pending verification. Identity, term, and role are confirmed against
                  the Oregon Judicial Department roster.
                </p>
                {judge.focus && (
                  <p className="mt-4 text-[12px] uppercase tracking-[0.22em] text-secondary">
                    Focus · {judge.focus}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.07)]">
            <span className="text-[10px] uppercase tracking-[0.28em] text-secondary">
              {locked ? "Tap again to settle" : "Hover or tap to flip"}
            </span>
            <a
              href={toBallotpedia(judge.name)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 border border-line text-secondary hover:text-gold hover:border-[rgba(200,169,126,0.45)] transition-colors"
              title="View on Ballotpedia"
              data-testid={`judge-bio-${judge.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

const PageHeader = ({ stats }) => (
  <header className="relative pt-32 md:pt-40 pb-10 md:pb-12 px-6 md:px-10 overflow-hidden">
    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
      <Gavel className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] text-gold" strokeWidth={0.5} />
    </div>
    <div className="relative max-w-[1360px] mx-auto">
      <div className="eyebrow mb-5">Pillar I · The Bench</div>
      <h1 className="font-display text-5xl md:text-7xl text-ivory leading-[1.02] max-w-4xl">
        The Judiciary.
        <span className="italic text-gold">
          {stats ? ` All ${stats.totals.judges} of them.` : " Every sitting judge."}
        </span>
      </h1>
      <p className="mt-7 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed max-w-3xl">
        Circuit, Court of Appeals, Supreme, and Tax — the bench that decides nearly every Oregon case
        that doesn't settle. Identity is confirmed first; patterns and deep records reveal as the
        analytic layer verifies each name.
      </p>
    </div>
  </header>
);

export default function Judiciary() {
  const [filters, setFilters] = useState({ q: "", county: "", risk: "", court: "", caseTypes: [] });
  const [panelOpen, setPanelOpen] = useState(false);
  const filterTriggerRef = useRef(null);

  const stats          = useMemo(() => buildStats(staticJudges), []);
  const filteredJudges = useMemo(
    () => applyJudgeFilters(staticJudges, filters),
    [filters]
  );

  const showReset = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v)
  );

  return (
    <div className="relative min-h-screen pb-32" data-testid="judiciary-page">
      <TopNav />
      <div>
        <div className={`judiciary-surface ${panelOpen ? "judiciary-surface-open" : ""}`}>
      <PageHeader stats={stats} />

      <section className="max-w-[1360px] mx-auto px-6 md:px-10 mt-12">
        {/* Toolbar — filters live in the side panel now */}
        <div className="flex flex-col xl:flex-row xl:items-end gap-4 mb-8" data-testid="judiciary-toolbar">
          <div className="flex-1" />
          <button
            ref={filterTriggerRef}
            type="button"
            onClick={() => setPanelOpen(true)}
            className="inline-flex items-center gap-3 px-6 py-3 border border-[rgba(200,169,126,0.4)] text-[11px] uppercase tracking-[0.3em] text-gold hover:bg-[rgba(200,169,126,0.08)] transition-colors"
            data-testid="judiciary-filter-trigger"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showReset ? "Refine filters" : "Filters"}
            {showReset && <span className="w-1.5 h-1.5 rounded-full bg-[var(--apt-gold)]" />}
          </button>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--apt-line)] mb-10" data-testid="judiciary-stat-strip">
          <Stat label="Indexed"     value={stats.totals.judges}            suffix="judges"   />
          <Stat label="With Metrics" value={stats.totals.judgesWithMetrics} suffix="verified" />
          <Stat label="Presiding"   value={stats.totals.presidingJudges}   suffix="judges"   />
          <Stat label="Counties"    value={stats.counties.length}          suffix="indexed"  />
        </div>

        {/* Result count */}
        <div className="mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.32em] text-secondary">
          <span data-testid="judiciary-result-count">
            {filteredJudges.length} {filteredJudges.length === 1 ? "judge" : "judges"} matched
          </span>
          <span className="text-gold">211 total in the archive</span>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8" data-testid="judiciary-grid">
          {filteredJudges.map((judge) => <JudgeCard key={judge.id} judge={judge} />)}
        </div>

        {filteredJudges.length === 0 && (
          <div className="py-20 text-center" data-testid="judiciary-empty">
            <p className="font-serif-h italic text-ivory-dim text-lg">
              No judges match these filters. Loosen the query and the record will speak again.
            </p>
          </div>
        )}

        <p className="mt-10 text-[11px] text-secondary italic max-w-4xl">
          <Award className="inline w-3 h-3 mr-1 text-gold" />
          Photos are sourced from the Oregon Blue Book. Hover or tap any card to flip it,
          and use the filter panel to narrow the full bench.
        </p>
      </section>

      <Footer />
        </div>
      </div>

      <FilterPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        triggerRef={filterTriggerRef}
        filters={filters}
        onChange={setFilters}
        resultCount={filteredJudges.length}
        counties={stats.counties.map((c) => c.name)}
        courts={stats.courts}
      />
    </div>
  );
}
