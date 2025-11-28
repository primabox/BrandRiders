// Move the "ZOBRAZIT VŠETKY" control under the question car on small screens
(function () {
  // On mobile we want the small question car to appear AFTER the "ZOBRAZIT VŠETKY" link.
  // This function moves the mobile car element under the show-all link when viewport <=480px
  // and restores it to its original position (after the regular questions-bg) on larger screens.
  function adjustMobileCar() {
    const show = document.querySelector('.questions-show-all');
    const qbg = document.querySelector('.questions-bg');
    const qbgMobile = document.querySelector('.questions-bg-mobile');
    if (!qbgMobile) return;

    const mq = window.matchMedia('(max-width: 480px)');
    if (mq.matches) {
      // If the show-all exists, place the mobile car immediately after it
      if (show) {
        const parent = show.parentNode;
        const after = show.nextSibling;
        if (after !== qbgMobile) parent.insertBefore(qbgMobile, after);
      } else {
        // Fallback: ensure mobile car is before the accordion center container
        const flexContainer = document.querySelector('.questions-section .flex.flex-col.items-center');
        if (flexContainer && flexContainer !== qbgMobile.parentNode) {
          flexContainer.appendChild(qbgMobile);
        }
      }
    } else {
      // Restore original placement: after the regular questions-bg element (if present)
      if (qbg && qbg.parentNode) {
        const after = qbg.nextSibling;
        if (after !== qbgMobile) qbg.parentNode.insertBefore(qbgMobile, after);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', adjustMobileCar);
  window.addEventListener('resize', adjustMobileCar);
  window.addEventListener('orientationchange', adjustMobileCar);
})();
