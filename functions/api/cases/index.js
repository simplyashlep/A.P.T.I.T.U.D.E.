/**
 * GET  /api/cases        — list cases
 * POST /api/cases        — create case
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare(
      `SELECT c.*,
        (SELECT COUNT(*) FROM documents d WHERE d.case_id = c.id) as document_count,
        (SELECT COUNT(*) FROM events e WHERE e.case_id = c.id) as event_count
       FROM cases c ORDER BY c.created_at DESC LIMIT 50`
    ).all();
    return Response.json({ success: true, cases: results }, { headers: corsHeaders });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { case_number, case_type, court, jurisdiction } = await request.json();
    if (!case_number) {
      return Response.json({ error: "case_number required" }, { status: 400, headers: corsHeaders });
    }
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO cases (id, case_number, case_type, court, jurisdiction, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?)`
    ).bind(id, case_number, case_type ?? "general", court ?? null, jurisdiction ?? "Oregon", timestamp, timestamp).run();
    return Response.json({ success: true, case_id: id }, { headers: corsHeaders });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
