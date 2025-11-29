// Toggle adv-card background color on tap for mobile.
// Finds `hover:bg[#HEX]` classes on the card and uses that HEX as the active color.
document.addEventListener('DOMContentLoaded', () => {
  const mq = window.matchMedia('(max-width:480px)');

  function bindCards() {
    const cards = Array.from(document.querySelectorAll('.adv-card'));
    const hoverClsRegex = /hover:bg\[(#(?:[0-9A-Fa-f]{3,6}))\]/;

    cards.forEach(card => {
      if (card.__advBound) return;
      card.__advBound = true;

      // find hover color on the card's class list
      const hoverClass = Array.from(card.classList).find(c => hoverClsRegex.test(c));
      let color = null;
      if (hoverClass) {
        const m = hoverClass.match(hoverClsRegex);
        if (m) color = m[1];
      }

      // allow per-element override via data-active-bg attribute (hex value)
      if (!color && card.dataset.activeBg) {
        color = card.dataset.activeBg;
      }

      // Fallback mapping by logo modifier class if hover class is not present
      if (!color) {
        const logo = card.querySelector('.adv-logo');
        const mapping = {
          'adv-logo--costa': '#6D2037', // Costa (note: original hover for Costa was #6D2037)
          'adv-logo--pizzahut': '#C70F2E',
          'adv-logo--ticketmaster': '#024DDF',
          'adv-logo--beko': '#2D7DB9',
          'adv-logo--cpp': '#005091',
          'adv-logo--pp': '#FEBA3A'
        };
        if (logo) {
          for (const cls of Object.keys(mapping)) {
            if (logo.classList.contains(cls) || card.classList.contains(cls)) {
              color = mapping[cls];
              break;
            }
          }
        }
      }

      // default fallback color if none found
      const defaultColor = '#e6e6e6';

      function toggleActive() {
        if (!mq.matches) return; // only on small screens
        const isActive = card.classList.toggle('adv-card--active');
        const logoEl = card.querySelector('.adv-logo');
        if (isActive) {
          const bg = color || defaultColor;
          card.style.setProperty('--active-bg', bg);
          // store and apply logo active styles (invert to white)
          if (logoEl) {
            if (logoEl.dataset._origFilter === undefined) logoEl.dataset._origFilter = logoEl.style.filter || '';
            if (logoEl.dataset._origOpacity === undefined) logoEl.dataset._origOpacity = logoEl.style.opacity || '';
            logoEl.style.filter = 'grayscale(100%) brightness(0) invert(1)';
            logoEl.style.opacity = '0.98';
          }
        } else {
          card.style.removeProperty('--active-bg');
          // restore logo original styles (remove inline filter/opacity reliably)
          if (logoEl) {
            if (logoEl.dataset._origFilter !== undefined) {
              if (logoEl.dataset._origFilter) {
                logoEl.style.setProperty('filter', logoEl.dataset._origFilter);
              } else {
                logoEl.style.removeProperty('filter');
              }
              delete logoEl.dataset._origFilter;
            } else {
              logoEl.style.removeProperty('filter');
            }

            if (logoEl.dataset._origOpacity !== undefined) {
              if (logoEl.dataset._origOpacity) {
                logoEl.style.setProperty('opacity', logoEl.dataset._origOpacity);
              } else {
                logoEl.style.removeProperty('opacity');
              }
              delete logoEl.dataset._origOpacity;
            } else {
              logoEl.style.removeProperty('opacity');
            }
          }
        }
      }

      card.addEventListener('click', (e) => {
        // allow clicks on desktop to behave normally
        toggleActive();
      });

      // keyboard support
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleActive();
        }
      });
    });
  }

  // initial bind and re-bind on viewport changes
  bindCards();
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', bindCards);
  } else if (typeof mq.addListener === 'function') {
    mq.addListener(bindCards);
  }
});
