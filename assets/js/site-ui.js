// Basic site UI utilities: flip cards, sticky menu actions, chat toggles
document.addEventListener('click', (e) => {
  // Toggle flip when clicking the flip-card on small devices
  const flipBtn = e.target.closest('.flip-toggle');
  if (flipBtn) {
    const card = flipBtn.closest('.flip-card');
    if (card) card.classList.toggle('is-flipped');
  }
});

// Simple chat panel toggle for legal assistant
window.siteUI = {
  toggleChatPanel() {
    const panel = document.querySelector('.assistant-side');
    if (!panel) return;
    panel.classList.toggle('open');
  }
};

// Make all elements with data-flip-target clickable for keyboard accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement && document.activeElement.dataset.flipTarget) {
    const id = document.activeElement.dataset.flipTarget;
    const target = document.getElementById(id);
    if (target) target.classList.toggle('is-flipped');
  }
});
