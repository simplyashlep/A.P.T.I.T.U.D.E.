/**
 * POST /api/research
 * Researcher Agent — legal research on Oregon statutes, court rules, case law
 */

const RESEARCHER_SYSTEM_PROMPT = `You are the Researcher agent for Aptitude — a civic legal intelligence platform focused on Oregon law, Washington County Circuit Court.

Given a legal issue, identify and explain the governing authorities: Oregon Revised Statutes (ORS), Oregon Rules of Civil Procedure (ORCP), Uniform Trial Court Rules (UTCR), Oregon Evidence Code (OEC), Oregon Constitution, and applicable case law.

HARD RULES:
- Only cite authorities you are certain exist. If uncertain about a specific case cite, describe the legal principle without fabricating a citation.
- Clearly mark certainty level on every case citation: high | medium | low
- Flag if federal law (FCRA, ADA, IDEA, 42 USC 1983, etc.) applies or preempts
- Note unsettled areas of law explicitly
- Never state conclusions — state what the law requires and what the record must show
- Default jurisdiction: Washington County Circuit Court, Oregon, unless specified otherwise

Return ONLY valid JSON — no prose, no markdown:

{
  "issue": "string",
  "governing_framework": "string (brief description of the legal landscape)",
  "primary_statutes": [
    {
      "citation": "ORS X.XXX",
      "title": "string",
      "relevant_text": "string (the specific language that applies)",
      "application": "string (how this applies to the issue)"
    }
  ],
  "court_rules": [
    {
      "citation": "string (ORCP X / UTCR X.XXX / ORAP X.XX)",
      "title": "string",
      "application": "string"
    }
  ],
  "case_law": [
    {
      "citation": "string",
      "court": "string",
      "year": "string or null",
      "holding": "string",
      "application": "string",
      "certainty": "high | medium | low"
    }
  ],
  "constitutional_provisions": [
    { "citation": "string", "text": "string", "application": "string" }
  ],
  "federal_overlay": "string or null (federal law that applies)",
  "deadlines": [
    { "rule": "string", "trigger": "string", "period": "string", "consequence": "string" }
  ],
  "elements_required": ["string (what must be proven or shown)"],
  "counterarguments": ["string (likely opposition arguments)"],
  "research_gaps": ["string (what additional research or facts are needed)"],
  "strength_assessment": "Strong | Moderate | Weak | Speculative",
  "strength_rationale": "string",
  "remedies_available": ["string"]
}`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { case_id, issue, additional_context } = await request.json();
    if (!issue) {
      return Response.json({ error: "issue required" }, { status: 400, headers: corsHeaders });
    }

    // Pull case context from D1
    let caseContext = "";
    if (case_id) {
      const caseRecord = await env.DB.prepare("SELECT * FROM cases WHERE id = ?")
        .bind(case_id).first();
      if (caseRecord) {
        caseContext = `Case Number: ${caseRecord.case_number}
Case Type: ${caseRecord.case_type}
Court: ${caseRecord.court || "Washington County Circuit Court"}
Jurisdiction: ${caseRecord.jurisdiction || "Oregon"}`;
      }
    }

    const userPrompt = [
      `LEGAL ISSUE: ${issue}`,
      caseContext ? `\nCASE CONTEXT:\n${caseContext}` : "",
      additional_context ? `\nADDITIONAL CONTEXT:\n${additional_context}` : "",
      "\nReturn only the JSON research report.",
    ].join("");

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: RESEARCHER_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text();
      throw new Error(`Claude API error ${anthropicRes.status}: ${errBody}`);
    }

    const claudeResult = await anthropicRes.json();
    const rawText = claudeResult.content?.[0]?.text || "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Researcher returned no parseable JSON");
    const research = JSON.parse(jsonMatch[0]);

    const timestamp = new Date().toISOString();

    // Persist statutes to D1
    if (case_id && Array.isArray(research.primary_statutes)) {
      const stmts = research.primary_statutes.map((s) =>
        env.DB.prepare(
          `INSERT INTO authorities (id, case_id, citation_type, citation, full_text, issue, source, created_at)
           VALUES (?, ?, 'statute', ?, ?, ?, 'researcher_agent', ?)`
        ).bind(crypto.randomUUID(), case_id, s.citation, s.relevant_text ?? null, issue, timestamp)
      );
      if (stmts.length) await env.DB.batch(stmts);
    }

    // Persist case law
    if (case_id && Array.isArray(research.case_law)) {
      const stmts = research.case_law
        .filter((c) => c.certainty === "high" || c.certainty === "medium")
        .map((c) =>
          env.DB.prepare(
            `INSERT INTO authorities (id, case_id, citation_type, citation, full_text, issue, source, created_at)
             VALUES (?, ?, 'case', ?, ?, ?, 'researcher_agent', ?)`
          ).bind(crypto.randomUUID(), case_id, c.citation, c.holding ?? null, issue, timestamp)
        );
      if (stmts.length) await env.DB.batch(stmts);
    }

    // Agent log
    if (case_id) {
      await env.DB.prepare(
        `INSERT INTO agent_log (id, case_id, document_id, agent, action, result, created_at)
         VALUES (?, ?, null, 'RESEARCHER', 'legal_research', ?, ?)`
      ).bind(
        crypto.randomUUID(), case_id,
        JSON.stringify({
          issue,
          statutes: research.primary_statutes?.length ?? 0,
          cases: research.case_law?.length ?? 0,
          strength: research.strength_assessment,
        }),
        timestamp
      ).run();
    }

    return Response.json({ success: true, case_id, research }, { headers: corsHeaders });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
