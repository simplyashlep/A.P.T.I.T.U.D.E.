const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};
 
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
 
export async function onRequestGet({ params, env }) {
  try {
    const { id } = params;
 
    // Try id string, then official_id (numeric), then name_key
    let row = await env.DB.prepare('SELECT * FROM judges WHERE id = ?').bind(id).first();
 
    if (!row && /^\d+$/.test(id)) {
      row = await env.DB.prepare('SELECT * FROM judges WHERE official_id = ?')
        .bind(parseInt(id, 10))
        .first();
    }
 
    if (!row) {
      row = await env.DB.prepare('SELECT * FROM judges WHERE name_key = ?')
        .bind(id.toLowerCase())
        .first();
    }
 
    if (!row) {
      return new Response(
        JSON.stringify({ error: 'Judge not found' }),
        { status: 404, headers: CORS }
      );
    }
 
    return new Response(
      JSON.stringify({
        ...row,
        is_presiding:     Boolean(row.is_presiding),
        metrics_verified: Boolean(row.metrics_verified),
        flags: (() => {
          try { return JSON.parse(row.flags || '[]'); }
          catch { return []; }
        })(),
        source_notes: (() => {
          try { return JSON.parse(row.source_notes || 'null'); }
          catch { return null; }
        })(),
      }),
      { status: 200, headers: CORS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: CORS }
    );
  }
}