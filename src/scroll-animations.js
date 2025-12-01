// Scroll Animations with Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
  // Configuration
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // Optional: stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));

  // Cursor parallax for hero icons (optional)
  const heroIcons = document.querySelectorAll('.hero-icon.parallax');
  if (heroIcons.length > 0) {
    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      heroIcons.forEach(icon => {
        const moveX = (clientX - centerX) / centerX * -20;
        const moveY = (clientY - centerY) / centerY * -20;
        icon.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }

  // Sequential animation for feature content rows
  const featureSections = document.querySelectorAll('.feature-section');
  featureSections.forEach(section => {
    const rows = section.querySelectorAll('.feature-content-row');
    
    const rowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          rows.forEach((row, index) => {
            setTimeout(() => {
              row.classList.add('animated');
            }, index * 100); // 100ms delay between each row
          });
          rowObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    if (rows.length > 0) {
      rowObserver.observe(section);
    }
  });

  // Sequential animation for app badges
  const appBadgeContainer = document.querySelector('.app-badges-container');
  if (appBadgeContainer) {
    const badges = appBadgeContainer.querySelectorAll('.app-badge');
    
    const badgeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          badges.forEach(badge => badge.classList.add('animated'));
          badgeObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    badgeObserver.observe(appBadgeContainer);
  }

  // Benefits cards animation
  const benefitsCards = document.querySelectorAll('.benefits-card');
  benefitsCards.forEach(card => observer.observe(card));
});
