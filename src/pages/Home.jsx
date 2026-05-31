import React from "react"
import { Hero } from "../components/aptitude/Hero"
import { PagesGrid } from "../components/aptitude/PagesGrid"
import { Footer } from "../components/aptitude/Footer"
import { TopNav } from "../components/aptitude/TopNav"

const PRINCIPLES = [
  {
    n: "I",
    h: "Why Oregon",
    b: "Oregon was an early adopter of mandated stop-data disclosure (HB 2355) and runs one of the most county-fragmented justice systems in the United States. If a public record dataset can be built anywhere, it can be built here.",
  },
  {
    n: "II",
    h: "Methodology",
    b: "Every bias score, every disparity figure, every ranking is documented end-to-end — the source dataset, the refresh cadence, the formula, and the gaps. If we cannot show our work, we do not publish the number.",
  },
  {
    n: "III",
    h: "Promise",
    b: "We do not give legal advice and we do not file documents. We surface the public record, organize it, and let it speak. The judgment remains with you, your counsel, and the court.",
  },
]

const CAPABILITIES = [
  { icon: "chart", label: "Disparity Analytics", desc: "Stop, charge, and sentencing data broken down by race, county, and agency." },
  { icon: "clock", label: "Historical Trends", desc: "Multi-year comparisons so you can see if Oregon is moving forward or standing still." },
  { icon: "grid", label: "Unified Record", desc: "28 datasets merged into one searchable index. Every judge, every officer, every county." },
  { icon: "document", label: "Document Assembly", desc: "Generate public-records requests, filings, and research memos from live data." },
  { icon: "users", label: "Community Portal", desc: "File observations, attend oversight meetings, and track agency responses." },
  { icon: "edit", label: "Bias Beacon", desc: "Live dashboards visualizing racial disparity across Oregon's justice system." },
]

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0F1A]" data-testid="home-page">
      <TopNav />
      <Hero />

      {/* Principles / Pillars */}
      <section className="relative px-6 md:px-10 py-24 md:py-32" data-testid="principles-section">
        <div className="max-w-[1360px] mx-auto">
          <div className="eyebrow mb-5">The Foundation</div>
          <h2 className="font-display text-4xl md:text-5xl text-ivory leading-tight mb-12">
            Three pillars.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--apt-line)]" data-testid="principles-grid">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="bg-[#0A0F1A] p-8 md:p-10" data-testid={`principle-${p.n}`}>
                <div className="flex items-baseline gap-5 mb-5">
                  <span className="numeral text-4xl md:text-5xl">{p.n}</span>
                  <span className="text-[10.5px] uppercase tracking-[0.36em] text-secondary">{p.h}</span>
                </div>
                <p className="text-ivory-dim leading-relaxed text-[15px]">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative px-6 md:px-10 py-24 md:py-32" data-testid="capabilities-section">
        <div className="max-w-[1360px] mx-auto">
          <div className="eyebrow mb-5">What It Does</div>
          <h2 className="font-display text-4xl md:text-5xl text-ivory leading-tight mb-12">
            Capabilities.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="capabilities-grid">
            {CAPABILITIES.map((c, i) => (
              <div key={c.label} className="card-3d-raised p-7 md:p-8 reveal" style={{ transitionDelay: `${i * 80}ms` }} data-testid={`capability-${c.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <h3 className="font-display text-xl text-ivory mb-3">{c.label}</h3>
                <p className="text-ivory-dim text-[14px] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pages Grid */}
      <section className="relative px-6 md:px-10 py-24 md:py-16" data-testid="pages-section">
        <div className="max-w-[1360px] mx-auto">
          <PagesGrid />
        </div>
      </section>

      {/* Quote */}
      <section className="relative px-6 md:px-10 py-24 md:py-32" data-testid="quote-section">
        <div className="max-w-[1360px] mx-auto">
          <div className="max-w-3xl">
            <div className="text-gold text-6xl font-serif-h leading-none mb-6">“</div>
            <blockquote className="font-serif-h italic text-2xl md:text-3xl lg:text-4xl text-ivory-dim leading-[1.2] tracking-tight">
              The public record is not a secret. It is not a privilege. It is the
              contract between the people and the institutions that serve them.
            </blockquote>
            <div className="mt-8 pt-6 border-t border-line">
              <cite className="not-italic text-[11px] uppercase tracking-[0.36em] text-secondary">
                A.P.T.I.T.U.D.E. — The Record-Keepers
              </cite>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
