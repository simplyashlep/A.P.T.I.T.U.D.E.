/**
 * POST /api/search
 * Aptitude search — retrieval-grounded answers about institutions and their obligations.
 *
 * Pipeline:
 *   1. Retrieve real decisions from CourtListener (Oregon + federal).
 *   2. Pass ONLY that retrieved material to Gemini as grounding context.
 *   3. Return the answer alongside the sources it was built from.
 *
 * The model is not permitted to invent citations. Anything it cannot support
 * from retrieved material must be labeled unverified. Statutory text (ORS/OAR/
 * CFR) is NOT yet retrieved from a primary source — the response marks statutory
 * assertions accordingly rather than presenting them as confirmed.
 */

const CL_BASE = "https://www.courtlistener.com";
const CL_COURTS = ["scotus", "ca9", "ord", "or", "orctapp"];

const SYSTEM_PROMPT = `You are Aptitude's search engine — a civic intelligence assistant that answers questions about public institutions, their legal obligations, and the behavioral record.

Your scope:
- Public institutions: courts, agencies, law enforcement, housing authorities, credit bureaus, parole/probation, child welfare, administrative bodies
- Oregon law: ORS statutes, ORCP, UTCR, OEC, Oregon Constitution, administrative rules (OAR)
- Federal overlay: FCRA, ADA, IDEA, 42 USC 1983, HUD regulations, ASFA, ICWA
- Institutional accountability: what agencies are authorized to do, what they cannot do, due process requirements, notice obligations, appeal rights

CITATION DISCIPLINE — THIS OVERRIDES EVERYTHING ELSE:
- A block of RETRIEVED SOURCES may be supplied below. Those are real decisions pulled from CourtListener.
- You may state a case holding as established ONLY if that case appears in RETRIEVED SOURCES. Cite it as [S1], [S2], etc. matching the source numbers.
- You may NOT cite any case that does not appear in RETRIEVED SOURCES. Do not reconstruct case names, reporters, or years from memory. If you believe a controlling case exists but it is not in the retrieved set, write: "No authority found in available sources for [proposition]."
- Statutory citations (ORS, OAR, CFR, USC) are NOT retrieved and cannot be verified here. If you reference a statute, mark it inline as "(statute cited from model knowledge — verify against primary source)". Never present an unverified statutory subsection as confirmed text.
- If RETRIEVED SOURCES is empty or irrelevant to the question, say so plainly and answer at the level of general legal framework only, explicitly flagged as unverified.

STYLE:
- Distinguish what is legally required from what is common practice.
- Flag what is contested, unsettled, or jurisdiction-specific.
- Never give individual legal advice — give the framework and what the record shows.
- Direct and specific. Clear paragraphs, headings sparingly.

Aptitude's framing: institutions promise something — their charter, their statute, their mission. Aptitude measures fidelity to that promise. Your answers reflect that accountability lens.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const stripHtml = (s) =>
  (s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * CourtListener allows anonymous access but throttles it hard. An API token
 * raises the ceiling to 5,000 requests/hour. Set COURTLISTENER_TOKEN in the
 * Pages environment to use it; without it, retrieval still works but will be
 * rate-limited under real traffic.
 */
const clHeaders = (env) => {
  const h = {
    Accept: "application/json",
    "User-Agent": "Aptitude/1.0 (contact: edify@pennandpenn.com)",
  };
  if (env.COURTLISTENER_TOKEN) {
    h.Authorization = `Token ${env.COURTLISTENER_TOKEN}`;
  }
  return h;
};

/**
 * Run the generated answer back through CourtListener's citation-lookup
 * endpoint, which parses every citation in a block of text and reports whether
 * it resolves to a real decision. This is the hallucination guardrail: any
 * citation the model produced that does not resolve is surfaced to the reader
 * rather than silently trusted.
 */
async function verifyCitations(text, env) {
  try {
    const res = await fetch(`${CL_BASE}/api/rest/v4/citation-lookup/`, {
      method: "POST",
      headers: { ...clHeaders(env), "Content-Type": "application/json" },
      body: JSON.stringify({ text: String(text).slice(0, 64000) }),
    });
    if (!res.ok) {
      return { ok: false, error: `citation-lookup ${res.status}`, citations: [] };
    }
    const data = await res.json();
    const rows = Array.isArray(data) ? data : [];
    const citations = rows.map((r) => {
      const cluster = Array.isArray(r.clusters) ? r.clusters[0] : null;
      return {
        citation: r.citation,
        resolved: r.status === 200 && !!cluster,
        caseName: cluster?.case_name || null,
        url: cluster?.absolute_url ? `${CL_BASE}${cluster.absolute_url}` : null,
      };
    });
    return { ok: true, error: null, citations };
  } catch (err) {
    return { ok: false, error: err.message, citations: [] };
  }
}

/** Pull candidate decisions from CourtListener. Never throws — retrieval is best-effort. */
async function retrieveCases(query, env) {
  try {
    const params = new URLSearchParams({
      q: query,
      type: "o",
      order_by: "score desc",
      stat_Precedential: "on",
      highlight: "on",
    });
    CL_COURTS.forEach((c) => params.append("court", c));

    const res = await fetch(`${CL_BASE}/api/rest/v4/search/?${params.toString()}`, {
      headers: clHeaders(env),
    });
    if (!res.ok) {
      return { ok: false, error: `CourtListener ${res.status}`, sources: [] };
    }

    const data = await res.json();
    const sources = (data.results || []).slice(0, 6).map((c, i) => ({
      n: i + 1,
      caseName: c.caseName || "Unknown",
      court: c.court_citation_string || c.court || "",
      date: c.dateFiled || "",
      citation: Array.isArray(c.citation) ? c.citation.join(", ") : c.citation || "",
      url: c.absolute_url ? `${CL_BASE}${c.absolute_url}` : null,
      snippet: stripHtml(c.snippet).slice(0, 700),
    }));

    return { ok: true, error: null, sources };
  } catch (err) {
    return { ok: false, error: err.message, sources: [] };
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { query, session_id } = await request.json();
    if (!query?.trim()) {
      return Response.json({ error: "query required" }, { status: 400, headers: corsHeaders });
    }

    // Explicit, actionable failure instead of an opaque 500.
    // This is the most common cause of the search returning an error.
    const q = query.trim();

    // Retrieval remains useful even when the optional answer model is not
    // configured. Return verified CourtListener candidates instead of making
    // the homepage search fail completely.
    if (!env.GEMINI_API_KEY) {
      const retrieval = await retrieveCases(q, env);
      return Response.json(
        {
          success: true,
          degraded: true,
          answer: null,
          degraded_reason: "Answer summaries are not configured on this deployment. Retrieved authority is available below.",
          sources: retrieval.sources,
          grounded: retrieval.sources.length > 0,
          retrieval_error: retrieval.ok ? null : retrieval.error,
          citations_checked: false,
          citations: [],
          unresolved_citations: [],
          statutes_verified: false,
          session_id: session_id || crypto.randomUUID(),
        },
        { headers: corsHeaders }
      );
    }

    const newSessionId = session_id || crypto.randomUUID();

    // ── 1. Retrieve ──────────────────────────────────────────────────────────
    const retrieval = await retrieveCases(q, env);

    const groundingBlock = retrieval.sources.length
      ? retrieval.sources
          .map(
            (s) =>
              `[S${s.n}] ${s.caseName}\n` +
              `Court: ${s.court}\n` +
              `Filed: ${s.date}\n` +
              (s.citation ? `Citation: ${s.citation}\n` : "") +
              `Excerpt: ${s.snippet}`
          )
          .join("\n\n---\n\n")
      : "(none — no decisions were retrieved for this query)";

    const userContent =
      `RETRIEVED SOURCES:\n${groundingBlock}\n\n` +
      `=====\n\nQUESTION: ${q}`;

    // ── 2. Answer, grounded ──────────────────────────────────────────────────
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userContent }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.2 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      const hint =
        geminiRes.status === 400 || geminiRes.status === 403
          ? " — this usually means the GEMINI_API_KEY is invalid or lacks access to gemini-2.0-flash."
          : "";
      throw new Error(`Gemini API error ${geminiRes.status}${hint}: ${errBody.slice(0, 300)}`);
    }

    const geminiResult = await geminiRes.json();
    const answer =
      geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || "No response returned.";

    // ── 3. Verify every citation the model produced ──────────────────────────
    const check = await verifyCitations(answer, env);
    const unresolved = check.citations.filter((c) => !c.resolved);

    return Response.json(
      {
        success: true,          answer,
          sources: retrieval.sources,
        grounded: retrieval.sources.length > 0,
        retrieval_error: retrieval.ok ? null : retrieval.error,
        // Citation guardrail
        citations_checked: check.ok,
        citations: check.citations,
        unresolved_citations: unresolved,
        // Statutes are not retrieved yet — the UI surfaces this to the reader.
        statutes_verified: false,
        session_id: newSessionId,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
