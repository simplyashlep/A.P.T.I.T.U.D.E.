/* ==========================================================================
   IMPROVED JUDGE CARDS INTERACTION
   Fixes hover/click behavior and implements comparison features
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize judge cards
  initJudgeCards();
  
  // Initialize comparison system
  initComparisonSystem();
  
  // Initialize click/hover behavior
  initCardBehavior();
});

/* ==========================================================================
   INITIALIZE JUDGE CARDS
   ========================================================================== */

function initJudgeCards() {
  const judgeCards = document.querySelectorAll('.flip-card');
  
  // Ensure all cards are visible
  judgeCards.forEach(card => {
    card.style.visibility = 'visible';
    card.style.opacity = '1';
    
    // Add event listeners for hover/click
    card.addEventListener('click', handleCardClick);
  });
}

/* ==========================================================================
   HANDLE HOVER/CLICK BEHAVIOR
   ========================================================================== */

function handleCardClick(event) {
  const card = event.currentTarget;
  
  // Check if click was on compare toggle (don't flip if it was)
  if (event.target.closest('.compare-toggle')) {
    return;
  }
  
  // Check if click was on profile button (don't flip if it was)
  if (event.target.closest('[data-profile-trigger]')) {
    return;
  }
  
  // Check if click was on compare button (don't flip if it was)
  if (event.target.closest('.btn-compare')) {
    return;
  }
  
  // Flip the card
  if (card.classList.contains('is-flipped')) {
    // Card is already flipped, unflip it
    card.classList.remove('is-flipped');
    card.classList.remove('is-pinned');
  } else {
    // Card is not flipped, flip it and pin it
    card.classList.add('is-flipped');
    card.classList.add('is-pinned');
  }
}

/* ==========================================================================
   INITIALIZE CARD BEHAVIOR
   ========================================================================== */

function initCardBehavior() {
  const judgeCards = document.querySelectorAll('.flip-card');
  
  // Mouseenter/leave for hover behavior
  judgeCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      // Only hover-flip if card is not pinned
      if (!this.classList.contains('is-pinned')) {
        this.classList.add('is-flipped');
      }
    });
    
    card.addEventListener('mouseleave', function() {
      // Only unflip if card is not pinned
      if (!this.classList.contains('is-pinned')) {
        this.classList.remove('is-flipped');
      }
    });
  });
}

/* ==========================================================================
   COMPARISON SYSTEM
   ========================================================================== */

function initComparisonSystem() {
  const compareCheckboxes = document.querySelectorAll('[data-compare-toggle]');
  const compareBtn = document.getElementById('compare-btn');
  const clearCompareBtn = document.getElementById('clear-comparison');
  const selectedJudgesArea = document.getElementById('selected-judges');
  
  // Store selected judges
  let selectedJudges = [];
  
  // Initialize compare button state
  compareBtn.disabled = true;
  
  // Handle compare checkbox changes
  compareCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const judgeId = this.value;
      const judgeCard = document.querySelector(`[data-id="${judgeId}"]`);
      
      if (this.checked) {
        // Add judge to comparison
        selectedJudges.push({
          id: judgeId,
          name: judgeCard.dataset.name,
          county: judgeCard.dataset.county,
          score: judgeCard.dataset.score,
          level: judgeCard.dataset.level
        });
        
        // Mark card as selected
        judgeCard.classList.add('is-selected');
      } else {
        // Remove judge from comparison
        selectedJudges = selectedJudges.filter(judge => judge.id !== judgeId);
        
        // Unmark card as selected
        judgeCard.classList.remove('is-selected');
      }
      
      // Update UI
      updateSelectedJudgesArea(selectedJudges);
      updateCompareButton(selectedJudges);
    });
  });
  
  // Update selected judges area
  function updateSelectedJudgesArea(judges) {
    selectedJudgesArea.innerHTML = '';
    
    judges.forEach(judge => {
      const chip = document.createElement('div');
      chip.className = 'comparison-chip';
      chip.innerHTML = `
        <strong>${judge.name}</strong>
        <span class="comparison-chip-meta">${judge.county} | Score: ${judge.score}</span>
      `;
      selectedJudgesArea.appendChild(chip);
    });
    
    // Show placeholder if no judges selected
    if (judges.length === 0) {
      selectedJudgesArea.innerHTML = '<div class="comparison-placeholder">Select judges to compare</div>';
    }
  }
  
  // Update compare button state
  function updateCompareButton(judges) {
    compareBtn.disabled = judges.length < 2;
    
    if (judges.length >= 2) {
      compareBtn.textContent = `Compare ${judges.length} Judges`;
    } else {
      compareBtn.textContent = 'Compare';
    }
  }
  
  // Handle compare button click
  if (compareBtn) {
    compareBtn.addEventListener('click', function() {
      if (selectedJudges.length >= 2) {
        showComparisonModal(selectedJudges);
      }
    });
  }
  
  // Handle clear comparison button
  if (clearCompareBtn) {
    clearCompareBtn.addEventListener('click', function() {
      // Clear all checkboxes
      compareCheckboxes.forEach(checkbox => checkbox.checked = false);
      
      // Clear selected judges
      selectedJudges = [];
      
      // Clear selected state on cards
      document.querySelectorAll('.flip-card.is-selected').forEach(card => {
        card.classList.remove('is-selected');
      });
      
      // Update UI
      updateSelectedJudgesArea(selectedJudges);
      updateCompareButton(selectedJudges);
    });
  }
}

/* ==========================================================================
   COMPARISON MODAL
   ========================================================================== */

function showComparisonModal(judges) {
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'comparison-modal-content';
  
  // Add title
  const title = document.createElement('h2');
  title.textContent = `Comparing ${judges.length} Judges`;
  modalContent.appendChild(title);
  
  // Create comparison grid
  const comparisonGrid = document.createElement('div');
  comparisonGrid.className = 'comparison-grid';
  
  // Add judge comparison cards
  judges.forEach(judge => {
    const judgeCard = document.querySelector(`[data-id="${judge.id}"]`);
    
    const comparisonCard = document.createElement('div');
    comparisonCard.className = 'comparison-card';
    comparisonCard.innerHTML = `
      <h3>${judge.name}</h3>
      <p class="comparison-card-subtitle">${judge.county} County</p>
      
      <div class="comparison-card-score" style="background: ${getBiasColor(judge.level)}">
        ${judge.score}
      </div>
      
      <div class="comparison-card-metrics">
        <div class="comparison-metric">
          <span>Prison Usage:</span>
          <strong>${judgeCard.dataset.prisonRate}%</strong>
        </div>
        <div class="comparison-metric">
          <span>Reversal Rate:</span>
          <strong>${judgeCard.dataset.reversalRate}%</strong>
        </div>
        <div class="comparison-metric">
          <span>Counsel Disparity:</span>
          <strong>${judgeCard.dataset.counselDisparity}</strong>
        </div>
      </div>
      
      <div class="comparison-card-spectrum">
        <div class="comparison-spectrum-track">
          <div class="comparison-spectrum-marker" style="left: ${judge.score}%; background: ${getBiasColor(judge.level)}"></div>
        </div>
        <div class="comparison-spectrum-labels">
          <span>Equity</span>
          <span>Concern</span>
        </div>
      </div>
    `;
    
    comparisonGrid.appendChild(comparisonCard);
  });
  
  modalContent.appendChild(comparisonGrid);
  
  // Add insights section
  const insights = document.createElement('div');
  insights.className = 'comparison-insights';
  
  if (judges.length === 2) {
    // Two judge comparison insights
    const judge1 = judges[0];
    const judge2 = judges[1];
    
    insights.innerHTML = `
      <h3>Key Insights</h3>
      <ul>
        <li><strong>Score difference:</strong> ${Math.abs(parseInt(judge1.score) - parseInt(judge2.score))} points</li>
        <li><strong>Highest prison usage:</strong> ${judge1.score > judge2.score ? judge1.name : judge2.name}</li>
        <li><strong>Most balanced:</strong> ${judge1.score < judge2.score ? judge1.name : judge2.name}</li>
      </ul>
    `;
  } else if (judges.length === 3) {
    // Three judge comparison insights
    insights.innerHTML = `
      <h3>Key Insights</h3>
      <ul>
        <li><strong>Average score:</strong> ${calculateAverageScore(judges)}</li>
        <li><strong>Range:</strong> ${calculateScoreRange(judges)} points</li>
        <li><strong>Most consistent:</strong> ${findMostConsistentJudge(judges)}</li>
      </ul>
    `;
  }
  
  modalContent.appendChild(insights);
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'comparison-modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      ${modalContent.innerHTML}
    </div>
  `;
  
  // Add modal to page
  document.body.appendChild(modal);
  
  // Show modal
  modal.style.display = 'block';
  
  // Add close event
  modal.querySelector('.close').addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.removeChild(modal);
  });
}

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

function getBiasColor(level) {
  switch(level) {
    case 'excellent': return '#10B981';
    case 'low': return '#3B82F6';
    case 'moderate': return '#6B7280';
    case 'high': return '#EF4444';
    case 'critical': return '#7C3AED';
    default: return '#6B7280';
  }
}

function calculateAverageScore(judges) {
  const total = judges.reduce((sum, judge) => sum + parseInt(judge.score), 0);
  return Math.round(total / judges.length);
}

function calculateScoreRange(judges) {
  const scores = judges.map(judge => parseInt(judge.score));
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  return max - min;
}

function findMostConsistentJudge(judges) {
  // Simple heuristic: lowest score difference from average
  const average = calculateAverageScore(judges);
  let mostConsistent = judges[0];
  let minDifference = Math.abs(parseInt(judges[0].score) - average);
  
  for (let i = 1; i < judges.length; i++) {
    const difference = Math.abs(parseInt(judges[i].score) - average);
    if (difference < minDifference) {
      minDifference = difference;
      mostConsistent = judges[i];
    }
  }
  
  return mostConsistent.name;
}

/* ==========================================================================
   PROFILE MODAL
   ========================================================================== */

// Initialize profile modal trigger
document.querySelectorAll('[data-profile-trigger]').forEach(button => {
  button.addEventListener('click', function() {
    const judgeCard = this.closest('.flip-card');
    const judgeId = judgeCard.dataset.id;
    
    // You would implement full profile modal here
    console.log(`Opening profile for judge ${judgeId}`);
  });
});