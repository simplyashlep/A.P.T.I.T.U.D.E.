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

    const county    = p.get('county')                       || null;
    const category  = p.get('category')                     || null;
    // Accept both param names — Judiciary.jsx sends 'risk', API contract is 'riskLevel'
    const riskLevel = p.get('riskLevel') || p.get('risk')   || null;
    const district  = p.get('district')                     || null;
    const q         = p.get('q')                            || null;
    const limit     = Math.min(parseInt(p.get('limit')  || '50', 10), 200);
    const offset    = parseInt(p.get('offset') || '0', 10);

    const conditions = [];
    const bindings   = [];

    if (county)    { conditions.push('LOWER(county) = LOWER(?)');    bindings.push(county); }
    if (category)  { conditions.push('LOWER(category) = LOWER(?)');  bindings.push(category); }
    if (riskLevel) { conditions.push('risk_level = ?');               bindings.push(riskLevel); }
    if (district)  { conditions.push('district = ?');                 bindings.push(parseInt(district, 10)); }
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

/** snake_case → camelCase for a single key */
function toCamel(str) {
  return str.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * Normalizes a D1 row for the client.
 * - Converts all snake_case keys to camelCase (so DB column `risk_level` → `riskLevel`, etc.)
 * - Coerces integer booleans to real booleans
 * - JSON-parses `flags` and `sourceNotes`
 */
function normalize(row) {
  // Convert every snake_case key to camelCase
  const camel = {};
  for (const [k, v] of Object.entries(row)) {
    camel[toCamel(k)] = v;
  }

  return {
    ...camel,
    // Coerce SQLite integer 0/1 → boolean
    isPresiding:     Boolean(camel.isPresiding),
    metricsVerified: Boolean(camel.metricsVerified),
    // JSON columns
    flags: (() => {
      try { return JSON.parse(camel.flags || '[]'); }
      catch { return []; }
    })(),
    sourceNotes: (() => {
      try { return JSON.parse(camel.sourceNotes || 'null'); }
      catch { return null; }
    })(),
  };
}
