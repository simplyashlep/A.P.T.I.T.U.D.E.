import React from "react";
import { PageShell } from "../components/aptitude/PageShell";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const TENETS = [
  {
    n: "I",
    h: "Why Oregon",
    b: "Oregon was an early adopter of mandated stop-data disclosure (HB 2355) and runs one of the most county-fragmented justice systems in the United States. If a cross-system accountability dataset can be built anywhere, it can be built here — and replicated everywhere.",
  },
  {
    n: "II",
    h: "Aptitudinal Alignment",
    b: "Every alignment index, every disparity figure, every institutional score is documented end-to-end — the source dataset, the refresh cadence, the formula, and the gaps. The standard an institution is measured against is its own stated mandate. If we cannot show our work, we do not publish the number.",
  },
  {
    n: "III",
    h: "Promise",
    b: "We do not give legal advice and we do not file documents. We surface the public record, organize it, and let it speak. The mirror we hold up reflects what institutions promised — and what the record shows. The judgment remains with you.",
  },
];

const CREDENTIALS = [
  { label: "Background", value: "Healthcare Talent Acquisition · Six Years" },
  { label: "Legal Work", value: "Self-Taught · Oregon Circuit Court · Federal Pro Se" },
  { label: "Platform", value: "A·P·T·I·T·U·D·E. · Built Without a Team" },
  { label: "Mission", value: "Public Accountability · Financial Inclusion · Institutional Transparency" },
];

export default function About() {
  return (
    <PageShell
      testId="about-page"
      eyebrow="The Record-Keepers"
      title="The Premise"
      italicTitle="Why we built this."
      intro="A.P.T.I.T.U.D.E. exists because public information lives in too many places for the public to actually use it — and because the cost of that fragmentation is not distributed evenly. We are technologists, legal researchers, and people the system has touched — building the dataset we wished existed when we needed it most."
    >

      {/* ── Founder — full width, commanding ── */}
      <section className="mb-20 md:mb-28" data-testid="about-founder">
        <div className="text-[11px] uppercase tracking-[0.36em] text-gold mb-8">The Founder</div>

        {/* Name + photo header — large */}
        <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-12 mb-12">
          <div className="flex-shrink-0">
            <img
              src="/media/ashle-penn.jpg"
              alt="AshLe' Penn"
              className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-2 border-[rgba(200,169,126,0.55)] shadow-[0_0_48px_rgba(200,169,126,0.18)]"
              data-testid="founder-photo"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-ivory leading-[1.0] mb-3">
              AshLe' Penn
            </h2>
            <div className="text-[11px] uppercase tracking-[0.40em] text-gold mb-6">
              Founder · Architect · A·P·T·I·T·U·D·E.
            </div>
            {/* Credential strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CREDENTIALS.map((c) => (
                <div key={c.label}>
                  <div className="text-[9.5px] uppercase tracking-[0.32em] text-secondary mb-1">{c.label}</div>
                  <div className="text-[12px] text-ivory-dim leading-snug">{c.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="gold-rule mb-12" />

        {/* Bio — full width, generous size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-7 max-w-[1100px]">
          <p className="font-serif-h italic text-ivory-dim text-[17px] md:text-[19px] leading-[1.75]">
            A.P.T.I.T.U.D.E. was built by someone who learned early that systems aren't neutral — they're designed, and design can be challenged. Military-raised, she grew up understanding discipline, structure, and what it actually means to operate with strength and honor — not as a slogan, but as a standard.
          </p>
          <p className="font-serif-h italic text-ivory-dim text-[17px] md:text-[19px] leading-[1.75]">
            She's a lifelong learner in the truest sense — someone who treats every room, every setback, and every document as curriculum. She came up through healthcare recruiting without a roadmap, mastered technical legal work most professionals pay others to do, and started building platforms before she had the budget to finish them.
          </p>
          <p className="font-serif-h italic text-ivory-dim text-[17px] md:text-[19px] leading-[1.75]">
            She has a deep affinity for the law — not because she was handed access to it, but because she kept walking through doors she was told were closed to her. What she found on the other side was a system whose accountability mechanisms work exactly as designed — which is to say, unevenly, and not by accident.
          </p>
          <p className="font-serif-h italic text-ivory-dim text-[17px] md:text-[19px] leading-[1.75]">
            A.P.T.I.T.U.D.E. exists at the intersection of accountability and access. It is a transparency platform, a financial inclusion tool, and a long game — grounded in the belief that fairness isn't charity, it's infrastructure. Built for the people who need the system to actually work.
          </p>
          <p className="font-serif-h italic text-ivory-dim text-[17px] md:text-[19px] leading-[1.75] md:col-span-2 max-w-2xl">
            She doesn't have a team yet. She has a theory, a methodology, a deployed prototype, and a track record of being right before the room catches up.
          </p>
        </div>

        {/* Closing pull quote */}
        <div className="mt-14 border-l-2 border-[rgba(200,169,126,0.6)] pl-8 max-w-3xl">
          <p className="font-display text-2xl md:text-3xl text-ivory leading-[1.2]">
            "The direction of accountability has been corrected.
            <span className="italic text-gold"> Institutions now have a score."</span>
          </p>
        </div>
      </section>

      {/* ── Method cards ── */}
      <section data-testid="about-tenets">
        <div className="text-[11px] uppercase tracking-[0.36em] text-gold mb-8">Methodology</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--apt-line)]">
          {TENETS.map((t) => (
            <div key={t.n} className="bg-[#0A0F1A] p-8 md:p-12">
              <div className="flex items-baseline gap-5 mb-6">
                <span className="numeral text-5xl md:text-6xl">{t.n}</span>
                <span className="text-[10.5px] uppercase tracking-[0.36em] text-secondary">{t.h}</span>
              </div>
              <p className="text-ivory-dim leading-relaxed text-[15px] md:text-[16px]">{t.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="mt-20 flex flex-wrap gap-6 items-center">
        <Link
          to="/aptitude-advancement"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.36em] text-gold border-b border-[var(--apt-gold)] pb-1 hover:gap-4 transition-all duration-400"
        >
          Aptitude Advancement
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to="/bias-beacon"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.36em] text-secondary hover:text-gold border-b border-transparent hover:border-[var(--apt-gold)] pb-1 transition-all duration-400"
        >
          Bias Beacon
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to="/judiciary"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.36em] text-secondary hover:text-gold border-b border-transparent hover:border-[var(--apt-gold)] pb-1 transition-all duration-400"
        >
          The Judiciary
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </section>

    </PageShell>
  );
}
