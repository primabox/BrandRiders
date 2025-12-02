// Reviews show all functionality
document.addEventListener('DOMContentLoaded', () => {
  const showAllBtn = document.querySelector('.reviews-show-all-btn');
  const hideAllBtn = document.querySelector('.reviews-hide-all-btn');
  const reviewsSection = document.querySelector('.reviews-section');

  if (showAllBtn && hideAllBtn && reviewsSection) {
    showAllBtn.addEventListener('click', () => {
      reviewsSection.classList.add('show-all');
    });

    hideAllBtn.addEventListener('click', () => {
      reviewsSection.classList.remove('show-all');
      // Scroll back to reviews section
      reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});
