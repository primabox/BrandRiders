/**
 * Mobile3 car animation along SVG path based on scroll
 * Coordinated with mobile1 and mobile2 - this animates third part
 */
(function() {
  'use strict';

  const section1 = document.querySelector('.map-step-mobile-1');
  const section2 = document.querySelector('.map-step-mobile-2');
  const section3 = document.querySelector('.map-step-mobile-3');
  const svg = document.querySelector('#mobile3Svg');
  const path = document.querySelector('#mobile3Path');
  const car = document.getElementById('mobile3Car');

  if (!section1 || !section2 || !section3 || !svg || !path || !car) {
    console.warn('Mobile3: Missing elements');
    return;
  }

  let pathLength = path.getTotalLength();

  // Configuration - animates during third part of combined scroll range
  const CONFIG = {
    startOffset: 0.7,  // Start after mobile2
    endOffset: 0.85,   // End earlier for faster animation
    pathStart: 0,      // Start from beginning of path (right side)
    pathEnd: 1         // End at end of path (right side, going down)
  };

  let carImageChanged = false; // Track if car image has been changed

  function updateCar() {
    // Get combined scroll progress across all three sections
    const rect1 = section1.getBoundingClientRect();
    const rect2 = section2.getBoundingClientRect();
    const rect3 = section3.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate combined height and position
    const topSection = Math.min(rect1.top, rect2.top, rect3.top);
    const bottomSection = Math.max(rect1.bottom, rect2.bottom, rect3.bottom);
    const combinedHeight = bottomSection - topSection;
    
    // Calculate raw scroll progress across all sections
    const rawProgress = (windowHeight - topSection) / (windowHeight + combinedHeight);
    
    // Apply start/end offsets
    const adjustedProgress = Math.max(0, Math.min(1,
      (rawProgress - CONFIG.startOffset) / (CONFIG.endOffset - CONFIG.startOffset)
    ));

    // Hide car before animation starts or after it ends
    if (adjustedProgress <= 0 || adjustedProgress >= 1) {
      car.style.opacity = '0';
      return;
    }
    car.style.opacity = '1';

    // Map scroll progress to path range
    const pathProgress = CONFIG.pathStart + (adjustedProgress * (CONFIG.pathEnd - CONFIG.pathStart));
    const distance = pathProgress * pathLength;
    const point = path.getPointAtLength(distance);

    // Position car on the path (in SVG coordinates)
    // Center the car on the point
    car.setAttribute('x', point.x - 11.5); // 11.5 = half of car width (23/2)
    car.setAttribute('y', point.y - 10); // 10 = half of car height (20/2)
    
    // Get car position in SVG coordinates
    const carSVGX = point.x;
    const carSVGY = point.y;
    
    // Villa position: x="-20" y="140" width="77" height="77" -> center: (-20 + 38.5, 140 + 38.5) = (18.5, 178.5)
    const villaPos = { x: 18.5, y: 178.5 };
    
    // Change car to red after passing villa
    if (!carImageChanged && carSVGY > villaPos.y) {
      car.setAttribute('href', 'img/map/carRed.png');
      car.setAttribute('width', '20');
      car.setAttribute('height', '20');
      car.style.transition = 'opacity 0.3s ease';
      carImageChanged = true;
    } else if (carImageChanged && carSVGY <= villaPos.y) {
      // Reset to original if scrolling back up
      car.setAttribute('href', 'img/map/car.png');
      car.setAttribute('width', '23');
      car.setAttribute('height', '20');
      car.style.transition = 'opacity 0.3s ease';
      carImageChanged = false;
    }
    
    // Adjust car centering when size changes
    if (carImageChanged) {
      car.setAttribute('x', point.x - 10); // 10 = half of carRed width (20/2)
      car.setAttribute('y', point.y - 10); // 10 = half of carRed height (20/2)
    }
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
