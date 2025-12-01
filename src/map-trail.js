/**
 * Simple car animation along SVG path based on scroll
 */
(function() {
  'use strict';

  const section = document.querySelector('.map-trail-section');
  const svg = document.querySelector('#mapTrailSvg');
  const path = document.querySelector('#trailPath');
  const car = document.getElementById('mapCar');

  if (!section || !svg || !path || !car) {
    console.warn('Map trail: Missing elements');
    return;
  }

  let pathLength = path.getTotalLength();

  // Configuration: Adjust these to control scroll-to-path synchronization
  const CONFIG = {
    // When to start the animation (0 = when section enters viewport, 1 = when section is fully visible)
    startOffset: 0.2,
    // When to end the animation (0 = when section starts exiting, 1 = when fully scrolled past)
    endOffset: 0.8,
    // Path start position (0 = beginning of path, 1 = end of path)
    pathStart: 0,
    // Path end position (0 = beginning of path, 1 = end of path)
    pathEnd: 1
  };

  function updateCar() {
    // Get section position relative to viewport
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate raw scroll progress (0 when section enters bottom, 1 when it exits top)
    const rawProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
    
    // Apply start/end offsets to control animation range
    const adjustedProgress = Math.max(0, Math.min(1,
      (rawProgress - CONFIG.startOffset) / (CONFIG.endOffset - CONFIG.startOffset)
    ));

    // Hide car before animation starts
    if (adjustedProgress <= 0) {
      car.style.opacity = '0';
      return;
    }
    car.style.opacity = '1';

    // Map scroll progress to path range
    const pathProgress = CONFIG.pathStart + (adjustedProgress * (CONFIG.pathEnd - CONFIG.pathStart));
    const distance = pathProgress * pathLength;
    const point = path.getPointAtLength(distance);

    // Convert SVG point to screen coordinates
    const ctm = path.getScreenCTM();
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = point.x;
    svgPoint.y = point.y;
    const screenPoint = svgPoint.matrixTransform(ctm);

    // Position car at center without rotation
    car.style.transform = `translate(${screenPoint.x}px, ${screenPoint.y}px) translate(-50%, -50%)`;
  }

  // Update on scroll and resize
  let ticking = false;
  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateCar();
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
  updateCar();
})();