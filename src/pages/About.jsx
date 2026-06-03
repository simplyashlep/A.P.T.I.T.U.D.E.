import React from "react";
import { PageShell } from "../components/aptitude/PageShell";

const TENETS = [
  {
    n: "I",
    h: "Why Oregon",
    b: "Oregon was an early adopter of mandated stop-data disclosure (HB 2355) and runs one of the most county-fragmented justice systems in the United States. If a public record dataset can be built anywhere, it can be built here.",
  },
  {
    n: "II",
    h: "Methodology",
    b: "Every bias score, every disparity figure, every ranking is documented end-to-end — the source dataset, the refresh cadence, the formula, and the gaps. If we cannot show our work, we don't publish the number.",
  },
  {
    n: "III",
    h: "Promise",
    b: "We do not give legal advice and we do not file documents. We surface the public record, organize it, and let it speak. The judgment remains with you, your counsel, and the court.",
  },
];

export default function About() {
  return (
    <PageShell
      testId="about-page"
      eyebrow="The Record-Keepers"
      title="About."
      italicTitle="Why we built this."
      intro="A.P.T.I.T.U.D.E. exists because Oregon's public information lives in too many places for the public to actually use it. We are clerks, technologists, and people the system has touched — building the dataset we wished existed when we were inside it."
    >
      {/* Founder */}
      <div className="mb-16">
        <div className="text-[11px] uppercase tracking-[0.36em] text-gold mb-6">The Founder</div>
        <div className="card-3d-raised p-8 md:p-10 max-w-3xl" data-testid="about-founder">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <img
                src="/media/ashle-penn.jpg"
                alt="AshLe' Penn"
                className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-2 border-[rgba(200,169,126,0.55)] gold-circle shadow-[0_0_24px_rgba(200,169,126,0.15)]"
                data-testid="founder-photo"
              />
            </div>
            <div>
              <h3 className="font-display text-2xl md:text-3xl text-ivory mb-1">AshLe' Penn</h3>
              <div className="text-[10.5px] uppercase tracking-[0.32em] text-gold mb-4">Founder · Architect</div>
              <p className="font-serif-h italic text-ivory-dim text-[14.5px] leading-relaxed">
                A.P.T.I.T.U.D.E. was built by someone who learned early that systems aren't neutral — they're designed, and design can be challenged.
              </p>
              <p className="font-serif-h italic text-ivory-dim text-[14.5px] leading-relaxed mt-3">
                Military-raised, she grew up understanding discipline, structure, and what it actually means to operate with strength and honor — not as a slogan, but as a standard. That foundation never left. It just found new arenas.
              </p>
              <p className="font-serif-h italic text-ivory-dim text-[14.5px] leading-relaxed mt-3">
                She's a lifelong learner in the truest sense — someone who treats every room, every setback, and every document as curriculum. She came up through recruiting without a roadmap, mastered technical legal work most professionals pay others to do, and started building platforms before she had the budget to finish them. She has a deep affinity for the law — not because she was handed access to it, but because she kept walking through doors she was told were closed to her.
              </p>
              <p className="font-serif-h italic text-ivory-dim text-[14.5px] leading-relaxed mt-3">
                A.P.T.I.T.U.D.E. exists at the intersection of accountability and access. It's a transparency project, an advocacy tool, and a long game — grounded in the belief that fairness isn't charity, it's infrastructure. Built for the people who need the system to actually work.
              </p>
              <p className="font-serif-h italic text-ivory-dim text-[14.5px] leading-relaxed mt-3">
                She doesn't have a team yet. She has a theory, a record, and a track record of being right before the room catches up.
              </p>
            </div>
          </div>
        </div>
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
  );
}
