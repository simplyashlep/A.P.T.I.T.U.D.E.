import React from "react";
import { PageShell } from "../components/aptitude/PageShell";
import { Compass } from "lucide-react";

const COUNTIES = [
  "Multnomah", "Washington", "Clackamas", "Marion", "Lane", "Deschutes",
  "Jackson", "Linn", "Douglas", "Yamhill", "Benton", "Polk",
];

export default function CommunityCorrections() {
  return (
    <PageShell
      testId="community-corrections-page"
      eyebrow="Pillar IV · Supervision"
      title="Community Corrections."
      italicTitle="Every PO. Every county."
      intro="More Oregonians are under supervision than inside a prison. Community Corrections opens every parole and probation officer in the state — county-by-county — with revocation rates, sanction patterns, and the completion outcomes their caseloads actually produce."
      dataStatus={{
        title: "Awaiting county Community Corrections roster",
        description:
          "Each Oregon county runs its own Community Corrections department. Once rosters are loaded, individual PO records will populate with three-tier detail.",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--apt-line)] mb-14" data-testid="cc-tiers">
        {[
          { l: "Tier I", h: "Caseload identity", b: "County, caseload size, supervision specialty." },
          { l: "Tier II", h: "Supervision record", b: "Revocation rates, sanction patterns, completion rates." },
          { l: "Tier III", h: "Outcome disparity", b: "Outcomes by demographic vs. county and statewide peer set." },
        ].map((t, i) => (
          <div key={i} className="bg-[#0A0F1A] p-6">
            <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-3">{t.l}</div>
            <div className="font-display text-xl text-ivory mb-2">{t.h}</div>
            <div className="text-ivory-dim text-[13.5px] leading-relaxed">{t.b}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 text-[11px] uppercase tracking-[0.36em] text-gold">County Departments</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" data-testid="cc-counties">
        {COUNTIES.map((c, i) => (
          <div key={c} className="card-3d-raised p-4 flex items-center gap-3" data-testid={`county-card-${i}`}>
            <Compass className="w-4 h-4 text-steel" strokeWidth={1.25} />
            <div>
              <div className="font-display text-base text-ivory">{c}</div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-secondary mt-0.5">County</div>
            </div>
          </div>
        ))}
        <div className="card-3d-raised p-4 flex items-center justify-center text-[10px] uppercase tracking-[0.32em] text-secondary">
          +24 more counties
        </div>
      </div>
    </PageShell>
  );
}
