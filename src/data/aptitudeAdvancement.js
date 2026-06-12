export const ADVANCEMENT_BRIEF = {
  title: "Aptitude Advancement",
  subtitle: "Financial literacy, access, and action — organized around real barriers, real decisions, and real next steps.",
  body:
    "Aptitude Advancement is a financial capability layer built for people navigating fragmented systems, uneven access, and high-stakes financial decisions. It does not assume that financial difficulty is just a matter of knowledge. It recognizes overlapping barriers involving documentation, debt, digital access, institutional friction, and system design.",
  mission:
    "Move users from confusion, exclusion, or partial knowledge toward orientation, comprehension, action, and repeated competent use.",
  primaryActions: ["Learn a concept", "Solve a problem", "Prepare for a decision", "Compare options", "Get help now"],
};

export const CAPABILITY_PATHWAYS = [
  {
    title: "Banking and account access",
    body: "Understand account basics, common barriers, required documents, fees, and safer ways to begin using formal financial services.",
  },
  {
    title: "Digital payments and wallets",
    body: "Learn how digital financial tools work, what risks to watch for, and how open, interoperable systems can reduce friction for underserved users.",
  },
  {
    title: "Debt and financial obligations",
    body: "Understand consumer debt, recurring obligations, fee accumulation, and the decisions that affect stability over time.",
  },
  {
    title: "Credit and reporting",
    body: "Learn what shapes credit visibility, how reporting affects opportunity, and what users should check before making a major decision.",
  },
  {
    title: "Fraud, risk, and consumer protection",
    body: "Identify warning signs, understand how fraud operates, and find steps to reduce exposure and respond quickly.",
  },
  {
    title: "Rights, barriers, and system navigation",
    body: "Understand how documentation gaps, prior system involvement, digital barriers, and institutional fragmentation affect access to financial tools and opportunities.",
  },
];

export const BARRIER_LENSES = [
  { title: "Documentation and identification", body: "No ID, unstable records, mismatched information, or missing proofs can block access before a user even starts." },
  { title: "Device and connectivity limits", body: "Low bandwidth, shared devices, broken phones, and intermittent internet make digital finance harder to use." },
  { title: "Fee burden and debt cycling", body: "Small fees can compound into a larger barrier when timing, holds, and recurring obligations overlap." },
  { title: "Low trust and prior denial", body: "Repeated rejection or confusing processes can discourage users from trying again." },
  { title: "Justice-related barriers", body: "Court fines, supervision conditions, garnishment, or prior system involvement can shape available options." },
  { title: "Housing and employment instability", body: "When housing or work is unstable, the financial decision itself becomes harder to carry out." },
];

export const CONCEPT_LIBRARY = [
  {
    title: "Budget",
    what: "A plan for how money comes in and goes out.",
    why: "Shows whether a user can cover essentials, save, and plan ahead.",
    askNext: "What fixed expenses, variable expenses, and timing issues shape this month?",
  },
  {
    title: "Fee",
    what: "A charge for using a product or service.",
    why: "Small fees can make a low-balance account or wallet much harder to sustain.",
    askNext: "What fee triggers this cost, and what cheaper alternative exists?",
  },
  {
    title: "APR",
    what: "The yearly cost of borrowing, including interest and some fees.",
    why: "Helps compare the true price of loans and credit products.",
    askNext: "What will this cost after a full year, not just at signup?",
  },
  {
    title: "Credit report",
    what: "A file that summarizes borrowing and repayment history.",
    why: "Affects lending, housing, employment, and other access decisions.",
    askNext: "What items should be verified, disputed, or explained?",
  },
  {
    title: "Overdraft",
    what: "A negative balance created when a transaction exceeds available funds.",
    why: "Can trigger cascading fees and account instability.",
    askNext: "How does the account handle overdrafts, holds, and alerts?",
  },
  {
    title: "Digital wallet",
    what: "A tool for storing payment methods or moving money digitally.",
    why: "Can improve convenience but may introduce limits, fees, or verification barriers.",
    askNext: "How do I add, store, move, and protect funds in this system?",
  },
  {
    title: "Transfer hold",
    what: "A delay before money becomes available.",
    why: "A hold can block the exact payment a user expected to make next.",
    askNext: "When will the money actually be usable?",
  },
  {
    title: "Identity verification",
    what: "A process for proving who the user is.",
    why: "Often the first access gate in banking and digital payment systems.",
    askNext: "What documents, formats, or matching details will this system require?",
  },
];

export const ACTION_GUIDES = [
  {
    title: "Preparing to open an account",
    action: "prepare",
    body: "What documents to bring, what questions to ask, and what to do if the first option says no.",
  },
  {
    title: "Comparing payment tools",
    action: "compare",
    body: "How to compare prepaid cards, checking accounts, and wallet tools without getting trapped by fees.",
  },
  {
    title: "Understanding transfer cost and holds",
    action: "calculate",
    body: "A simple way to see when money moves, when it clears, and when it becomes usable.",
  },
  {
    title: "Responding to denial",
    action: "ask for help",
    body: "A decision path for account denial, identity mismatch, or unclear next steps.",
  },
  {
    title: "Documenting a financial problem",
    action: "track",
    body: "A worksheet for dates, fees, screenshots, notices, and names of people or institutions involved.",
  },
  {
    title: "Digital wallet readiness",
    action: "verify",
    body: "A setup checklist for payment apps, authentication, recovery options, and backup access.",
  },
];

export const SUPPORT_OBJECTS = [
  {
    title: "Legal aid and consumer law",
    body: "Use when a dispute, denial, or debt issue needs legal guidance or formal challenge.",
  },
  {
    title: "Credit counseling and debt support",
    body: "Use when the user needs budgeting, debt management, or repayment help.",
  },
  {
    title: "Fraud reporting",
    body: "Use when a user needs to freeze, report, or remediate suspicious activity.",
  },
  {
    title: "Community resource partners",
    body: "Use when the issue is larger than a single form or explainer and needs human navigation support.",
  },
  {
    title: "Government and agency support",
    body: "Use when the right next step is a public office, benefits administrator, or regulator.",
  },
  {
    title: "Local navigation help",
    body: "Use when the user needs in-person or trusted guided support rather than more information.",
  },
];

export const PROGRESSION_STEPS = [
  "What are you trying to do?",
  "What does this term, fee, or barrier actually mean?",
  "What gets in the way of action?",
  "What should you do next?",
  "What support do you need if the first route fails?",
];

export const ONTOLOGY = {
  user_states: ["beginner", "overwhelmed", "excluded", "rebuilding", "comparing options", "preparing for action"],
  need_states: ["budgeting", "opening an account", "understanding fees", "managing debt", "avoiding fraud", "digital payments", "improving credit", "learning rights"],
  barrier_states: ["low trust", "low literacy", "no ID", "device limits", "inconsistent internet", "prior system involvement", "account denial", "fear of error"],
  resource_objects: ["article", "explainer", "glossary item", "checklist", "interactive tool", "video", "case example", "rights guide", "worksheet"],
  action_objects: ["calculate", "compare", "prepare", "apply", "verify", "dispute", "save", "track", "ask for help"],
  support_objects: ["community resource", "legal aid", "consumer agency", "financial institution", "training module", "advocacy path"],
  outcome_markers: ["understood", "completed", "revisited", "saved", "shared", "ready for next step"],
};

export const AGENT_BRAIN = [
  {
    title: "Intake parser",
    role: "Structure a user’s free-text problem into a normalized financial-navigation object.",
    output: "user_goal, current_problem, barrier_signals, urgency_level, digital_access_level, support_needed",
  },
  {
    title: "Capability classifier",
    role: "Map the structured issue to capability domains, barrier domains, and explanation level.",
    output: "capability_domains, barrier_domains, explanation_level, recommended_module_sequence",
  },
  {
    title: "Pathway graph resolver",
    role: "Attach the issue to concepts, tools, decision points, and support resources.",
    output: "requires, blocks, explains, leads_to, mitigates, escalates_to, supports",
  },
  {
    title: "Action planner",
    role: "Turn the issue into a sequenced, plain-language next-step plan.",
    output: "immediate_next_step, preparation_steps, fallback_options, escalation_trigger",
  },
  {
    title: "Response composer",
    role: "Format the final answer for the page in a clear, usable structure.",
    output: "plain-language guidance, checklist, comparison, scenario explanation, support handoff",
  },
];
