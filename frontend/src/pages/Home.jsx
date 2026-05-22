import React, { useEffect } from "react";
import axios from "axios";
import { Toaster } from "sonner";
import { TopNav } from "../components/aptitude/TopNav";
import { Hero } from "../components/aptitude/Hero";
import { PagesGrid } from "../components/aptitude/PagesGrid";
import { Footer } from "../components/aptitude/Footer";
import { Quote, ArrowUpRight } from "lucide-react";
import { ScaleLogo } from "../components/aptitude/Brand";
import { Link } from "react-router-dom";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const TENETS = [
  {
    n: "I",
    name: "Precision",
    body:
      "Every figure measured against the controlling rule. What is uncertain is named uncertain — never improvised.",
  },
  {
    n: "II",
    name: "Principle",
    body:
      "Methodology over disposition. How a bias score is calculated, where its data lives, and what it cannot yet see — all in the open.",
  },
  {
    n: "III",
    name: "Proof",
    body:
      "Public record as primary source. Every metric links back to the dataset, the statute, the case, or the agency that issued it.",
  },
];

const TenetsSection = () => (
  <section
    id="principles"
    className="relative py-28 md:py-36 px-6 md:px-10 overflow-hidden"
    data-testid="tenets-section"
  >
    <div className="relative max-w-[1360px] mx-auto">
      <div className="reveal flex items-baseline justify-between flex-wrap gap-6 mb-16 md:mb-20">
        <div>
          <div className="eyebrow mb-4">The Tenets</div>
          <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
            Three rules.<br />
            <span className="italic text-gold">No exceptions.</span>
          </h2>
        </div>
        <p className="font-serif-h italic text-lg md:text-xl text-ivory-dim max-w-md">
          Oregon's record deserves the same discipline as the best chambers.
          These are ours.
        </p>
      </div>

      <div className="gold-rule mb-14" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--apt-line)]" data-testid="tenets-grid">
        {TENETS.map((p, i) => (
          <div
            key={p.n}
            className="reveal bg-[#0A0F1A] p-8 md:p-12 group"
            style={{ transitionDelay: `${i * 120}ms` }}
            data-testid={`tenet-${p.name.toLowerCase()}`}
          >
            <div className="flex items-baseline gap-6 mb-8">
              <span className="numeral text-5xl md:text-6xl">{p.n}</span>
              <span className="text-[11px] uppercase tracking-[0.36em] text-secondary group-hover:text-gold transition-colors duration-500">
                {p.name}
              </span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-ivory mb-5 leading-snug">
              {p.name}.
            </h3>
            <p className="text-ivory-dim leading-relaxed text-[15px] max-w-sm">{p.body}</p>
            <div className="mt-10 h-px w-12 bg-[var(--apt-gold)] opacity-50 group-hover:w-24 transition-all duration-700" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const QuoteSection = () => (
  <section className="relative py-32 md:py-44 px-6 md:px-10 overflow-hidden" data-testid="quote-section">
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
      <ScaleLogo className="w-[560px] h-[560px] md:w-[820px] md:h-[820px]" />
    </div>
    <div className="relative max-w-4xl mx-auto text-center">
      <Quote className="w-7 h-7 text-gold mx-auto mb-10 opacity-80" strokeWidth={1} />
      <blockquote className="reveal font-display text-3xl md:text-5xl lg:text-6xl leading-[1.15] text-ivory">
        “Sunlight is said to be the best of disinfectants;<br />
        <span className="italic text-gold">electric light the most efficient policeman.”</span>
      </blockquote>
      <div className="reveal mt-10 text-[11px] uppercase tracking-[0.4em] text-secondary" style={{ transitionDelay: "120ms" }}>
        Louis Brandeis  ·  Harper's Weekly, 1913
      </div>

      <div className="gold-rule mt-20 mb-20 max-w-md mx-auto" />

      <p className="reveal font-serif-h italic text-lg md:text-xl text-ivory-dim max-w-2xl mx-auto leading-relaxed" style={{ transitionDelay: "200ms" }}>
        A.P.T.I.T.U.D.E. exists to bring siloed public information into the same
        room — county by county, actor by actor — until the record reads like a
        record.
      </p>

      <Link
        to="/bias-beacon"
        className="reveal mt-14 inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.36em] text-gold border-b border-[var(--apt-gold)] pb-1 hover:gap-5 transition-all duration-500"
        style={{ transitionDelay: "260ms" }}
        data-testid="quote-cta-beacon"
      >
        Open the Bias Beacon
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  </section>
);

const SUBJECTS = [
  "STOP Data",
  "ORS · OAR",
  "Conviction Rates",
  "Sentencing Disparity",
  "Appellate Reversals",
  "Probation Revocations",
  "Plea Patterns",
  "Public Comment",
  "County Heat Maps",
  "Budget Flow",
];

const TrustStrip = () => {
  const all = [...SUBJECTS, ...SUBJECTS];
  return (
    <section className="relative border-y border-line py-6 overflow-hidden" aria-hidden="true" data-testid="trust-strip">
      <div className="drift-track flex whitespace-nowrap gap-14 text-[11px] uppercase tracking-[0.36em] text-secondary">
        {all.map((t, i) => (
          <span key={i} className="flex items-center gap-14">
            {t}
            <span className="w-1 h-1 rounded-full bg-[var(--apt-gold)] opacity-60" />
          </span>
        ))}
      </div>
    </section>
  );
};

export default function Home() {
  useReveal();
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);
  return (
    <div className="relative">
      <TopNav />
      <Hero />
      <TrustStrip />
      <PagesGrid />
      <TenetsSection />
      <QuoteSection />
      <Footer />
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#0E1420",
            border: "1px solid rgba(245,241,230,0.12)",
            color: "#F5F1E6",
            fontFamily: "'Outfit', sans-serif",
          },
        }}
      />
    </div>
  );
}
