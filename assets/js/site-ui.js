// Site-wide UI helpers for navigation, flip cards, and judge-page filtering.
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

      const card = event.target.closest(".home-actor-card");
      if (card && window.innerWidth < 980) {
        card.classList.toggle("is-flipped");
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

  function initializeJudgeDirectory() {
    const grid = document.getElementById("judges-grid");
    if (!grid) {
      return;
    }

    const searchInput = document.getElementById("judge-search");
    const countyFilter = document.getElementById("county-filter");
    const riskFilter = document.getElementById("risk-filter");
    const sortBy = document.getElementById("sort-by");
    const sortOrder = document.getElementById("sort-order");
    const resultsCount = document.getElementById("results-count");
    const statsBar = document.getElementById("bias-stats");
    const selectedJudgesArea = document.getElementById("selected-judges");
    const compareButton = document.getElementById("compare-btn");
    const clearComparisonButton = document.getElementById("clear-comparison");
    const comparisonModal = document.getElementById("comparison-modal");
    const comparisonResults = document.getElementById("comparison-results");
    const detailModal = document.getElementById("judge-detail-modal");
    const detailContent = document.getElementById("judge-detail-content");

    const cards = Array.from(grid.querySelectorAll(".flip-card"));
    const comparisonSelection = [];
    let ascending = false;

    function toTitleCase(value) {
      return value
        .split(/[_\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }

    function getCardScore(card) {
      const scoreNode = card.querySelector(".score-value");
      return Number.parseFloat(scoreNode?.textContent || "0");
    }

    function getCardCounty(card) {
      return (card.dataset.county || "").toLowerCase().replace(/\s+/g, "_");
    }

    function getNumericDataset(card, key) {
      return Number.parseFloat(card.dataset[key] || "0");
    }

    function getVisibleCards() {
      return cards.filter((card) => card.style.display !== "none");
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
        option.textContent = `${toTitleCase(county)} County`;
        countyFilter.appendChild(option);
      });

      if (Array.from(countyFilter.options).some((option) => option.value === existing)) {
        countyFilter.value = existing;
      }
    }

    function renderStats(visibleCards) {
      if (!statsBar) {
        return;
      }

      const counts = {
        excellent: 0,
        low: 0,
        moderate: 0,
        high: 0,
        critical: 0
      };

      visibleCards.forEach((card) => {
        const level = card.dataset.level || "moderate";
        if (counts[level] !== undefined) {
          counts[level] += 1;
        }
      });

      statsBar.innerHTML = `
        <div class="stat-item"><span class="stat-label">Visible judges</span><span class="stat-value">${visibleCards.length}</span></div>
        <div class="stat-item"><span class="stat-label">Highest score</span><span class="stat-value">${visibleCards[0] ? getCardScore(visibleCards[0]) : "0"}</span></div>
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
      if (!resultsCount) {
        return;
      }

      resultsCount.textContent = `${visibleCards.length} judge cards shown`;
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
          comparison = getNumericDataset(left, "prisonRate") - getNumericDataset(right, "prisonRate");
        } else if (mode === "reversal_rate") {
          comparison = getNumericDataset(left, "reversalRate") - getNumericDataset(right, "reversalRate");
        } else {
          comparison = getCardScore(left) - getCardScore(right);
        }

        return ascending ? comparison : comparison * -1;
      });

      visibleCards.forEach((card) => grid.appendChild(card));
    }

    function applyFilters() {
      const searchValue = (searchInput?.value || "").trim().toLowerCase();
      const countyValue = countyFilter?.value || "all";
      const riskValue = riskFilter?.value || "all";

      cards.forEach((card) => {
        const name = (card.dataset.name || "").toLowerCase();
        const county = getCardCounty(card);
        const level = (card.dataset.level || "").toLowerCase();
        const specialization = (card.dataset.specialization || "").toLowerCase();

        const searchMatch =
          !searchValue ||
          name.includes(searchValue) ||
          county.includes(searchValue) ||
          specialization.includes(searchValue);
        const countyMatch = countyValue === "all" || county === countyValue;
        const riskMatch = riskValue === "all" || level === riskValue;

        card.style.display = searchMatch && countyMatch && riskMatch ? "" : "none";
      });

      const visibleCards = getVisibleCards();
      sortCards(visibleCards);
      renderResultsInfo(visibleCards);
      renderStats(visibleCards);
    }

    function renderComparisonSelection() {
      if (!selectedJudgesArea) {
        return;
      }

      if (!comparisonSelection.length) {
        selectedJudgesArea.innerHTML = '<p class="comparison-help">Click "Compare" on judge cards to compare up to 3 judges side-by-side</p>';
      } else {
        selectedJudgesArea.innerHTML = comparisonSelection
          .map((judge) => `<span class="comparison-chip">${judge.name}</span>`)
          .join("");
      }

      if (compareButton) {
        compareButton.disabled = comparisonSelection.length < 2;
      }
    }

    function openComparisonModal() {
      if (!comparisonModal || !comparisonResults) {
        return;
      }

      comparisonResults.innerHTML = comparisonSelection
        .map((judge) => `
          <article class="archive-panel">
            <h3>${judge.name}</h3>
            <p><strong>County:</strong> ${judge.county}</p>
            <p><strong>Level:</strong> ${judge.level}</p>
            <p><strong>Score:</strong> ${judge.score}</p>
          </article>
        `)
        .join("");

      comparisonModal.classList.add("show");
    }

    function openDetailModal(card) {
      if (!detailModal || !detailContent) {
        return;
      }

      const header = card.querySelector(".judge-name-display")?.textContent || card.dataset.name || "Judge Profile";
      const content = card.querySelector(".card-back-content")?.innerHTML || "";

      detailContent.innerHTML = `
        <h2>${header}</h2>
        <div class="judge-detail-body">${content}</div>
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
      comparisonSelection.length = 0;
      renderComparisonSelection();
    });

    compareButton?.addEventListener("click", openComparisonModal);

    grid.addEventListener("click", (event) => {
      const compare = event.target.closest(".add-compare-btn");
      if (compare) {
        const card = compare.closest(".flip-card");
        const candidate = {
          id: compare.dataset.judgeId || card?.dataset.id || "",
          name: compare.dataset.judgeName || card?.dataset.name || "Unknown",
          county: card?.dataset.county || "Unknown",
          level: card?.dataset.level || "Unknown",
          score: getCardScore(card)
        };

        if (!comparisonSelection.find((entry) => entry.id === candidate.id) && comparisonSelection.length < 3) {
          comparisonSelection.push(candidate);
          renderComparisonSelection();
        }
        return;
      }

      const details = event.target.closest(".view-details-btn");
      if (details) {
        const card = details.closest(".flip-card");
        if (card) {
          openDetailModal(card);
        }
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
      if (Array.from(countyFilter.options).some((option) => option.value === normalizedCounty)) {
        countyFilter.value = normalizedCounty;
      }
    }

    renderComparisonSelection();
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
    initializeMegaMenu();
    initializeFlipCards();
    initializeJudgeDirectory();
  });
})();
