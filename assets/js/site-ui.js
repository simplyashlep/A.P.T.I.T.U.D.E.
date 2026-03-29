// Site-wide UI helpers for navigation, flip cards, and actor-directory filtering.
(function () {
  function initializeMegaMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-mega-menu]");

    if (!toggle || !panel) {
      return;
    }

    function closeMenu() {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      panel.hidden = open;
      toggle.setAttribute("aria-expanded", String(!open));
    });

    document.addEventListener("click", (event) => {
      if (panel.hidden) {
        return;
      }

      if (panel.contains(event.target) || toggle.contains(event.target)) {
        return;
      }

      closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  function initializeFlipCards() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(".flip-toggle");
      if (button) {
        const card = button.closest(".flip-card");
        if (card) {
          card.classList.toggle("is-flipped");
        }
        return;
      }

      const homeCard = event.target.closest(".home-actor-card");
      if (homeCard && window.innerWidth < 980) {
        homeCard.classList.toggle("is-flipped");
      }
    });

    document.addEventListener("keydown", (event) => {
      const active = document.activeElement;
      const card = active && active.classList.contains("flip-card") ? active : null;

      if (card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        card.classList.toggle("is-flipped");
      }
    });
  }

  function initializeActorDirectory() {
    const root = document.querySelector("[data-directory-root]");
    const grid = document.getElementById("judges-grid");
    if (!root || !grid) {
      return;
    }

    const searchInput = document.getElementById("judge-search");
    const countyFilter = document.getElementById("county-filter");
    const riskFilter = document.getElementById("risk-filter");
    const sortBy = document.getElementById("sort-by");
    const sortOrder = document.getElementById("sort-order");
    const resultsCount = document.getElementById("results-count");
    const statsBar = document.getElementById("bias-stats");
    const selectedArea = document.getElementById("selected-judges");
    const compareButton = document.getElementById("compare-btn");
    const clearComparisonButton = document.getElementById("clear-comparison");
    const comparisonModal = document.getElementById("comparison-modal");
    const comparisonResults = document.getElementById("comparison-results");
    const detailModal = document.getElementById("judge-detail-modal");
    const detailContent = document.getElementById("judge-detail-content");
    const spectrumContainer = document.getElementById("directory-spectrum");
    const distributionContainer = document.getElementById("directory-distribution");
    const cards = Array.from(grid.querySelectorAll(".flip-card"));
    const directoryLabel = root.dataset.directoryLabel || "records";
    const sidebarToggle = root.querySelector("[data-sidebar-toggle]");
    const maxComparison = 3;
    const selectedIds = [];
    let ascending = false;

    function titleCase(value) {
      return value
        .split(/[_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }

    function escapeHtml(value) {
      return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }

    function parseMetric(value) {
      const numeric = Number.parseFloat(value);
      return Number.isFinite(numeric) ? numeric : 0;
    }

    function getCardScore(card) {
      return parseMetric(card.dataset.score || card.querySelector(".score-value")?.textContent);
    }

    function getCardCounty(card) {
      return (card.dataset.county || "").toLowerCase().trim();
    }

    function getVisibleCards() {
      return cards.filter((card) => card.style.display !== "none");
    }

    function getCardData(card) {
      return {
        id: card.dataset.id || "",
        name: card.dataset.name || "Unknown profile",
        county: card.dataset.county || "Unknown county",
        level: card.dataset.level || "moderate",
        score: getCardScore(card),
        prisonRate: parseMetric(card.dataset.prisonRate),
        reversalRate: parseMetric(card.dataset.reversalRate),
        summary: card.dataset.summary || "",
        focus: card.dataset.focus || card.dataset.specialization || "",
        court: card.dataset.court || "Actor profile",
        tenure: card.dataset.tenure || "Current reporting cycle",
        caseload: card.dataset.caseload || "N/A",
        flags: (card.dataset.flags || "")
          .split("|")
          .map((item) => item.trim())
          .filter(Boolean),
        actorType: card.dataset.actorType || "actor profile"
      };
    }

    function populateCountyFilter() {
      if (!countyFilter) {
        return;
      }

      const existing = countyFilter.value || "all";
      const counties = [...new Set(cards.map((card) => getCardCounty(card)).filter(Boolean))].sort();

      countyFilter.innerHTML = '<option value="all">All Counties</option>';
      counties.forEach((county) => {
        const option = document.createElement("option");
        option.value = county;
        option.textContent = `${titleCase(county)} County`;
        countyFilter.appendChild(option);
      });

      if ([...countyFilter.options].some((option) => option.value === existing)) {
        countyFilter.value = existing;
      }
    }

    function syncCardSelection(cardId, checked) {
      grid.querySelectorAll(`[data-compare-toggle][value="${cardId}"]`).forEach((input) => {
        input.checked = checked;
      });
    }

    function removeSelection(cardId) {
      const index = selectedIds.indexOf(cardId);
      if (index !== -1) {
        selectedIds.splice(index, 1);
      }
      syncCardSelection(cardId, false);
      renderSelection();
    }

    function addSelection(cardId) {
      if (selectedIds.includes(cardId)) {
        return true;
      }

      if (selectedIds.length >= maxComparison) {
        const earliest = selectedIds.shift();
        if (earliest) {
          syncCardSelection(earliest, false);
        }
      }

      selectedIds.push(cardId);
      syncCardSelection(cardId, true);
      renderSelection();
      return true;
    }

    function toggleSelection(cardId, shouldSelect) {
      if (!cardId) {
        return;
      }

      if (shouldSelect) {
        addSelection(cardId);
      } else {
        removeSelection(cardId);
      }
    }

    function getSelectedCards() {
      return selectedIds
        .map((id) => cards.find((card) => card.dataset.id === id))
        .filter(Boolean);
    }

    function renderSelection() {
      if (!selectedArea) {
        return;
      }

      const selectedCards = getSelectedCards();
      if (!selectedCards.length) {
        selectedArea.innerHTML = `<p class="comparison-help">Select up to ${maxComparison} ${directoryLabel} to compare side by side.</p>`;
      } else {
        selectedArea.innerHTML = selectedCards
          .map((card) => {
            const data = getCardData(card);
            return `
              <button class="comparison-chip" type="button" data-remove-selection="${escapeHtml(data.id)}">
                <span>${escapeHtml(data.name)}</span>
                <span class="comparison-chip-meta">${escapeHtml(titleCase(data.county))}</span>
              </button>
            `;
          })
          .join("");
      }

      if (compareButton) {
        compareButton.disabled = selectedCards.length < 2;
      }
    }

    function renderStats(visibleCards) {
      if (!statsBar) {
        return;
      }

      const counts = { excellent: 0, low: 0, moderate: 0, high: 0, critical: 0 };
      const scores = visibleCards.map((card) => getCardScore(card));
      const highest = scores.length ? Math.max(...scores) : 0;
      const average = scores.length ? (scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1) : "0.0";

      visibleCards.forEach((card) => {
        const level = (card.dataset.level || "moderate").toLowerCase();
        if (counts[level] !== undefined) {
          counts[level] += 1;
        }
      });

      statsBar.innerHTML = `
        <div class="stat-item"><span class="stat-label">Visible profiles</span><span class="stat-value">${visibleCards.length}</span></div>
        <div class="stat-item"><span class="stat-label">Highest score</span><span class="stat-value">${highest}</span></div>
        <div class="stat-item"><span class="stat-label">Average score</span><span class="stat-value">${average}</span></div>
        <div class="stat-distribution">
          <span class="dist-excellent">${counts.excellent}</span>
          <span class="dist-low">${counts.low}</span>
          <span class="dist-moderate">${counts.moderate}</span>
          <span class="dist-high">${counts.high}</span>
          <span class="dist-critical">${counts.critical}</span>
        </div>
      `;
    }

    function renderResultsInfo(visibleCards) {
      if (resultsCount) {
        resultsCount.textContent = `${visibleCards.length} ${directoryLabel} shown`;
      }
    }

    function sortCards(visibleCards) {
      const mode = sortBy?.value || "score";

      visibleCards.sort((left, right) => {
        let comparison = 0;

        if (mode === "name") {
          comparison = (left.dataset.name || "").localeCompare(right.dataset.name || "");
        } else if (mode === "county") {
          comparison = (left.dataset.county || "").localeCompare(right.dataset.county || "");
        } else if (mode === "prison_rate") {
          comparison = parseMetric(left.dataset.prisonRate) - parseMetric(right.dataset.prisonRate);
        } else if (mode === "reversal_rate") {
          comparison = parseMetric(left.dataset.reversalRate) - parseMetric(right.dataset.reversalRate);
        } else {
          comparison = getCardScore(left) - getCardScore(right);
        }

        return ascending ? comparison : comparison * -1;
      });

      visibleCards.forEach((card) => grid.appendChild(card));
    }

    function renderSpectrum(visibleCards) {
      if (!spectrumContainer) {
        return;
      }

      if (!visibleCards.length) {
        spectrumContainer.innerHTML = '<p class="viz-empty">No visible profiles to map.</p>';
        return;
      }

      spectrumContainer.innerHTML = visibleCards
        .slice(0, 24)
        .map((card) => {
          const data = getCardData(card);
          return `
            <button class="viz-spectrum-point level-${escapeHtml(data.level)}" type="button" style="left: ${Math.min(data.score, 100)}%;" data-open-profile="${escapeHtml(data.id)}">
              <span class="viz-spectrum-label">${escapeHtml(data.name)}</span>
            </button>
          `;
        })
        .join("");
    }

    function renderDistribution(visibleCards) {
      if (!distributionContainer) {
        return;
      }

      const bands = [
        { key: "excellent", label: "Excellent", count: 0 },
        { key: "low", label: "Low", count: 0 },
        { key: "moderate", label: "Moderate", count: 0 },
        { key: "high", label: "High", count: 0 },
        { key: "critical", label: "Critical", count: 0 }
      ];

      visibleCards.forEach((card) => {
        const band = bands.find((item) => item.key === (card.dataset.level || "").toLowerCase());
        if (band) {
          band.count += 1;
        }
      });

      const maxCount = Math.max(...bands.map((band) => band.count), 1);
      distributionContainer.innerHTML = bands
        .map(
          (band) => `
            <div class="viz-bar-row level-${band.key}">
              <span class="viz-bar-label">${band.label}</span>
              <div class="viz-bar-track"><span class="viz-bar-fill" style="width: ${(band.count / maxCount) * 100}%;"></span></div>
              <span class="viz-bar-value">${band.count}</span>
            </div>
          `
        )
        .join("");
    }

    function applyFilters() {
      const searchValue = (searchInput?.value || "").trim().toLowerCase();
      const countyValue = countyFilter?.value || "all";
      const riskValue = riskFilter?.value || "all";

      cards.forEach((card) => {
        const data = getCardData(card);
        const matchesSearch =
          !searchValue ||
          data.name.toLowerCase().includes(searchValue) ||
          data.county.toLowerCase().includes(searchValue) ||
          data.focus.toLowerCase().includes(searchValue) ||
          data.summary.toLowerCase().includes(searchValue);
        const matchesCounty = countyValue === "all" || getCardCounty(card) === countyValue;
        const matchesRisk = riskValue === "all" || data.level.toLowerCase() === riskValue;

        card.style.display = matchesSearch && matchesCounty && matchesRisk ? "" : "none";
      });

      const visibleCards = getVisibleCards();
      sortCards(visibleCards);
      renderResultsInfo(visibleCards);
      renderStats(visibleCards);
      renderSpectrum(visibleCards);
      renderDistribution(visibleCards);
    }

    function buildInsightSummary(selectedCards) {
      const selectedData = selectedCards.map((card) => getCardData(card));
      const highestScore = [...selectedData].sort((left, right) => right.score - left.score)[0];
      const highestPressure = [...selectedData].sort((left, right) => right.prisonRate - left.prisonRate)[0];
      const strongestCapacity = [...selectedData].sort((left, right) => right.reversalRate - left.reversalRate)[0];

      return `
        <div class="comparison-insights">
          <div class="comparison-insight">
            <span class="comparison-insight-label">Highest score</span>
            <strong>${escapeHtml(highestScore.name)}</strong>
            <span>${highestScore.score}</span>
          </div>
          <div class="comparison-insight">
            <span class="comparison-insight-label">Strongest pressure signal</span>
            <strong>${escapeHtml(highestPressure.name)}</strong>
            <span>${highestPressure.prisonRate}</span>
          </div>
          <div class="comparison-insight">
            <span class="comparison-insight-label">Strongest support metric</span>
            <strong>${escapeHtml(strongestCapacity.name)}</strong>
            <span>${strongestCapacity.reversalRate}</span>
          </div>
        </div>
      `;
    }

    function openComparisonModal() {
      if (!comparisonModal || !comparisonResults) {
        return;
      }

      const selectedCards = getSelectedCards();
      if (selectedCards.length < 2) {
        return;
      }

      comparisonResults.innerHTML = `
        ${buildInsightSummary(selectedCards)}
        <div class="comparison-grid">
          ${selectedCards
            .map((card) => {
              const data = getCardData(card);
              return `
                <article class="archive-panel comparison-card">
                  <div class="comparison-card-header">
                    <h3>${escapeHtml(data.name)}</h3>
                    <span class="comparison-score level-${escapeHtml(data.level)}">${data.score}</span>
                  </div>
                  <p>${escapeHtml(titleCase(data.county))} County</p>
                  <div class="comparison-card-spectrum">
                    <span class="comparison-card-marker" style="left: ${Math.min(data.score, 100)}%;"></span>
                  </div>
                  <div class="comparison-metric-list">
                    <div><span>Primary pressure</span><strong>${data.prisonRate}</strong></div>
                    <div><span>Counterweight</span><strong>${data.reversalRate}</strong></div>
                    <div><span>Volume</span><strong>${escapeHtml(data.caseload)}</strong></div>
                  </div>
                  <p class="comparison-summary">${escapeHtml(data.summary)}</p>
                </article>
              `;
            })
            .join("")}
        </div>
      `;

      comparisonModal.classList.add("show");
    }

    function openDetailModal(card) {
      if (!detailModal || !detailContent) {
        return;
      }

      const data = getCardData(card);
      const flagsMarkup = data.flags.length
        ? `<ul class="detail-flag-list">${data.flags.map((flag) => `<li>${escapeHtml(flag)}</li>`).join("")}</ul>`
        : "<p>No accountability flags are currently listed for this profile.</p>";

      detailContent.innerHTML = `
        <article class="detail-profile-shell">
          <div class="detail-profile-hero">
            <div class="detail-photo-space">
              <span>${escapeHtml(
                data.name
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part.charAt(0))
                  .join("")
              )}</span>
            </div>
            <div class="detail-hero-copy">
              <p class="eyebrow">${escapeHtml(data.actorType)}</p>
              <h2>${escapeHtml(data.name)}</h2>
              <p>${escapeHtml(data.summary)}</p>
              <div class="detail-links">
                <a class="btn btn-primary" href="/bias-beacon/methodology/">Methodology</a>
                <a class="btn btn-secondary" href="?county=${encodeURIComponent(data.county.toLowerCase())}">Filter This County</a>
              </div>
            </div>
          </div>
          <div class="detail-spectrum-panel">
            <div class="detail-spectrum-track">
              <span class="detail-spectrum-marker level-${escapeHtml(data.level)}" style="left: ${Math.min(data.score, 100)}%;"></span>
            </div>
            <div class="detail-spectrum-labels"><span>Lower concern</span><span>Higher concern</span></div>
          </div>
          <div class="detail-grid">
            <section class="detail-panel">
              <h3>Profile metrics</h3>
              <div class="detail-metric-grid">
                <div><span>Score</span><strong>${data.score}</strong></div>
                <div><span>County</span><strong>${escapeHtml(titleCase(data.county))}</strong></div>
                <div><span>Role</span><strong>${escapeHtml(data.court)}</strong></div>
                <div><span>Coverage</span><strong>${escapeHtml(data.tenure)}</strong></div>
                <div><span>Volume</span><strong>${escapeHtml(data.caseload)}</strong></div>
                <div><span>Focus</span><strong>${escapeHtml(data.focus || "General profile")}</strong></div>
              </div>
            </section>
            <section class="detail-panel">
              <h3>Signal snapshot</h3>
              <div class="detail-bars">
                <div class="detail-bar-row"><span>Primary pressure</span><div class="detail-bar-track"><span style="width: ${Math.min(data.prisonRate, 100)}%;"></span></div><strong>${data.prisonRate}</strong></div>
                <div class="detail-bar-row"><span>Counterweight</span><div class="detail-bar-track"><span style="width: ${Math.min(data.reversalRate, 100)}%;"></span></div><strong>${data.reversalRate}</strong></div>
                <div class="detail-bar-row"><span>Overall score</span><div class="detail-bar-track"><span style="width: ${Math.min(data.score, 100)}%;"></span></div><strong>${data.score}</strong></div>
              </div>
            </section>
            <section class="detail-panel detail-panel-wide">
              <h3>Evidence chain flags</h3>
              ${flagsMarkup}
            </section>
          </div>
        </article>
      `;

      detailModal.classList.add("show");
    }

    [searchInput, countyFilter, riskFilter, sortBy].forEach((control) => {
      control?.addEventListener("input", applyFilters);
      control?.addEventListener("change", applyFilters);
    });

    sortOrder?.addEventListener("click", () => {
      ascending = !ascending;
      sortOrder.innerHTML = ascending ? "&#8593;" : "&#8595;";
      applyFilters();
    });

    clearComparisonButton?.addEventListener("click", () => {
      selectedIds.splice(0, selectedIds.length);
      grid.querySelectorAll("[data-compare-toggle]").forEach((input) => {
        input.checked = false;
      });
      renderSelection();
    });

    compareButton?.addEventListener("click", openComparisonModal);

    sidebarToggle?.addEventListener("click", () => {
      const collapsed = root.classList.toggle("sidebar-collapsed");
      sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    });

    grid.addEventListener("change", (event) => {
      const toggle = event.target.closest("[data-compare-toggle]");
      if (!toggle) {
        return;
      }

      toggleSelection(toggle.value, toggle.checked);
    });

    grid.addEventListener("click", (event) => {
      const openProfile = event.target.closest("[data-open-profile]");
      if (openProfile) {
        const card = cards.find((entry) => entry.dataset.id === openProfile.dataset.openProfile);
        if (card) {
          openDetailModal(card);
        }
        return;
      }

      const removeSelectionButton = event.target.closest("[data-remove-selection]");
      if (removeSelectionButton) {
        removeSelection(removeSelectionButton.dataset.removeSelection);
        return;
      }

      const addCompareButton = event.target.closest(".add-compare-btn");
      if (addCompareButton) {
        const card = addCompareButton.closest(".flip-card");
        if (card) {
          toggleSelection(card.dataset.id, !selectedIds.includes(card.dataset.id));
        }
        return;
      }

      const detailButton = event.target.closest(".view-details-btn");
      if (detailButton) {
        const card = detailButton.closest(".flip-card");
        if (card) {
          openDetailModal(card);
        }
      }
    });

    selectedArea?.addEventListener("click", (event) => {
      const removeSelectionButton = event.target.closest("[data-remove-selection]");
      if (removeSelectionButton) {
        removeSelection(removeSelectionButton.dataset.removeSelection);
      }
    });

    spectrumContainer?.addEventListener("click", (event) => {
      const point = event.target.closest("[data-open-profile]");
      if (!point) {
        return;
      }

      const card = cards.find((entry) => entry.dataset.id === point.dataset.openProfile);
      if (card) {
        openDetailModal(card);
      }
    });

    document.querySelectorAll(".modal .close").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest(".modal")?.classList.remove("show");
      });
    });

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.classList.remove("show");
        }
      });
    });

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    const county = params.get("county");

    if (query && searchInput) {
      searchInput.value = query;
    }

    populateCountyFilter();

    if (county && countyFilter) {
      const normalizedCounty = county.toLowerCase();
      if ([...countyFilter.options].some((option) => option.value === normalizedCounty)) {
        countyFilter.value = normalizedCounty;
      }
    }

    renderSelection();
    applyFilters();
  }

  window.siteUI = {
    toggleChatPanel() {
      const panel = document.querySelector(".assistant-side");
      if (panel) {
        panel.classList.toggle("open");
      }
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const heroJump = document.querySelector("[data-hero-jump]");
    if (heroJump) {
      heroJump.addEventListener("change", () => {
        if (heroJump.value) {
          window.location.href = heroJump.value;
        }
      });
    }

    initializeMegaMenu();
    initializeFlipCards();
    initializeActorDirectory();
  });
})();
