/**
 * Mobile1 phone animation along SVG path based on scroll
 * Coordinated with mobile2 - this animates first half
 */
(function() {
  'use strict';

  const section1 = document.querySelector('.map-step-mobile-1');
  const section2 = document.querySelector('.map-step-mobile-2');
  const svg = document.querySelector('#mobile1Svg');
  const path = document.querySelector('#mobile1Path');
  const phone = document.getElementById('mobile1Phone');

  if (!section1 || !section2 || !svg || !path || !phone) {
    console.warn('Mobile1: Missing elements');
    return;
  }

  let pathLength = path.getTotalLength();

  // Configuration - animates during first half of combined scroll range
  const CONFIG = {
    startOffset: 0.1,
    endOffset: 0.4,  // End earlier for faster animation
    pathStart: 0,
    pathEnd: 1
  };

  function updatePhone() {
    // Get combined scroll progress across both sections
    const rect1 = section1.getBoundingClientRect();
    const rect2 = section2.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate combined height and position
    const topSection = Math.min(rect1.top, rect2.top);
    const bottomSection = Math.max(rect1.bottom, rect2.bottom);
    const combinedHeight = bottomSection - topSection;
    
    // Calculate raw scroll progress across both sections
    const rawProgress = (windowHeight - topSection) / (windowHeight + combinedHeight);
    
    // Apply start/end offsets
    const adjustedProgress = Math.max(0, Math.min(1,
      (rawProgress - CONFIG.startOffset) / (CONFIG.endOffset - CONFIG.startOffset)
    ));

    // Hide phone before animation starts or after it ends
    if (adjustedProgress <= 0 || adjustedProgress >= 1) {
      phone.style.opacity = '0';
      return;
    }
    phone.style.opacity = '1';

    // Map scroll progress to path range
    const pathProgress = CONFIG.pathStart + (adjustedProgress * (CONFIG.pathEnd - CONFIG.pathStart));
    const distance = pathProgress * pathLength;
    const point = path.getPointAtLength(distance);

    // Position phone on the path (in SVG coordinates)
    // Center the car on the point
    phone.setAttribute('x', point.x - 11.5); // 11.5 = half of car width (23/2)
    phone.setAttribute('y', point.y - 10); // 10 = half of car height (20/2)
  }

  // Update on scroll and resize
  let ticking = false;
  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updatePhone();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestUpdate);
  window.addEventListener('resize', () => {
    pathLength = path.getTotalLength();
    requestUpdate();
  });

  // Initial update
  updatePhone();
})();
