/**
 * GET /api/caselaw
 * Case law search — CourtListener REST API v4 + Gemini Flash summaries
 *
 * Query params:
 *   q        — search query (required)
 *   scope    — "federal" | "oregon" | "all"  (default: federal)
 *   date_min — YYYY-MM-DD
 *   date_max — YYYY-MM-DD
 *   page     — page number (default 1)
 */

const CL_BASE = "https://www.courtlistener.com";

// CourtListener court IDs by scope
const COURT_PRESETS = {
  federal: ["scotus", "ca9", "ord"],
  oregon: ["or", "orctapp"],
  all: ["scotus", "ca9", "ord", "or", "orctapp"],
};

const SUMMARY_SYSTEM = `You are a legal research assistant for Aptitude, an institutional accountability platform focused on Oregon. Your users are self-represented litigants, advocates, and attorneys working on civil rights, child welfare, housing, and criminal matters.

Given a JSON array of case law search results, return a JSON array of the same length with enrichment for each case.

For each case produce:
- plain_summary: 2–3 sentences in plain English. What happened, what the institution did or failed to do, what the court decided. Write for a non-lawyer.
- institutional_burden: One direct sentence. What was the institution (agency, police, landlord, creditor, school district, etc.) legally required to prove, provide, or refrain from doing in this case?
- best_quote: The single most useful quote from the snippet for someone asserting their rights against an institution. Pull exact language from the snippet. Return null if no strong quote exists.
- failure_mode: Exactly one tag from this list: documentation_failure | notice_failure | timing_failure | evidentiary_failure | due_process_failure | excessive_force | fourth_amendment | first_amendment | equal_protection | reasonable_efforts | section_1983 | other

Return ONLY a valid JSON array. No markdown, no code fences, no explanation. Same count and order as input. Example format:
[{"index":0,"plain_summary":"...","institutional_burden":"...","best_quote":"...","failure_mode":"..."}]`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();

  if (!q) {
    return Response.json({ error: "q required" }, { status: 400, headers: corsHeaders });
  }

  const scope = url.searchParams.get("scope") || "federal";
  const courts = COURT_PRESETS[scope] || COURT_PRESETS.federal;
  const dateMin = url.searchParams.get("date_min");
  const dateMax = url.searchParams.get("date_max");
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  try {
    // Build CourtListener v4 search request
    const clParams = new URLSearchParams({
      q,
      type: "o",
      order_by: "score desc",
      stat_Precedential: "on",
      highlight: "on",
    });

    courts.forEach((c) => clParams.append("court", c));
    if (dateMin) clParams.set("filed_after", dateMin);
    if (dateMax) clParams.set("filed_before", dateMax);
    if (page > 1) clParams.set("page", String(page));

    const clRes = await fetch(
      `${CL_BASE}/api/rest/v4/search/?${clParams.toString()}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Aptitude/1.0 (contact: edify@pennandpenn.com)",
        },
      }
    );

    if (!clRes.ok) {
      const errText = await clRes.text();
      throw new Error(`CourtListener ${clRes.status}: ${errText.slice(0, 200)}`);
    }

    const clData = await clRes.json();
    const results = clData.results || [];

    if (results.length === 0) {
      return Response.json(
        { success: true, count: 0, query: q, results: [], next: null },
        { headers: corsHeaders }
      );
    }

    // Strip HTML from snippets for Gemini input
    const stripHtml = (s) =>
      (s || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 600);

    // Prepare compact batch payload for Gemini
    const casesForSummary = results.map((c, i) => ({
      index: i,
      caseName: c.caseName || "Unknown",
      snippet: stripHtml(c.snippet),
      court: c.court_citation_string || c.court || "",
      date: c.dateFiled || "",
    }));

    // Batch summarize all results in one Gemini call
    let summaries = [];
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SUMMARY_SYSTEM }] },
            contents: [
              {
                role: "user",
                parts: [{ text: JSON.stringify(casesForSummary) }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 4096,
              temperature: 0.1,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) summaries = parsed;
        }
      }
    } catch (_) {
      // Summarization failure is non-fatal — degrade to raw snippets
    }

    // Convert CourtListener snippets: swap <mark> for bold markers
    const formatSnippet = (s) =>
      (s || "")
        .replace(/<mark>/g, "**")
        .replace(/<\/mark>/g, "**")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();

    // Merge CourtListener results with Gemini summaries
    const enriched = results.map((c, i) => {
      const summary = summaries.find((s) => s.index === i) || {};
      return {
        id: c.id,
        caseName: c.caseName,
        court: c.court,
        court_label: c.court_citation_string || c.court,
        date: c.dateFiled,
        status: c.status || "Published",
        citation: Array.isArray(c.citation) ? c.citation.join(", ") : c.citation || "",
        url: `${CL_BASE}${c.absolute_url}`,
        snippet: formatSnippet(c.snippet),
        score: c.score,
        // Gemini enrichment
        plain_summary: summary.plain_summary || null,
        institutional_burden: summary.institutional_burden || null,
        best_quote: summary.best_quote || null,
        failure_mode: summary.failure_mode || null,
      };
    });

    return Response.json(
      {
        success: true,
        count: clData.count || enriched.length,
        query: q,
        scope,
        results: enriched,
        next: clData.next ? page + 1 : null,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
