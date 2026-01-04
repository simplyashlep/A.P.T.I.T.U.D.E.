/**
 * Flip Card Manager for Bias Beacon
 * Handles search, filtering, sorting, and rendering of flip cards
 */

import { flipCardHTML, simpleCardHTML } from '../components/flip-card.js';
import { BiasScoreCalculator } from './bias-score-calculator.js';

export class FlipCardManager {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.judges = [];
    this.filteredJudges = [];
    this.options = {
      sortBy: 'score',         // 'score', 'name', 'county'
      sortOrder: 'desc',       // 'asc', 'desc'
      countyFilter: 'all',
      levelFilter: 'all',
      searchTerm: '',
      ...options
    };

    this.init();
  }

  async init() {
    if (!this.container) {
      console.warn('FlipCardManager: Container not found');
      return;
    }

    // Bind event listeners
    this.bindEventListeners();

    // Try to load judge data from DOM first (Jekyll-rendered), then fallback to JSON
    this.loadJudgesFromDOM() || await this.loadJudgesFromJSON();

    // Initial render
    this.applyFiltersAndRender();
  }

  /**
   * Load judge data from DOM elements (for Jekyll-rendered pages)
   */
  loadJudgesFromDOM() {
    const judgeCards = document.querySelectorAll('.judge-card[data-id]');
    if (judgeCards.length === 0) return false;

    this.judges = Array.from(judgeCards).map(card => {
      // Extract data from DOM elements
      const id = card.dataset.id;
      const name = card.dataset.name || card.querySelector('.judge-name')?.textContent?.trim();
      const county = card.dataset.county;
      const risk = card.dataset.risk;
      const department = card.dataset.department;

      // Get metrics from card
      const prisonRate = this.extractMetric(card, 'Prison Rate');
      const racialDisparity = this.extractMetric(card, 'Racial Disparity');
      const counselDisparity = this.extractMetric(card, 'Counsel Disparity');
      const reversalRate = this.extractMetric(card, 'Reversal Rate');

      // Get specializations
      const specEl = card.querySelector('.specialization');
      const specialization = specEl
        ? specEl.textContent.replace('Specializes in:', '').trim().split(', ')
        : [];

      // Get accountability flags
      const flags = [];
      card.querySelectorAll('.accountability_flags li, .disparity-alerts .disparity-item').forEach(li => {
        flags.push(li.textContent.trim());
      });

      return {
        id,
        name,
        county: county?.charAt(0).toUpperCase() + county?.slice(1),
        department,
        risk_assessment: risk,
        bias_metrics: {
          prison_rate: parseFloat(prisonRate) || 0,
          sentence_disparity: {
            racial: { disparity_score: parseFloat(racialDisparity) || 0 },
            counsel_representation: { disparity_score: parseFloat(counselDisparity) || 0 }
          }
        },
        appellate_record: {
          reversal_rate: parseFloat(reversalRate) || 0
        },
        specialization,
        accountability_flags: flags.length > 0 ? flags : undefined
      };
    });

    console.log(`FlipCardManager: Loaded ${this.judges.length} judges from DOM`);
    return this.judges.length > 0;
  }

  extractMetric(card, label) {
    const metricItems = card.querySelectorAll('.metric-item, .bias-metric');
    for (const item of metricItems) {
      if (item.textContent.includes(label)) {
        const value = item.querySelector('.metric-value, .bias-score');
        return value?.textContent?.replace('%', '').trim() || '0';
      }
    }
    return '0';
  }

  /**
   * Load judge data from JSON API
   */
  async loadJudgesFromJSON() {
    try {
      const response = await fetch('/assets/data/judges.json');
      if (!response.ok) throw new Error('Failed to fetch judges');
      const data = await response.json();
      this.judges = data.judges || [];
      console.log(`FlipCardManager: Loaded ${this.judges.length} judges from JSON`);
    } catch (error) {
      console.error('FlipCardManager: Error loading judges', error);
      this.judges = [];
    }
  }

  /**
   * Bind event listeners for search and filter controls
   */
  bindEventListeners() {
    // Search input
    const searchInput = document.getElementById('judge-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.options.searchTerm = e.target.value.toLowerCase();
        this.applyFiltersAndRender();
      });
    }

    // County filter
    const countyFilter = document.getElementById('county-filter');
    if (countyFilter) {
      countyFilter.addEventListener('change', (e) => {
        this.options.countyFilter = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // Risk/Level filter
    const riskFilter = document.getElementById('risk-filter');
    if (riskFilter) {
      riskFilter.addEventListener('change', (e) => {
        this.options.levelFilter = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // Sort controls
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.options.sortBy = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    const sortOrderBtn = document.getElementById('sort-order');
    if (sortOrderBtn) {
      sortOrderBtn.addEventListener('click', () => {
        this.options.sortOrder = this.options.sortOrder === 'desc' ? 'asc' : 'desc';
        sortOrderBtn.textContent = this.options.sortOrder === 'desc' ? '↓' : '↑';
        this.applyFiltersAndRender();
      });
    }

    // View toggle (grid vs list)
    const viewToggle = document.getElementById('view-toggle');
    if (viewToggle) {
      viewToggle.addEventListener('click', () => {
        this.container.classList.toggle('list-view');
        viewToggle.textContent = this.container.classList.contains('list-view') ? 'Grid' : 'List';
      });
    }
  }

  /**
   * Apply all filters and sorting, then render
   */
  applyFiltersAndRender() {
    // Start with all judges
    let filtered = [...this.judges];

    // Apply search filter
    if (this.options.searchTerm) {
      const term = this.options.searchTerm.toLowerCase();
      filtered = filtered.filter(j => {
        const name = (j.name || '').toLowerCase();
        const county = (j.county || '').toLowerCase();
        const specializations = (j.specialization || []).join(' ').toLowerCase();
        return name.includes(term) || county.includes(term) || specializations.includes(term);
      });
    }

    // Apply county filter
    if (this.options.countyFilter && this.options.countyFilter !== 'all') {
      filtered = filtered.filter(j =>
        (j.county || '').toLowerCase() === this.options.countyFilter.toLowerCase()
      );
    }

    // Apply level/risk filter
    if (this.options.levelFilter && this.options.levelFilter !== 'all') {
      filtered = filtered.filter(j => {
        const score = BiasScoreCalculator.calculate(j);
        return score.level === this.options.levelFilter;
      });
    }

    // Apply sorting
    filtered = this.sortJudges(filtered);

    this.filteredJudges = filtered;
    this.render();
    this.updateResultsCount();
  }

  /**
   * Sort judges based on current options
   */
  sortJudges(judges) {
    const { sortBy, sortOrder } = this.options;
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    return judges.slice().sort((a, b) => {
      switch (sortBy) {
        case 'score':
          const scoreA = BiasScoreCalculator.calculate(a).score;
          const scoreB = BiasScoreCalculator.calculate(b).score;
          return (scoreB - scoreA) * multiplier;

        case 'name':
          return (a.name || '').localeCompare(b.name || '') * multiplier;

        case 'county':
          const countyCompare = (a.county || '').localeCompare(b.county || '');
          if (countyCompare !== 0) return countyCompare * multiplier;
          // Secondary sort by name within county
          return (a.name || '').localeCompare(b.name || '');

        case 'prison_rate':
          const prA = a.bias_metrics?.prison_rate || a.prison_rate || 0;
          const prB = b.bias_metrics?.prison_rate || b.prison_rate || 0;
          return (prB - prA) * multiplier;

        case 'reversal_rate':
          const rrA = a.appellate_record?.reversal_rate || 0;
          const rrB = b.appellate_record?.reversal_rate || 0;
          return (rrB - rrA) * multiplier;

        default:
          return 0;
      }
    });
  }

  /**
   * Render the filtered and sorted judges
   */
  render() {
    if (!this.container) return;

    if (this.filteredJudges.length === 0) {
      this.container.innerHTML = `
        <div class="no-results">
          <h3>No judges found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `;
      return;
    }

    // Clear existing content
    this.container.innerHTML = '';

    // Add flip cards grid wrapper
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'flip-cards-grid';

    // Render each judge as a flip card
    this.filteredJudges.forEach(judge => {
      const cardHTML = flipCardHTML(judge);
      gridWrapper.insertAdjacentHTML('beforeend', cardHTML);
    });

    this.container.appendChild(gridWrapper);

    // Re-bind card action buttons
    this.bindCardActions();
  }

  /**
   * Bind click handlers for card action buttons
   */
  bindCardActions() {
    // View details buttons
    this.container.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const judgeId = btn.dataset.judgeId;
        this.showJudgeDetails(judgeId);
      });
    });

    // Add to compare buttons
    this.container.querySelectorAll('.add-compare-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const judgeId = btn.dataset.judgeId;
        const judgeName = btn.dataset.judgeName;
        this.addToComparison(judgeId, judgeName);
      });
    });

    // Make entire card focusable for accessibility
    this.container.querySelectorAll('.flip-card').forEach(card => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          card.classList.toggle('is-flipped');
        }
      });
    });
  }

  /**
   * Show judge details modal
   */
  showJudgeDetails(judgeId) {
    const judge = this.judges.find(j => j.id === judgeId);
    if (!judge) return;

    // Dispatch custom event for modal handling
    const event = new CustomEvent('showJudgeDetails', { detail: { judge } });
    document.dispatchEvent(event);

    // Fallback: try to open existing modal
    const modal = document.getElementById('judge-detail-modal');
    if (modal) {
      modal.classList.add('show');
      // You can populate the modal content here
    }
  }

  /**
   * Add judge to comparison
   */
  addToComparison(judgeId, judgeName) {
    // Dispatch custom event for comparison handling
    const event = new CustomEvent('addToComparison', {
      detail: { judgeId, judgeName }
    });
    document.dispatchEvent(event);
  }

  /**
   * Update results count display
   */
  updateResultsCount() {
    const countEl = document.getElementById('results-count');
    if (countEl) {
      countEl.textContent = `${this.filteredJudges.length} of ${this.judges.length} judges`;
    }

    // Update statistics
    this.updateStatistics();
  }

  /**
   * Update group statistics
   */
  updateStatistics() {
    const stats = BiasScoreCalculator.getGroupStatistics(this.filteredJudges);
    if (!stats) return;

    const statsEl = document.getElementById('bias-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-item">
          <span class="stat-label">Average Score:</span>
          <span class="stat-value">${stats.average}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Range:</span>
          <span class="stat-value">${stats.min} - ${stats.max}</span>
        </div>
        <div class="stat-distribution">
          <span class="dist-excellent" title="Excellent">${stats.distribution.excellent}</span>
          <span class="dist-low" title="Low">${stats.distribution.low}</span>
          <span class="dist-moderate" title="Moderate">${stats.distribution.moderate}</span>
          <span class="dist-high" title="High">${stats.distribution.high}</span>
          <span class="dist-critical" title="Critical">${stats.distribution.critical}</span>
        </div>
      `;
    }
  }

  /**
   * Get all unique counties from judges
   */
  getCounties() {
    const counties = new Set(this.judges.map(j => j.county).filter(Boolean));
    return Array.from(counties).sort();
  }

  /**
   * Populate county filter dropdown
   */
  populateCountyFilter() {
    const select = document.getElementById('county-filter');
    if (!select) return;

    const counties = this.getCounties();
    select.innerHTML = '<option value="all">All Counties</option>' +
      counties.map(c => `<option value="${c.toLowerCase()}">${c} County</option>`).join('');
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a page with flip cards
  const container = document.getElementById('flip-cards-container') ||
                    document.getElementById('judges-grid');

  if (container) {
    window.flipCardManager = new FlipCardManager(`#${container.id}`);
  }
});

export default FlipCardManager;
