import { useEffect, useMemo, useRef, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Search, ArrowUpRight, Loader2, Scale, BookOpen, Gavel, FileSearch, Quote } from "lucide-react";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ----------------- Lady Justice Video / Fallback ----------------- */
const HERO_VIDEO_SOURCES = [
  // Lady Justice / scales — Pixabay stock (CDN)
  "https://cdn.pixabay.com/video/2023/10/14/185079-873431597_large.mp4",
  // Backup: marble columns, courthouse mood
  "https://cdn.pixabay.com/video/2022/03/13/110817-687901392_large.mp4",
];
const HERO_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxsYWR5JTIwanVzdGljZSUyMHN0YXR1ZXxlbnwwfHx8fDE3Nzk0Mzc4ODl8MA&ixlib=rb-4.1.0&q=85";
const PRINCIPLES_BG_IMAGE =
  "https://images.unsplash.com/photo-1508174516034-a466529afd78?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxtYXJibGUlMjBjb2x1bW5zJTIwYXJjaGl0ZWN0dXJlJTIwZGFya3xlbnwwfHx8fDE3Nzk0Mzc4ODl8MA&ixlib=rb-4.1.0&q=85";

/* ----------------- SVG Wordmark ----------------- */
const Wordmark = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "text-base tracking-[0.42em]",
    md: "text-xl tracking-[0.42em]",
    lg: "text-5xl md:text-7xl lg:text-8xl tracking-[0.18em] md:tracking-[0.22em]",
  };
  const letters = "APTITUDE".split("");
  return (
    <div
      className={`font-display ${sizes[size]} flex items-baseline wordmark-letters ${className}`}
      data-testid={`brand-wordmark-${size}`}
      aria-label="A.P.T.I.T.U.D.E."
    >
      {letters.map((l, i) => (
        <span key={i}>
          {l}
          {i < letters.length - 1 ? (
            <span className="text-gold opacity-70 mx-[0.05em]">.</span>
          ) : (
            <span className="text-gold opacity-70">.</span>
          )}
        </span>
      ))}
    </div>
  );
};

/* ----------------- Top Nav ----------------- */
const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[#0A0F1A]/70 border-b border-line"
          : "bg-transparent"
      }`}
      data-testid="top-nav"
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3" data-testid="nav-brand">
          <ScaleLogo />
          <Wordmark size="sm" />
        </a>
        <nav className="hidden md:flex items-center gap-10 text-[12.5px] uppercase tracking-[0.28em] text-ivory-dim">
          <a href="#principles" className="link-quiet" data-testid="nav-principles">Principles</a>
          <a href="#capabilities" className="link-quiet" data-testid="nav-capabilities">Capabilities</a>
          <a href="#chambers" className="link-quiet" data-testid="nav-chambers">Chambers</a>
        </nav>
        <a
          href="#search"
          className="hidden md:inline-flex items-center gap-2 text-[12.5px] uppercase tracking-[0.28em] text-gold border-b border-transparent hover:border-[var(--apt-gold)] transition-colors duration-300"
          data-testid="nav-enter"
        >
          Enter Chambers
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
};

/* ----------------- Scale Icon (custom SVG) ----------------- */
const ScaleLogo = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="lg1" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#D9BE93" />
        <stop offset="100%" stopColor="#A8895F" />
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#lg1)" strokeWidth="1.25" strokeLinecap="round">
      <line x1="32" y1="8" x2="32" y2="54" />
      <line x1="22" y1="54" x2="42" y2="54" />
      <line x1="12" y1="20" x2="52" y2="20" />
      <path d="M12 20 L6 34 Q12 38 18 34 Z" fill="rgba(217,190,147,0.08)" />
      <path d="M52 20 L46 34 Q52 38 58 34 Z" fill="rgba(217,190,147,0.08)" />
      <circle cx="32" cy="20" r="1.6" fill="#D9BE93" stroke="none" />
    </g>
  </svg>
);

/* ----------------- Hero ----------------- */
const Hero = () => {
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(true);
  const [srcIdx, setSrcIdx] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onErr = () => {
      if (srcIdx + 1 < HERO_VIDEO_SOURCES.length) {
        setSrcIdx((i) => i + 1);
      } else {
        setVideoOk(false);
      }
    };
    v.addEventListener("error", onErr);
    return () => v.removeEventListener("error", onErr);
  }, [srcIdx]);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden grain"
      data-testid="hero-section"
    >
      {/* Video background */}
      {videoOk ? (
        <video
          ref={videoRef}
          className="hero-video absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={HERO_FALLBACK_IMAGE}
          key={HERO_VIDEO_SOURCES[srcIdx]}
          data-testid="hero-video"
        >
          <source src={HERO_VIDEO_SOURCES[srcIdx]} type="video/mp4" />
        </video>
      ) : (
        <img
          src={HERO_FALLBACK_IMAGE}
          alt="Lady Justice statue"
          className="hero-fallback-img absolute inset-0 w-full h-full object-cover"
          data-testid="hero-fallback-image"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay z-[2]" />

      {/* Vignette frame */}
      <div className="pointer-events-none absolute inset-0 z-[3]" style={{
        boxShadow: "inset 0 0 220px 40px rgba(0,0,0,0.85)",
      }} />

      {/* Decorative gold hairlines */}
      <div className="absolute left-6 md:left-10 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-[rgba(200,169,126,0.25)] to-transparent z-[4]" />
      <div className="absolute right-6 md:right-10 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-[rgba(200,169,126,0.25)] to-transparent z-[4]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-6 md:px-10 pt-28 pb-16">
        <div className="eyebrow mb-6 opacity-90" data-testid="hero-eyebrow">
          Est. MMXXV  ·  A Legal Research Instrument
        </div>

        <Wordmark size="lg" className="text-ivory text-center justify-center" />

        <div className="mt-8 md:mt-10 max-w-2xl text-center">
          <p className="font-serif-h text-2xl md:text-3xl text-ivory-dim italic leading-snug" data-testid="hero-tagline">
            Accountability Is Real<span className="text-gold">.</span>
            <span className="caret">|</span>
          </p>
          <p className="mt-4 text-[12.5px] uppercase tracking-[0.36em] text-secondary" data-testid="hero-subtagline">
            Precision  ·  Principle  ·  Proof
          </p>
        </div>

        <SearchBar />

        <div className="mt-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-secondary" data-testid="hero-meta">
          <span className="w-6 h-px bg-[rgba(200,169,126,0.5)]" />
          Search grounded in law and reason
          <span className="w-6 h-px bg-[rgba(200,169,126,0.5)]" />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-secondary" data-testid="scroll-cue">
        <span>Descend</span>
        <span className="w-px h-10 bg-gradient-to-b from-[rgba(200,169,126,0.6)] to-transparent" />
      </div>
    </section>
  );
};

/* ----------------- Tiny Markdown renderer (bold, italic, bullets) ----------------- */
const renderInline = (text) => {
  // bold **x**, then italic *x* / _x_
  const nodes = [];
  let key = 0;
  const boldSplit = text.split(/(\*\*[^*]+\*\*)/g);
  boldSplit.forEach((chunk) => {
    if (/^\*\*[^*]+\*\*$/.test(chunk)) {
      nodes.push(
        <strong key={key++} className="text-ivory font-medium tracking-[0.04em]">
          {chunk.slice(2, -2)}
        </strong>
      );
    } else {
      const itSplit = chunk.split(/(\*[^*]+\*|_[^_]+_)/g);
      itSplit.forEach((c) => {
        if (/^(\*[^*]+\*|_[^_]+_)$/.test(c)) {
          nodes.push(
            <em key={key++} className="font-serif-h italic text-ivory-dim">
              {c.slice(1, -1)}
            </em>
          );
        } else if (c) {
          nodes.push(<span key={key++}>{c}</span>);
        }
      });
    }
  });
  return nodes;
};

const Markdown = ({ text }) => {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isList = lines.every((l) => l.startsWith("- ") || l.startsWith("* "));
        if (isList && lines.length) {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="text-gold mt-[0.4em] w-3 h-px bg-[var(--apt-gold)] flex-shrink-0" />
                  <span>{renderInline(l.replace(/^[-*]\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[15px] leading-relaxed">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
};

/* ----------------- Search Bar ----------------- */
const SearchBar = () => {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const sessionRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API}/search`, {
        query,
        session_id: sessionRef.current,
      });
      sessionRef.current = res.data.session_id;
      setResult(res.data);
    } catch (err) {
      console.error(err);
      toast.error("The query could not be heard. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="search" className="w-full max-w-3xl mt-12 md:mt-14" data-testid="hero-search-wrap">
      <form onSubmit={onSubmit} className="apt-search rounded-full flex items-center px-6 md:px-8 py-3 md:py-4">
        <Search className="w-4 h-4 text-gold mr-4 flex-shrink-0" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask the doctrine — e.g., what governs piercing the corporate veil?"
          className="flex-1 text-base md:text-lg outline-none border-0 placeholder:italic"
          aria-label="Legal research query"
          data-testid="hero-search-input"
        />
        <button
          type="submit"
          disabled={loading || !q.trim()}
          className="ml-3 inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[11px] uppercase tracking-[0.28em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:bg-[var(--apt-gold-soft)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
          data-testid="hero-search-submit"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Inquire</span>}
        </button>
      </form>

      <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-5 text-[11px] tracking-[0.18em] uppercase text-secondary" data-testid="hero-search-suggestions">
        {["Mens rea standards", "Doctrine of estoppel", "Fourth Amendment scope", "Force majeure"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQ(s)}
            className="link-quiet"
            data-testid={`suggestion-${s.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {s}
          </button>
        ))}
      </div>

      {(loading || result) && (
        <div
          className="mt-8 relative rounded-sm border border-line-strong bg-[rgba(13,18,28,0.78)] backdrop-blur-xl px-6 md:px-8 py-6 md:py-7 text-left"
          data-testid="search-result-panel"
        >
          <div className="flex items-center gap-3 mb-4 text-[10.5px] uppercase tracking-[0.32em] text-gold">
            <span className="w-4 h-px bg-[var(--apt-gold)]" />
            Counsel's Brief
          </div>
          {loading ? (
            <div className="flex items-center gap-3 text-ivory-dim">
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
              <span className="font-serif-h italic">Consulting the record…</span>
            </div>
          ) : (
            <article className="font-ui text-ivory-dim leading-relaxed text-[15px]">
              <Markdown text={result.answer} />
            </article>
          )}
        </div>
      )}
    </div>
  );
};

/* ----------------- Reveal hook ----------------- */
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
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

/* ----------------- Principles Section ----------------- */
const PRINCIPLES = [
  {
    n: "I",
    name: "Precision",
    body:
      "Every answer measured against the controlling rule. We resist the soft language of guesswork; what is uncertain is named uncertain.",
  },
  {
    n: "II",
    name: "Principle",
    body:
      "Doctrine over disposition. The reasoning is shown — statutes, canons, and the architecture of a holding — not concealed behind confidence.",
  },
  {
    n: "III",
    name: "Proof",
    body:
      "Authority is the closing argument. We point to the cases, codes, and frameworks that bear the weight, so your work can rest on them.",
  },
];

const PrinciplesSection = () => (
  <section
    id="principles"
    className="relative py-28 md:py-40 px-6 md:px-10 overflow-hidden"
    data-testid="principles-section"
  >
    <div
      className="absolute inset-0 opacity-[0.07] pointer-events-none"
      style={{
        backgroundImage: `url(${PRINCIPLES_BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A] via-[#0A0F1A]/95 to-[#0A0F1A] pointer-events-none" />
    <div className="relative max-w-[1320px] mx-auto">
      <div className="reveal flex items-baseline justify-between flex-wrap gap-6 mb-16 md:mb-24">
        <div>
          <div className="eyebrow mb-4">Chapter One  ·  Pillars</div>
          <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
            Three rules.<br />
            <span className="italic text-gold">No exceptions.</span>
          </h2>
        </div>
        <p className="font-serif-h text-lg md:text-xl text-ivory-dim max-w-md italic">
          The instrument is built around a small, exacting creed — the same creed the
          best chambers have always kept.
        </p>
      </div>

      <div className="gold-rule mb-14" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--apt-line)]" data-testid="principles-grid">
        {PRINCIPLES.map((p, i) => (
          <div
            key={p.n}
            className="reveal bg-[#0A0F1A] p-8 md:p-12 group"
            style={{ transitionDelay: `${i * 120}ms` }}
            data-testid={`principle-${p.name.toLowerCase()}`}
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
            <p className="text-ivory-dim leading-relaxed text-[15px] max-w-sm">
              {p.body}
            </p>
            <div className="mt-10 h-px w-12 bg-[var(--apt-gold)] opacity-50 group-hover:w-24 transition-all duration-700" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ----------------- Capabilities Section ----------------- */
const CAPABILITIES = [
  {
    icon: BookOpen,
    title: "Doctrine on Demand",
    body:
      "Surface the controlling doctrine for a question in plain, exacting prose — with the contours of competing rules drawn at the edges.",
    span: "md:col-span-2 md:row-span-2",
    eyebrow: "Research",
  },
  {
    icon: Gavel,
    title: "Case Architecture",
    body:
      "Holdings, dicta, and the spine of reasoning — separated.",
    span: "md:col-span-1",
    eyebrow: "Reading",
  },
  {
    icon: FileSearch,
    title: "Authority Trails",
    body: "Curated reading lists for any inquiry, ordered by weight.",
    span: "md:col-span-1",
    eyebrow: "Bibliography",
  },
  {
    icon: Scale,
    title: "Calibrated Caution",
    body:
      "When the record is thin, the instrument says so — explicitly, in plain words — rather than improvising authority.",
    span: "md:col-span-3",
    eyebrow: "Discipline",
  },
];

const CapabilitiesSection = () => (
  <section
    id="capabilities"
    className="relative py-28 md:py-40 px-6 md:px-10"
    data-testid="capabilities-section"
  >
    <div className="relative max-w-[1320px] mx-auto">
      <div className="reveal mb-16 md:mb-24 max-w-3xl">
        <div className="eyebrow mb-4">Chapter Two  ·  Capabilities</div>
        <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05]">
          An instrument, not<br />
          <span className="italic text-gold">a chatbot.</span>
        </h2>
        <p className="mt-6 font-serif-h text-lg md:text-xl text-ivory-dim italic max-w-2xl">
          Built for disciplined inquiry — by clerks, for the work clerks do at 1 a.m.
          when the brief is due.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--apt-line)]" data-testid="capabilities-grid">
        {CAPABILITIES.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className={`reveal bg-[#0A0F1A] p-8 md:p-10 border border-line group hover:border-[rgba(200,169,126,0.35)] transition-colors duration-700 ${c.span}`}
              style={{ transitionDelay: `${i * 100}ms` }}
              data-testid={`capability-${c.title.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className="flex items-center justify-between mb-10">
                <span className="text-[10.5px] uppercase tracking-[0.36em] text-gold">
                  {c.eyebrow}
                </span>
                <Icon className="w-4 h-4 text-steel group-hover:text-gold transition-colors duration-500" strokeWidth={1.25} />
              </div>
              <h3 className="font-display text-2xl md:text-3xl text-ivory mb-4 leading-snug">
                {c.title}
              </h3>
              <p className="text-ivory-dim leading-relaxed text-[15px]">
                {c.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ----------------- Trust / Quote Section ----------------- */
const TrustSection = () => (
  <section
    id="chambers"
    className="relative py-32 md:py-48 px-6 md:px-10 overflow-hidden"
    data-testid="trust-section"
  >
    {/* Background scale silhouette */}
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
      <ScaleLogo className="w-[560px] h-[560px] md:w-[820px] md:h-[820px]" />
    </div>

    <div className="relative max-w-4xl mx-auto text-center">
      <Quote className="w-7 h-7 text-gold mx-auto mb-10 opacity-80" strokeWidth={1} />
      <blockquote className="reveal font-display text-3xl md:text-5xl lg:text-6xl leading-[1.15] text-ivory" data-testid="trust-quote">
        “Law is reason,<br />
        <span className="italic text-gold">free from passion.</span>”
      </blockquote>
      <div className="reveal mt-10 text-[11px] uppercase tracking-[0.4em] text-secondary" style={{ transitionDelay: "120ms" }}>
        Aristotle  ·  Politics, Book III
      </div>

      <div className="gold-rule mt-20 mb-20 max-w-md mx-auto" />

      <p className="reveal font-serif-h italic text-lg md:text-xl text-ivory-dim max-w-2xl mx-auto leading-relaxed" style={{ transitionDelay: "200ms" }}>
        A.P.T.I.T.U.D.E. exists for the moment between a question and a brief —
        when reason must do the steady work of taking sides for principle.
      </p>

      <a
        href="#search"
        className="reveal mt-14 inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.36em] text-gold border-b border-[var(--apt-gold)] pb-1 hover:gap-5 transition-all duration-500"
        style={{ transitionDelay: "260ms" }}
        data-testid="trust-cta"
      >
        Return to the Bench
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </div>
  </section>
);

/* ----------------- Footer ----------------- */
const Footer = () => (
  <footer className="relative border-t border-line py-16 px-6 md:px-10" data-testid="footer">
    <div className="max-w-[1320px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <ScaleLogo />
            <Wordmark size="sm" />
          </div>
          <p className="font-serif-h italic text-ivory-dim text-base max-w-sm">
            Precision. Principle. Proof. — for research orientation, not as
            substitute for counsel.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-3 text-[11.5px] uppercase tracking-[0.28em]">
          <a href="#principles" className="link-quiet" data-testid="footer-principles">Principles</a>
          <a href="#capabilities" className="link-quiet" data-testid="footer-capabilities">Capabilities</a>
          <a href="#chambers" className="link-quiet" data-testid="footer-chambers">Chambers</a>
          <a href="#search" className="link-quiet" data-testid="footer-search">Inquire</a>
          <a href="#" className="link-quiet" data-testid="footer-privacy">Privacy</a>
          <a href="#" className="link-quiet" data-testid="footer-terms">Terms</a>
        </div>
      </div>

      <div className="gold-rule my-12" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[10.5px] uppercase tracking-[0.36em] text-secondary">
        <span>© MMXXV — A.P.T.I.T.U.D.E.</span>
        <span className="italic font-serif-h normal-case tracking-normal text-ivory-dim text-sm">
          Where principle meets precision.
        </span>
        <span>Calm  ·  Authoritative  ·  Disciplined</span>
      </div>
    </div>
  </footer>
);

/* ----------------- Trust Strip (marquee) ----------------- */
const TrustStrip = () => {
  const items = useMemo(
    () => [
      "Common Law",
      "Civil Procedure",
      "Constitutional Doctrine",
      "Contract",
      "Equity",
      "Evidence",
      "International Law",
      "Tort",
      "Statutory Interpretation",
      "Administrative Law",
    ],
    []
  );
  const all = [...items, ...items];
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

/* ----------------- Home ----------------- */
const Home = () => {
  useReveal();
  useEffect(() => {
    // ping backend
    axios.get(`${API}/`).catch(() => {});
  }, []);
  return (
    <div className="relative">
      <TopNav />
      <Hero />
      <TrustStrip />
      <PrinciplesSection />
      <CapabilitiesSection />
      <TrustSection />
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
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
