import React from "react"
import { PageShell } from "../components/aptitude/PageShell"

const TENETS = [
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

export default function About() {
  return (
    <PageShell
      testId="about-page"
      eyebrow="The Record-Keepers"
      title="About."
      italicTitle="Why we built this."
      intro="A.P.T.I.T.U.D.E. exists because Oregon's public information lives in too many places for the public to actually use it. We are clerks, technologists, and people the system has touched — building the dataset we wished existed when we were inside it."
    >
      {/* Founders placeholder */}
      <div className="mb-16">
        <div className="text-[11px] uppercase tracking-[0.36em] text-gold mb-6">The Founders</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6" data-testid="about-founders">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-3d-raised p-7" data-testid={`founder-card-${i}`}>
              <div className="w-16 h-16 rounded-full border border-[rgba(200,169,126,0.45)] bg-[#0E1420] flex items-center justify-center mb-5">
                <span className="font-display text-2xl text-gold">{['F', 'C', 'L'][i - 1]}</span>
              </div>
              <h3 className="font-display text-2xl text-ivory mb-1">Founder {i}</h3>
              <div className="text-[10.5px] uppercase tracking-[0.32em] text-secondary mb-4">Role · Title</div>
              <p className="font-serif-h italic text-ivory-dim text-[14.5px] leading-relaxed">
                A short bio about this founder will appear here. Share what they bring to the
                instrument — and the part of the record they care about most.
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[12px] text-secondary italic">
          Bio content awaiting your input — share names, roles, and short bios to populate these cards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--apt-line)]" data-testid="about-tenets">
        {TENETS.map((t, i) => (
          <div key={t.n} className="bg-[#0A0F1A] p-8 md:p-10">
            <div className="flex items-baseline gap-5 mb-5">
              <span className="numeral text-4xl md:text-5xl">{t.n}</span>
              <span className="text-[10.5px] uppercase tracking-[0.36em] text-secondary">{t.h}</span>
            </div>
            <p className="text-ivory-dim leading-relaxed text-[15px]">{t.b}</p>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
