import React from "react";
import { PageShell } from "../components/aptitude/PageShell";
import { Eye, Building2 } from "lucide-react";

const OFFICES = [
  "Multnomah County",
  "Washington County",
  "Clackamas County",
  "Marion County",
  "Lane County",
  "Deschutes County",
  "Jackson County",
  "Linn County",
  "Douglas County",
];

export default function Watchtower() {
  return (
    <PageShell
      testId="watchtower-page"
      eyebrow="Pillar II · Prosecutors"
      title="The Watchtower."
      italicTitle="Who decides who is charged."
      intro="Twenty-seven elected District Attorneys and their deputies hold the prosecutorial gate. The Watchtower opens each office, then each individual DA and DDA, with charging tendencies, plea ratios, and dismissal patterns laid against county and state baselines."
      dataStatus={{
        title: "Awaiting prosecutor roster from the Oregon DAA",
        description:
          "Once data is loaded, each county office expands into individual DA/DDA records with three-tier flip cards and 3-actor compare.",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--apt-line)] mb-14" data-testid="watchtower-tiers">
        {[
          { l: "Tier I", h: "Office, position, caseload", b: "Name, county office, position, public caseload count." },
          { l: "Tier II", h: "Charging tendencies", b: "Plea ratios, dismissal patterns, enhancement frequency, trial rate." },
          { l: "Tier III", h: "Disparity indicators", b: "Demographic outcomes vs. peer DDAs and statewide baselines." },
        ].map((t, i) => (
          <div key={i} className="bg-[#0A0F1A] p-6">
            <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-3">{t.l}</div>
            <div className="font-display text-xl text-ivory mb-2">{t.h}</div>
            <div className="text-ivory-dim text-[13.5px] leading-relaxed">{t.b}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 text-[11px] uppercase tracking-[0.36em] text-gold">Offices Indexed</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="watchtower-offices">
        {OFFICES.map((o, i) => (
          <div
            key={o}
            className="card-3d-raised p-5 flex items-center justify-between"
            data-testid={`office-card-${i}`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-steel" strokeWidth={1.25} />
              <div>
                <div className="font-display text-lg text-ivory">{o}</div>
                <div className="text-[10.5px] uppercase tracking-[0.32em] text-secondary mt-1">District Attorney's Office</div>
              </div>
            </div>
            <Eye className="w-4 h-4 text-gold opacity-60" strokeWidth={1.25} />
          </div>
        ))}
        <div className="card-3d-raised p-5 flex items-center justify-center text-[11px] uppercase tracking-[0.32em] text-secondary">
          + 27 total offices · awaiting roster
        </div>
      </div>
    </PageShell>
  );
}
