import { judgeCardHTML } from './components/judge-card.js';

async function fetchData() {
  const res = await fetch('/assets/data/judges.json');
  if (!res.ok) throw new Error('Data fetch failed');
  return res.json();
}

function renderList(judges) {
  const container = document.getElementById('judge-list');
  if (!container) return;
  container.innerHTML = judges.map(j => judgeCardHTML(j)).join('\n');
}

function setupSearch(allJudges) {
  const input = document.getElementById('judge-search');
  const county = document.getElementById('judge-county-filter');
  function filter() {
    const q = input.value.toLowerCase();
    const c = county.value;
    const filtered = allJudges.filter(j => {
      if (c && c !== 'all' && j.county !== c) return false;
      return j.name.toLowerCase().includes(q) || (j.case_specialization||[]).join(' ').toLowerCase().includes(q) || (j.county||'').toLowerCase().includes(q);
    });
    renderList(filtered);
  }
  input.addEventListener('input', filter);
  county.addEventListener('change', filter);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await fetchData();
    const judges = data.judges || [];
    // populate county filter
    const countySel = document.getElementById('judge-county-filter');
    const counties = Array.from(new Set(judges.map(j => j.county))).sort();
    if (countySel) {
      countySel.innerHTML = '<option value="all">All</option>' + counties.map(c => `<option value="${c}">${c}</option>`).join('');
    }
    renderList(judges);
    setupSearch(judges);
  } catch (err) {
    console.error(err);
  }
});
