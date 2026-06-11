import React from "react";
import { Link } from "react-router-dom";
import { Gavel, Eye, Shield, Compass, Activity, FlaskConical, Users, Info, ArrowUpRight } from "lucide-react";

export const PAGES = [
  {
    to: "/judiciary",
    title: "The Judiciary",
    eyebrow: "Pillar I",
    icon: Gavel,
    color: "#C8A97E",
    description: "Every active, sitting judge in Oregon — 211 across 36 counties.",
    tiers: [
      { label: "Tier I", body: "Name, county, term, bias score." },
      { label: "Tier II", body: "Prison usage, appellate overturns, sentencing trends, counsel disparity." },
      { label: "Tier III", body: "Full deep dive with 3D visualizations and peer comparison." },
    ],
  },
  {
    to: "/watchtower",
    title: "The Watchtower",
    eyebrow: "Pillar II",
    icon: Eye,
    color: "#D9BE93",
    description: "Prosecutors — by office, then by individual DA / DDA.",
    tiers: [
      { label: "Tier I", body: "Office, position, caseload, charging tendencies." },
      { label: "Tier II", body: "Plea ratios, dismissal patterns, charge enhancements." },
      { label: "Tier III", body: "Disparity indicators by demographic and county peer set." },
    ],
  },
  {
    to: "/law-enforcement",
    title: "Law Enforcement",
    eyebrow: "Pillar III",
    icon: Shield,
    color: "#5B7B9A",
    description: "Every officer in Oregon — searchable by agency.",
    tiers: [
      { label: "Tier I", body: "Agency, rank, sworn date, public certifications." },
      { label: "Tier II", body: "Stop outcomes, use-of-force events, sustained complaints." },
      { label: "Tier III", body: "STOP-data demographic breakdown, agency comparison." },
    ],
  },
  {
    to: "/community-corrections",
    title: "Community Corrections",
    eyebrow: "Pillar IV",
    icon: Compass,
    color: "#A8895F",
    description: "Every parole/probation officer in Oregon — by county.",
    tiers: [
      { label: "Tier I", body: "County, caseload size, supervision specialty." },
      { label: "Tier II", body: "Revocation rates, sanction patterns, completion rates." },
      { label: "Tier III", body: "Outcome disparity by demographic, peer comparison." },
    ],
  },
  {
    to: "/bias-beacon",
    title: "Bias Beacon",
    eyebrow: "The Dashboard",
    icon: Activity,
    color: "#C8A97E",
    description: "The engine. Oregon STOP data, conviction rates, sentencing disparity heat maps, and a follow-the-money budget view.",
    tiers: [
      { label: "Statewide", body: "County and regional disparity vs. national baselines." },
      { label: "Spatial", body: "Heat maps of hot spots; 3D charts of demographic outcomes." },
      { label: "Budget", body: "The money center of justice — and where it flows." },
    ],
  },
  {
    to: "/juris-lab",
    title: "Juris Lab",
    eyebrow: "Your Tools",
    icon: FlaskConical,
    color: "#D9BE93",
    description: "Upload your documents. Agents analyze, inform, draft, and surface comparable cases.",
    tiers: [
      { label: "Analyze", body: "Document intake + structured summary by AI agents." },
      { label: "Draft", body: "Letters, motions, and templates — co-written, never auto-filed." },
      { label: "Library", body: "Shared templates and caselaw the community curates." },
    ],
  },
  {
    to: "/community",
    title: "Community",
    eyebrow: "The Commons",
    icon: Users,
    color: "#5B7B9A",
    description: "Public comment, statewide meetings, agency contacts, ORS/OAR, complaint pathways, and groups.",
    tiers: [
      { label: "Voice", body: "Public comment portals and statewide meeting calendars." },
      { label: "Paths", body: "Step-by-step complaint pathways: judges, lawyers, LE, CPS." },
      { label: "Groups", body: "Spaces for those navigating the system to compare experience." },
    ],
  },
  {
    to: "/about",
    title: "About Us",
    eyebrow: "The Record-Keepers",
    icon: Info,
    color: "#A8895F",
    description: "The founders, the methodology, and why Oregon — for now.",
    tiers: [
      { label: "Founders", body: "Who built this and why." },
      { label: "Method", body: "How bias scores are calculated and verified." },
      { label: "Sources", body: "Every dataset, every refresh cadence, every gap." },
    ],
  },
];

const FlipCard = ({ page, idx }) => {
  const Icon = page.icon;

  return (
    <div
      className="flip-card group reveal h-[320px] md:h-[360px] [perspective:1400px]"
      style={{ transitionDelay: `${idx * 70}ms` }}
      data-testid={`pages-flip-card-${page.title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className="flip-card-inner relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
      >
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] card-3d-raised p-7 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10.5px] uppercase tracking-[0.36em] text-gold">
                {page.eyebrow}
              </span>
              <Icon className="w-4 h-4 text-steel" strokeWidth={1.25} />
            </div>
            <h3 className="font-display text-3xl md:text-4xl text-ivory leading-tight mb-4">
              {page.title}
            </h3>
            <p className="text-ivory-dim text-[14px] leading-relaxed pr-2">
              {page.description}
            </p>
          </div>
          <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.32em] text-secondary">
            
            <span className="w-8 h-px bg-[var(--apt-gold)] opacity-50" />
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] card-3d-raised card-3d-back p-7 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10.5px] uppercase tracking-[0.36em] text-gold">
                {page.title}
              </span>
              <Icon className="w-4 h-4 text-gold" strokeWidth={1.25} />
            </div>
            <ul className="space-y-3">
              {page.tiers.map((t, i) => (
                <li key={i} className="border-l border-[rgba(200,169,126,0.45)] pl-3">
                  <div className="text-[10px] uppercase tracking-[0.32em] text-gold mb-1">
                    {t.label}
                  </div>
                  <div className="text-ivory-dim text-[13.5px] leading-snug">{t.body}</div>
                </li>
              ))}
            </ul>
          </div>
          <Link
            to={page.to}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-gold border-b border-[var(--apt-gold)] pb-1 w-fit hover:gap-4 transition-all duration-400"
            data-testid={`pages-enter-${page.title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            Enter {page.title}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const PagesGrid = () => (
  <section
    id="pages"
    className="relative py-28 md:py-36 px-6 md:px-10"
    data-testid="pages-section"
  >
    <div className="relative max-w-[1360px] mx-auto">
      <div className="reveal mb-16 md:mb-20 flex items-baseline justify-between flex-wrap gap-6">
        <div>
          <div className="eyebrow mb-4">Accountability Is Real</div>
          <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
            Eight wings of one<br />
            <span className="italic text-gold">public record.</span>
          </h2>
        </div>
        <p className="font-serif-h italic text-lg md:text-xl text-ivory-dim max-w-md">
          Each card is a doorway. Behind each doorway are three levels of clarity —
          the same record, told at increasing depth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {PAGES.map((p, i) => (
          <FlipCard key={p.to} page={p} idx={i} />
        ))}
      </div>
    </div>
  </section>
);


