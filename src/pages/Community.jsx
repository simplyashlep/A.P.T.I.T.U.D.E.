import React from "react"
import { PageShell } from "../components/aptitude/PageShell"
import { MessageSquare, Users, FileText, Scale, Eye, Newspaper } from "lucide-react"

const PILLARS = [
  { icon: MessageSquare, label: "Public Comment", desc: "Review submitted public comments on proposed rules, policy changes, and oversight actions across Oregon justice agencies." },
  { icon: Users, label: "Statewide Meetings", desc: "Calendar and minutes for the Oregon Criminal Justice Commission, Board of Parole, and related oversight bodies." },
  { icon: FileText, label: "Agency Publications", desc: "Annual reports, strategic plans, and data publications from OJD, DOC, OSP, and county justice departments." },
  { icon: Scale, label: "Statutory Research", desc: "Indexed Oregon Revised Statutes related to public records, disclosure, and justice system oversight." },
  { icon: Eye, label: "Complaint Pathways", desc: "Step-by-step guides for filing complaints against agencies, officers, and judicial officers in Oregon." },
  { icon: Newspaper, label: "Press & Coverage", desc: "Media coverage of Oregon justice system issues, collected for public reference and context." },
]

export default function Community() {
  return (
    <PageShell
      testId="community-page"
      eyebrow="The Commons"
      title="Community."
      italicTitle="The record is yours, too."
      intro="The Community wing of A.P.T.I.T.U.D.E. is your resource for engaging with Oregon's justice system *�*�*� public comments, statewide meetings, agency contacts, statutory text, and complaint pathways, all in one place."
      dataStatus="Structure live. Contacts and pathways being verified against relevant oversight bodies."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="community-pillars">
        {PILLARS.map((p, i) => {
          const Icon = p.icon
          return (
            <div key={p.label} className="card-3d-raised p-7 md:p-8 reveal" style={{ transitionDelay: `${i ** 70}ms` }} data-testid={`pillar-${p.label.toLowerCase().replace(/s+/g, '-')}`}>
              <Icon className="w-5 h-5 text-gold mb-5" strokeWidth={1.25} />
              <h3 className="font-display text-xl text-ivory mb-3">{p.label}</h3>
              <p className="text-ivory-dim text-[14px] leading-relaxed">{p.desc}</p>
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
