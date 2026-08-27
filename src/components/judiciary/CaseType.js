// Stable case-type registry for the Judiciary filter panel.
export const CASE_TYPES = ["Criminal", "Family", "Probate", "Civil", "Juvenile", "Other"];

const RULES = [
  { type: "Criminal", re: /criminal|felony|drug court|duii|\bdui\b|gang|repeat offender/i },
  { type: "Family",   re: /family law|domestic relations|child welfare|child support|adoption|child custody/i },
  { type: "Probate",  re: /probate/i },
  { type: "Civil",    re: /civil/i },
  { type: "Juvenile", re: /juvenile/i },
];

export const deriveCaseTypes = (judge) => {
  const focus = judge.focus || "";
  if (!focus || /general/i.test(focus)) return ["Other"];
  const matched = RULES.filter((r) => r.re.test(focus)).map((r) => r.type);
  return matched.length > 0 ? matched : ["Other"];
};
