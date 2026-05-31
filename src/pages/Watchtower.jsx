import React from "react"
import { PageShell } from "../components/aptitude/PageShell"
import { Eye, Search, Users, FileText, BarChart3, Scale, Building2 } from "lucide-react"

const TIERS = [
  { icon: Users, label: "Office Identity", items: ["District Attorney name", "Office size (deputies)", "Counties served", "Annual budget"] },
  { icon: FileText, label: "Charging Record", items: ["Cases filed (annual)", " felony vs. misdemeanor ratio", "Declination rate", "Plea offer patterns"] },
  { icon: BarChart3, label: "Disparity Indicators", items: ["Charging disparity by race", "Sentence recommendation variance", "Pre-trial detention rate", "Diversion program access"] },
]

const OFFICES = [
  { name: "Multnomah County DA", district: "4th Judicial District", da: "Mike Schmidt", deputies: 135 },
  { name: "Washington County DA", district: "20th Judicial District", da: "Kevin Barton", deputies: 78 },
  { name: "Clackamas County DA", district: "3rd Judicial District", da: "John Wentworth", deputies: 65 },
  { name: "Marion County DA", district: "1st Judicial District", da: "Paige Clarkson", deputies: 52 },
  { name: "Lane County DA", district: "2nd Judicial District", da: "Patricia Perlow", deputies: 48 },
  { name: "Jackson County DA", district: "15th Judicial District", da: "Beth Heckert", deputies: 42 },
  { name: "Deschutes County DA", district: "11th Judicial District", da: "Steve Gunnels", deputies: 28 },
  { name: "Linn County DA", district: "14th Judicial District", da: "Douglas Marteeny", deputies: 18 },
  { name: "Douglas County DA", district: "9th Judicial District", da: "Rick Wesenberg", deputies: 16 },
  { name: "Benton County DA", district: "10th Judicial District", da: "Amber Adams", deputies: 14 },
  { name: "Yamhill County DA", district: "21st Judicial District", da: "Brad Berry", deputies: 12 },
  { name: "Polk County DA", district: "12th Judicial District", da: "Aaron Felton", deputies: 10 },
]

export default function Watchtower() {
  return (
    <PageShell
      testId="watchtower-page"
      eyebrow="Pillar V · The Prosecution"
      title="Watchtower."
      italicTitle="Prosecutorial power, measured."
      intro="Track prosecutorial decision-making across Oregon's 36 counties — charging patterns, declination rates, plea offer tendencies, and disparity indicators for every District Attorney's office in the state."
      dataStatus="Office registry live. Charging data and three-tier profiles populating from OJD case management feeds."
    >
      {/* Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12" data-testid="wt-tiers">
        {TIERS.map((tier, i) => {
          const Icon = tier.icon
          return (
            <div key={tier.label} className="card-3d-raised p-7 reveal" style={{ transitionDelay: `${i * 80}ms` }} data-testid={`wt-tier-${tier.label.toLowerCase().replace(/\s+/g, '-')}`}>
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
          <input type="text" placeholder="Search offices by name, DA, or district…" className="w-full py-3.5 text-[14px]" data-testid="wt-search-input" />
        </div>
      </div>

      {/* Office grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="wt-offices">
        {OFFICES.map((o, i) => (
          <div key={o.name} className="card-3d-raised p-6 reveal" style={{ transitionDelay: `${i * 50}ms` }} data-testid={`office-${o.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-base text-ivory">{o.name}</h3>
                <p className="text-[10.5px] uppercase tracking-[0.24em] text-secondary mt-1">{o.district}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3 h-3 text-gold" strokeWidth={1.5} />
                    <span className="text-[12px] text-ivory-dim">DA {o.da}</span>
                  </div>
                  <span className="w-px h-3 bg-[var(--apt-line)]" />
                  <span className="text-[11px] text-ivory-dim">{o.deputies} deputies</span>
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
