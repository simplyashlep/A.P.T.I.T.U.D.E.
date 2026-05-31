import React from "react"
import { PageShell } from "../components/aptitude/PageShell"
import { Shield, Search, Users, FileText, BarChart3, Building2 } from "lucide-react"

const TIERS = [
  { icon: Users, label: "Officer Identity", items: ["Full name & badge number", "Agency & division", "Years of service", "Certification status"] },
  { icon: FileText, label: "Field Record", items: ["Stops (traffic & pedestrian)", "Searches (consent vs. probable cause)", "Citations issued", "Use-of-force incidents"] },
  { icon: BarChart3, label: "Disparity Profile", items: ["Stop demographic breakdown", "Search rate by race", "Citation-to-warning ratio", "Contraband hit rate"] },
]

const AGENCIES = [
  { name: "Oregon State Police", type: "State Agency", officers: 650, counties: 36 },
  { name: "Portland Police Bureau", type: "Municipal", officers: 794, counties: 1 },
  { name: "Multnomah County Sheriff", type: "County Sheriff", officers: 420, counties: 1 },
  { name: "Washington County Sheriff", type: "County Sheriff", officers: 310, counties: 1 },
  { name: "Clackamas County Sheriff", type: "County Sheriff", officers: 280, counties: 1 },
  { name: "Salem Police Department", type: "Municipal", officers: 230, counties: 1 },
  { name: "Eugene Police Department", type: "Municipal", officers: 210, counties: 1 },
  { name: "Marion County Sheriff", type: "County Sheriff", officers: 195, counties: 1 },
  { name: "Lane County Sheriff", type: "County Sheriff", officers: 170, counties: 1 },
  { name: "Gresham Police Department", type: "Municipal", officers: 155, counties: 1 },
  { name: "Jackson County Sheriff", type: "County Sheriff", officers: 145, counties: 1 },
  { name: "Hillsboro Police Department", type: "Municipal", officers: 140, counties: 1 },
]

export default function LawEnforcement() {
  return (
    <PageShell
      testId="law-enforcement-page"
      eyebrow="Pillar III · The Force"
      title="Law Enforcement."
      italicTitle="Agencies, officers, action."
      intro="Every Oregon law enforcement agency and officer indexed — stop data, search rates, citation patterns, and use-of-force records unified from the Oregon STOP Database and agency-level reporting."
      dataStatus="Agency registry live. Officer-level detail and three-tier profiles populating from STOP data feeds and certification records."
    >
      {/* Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12" data-testid="le-tiers">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon
          return (
            <div key={tier.label} className="card-3d-raised p-7 reveal" style={{ transitionDelay: `${i * 80}ms` }} data-testid={`le-tier-${tier.label.toLowerCase().replace(/\s+/g, '-')}`}>
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

      {/* Search */}
      <div className="mb-8">
        <div className="apt-search-soft flex items-center gap-3 max-w-md">
          <Search className="w-4 h-4 text-[#8C93A3]" strokeWidth={1.5} />
          <input type="text" placeholder="Search agencies by name, type, or county…" className="w-full py-3.5 text-[14px]" data-testid="le-search-input" />
        </div>
      </div>

      {/* Agency grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="le-agencies">
        {AGENCIES.map((a, i) => (
          <div key={a.name} className="card-3d-raised p-6 reveal" style={{ transitionDelay: `${i * 50}ms` }} data-testid={`agency-${a.name.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-base text-ivory">{a.name}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-secondary">{a.type}</span>
                  <span className="w-px h-3 bg-[var(--apt-line)]" />
                  <span className="text-[11px] text-ivory-dim">{a.officers} officers</span>
                  <span className="w-px h-3 bg-[var(--apt-line)]" />
                  <span className="text-[11px] text-ivory-dim">{a.counties} county{a.counties > 1 ? "ies" : "y"}</span>
                </div>
              </div>
              <Building2 className="w-4 h-4 text-steel flex-shrink-0 mt-1" strokeWidth={1.25} />
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
