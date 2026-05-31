import React, { useState } from "react"
import { PageShell } from "../components/aptitude/PageShell"
import { FlaskConical, Upload, Search, FileText, MessageSquare, Eye, Loader2, ExternalLink } from "lucide-react"

const AGENTS = [
  { icon: Search, label: "Analyst", desc: "Read and summarize uploaded documents — case filings, court opinions, statutes, and briefs — extracting key facts, holdings, and procedural history." },
  { icon: FileText, label: "Researcher", desc: "Search across Oregon case law, statutes, and the A.P.T.I.T.U.D.E. dataset to find relevant precedents, patterns, and procedural references." },
  { icon: MessageSquare, label: "Draft Counsel", desc: "Generate draft filings, motions, public-records requests, and legal memos based on your specific needs and the data in the record." },
  { icon: Eye, label: "Informer", desc: "Monitor changes in Oregon justice data — new filings, policy shifts, and emerging disparity signals — and alert you to what matters." },
]

export default function JurisLab() {
  const [dragOver, setDragOver] = useState(false)
  const [uploaded, setUploaded] = useState(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) setUploaded(file.name)
  }

  return (
    <PageShell
      testId="juris-lab-page"
      eyebrow="The Workshop"
      title="Juris Lab."
      italicTitle="Your document workshop."
      intro="Upload a filing, a statute, or any justice document and let A.P.T.I.T.U.D.E.'s agents analyze, research, and draft from it. The lab combines AI reading with Oregon-specific justice data."
      dataStatus="Agent tools active. Document analysis and research functions operational."
    >
      {/* Upload zone */}
      <div
        className={`card-3d-raised p-10 md:p-12 mb-10 text-center ${dragOver ? "border-gold" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        data-testid="juris-upload-zone"
      >
        <Upload className="w-8 h-8 text-gold/60 mx-auto mb-4" strokeWidth={1.25} />
        <h3 className="font-display text-xl text-ivory mb-2">
          {uploaded ? `Uploaded: ${uploaded}` : "Drop a document here"}
        </h3>
        <p className="text-ivory-dim text-[14px] mb-6">
          Accepted formats: PDF, DOCX, TXT — case filings, briefs, statutes, or court opinions
        </p>
        <label className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[rgba(200,169,126,0.45)] text-[11px] uppercase tracking-[0.32em] text-gold cursor-pointer hover:bg-gold hover:text-[#0A0F1A] transition-all duration-300" data-testid="juris-browse-button">
          <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
          Browse files
          <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setUploaded(file.name)
          }} />
        </label>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="juris-agents">
        {AGENTS.map((agent, i) => {
          const Icon = agent.icon
          return (
            <div key={agent.label} className="card-3d-raised p-7 md:p-8 reveal" style={{ transitionDelay: `${i * 80}ms` }} data-testid={`agent-card-${agent.label.toLowerCase()}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-[rgba(200,169,126,0.35)] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gold" strokeWidth={1.25} />
                </div>
                <div>
                  <h3 className="font-display text-lg text-ivory mb-2">{agent.label}</h3>
                  <p className="text-ivory-dim text-[14px] leading-relaxed">{agent.desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
