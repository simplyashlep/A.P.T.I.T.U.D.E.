/**
 * POST /api/analyze
 * Analyst Agent — reads document from R2, sends to Claude, stores structured results to D1
 */

const ANALYST_SYSTEM_PROMPT = `You are the Analyst agent for Aptitude — a civic legal intelligence platform.

Your role: extract and structure the factual record from legal documents. You are a records analyst FIRST and a legal reasoning assistant SECOND.

HARD RULES:
- Never invent facts not explicitly in the document
- Every extracted event and quote must cite a page number
- Treat allegations as allegations, not established facts
- If you cannot determine something, use null — never guess
- Never merge cases or import facts from outside the document
- Source type classification: court_record | discovery | correspondence | filing | user_upload

Return ONLY valid JSON in this exact structure — no prose, no markdown, just the JSON object:

{
  "document_type": "string",
  "parties": [{ "name": "string", "role": "string" }],
  "case_numbers": ["string"],
  "court": "string or null",
  "jurisdiction": "string or null",
  "date_range": { "earliest": "string or null", "latest": "string or null" },
  "summary": "string (3-5 sentences, factual only, no legal conclusions)",
  "key_issues": ["string"],
  "events": [
    {
      "date": "string or null",
      "event_type": "string",
      "actors": ["string"],
      "page": "number or null",
      "quote": "string (exact language — never paraphrase inside quote fields)",
      "legal_effect": "string or null"
    }
  ],
  "notable_quotes": [
    { "text": "string", "page": "number or null", "category": "string" }
  ],
  "missing_elements": ["string"],
  "flags": ["string (procedural anomalies, missed deadlines, contradictions, access denials)"],
  "source_type": "court_record | discovery | correspondence | filing | user_upload",
  "recommended_next": ["Researcher", "Draft Counsel", "Informer"]
}`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { document_id } = await request.json();
    if (!document_id) {
      return Response.json({ error: "document_id required" }, { status: 400, headers: corsHeaders });
    }

    // Fetch document record
    const doc = await env.DB.prepare("SELECT * FROM documents WHERE id = ?")
      .bind(document_id).first();
    if (!doc) {
      return Response.json({ error: "Document not found" }, { status: 404, headers: corsHeaders });
    }

    // Fetch from R2
    const r2Object = await env.DOCUMENTS.get(doc.r2_key);
    if (!r2Object) {
      return Response.json({ error: "File not found in storage" }, { status: 404, headers: corsHeaders });
    }

    const fileBuffer = await r2Object.arrayBuffer();
    // Chunked base64 — spreading a large Uint8Array as args overflows the call stack
    const bytes = new Uint8Array(fileBuffer);
    let binary = "";
    const CHUNK = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    const base64 = btoa(binary);

    const isPDF = doc.doc_type === "application/pdf" || doc.filename?.toLowerCase().endsWith(".pdf");
    const isText = doc.doc_type === "text/plain" || doc.filename?.toLowerCase().endsWith(".txt");

    // Build message content
    let messageContent;
    if (isPDF) {
      messageContent = [
        {
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: base64 },
        },
        { type: "text", text: "Analyze this document. Return only the JSON object." },
      ];
    } else {
      const text = isText
        ? new TextDecoder().decode(new Uint8Array(fileBuffer))
        : new TextDecoder().decode(new Uint8Array(fileBuffer));
      messageContent = [
        { type: "text", text: `Analyze this document:\n\n${text}\n\nReturn only the JSON object.` },
      ];
    }

    // Call Claude
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "pdfs-2024-09-25",
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 4096,
        system: ANALYST_SYSTEM_PROMPT,
        messages: [{ role: "user", content: messageContent }],
      }),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text();
      throw new Error(`Claude API error ${anthropicRes.status}: ${errBody}`);
    }

    const claudeResult = await anthropicRes.json();
    const rawText = claudeResult.content?.[0]?.text || "";

    // Extract JSON
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Analyst returned no parseable JSON");
    const analysis = JSON.parse(jsonMatch[0]);

    const timestamp = new Date().toISOString();

    // Persist events
    if (Array.isArray(analysis.events)) {
      const stmts = analysis.events.map((ev) =>
        env.DB.prepare(
          `INSERT INTO events (id, case_id, document_id, page_number, event_type, event_date, actors, quote, legal_effect, confidence, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'analyst_extracted', ?)`
        ).bind(
          crypto.randomUUID(), doc.case_id, document_id,
          ev.page ?? null, ev.event_type ?? null, ev.date ?? null,
          JSON.stringify(ev.actors ?? []), ev.quote ?? null,
          ev.legal_effect ?? null, timestamp
        )
      );
      if (stmts.length) await env.DB.batch(stmts);
    }

    // Persist quotes
    if (Array.isArray(analysis.notable_quotes)) {
      const stmts = analysis.notable_quotes.map((q) =>
        env.DB.prepare(
          `INSERT INTO quotes (id, document_id, page_number, quote_text, category, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(
          crypto.randomUUID(), document_id,
          q.page ?? null, q.text ?? null, q.category ?? null, timestamp
        )
      );
      if (stmts.length) await env.DB.batch(stmts);
    }

    // Update document status
    await env.DB.prepare("UPDATE documents SET status = 'analyzed' WHERE id = ?")
      .bind(document_id).run();

    // Agent log
    await env.DB.prepare(
      `INSERT INTO agent_log (id, case_id, document_id, agent, action, result, created_at)
       VALUES (?, ?, ?, 'ANALYST', 'document_analyzed', ?, ?)`
    ).bind(
      crypto.randomUUID(), doc.case_id, document_id,
      JSON.stringify({ issues: analysis.key_issues?.length ?? 0, events: analysis.events?.length ?? 0, flags: analysis.flags?.length ?? 0 }),
      timestamp
    ).run();

    return Response.json({ success: true, document_id, case_id: doc.case_id, analysis }, { headers: corsHeaders });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
