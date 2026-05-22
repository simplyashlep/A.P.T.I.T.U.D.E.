import React from "react";
import { PageShell } from "../components/aptitude/PageShell";
import { Activity, Map, Coins, BarChart3 } from "lucide-react";

const PANELS = [
  {
    icon: Map,
    label: "Disparity Heat Map",
    body: "County-by-county hot spots — stop rates, search rates, and case outcomes against Oregon's own demographic baseline.",
    chart: "heatmap",
  },
  {
    icon: BarChart3,
    label: "Demographic Outcomes",
    body: "Conviction and sentencing rates by demographic — Oregon vs. national averages, with confidence intervals.",
    chart: "bars",
  },
  {
    icon: Coins,
    label: "Follow the Money",
    body: "The justice budget visualized: corrections, courts, indigent defense, victims' services — where Oregon's dollars actually flow.",
    chart: "flow",
  },
  {
    icon: Activity,
    label: "Statewide Pulse",
    body: "Live indicators: filings, dispositions, revocations, appeals — updated as data refreshes.",
    chart: "pulse",
  },
];

const FakeChart = ({ kind }) => (
  <div className="relative h-32 mt-5 overflow-hidden">
    {kind === "bars" && (
      <div className="absolute inset-0 flex items-end gap-2 px-1">
        {[40, 65, 35, 80, 55, 70, 45, 60, 50, 75].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-[rgba(200,169,126,0.55)] to-[rgba(200,169,126,0.1)] rounded-t"
            style={{ height: `${h}%`, animation: `barGrow 1.2s ${i * 80}ms both` }}
          />
        ))}
      </div>
    )}
    {kind === "pulse" && (
      <svg viewBox="0 0 300 100" className="w-full h-full">
        <path
          d="M0 60 Q 30 30 60 50 T 120 45 T 180 55 T 240 35 T 300 50"
          fill="none"
          stroke="url(#pulseGrad)"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="pulseGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#5B7B9A" />
            <stop offset="100%" stopColor="#C8A97E" />
          </linearGradient>
        </defs>
      </svg>
    )}
    {kind === "heatmap" && (
      <div className="grid grid-cols-12 gap-px h-full">
        {Array.from({ length: 60 }).map((_, i) => {
          const v = (Math.sin(i * 0.7) + Math.cos(i * 0.4) + 2) / 4;
          return (
            <div
              key={i}
              className="rounded-[1px]"
              style={{ background: `rgba(200,169,126,${0.08 + v * 0.55})` }}
            />
          );
        })}
      </div>
    )}
    {kind === "flow" && (
      <svg viewBox="0 0 300 100" className="w-full h-full">
        {[
          { y1: 20, c: "#C8A97E" },
          { y1: 40, c: "#D9BE93" },
          { y1: 60, c: "#5B7B9A" },
          { y1: 80, c: "#A8895F" },
        ].map((p, i) => (
          <path
            key={i}
            d={`M0 ${p.y1} C 100 ${p.y1 - 5} 200 ${p.y1 + 10} 300 ${p.y1 - 8}`}
            fill="none"
            stroke={p.c}
            strokeWidth="1.5"
            opacity="0.7"
          />
        ))}
      </svg>
    )}
  </div>
);

export default function BiasBeacon() {
  return (
    <PageShell
      testId="bias-beacon-page"
      eyebrow="The Dashboard"
      title="The Bias Beacon."
      italicTitle="The engine of the record."
      intro="The Bias Beacon is the dashboard that powers everything else. STOP data, conviction rates by demographic, sentencing disparity heat maps, appellate reversal patterns — all benchmarked against Oregon's own counties and the national baseline. Then the budget: the money center of justice and where the money goes."
      dataStatus={{
        title: "Visualization shell live · data ingestion in progress",
        description:
          "Charts and heat maps below are illustrative previews. They will animate against live Oregon STOP, OJD, OCJC, and budget feeds once the data pipelines are connected.",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6" data-testid="beacon-grid">
        {PANELS.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="card-3d-raised p-7 md:p-8" data-testid={`beacon-panel-${i}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10.5px] uppercase tracking-[0.36em] text-gold">{p.label}</span>
                <Icon className="w-4 h-4 text-steel" strokeWidth={1.25} />
              </div>
              <p className="text-ivory-dim text-[14px] leading-relaxed">{p.body}</p>
              <FakeChart kind={p.chart} />
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
