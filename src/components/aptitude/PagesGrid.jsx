import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Gavel, Eye, Shield, Compass, Activity,
  FlaskConical, Users, Info, TrendingUp, ArrowUpRight, X
} from "lucide-react";
import { InteractiveGrid } from "./InteractiveGrid";

// ─── Card data — ORDER IS EXACT: 3 rows of 3 ─────────────────────────────────
// Row 1: Judiciary · Watchtower · Bias Beacon
// Row 2: Aptitude Advancement · Juris Lab · Law Enforcement
// Row 3: About · Community Corrections · Community
export const PAGES = [
  {
    to: "/judiciary",
    title: "The Judiciary",
    eyebrow: "Pillar I",
    icon: Gavel,
    gradient: "from-[#1a1206] via-[#2a1e0a] to-[#0d1520]",
    accent: "#C8A97E",
    accentRgb: "200,169,126",
    description: "Every active, sitting judge in Oregon — 211 across 36 counties — with Aptitudinal Alignment indexed.",
    tiers: [
      { label: "Tier I", body: "Name, county, term, Aptitudinal Alignment index." },
      { label: "Tier II", body: "Prison usage, appellate overturns, sentencing trends, counsel disparity." },
      { label: "Tier III", body: "Full deep dive with 3D visualizations and peer comparison." },
    ],
  },
  {
    to: "/watchtower",
    title: "The Watchtower",
    eyebrow: "Pillar II",
    icon: Eye,
    gradient: "from-[#0f1a1a] via-[#0a1f1c] to-[#070B14]",
    accent: "#7CBFB0",
    accentRgb: "124,191,176",
    description: "Prosecutors — by office, then by individual DA and DDA. Charging patterns laid bare.",
    tiers: [
      { label: "Tier I", body: "Office, position, caseload, charging tendencies." },
      { label: "Tier II", body: "Plea ratios, dismissal patterns, charge enhancements." },
      { label: "Tier III", body: "Disparity indicators by demographic and county peer set." },
    ],
  },
  {
    to: "/bias-beacon",
    title: "Bias Beacon",
    eyebrow: "The Dashboard",
    icon: Activity,
    gradient: "from-[#1a0d06] via-[#1f1209] to-[#0d1520]",
    accent: "#D4956A",
    accentRgb: "212,149,106",
    description: "Oregon STOP data, conviction rates, sentencing disparity heat maps, and the money flow of justice.",
    tiers: [
      { label: "Statewide", body: "County and regional disparity vs. national baselines." },
      { label: "Spatial", body: "Heat maps of hot spots; 3D charts of demographic outcomes." },
      { label: "Budget", body: "The money center of justice — and where it flows." },
    ],
  },
  {
    to: "/aptitude-advancement",
    title: "Aptitude Advancement",
    eyebrow: "The Connection",
    icon: TrendingUp,
    gradient: "from-[#0d1a0d] via-[#0f1f14] to-[#070B14]",
    accent: "#7CA88B",
    accentRgb: "124,168,139",
    description: "Where the gap closes. Financial access, open payment infrastructure, and the path forward — matched to where you actually are.",
    tiers: [
      { label: "Entry", body: "Name your starting point. We meet you there — no jargon, no assumptions." },
      { label: "Connection", body: "Matched resources, open payment tools, and access pathways built for your situation." },
      { label: "Action", body: "Specific next steps, legal rights, and the institutional friction map that explains what's in your way." },
    ],
  },
  {
    to: "/juris-lab",
    title: "Juris Lab",
    eyebrow: "Your Tools",
    icon: FlaskConical,
    gradient: "from-[#0f0f1a] via-[#13132a] to-[#070B14]",
    accent: "#9B8FD4",
    accentRgb: "155,143,212",
    description: "Upload your documents. Four agents analyze, research, inform, and co-draft — nothing is ever filed for you.",
    tiers: [
      { label: "Analyze", body: "Document intake and structured summary by AI agents." },
      { label: "Draft", body: "Letters, motions, and templates — co-written, never auto-filed." },
      { label: "Library", body: "Shared templates and caselaw the community curates." },
    ],
  },
  {
    to: "/law-enforcement",
    title: "Law Enforcement",
    eyebrow: "Pillar III",
    icon: Shield,
    gradient: "from-[#0a1220] via-[#0d1a2e] to-[#070B14]",
    accent: "#5B7B9A",
    accentRgb: "91,123,154",
    description: "Every officer in Oregon — searchable by agency, rank, DPSST certification, and STOP-data record.",
    tiers: [
      { label: "Tier I", body: "Agency, rank, sworn date, public certifications." },
      { label: "Tier II", body: "Stop outcomes, use-of-force events, sustained complaints." },
      { label: "Tier III", body: "STOP-data demographic breakdown, agency comparison." },
    ],
  },
  {
    to: "/about",
    title: "About",
    eyebrow: "The Record-Keepers",
    icon: Info,
    gradient: "from-[#1a1206] via-[#1e1608] to-[#0d0f14]",
    accent: "#A8895F",
    accentRgb: "168,137,95",
    description: "The founders, the Aptitudinal Alignment methodology, and why public accountability is infrastructure.",
    tiers: [
      { label: "Founders", body: "Who built this and why." },
      { label: "Method", body: "How Aptitudinal Alignment is calculated and verified." },
      { label: "Sources", body: "Every dataset, every refresh cadence, every gap." },
    ],
  },
  {
    to: "/community-corrections",
    title: "Community Corrections",
    eyebrow: "Pillar IV",
    icon: Compass,
    gradient: "from-[#1a0f0a] via-[#1f1510] to-[#0d1520]",
    accent: "#C4855A",
    accentRgb: "196,133,90",
    description: "Every parole and probation officer in Oregon — caseloads, revocation rates, and outcome disparity by county.",
    tiers: [
      { label: "Tier I", body: "County, caseload size, supervision specialty." },
      { label: "Tier II", body: "Revocation rates, sanction patterns, completion rates." },
      { label: "Tier III", body: "Outcome disparity by demographic, peer comparison." },
    ],
  },
  {
    to: "/community",
    title: "Community",
    eyebrow: "The Commons",
    icon: Users,
    gradient: "from-[#0a0f1a] via-[#0d1422] to-[#070B14]",
    accent: "#6B8FAF",
    accentRgb: "107,143,175",
    description: "Public comment, statewide meetings, agency contacts, complaint pathways, and people navigating the same system.",
    tiers: [
      { label: "Voice", body: "Public comment portals and statewide meeting calendars." },
      { label: "Paths", body: "Step-by-step complaint pathways: judges, lawyers, LE, CPS." },
      { label: "Groups", body: "Spaces for those navigating the system to compare experience." },
    ],
  },
];

const PremiumCard = ({ page, idx }) => {
  const Icon = page.icon;
  const cardRef = useRef(null);
  const rafRef = useRef(0);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 0, on: false });

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const { clientX, clientY } = e;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      // Small angles only. Enough to catch the light, not enough to wobble.
      setTilt({ rx: (0.5 - py) * 7, ry: (px - 0.5) * 9 });
      setSpot({ x: px * 100, y: py * 100, on: true });
    });
  };

  const onLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTilt({ rx: 0, ry: 0 });
    setSpot((s) => ({ ...s, on: false }));
  };

  const toggleFlip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFlipped((v) => !v);
  };

  const A = page.accentRgb;
  const faceBase = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: "8px",
    overflow: "hidden",
  };

  return (
    <div
      className="reveal"
      style={{
        height: "clamp(300px, 32vw, 400px)",
        perspective: "1400px",
        transitionDelay: `${idx * 55}ms`,
      }}
      data-testid={`pages-flip-card-${page.title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Tilt layer — separate from the flip layer so the two transforms
          never fight each other. */}
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${spot.on ? -6 : 0}px)`,
          transition: "transform 300ms cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {/* Flip layer */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transition: "transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            borderRadius: "8px",
          }}
        >
          {/* ── FRONT — the whole face is the link ── */}
          <Link
            to={page.to}
            style={{
              ...faceBase,
              display: "block",
              textDecoration: "none",
              // Each card now carries its own accent instead of the shared brown
              background: `linear-gradient(152deg, rgba(${A},0.16) 0%, rgba(13,21,32,0.97) 42%, #070B14 100%)`,
              border: `1px solid rgba(${A}, ${spot.on ? 0.42 : 0.18})`,
              boxShadow: spot.on
                ? `0 18px 50px rgba(0,0,0,0.62), 0 0 0 1px rgba(${A},0.12), inset 0 1px 0 rgba(${A},0.22)`
                : `0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(${A}, 0.12)`,
              transition: "border-color 300ms ease, box-shadow 300ms ease",
            }}
            data-testid={`pages-card-link-${page.title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {/* Accent bloom */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 0,
              background: `radial-gradient(ellipse 70% 60% at 85% 12%, rgba(${A}, 0.26) 0%, transparent 66%)`,
            }} />

            {/* Spotlight that follows the cursor */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
              background: `radial-gradient(circle 240px at ${spot.x}% ${spot.y}%, rgba(${A},0.20) 0%, rgba(${A},0.06) 38%, transparent 68%)`,
              opacity: spot.on ? 1 : 0,
              transition: "opacity 320ms ease",
              mixBlendMode: "screen",
            }} />

            {/* Top accent rule */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px", zIndex: 2,
              background: `linear-gradient(90deg, transparent 0%, rgba(${A}, 0.95) 38%, rgba(${A}, 0.28) 100%)`,
            }} />

            <div style={{
              position: "relative", zIndex: 3,
              padding: "clamp(20px, 2.4vw, 30px)",
              height: "100%",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                  <span style={{
                    fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.36em",
                    color: `rgba(${A}, 0.9)`, fontFamily: "Outfit, sans-serif",
                  }}>
                    {page.eyebrow}
                  </span>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    border: `1px solid rgba(${A}, ${spot.on ? 0.55 : 0.3})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `rgba(${A}, ${spot.on ? 0.16 : 0.08})`,
                    transition: "all 300ms ease",
                  }}>
                    <Icon style={{ width: "15px", height: "15px", color: `rgba(${A}, 0.95)` }} strokeWidth={1.5} />
                  </div>
                </div>

                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(22px, 2.6vw, 32px)",
                  color: "#F5F1E6", lineHeight: 1.05, marginBottom: "12px", fontWeight: 700,
                }}>
                  {page.title}
                </h3>

                {/* Short rule under the title — gives the type a spine */}
                <div style={{
                  height: "1px", width: spot.on ? "56px" : "32px",
                  background: `rgba(${A}, 0.55)`, marginBottom: "12px",
                  transition: "width 320ms cubic-bezier(0.23,1,0.32,1)",
                }} />

                <p style={{
                  fontSize: "13px", color: "rgba(245,241,230,0.6)", lineHeight: 1.55,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {page.description}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3em",
                  color: `rgba(${A}, ${spot.on ? 1 : 0.7})`, fontFamily: "Outfit, sans-serif",
                  transition: "color 300ms ease",
                }}>
                  Enter
                  <ArrowUpRight style={{
                    width: "12px", height: "12px",
                    transform: spot.on ? "translate(2px,-2px)" : "none",
                    transition: "transform 300ms ease",
                  }} />
                </span>

                {/* Flip is now its own control, so clicking the card navigates */}
                <button
                  type="button"
                  onClick={toggleFlip}
                  aria-label={`Preview what's inside ${page.title}`}
                  style={{
                    fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.28em",
                    color: "rgba(245,241,230,0.4)", fontFamily: "Outfit, sans-serif",
                    background: "transparent", border: `1px solid rgba(${A},0.25)`,
                    borderRadius: "999px", padding: "5px 11px", cursor: "pointer",
                    transition: "all 260ms ease", whiteSpace: "nowrap",
                  }}
                  data-testid={`pages-flip-toggle-${page.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  Tiers
                </button>
              </div>
            </div>
          </Link>

          {/* ── BACK ── */}
          <div
            style={{
              ...faceBase,
              transform: "rotateY(180deg)",
              border: `1px solid rgba(${A}, 0.34)`,
              boxShadow: `0 4px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(${A}, 0.2)`,
              background: "linear-gradient(160deg, rgba(10,15,26,0.98) 0%, rgba(7,11,20,1) 100%)",
            }}
          >
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse 80% 50% at 20% 90%, rgba(${A}, 0.12) 0%, transparent 62%)`,
            }} />
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: `linear-gradient(90deg, rgba(${A}, 0.95) 0%, rgba(${A}, 0.15) 100%)`,
            }} />

            <div style={{
              position: "relative", zIndex: 1,
              padding: "clamp(20px, 2.4vw, 30px)",
              height: "100%",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{
                    fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.36em",
                    color: `rgba(${A}, 0.9)`, fontFamily: "Outfit, sans-serif",
                  }}>
                    {page.title}
                  </span>
                  <button
                    type="button"
                    onClick={toggleFlip}
                    aria-label={`Close preview for ${page.title}`}
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      color: `rgba(${A}, 0.75)`, display: "flex", padding: "2px",
                    }}
                    data-testid={`pages-flip-close-${page.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <X style={{ width: "14px", height: "14px" }} strokeWidth={1.6} />
                  </button>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "11px" }}>
                  {page.tiers.map((t, i) => (
                    <li key={i} style={{ borderLeft: `2px solid rgba(${A}, 0.45)`, paddingLeft: "12px" }}>
                      <div style={{
                        fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.32em",
                        color: `rgba(${A}, 0.85)`, fontFamily: "Outfit, sans-serif", marginBottom: "3px",
                      }}>
                        {t.label}
                      </div>
                      <div style={{
                        fontSize: "12.5px", color: "rgba(245,241,230,0.64)", lineHeight: 1.45, fontFamily: "Outfit, sans-serif",
                      }}>
                        {t.body}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={page.to}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.32em",
                  color: `rgba(${A}, 1)`, textDecoration: "none",
                  borderBottom: `1px solid rgba(${A}, 0.45)`,
                  paddingBottom: "3px", width: "fit-content", fontFamily: "Outfit, sans-serif",
                }}
                data-testid={`pages-enter-${page.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                Enter {page.title}
                <ArrowUpRight style={{ width: "11px", height: "11px" }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PagesGrid = () => (
  <section id="pages" className="relative py-28 md:py-36 px-6 md:px-10 overflow-hidden" data-testid="pages-section">
    {/* Same lattice as the hero, but standing on its own over the navy
        rather than blending into video light. */}
    <InteractiveGrid variant="section" opacity={0.4} cellSize={52} />

    <div className="relative z-10 max-w-[1360px] mx-auto">
      <div className="reveal mb-16 md:mb-20 flex items-baseline justify-between flex-wrap gap-6">
        <div>
          <div className="eyebrow mb-4">Accountability Is Infrastructure</div>
          <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
            Nine wings of one<br />
            <span className="italic text-gold">public record.</span>
          </h2>
        </div>
        <p className="font-serif-h italic text-lg md:text-xl text-ivory-dim max-w-md">
          Every institution that operates in public accepted a standard.
          Each card is a door into how well they are keeping it.
        </p>
      </div>

      {/* Three rows of three — the 3x3 reads as a deliberate grid of nine
          wings rather than a reflowing list. */}
      <div className="pages-grid-3x3">
        {PAGES.map((p, i) => (
          <PremiumCard key={p.to} page={p} idx={i} />
        ))}
      </div>

      <style>{`
        .pages-grid-3x3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(14px, 1.6vw, 22px);
        }
        @media (max-width: 900px) {
          .pages-grid-3x3 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .pages-grid-3x3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  </section>
);
