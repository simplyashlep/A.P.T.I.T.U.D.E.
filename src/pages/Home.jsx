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

const API = `${import.meta.env.VITE_BACKEND_URL || ""}/api`;

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
      "Every Aptitudinal Alignment figure is measured against the institution's own stated mandate. What is uncertain is named uncertain — never improvised, never assumed.",
  },
  {
    n: "II",
    name: "Principle",
    body:
      "Methodology over disposition. How an alignment index is calculated, where its data lives, what it cannot yet see — all of it in the open. The record has nothing to hide.",
  },
  {
    n: "III",
    name: "Proof",
    body:
      "Public record as primary source. Every metric traces back to the dataset, the statute, the case, or the agency that issued it. If we cannot show our work, we do not publish the number.",
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
            Three rules.
            <span className="italic text-gold"> No exceptions.</span>
          </h2>
        </div>
        <p className="font-serif-h italic text-lg md:text-xl text-ivory-dim max-w-md">
          Public institutions accepted a standard the moment they became public.
          We hold the record to that standard — and only that standard.
        </p>
      </div>

      <div className="gold-rule mb-14" />

      <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-[var(--apt-line)]" data-testid="tenets-grid">
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
        "Sunlight is said to be the best of disinfectants;
        <span className="italic text-gold"> electric light the most efficient policeman."</span>
      </blockquote>
      <div className="reveal mt-10 text-[11px] uppercase tracking-[0.4em] text-secondary" style={{ transitionDelay: "120ms" }}>
        Louis Brandeis · Harper's Weekly, 1913
      </div>

      <div className="gold-rule mt-20 mb-20 max-w-md mx-auto" />

      <p className="reveal font-serif-h italic text-lg md:text-xl text-ivory-dim max-w-2xl mx-auto leading-relaxed" style={{ transitionDelay: "200ms" }}>
        A.P.T.I.T.U.D.E. exists because fragmented public information
        is not neutral — it is power, held by the institutions that produce it.
        We bring it into one room. The record speaks for itself.
      </p>

      <div className="reveal mt-14 flex flex-col sm:flex-row items-center justify-center gap-6" style={{ transitionDelay: "260ms" }}>
        <Link
          to="/aptitude-advancement"
          className="inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.36em] text-gold border-b border-[var(--apt-gold)] pb-1 hover:gap-5 transition-all duration-500"
          data-testid="quote-cta-aa"
        >
          Find Your Path Forward
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
        <span className="text-secondary text-[10px] uppercase tracking-[0.32em]">·</span>
        <Link
          to="/bias-beacon"
          className="inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.36em] text-secondary hover:text-gold border-b border-transparent hover:border-[var(--apt-gold)] pb-1 transition-all duration-500"
          data-testid="quote-cta-beacon"
        >
          Open the Bias Beacon
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  </section>
);

// Marquee — the mission stated plainly, with authority
const MARQUEE_ITEMS = [
  "Aptitudinal Alignment",
  "Public Accountability",
  "Credit System Transparency",
  "Cross-System Visibility",
  "Institutional Friction Index",
  "Digital Financial Access",
  "Open Payment Standards",
  "Disparity Mapping",
  "The Record You Were Never Shown",
  "Pathway to What's Yours",
  "Every Agency. Every Obligation. In the Open.",
  "You Fund It. You Have a Right to Read It.",
];

const TrustStrip = () => {
  const all = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
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

// Lady Justice — persistent ghost, bottom-right, every page via Home layout
// Used here as a fixed background element across the whole app shell
const JusticeGhost = () => (
  <div
    className="pointer-events-none fixed bottom-0 right-0 z-0 select-none"
    aria-hidden="true"
    data-testid="justice-ghost"
    style={{
      width: "clamp(180px, 22vw, 320px)",
      height: "clamp(280px, 36vw, 520px)",
      maskImage: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 55%, transparent 100%), linear-gradient(to left, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 60%, transparent 100%)",
      WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 55%, transparent 100%), linear-gradient(to left, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.06) 60%, transparent 100%)",
      maskComposite: "intersect",
      WebkitMaskComposite: "source-in",
    }}
  >
    <img
      src="/media/lady-justice-still.png"
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center top",
        opacity: 0.16,
        filter: "saturate(0) contrast(1.1) brightness(0.7)",
        mixBlendMode: "luminosity",
      }}
    />
  </div>
);

export default function Home() {
  useReveal();
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);
  return (
    <div className="relative">
      <JusticeGhost />
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
