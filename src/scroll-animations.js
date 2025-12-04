// Scroll Animations with Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
  // Configuration
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
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

  // Features section animation
  const featuresSection = document.querySelector('.features-section');
  if (featuresSection) {
    const featuresObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('features-visible');
          featuresObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    featuresObserver.observe(featuresSection);
  }

  // Download section animation
  const downloadSection = document.querySelector('.download-section');
  if (downloadSection) {
    const downloadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('download-visible');
          downloadObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    downloadObserver.observe(downloadSection);
  }

  // Earnings section animation
  const earningsSection = document.querySelector('.earnings-section');
  if (earningsSection) {
    const earningsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('earnings-visible');
          earningsObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    earningsObserver.observe(earningsSection);
  }

  // Community section animation
  const communitySection = document.querySelector('.community-section');
  if (communitySection) {
    const communityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('community-visible');
          communityObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    communityObserver.observe(communitySection);
  }

  // Register section animation
  const registerSection = document.querySelector('.register');
  if (registerSection) {
    const registerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('register-visible');
          registerObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    registerObserver.observe(registerSection);
  }

  // Showcase carousel section animation
  const showcaseSection = document.querySelector('.showcase-carousel');
  if (showcaseSection) {
    const showcaseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('showcase-visible');
          showcaseObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    showcaseObserver.observe(showcaseSection);
  }

  // Map trail section animation
  const mapTrailSection = document.querySelector('.map-trail-section');
  if (mapTrailSection) {
    const mapTrailObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('map-trail-visible');
          mapTrailObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    mapTrailObserver.observe(mapTrailSection);
  }

  // Promo section animation
  const promoSection = document.querySelector('.promo-section');
  if (promoSection) {
    const promoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('promo-visible');
          promoObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    promoObserver.observe(promoSection);
  }

  // Questions section animation
  const questionsSection = document.querySelector('.questions-section');
  if (questionsSection) {
    const questionsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('questions-visible');
          questionsObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    questionsObserver.observe(questionsSection);
  }

  // Advertise section animation
  const advertiseSection = document.querySelector('.advertise-section');
  if (advertiseSection) {
    const advertiseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('advertise-visible');
          advertiseObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    advertiseObserver.observe(advertiseSection);
  }

  // Footer animation
  const footer = document.querySelector('.site-footer');
  if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('footer-visible');
          footerObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    footerObserver.observe(footer);
  }

  // Reviews section animations
  const reviewsSection = document.querySelector('.reviews-section');
  if (reviewsSection) {
    const reviewsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reviews-visible');
          reviewsObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    reviewsObserver.observe(reviewsSection);
  }

  // Mobile steps animations
  const mobileSteps = document.querySelectorAll('.map-step-mobile');
  if (mobileSteps.length > 0) {
    const mobileStepsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mobile-step-visible');
          mobileStepsObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    mobileSteps.forEach(step => {
      mobileStepsObserver.observe(step);
    });
  }
});
