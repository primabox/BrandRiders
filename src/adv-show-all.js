// Toggle showing all advertise cards on mobile when the user taps "ZOBRAZIT VŠETKY"
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.adv-show-all');
  const grid = document.querySelector('.adv-grid');
  if (!btn || !grid) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const expanded = grid.classList.toggle('adv-grid--expanded');
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    btn.textContent = expanded ? 'SKRYŤ VŠETKY' : 'ZOBRAZIT VŠETKY';
    // CSS handles the show/hide with animations; no inline display toggles needed
  });
});
