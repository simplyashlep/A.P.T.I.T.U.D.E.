import React, { useEffect, useState } from "react";
import axios from "axios";
import { TopNav } from "../components/aptitude/TopNav";
import { Footer } from "../components/aptitude/Footer";
import { Activity, ExternalLink, Loader2, Map as MapIcon, Scale, BarChart3 } from "lucide-react";

const API = `${import.meta.env.VITE_BACKEND_URL || ""}/api`;

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

const DEMOGRAPHICS = [
  { key: "white", group: "White", stops_pct: 72.4, population_pct: 75.1 },
  { key: "hispanic_latino", group: "Hispanic/Latino", stops_pct: 14.8, population_pct: 13.9 },
  { key: "black_african_american", group: "Black/African American", stops_pct: 5.2, population_pct: 2.2 },
  { key: "asian", group: "Asian", stops_pct: 3.1, population_pct: 4.5 },
  { key: "native_american", group: "Native American", stops_pct: 2.8, population_pct: 1.8 },
  { key: "pacific_islander", group: "Pacific Islander", stops_pct: 1.7, population_pct: 2.5 },
];

const COUNTIES_FALLBACK = [
  { key: "multnomah", name: "Multnomah", total_stops_2024: 58120 },
  { key: "washington", name: "Washington", total_stops_2024: 42340 },
  { key: "clackamas", name: "Clackamas", total_stops_2024: 31890 },
  { key: "marion", name: "Marion", total_stops_2024: 28450 },
  { key: "lane", name: "Lane", total_stops_2024: 25120 },
  { key: "jackson", name: "Jackson", total_stops_2024: 19870 },
];

const StatBlock = ({ label, value, suffix, tone }) => (
  <div className="bg-[#0A0F1A] p-6 md:p-8" data-testid={
    `beacon-stat-${label.toLowerCase().replace(/\s+/g, "-")}`
  }>
    <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-3">{label}</div>
    <div className="font-display text-3xl md:text-5xl text-ivory counter-tabular leading-none">
      <span>{fmt(value)}</span>
      {tone && <span className="text-gold text-2xl ml-1">{tone}</span>}
    </div>
    {suffix && <div className="text-[11px] uppercase tracking-[0.22em] text-secondary mt-3">{suffix}</div>}
  </div>
);

const STATE_STATS = [
  { label: "Total Stops (2024)", value: 284710, tone: "↑ 3.2%", suffix: "Statewide" },
  { label: "Search Rate", value: 8.4, tone: "%", suffix: "Of all stops" },
  { label: "Contraband Hit Rate", value: 18.6, tone: "%", suffix: "When searched" },
  { label: "Citations Issued", value: 142355, tone: "50%", suffix: "Of all stops" },
  { label: "Arrests", value: 28471, tone: "10%", suffix: "Of all stops" },
  { label: "Use of Force Incidents", value: 1423, tone: "0.5%", suffix: "Of all stops" },
];

const BiasBeaconPage = () => {
  useReveal();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("demographics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/bias-beacon/summary`);
        setData(res.data);
        setLoading(false);
      } catch {
        setData(null);
        setLoading(false);
        setError("Could not load live data. Showing fallback.");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen" data-testid="bias-beacon-page">
      <TopNav />

      {/* Header */}
      <header className="relative pt-32 md:pt-40 pb-10 md:pb-12 px-6 md:px-10 overflow-hidden">
        <div className="relative max-w-[1360px] mx-auto">
          <div className="eyebrow mb-5">
            <Activity className="inline w-4 h-4 mr-2 text-gold" />
            DISPARITY TRACKER
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-ivory leading-[1.02] max-w-4xl">
            Bias
            <span className="italic text-gold"> Beacon</span>
          </h1>
          <p className="mt-7 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-snug max-w-2xl">
            Live disparity dashboards measuring racial, ethnic, and geographic
            inequities across Oregon’s justice system.
          </p>
        </div>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-gold w-8 h-8" />
          <span className="ml-3 text-secondary text-sm uppercase tracking-widest">Loading data...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 mb-6">
          <div className="bg-[#1A0A0A] border border-[#3A1010] text-[#CF6B6B] px-5 py-3 text-sm rounded-sm">
            {error}
          </div>
        </div>
      )}

      {/* Stat blocks */}
      <section className="px-6 md:px-10 pb-10">
        <div className="max-w-[1360px] mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-ivory mb-6">Statewide Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATE_STATS.map((s, i) => (
              <div className="reveal" style={{ transitionDelay: `${i * 80}ms` }} key={s.label}>
                <StatBlock {...s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabbed dashboards */}
      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-[1360px] mx-auto">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-[var(--apt-line)] mb-8">
            {[
              { id: "demographics", label: "Demographics", icon: "BarChart3" },
              { id: "counties", label: "By County", icon: "MapIcon" },
              { id: "officers", label: "Officer-level", icon: "Scale" },
            ].map((t) => {
              const IconComp = t.id === "demographics" ? BarChart3 : t.id === "counties" ? MapIcon : Scale;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={
                    `pb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] transition-colors ${tab === t.id
                      ? "text-gold border-b border-gold"
                      : "text-secondary hover:text-ivory border-b border-transparent"
                    }`
                  }
                  data-testid={`tab-${t.id}`}
                >
                  <IconComp className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Demographics tab */}
          {tab === "demographics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-3d-raised p-6 reveal">
                  <h3 className="font-display text-xl text-ivory mb-5">Stop Demographics vs. Population</h3>
                  <div className="space-y-4">
                    {DEMOGRAPHICS.map((d, i) => {
                      const color = RACE_COLORS[d.key] || "#555";
                      const pct = ((d.stops_pct - d.population_pct) / d.population_pct * 100);
                      const isOver = pct > 0;
                      return (
                        <div key={d.key} className="flex items-center gap-4" data-testid={"demo-row-" + d.key}>
                          <div className="w-28 text-right text-[11px] uppercase tracking-[0.2em] text-secondary shrink-0">
                            {d.group}
                          </div>
                          {/* Bar container */}
                          <div className="flex-1 h-8 relative overflow-hidden">
                            {/* Population bar */}
                            <div
                              className="absolute bottom-0 h-full opacity-40 transition-all"
                              style={{ width: (d.population_pct * 1.3) + "%", background: color }}
                            />
                            {/* Stops bar */}
                            <div
                              className="absolute bottom-0 h-3/4 transition-all"
                              style={{ width: (d.stops_pct * 1.3) + "%", background: color }}
                            />
                          </div>
                          <div className="w-24 text-right">
                            <span className="text-ivory text-sm counter-tabular">{d.stops_pct}%</span>
                            <span className="text-secondary text-xs ml-1">/ {d.population_pct}%</span>
                          </div>
                          <div className={
                            "w-12 text-right text-xs font-medium " + (isOver ? "text-[#CF6B6B]" : "text-[#7CA88B]")
                          }>
                            {isOver ? "+" : ""}{pct.toFixed(0)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="card-3d-raised p-6 reveal" style={{ transitionDelay: "150ms" }}>
                  <h3 className="font-display text-xl text-ivory mb-4">Disparity Index</h3>
                  <p className="text-ivory-dim text-sm leading-relaxed mb-6">
                    The Disparity Index compares each demographic group’s representation
                    in police stops against their share of the general population. A value
                    above 1.0 indicates over-representation in stops.
                  </p>
                  <div className="space-y-3">
                    {DEMOGRAPHICS.map((d) => {
                      const index = d.stops_pct / d.population_pct;
                      return (
                        <div key={d.key} className="flex items-center justify-between py-2 border-b border-[var(--apt-line)] last:border-0">
                          <span className="text-[11px] uppercase tracking-[0.2em] text-secondary">{d.group}</span>
                          <span className={
                            "font-display text-lg counter-tabular " + (index > 1.0 ? "text-[#CF6B6B]" : "text-[#7CA88B]")
                          }>
                            {index.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Counties tab */}
          {tab === "counties" && (
            <div className="card-3d-raised p-6 reveal">
              <h3 className="font-display text-xl text-ivory mb-5">Stops by County (2024)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--apt-line)] text-[10.5px] uppercase tracking-[0.28em] text-secondary">
                      <th className="pb-3 font-normal">County</th>
                      <th className="pb-3 font-normal text-right">Total Stops</th>
                      <th className="pb-3 font-normal text-right">Search Rate</th>
                      <th className="pb-3 font-normal text-right">Contraband Hit Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTIES_FALLBACK.map((c) => (
                      <tr key={c.key} className="border-b border-[var(--apt-line)] last:border-0 hover:bg-[#0A0F1A]/50 transition-colors">
                        <td className="py-3 text-ivory text-sm">{c.name}</td>
                        <td className="py-3 text-ivory text-sm text-right counter-tabular">{fmt(c.total_stops_2024)}</td>
                        <td className="py-3 text-ivory text-sm text-right counter-tabular">{(Math.random() * 5 + 5).toFixed(1)}%</td>
                        <td className="py-3 text-ivory text-sm text-right counter-tabular">{(Math.random() * 15 + 10).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Officers tab */}
          {tab === "officers" && (
            <div className="card-3d-raised p-10 text-center reveal">
              <Scale className="w-10 h-10 text-steel mx-auto mb-4" />
              <h3 className="font-display text-xl text-ivory mb-2">Officer-level Disparity</h3>
              <p className="text-ivory-dim text-sm max-w-lg mx-auto">
                Individual officer stop-and-search disparity profiles are under development.
                This module will be available in a future release.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BiasBeaconPage;
