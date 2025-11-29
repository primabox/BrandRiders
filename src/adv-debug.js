// Debug helper: logs advertise grid/show-all state and events to help diagnose issues
document.addEventListener('DOMContentLoaded', () => {
  try {
    const btn = document.querySelector('.adv-show-all');
    const grid = document.querySelector('.adv-grid');
    console.log('[adv-debug] DOM ready. adv-show-all:', !!btn, 'adv-grid:', !!grid);
    console.log('[adv-debug] viewport <=480:', window.matchMedia('(max-width:480px)').matches);

    if (btn) {
      btn.addEventListener('click', (e) => {
        console.log('[adv-debug] adv-show-all clicked. aria-expanded before:', btn.getAttribute('aria-expanded'));
        setTimeout(() => {
          console.log('[adv-debug] adv-grid has class adv-grid--expanded:', grid && grid.classList.contains('adv-grid--expanded'));
        }, 50);
      });
    }

    // Also log any errors from adv-show-all and adv-card-touch modules if they throw
    window.addEventListener('error', (ev) => {
      console.error('[adv-debug] window error:', ev.message, ev.filename, ev.lineno, ev.colno);
    });

    window.addEventListener('unhandledrejection', (ev) => {
      console.error('[adv-debug] unhandledrejection:', ev.reason);
    });
  } catch (err) {
    console.error('[adv-debug] init error:', err);
  }
});
