const budgetDetails = {
  general: {
    title: 'General Fund',
    value: '$2.59B',
    share: '95.18% of DOC total funds',
    copy:
      "The dominant funding stream comes from Oregon's core discretionary resources. That makes correctional performance a statewide public-interest question, not just an agency management issue.",
    href: 'https://www.oregon.gov/doc/Documents/quick-facts-issue-brief-2025.pdf'
  },
  other: {
    title: 'Other Funds',
    value: '$136.04M',
    share: '4.74% of DOC total funds',
    copy:
      'Other Funds are comparatively small in the DOC mix. On the landing page, that contrast helps frame how dependent the system is on state-level budget choices.',
    href: 'https://www.oregon.gov/doc/Documents/2025-27-governors-balanced-budget.pdf'
  },
  federal: {
    title: 'Federal Funds',
    value: '$2.35M',
    share: '0.08% of DOC total funds',
    copy:
      'Federal dollars are nearly absent in this high-level DOC budget view. That gives visitors a clearer picture of which public institutions own the policy choices.',
    href: 'https://www.oregon.gov/doc/Documents/2025-27-governors-balanced-budget.pdf'
  }
};

function formatCounterValue(value, prefix = '') {
  if (value >= 1000000000) return `${prefix}${(value / 1000000000).toFixed(2)}B`;
  if (value >= 1000000) return `${prefix}${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${prefix}${Math.round(value / 100) / 10}k`;
  return `${prefix}${Math.round(value)}`;
}

function animateCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.counter || 0);
      const prefix = element.dataset.counterPrefix || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = formatCounterValue(target * eased, prefix);

        if (progress < 1) requestAnimationFrame(tick);
        else element.textContent = formatCounterValue(target, prefix);
      }

      requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  }, { threshold: 0.4 });

  counters.forEach((counter) => observer.observe(counter));
}

function setBudgetState(key) {
  const detail = budgetDetails[key];
  if (!detail) return;

  document.querySelectorAll('[data-budget-key]').forEach((element) => {
    element.classList.toggle('is-active', element.dataset.budgetKey === key);
  });

  const title = document.getElementById('budget-detail-title');
  const value = document.getElementById('budget-detail-value');
  const share = document.getElementById('budget-detail-share');
  const copy = document.getElementById('budget-detail-copy');
  const link = document.getElementById('budget-detail-link');

  if (title) title.textContent = detail.title;
  if (value) value.textContent = detail.value;
  if (share) share.textContent = detail.share;
  if (copy) copy.textContent = detail.copy;
  if (link) link.href = detail.href;
}

function initializeBudgetInteractions() {
  document.querySelectorAll('[data-budget-key]').forEach((trigger) => {
    const activate = () => setBudgetState(trigger.dataset.budgetKey);
    trigger.addEventListener('mouseenter', activate);
    trigger.addEventListener('focus', activate);
    trigger.addEventListener('click', activate);
  });
}

function initializeFlipCardAccessibility() {
  document.querySelectorAll('.dashboard-flip-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (window.innerWidth <= 900) card.classList.toggle('is-flipped');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  initializeBudgetInteractions();
  initializeFlipCardAccessibility();
  setBudgetState('general');
});
