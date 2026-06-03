import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import staticJudges from "../data/judges.json";
import { Gavel, Search, X, GitCompare, ExternalLink, AlertTriangle, Award, MapPin } from "lucide-react";
import { TopNav } from "../components/aptitude/TopNav";
import { Footer } from "../components/aptitude/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const RISK_STYLES = {
  pending: { label: "Pending", color: "#5B7B9A", bg: "rgba(91,123,154,0.12)" },
  low: { label: "Low Risk", color: "#7CA88B", bg: "rgba(124,168,139,0.12)" },
  moderate: { label: "Moderate", color: "#C8A97E", bg: "rgba(200,169,126,0.14)" },
  high: { label: "High Risk", color: "#D9966A", bg: "rgba(217,150,106,0.14)" },
  critical: { label: "Critical", color: "#CF6B6B", bg: "rgba(207,107,107,0.14)" },
};

const TIER_PILLS = ["I · Identity", "II · Patterns", "III · Deep Record"];

const fmt = (v, suffix = "") => (v == null ? "—" : `${v}${suffix}`);

const RiskBadge = ({ risk, score }) => {
  const r = RISK_STYLES[risk] || RISK_STYLES.pending;
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] uppercase tracking-[0.28em]"
      style={{ borderColor: `${r.color}55`, color: r.color, background: r.bg }}
      data-testid="risk-badge"
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />
      {r.label}
      {score != null && <span className="text-ivory-dim/80">· {score}</span>}
    </div>
  );
};

const JudgeAvatar = ({ judge, size = 80 }) => {
  const [errored, setErrored] = useState(false);
  const initials = (judge.name || "?")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  if (!judge.officialPhotoUrl || errored) {
    return (
      <div
        className="rounded-full border-2 border-[rgba(200,169,126,0.55)] bg-[#0E1420] flex items-center justify-center flex-shrink-0 gold-circle"
        style={{ width: size, height: size }}
        data-testid="judge-avatar-initials"
      >
        <span className="font-display text-gold" style={{ fontSize: size * 0.42 }}>
          {initials}
        </span>
      </div>
    );
  }
  return (
    <img
      src={judge.officialPhotoUrl}
      alt={judge.name}
      onError={() => setErrored(true)}
      className="rounded-full object-cover border-2 border-[rgba(200,169,126,0.55)] flex-shrink-0 gold-circle"
      style={{ width: size, height: size }}
      data-testid="judge-avatar-photo"
      loading="lazy"
    />
  );
};

const MetricBar = ({ label, value, suffix = "%", max = 100 }) => {
  if (value == null) return null;
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="text-\[12px]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="uppercase tracking-\[0.22em] text-secondary text-\[10px]">{label}</span>
        <span className="font-display text-ivory">
          {value}
          <span className="text-gold ml-0.5">{suffix}</span>
        </span>
      </div>
      <div className="h-px bg-\[rgba(245,241,230,0.07)] relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[rgba(200,169,126,0.6)] to-[rgba(200,169,126,0.9)]"
          style={{ width: `${pct}%`, transition: "width 900ms cubic-bezier(.22,.61,.36,1)" }}
        />
      </div>
    </div>
  );
};

const CompareRadio = ({ selected, onSelect, disabled }) => (
  <button
    type="button"
    onClick={(e) => { e.stopPropagation(); onSelect(); }}
    disabled={disabled && !selected}
    className={`compare-radio group flex items-center gap-2.5 px-3 py-2 rounded-sm transition-all duration-400 ${
      selected
        ? "compare-radio-selected"
        : disabled
        ? "opacity-40 cursor-not-allowed"
        : "hover:bg-[rgba(200,169,126,0.06)]"
    }`}
  >
    <span
      className={`compare-radio-dot w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-400 ${
        selected
          ? "border-[var(--apt-gold)] bg-[var(--apt-gold)] shadow-[0_0_12px_rgba(200,169,126,0.4)]"
          : "border-[rgba(200,169,126,0.45)] group-hover:border-[var(--apt-gold)]"
      }`}
    >
      {selected && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#0A0F1A]" />
      )}
    </span>
    <span
      className={`text-[10.5px] uppercase tracking-[0.28em] transition-colors duration-300 ${
        selected ? "text-gold" : "text-secondary group-hover:text-ivory-dim"
      }`}
    >
      {selected ? "Selected" : "Compare"}
    </span>
  </button>
);

const JudgeCard = ({ judge, selected, onSelect, disabled }) => {
  const [flipped, setFlipped] = useState(false);
  const [locked, setLocked] = useState(false);
  const isCritical = judge.riskLevel === "critical";

  const handleMouseEnter = () => {
    if (!locked) setFlipped(true);
  };
  const handleMouseLeave = () => {
    if (!locked) setFlipped(false);
  };
  const handleCardClick = () => {
    if (locked) {
      setLocked(false);
      setFlipped(false);
    } else {
      setLocked(true);
      setFlipped(true);
    }
  };

  return (
    <div
      className={`judge-card h-[420px] md:h-[460px] [perspective:1400px] ${selected ? "is-selected" : ""}`}
      data-testid={`judge-card-${judge.id}`}
    >
      <div
        className={`flip-card-inner relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] card-3d-raised p-6 flex flex-col justify-between cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
        >
          <div>
            <div className="flex items-start justify-between mb-4">
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
              <JudgeAvatar judge={judge} size={80} />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[22px] md:text-[24px] text-ivory leading-tight truncate" title={judge.name}>
                  {judge.name}
                </h3>
                <div className="mt-1.5 text-[12px] uppercase tracking-[0.22em] text-secondary">
                  {judge.category}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-[13px]">
              <div className="flex items-center gap-2 text-ivory-dim">
                <MapPin className="w-3.5 h-3.5 text-gold opacity-60" strokeWidth={1.4} />
                {judge.county} County
                {judge.district != null && (
                  <span className="text-secondary">· District {Math.round(judge.district)}</span>
                )}
              </div>
              <div className="text-ivory-dim">{judge.roleTitle}</div>
              <div className="text-secondary text-[12px] italic font-serif-h">
                {judge.tenureDisplay || "—"}
              </div>
            </div>

            <div className="mt-5">
              <RiskBadge risk={judge.riskLevel} score={judge.score} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.07)]">
            <CompareRadio selected={selected} onSelect={() => onSelect(judge)} disabled={disabled} />
            {judge.bioUrl && (
              <a
                href={judge.bioUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 border border-line text-secondary hover:text-gold hover:border-[rgba(200,169,126,0.45)] transition-colors"
                title="Official bio"
                data-testid={`judge-bio-${judge.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] card-3d-raised card-3d-back p-6 flex flex-col justify-between cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-[0.34em] text-gold">
                {judge.metricsVerified ? "Verified Metrics" : "Pending Verification"}
              </span>
              <RiskBadge risk={judge.riskLevel} score={judge.score} />
            </div>

            {judge.metricsVerified ? (
              <div className="space-y-3">
                <MetricBar label="Prison Usage" value={judge.prisonUsage} />
                <MetricBar label="Reversal Rate" value={judge.reversalRate} />
                <MetricBar label="Counsel Disparity" value={judge.counselDisparity} />
                <MetricBar label="Racial Disparity" value={judge.racialDisparity} />
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="uppercase tracking-[0.24em] text-secondary text-[10px]">2024 Caseload</span>
                  <span className="font-display text-ivory">{fmt(judge.caseload2024)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="uppercase tracking-[0.24em] text-secondary text-[10px]">2024 Appeals</span>
                  <span className="font-display text-ivory">{fmt(judge.appeals2024)}</span>
                </div>
                {isCritical && judge.flags && judge.flags.length > 0 && (
                  <div className="mt-2 border-t border-[rgba(207,107,107,0.25)] pt-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.24em] text-[#CF6B6B] mb-1.5">
                      <AlertTriangle className="w-3 h-3" />
                      Flags
                    </div>
                    <div className="text-[11.5px] text-ivory-dim leading-snug">
                      {judge.flags[0]}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="font-serif-h italic text-ivory-dim/80 text-[14px] leading-relaxed">
                  Tier II analytics pending verification. Identity, term, and role are
                  confirmed against the Oregon Judicial Department roster.
                </p>
                {judge.focus && (
                  <p className="mt-3 text-[12px] uppercase tracking-[0.22em] text-secondary">
                    Focus · {judge.focus}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.07)]">
            <CompareRadio selected={selected} onSelect={() => onSelect(judge)} disabled={disabled} />
            {judge.bioUrl && (
              <a
                href={judge.bioUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 border border-line text-secondary hover:text-gold hover:border-[rgba(200,169,126,0.45)] transition-colors"
                title="Official bio"
                data-testid={`judge-bio-${judge.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompareDrawer = ({ judges, onClear, onRemove, onOpen }) => {
  if (!judges.length) return null;
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(200,169,126,0.35)] bg-[#0A0F1A]/95 backdrop-blur-xl"
      data-testid="compare-drawer"
    >
      <div className="max-w-\[1360px] mx-auto px-6 md:px-10 py-4 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <GitCompare className="w-4 h-4 text-gold" />
          <span className="text-\[11px] uppercase tracking-\[0.32em] text-gold">
            Compare · {judges.length}/3
          </span>
        </div>
        <div className="flex-1 flex items-center gap-3 overflow-x-auto">
          {judges.map((j) => (
            <div
              key={j.id}
              className="flex items-center gap-2 border border-line-strong rounded-full pl-2 pr-3 py-1 flex-shrink-0"
              data-testid={`compare-chip-${j.id}`}
            >
              <JudgeAvatar judge={j} size={26} />
              <span className="text-\[12px] text-ivory">{j.name}</span>
              <button
                type="button"
                onClick={() => onRemove(j)}
                className="text-secondary hover:text-gold"
                aria-label={`Remove ${j.name}`}
                data-testid={`compare-remove-${j.id}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onOpen}
          disabled={judges.length < 2}
          className="px-5 py-2 rounded-full text-[10.5px] uppercase tracking-[0.32em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:bg-[var(--apt-gold-soft)] disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="compare-open"
        >
          Open Comparison
        </button>
        <button
          type="button"
          onClick={onClear}
          className="text-[10.5px] uppercase tracking-[0.28em] text-secondary hover:text-gold"
          data-testid="compare-clear"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

const COMPARE_ROWS = [
  { key: "county", label: "County" },
  { key: "category", label: "Court" },
  { key: "roleTitle", label: "Role" },
  { key: "tenureDisplay", label: "Term" },
  { key: "caseload2024", label: "Caseload (2024)" },
  { key: "prisonUsage", label: "Prison Usage", suffix: "%" },
  { key: "reversalRate", label: "Reversal Rate", suffix: "%" },
  { key: "counselDisparity", label: "Counsel Disparity", suffix: "%" },
  { key: "racialDisparity", label: "Racial Disparity", suffix: "%" },
  { key: "appeals2024", label: "Appeals (2024)" },
];

const CompareModal = ({ judges, onClose }) => {
  if (!judges.length) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      data-testid="compare-modal"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-[#0A0F1A] border border-line-strong rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-\[#0A0F1A]/95 backdrop-blur-xl border-b border-line p-6 flex items-center justify-between">
          <div>
            <div className="text-\[10.5px] uppercase tracking-\[0.36em] text-gold">Comparison</div>
            <h2 className="font-display text-3xl md:text-4xl text-ivory mt-1">Side by side.</h2>
          </div>
          <button onClick={onClose} className="text-ivory-dim hover:text-gold p-2" aria-label="Close" data-testid="compare-modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className={`grid gap-4 md:gap-6 mb-8 ${judges.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
            {judges.map((j) => (
              <div key={j.id} className="card-3d-raised p-5 text-center" data-testid={`compare-card-${j.id}`}>
                <div className="flex justify-center mb-3"><JudgeAvatar judge={j} size={76} /></div>
                <div className="font-display text-xl text-ivory">{j.name}</div>
                <div className="text-\[10.5px] uppercase tracking-\[0.28em] text-secondary mt-1">
                  {j.county} County
                </div>
                <div className="mt-3 flex justify-center"><RiskBadge risk={j.riskLevel} score={j.score} /></div>
              </div>
            ))}
          </div>

          <div className="border border-line rounded-sm overflow-hidden">
            <table className="w-full text-\[13.5px]">
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.key} className={i % 2 ? "bg-[rgba(245,241,230,0.02)]" : ""}>
                    <td className="px-4 py-3 text-\[10.5px] uppercase tracking-\[0.28em] text-gold border-r border-line w-44 align-top">
                      {row.label}
                    </td>
                    {judges.map((j) => {
                      const v = j[row.key];
                      return (
                        <td key={j.id} className="px-4 py-3 text-ivory-dim align-top">
                          {v == null ? <span className="text-secondary">—</span> : `${v}${row.suffix || ""}`}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-\[11px] text-secondary italic">
            <Award className="inline w-3 h-3 mr-1 text-gold" />
            Metric definitions and full methodology available on the Bias Beacon. Where a value is "—",
            metrics for that judge are pending verification.
          </p>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------------------------
   Static fallback helpers
   ----------------------------------------------- */
const buildStaticStats = (judges) => {
  const counties = [...new Set(judges.map((j) => j.county).filter(Boolean))].sort();
  const judgesWithMetrics = judges.filter((j) => j.metricsVerified).length;
  const presidingJudges = judges.filter((j) => j.isPresiding).length;
  return {
    totals: {
      judges: judges.length,
      judgesWithMetrics,
      presidingJudges,
    },
    counties: counties.map((name) => ({ name })),
  };
};

export default function Judiciary() {
  const [judges, setJudges] = useState([]);
  const [stats, setStats] = useState(null);
  const [q, setQ] = useState("");
  const [county, setCounty] = useState("");
  const [risk, setRisk] = useState("");
  const [court, setCourt] = useState("");
  const [loading, setLoading] = useState(true);
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [limit, setLimit] = useState(24);

  useEffect(() => {
    axios.get(`${API}/judges/stats`).then((r) => setStats(r.data)).catch(() => { setStats(buildStaticStats(staticJudges)); });
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    axios
      .get(`${API}/judges`, {
        params: { q: q || undefined, county: county || undefined, risk: risk || undefined, court: court || undefined, limit: 300 },
        signal: ctrl.signal,
      })
      .then((r) => setJudges(r.data.judges || []))
      .catch(() => {
        let filtered = [...staticJudges];
        if (q) {
          const lowerQ = q.toLowerCase();
          filtered = filtered.filter((j) =>
            j.name.toLowerCase().includes(lowerQ) ||
            j.county.toLowerCase().includes(lowerQ) ||
            (j.category || "").toLowerCase().includes(lowerQ)
          );
        }
        if (county) filtered = filtered.filter((j) => j.county === county);
        if (risk) filtered = filtered.filter((j) => j.riskLevel === risk);
        if (court) filtered = filtered.filter((j) => j.category === court || j.court === court);
        setJudges(filtered);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [q, county, risk, court]);

  const visible = useMemo(() => judges.slice(0, limit), [judges, limit]);

  const onSelect = (j) => {
    setCompare((prev) => {
      const exists = prev.find((p) => p.id === j.id);
      if (exists) return prev.filter((p) => p.id !== j.id);
      if (prev.length >= 3) return prev;
      return [...prev, j];
    });
  };

  return (
    <div className="relative min-h-screen pb-32" data-testid="judiciary-page">
      <TopNav />
      <PageHeader stats={stats} />

      <section className="max-w-\[1360px] mx-auto px-6 md:px-10 mt-12">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-8" data-testid="judiciary-toolbar">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold opacity-70" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, county, or court…"
              className="w-full apt-search-soft pl-11 pr-5 py-3 text-[15px]"
              data-testid="judiciary-search"
            />
          </div>
          <FilterSelect value={county} onChange={setCounty} placeholder="All counties" options={stats?.counties?.map((c) => c.name) || []} testid="filter-county" />
          <FilterSelect value={court} onChange={setCourt} placeholder="All courts" options={["Circuit Court", "COA", "Supreme", "Tax"]} testid="filter-court" />
          <FilterSelect value={risk} onChange={setRisk} placeholder="All risk levels" options={["critical", "high", "moderate", "low", "pending"]} labelMap={{ critical: "Critical", high: "High", moderate: "Moderate", low: "Low", pending: "Pending" }} testid="filter-risk" />
        </div>

        {/* Stat strip */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-\[var(--apt-line)] mb-10" data-testid="judiciary-stat-strip">
            <Stat label="Indexed" value={stats.totals.judges} suffix="judges" />
            <Stat label="With Metrics" value={stats.totals.judgesWithMetrics} suffix="verified" />
            <Stat label="Presiding" value={stats.totals.presidingJudges} suffix="judges" />
            <Stat label="Counties" value={stats.counties.length} suffix="indexed" />
          </div>
        )}

        {/* Result count */}
        <div className="mb-6 flex items-center justify-between text-\[11px] uppercase tracking-\[0.32em] text-secondary">
          <span data-testid="judiciary-result-count">
            {loading ? "Searching the record…" : `${judges.length} ${judges.length === 1 ? "judge" : "judges"} matched`}
          </span>
          <span className="text-gold">{compare.length}/3 selected</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" data-testid="judiciary-grid">
          {visible.map((j) => (
            <JudgeCard
              key={j.id}
              judge={j}
              selected={!!compare.find((c) => c.id === j.id)}
              onSelect={onSelect}
              disabled={compare.length >= 3}
            />
          ))}
        </div>

        {judges.length > limit && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + 24)}
              className="inline-flex items-center gap-2 px-7 py-3 border border-[rgba(200,169,126,0.45)] rounded-full text-[11px] uppercase tracking-[0.32em] text-gold hover:bg-[rgba(200,169,126,0.08)] transition-colors"
              data-testid="judiciary-load-more"
            >
              Reveal more  ·  +{Math.min(24, judges.length - limit)}
            </button>
          </div>
        )}

        {!loading && judges.length === 0 && (
          <div className="py-20 text-center" data-testid="judiciary-empty">
            <p className="font-serif-h italic text-ivory-dim text-lg">
              No judges match these filters. Loosen the query and the record will speak again.
            </p>
          </div>
        )}
      </section>

      <CompareDrawer
        judges={compare}
        onClear={() => setCompare([])}
        onRemove={(j) => setCompare((prev) => prev.filter((p) => p.id !== j.id))}
        onOpen={() => setShowCompare(true)}
      />
      {showCompare && <CompareModal judges={compare} onClose={() => setShowCompare(false)} />}
      <Footer />
    </div>
  );
}

const PageHeader = ({ stats }) => (
  <header className="relative pt-32 md:pt-40 pb-10 md:pb-12 px-6 md:px-10 overflow-hidden">
    <div className="absolute inset-0 opacity-\[0.05] pointer-events-none">
      <Gavel className="absolute right-\[6%] top-1/2 -translate-y-1/2 w-\[420px] h-\[420px] text-gold" strokeWidth={0.5} />
    </div>
    <div className="relative max-w-\[1360px] mx-auto">
      <div className="eyebrow mb-5">Pillar I  ·  The Bench</div>
      <h1 className="font-display text-5xl md:text-7xl text-ivory leading-\[1.02] max-w-4xl">
        The Judiciary.

        <span className="italic text-gold">
          {stats ? `All ${stats.totals.judges} of them.` : "Every sitting judge."}
        </span>
      </h1>
      <p className="mt-7 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed max-w-3xl">
        Circuit, Court of Appeals, Supreme, and Tax — the bench that decides nearly
        every Oregon case that doesn't settle. Identity is confirmed first; patterns
        and deep records reveal as the analytic layer verifies each name.
      </p>
    </div>
  </header>
);

const Stat = ({ label, value, suffix }) => (
  <div className="bg-\[#0A0F1A] p-5 md:p-6">
    <div className="text-\[10px] uppercase tracking-\[0.32em] text-gold mb-2">{label}</div>
    <div className="font-display text-3xl md:text-4xl text-ivory counter-tabular">
      {value?.toLocaleString?.() ?? value}
    </div>
    <div className="text-\[10.5px] uppercase tracking-\[0.22em] text-secondary mt-1">{suffix}</div>
  </div>
);

const FilterSelect = ({ value, onChange, placeholder, options, labelMap = {}, testid }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="apt-search-soft py-3 px-4 pr-10 text-[13px] uppercase tracking-[0.22em] text-ivory-dim min-w-[200px] appearance-none cursor-pointer"
      data-testid={testid}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-\[#0A0F1A]">
          {labelMap[o] || o}
        </option>
      ))}
    </select>
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none text-\[10px]">▾</span>
  </div>
);
