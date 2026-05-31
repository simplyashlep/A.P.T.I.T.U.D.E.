import React from "react"
import { Link } from "react-router-dom"
import { Gavel, Eye, Shield, Compass, Activity, FlaskConical, MessageSquare, Info } from "lucide-react"

const PAGES = [
  { to: "/judiciary", label: "Judiciary", icon: Gavel, desc: "Every sitting Oregon judge — indexed, scored, comparable." },
  { to: "/watchtower", label: "Watchtower", icon: Eye, desc: "Prosecutorial power, county by county." },
  { to: "/law-enforcement", label: "Law Enforcement", icon: Shield, desc: "Agencies, officers, and STOP data." },
  { to: "/community-corrections", label: "Community Corrections", icon: Compass, desc: "Parole & probation officers statewide." },
  { to: "/bias-beacon", label: "Bias Beacon", icon: Activity, desc: "Disparity dashboards and live data." },
  { to: "/juris-lab", label: "Juris Lab", icon: FlaskConical, desc: "Document analysis and drafting tools." },
  { to: "/community", label: "Community", icon: MessageSquare, desc: "Public comment, meetings, and pathways." },
  { to: "/about", label: "About", icon: Info, desc: "Methodology, tenets, and the team." },
]

export function PagesGrid() {
  return (
    <section className="max-w-[1360px] mx-auto px-6 md:px-10 py-20 md:py-28" data-testid="pages-grid">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {PAGES.map((page) => {
          const Icon = page.icon
          return (
            <Link
              key={page.to}
              to={page.to}
              className="card-3d-raised p-6 group"
              data-testid={`grid-card-${page.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-4 h-4 text-steel group-hover:text-gold transition-colors duration-300" strokeWidth={1.25} />
                <span className="text-[10px] uppercase tracking-[0.34em] text-gold">
                  {page.label === "Bias Beacon" ? "Dashboard" : page.label === "Juris Lab" ? "Tools" : "Pillar"}
                </span>
              </div>
              <h3 className="font-display text-2xl text-ivory mb-2 leading-tight group-hover:text-gold-soft transition-colors duration-300">
                {page.label}.
              </h3>
              <p className="text-ivory-dim text-[13px] leading-relaxed">{page.desc}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
