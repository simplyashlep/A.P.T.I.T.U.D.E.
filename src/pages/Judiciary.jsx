import React, { useMemo, useState } from "react";
import staticJudges from "../data/judges.json";
import { Gavel, Search, X, ExternalLink, AlertTriangle, Award, MapPin } from "lucide-react";
import { TopNav } from "../components/aptitude/TopNav";
import { Footer } from "../components/aptitude/Footer";

const RISK_STYLES = {
  pending: { label: "Pending", color: "#5B7B9A", bg: "rgba(91,123,154,0.12)" },
  low: { label: "Low Risk", color: "#7CA88B", bg: "rgba(124,168,139,0.12)" },
  moderate: { label: "Moderate", color: "#C8A97E", bg: "rgba(200,169,126,0.14)" },
  high: { label: "High Risk", color: "#D9966A", bg: "rgba(217,150,106,0.14)" },
  critical: { label: "Critical", color: "#CF6B6B", bg: "rgba(207,107,107,0.14)" },
};

const fmt = (value, suffix = "") => (value == null ? "—" : `${value}${suffix}`);

const buildStats = (judges) => {
  const counties = [...new Set(judges.map((j) => j.county).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const courts = [...new Set(judges.map((j) => j.category || j.court).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  return {
    totals: {
      judges: judges.length,
      judgesWithMetrics: judges.filter((j) => j.metricsVerified).length,
      presidingJudges: judges.filter((j) => j.isPresiding).length,
    },
    counties: counties.map((name) => ({ name })),
    courts,
  };
};

const RiskBadge = ({ risk, score }) => {
  const r = RISK_STYLES[risk] || RISK_STYLES.pending;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] uppercase tracking-[0.28em]" style={{ borderColor: `${r.color}55`, color: r.color, background: r.bg }} data-testid="risk-badge">
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
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  if (!judge.officialPhotoUrl || errored) {
    return (
      <div className="rounded-full border-2 border-[rgba(200,169,126,0.55)] bg-[#0E1420] flex items-center justify-center flex-shrink-0 gold-circle" style={{ width: size, height: size }} data-testid="judge-avatar-initials">
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
    <div className="text-[12px]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="uppercase tracking-[0.22em] text-secondary text-[10px]">{label}</span>
        <span className="font-display text-ivory">{value}<span className="text-gold ml-0.5">{suffix}</span></span>
      </div>
      <div className="h-px bg-[rgba(245,241,230,0.07)] relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[rgba(200,169,126,0.6)] to-[rgba(200,169,126,0.9)]" style={{ width: `${pct}%`, transition: "width 900ms cubic-bezier(.22,.61,.36,1)" }} />
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

const FilterSelect = ({ value, onChange, placeholder, options, labelMap = {}, testid }) => (
  <div className="relative">
    <select value={value} onChange={(e) => onChange(e.target.value)} className="apt-search-soft py-3 px-4 pr-10 text-[13px] uppercase tracking-[0.22em] text-ivory-dim min-w-[200px] appearance-none cursor-pointer" data-testid={testid}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option} className="bg-[#0A0F1A]">{labelMap[option] || option}</option>
      ))}
    </select>
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none text-[10px]">▾</span>
  </div>
);

const JudgeCard = ({ judge }) => {
  const [hovered, setHovered] = useState(false);
  const [locked, setLocked] = useState(false);
  const flipped = hovered || locked;
  const isCritical = judge.riskLevel === "critical";

  return (
    <div
      className="flip-card judge-card h-[420px] md:h-[460px] [perspective:1400px]"
      data-testid={`judge-card-${judge.id}`}
      onMouseEnter={() => !locked && setHovered(true)}
      onMouseLeave={() => !locked && setHovered(false)}
      onClick={() => setLocked((value) => !value)}
      role="button"
      tabIndex={0}
      aria-pressed={locked}
    >
      <div className="judge-card-inner relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", willChange: "transform" }}>
        <div className="absolute inset-0 card-3d-raised p-6 flex flex-col justify-between cursor-pointer" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", zIndex: flipped ? 1 : 2 }}>
          <div>
            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] uppercase tracking-[0.34em] text-gold">{judge.isPresiding ? "Presiding Judge" : "Sitting Judge"}</span>
              {judge.isPresiding && <span className="text-[9.5px] uppercase tracking-[0.28em] text-gold border border-[rgba(200,169,126,0.45)] px-2 py-0.5">Presiding</span>}
            </div>
            <div className="flex items-start gap-5">
              <JudgeAvatar judge={judge} size={80} />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[22px] md:text-[24px] text-ivory leading-tight truncate" title={judge.name}>{judge.name}</h3>
                <div className="mt-1.5 text-[12px] uppercase tracking-[0.22em] text-secondary">{judge.category}</div>
              </div>
            </div>
            <div className="mt-5 space-y-2.5 text-[13px]">
              <div className="flex items-center gap-2 text-ivory-dim">
                <MapPin className="w-3.5 h-3.5 text-gold opacity-60" strokeWidth={1.4} />
                {judge.county} County
                {judge.district != null && <span className="text-secondary">· District {Math.round(judge.district)}</span>}
              </div>
              <div className="text-ivory-dim">{judge.roleTitle}</div>
              <div className="text-secondary text-[12px] italic font-serif-h">{judge.tenureDisplay || "—"}</div>
            </div>
            <div className="mt-5"><RiskBadge risk={judge.riskLevel} score={judge.score} /></div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.07)]">
            <span className="text-[10px] uppercase tracking-[0.28em] text-secondary">{locked ? "Tap again to settle" : "Hover or tap to flip"}</span>
            {judge.bioUrl && (
              <a href={judge.bioUrl} target="_blank" rel="noreferrer" className="px-3 py-2 border border-line text-secondary hover:text-gold hover:border-[rgba(200,169,126,0.45)] transition-colors" title="Official bio" data-testid={`judge-bio-${judge.id}`} onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        <div className="absolute inset-0 card-3d-raised card-3d-back p-6 flex flex-col justify-between cursor-pointer" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: flipped ? 2 : 1 }}>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-[0.34em] text-gold">{judge.metricsVerified ? "Verified Metrics" : "Pending Verification"}</span>
              <RiskBadge risk={judge.riskLevel} score={judge.score} />
            </div>

            {judge.metricsVerified ? (
              <div className="space-y-3">
                <MetricBar label="Prison Usage" value={judge.prisonUsage} />
                <MetricBar label="Reversal Rate" value={judge.reversalRate} />
                <MetricBar label="Counsel Disparity" value={judge.counselDisparity} />
                <MetricBar label="Racial Disparity" value={judge.racialDisparity} />
                <div className="flex items-center justify-between text-[11px] pt-1"><span className="uppercase tracking-[0.24em] text-secondary text-[10px]">2024 Caseload</span><span className="font-display text-ivory">{fmt(judge.caseload2024)}</span></div>
                <div className="flex items-center justify-between text-[11px]"><span className="uppercase tracking-[0.24em] text-secondary text-[10px]">2024 Appeals</span><span className="font-display text-ivory">{fmt(judge.appeals2024)}</span></div>
                {isCritical && judge.flags && judge.flags.length > 0 && (
                  <div className="mt-2 border-t border-[rgba(207,107,107,0.25)] pt-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.24em] text-[#CF6B6B] mb-1.5"><AlertTriangle className="w-3 h-3" />Flags</div>
                    <div className="text-[11.5px] text-ivory-dim leading-snug">{judge.flags[0]}</div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="font-serif-h italic text-ivory-dim/80 text-[14px] leading-relaxed">Tier II analytics pending verification. Identity, term, and role are confirmed against the Oregon Judicial Department roster.</p>
                {judge.focus && <p className="mt-3 text-[12px] uppercase tracking-[0.22em] text-secondary">Focus · {judge.focus}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.07)]">
            <span className="text-[10px] uppercase tracking-[0.28em] text-secondary">{locked ? "Tap again to settle" : "Hover or tap to flip"}</span>
            {judge.bioUrl && (
              <a href={judge.bioUrl} target="_blank" rel="noreferrer" className="px-3 py-2 border border-line text-secondary hover:text-gold hover:border-[rgba(200,169,126,0.45)] transition-colors" title="Official bio" data-testid={`judge-bio-${judge.id}`} onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
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
      <h1 className="font-display text-5xl md:text-7xl text-ivory leading-[1.02] max-w-4xl">The Judiciary.<span className="italic text-gold"> {stats ? `All ${stats.totals.judges} of them.` : "Every sitting judge."}</span></h1>
      <p className="mt-7 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed max-w-3xl">Circuit, Court of Appeals, Supreme, and Tax — the bench that decides nearly every Oregon case that doesn't settle. Identity is confirmed first; patterns and deep records reveal as the analytic layer verifies each name.</p>
    </div>
  </header>
);

export default function Judiciary() {
  const [q, setQ] = useState("");
  const [county, setCounty] = useState("");
  const [risk, setRisk] = useState("");
  const [court, setCourt] = useState("");

  const stats = useMemo(() => buildStats(staticJudges), []);

  const filteredJudges = useMemo(() => {
    const lowerQ = q.trim().toLowerCase();

    return staticJudges.filter((judge) => {
      const haystack = [judge.name, judge.county, judge.category, judge.court, judge.roleTitle, judge.tenureDisplay, judge.focus, judge.flags?.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (lowerQ && !haystack.includes(lowerQ)) return false;
      if (county && judge.county !== county) return false;
      if (risk && judge.riskLevel !== risk) return false;
      if (court && (judge.category !== court && judge.court !== court)) return false;
      return true;
    });
  }, [q, county, risk, court]);

  const showReset = Boolean(q || county || risk || court);

  return (
    <div className="relative min-h-screen pb-32" data-testid="judiciary-page">
      <TopNav />
      <PageHeader stats={stats} />

      <section className="max-w-[1360px] mx-auto px-6 md:px-10 mt-12">
        <div className="flex flex-col xl:flex-row xl:items-end gap-4 xl:gap-4 mb-8" data-testid="judiciary-toolbar">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold opacity-70" />
            <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, county, or court…" className="w-full apt-search-soft pl-11 pr-5 py-3 text-[15px]" data-testid="judiciary-search" />
          </div>
          <FilterSelect value={county} onChange={setCounty} placeholder="All counties" options={stats.counties.map((c) => c.name)} testid="filter-county" />
          <FilterSelect value={court} onChange={setCourt} placeholder="All courts" options={stats.courts} testid="filter-court" />
          <FilterSelect value={risk} onChange={setRisk} placeholder="All risk levels" options={["critical", "high", "moderate", "low", "pending"]} labelMap={{ critical: "Critical", high: "High", moderate: "Moderate", low: "Low", pending: "Pending" }} testid="filter-risk" />
          {showReset && (
            <button type="button" onClick={() => { setQ(""); setCounty(""); setRisk(""); setCourt(""); }} className="inline-flex items-center gap-2 px-4 py-3 border border-[rgba(200,169,126,0.35)] text-[11px] uppercase tracking-[0.3em] text-gold hover:bg-[rgba(200,169,126,0.08)] transition-colors" data-testid="judiciary-reset">
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--apt-line)] mb-10" data-testid="judiciary-stat-strip">
          <Stat label="Indexed" value={stats.totals.judges} suffix="judges" />
          <Stat label="With Metrics" value={stats.totals.judgesWithMetrics} suffix="verified" />
          <Stat label="Presiding" value={stats.totals.presidingJudges} suffix="judges" />
          <Stat label="Counties" value={stats.counties.length} suffix="indexed" />
        </div>

        <div className="mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.32em] text-secondary">
          <span data-testid="judiciary-result-count">{filteredJudges.length} {filteredJudges.length === 1 ? "judge" : "judges"} matched</span>
          <span className="text-gold">211 total in the archive</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6" data-testid="judiciary-grid">
          {filteredJudges.map((judge) => <JudgeCard key={judge.id} judge={judge} />)}
        </div>

        {filteredJudges.length === 0 && (
          <div className="py-20 text-center" data-testid="judiciary-empty">
            <p className="font-serif-h italic text-ivory-dim text-lg">No judges match these filters. Loosen the query and the record will speak again.</p>
          </div>
        )}

        <p className="mt-10 text-[11px] text-secondary italic max-w-4xl">
          <Award className="inline w-3 h-3 mr-1 text-gold" />
          Photos are sourced from the Oregon Blue Book. Hover or tap any card to flip it, and use the filters above to narrow the full bench.
        </p>
      </section>

      <Footer />
    </div>
  );
}
