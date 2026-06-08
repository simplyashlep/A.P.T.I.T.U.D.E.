const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};
 
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
 
export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const p = url.searchParams;
 
    const county    = p.get('county')    || null;
    const category  = p.get('category')  || null;
    const riskLevel = p.get('riskLevel') || null;
    const district  = p.get('district')  || null;
    const q         = p.get('q')         || null;
    const limit     = Math.min(parseInt(p.get('limit')  || '50', 10), 200);
    const offset    = parseInt(p.get('offset') || '0', 10);
 
    const conditions = [];
    const bindings   = [];
 
    if (county)    { conditions.push('LOWER(county) = LOWER(?)');   bindings.push(county); }
    if (category)  { conditions.push('LOWER(category) = LOWER(?)'); bindings.push(category); }
    if (riskLevel) { conditions.push('risk_level = ?');             bindings.push(riskLevel); }
    if (district)  { conditions.push('district = ?');               bindings.push(parseInt(district, 10)); }
    if (q) {
      conditions.push('(LOWER(name) LIKE LOWER(?) OR LOWER(county) LIKE LOWER(?))');
      bindings.push(`%${q}%`, `%${q}%`);
    }
 
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
 
    const countSql = `SELECT COUNT(*) as total FROM judges ${where}`;
    const dataSql  = `SELECT * FROM judges ${where} ORDER BY county ASC, name ASC LIMIT ? OFFSET ?`;
 
    const [countResult, dataResult] = await Promise.all([
      env.DB.prepare(countSql).bind(...bindings).first(),
      env.DB.prepare(dataSql).bind(...bindings, limit, offset).all(),
    ]);
 
    const total = countResult?.total ?? 0;
    const rows  = (dataResult?.results ?? []).map(normalize);
 
    return new Response(
      JSON.stringify({ judges: rows, total, limit, offset }),
      { status: 200, headers: CORS }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: CORS }
    );
  }
}
 
function normalize(row) {
  return {
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
  };
}
 