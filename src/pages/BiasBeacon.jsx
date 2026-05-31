import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { TopNav } from "../components/aptitude/TopNav";
import { Footer } from "../components/aptitude/Footer";
import { Activity, ExternalLink, Loader2, Map as MapIcon, Scale, BarChart3, TrendingUp } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const RACE_COLORS = {
  white: "#A1A9B8",
  hispanic_latino: "#C8A97E",
  black_african_american: "#CF6B6B",
  asian: "#7CA88B",
  native_american: "#D9966A",
  pacific_islander: "#5B7B9A",
};

const fmt = (n) => (n == null ? "—" : Number(n).toLocaleString());

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const StatBlock = ({ label, value, suffix, tone }) => (
  <div className="bg-[#0A0F1A] p-6 md:p-8" data-testid={`beacon-stat-${label.toLowerCase().replace(/\\s+/g, "-")}`}>
    <div className="text-\[10.5px] uppercase tracking-\[0.36em] text-gold mb-3">{label}</div>
    <div className="font-display text-3xl md:text-5xl text-ivory counter-tabular leading-none">
      {fmt(value)}
      {tone && <span className="text-gold text-2xl ml-1">{tone}</span>}
    </div>
    {suffix && (
      <div className="text-\[11px] uppercase tracking-\[0.22em] text-secondary mt-3">{suffix}</div>
    )}
  </div>
);

const StopDisparityPanel = ({ summary }) => {
  if (!summary) return null;
  const rows = (summary.demographics || []).filter(
    (d) => d.stops_pct != null && d.population_pct != null
  );
  // Disparity ratio: stops_pct / population_pct (1.0 == parity)
  const enriched = rows.map((r) => ({
    ...r,
    ratio: r.population_pct ? +(r.stops_pct / r.population_pct).toFixed(2) : null,
  }));
  return (
    <div className="card-3d-raised p-7 md:p-9" data-testid="beacon-disparity-panel">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-\[10.5px] uppercase tracking-\[0.36em] text-gold">
            Stop · Population Disparity
          </div>
          <h3 className="font-display text-2xl md:text-3xl text-ivory mt-2">
            Where the stops fall.
          </h3>
        </div>
        <Scale className="w-4 h-4 text-steel" strokeWidth={1.25} />
      </div>
      <p className="text-ivory-dim text-\[14px] leading-relaxed max-w-2xl mb-7">
        Each demographic's share of Oregon traffic stops in 2024, set against their share
        of the state population. A ratio above 1.00 is overrepresentation; below 1.00 is
        under.
      </p>
      <div className="space-y-5">
        {enriched.map((r) => {
          const stopsPct = r.stops_pct || 0;
          const popPct = r.population_pct || 0;
          const max = Math.max(stopsPct, popPct, 12);
          const color = RACE_COLORS[r.key] || "#C8A97E";
          const over = r.ratio > 1;
          return (
            <div key={r.key} data-testid={`disparity-row-${r.key}`}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-\[12px] text-ivory">{r.group}</span>
                <span
                  className={`font-display text-lg counter-tabular ${
                    over ? "text-[#CF6B6B]" : "text-[#7CA88B]"
                  }`}
                  title="Stops % ÷ Population %"
                >
                  {r.ratio}×
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-\[rgba(245,241,230,0.04)] overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full opacity-90"
                  style={{ width: `${(stopsPct / max) * 100}%`, background: color, transition: "width 900ms cubic-bezier(.22,.61,.36,1)" }}
                  aria-label="Share of stops"
                />
                <div
                  className="absolute inset-y-0 left-0 border-l border-r border-dashed border-ivory/30"
                  style={{
                    left: `${(popPct / max) * 100}%`,
                    width: 0,
                    height: "100%",
                  }}
                  aria-label="Share of population"
                />
              </div>
              <div className="flex justify-between text-\[10.5px] uppercase tracking-\[0.22em] text-secondary mt-1.5">
                <span>{stopsPct}% of stops</span>
                <span>{popPct}% of population</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-7 pt-5 border-t border-line text-\[11.5px] text-secondary italic">
        Source · Oregon STOP Database under ORS 131.362, 2024 reporting year. Parity line
        (dashed) = each group's share of the Oregon population.
      </div>
    </div>
  );
};

const CountyTotalsPanel = ({ counties }) => {
  if (!counties?.length) return null;
  const max = Math.max(...counties.map((c) => c.total_stops_2024 || 0));
  return (
    <div className="card-3d-raised p-7 md:p-9" data-testid="beacon-counties-panel">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-\[10.5px] uppercase tracking-\[0.36em] text-gold">
            Stops by County · 2024
          </div>
          <h3 className="font-display text-2xl md:text-3xl text-ivory mt-2">
            Where Oregon is being stopped.
          </h3>
        </div>
        <MapIcon className="w-4 h-4 text-steel" strokeWidth={1.25} />
      </div>
      <div className="space-y-4">
        {counties.map((c, i) => (
          <div key={c.key} data-testid={`county-row-${c.key}`}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-\[13px] text-ivory">
                <span className="text-gold mr-2 font-serif-h italic">{String(i + 1).padStart(2, "0")}</span>
                {c.name} County
              </span>
              <span className="font-display text-base text-ivory counter-tabular">{fmt(c.total_stops_2024)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-\[rgba(245,241,230,0.04)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[rgba(200,169,126,0.6)] to-[rgba(200,169,126,0.95)]"
                style={{
                  width: `${((c.total_stops_2024 || 0) / max) * 100}%`,
                  transition: "width 1100ms cubic-bezier(.22,.61,.36,1)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-\[11.5px] text-secondary italic">
        Top reporting counties surfaced from the STOP feed. Full 36-county view ingests
        next.
      </p>
    </div>
  );
};

const TABLEAU_SCRIPT = "https://public.tableau.com/javascripts/api/tableau-2.min.js";
let tableauScriptPromise = null;

const loadTableau = () => {
  if (tableauScriptPromise) return tableauScriptPromise;
  tableauScriptPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("ssr"));
    if (window.tableau && window.tableau.Viz) return resolve(window.tableau);
    const s = document.createElement("script");
    s.src = TABLEAU_SCRIPT;
    s.async = true;
    s.onload = () => resolve(window.tableau);
    s.onerror = () => reject(new Error("Failed to load Tableau JS API"));
    document.head.appendChild(s);
  });
  return tableauScriptPromise;
};

const TableauEmbed = ({ dashboard, idx }) => {
  const containerRef = useRef(null);
  const [state, setState] = useState("thumb"); // thumb | loading | loaded | error

  const launch = async () => {
    setState("loading");
    try {
      const t = await loadTableau();
      if (!containerRef.current) return;
      // Clear any previous viz
      containerRef.current.innerHTML = "";
      // eslint-disable-next-line no-new
      new t.Viz(containerRef.current, dashboard.viz_url, {
        hideTabs: true,
        hideToolbar: true,
        width: "100%",
        height: "100%",
        onFirstInteractive: () => setState("loaded"),
      });
      // safety timeout to mark loaded even if event doesn't fire
      setTimeout(() => setState((s) => (s === "loading" ? "loaded" : s)), 5000);
    } catch (e) {
      console.error(e);
      setState("error");
    }
  };

  return (
    <div
      className="card-3d-raised p-5 md:p-6 reveal"
      style={{ transitionDelay: `${idx * 80}ms` }}
      data-testid={`tableau-${dashboard.id}`}
    >
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <div className="text-\[10px] uppercase tracking-\[0.34em] text-gold">
            OCJC  ·  {dashboard.label}
          </div>
          <h3 className="font-display text-xl md:text-2xl text-ivory mt-1 leading-tight">
            {dashboard.title}
          </h3>
          <p className="mt-1.5 text-ivory-dim text-\[13px] leading-snug max-w-xl">
            {dashboard.description}
          </p>
        </div>
        <a
          href={dashboard.viz_url}
          target="_blank"
          rel="noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.28em] text-secondary hover:text-gold transition-colors"
          data-testid={`tableau-open-${dashboard.id}`}
        >
          Open <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div
        className="relative bg-[#070B14] border border-line rounded-sm overflow-hidden"
        style={{ aspectRatio: "16 / 10" }}
      >
        {state === "thumb" && (
          <button
            type="button"
            onClick={launch}
            className="group absolute inset-0 w-full h-full"
            data-testid={`tableau-launch-${dashboard.id}`}
            aria-label={`Launch ${dashboard.title} viz`}
          >
            <img
              src={dashboard.thumbnail_url}
              alt={`${dashboard.title} preview`}
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-\[#070B14]/85 via-\[#070B14]/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-\[#0A0F1A]/85 backdrop-blur-md border border-\[rgba(200,169,126,0.45)] text-\[11px] uppercase tracking-\[0.32em] text-gold group-hover:bg-\[var(--apt-gold)] group-hover:text-\[#0A0F1A] transition-all duration-300">
                <BarChart3 className="w-3.5 h-3.5" />
                Launch Interactive Viz
              </span>
            </div>
          </button>
        )}

        {state === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ivory-dim">
            <Loader2 className="w-5 h-5 animate-spin text-gold" />
            <span className="text-\[11px] uppercase tracking-\[0.32em]">Loading OCJC viz…</span>
          </div>
        )}

        {state === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="text-\[11px] uppercase tracking-\[0.32em] text-\[#CF6B6B]">Embed blocked</span>
            <p className="text-ivory-dim text-\[13px] max-w-xs">
              The Tableau viz couldn't load in this frame.
              

              Open it on Tableau Public instead.
            </p>
            <a
              href={dashboard.viz_url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10.5px] uppercase tracking-[0.32em] text-[#0A0F1A] bg-[var(--apt-gold)]"
            >
              Open on Tableau
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <div ref={containerRef} className={`absolute inset-0 w-full h-full ${state === "thumb" ? "pointer-events-none" : ""}`} />
      </div>
    </div>
  );
};

export default function BiasBeacon() {
  useReveal();
  const [summary, setSummary] = useState(null);
  const [counties, setCounties] = useState([]);
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    axios.get(`${API}/beacon/stop-summary`).then((r) => setSummary(r.data)).catch(() => {});
    axios.get(`${API}/beacon/stop-counties`).then((r) => setCounties(r.data.counties || [])).catch(() => {});
    axios.get(`${API}/beacon/dashboards`).then((r) => setDashboards(r.data.dashboards || [])).catch(() => {});
  }, []);

  const sw = summary?.statewide;

  return (
    <div className="relative min-h-screen" data-testid="bias-beacon-page">
      <TopNav />

      {/* Header */}
      <header className="relative pt-32 md:pt-40 pb-10 md:pb-12 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-\[0.05] pointer-events-none">
          <Activity className="absolute right-\[6%] top-1/2 -translate-y-1/2 w-\[420px] h-\[420px] text-gold" strokeWidth={0.4} />
        </div>
        <div className="relative max-w-\[1360px] mx-auto">
          <div className="eyebrow mb-5">The Dashboard  ·  The Engine</div>
          <h1 className="font-display text-5xl md:text-7xl text-ivory leading-\[1.02] max-w-4xl">
            The Bias Beacon.

            <span className="italic text-gold">Where the patterns sit.</span>
          </h1>
          <p className="mt-7 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed max-w-3xl">
            Two layers, one record. The top reads Oregon's own STOP feed — who is being
            pulled over, how often, and against what share of the population. The bottom
            mirrors the Oregon Criminal Justice Commission's own Tableau dashboards so
            the official record sits next to ours, on the same page, at the same time.
          </p>
        </div>
      </header>

      {/* Stat strip from STOP */}
      <section className="max-w-\[1360px] mx-auto px-6 md:px-10 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-\[var(--apt-line)]" data-testid="beacon-stat-strip">
          <StatBlock label="2024 Stops" value={sw?.total_stops_2024} suffix="recorded under HB 2355" />
          <StatBlock label="Agencies" value={sw?.reporting_agencies} suffix="reporting" />
          <StatBlock label="Counties" value={sw?.counties_covered} suffix="covered" />
          <StatBlock label="Period" value={sw?.analysis_period?.split("-")?.[1] || sw?.analysis_period} suffix="end of window" />
        </div>
      </section>

      {/* Disparity + County panels */}
      <section className="max-w-\[1360px] mx-auto px-6 md:px-10 mb-16 md:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          <StopDisparityPanel summary={summary} />
          <CountyTotalsPanel counties={counties} />
        </div>
      </section>

      {/* OCJC Tableau dashboards */}
      <section className="max-w-\[1360px] mx-auto px-6 md:px-10 pb-24">
        <div className="reveal mb-10 md:mb-14 flex items-baseline justify-between flex-wrap gap-5">
          <div>
            <div className="eyebrow mb-4">Official Dashboards  ·  OCJC</div>
            <h2 className="font-display text-3xl md:text-5xl text-ivory leading-\[1.05] max-w-2xl">
              The state's own reading,

              <span className="italic text-gold">embedded.</span>
            </h2>
          </div>
          <p className="font-serif-h italic text-ivory-dim max-w-md text-base md:text-lg leading-relaxed">
            From the Oregon Criminal Justice Commission's Justice Reinvestment Initiative
            and the statewide prison population forecast. We don't replicate — we surface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6" data-testid="tableau-grid">
          {dashboards.map((d, i) => (
            <TableauEmbed key={d.id} dashboard={d} idx={i} />
          ))}
        </div>

        <p className="mt-10 text-\[11.5px] text-secondary italic" data-testid="beacon-attribution">
          Source · Oregon Criminal Justice Commission (OCJC), Justice Reinvestment
          Initiative dashboards published on Tableau Public. The embeds above are official
          OCJC visualizations, displayed under public-data fair use.
        </p>
      </section>

      <Footer />
    </div>
  );
}
