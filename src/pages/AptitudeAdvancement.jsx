import React, { useState, useEffect } from "react";
import Particles from "../components/ui/Particles";
import { TopNav } from "../components/aptitude/TopNav";
import { Footer } from "../components/aptitude/Footer";
import {
  ArrowUpRight, Banknote, BookOpen, Briefcase,
  CheckCircle2, ExternalLink, FileText, Home,
  Landmark, Layers3, LifeBuoy, MoveRight,
  ShieldCheck, Smartphone, Target, TrendingUp,
  Users, Wifi, Zap, Scale, Info
} from "lucide-react";

// ─── Aptitudinal Alignment Definition ─────────────────────────────────────────
// This appears first — people need to know what they're looking at

// ─── Know Your Ground — Agency Authority Facts ────────────────────────────────
const AGENCY_FACTS = [
  {
    agency: "Oregon DOC",
    full: "Department of Corrections",
    statute: "ORS Chapter 423",
    authorized: "Operate correctional facilities, supervise people on parole and probation, administer community corrections programs",
    notAuthorized: "Impose supervision conditions not authorized by statute or the sentencing court — any condition beyond what ORS 144.102 and 144.346 permit is challengeable",
    funFact: "A parole officer cannot add supervision conditions that weren't ordered by the court or authorized by statute. If they did, that condition has no legal force.",
  },
  {
    agency: "Oregon DHS",
    full: "Department of Human Services",
    statute: "ORS Chapter 409",
    authorized: "Administer public assistance, child welfare, and Medicaid programs within the rules adopted under ORS 183",
    notAuthorized: "Deny benefits without providing written notice of the specific reason and your right to a hearing — ORS 183.415 requires it",
    funFact: "Every DHS denial is subject to an administrative hearing. You have 90 days to request one. The agency must prove its decision was authorized by the rules.",
  },
  {
    agency: "Oregon DMV",
    full: "Driver and Motor Vehicle Services",
    statute: "ORS Chapter 807",
    authorized: "Issue, suspend, and revoke licenses strictly according to the grounds enumerated in ORS 809.410",
    notAuthorized: "Suspend a license for reasons not listed in ORS 809.410 — the list is exhaustive, not illustrative",
    funFact: "DMV suspension authority is a closed list. If the reason for your suspension isn't in ORS 809.410, the suspension may be invalid.",
  },
  {
    agency: "Oregon Housing Authority",
    full: "Oregon Housing and Community Services",
    statute: "ORS Chapter 456",
    authorized: "Administer housing assistance programs under the specific terms of ORS 456 and applicable federal regulations",
    notAuthorized: "Apply eligibility criteria that aren't in the governing statute or program rules — and cannot deny without written notice and appeal rights",
    funFact: "Federally funded housing programs must follow HUD's due process requirements regardless of what a local administrator tells you.",
  },
  {
    agency: "Credit Bureaus",
    full: "Consumer Reporting Agencies (Equifax, Experian, TransUnion)",
    statute: "15 U.S.C. § 1681 (FCRA)",
    authorized: "Report accurate, verifiable consumer credit information for permissible purposes — and must reinvestigate disputes within 30 days",
    notAuthorized: "Report information that cannot be verified upon dispute — if a furnisher cannot verify the data, the CRA must delete it",
    funFact: "When you dispute an item, the CRA cannot simply ask the furnisher if it's correct — they must conduct a 'reasonable reinvestigation.' A rubber-stamp response from the furnisher doesn't satisfy that standard.",
  },
  {
    agency: "Oregon Courts",
    full: "Oregon Circuit Courts",
    statute: "ORS Chapter 3 · Oregon Constitution Art. VII",
    authorized: "Exercise jurisdiction granted by the Oregon Constitution and ORS — courts are also creatures of the law they enforce",
    notAuthorized: "Act outside subject matter jurisdiction — a ruling made without jurisdiction is void, not merely voidable",
    funFact: "Even a judge cannot rule on a matter the court has no jurisdiction to hear. Jurisdiction isn't a technicality — it's the foundation of every order.",
  },
];

// ─── Entry Points ──────────────────────────────────────────────────────────────
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
    icon: CheckCircle2,
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

const OPEN_PAYMENTS_POINTS = [
  {
    title: "Why your payment was declined",
    body: "Conventional payment rails are built for people who already have accounts, credit histories, and stable addresses. You're not rejected because the technology doesn't exist — you're rejected because the technology deployed at that institution wasn't designed for you.",
  },
  {
    title: "What open standards change",
    body: "The Interledger Protocol (ILP) is an open payment standard that allows money to move across financial systems the way data moves across the internet — without requiring a specific bank, a credit check, or a country. An ILP-compatible wallet can send and receive payments from any other ILP-compatible system.",
  },
  {
    title: "Where it applies to you",
    body: "Court fee payment without a bank account. Emergency fund disbursement without an ACH account. Subsidy delivery without a routing number. These are not edge cases — they are the modal experience of the population public institutions are supposed to serve.",
  },
];

const PARTNERS = [
  { name: "Rent Well Oregon", type: "Housing Stability", url: "https://www.cssoregon.org/rentwell", status: "active" },
  { name: "WorkSource Oregon", type: "Employment", url: "https://worksourceoregon.org", status: "active" },
  { name: "Oregon Law Center", type: "Legal Aid", url: "https://oregonlawcenter.org", status: "active" },
  { name: "211info Oregon", type: "Resource Navigation", url: "https://211info.org", status: "active" },
  { name: "Interledger Foundation", type: "Open Payment Infrastructure", url: "https://interledger.org", status: "active" },
  { name: "OCDLA", type: "Criminal Defense Consultation", url: "https://ocdla.org", status: "seeking" },
  { name: "Oregon Community College Network", type: "Education and Training", url: "https://www.oregoncca.org", status: "seeking" },
];

// ─── Components ───────────────────────────────────────────────────────────────

const AgencyCard = ({ fact, idx }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`card-3d-raised transition-all duration-400 cursor-pointer ${open ? "ring-1 ring-[rgba(200,169,126,0.4)]" : ""}`}
      onClick={() => setOpen(v => !v)}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      data-testid={`agency-card-${idx}`}
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.36em] text-gold mb-1">{fact.statute}</div>
            <h3 className="font-display text-xl md:text-2xl text-ivory leading-tight">{fact.agency}</h3>
            <div className="text-[11.5px] text-secondary mt-0.5">{fact.full}</div>
          </div>
          <MoveRight
            className={`w-4 h-4 text-gold flex-shrink-0 mt-1.5 transition-transform duration-400 ${open ? "rotate-90" : ""}`}
            strokeWidth={1.5}
          />
        </div>

        {/* Fun fact — always visible, this is the hook */}
        <div className="flex gap-3 bg-[rgba(200,169,126,0.06)] border border-[rgba(200,169,126,0.15)] rounded-sm px-4 py-3 mt-4">
          <Zap className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-[13px] text-ivory-dim leading-relaxed">{fact.funFact}</p>
        </div>

        {open && (
          <div className="mt-5 border-t border-[rgba(245,241,230,0.07)] pt-5 space-y-4">
            <div>
              <div className="text-[9.5px] uppercase tracking-[0.32em] text-gold mb-2">Authorized to do</div>
              <p className="text-[13.5px] text-ivory-dim leading-relaxed">{fact.authorized}</p>
            </div>
            <div>
              <div className="text-[9.5px] uppercase tracking-[0.32em] text-[#C4855A] mb-2">Not authorized — and challengeable</div>
              <p className="text-[13.5px] text-ivory-dim leading-relaxed">{fact.notAuthorized}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EntryCard = ({ entry, idx }) => {
  const Icon = entry.icon;
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`card-3d-raised transition-all duration-400 cursor-pointer ${open ? "ring-1 ring-[rgba(200,169,126,0.4)]" : ""}`}
      onClick={() => setOpen(v => !v)}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      data-testid={`entry-card-${idx}`}
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[rgba(200,169,126,0.3)] flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-gold" strokeWidth={1.25} />
            </div>
            <h3 className="font-display text-xl text-ivory leading-snug">{entry.condition}</h3>
          </div>
          <MoveRight
            className={`w-4 h-4 text-gold flex-shrink-0 mt-1 transition-transform duration-400 ${open ? "rotate-90" : ""}`}
            strokeWidth={1.5}
          />
        </div>
        {open && (
          <div className="border-t border-[rgba(245,241,230,0.07)] pt-4 space-y-2.5">
            {entry.tier2.map((item, i) => (
              <div key={i} className="flex gap-3 text-[13.5px] text-ivory-dim leading-relaxed">
                <span className="w-1 h-1 rounded-full bg-gold/60 mt-[0.6em] flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-[0.32em] text-secondary">
                Full pathway · coming in fellowship build
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AptitudeAdvancement() {
  return (
    <div className="relative min-h-screen pb-24" data-testid="aptitude-advancement-page">

      {/* ── Particles — layered over background, behind all content ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <Particles
          particleCount={860}
          particleSpread={17}
          speed={0.04}
          particleColors={["#00032a", "#e1b584", "#061d73"]}
          moveParticlesOnHover={false}
          particleHoverFactor={1}
          alphaParticles={false}
          particleBaseSize={100}
          sizeRandomness={1}
          cameraDistance={20}
          disableRotation={false}
        />
      </div>

      <TopNav />

      {/* Header */}
      <header className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <Layers3 className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] text-gold" strokeWidth={0.5} />
        </div>
        <div className="relative max-w-[1360px] mx-auto">
          <div className="eyebrow mb-5">Aptitude Advancement</div>
          <h1 className="font-display text-5xl md:text-7xl text-ivory leading-[1.02] max-w-4xl">
            Where the gap
            <span className="italic text-gold"> closes.</span>
          </h1>
          <p className="mt-7 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed max-w-3xl">
            The resources exist. The subsidies exist. The rights exist. What hasn't existed is a layer that connects your specific situation to the tools and protections that were built for exactly where you are.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { label: "Know Your Ground", href: "#know-your-ground" },
              { label: "What Is Aptitudinal Alignment?", href: "#alignment-definition" },
              { label: "Find My Entry Point", href: "#entry-points" },
              { label: "Open Payment Access", href: "#open-infrastructure" },
              { label: "Work and Housing", href: "#work-housing" },
            ].map((a) => (
              <a key={a.label} href={a.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(200,169,126,0.35)] text-[11px] uppercase tracking-[0.32em] text-gold hover:bg-[rgba(200,169,126,0.08)] transition-colors"
              >
                {a.label} <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1360px] mx-auto px-6 md:px-10 space-y-28 md:space-y-36">

        {/* ── KNOW YOUR GROUND ── */}
        <section id="know-your-ground" data-testid="know-your-ground-section">
          <div className="mb-10 md:mb-14">
            <div className="eyebrow mb-4">Know Your Ground</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-4xl">
              Every agency is a
              <span className="italic text-gold"> creature of statute.</span>
            </h2>
            <div className="mt-7 max-w-3xl space-y-4">
              <p className="text-[16px] md:text-[17px] text-ivory-dim leading-relaxed">
                Every public agency — the DMV, DHS, DOC, housing authorities, parole boards, even courts — exists because a legislature created it. And it can <em className="text-ivory not-italic">only do what that legislation authorized it to do.</em>
              </p>
              <p className="text-[16px] md:text-[17px] text-ivory-dim leading-relaxed">
                When an agency acts outside its statutory authority, that action is called <strong className="text-gold font-normal italic">ultra vires</strong> — beyond its power — and it is legally void. The person standing in front of that agency has more standing than they know, because the agency's authority has a ceiling that is publicly documented.
              </p>
              <p className="text-[16px] md:text-[17px] text-ivory-dim leading-relaxed">
                You may feel overwhelmed. You may feel powerless. But you are standing on ground that the law defined — and the law that limits them is the same law that protects you. Before you navigate any system, know what that system is actually authorized to do.
              </p>
            </div>

            {/* Pull stat */}
            <div className="mt-10 inline-flex items-start gap-4 border border-[rgba(200,169,126,0.2)] bg-[rgba(200,169,126,0.04)] rounded-sm px-6 py-5 max-w-2xl">
              <Scale className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.25} />
              <p className="text-[14px] text-ivory-dim leading-relaxed">
                <span className="text-ivory">The authority of every public agency is a matter of public record.</span> It is written in Oregon Revised Statutes, accessible at oregonlegislature.gov, and Aptitude will surface it for you — by agency, by action, by the specific limit on their power.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {AGENCY_FACTS.map((fact, i) => (
              <AgencyCard key={fact.agency} fact={fact} idx={i} />
            ))}
          </div>
        </section>

        {/* ── APTITUDINAL ALIGNMENT DEFINITION ── */}
        <section id="alignment-definition" data-testid="alignment-definition-section">
          <div className="border border-[rgba(200,169,126,0.2)] bg-[rgba(200,169,126,0.03)] rounded-sm p-8 md:p-12 max-w-[1100px]">
            <div className="eyebrow mb-6">What Is Aptitudinal Alignment?</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl mb-8">
              Not a score.
              <span className="italic text-gold"> A mirror.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-6 max-w-4xl">
              <p className="text-[16px] md:text-[17px] text-ivory-dim leading-relaxed">
                <strong className="text-ivory font-normal">Aptitudinal Alignment</strong> is a measurement of how closely a public-facing institution's documented behavior matches the obligations it accepted when it became public. It is not an editorial opinion. It is not a grade assigned by this platform.
              </p>
              <p className="text-[16px] md:text-[17px] text-ivory-dim leading-relaxed">
                It is the distance between what an institution promised and what the record shows — calculated from public data, measured on documented dimensions, and published with full methodology so anyone can challenge the finding.
              </p>
              <p className="text-[16px] md:text-[17px] text-ivory-dim leading-relaxed">
                Every court, every credit bureau, every housing authority, every ISP that operates in the public sphere accepted a standard. Aptitudinal Alignment measures how well they are keeping it.
              </p>
              <p className="text-[16px] md:text-[17px] text-ivory-dim leading-relaxed">
                FICO scores individuals. Dun and Bradstreet scores businesses. <span className="text-ivory">Aptitudinal Alignment scores institutions</span> — the ones that have been scoring, denying, and gatekeeping you for decades. The direction of accountability has been corrected.
              </p>
            </div>

            {/* Four dimensions */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { d: "Correctability", b: "How accessible is the dispute or correction pathway for an ordinary person?" },
                { d: "Transparency", b: "Does the institution proactively disclose what it produces and shares?" },
                { d: "Responsiveness", b: "How quickly and completely does it respond to challenges from the public?" },
                { d: "Accessibility", b: "Can a person navigate this institution's accountability process without professional help?" },
              ].map((dim, i) => (
                <div key={i} className="border-l-2 border-[rgba(200,169,126,0.4)] pl-4">
                  <div className="text-[10px] uppercase tracking-[0.32em] text-gold mb-2">{dim.d}</div>
                  <p className="text-[12.5px] text-ivory-dim leading-relaxed">{dim.b}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/judiciary" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.32em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:bg-[var(--apt-gold-soft)] transition-all">
                See It in the Judiciary Index <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a href="/bias-beacon" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.32em] text-gold border border-[rgba(200,169,126,0.4)] hover:bg-[rgba(200,169,126,0.08)] transition-all">
                Bias Beacon Dashboard <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ── ENTRY POINTS ── */}
        <section id="entry-points" data-testid="entry-points-section">
          <div className="mb-10 md:mb-14">
            <div className="eyebrow mb-4">Start Here</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
              Name where you are.
              <span className="italic text-gold"> We'll take it from there.</span>
            </h2>
            <p className="mt-6 font-serif-h italic text-lg text-ivory-dim max-w-2xl leading-relaxed">
              Select the condition that most closely matches your situation. Each card opens to a second layer — what exists, what you're owed, and what the next step looks like.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {ENTRY_POINTS.map((entry, i) => (
              <EntryCard key={entry.path} entry={entry} idx={i} />
            ))}
          </div>
        </section>

        {/* ── OPEN INFRASTRUCTURE ── */}
        <section id="open-infrastructure" data-testid="open-infrastructure-section">
          <div className="mb-10 md:mb-14">
            <div className="eyebrow mb-4">Open Payment Standards</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
              The infrastructure
              <span className="italic text-gold"> that should have been yours.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {OPEN_PAYMENTS_POINTS.map((point, i) => (
              <div key={i} className="card-3d-raised p-7 md:p-8">
                <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-4">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display text-2xl text-ivory mb-4 leading-snug">{point.title}</h3>
                <p className="text-ivory-dim text-[14px] leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
          <div className="border border-[rgba(200,169,126,0.25)] bg-[rgba(200,169,126,0.04)] rounded-sm p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-7">
            <div className="flex-1">
              <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-3">Interledger Foundation</div>
              <h3 className="font-display text-2xl md:text-3xl text-ivory mb-3">The open payment ecosystem.</h3>
              <p className="text-ivory-dim text-[14px] leading-relaxed max-w-2xl">
                Aptitude Advancement is built in alignment with the Interledger Foundation's mission — using their open payment protocols to identify exactly where payment infrastructure gaps are producing the exclusion that our data documents.
              </p>
            </div>
            <a href="https://interledger.org" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.32em] text-[#0A0F1A] bg-[var(--apt-gold)] hover:bg-[var(--apt-gold-soft)] transition-all">
              Interledger.org <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ── WORK AND HOUSING ── */}
        <section id="work-housing" data-testid="work-housing-section">
          <div className="mb-10 md:mb-14">
            <div className="eyebrow mb-4">Work · Housing · Education</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
              The direct funnel.
              <span className="italic text-gold"> Not a list — a path.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: Home, title: "Housing", body: "Rent Well Oregon tenant certification, ORS Chapter 90 rights documentation, and eviction record dispute pathways.", link: "https://www.cssoregon.org/rentwell", label: "Rent Well Oregon" },
              { icon: Briefcase, title: "Employment", body: "WorkSource Oregon job placement, resume assistance, skills training, and Ban the Box guidance for justice-involved applicants.", link: "https://worksourceoregon.org", label: "WorkSource Oregon" },
              { icon: BookOpen, title: "Education", body: "Oregon community college workforce programs with no-cost enrollment pathways and credential-to-career pipelines.", link: "https://www.oregoncca.org", label: "Oregon CCA" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="card-3d-raised p-7 md:p-8 flex flex-col justify-between">
                  <div>
                    <Icon className="w-5 h-5 text-gold mb-4" strokeWidth={1.25} />
                    <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-3">{item.title}</div>
                    <p className="text-ivory-dim text-[14px] leading-relaxed">{item.body}</p>
                  </div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-gold border-b border-[var(--apt-gold)] pb-1 w-fit hover:gap-4 transition-all duration-400">
                    {item.label} <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
          <div className="border border-dashed border-[rgba(200,169,126,0.2)] rounded-sm p-8 md:p-10 text-center">
            <FileText className="w-6 h-6 text-gold/60 mx-auto mb-4" strokeWidth={1.25} />
            <h3 className="font-display text-2xl text-ivory mb-3">Resume Assistance · Job Board</h3>
            <p className="text-ivory-dim text-[14px] max-w-xl mx-auto leading-relaxed">
              AI-assisted resume review, plain-language cover letter drafting, and a curated job board filtering for second-chance and justice-involved-friendly employers in Oregon. Activating with the fellowship build.
            </p>
            <div className="mt-5 text-[10.5px] uppercase tracking-[0.32em] text-secondary">Coming in fellowship period</div>
          </div>
        </section>

        {/* ── PARTNERS ── */}
        <section id="partners" data-testid="partners-section">
          <div className="mb-10 md:mb-14">
            <div className="eyebrow mb-4">Partners and Resources</div>
            <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05] max-w-3xl">
              We back up
              <span className="italic text-gold"> what we are.</span>
            </h2>
          </div>
          <div className="card-3d-raised px-7 md:px-10 py-2">
            {PARTNERS.map((partner) => (
              <div key={partner.name} className="flex items-center justify-between py-4 border-b border-[rgba(245,241,230,0.07)] last:border-0">
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
                    <a href={partner.url} target="_blank" rel="noopener noreferrer"
                      className="text-gold/60 hover:text-gold transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border border-[rgba(200,169,126,0.15)] bg-[rgba(200,169,126,0.03)] rounded-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <LifeBuoy className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.25} />
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.36em] text-gold mb-2">Legal Consultation Network</div>
                <p className="text-ivory-dim text-[14px] leading-relaxed">
                  Aptitude Advancement is building a limited-purpose legal consultation network — attorneys and paralegals who recognize the systemic nature of these problems and are willing to offer bounded consultation for housing, family court, and consumer protection matters under limited engagement contracts. If you are an attorney or advocate who wants to be part of this, contact us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <section>
          <div className="text-center max-w-2xl mx-auto">
            <div className="gold-rule mb-10 mx-auto max-w-xs" />
            <p className="text-[13px] text-secondary leading-relaxed font-serif-h italic">
              Aptitude Advancement is a connection layer — not legal advice, not financial advice, and not a substitute for a licensed professional. Every resource listed has been evaluated for relevance; none has paid for placement. When we cannot verify a resource's current status or eligibility requirements, we say so.
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
