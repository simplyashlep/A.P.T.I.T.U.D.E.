import React, { useState } from "react";
import { TopNav } from "../components/aptitude/TopNav";
import { Footer } from "../components/aptitude/Footer";
import {
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileText,
  Landmark,
  Layers3,
  LifeBuoy,
  MoveRight,
  ShieldCheck,
  Smartphone,
  Target,
  Users,
  Wifi,
  Briefcase,
  BookOpen,
  Home,
} from "lucide-react";

// ─── Entry Points ──────────────────────────────────────────────────────────────
// Named for how people actually arrive — not financial jargon, but real conditions.
const ENTRY_POINTS = [
  {
    icon: Banknote,
    condition: "I don't have a bank account.",
    tier2: [
      "Second-chance checking accounts — banks and credit unions that accept prior ChexSystems history",
      "Prepaid debit cards with no credit check and FDIC-insured balance protection",
      "Interledger-compatible digital wallets that operate without a conventional account requirement",
    ],
    path: "banking-access",
  },
  {
    icon: CreditCard,
    condition: "My credit was damaged — some of it I'm still disputing.",
    tier2: [
      "Your right under FCRA to dispute inaccurate, incomplete, or unverifiable information directly with each CRA",
      "The furnisher's obligation to investigate — and what 'verified' actually means under the statute",
      "How to document a dispute trail and what to do when the CRA closes it without correction",
    ],
    path: "credit-dispute",
  },
  {
    icon: Landmark,
    condition: "I have court debt — fines, fees, or restitution I can't pay.",
    tier2: [
      "Oregon ability-to-pay hearings — ORS 161.675 requires courts to consider financial circumstances before enforcement",
      "Payment plan access and the agencies authorized to offer them",
      "How court financial obligations interact with credit reporting and what the collection timeline looks like",
    ],
    path: "court-debt",
  },
  {
    icon: Wifi,
    condition: "I lost internet access or can't afford it.",
    tier2: [
      "The FCC Affordable Connectivity Program and Oregon-specific low-income broadband subsidies",
      "What ISPs are legally required to offer and how to document a denial",
      "VOIP alternatives and community access points when home internet is unavailable",
    ],
    path: "digital-access",
  },
  {
    icon: ShieldCheck,
    condition: "I'm rebuilding after involvement with the justice system.",
    tier2: [
      "Oregon Ban the Box — what employers can and cannot ask, and when",
      "Clean slate and expungement eligibility under ORS 137.225",
      "Financial accounts, housing applications, and the disclosure landscape after a conviction",
    ],
    path: "reentry",
  },
  {
    icon: Target,
    condition: "I qualify for help but can't find it.",
    tier2: [
      "Why programs exist that people don't access — the search gap and how to close it",
      "Oregon 211 and the difference between a directory and a matched pathway",
      "How to identify whether a program's eligibility requirements actually match your documented situation",
    ],
    path: "connection-gap",
  },
  {
    icon: Home,
    condition: "I'm dealing with a housing crisis.",
    tier2: [
      "Rent Well Oregon — tenant education and landlord-ready certification",
      "Oregon eviction diversion resources and your rights under ORS Chapter 90",
      "How an eviction record affects credit reporting and what the dispute pathway looks like",
    ],
    path: "housing",
  },
  {
    icon: Briefcase,
    condition: "I need work — or I need better work.",
    tier2: [
      "WorkSource Oregon — free job placement, resume assistance, and skills training",
      "Oregon community college workforce programs with no-cost enrollment pathways",
      "How employment screening databases work and what you can challenge",
    ],
    path: "employment",
  },
];

// ─── Open Infrastructure Section ──────────────────────────────────────────────
const OPEN_PAYMENTS_POINTS = [
  {
    title: "Why your payment was declined",
    body: "Conventional payment rails — bank transfers, credit card networks, ACH — are built for people who already have accounts, credit histories, and stable addresses. When you don't, you're not rejected because the technology doesn't exist. You're rejected because the technology deployed at that institution wasn't designed for you.",
  },
  {
    title: "What open standards change",
    body: "The Interledger Protocol (ILP) is an open payment standard that allows money to move across financial systems the way data moves across the internet — without requiring a specific bank, a credit check, or a country. An ILP-compatible wallet can send and receive payments from any other ILP-compatible system. This is not a workaround. It is the infrastructure that should have been built from the start.",
  },
  {
    title: "Where it applies to you",
    body: "Court fee payment without a bank account. Emergency fund disbursement without an ACH-eligible account. Subsidy delivery without a routing number. These are not edge cases — they are the modal experience of the population public institutions are supposed to serve. Aptitude Advancement will identify, at specific pathway nodes in Oregon, exactly where ILP-compatible infrastructure reduces documented friction.",
  },
];

// ─── Partners (coming / seeking) ─────────────────────────────────────────────
const PARTNERS = [
  { name: "Rent Well Oregon", type: "Housing Stability", url: "https://www.cssoregon.org/rentwell", status: "active" },
  { name: "WorkSource Oregon", type: "Employment", url: "https://worksourceoregon.org", status: "active" },
  { name: "Oregon Law Center", type: "Legal Aid", url: "https://oregonlawcenter.org", status: "active" },
  { name: "OCDLA", type: "Criminal Defense Consultation", url: "https://ocdla.org", status: "seeking" },
  { name: "Oregon Community College Network", type: "Education & Training", url: "https://www.oregoncca.org", status: "seeking" },
  { name: "211info Oregon", type: "Resource Navigation", url: "https://211info.org", status: "active" },
  { name: "Interledger Foundation", type: "Open Payment Infrastructure", url: "https://interledger.org", status: "active" },
];

// ─── Barrier Lenses ───────────────────────────────────────────────────────────
const BARRIERS = [
  { title: "Documentation and identification", body: "No ID, unstable records, mismatched information, or missing proofs can block access before a user even starts — at the bank, the housing application, the job portal, and the courthouse." },
  { title: "Device and connectivity limits", body: "Low bandwidth, shared devices, broken phones, and intermittent internet make digital finance harder to use. Programs that require online enrollment assume access that doesn't exist." },
  { title: "Fee burden and debt cycling", body: "Small fees compound into a larger barrier when timing, holds, and recurring obligations overlap. A court fine becomes a collection account becomes a credit denial becomes a housing rejection." },
  { title: "Low trust and prior denial", body: "Repeated rejection from institutions that were supposed to help creates a rational expectation of failure. The barrier isn't always the rule — sometimes it's having been taught that the rule won't apply to you." },
  { title: "Justice-related barriers", body: "Court fines, supervision conditions, garnishment, prior system involvement, and employment screening databases can shape what options are available long after the underlying case has closed." },
  { title: "Housing and employment instability", body: "When housing or work is unstable, even a clear pathway becomes difficult to execute. Aptitude Advancement accounts for this — every resource is evaluated against whether it can actually be reached from where you are." },
];

// ─── Components ───────────────────────────────────────────────────────────────

const EntryCard = ({ entry, idx }) => {
  const Icon = entry.icon;
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`card-3d-raised transition-all duration-500 cursor-pointer ${open ? "ring-1 ring-[rgba(200,169,126,0.4)]" : ""}`}
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      data-testid={`entry-card-${idx}`}
      style={{ transitionDelay: `${idx * 55}ms` }}
    >
      <div className="p-7 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full border border-[rgba(200,169,126,0.3)] flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-gold" strokeWidth={1.25} />
            </div>
            <h3 className="font-display text-xl md:text-2xl text-ivory leading-snug">{entry.condition}</h3>
          </div>
          <MoveRight
            className={`w-4 h-4 text-gold flex-shrink-0 mt-1 transition-transform duration-400 ${open ? "rotate-90" : ""}`}
            strokeWidth={1.5}
          />
        </div>

        {open && (
          <div className="mt-2 border-t border-[rgba(245,241,230,0.07)] pt-5 space-y-3">
            {entry.tier2.map((item, i) => (
              <div key={i} className="flex gap-3 text-[14px] text-ivory-dim leading-relaxed">
                <span className="w-1 h-1 rounded-full bg-gold/60 mt-[0.6em] flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
            <div className="pt-3">
              <span className="text-[10.5px] uppercase tracking-[0.32em] text-secondary">
                Full pathway · coming in fellowship build
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BarrierCard = ({ barrier, idx }) => (
  <div
    className="card-3d-raised p-7 reveal"
    style={{ transitionDelay: `${idx * 60}ms` }}
    data-testid={`barrier-card-${idx}`}
  >
    <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-3">Barrier {String(idx + 1).padStart(2, "0")}</div>
    <h3 className="font-display text-xl text-ivory mb-3 leading-snug">{barrier.title}</h3>
    <p className="text-ivory-dim text-[14px] leading-relaxed">{barrier.body}</p>
  </div>
);

const PartnerRow = ({ partner }) => (
  <div className="flex items-center justify-between py-4 border-b border-[rgba(245,241,230,0.07)] last:border-0" data-testid={`partner-${partner.name.toLowerCase().replace(/\s+/g, "-")}`}>
    <div>
      <div className="font-display text-ivory text-lg">{partner.name}</div>
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-secondary mt-0.5">{partner.type}</div>
    </div>
    <div className="flex items-center gap-4">
      <span className={`text-[9.5px] uppercase tracking-[0.32em] px-2.5 py-1 rounded-full border ${
        partner.status === "active"
          ? "border-[rgba(124,168,139,0.5)] text-[#7CA88B]"
          : "border-[rgba(200,169,126,0.3)] text-gold/60"
      }`}>
        {partner.status === "active" ? "Active" : "Seeking Partnership"}
      </span>
      {partner.status === "active" && (
        <a
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold/60 hover:text-gold transition-colors"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Visit ${partner.name}`}
        >
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
        </a>
      )}
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AptitudeAdvancement() {
  return (
    <div className="relative min-h-screen pb-24" data-testid="aptitude-advancement-page">
      <TopNav />

      {/* Header */}
      <header className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <Layers3 className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] text-gold" strokeWidth={0.5} />
        </div>
        <div className="relative max-w-[1360px] mx-auto">
          <div className="eyebrow mb-5">Aptitude Advancement</div>
          <h1 className="font-display text-5xl md:text-7xl text-ivory leading-[1.02] max-w-4xl">
            Where the gap
            <span className="italic text-gold"> closes.</span>
          </h1>
          <p className="mt-7 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed max-w-3xl">
            The resources exist. The subsidies exist. The pathways exist. What hasn't existed is a layer that connects your specific situation — your actual barriers, your documented history, your real starting point — to the tools and protections that were built for exactly where you are.
          </p>
          <p className="mt-5 text-[15px] md:text-[16px] text-ivory-dim leading-relaxed max-w-3xl">
            This is not a resource directory. It is a connection engine — built to close the distance between what's available and who can reach it.
          </p>

          {/* Quick nav */}
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { label: "Find My Entry Point", href: "#entry-points" },
              { label: "Open Payment Access", href: "#open-infrastructure" },
              { label: "Understand My Barriers", href: "#barriers" },
              { label: "Partners & Resources", href: "#partners" },
              { label: "Find Work or Housing", href: "#work-housing" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(200,169,126,0.35)] text-[11px] uppercase tracking-[0.32em] text-gold hover:bg-[rgba(200,169,126,0.08)] transition-colors"
              >
                {action.label}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1360px] mx-auto px-6 md:px-10 space-y-28 md:space-y-36">

        {/* ── Entry Points ── */}
        <section id="entry-points" data-testid="entry-points-section">
          <div className="mb-12 md:mb-16">
            <div className="eyebrow mb-4">Start Here</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
              Name where you are.
              <span className="italic text-gold"> We'll take it from there.</span>
            </h2>
            <p className="mt-6 font-serif-h italic text-lg text-ivory-dim max-w-2xl leading-relaxed">
              Select the condition that most closely matches your situation. Each one opens to a second layer of what exists, what you're owed, and what the next step looks like.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {ENTRY_POINTS.map((entry, i) => (
              <EntryCard key={entry.path} entry={entry} idx={i} />
            ))}
          </div>
        </section>

        {/* ── Open Infrastructure ── */}
        <section id="open-infrastructure" data-testid="open-infrastructure-section">
          <div className="mb-12 md:mb-16">
            <div className="eyebrow mb-4">Open Payment Standards</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
              The infrastructure
              <span className="italic text-gold"> that should have been yours.</span>
            </h2>
            <p className="mt-6 font-serif-h italic text-lg text-ivory-dim max-w-2xl leading-relaxed">
              Open payment technology — built on the Interledger Protocol — makes it possible to send, receive, and access money across financial systems without a bank account, a credit check, or a country requirement. This is not experimental. It exists. Here is what it means for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {OPEN_PAYMENTS_POINTS.map((point, i) => (
              <div
                key={i}
                className="card-3d-raised p-7 md:p-8 reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
                data-testid={`open-payments-card-${i}`}
              >
                <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-2xl text-ivory mb-4 leading-snug">{point.title}</h3>
                <p className="text-ivory-dim text-[14px] leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>

          {/* ILF connection callout */}
          <div className="border border-[rgba(200,169,126,0.25)] bg-[rgba(200,169,126,0.04)] rounded-sm p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-7">
            <div className="flex-1">
              <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-3">Interledger Foundation</div>
              <h3 className="font-display text-2xl md:text-3xl text-ivory mb-3">The open payment ecosystem.</h3>
              <p className="text-ivory-dim text-[14px] leading-relaxed max-w-2xl">
                The Interledger Foundation funds researchers, developers, and community leaders working to advance digital financial inclusion through open payment standards. Aptitude Advancement is built in partnership with this mission — using their protocols to identify exactly where payment infrastructure gaps are producing the exclusion that our data documents.
              </p>
            </div>
            <a
              href="https://interledger.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.32em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:bg-[var(--apt-gold-soft)] transition-all duration-300"
              data-testid="ilf-link"
            >
              Interledger.org
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ── Work and Housing Funnel ── */}
        <section id="work-housing" data-testid="work-housing-section">
          <div className="mb-12 md:mb-16">
            <div className="eyebrow mb-4">Work · Housing · Education</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
              The direct funnel.
              <span className="italic text-gold"> Not a list — a path.</span>
            </h2>
            <p className="mt-6 font-serif-h italic text-lg text-ivory-dim max-w-2xl leading-relaxed">
              These are the partner organizations that anchor Aptitude Advancement's work and housing pipeline. Each one has agreed — or we are actively seeking agreement — to serve as a real referral destination, not a directory entry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {[
              {
                icon: Home,
                title: "Housing",
                body: "Rent Well Oregon tenant certification, ORS Chapter 90 rights documentation, and eviction record dispute pathways.",
                link: "https://www.cssoregon.org/rentwell",
                label: "Rent Well Oregon",
              },
              {
                icon: Briefcase,
                title: "Employment",
                body: "WorkSource Oregon job placement, resume assistance, skills training, and Ban the Box guidance for justice-involved applicants.",
                link: "https://worksourceoregon.org",
                label: "WorkSource Oregon",
              },
              {
                icon: BookOpen,
                title: "Education & Training",
                body: "Oregon community college workforce programs with no-cost enrollment pathways and credential-to-career pipelines.",
                link: "https://www.oregoncca.org",
                label: "Oregon CCA",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="card-3d-raised p-7 md:p-8 flex flex-col justify-between reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div>
                    <Icon className="w-5 h-5 text-gold mb-5" strokeWidth={1.25} />
                    <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-3">{item.title}</div>
                    <p className="text-ivory-dim text-[14px] leading-relaxed">{item.body}</p>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-gold border-b border-[var(--apt-gold)] pb-1 w-fit hover:gap-4 transition-all duration-400"
                  >
                    {item.label}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Resume / job board placeholder */}
          <div className="border border-dashed border-[rgba(200,169,126,0.2)] rounded-sm p-8 md:p-10 text-center">
            <FileText className="w-6 h-6 text-gold/60 mx-auto mb-4" strokeWidth={1.25} />
            <h3 className="font-display text-2xl text-ivory mb-3">Resume Assistance · Job Board</h3>
            <p className="text-ivory-dim text-[14px] max-w-xl mx-auto leading-relaxed">
              AI-assisted resume review, plain-language cover letter drafting, and a curated job board filtering for second-chance and justice-involved-friendly employers in Oregon. Activating with the fellowship build.
            </p>
            <div className="mt-5 text-[10.5px] uppercase tracking-[0.32em] text-secondary">Coming in fellowship period</div>
          </div>
        </section>

        {/* ── Barriers ── */}
        <section id="barriers" data-testid="barriers-section">
          <div className="mb-12 md:mb-16">
            <div className="eyebrow mb-4">What's Actually in the Way</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
              The barriers
              <span className="italic text-gold"> named plainly.</span>
            </h2>
            <p className="mt-6 font-serif-h italic text-lg text-ivory-dim max-w-2xl leading-relaxed">
              Financial difficulty is not a character trait. It is produced by overlapping, documented barriers — most of them institutional, most of them resolvable when they are visible. Here they are.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BARRIERS.map((b, i) => (
              <BarrierCard key={i} barrier={b} idx={i} />
            ))}
          </div>
        </section>

        {/* ── Partners ── */}
        <section id="partners" data-testid="partners-section">
          <div className="mb-12 md:mb-16">
            <div className="eyebrow mb-4">Partners & Resources</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
              We back up
              <span className="italic text-gold"> what we are.</span>
            </h2>
            <p className="mt-6 font-serif-h italic text-lg text-ivory-dim max-w-2xl leading-relaxed">
              Every organization listed here is a real referral destination — active partners or organizations we are actively seeking partnerships with. Nothing is a placeholder. If it's here, it connects to something.
            </p>
          </div>
          <div className="card-3d-raised px-7 md:px-10 py-2">
            {PARTNERS.map((partner) => (
              <PartnerRow key={partner.name} partner={partner} />
            ))}
          </div>

          {/* Legal consultation note */}
          <div className="mt-8 border border-[rgba(200,169,126,0.15)] bg-[rgba(200,169,126,0.03)] rounded-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <LifeBuoy className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.25} />
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-2">Legal Consultation</div>
                <p className="text-ivory-dim text-[14px] leading-relaxed">
                  Aptitude Advancement is building a limited-purpose legal consultation network — attorneys and paralegals who recognize the systemic nature of the problems this platform documents and are willing to offer bounded consultation for housing, family court, and consumer protection matters. This is not full representation. It is accountability in practice. If you are an attorney or advocate who wants to be part of this, contact us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Aptitudinal Alignment callout ── */}
        <section data-testid="alignment-callout">
          <div className="border border-[rgba(200,169,126,0.2)] bg-[rgba(10,15,26,0.6)] rounded-sm p-8 md:p-12">
            <div className="max-w-3xl">
              <div className="eyebrow mb-5">Aptitudinal Alignment</div>
              <h2 className="font-display text-3xl md:text-5xl text-ivory leading-[1.1] mb-6">
                The institutions in your life
                <span className="italic text-gold"> have a score now.</span>
              </h2>
              <p className="text-ivory-dim text-[15px] leading-relaxed mb-8">
                Aptitudinal Alignment measures how closely a public-facing institution's documented behavior matches the obligations it accepted when it became public. It is not a grade assigned by this platform. It is the distance between what an institution promised and what the record shows. Every court, every credit bureau, every ISP, every housing authority — if it operates in the public, it is measurable against its own stated mandate.
              </p>
              <p className="text-ivory-dim text-[15px] leading-relaxed mb-8">
                This is what FICO does to individuals. We are doing it to institutions. The direction of accountability has been corrected.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/bias-beacon"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.32em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:bg-[var(--apt-gold-soft)] transition-all duration-300"
                >
                  See the Bias Beacon
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/judiciary"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.32em] text-gold border border-[rgba(200,169,126,0.4)] hover:bg-[rgba(200,169,126,0.08)] transition-all duration-300"
                >
                  Judiciary Index
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <section data-testid="disclaimer-section">
          <div className="text-center max-w-2xl mx-auto">
            <div className="gold-rule mb-10 mx-auto max-w-xs" />
            <p className="text-[13px] text-secondary leading-relaxed font-serif-h italic">
              Aptitude Advancement is a connection layer — not legal advice, not financial advice, and not a substitute for a licensed counselor, attorney, or financial professional. Every resource listed has been evaluated for relevance; none has paid for placement. When we cannot verify a resource's eligibility requirements or current status, we say so.
            </p>
          </div>
        </section>

      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
