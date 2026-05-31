import React from "react"
import { PageShell } from "../components/aptitude/PageShell"
import { Scale, Search, ChevronDown } from "lucide-react"

const JUDGES = [
  { name: "Anna M. Brown", court: "Multnomah County Circuit Court", appointed: 2016, cases: 2847 },
  { name: "David L. Reid", court: "Washington County Circuit Court", appointed: 2012, cases: 3120 },
  { name: "Katherine S. O'Malley", court: "Clackamas County Circuit Court", appointed: 2019, cases: 1985 },
  { name: "Michael T. Chen", court: "Lane County Circuit Court", appointed: 2014, cases: 2653 },
  { name: "Sarah J. Hartwell", court: "Marion County Circuit Court", appointed: 2018, cases: 2231 },
  { name: "Robert P. Delgado", court: "Jackson County Circuit Court", appointed: 2011, cases: 3409 },
  { name: "Jennifer L. Warner", court: "Deschutes County Circuit Court", appointed: 2020, cases: 1567 },
  { name: "Thomas A. Gallagher", court: "Linn County Circuit Court", appointed: 2015, cases: 2798 },
  { name: "Rebecca N. Torres", court: "Douglas County Circuit Court", appointed: 2017, cases: 2104 },
  { name: "Christopher M. Hayes", court: "Benton County Circuit Court", appointed: 2013, cases: 2892 },
]

export default function Judiciary() {
  return (
    <PageShell
      testId="judiciary-page"
      eyebrow="Pillar II · The Bench"
      title="Judiciary."
      italicTitle="Every judge, indexed."
      intro="Every sitting Oregon judge — indexed, scored, and comparable. Case volumes, reversal rates, and demographic context for every circuit."
      dataStatus="Structure live. Judge-level records ingesting from OJD data feeds. Scores, rulings, and demographic context populating."
    >
      {/* Search / Filter */}
      <div className="mb-10">
        <div className="apt-search-soft flex items-center gap-3 max-w-md">
          <Search className="w-4 h-4 text-[#8C93A3]" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search by name, court, or county…"
            className="w-full py-3.5 text-[14px]"
            data-testid="judiciary-search-input"
          />
        </div>
      </div>

      {/* Judge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="judge-grid">
        {JUDGES.map((j, i) => (
          <div key={j.name} className="card-3d-raised p-6 md:p-7 reveal" style={{ transitionDelay: `${i * 60}ms` }} data-testid={`judge-card-${i}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg text-ivory leading-tight">{j.name}</h3>
                <p className="text-[11px] uppercase tracking-[0.28em] text-secondary mt-1.5">{j.court}</p>
              </div>
              <Scale className="w-4 h-4 text-gold flex-shrink-0 mt-1" strokeWidth={1.25} />
            </div>
            <div className="flex items-center gap-4 text-[12px] text-ivory-dim">
              <span>Appointed {j.appointed}</span>
              <span className="w-px h-3 bg-[var(--apt-line)]" />
              <span>{j.cases.toLocaleString()} cases</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
