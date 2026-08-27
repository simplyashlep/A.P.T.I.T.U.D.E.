import { deriveCaseTypes } from "./CaseType";

export const applyJudgeFilters = (judges, filters = {}) => {
  const { q = "", county = "", risk = "", court = "", caseTypes = [] } = filters;
  const lowerQ = q.trim().toLowerCase();
  return judges.filter((judge) => {
    const haystack = [
      judge.name, judge.county, judge.category, judge.court,
      judge.roleTitle, judge.tenureDisplay, judge.focus, judge.flags?.join(" "),
    ].filter(Boolean).join(" ").toLowerCase();
    if (lowerQ && !haystack.includes(lowerQ)) return false;
    if (county && judge.county !== county) return false;
    if (risk && judge.riskLevel !== risk) return false;
    if (court && judge.category !== court && judge.court !== court) return false;
    if (caseTypes.length > 0) {
      const mine = deriveCaseTypes(judge);
      if (!mine.some((t) => caseTypes.includes(t))) return false;
    }
    return true;
  });
};
