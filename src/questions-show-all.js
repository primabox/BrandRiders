// Toggle extra questions (show all / show less)
(function () {
  function getHeaderHeight(item) {
    const header = item.querySelector('.accordion-header');
    if (!header) return 88;
    return header.getBoundingClientRect().height || 88;
  }

  function prepareExtra(item) {
    // ensure proper attributes and collapsed sizing
    if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');
    if (!item.hasAttribute('role')) item.setAttribute('role', 'button');
    item.setAttribute('aria-expanded', 'false');
    const headerH = getHeaderHeight(item);
    item.style.maxHeight = headerH + 'px';
    const body = item.querySelector('.accordion-body');
    if (body) body.style.maxHeight = '0px';
  }

  function showExtras(show) {
    const extraBlocks = document.querySelectorAll('.extra-question');
    extraBlocks.forEach(block => {
      const wrapper = block.querySelector('.accordion-item-wrapper');
      if (!wrapper) return;
      if (show) {
        // reveal in DOM then initialize sizes
        wrapper.style.display = '';
        // give browser a moment to layout
        const headerH = getHeaderHeight(wrapper);
        wrapper.style.maxHeight = headerH + 'px';
        const body = wrapper.querySelector('.accordion-body');
        if (body) body.style.maxHeight = '0px';
        wrapper.setAttribute('aria-expanded', 'false');
      } else {
        // hide again
        wrapper.style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const ctrl = document.querySelector('.questions-show-all');
    if (!ctrl) return;

    // ensure extras are prepared (in case accordion script ran earlier)
    document.querySelectorAll('.extra-question .accordion-item-wrapper').forEach(w => {
      // keep hidden but set sizes so accordion works when revealed
      w.style.display = 'none';
      prepareExtra(w);
    });

    ctrl.addEventListener('click', function (e) {
      e.preventDefault();
      const expanded = ctrl.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        // hide extras
        showExtras(false);
        ctrl.setAttribute('aria-expanded', 'false');
        ctrl.textContent = 'ZOBRAZIT VŠETKY';
      } else {
        // show extras and prepare them for accordion
        showExtras(true);
        ctrl.setAttribute('aria-expanded', 'true');
        ctrl.textContent = 'ZOBRAZIT MENEJ';
      }
    });

    // keyboard activation (Enter/Space) for accessibility
    ctrl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ctrl.click();
      }
    });
  });
})();
