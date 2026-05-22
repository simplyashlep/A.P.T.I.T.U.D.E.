import React from "react";
import { PageShell } from "../components/aptitude/PageShell";
import { MessageSquare, Calendar, BookOpen, AlertCircle, Users, Heart } from "lucide-react";

const PILLARS = [
  {
    icon: MessageSquare,
    title: "Public Comment",
    body: "Direct portals into Oregon agency comment windows, county commissions, and bar committees.",
  },
  {
    icon: Calendar,
    title: "Statewide Meetings",
    body: "A single calendar for public hearings, town halls, advisory boards, and legislative committee work.",
  },
  {
    icon: BookOpen,
    title: "ORS · OAR · Agency Publications",
    body: "Oregon Revised Statutes, Oregon Administrative Rules, and the agency-issued guidance most people never read.",
  },
  {
    icon: AlertCircle,
    title: "Complaint Pathways",
    body: "A clearly laid out path for a complaint against a judge, lawyer, officer, PO — or CPS — with what must be alleged at each stage of oversight.",
  },
  {
    icon: Users,
    title: "Groups",
    body: "Spaces for those on probation, those on trial, and those navigating Oregon's system to compare experience.",
  },
  {
    icon: Heart,
    title: "CPS · Social Worker (Pending)",
    body: "Optional dedicated page for child welfare actors and pathways — added on request from the community.",
  },
];

export default function Community() {
  return (
    <PageShell
      testId="community-page"
      eyebrow="The Commons"
      title="Community."
      italicTitle="The record is yours, too."
      intro="A.P.T.I.T.U.D.E. is not just for clerks. The Community wing connects every Oregonian to the parts of the system that touch them: public comment, statewide meetings, agency contacts, statutory text, and clear complaint pathways."
      dataStatus={{
        title: "Structure live · contacts and pathways being verified",
        description:
          "Each complaint pathway will be audited against the relevant Oregon oversight body before going live.",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" data-testid="community-grid">
        {PILLARS.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="card-3d-raised p-7" data-testid={`community-pillar-${i}`}>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10.5px] uppercase tracking-[0.36em] text-gold">Pillar {String(i + 1).padStart(2, "0")}</span>
                <Icon className="w-4 h-4 text-steel" strokeWidth={1.25} />
              </div>
              <h3 className="font-display text-2xl text-ivory mb-3 leading-tight">{p.title}</h3>
              <p className="text-ivory-dim text-[14px] leading-relaxed">{p.body}</p>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
