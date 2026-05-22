import React from "react";
import { PageShell } from "../components/aptitude/PageShell";
import { Shield, Activity } from "lucide-react";

const AGENCIES = [
  { name: "Oregon State Police", kind: "Statewide" },
  { name: "Portland Police Bureau", kind: "Municipal" },
  { name: "Multnomah County Sheriff", kind: "County" },
  { name: "Washington County Sheriff", kind: "County" },
  { name: "Eugene Police Department", kind: "Municipal" },
  { name: "Salem Police Department", kind: "Municipal" },
  { name: "Beaverton Police Department", kind: "Municipal" },
  { name: "Hillsboro Police Department", kind: "Municipal" },
  { name: "Lane County Sheriff", kind: "County" },
];

export default function LawEnforcement() {
  return (
    <PageShell
      testId="law-enforcement-page"
      eyebrow="Pillar III · Sworn Officers"
      title="Law Enforcement."
      italicTitle="By agency. By officer."
      intro="The first stop in the system is the most patterned. Law Enforcement opens every Oregon agency, then drills into individual officers — sworn date, certifications, stop outcomes, use-of-force events, and the disparities Oregon STOP data has been quietly recording since HB 2355."
      dataStatus={{
        title: "Awaiting DPSST roster and Oregon STOP data feed",
        description:
          "Each agency will expand into individual officer cards with three-tier detail. Aggregate STOP data is being ingested in parallel for the Bias Beacon dashboard.",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--apt-line)] mb-14" data-testid="le-tiers">
        {[
          { l: "Tier I", h: "Identity & certification", b: "Agency, rank, sworn date, public certifications." },
          { l: "Tier II", h: "Field record", b: "Stop outcomes, use-of-force events, sustained complaints." },
          { l: "Tier III", h: "STOP-data demographic view", b: "Stop, search, and outcome rates broken out by demographic and agency peer set." },
        ].map((t, i) => (
          <div key={i} className="bg-[#0A0F1A] p-6">
            <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-3">{t.l}</div>
            <div className="font-display text-xl text-ivory mb-2">{t.h}</div>
            <div className="text-ivory-dim text-[13.5px] leading-relaxed">{t.b}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 text-[11px] uppercase tracking-[0.36em] text-gold">Agencies Indexed</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="le-agencies">
        {AGENCIES.map((a, i) => (
          <div key={a.name} className="card-3d-raised p-5 flex items-center justify-between" data-testid={`agency-card-${i}`}>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-steel" strokeWidth={1.25} />
              <div>
                <div className="font-display text-lg text-ivory">{a.name}</div>
                <div className="text-[10.5px] uppercase tracking-[0.32em] text-secondary mt-1">{a.kind}</div>
              </div>
            </div>
            <Activity className="w-4 h-4 text-gold opacity-60" strokeWidth={1.25} />
          </div>
        ))}
        <div className="card-3d-raised p-5 flex items-center justify-center text-[11px] uppercase tracking-[0.32em] text-secondary">
          + 200+ Oregon agencies · awaiting DPSST sync
        </div>
      </div>
    </PageShell>
  );
}
