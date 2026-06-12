import React from "react";
import { ArrowUpRight, Banknote, BrainCircuit, CheckCircle2, CircleDollarSign, CreditCard, FileText, Landmark, Layers3, LifeBuoy, MoveRight, Target } from "lucide-react";
import { TopNav } from "../components/aptitude/TopNav";
import { Footer } from "../components/aptitude/Footer";
import {
  ADVANCEMENT_BRIEF,
  AGENT_BRAIN,
  ACTION_GUIDES,
  BARRIER_LENSES,
  CAPABILITY_PATHWAYS,
  CONCEPT_LIBRARY,
  ONTOLOGY,
  PROGRESSION_STEPS,
  SUPPORT_OBJECTS,
} from "../data/aptitudeAdvancement";

const ICONS = [Landmark, CircleDollarSign, CreditCard, Banknote, Target, Layers3];

const ACTION_TARGETS = {
  "Learn a concept": "understand-a-concept",
  "Solve a problem": "solve-a-problem",
  "Prepare for a decision": "prepare-for-a-decision",
  "Compare options": "use-a-tool",
  "Get help now": "get-help",
};

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="max-w-4xl mb-10 md:mb-14">
    <div className="eyebrow mb-4">{eyebrow}</div>
    <h2 className="font-display text-4xl md:text-6xl text-ivory leading-[1.05]">
      {title}
    </h2>
    {subtitle && <p className="mt-5 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed max-w-3xl">{subtitle}</p>}
  </div>
);

const Card = ({ title, body, index, icon: Icon, eyebrow }) => (
  <div
    className="card-3d-raised p-6 md:p-7 h-full flex flex-col justify-between"
    style={{ transitionDelay: `${index * 70}ms` }}
  >
    <div>
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10.5px] uppercase tracking-[0.36em] text-gold">{eyebrow}</span>
        {Icon ? <Icon className="w-4 h-4 text-steel" strokeWidth={1.25} /> : <MoveRight className="w-4 h-4 text-steel" strokeWidth={1.25} />}
      </div>
      <h3 className="font-display text-2xl md:text-3xl text-ivory leading-tight mb-4">{title}</h3>
      <p className="text-ivory-dim text-[14px] leading-relaxed">{body}</p>
    </div>
    <div className="mt-8 h-px w-12 bg-[var(--apt-gold)] opacity-50" />
  </div>
);

const ConceptCard = ({ concept, index }) => (
  <div className="card-3d-raised p-6 md:p-7 h-full" style={{ transitionDelay: `${index * 45}ms` }}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10.5px] uppercase tracking-[0.34em] text-gold">Concept</span>
      <FileText className="w-4 h-4 text-steel" strokeWidth={1.25} />
    </div>
    <h3 className="font-display text-2xl md:text-3xl text-ivory mb-3">{concept.title}</h3>
    <div className="space-y-3 text-[14px] leading-relaxed text-ivory-dim">
      <p><span className="text-gold uppercase tracking-[0.24em] text-[10px] block mb-1">What it is</span>{concept.what}</p>
      <p><span className="text-gold uppercase tracking-[0.24em] text-[10px] block mb-1">Why it matters</span>{concept.why}</p>
      <p><span className="text-gold uppercase tracking-[0.24em] text-[10px] block mb-1">Ask next</span>{concept.askNext}</p>
    </div>
  </div>
);

const BrainCard = ({ agent, index }) => (
  <div className="card-3d-raised p-6 md:p-7 h-full" style={{ transitionDelay: `${index * 55}ms` }}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10.5px] uppercase tracking-[0.34em] text-gold">Brain layer</span>
      <BrainCircuit className="w-4 h-4 text-steel" strokeWidth={1.25} />
    </div>
    <h3 className="font-display text-2xl md:text-3xl text-ivory mb-3">{agent.title}</h3>
    <p className="text-ivory-dim text-[14px] leading-relaxed mb-4">{agent.role}</p>
    <div className="rounded-sm border border-line p-4 bg-[rgba(245,241,230,0.02)]">
      <div className="text-[10px] uppercase tracking-[0.32em] text-secondary mb-2">Output contract</div>
      <p className="text-[13px] text-ivory-dim leading-relaxed">{agent.output}</p>
    </div>
  </div>
);

export default function AptitudeAdvancement() {
  return (
    <div className="relative min-h-screen pb-24" data-testid="aptitude-advancement-page">
      <TopNav />

      <header className="relative pt-32 md:pt-40 pb-12 md:pb-14 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <Landmark className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] text-gold" strokeWidth={0.5} />
        </div>
        <div className="relative max-w-[1360px] mx-auto grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8 xl:gap-12 items-center">
          <div>
            <div className="eyebrow mb-5">Aptitude Advancement</div>
            <h1 className="font-display text-5xl md:text-7xl text-ivory leading-[1.02] max-w-4xl">
              Financial capability.
              <span className="italic text-gold"> Access. Action.</span>
            </h1>
            <p className="mt-7 font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed max-w-3xl">
              {ADVANCEMENT_BRIEF.body}
            </p>
            <p className="mt-5 text-[15px] md:text-[16px] text-ivory-dim leading-relaxed max-w-3xl">
              This page is not a resource page. It is an operational layer for financial capability formation — a place where a user moves from confusion or partial knowledge toward orientation, comprehension, action, and repeated competent use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {ADVANCEMENT_BRIEF.primaryActions.map((action) => (
                <a
                  key={action}
                  href={`#${ACTION_TARGETS[action]}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(200,169,126,0.35)] text-[11px] uppercase tracking-[0.32em] text-gold hover:bg-[rgba(200,169,126,0.08)] transition-colors"
                >
                  {action}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div className="card-3d-raised p-6 md:p-7">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10.5px] uppercase tracking-[0.34em] text-gold">Process model</span>
              <CheckCircle2 className="w-4 h-4 text-steel" strokeWidth={1.25} />
            </div>
            <div className="space-y-3">
              {PROGRESSION_STEPS.map((step, index) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full border border-[rgba(200,169,126,0.45)] flex items-center justify-center text-[10px] text-gold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="text-ivory-dim leading-relaxed text-[14px]">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section id="what-this-page-is-for" className="px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-[1360px] mx-auto">
            <SectionHeader
              eyebrow="Mission"
              title="What this page is for"
              subtitle="Not just information. Usable financial capability."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
              <div className="card-3d-raised p-6 md:p-7">
                <p className="font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed">
                  Financial capability is not simply knowing terms. It includes the ability to act in your own interest and the opportunity to use accessible services and systems effectively.
                </p>
              </div>
              <div className="card-3d-raised p-6 md:p-7">
                <p className="text-ivory-dim leading-relaxed text-[15px]">
                  Aptitude Advancement translates financial concepts into plain language, links them to real-world barriers, and helps users prepare for action. The aim is not passive literacy. The aim is practical movement.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="learn-a-concept" className="px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-[1360px] mx-auto">
            <SectionHeader
              eyebrow="Pathways"
              title="Choose your pathway"
              subtitle="Begin with the task, not the theory."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {CAPABILITY_PATHWAYS.map((item, index) => {
                const Icon = ICONS[index % ICONS.length];
                return <Card key={item.title} title={item.title} body={item.body} icon={Icon} eyebrow="Pathway" index={index} />;
              })}
            </div>
          </div>
        </section>

        <section id="solve-a-problem" className="px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-[1360px] mx-auto">
            <SectionHeader
              eyebrow="Barrier layer"
              title="Why access breaks down"
              subtitle="Financial exclusion is often structural before it is personal."
            />
            <p className="max-w-4xl text-ivory-dim leading-relaxed text-[15px] mb-8 md:mb-10">
              People are often asked to navigate financial systems as if every decision occurs in isolation. In practice, access is shaped by unstable housing, documentation gaps, debt burdens, prior justice-system involvement, inconsistent internet, device limitations, distrust, and repeated denial or redirection.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {BARRIER_LENSES.map((item, index) => (
                <Card key={item.title} title={item.title} body={item.body} eyebrow="Barrier" index={index} icon={LifeBuoy} />
              ))}
            </div>
          </div>
        </section>

        <section id="understand-a-concept" className="px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-[1360px] mx-auto">
            <SectionHeader
              eyebrow="Translation"
              title="Understand the concept before the consequence"
              subtitle="Plain-language explanations for terms that shape real outcomes."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {CONCEPT_LIBRARY.map((concept, index) => (
                <ConceptCard key={concept.title} concept={concept} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="prepare-for-a-decision" className="px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-[1360px] mx-auto">
            <SectionHeader
              eyebrow="Action preparation"
              title="Prepare before you act"
              subtitle="A decision is safer when the user knows what the system will ask for."
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6">
              {ACTION_GUIDES.map((guide, index) => (
                <Card key={guide.title} title={guide.title} body={guide.body} eyebrow={guide.action} index={index} icon={MoveRight} />
              ))}
            </div>
          </div>
        </section>

        <section id="use-a-tool" className="px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-[1360px] mx-auto">
            <SectionHeader
              eyebrow="Tool layer"
              title="Use the tools"
              subtitle="Move from explanation to action."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              <Card title="Budget planner" body="A simple worksheet to map income timing, fixed costs, variable costs, and leftovers." eyebrow="Tool" icon={Banknote} />
              <Card title="Fee comparison sheet" body="Compare account, wallet, and payment-tool costs in one place before choosing." eyebrow="Tool" icon={CircleDollarSign} />
              <Card title="What to bring checklist" body="List the documents and questions needed before visiting a bank or support office." eyebrow="Tool" icon={FileText} />
              <Card title="Digital wallet readiness" body="A setup guide for authentication, recovery, storage, and safe use." eyebrow="Tool" icon={CreditCard} />
              <Card title="Denial-response worksheet" body="Document what happened, what was missing, and what the next step should be." eyebrow="Tool" icon={Layers3} />
              <Card title="Rights and complaint map" body="Map the next route when the problem needs support, escalation, or formal review." eyebrow="Tool" icon={Target} />
            </div>
          </div>
        </section>

        <section id="get-help" className="px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-[1360px] mx-auto">
            <SectionHeader
              eyebrow="Support layer"
              title="When education is not enough"
              subtitle="Some problems require outside support, not just better information."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {SUPPORT_OBJECTS.map((item, index) => (
                <Card key={item.title} title={item.title} body={item.body} eyebrow="Support" index={index} icon={LifeBuoy} />
              ))}
            </div>
          </div>
        </section>

        <section id="progression" className="px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-[1360px] mx-auto">
            <SectionHeader
              eyebrow="Progression"
              title="Track your next step"
              subtitle="Capability grows through repetition, not exposure."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
              <div className="card-3d-raised p-6 md:p-7">
                <div className="text-[10.5px] uppercase tracking-[0.34em] text-gold mb-4">Reflection prompts</div>
                <ul className="space-y-3 text-ivory-dim text-[15px] leading-relaxed">
                  <li>What did you come here to solve?</li>
                  <li>What do you understand now?</li>
                  <li>What is your next step?</li>
                  <li>What support do you still need?</li>
                  <li>What should you revisit later?</li>
                </ul>
              </div>
              <div className="card-3d-raised p-6 md:p-7">
                <div className="text-[10.5px] uppercase tracking-[0.34em] text-gold mb-4">Outcome markers</div>
                <div className="flex flex-wrap gap-3">
                  {["understood", "completed", "revisited", "saved", "shared", "ready for next step"].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[rgba(200,169,126,0.35)] text-[11px] uppercase tracking-[0.28em] text-ivory-dim"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="brain" className="px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-[1360px] mx-auto">
            <SectionHeader
              eyebrow="Agent brain"
              title="How the page thinks"
              subtitle="A bounded orchestration layer mirrors the larger Aptitude architecture."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {AGENT_BRAIN.map((agent, index) => (
                <BrainCard key={agent.title} agent={agent} index={index} />
              ))}
            </div>
            <div className="mt-8 card-3d-raised p-6 md:p-7">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10.5px] uppercase tracking-[0.34em] text-gold">Ontology</span>
                <BrainCircuit className="w-4 h-4 text-steel" strokeWidth={1.25} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-[14px] leading-relaxed text-ivory-dim">
                <div><span className="text-gold block mb-1 text-[10px] uppercase tracking-[0.28em]">User states</span>{ONTOLOGY.user_states.join(" · ")}</div>
                <div><span className="text-gold block mb-1 text-[10px] uppercase tracking-[0.28em]">Need states</span>{ONTOLOGY.need_states.join(" · ")}</div>
                <div><span className="text-gold block mb-1 text-[10px] uppercase tracking-[0.28em]">Barrier states</span>{ONTOLOGY.barrier_states.join(" · ")}</div>
                <div><span className="text-gold block mb-1 text-[10px] uppercase tracking-[0.28em]">Resource objects</span>{ONTOLOGY.resource_objects.join(" · ")}</div>
                <div><span className="text-gold block mb-1 text-[10px] uppercase tracking-[0.28em]">Action objects</span>{ONTOLOGY.action_objects.join(" · ")}</div>
                <div><span className="text-gold block mb-1 text-[10px] uppercase tracking-[0.28em]">Outcome markers</span>{ONTOLOGY.outcome_markers.join(" · ")}</div>
              </div>
            </div>
          </div>
        </section>

        <section id="aptitude-linkage" className="px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-[1360px] mx-auto grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-5 md:gap-6 items-start">
            <div className="card-3d-raised p-6 md:p-7">
              <div className="text-[10.5px] uppercase tracking-[0.34em] text-gold mb-4">How this connects to Aptitude</div>
              <p className="font-serif-h italic text-lg md:text-xl text-ivory-dim leading-relaxed">
                The database reveals patterns. This layer makes them usable.
              </p>
            </div>
            <div className="card-3d-raised p-6 md:p-7">
              <p className="text-ivory-dim leading-relaxed text-[15px]">
                Aptitude’s broader system architecture transforms unstructured human experience into structured, queryable knowledge through intake, graph mapping, retrieval, procedural reasoning, and response composition. This page brings that same philosophy into the financial capability domain.
              </p>
              <p className="mt-4 text-ivory-dim leading-relaxed text-[15px]">
                Where the Aptitude database reveals patterns of exclusion, overlap, and systemic friction, Aptitude Advancement translates those patterns into public-facing guidance, learning pathways, and action tools that people can actually use.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
