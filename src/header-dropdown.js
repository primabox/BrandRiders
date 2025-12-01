// Header dropdown toggle script
const hamburger = document.querySelector('.header-link--icon');
const dropdown = document.querySelector('.header-dropdown');
const header = document.querySelector('header');
const closeBtn = document.querySelector('.header-dropdown__close');

if (hamburger && dropdown && header) {
  function openMenu() {
    header.classList.add('header--open');
    dropdown.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    // prevent body scroll while menu is open on small screens
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    header.classList.remove('header--open');
    dropdown.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const isOpen = header.classList.contains('header--open');
    if (isOpen) closeMenu(); else openMenu();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('header--open')) {
      closeMenu();
    }
  });

  // Close when clicking outside the header/dropdown
  document.addEventListener('click', (e) => {
    if (!header.classList.contains('header--open')) return;
    const target = e.target;
    if (!header.contains(target)) {
      closeMenu();
    }
  });

  // If the user resizes the viewport to a very large width, ensure menu closes
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1200 && header.classList.contains('header--open')) {
      closeMenu();
    }
  });
}
