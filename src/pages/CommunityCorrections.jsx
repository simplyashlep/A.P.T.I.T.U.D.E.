import React from "react"
import { PageShell } from "../components/aptitude/PageShell"
import { Compass, Search, Users, FileText, BarChart3 } from "lucide-react"

const TIERS = [
  { icon: Users, label: "Caseload Identity", items: ["Officer name & rank", "Agency & county", "Certification status", "Years of service"] },
  { icon: FileText, label: "Supervision Record", items: ["Active supervisee count", "Revocation rate (12mo)", "Sanction type breakdown", "Case outcome ratios"] },
  { icon: BarChart3, label: "Outcome Disparity", items: ["Revocation by race", "Sanction severity index", "Supervision duration avg", "Re-incarceration rate"] },
]

const COUNTIES = [
  "Multnomah", "Washington", "Clackamas", "Marion", "Lane", "Jackson",
  "Deschutes", "Linn", "Douglas", "Benton", "Yamhill", "Polk",
  "Josephine", "Umatilla", "Klamath", "Columbia", "Coos", "Lincoln",
]

export default function CommunityCorrections() {
  return (
    <PageShell
      testId="community-corrections-page"
      eyebrow="Pillar IV *�*� Supervision"
      title="Community Corrections."
      italicTitle="Every PO. Every county."
      intro="Parole and probation officers are the backbone of Oregon's supervised population. We index every officer, their supervision record, and outcome data *�*�*� providing transparency into the largest slice of the justice system."
      dataStatus="County rosters being ingested. Three-tier detail populating as data is verified against Oregon Department of Corrections and county community justice sources."
    >
      {/** Tiers **/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12" data-testid="corrections-tiers">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon
          return (
            <div key={tier.label} className="card-3d-raised p-7 reveal" style={{ transitionDelay: `${i ** 80}ms` }} data-testid={`tier-${tier.label.toLowerCase().replace(/s+/g, '-')}`}>
              <Icon className="w-5 h-5 text-gold mb-5" strokeWidth={1.25} />
              <h3 className="font-display text-xl text-ivory mb-5">{tier.label}</h3>
              <ul className="space-y-2.5">
                {tier.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[13px] text-ivory-dim">
                    <span className="w-1 h-1 rounded-full bg-gold/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/** County Departments **/}
      <div className="mb-6">
        <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-5">County Departments</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" data-testid="corrections-counties">
          {COUNTIES.map((c) => (
            <div key={c} className="card-3d-raised p-4 text-center" data-testid={`county-${c.toLowerCase()}`}>
              <span className="font-display text-sm text-ivory">{c} County</span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
