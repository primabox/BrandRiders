// Simulate hover:bg[...] Tailwind classes on touch devices.
// Finds elements with classes like `hover:bg-[#6D2037]` and applies that color
// on touch/pointer events so the hover effect appears on mobile.
document.addEventListener('DOMContentLoaded', () => {
  const all = Array.from(document.querySelectorAll('*'));
  const hoverClsRegex = /hover:bg\[(#(?:[0-9A-Fa-f]{3,6}))\]/;

  all.forEach(el => {
    const cls = Array.from(el.classList).find(c => hoverClsRegex.test(c));
    if (!cls) return;
    const m = cls.match(hoverClsRegex);
    if (!m) return;
    const hoverColor = m[1];

    let removeTimer = null;

    const applyHover = () => {
      // store original inline background to restore later
      if (el.dataset._origBg === undefined) el.dataset._origBg = el.style.backgroundColor || '';
      el.style.backgroundColor = hoverColor;
    };

    const clearHover = () => {
      if (removeTimer) {
        clearTimeout(removeTimer);
        removeTimer = null;
      }
      if (el.dataset._origBg !== undefined) {
        el.style.backgroundColor = el.dataset._origBg || '';
        delete el.dataset._origBg;
      } else {
        el.style.backgroundColor = '';
      }
    };

    // Touch handlers: apply on touchstart, remove shortly after touchend
    el.addEventListener('touchstart', () => {
      applyHover();
    }, { passive: true });

    el.addEventListener('touchend', () => {
      // keep the visual for a short moment to mimic hover
      if (removeTimer) clearTimeout(removeTimer);
      removeTimer = setTimeout(clearHover, 350);
    }, { passive: true });

    el.addEventListener('touchcancel', () => {
      clearHover();
    }, { passive: true });

    // Pointer events support (for browsers that implement pointer events)
    el.addEventListener('pointerdown', (ev) => {
      if (ev.pointerType === 'touch') applyHover();
    });

    el.addEventListener('pointerup', (ev) => {
      if (ev.pointerType === 'touch') {
        if (removeTimer) clearTimeout(removeTimer);
        removeTimer = setTimeout(clearHover, 350);
      }
    });
  });
});
