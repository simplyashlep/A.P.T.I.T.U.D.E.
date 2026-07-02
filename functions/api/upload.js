/**
 * POST /api/upload
 * Evidence Clerk Agent — receives file, stores to R2, creates D1 records
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const caseNumber = formData.get("case_number") || "unassigned";
    const caseType = formData.get("case_type") || "general";

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400, headers: corsHeaders });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|txt)$/i)) {
      return Response.json(
        { error: "Unsupported file type. Upload PDF, DOCX, or TXT." },
        { status: 400, headers: corsHeaders }
      );
    }

    const timestamp = new Date().toISOString();
    const docId = crypto.randomUUID();

    // Find or create case
    let caseId;
    const existingCase = await env.DB.prepare(
      "SELECT id FROM cases WHERE case_number = ?"
    ).bind(caseNumber).first();

    if (existingCase) {
      caseId = existingCase.id;
    } else {
      caseId = crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO cases (id, case_number, case_type, status, created_at, updated_at)
         VALUES (?, ?, ?, 'active', ?, ?)`
      ).bind(caseId, caseNumber, caseType, timestamp, timestamp).run();
    }

    // Store file to R2
    const fileBuffer = await file.arrayBuffer();
    const r2Key = `cases/${caseId}/${docId}/${file.name}`;

    await env.DOCUMENTS.put(r2Key, fileBuffer, {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
      customMetadata: { originalName: file.name, caseId, docId },
    });

    // SHA-256 hash for chain of custody
    const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
    const sha256 = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Document record
    await env.DB.prepare(
      `INSERT INTO documents (id, case_id, filename, r2_key, doc_type, source_type, sha256_hash, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'user_upload', ?, 'uploaded', ?)`
    ).bind(docId, caseId, file.name, r2Key, file.type, sha256, timestamp).run();

    // Agent log
    await env.DB.prepare(
      `INSERT INTO agent_log (id, case_id, document_id, agent, action, result, created_at)
       VALUES (?, ?, ?, 'EVIDENCE_CLERK', 'file_stored', ?, ?)`
    ).bind(
      crypto.randomUUID(), caseId, docId,
      JSON.stringify({ r2_key: r2Key, size: fileBuffer.byteLength, sha256 }),
      timestamp
    ).run();

    return Response.json(
      { success: true, case_id: caseId, document_id: docId, filename: file.name, sha256 },
      { headers: corsHeaders }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
