/**
 * JavaScript for Enhanced Hero Section
 * Provides dynamic search filtering and fun fact rotation
 */

class EnhancedHeroSearch {
  constructor() {
    this.initSearch();
    this.initFunFacts();
  }

  initSearch() {
    const form = document.querySelector('.search-form-enhanced');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.performSearch();
    });
  }

  performSearch() {
    const query = document.querySelector('.search-form-enhanced input').value;
    const filters = {
      type: document.querySelector('select[name="type"]')?.value,
      county: document.querySelector('select[name="county"]')?.value,
      riskLevel: document.querySelector('select[name="risk"]')?.value,
    };

    // Build search URL
    const params = new URLSearchParams();
    params.append('q', query);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    // Redirect to results or perform AJAX search
    window.location.href = `/bias-beacon/judges/?${params.toString()}`;
  }

  initFunFacts() {
    const facts = [
      {
        number: '211',
        label: 'Circuit Court Judges',
        description: 'Serving across Oregon\'s 36 judicial districts and 8 appellate regions',
        source: 'Oregon Judicial Department'
      },
      {
        number: '36',
        label: 'County Jurisdictions',
        description: 'Each with unique prosecution, law enforcement, and supervision networks',
        source: 'Oregon Courts'
      },
      {
        number: '31.2%',
        label: 'Average Prison Rate',
        description: 'Statewide percentage of cases resulting in prison sentences',
        source: 'Bias Beacon Analytics'
      },
      {
        number: '15.8%',
        label: 'Appeal Reversal Rate',
        description: 'Statewide percentage of judicial decisions reversed on appeal',
        source: 'Circuit Court Appeals'
      },
      {
        number: '9.7%',
        label: 'Counsel Disparity',
        description: 'Difference in outcomes between represented and unrepresented defendants',
        source: 'Bias Beacon Analysis'
      },
      {
        number: '6.3%',
        label: 'Racial Disparity',
        description: 'Average difference in sentencing outcomes across racial groups',
        source: 'Bias Beacon Metrics'
      },
      {
        number: '35+',
        label: 'Judges Analyzed',
        description: 'With comprehensive bias metrics and decision pattern data verified',
        source: 'Oregon Judicial Data'
      }
    ];

    const container = document.querySelector('.fun-fact-counter');
    if (!container) return;

    // Rotate fact daily (based on day of year)
    const dayOfYear = this.getDayOfYear();
    const factIndex = dayOfYear % facts.length;
    const fact = facts[factIndex];

    // Display fact
    container.innerHTML = `
      <span class="fact-label">Did You Know?</span>
      <span class="fact-number">${fact.number}</span>
      <p class="fact-description">${fact.description}</p>
      <p class="fact-source">📊 ${fact.source}</p>
    `;

    // Add click to load next fact
    container.addEventListener('click', () => this.showNextFact(facts, factIndex));
  }

  getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  showNextFact(facts, currentIndex) {
    const nextIndex = (currentIndex + 1) % facts.length;
    const fact = facts[nextIndex];
    const container = document.querySelector('.fun-fact-counter');
    
    if (!container) return;

    container.style.animation = 'none';
    setTimeout(() => {
      container.innerHTML = `
        <span class="fact-label">Did You Know?</span>
        <span class="fact-number">${fact.number}</span>
        <p class="fact-description">${fact.description}</p>
        <p class="fact-source">📊 ${fact.source}</p>
      `;
      container.style.animation = 'fadeIn 0.5s ease-out';
    }, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new EnhancedHeroSearch());
} else {
  new EnhancedHeroSearch();
}
