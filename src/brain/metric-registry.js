import { DIMENSIONS } from "./contracts";

const metric = (code, dimension, name, direction, weight, sources, extra = {}) => ({
  code, dimension, name, direction, weight, requiredSourceTypes: sources, ...extra,
});

export const NCRA_METRICS = [
  metric("LMCR", "F", "Legal Mandate Compliance Rate", "positive", 0.30, ["court_decision", "regulatory_filing", "inspector_general"]),
  metric("PAS", "F", "Policy Adherence Score", "positive", 0.25, ["regulatory_filing", "ftc_action"]),
  metric("RVR", "F", "Regulatory Violation Reversal Rate", "positive", 0.25, ["agency_report", "inspector_general"]),
  metric("SOF", "F", "Statutory Override Frequency", "inverse", 0.20, ["court_decision", "regulatory_filing"]),
  metric("OVI", "C", "Outcome Variance Index", "inverse", 0.30, ["public_record", "court_decision"], { minimumSample: 30 }),
  metric("PAR", "C", "Precedent Adherence Rate", "positive", 0.25, ["court_decision", "public_record"]),
  metric("CDS", "C", "Cross-Case Disparity Score", "inverse", 0.25, ["public_record", "agency_report"], { minimumSample: 30 }),
  metric("DRR", "C", "Decision Reversal Rate", "inverse", 0.20, ["court_decision"]),
  metric("RDR", "T", "Record Disclosure Rate", "positive", 0.28, ["public_record", "agency_report"]),
  metric("RTI", "T", "Response Time Index", "positive", 0.25, ["public_record"]),
  metric("FCR", "T", "Public Records Compliance Rate", "positive", 0.27, ["public_record", "court_decision"]),
  metric("PAX", "T", "Proactive Access Index", "positive", 0.20, ["public_record"]),
  metric("CRR", "E", "Case Resolution Rate", "positive", 0.28, ["agency_report"]),
  metric("PTS", "E", "Processing Time Score", "positive", 0.25, ["agency_report", "public_record"]),
  metric("RUI", "E", "Resource Utilization Index", "positive", 0.22, ["agency_report", "regulatory_filing"]),
  metric("BCR", "E", "Backlog Clearance Rate", "positive", 0.25, ["agency_report"]),
  metric("DDI", "Q", "Demographic Disparity Index", "inverse", 0.30, ["agency_report", "court_decision"], { minimumSample: 100 }),
  metric("GAS", "Q", "Geographic Access Score", "positive", 0.23, ["public_record", "agency_report"]),
  metric("PCOR", "Q", "Protected Class Outcome Rate", "positive", 0.27, ["agency_report", "court_decision"], { minimumSample: 100 }),
  metric("ASR", "Q", "Protected Class Appeals Success Rate", "positive", 0.20, ["court_decision"], { minimumSample: 100 }),
  metric("SCR", "Ac", "Self-Correction Rate", "positive", 0.28, ["agency_report", "regulatory_filing"]),
  metric("AC", "Ac", "Audit Compliance", "positive", 0.25, ["inspector_general", "agency_report"]),
  metric("CRR_c", "Ac", "Complaint Resolution Rate", "positive", 0.22, ["cfpb_complaint", "public_record"]),
  metric("RAR", "Ac", "Remediation Action Rate", "positive", 0.25, ["agency_report", "court_decision"]),
];

export const CORRECTIONS_METRICS = [
  metric("MCA", "F", "Mandate Compliance Assessment", "positive", 0.35, ["court_decision", "agency_report"]),
  metric("DPA", "F", "Due Process Adherence", "positive", 0.35, ["court_decision", "agency_report"]),
  metric("SAF", "F", "Statutory Authority Fidelity", "positive", 0.30, ["court_decision", "agency_report"]),
  metric("DCR", "C", "Comparable Decision Consistency", "positive", 0.40, ["agency_report", "court_decision"], { minimumSample: 30 }),
  metric("GCR", "C", "Grievance Consistency Rate", "positive", 0.30, ["agency_report", "public_record"]),
  metric("RVR_d", "C", "Release/Classification Reversal Rate", "inverse", 0.30, ["court_decision", "agency_report"]),
  metric("PDR", "T", "Public Disclosure Rate", "positive", 0.35, ["agency_report", "public_record"]),
  metric("GRT", "T", "Grievance Response Timeliness", "positive", 0.35, ["agency_report"]),
  metric("ICI", "T", "Incident Communication Index", "positive", 0.30, ["public_record", "agency_report"]),
  metric("PCR", "E", "Program Completion Rate", "positive", 0.35, ["agency_report"]),
  metric("BCR_d", "E", "Backlog Clearance Rate", "positive", 0.30, ["agency_report"]),
  metric("CAP", "E", "Capacity-Adjusted Performance", "positive", 0.35, ["agency_report"]),
  metric("DDI_d", "Q", "Custody Outcome Disparity", "inverse", 0.40, ["agency_report", "court_decision"], { minimumSample: 100 }),
  metric("DAA", "Q", "Disability and Access Accommodation", "positive", 0.30, ["agency_report", "court_decision"]),
  metric("LAX", "Q", "Language Access", "positive", 0.30, ["agency_report", "public_record"]),
  metric("ICA", "Ac", "Inspection Correction Adoption", "positive", 0.35, ["inspector_general", "agency_report"]),
  metric("RFA", "Ac", "Recurrence-Free Action", "positive", 0.35, ["agency_report", "court_decision"]),
  metric("GRA", "Ac", "Grievance Resolution Accountability", "positive", 0.30, ["agency_report", "public_record"]),
];

export const METRIC_REGISTRIES = {
  "ncra-v1": NCRA_METRICS,
  "corrections-v1": CORRECTIONS_METRICS,
};

export const validateMetricRegistry = (metrics) => {
  const errors = [];
  const seen = new Set();
  for (const item of metrics) {
    if (seen.has(item.code)) errors.push(`duplicate metric: ${item.code}`);
    seen.add(item.code);
    if (!DIMENSIONS.includes(item.dimension)) errors.push(`invalid dimension: ${item.code}`);
    if (!(item.weight > 0 && item.weight <= 1)) errors.push(`invalid weight: ${item.code}`);
    if (!item.requiredSourceTypes?.length) errors.push(`missing sources: ${item.code}`);
  }
  for (const dimension of DIMENSIONS) {
    const total = metrics.filter((item) => item.dimension === dimension)
      .reduce((sum, item) => sum + item.weight, 0);
    if (total && Math.abs(total - 1) > 1e-9) errors.push(`weights for ${dimension} sum to ${total}`);
  }
  return { valid: errors.length === 0, errors };
};
