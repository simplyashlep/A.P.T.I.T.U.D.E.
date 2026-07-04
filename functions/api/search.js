/**
 * POST /api/search
 * Aptitude search — answers questions about institutions, statutes, public records
 */

const SYSTEM_PROMPT = `You are Aptitude's search engine — a civic intelligence assistant that answers questions about public institutions, their legal obligations, and the behavioral record.

Your scope:
- Public institutions: courts, agencies, law enforcement, housing authorities, credit bureaus, parole/probation, child welfare, administrative bodies
- Oregon law: ORS statutes, ORCP, UTCR, OEC, Oregon Constitution, administrative rules (OAR)
- Federal overlay: FCRA, ADA, IDEA, 42 USC 1983, HUD regulations, ASFA, ICWA
- Institutional accountability: what agencies are authorized to do, what they cannot do, due process requirements, notice obligations, appeal rights
- Behavioral patterns: disparity data, oversight gaps, audit findings, enforcement records

HARD RULES:
- Cite specific statutes, rules, or documented sources when stating legal requirements
- Distinguish between what is legally required vs. what is common practice
- Flag when something is contested, unsettled, or jurisdiction-specific
- Never give individual legal advice — provide the legal framework and what the record shows
- Be direct and specific. Do not give generic disclaimers.
- Format responses in clear paragraphs. Use headings sparingly. Keep it readable.
- If you cite a statute, give the specific ORS section or CFR citation, not just "Oregon law says..."

Aptitude's framing: institutions promise something — their charter, their statute, their mission. Aptitude measures fidelity to that promise. Your answers should reflect this accountability lens.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { query, session_id } = await request.json();
    if (!query?.trim()) {
      return Response.json({ error: "query required" }, { status: 400, headers: corsHeaders });
    }

    const newSessionId = session_id || crypto.randomUUID();

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: query.trim() }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.4 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      throw new Error(`Gemini API error ${geminiRes.status}: ${errBody}`);
    }

    const geminiResult = await geminiRes.json();
    const answer = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || "No response returned.";

    return Response.json(
      { success: true, answer, session_id: newSessionId },
      { headers: corsHeaders }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
