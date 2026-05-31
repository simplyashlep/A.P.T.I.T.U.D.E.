import React from "react";
import { PageShell } from "../components/aptitude/PageShell";
import { FlaskConical, FileSearch, PenTool, Library, Upload } from "lucide-react";

const AGENTS = [
  {
    icon: FileSearch,
    name: "Analyst",
    role: "Reads your document and returns a structured legal summary — issues, parties, exposure, missing facts.",
  },
  {
    icon: Library,
    name: "Researcher",
    role: "Finds comparable Oregon cases and ORS sections, surfaces precedent, and flags appellate trends.",
  },
  {
    icon: PenTool,
    name: "Draft Counsel",
    role: "Co-drafts letters, motions, declarations, and complaints — from a chosen template, never auto-filed.",
  },
  {
    icon: FlaskConical,
    name: "Informer",
    role: "Plain-language explainer for clients and self-represented users. Translates jargon, not advice.",
  },
];

export default function JurisLab() {
  return (
    <PageShell
      testId="juris-lab-page"
      eyebrow="Your Tools"
      title="Juris Lab."
      italicTitle="A workshop, not a vending machine."
      intro="Bring your own documents. Four agents take it from there — analyze, inform, research, draft. Templates live in the library and the community curates the best of them. Nothing is filed for you. Everything is yours."
      dataStatus={{
        title: "Agent shells ready · uploader wiring next",
        description:
          "Document upload, agent orchestration, and the shared template library activate together in the next iteration.",
      }}
    >
      {/* Upload zone */}
      <div className="card-3d-raised p-10 md:p-14 mb-14 text-center border-dashed" data-testid="juris-upload">
        <Upload className="w-7 h-7 text-gold mx-auto mb-5 opacity-80" strokeWidth={1.25} />
        <h3 className="font-display text-3xl md:text-4xl text-ivory mb-3">Drop a document.</h3>
        <p className="font-serif-h italic text-ivory-dim max-w-xl mx-auto">
          PDF, DOCX, plain text. The Analyst will read it first; then you choose which agent works next.
        </p>
        <button
          type="button"
          disabled
          className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.32em] text-[#0A0F1A] bg-[var(--apt-gold)] opacity-50 cursor-not-allowed"
          data-testid="juris-upload-btn"
        >
          Upload — coming soon
        </button>
      </div>

      <div className="mb-6 text-\[11px] uppercase tracking-\[0.36em] text-gold">The Four Agents</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6" data-testid="juris-agents">
        {AGENTS.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={a.name} className="card-3d-raised p-7" data-testid={`juris-agent-${i}`}>
              <div className="flex items-center gap-4 mb-4">
                <Icon className="w-5 h-5 text-gold" strokeWidth={1.25} />
                <div>
                  <div className="text-\[10.5px] uppercase tracking-\[0.36em] text-secondary">Agent {String(i + 1).padStart(2, "0")}</div>
                  <h3 className="font-display text-2xl text-ivory">{a.name}</h3>
                </div>
              </div>
              <p className="text-ivory-dim text-\[14.5px] leading-relaxed">{a.role}</p>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
