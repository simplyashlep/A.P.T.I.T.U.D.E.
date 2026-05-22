import React, { useEffect, useState } from "react";
import axios from "axios";
import { PageShell } from "../components/aptitude/PageShell";
import { Gavel, Search, Filter, GitCompare } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ROLE = "judge";

const TIER_LABELS = ["Tier I · Identity", "Tier II · Patterns", "Tier III · Deep Record"];

const ActorCardSkeleton = ({ idx }) => (
  <div
    className="card-3d-raised h-[300px] p-7 flex flex-col justify-between relative overflow-hidden"
    data-testid={`judge-skeleton-${idx}`}
  >
    <div className="flex items-center justify-between">
      <span className="text-[10.5px] uppercase tracking-[0.36em] text-gold">Sealed</span>
      <Gavel className="w-4 h-4 text-steel" strokeWidth={1.25} />
    </div>
    <div>
      <div className="h-px w-12 bg-[var(--apt-gold)] opacity-30 mb-4" />
      <div className="font-display text-2xl text-ivory/40">— — — — — —</div>
      <div className="mt-2 font-serif-h italic text-ivory-dim/40 text-sm">awaiting dataset</div>
    </div>
    <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.32em] text-secondary/60">
      <span>Bias Score</span>
      <span className="font-display text-xl text-ivory/30">— —</span>
    </div>
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-br from-transparent via-[rgba(200,169,126,0.04)] to-transparent pointer-events-none"
    />
  </div>
);

export default function Judiciary() {
  const [data, setData] = useState({ data_status: "loading", count: 0, actors: [] });

  useEffect(() => {
    axios
      .get(`${API}/actors`, { params: { role: ROLE } })
      .then((r) => setData(r.data))
      .catch(() => setData({ data_status: "error", count: 0, actors: [] }));
  }, []);

  const pending = data.data_status === "pending_dataset" || data.data_status === "loading";

  return (
    <PageShell
      testId="judiciary-page"
      eyebrow="Pillar I · The Bench"
      title="The Judiciary."
      italicTitle="Every sitting judge."
      intro="Two hundred and eleven trial-court judges decide the disposition of every Oregon case that doesn't settle. The Judiciary brings each one into the same room — name, county, term — then peels back two further layers of how each one actually rules."
      dataStatus={
        pending
          ? {
              title: "Awaiting Oregon Judicial Department dataset",
              description:
                "Once you provide the judicial roster (CSV/JSON), 211 judge cards will populate across 36 counties with 3-tier flip-card detail and 3-actor compare.",
            }
          : null
      }
    >
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10" data-testid="judiciary-toolbar">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold opacity-70" />
          <input
            type="text"
            placeholder="Search by name, county, or court…"
            disabled
            className="w-full apt-search-soft pl-11 pr-5 py-3 text-[15px] disabled:opacity-50"
            data-testid="judiciary-search"
          />
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-5 py-3 border border-line-strong rounded-sm text-[11px] uppercase tracking-[0.32em] text-ivory-dim disabled:opacity-50"
          data-testid="judiciary-filter"
        >
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-5 py-3 border border-line-strong rounded-sm text-[11px] uppercase tracking-[0.32em] text-gold disabled:opacity-50"
          data-testid="judiciary-compare"
        >
          <GitCompare className="w-3.5 h-3.5" />
          Compare (0 / 3)
        </button>
      </div>

      {/* Tier framework explainer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--apt-line)] mb-14" data-testid="judiciary-tiers-frame">
        {TIER_LABELS.map((t, i) => (
          <div key={i} className="bg-[#0A0F1A] p-6">
            <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-3">{t.split("·")[0]}</div>
            <div className="font-display text-xl text-ivory mb-2">{t.split("·")[1].trim()}</div>
            <div className="text-ivory-dim text-[13.5px] leading-relaxed">
              {i === 0 && "Name, county, term, bias score. The cover of the file."}
              {i === 1 && "Prison usage, appellate overturns, case types, probation, sentencing trends."}
              {i === 2 && "3D visualizations, peer comparison, concerns or accolades."}
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" data-testid="judiciary-grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <ActorCardSkeleton key={i} idx={i} />
        ))}
      </div>
    </PageShell>
  );
}
