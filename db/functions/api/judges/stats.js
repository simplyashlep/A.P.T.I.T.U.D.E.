const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};
 
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
 
export async function onRequestGet({ env }) {
  try {
    const [total, riskRows, categoryRows, countyRows, avgRow] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as total FROM judges').first(),
      env.DB.prepare(
        'SELECT risk_level, COUNT(*) as count FROM judges GROUP BY risk_level ORDER BY count DESC'
      ).all(),
      env.DB.prepare(
        'SELECT category, COUNT(*) as count FROM judges GROUP BY category ORDER BY count DESC'
      ).all(),
      env.DB.prepare(
        'SELECT county, COUNT(*) as count FROM judges GROUP BY county ORDER BY county ASC'
      ).all(),
      env.DB.prepare(
        'SELECT AVG(score) as avg_score FROM judges WHERE score IS NOT NULL'
      ).first(),
    ]);
 
    return new Response(
      JSON.stringify({
        total:             total?.total ?? 0,
        riskBreakdown:     riskRows?.results ?? [],
        categoryBreakdown: categoryRows?.results ?? [],
        countyBreakdown:   countyRows?.results ?? [],
        averageScore:      avgRow?.avg_score ?? null,
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