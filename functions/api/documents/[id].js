/**
 * GET /api/documents/:id
 * Returns document record with all extracted events, quotes, authorities
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestGet(context) {
  const { env, params } = context;
  const id = params.id;

  try {
    const doc = await env.DB.prepare("SELECT * FROM documents WHERE id = ?").bind(id).first();
    if (!doc) {
      return Response.json({ error: "Document not found" }, { status: 404, headers: corsHeaders });
    }

    const [eventsResult, quotesResult, authoritiesResult, logResult] = await Promise.all([
      env.DB.prepare("SELECT * FROM events WHERE document_id = ? ORDER BY event_date ASC").bind(id).all(),
      env.DB.prepare("SELECT * FROM quotes WHERE document_id = ? ORDER BY page_number ASC").bind(id).all(),
      env.DB.prepare("SELECT * FROM authorities WHERE case_id = ?").bind(doc.case_id).all(),
      env.DB.prepare(
        "SELECT * FROM agent_log WHERE document_id = ? ORDER BY created_at DESC"
      ).bind(id).all(),
    ]);

    return Response.json(
      {
        success: true,
        document: doc,
        events: eventsResult.results,
        quotes: quotesResult.results,
        authorities: authoritiesResult.results,
        agent_log: logResult.results,
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
