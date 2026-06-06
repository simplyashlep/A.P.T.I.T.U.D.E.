# Incident Intake Demo — Aptitude Brain (Static Preview)

This page simulates the end-to-end brain pipeline on the live static site.

Enter a narrative (misidentification / false arrest example pre-filled). Click **Process** to see the exact output shape the real `/api/incident/submit` produces (structured event + classification + graph + retrieval + procedural pathways + full audit trail).

In production this will POST to the deployed FastAPI brain and render rich visualizations (graph, timeline, step-by-step procedures).

## Try It

<textarea id="narrative" rows="8" style="width:100%; font-family:monospace;">
I was pulled over and arrested because of a warrant for 'John Smith' with a similar birthdate. The officers did not compare my ID photo or fingerprints to the warrant subject. I spent 14 hours in jail before they realized the mistake and released me. This happened in Multnomah County, Oregon.
</textarea>

<button onclick="processIncident()">Process through Aptitude Brain</button>

<div id="result" style="margin-top:2em; white-space:pre-wrap; background:#f8f8f8; padding:1em; border:1px solid #ccc; font-family:monospace; display:none;"></div>

<script>
async function processIncident() {
  const text = document.getElementById('narrative').value.trim();
  const out = document.getElementById('result');
  out.style.display = 'block';
  out.textContent = 'Running Aptitude Brain pipeline (Intake → Classify → Graph → Retrieve → Procedural)...\n\n';

  // Simulated deterministic output matching the real orchestrator on aptitude-emergent
  // (In the real integration this will be the JSON from POST /api/incident/submit)
  const demoResult = {
    incident_id: 'demo-' + Date.now().toString(36),
    workflow_id: 'wf-' + Math.random().toString(36).slice(2),
    structured_event: {
      event_id: 'evt-' + Math.random().toString(36).slice(2),
      event_type: 'warrant_misidentification_arrest',
      narrative_raw: text,
      jurisdiction: { state: 'Oregon', county: 'Multnomah' },
      actors: [{ type: 'law_enforcement', role: 'arresting_officer' }],
      timeline: [{ ts: 'reported', event: 'arrest/detention occurred' }],
      legal_signals: { rights_implicated: ['fourth_amendment', 'due_process'], procedural_triggers: ['identity_verification_failure'] },
      uncertainty: []
    },
    classification: {
      claims: ['false_arrest', 'unlawful_detention', 'civil_rights_violation_42usc1983'],
      doctrines: ['probable_cause_standard', 'seizure_under_fourth_amendment', 'qualified_immunity_framework'],
      confidence_scores: { false_arrest: 0.78, civil_rights_violation_42usc1983: 0.71 }
    },
    graph: {
      nodes: [ {id:'n1', node_type:'Event', label:'warrant_misidentification_arrest'}, {id:'n2', node_type:'Claim', label:'false_arrest'}, {id:'n3', node_type:'Remedy', label:'section_1983_civil_action'} ],
      edges: [ {from_node:'n1', to_node:'n2', edge_type:'supports', weight:0.8}, {from_node:'n2', to_node:'n3', edge_type:'resolved_by', weight:0.7} ]
    },
    retrieval: { top_k: [ {source_type:'statute', text:'Supporting material for claim false_arrest under Fourth Amendment and ORS...'} ] },
    procedural: { pathways: [ {path:'section_1983_civil_action', steps: ['File complaint in US District Court (Oregon)...', 'Establish under color of law + deprivation...', 'Overcome qualified immunity...'], prerequisites: ['detailed factual pleading of misidentification'] } ] },
    audit_trail: [
      {agent:'intake_parser', input_hash:'a1b2c3...', output_hash:'d4e5f6...', version:'0.1.0', jurisdiction:'Oregon'},
      {agent:'legal_classifier', input_hash:'...', output_hash:'...', version:'0.1.0'},
      {agent:'graph_seeder', input_hash:'...', output_hash:'...', version:'0.1.0'},
      {agent:'vector_retrieval', input_hash:'...', output_hash:'...', version:'0.1.0'},
      {agent:'procedural_engine', input_hash:'...', output_hash:'...', version:'0.1.0'}
    ],
    status: 'COMPLETE'
  };

  out.textContent = JSON.stringify(demoResult, null, 2);

  // TODO real integration: fetch('/api/incident/submit', {method:'POST', body: JSON.stringify({text, jurisdiction:{state:'Oregon'}})}).then(r => r.json()).then(j => out.textContent = JSON.stringify(j, null, 2));
}
</script>

## What This Demonstrates
- The exact data model from the Technical Manual (Legal Event Object, relational schema, graph nodes/edges).
- The 5-agent pipeline output contract.
- Full auditability (every transformation hashed and versioned).
- Immediate readiness for the real backend (just replace the static demoResult with a fetch to the deployed brain API).

Once the FastAPI brain (on the `aptitude-emergent` branch) is deployed alongside this site, this demo will become a live form that returns real structured legal intelligence, graph expansion, and procedural pathways for any submitted narrative.

See [APTITUDE-BRAIN.md](./APTITUDE-BRAIN.md) for the complete architecture and [the full Technical Manual LaTeX](./docs/system_architecture.tex) (or the source in the repo) for every rule, prompt, and invariant.
