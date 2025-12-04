/**
 * Mobile2 car animation along SVG path based on scroll
 * Coordinated with mobile1 - this animates second half
 */
(function() {
  'use strict';

  const section1 = document.querySelector('.map-step-mobile-1');
  const section2 = document.querySelector('.map-step-mobile-2');
  const svg = document.querySelector('#mobile2Svg');
  const path = document.querySelector('#mobile2Path');
  const car = document.getElementById('mobile2Car');
  
  // Get all decorative icons that should hide when car passes
  const iconPump = svg.querySelector('image[href*="pumpGreen.png"]');
  const iconStit = svg.querySelector('image[href*="stitGreen.png"]');
  const iconTire = svg.querySelector('image[href*="tireGreen.png"]');
  const iconFastfood = svg.querySelector('image[href*="fastfoodGreen.png"]');
  const icons = [iconPump, iconStit, iconTire, iconFastfood].filter(Boolean);

  if (!section1 || !section2 || !svg || !path || !car) {
    console.warn('Mobile2: Missing elements');
    return;
  }

  let pathLength = path.getTotalLength();

  // Configuration - reversed direction, animates during second half of combined scroll range
  const CONFIG = {
    startOffset: 0.4,  // Start right after mobile1
    endOffset: 0.7,    // End earlier for faster animation
    pathStart: 1,  // Start from end of path (left side)
    pathEnd: 0     // End at beginning of path (right side)
  };

  function updateCar() {
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
    
    // Hide icons when car passes near them
    // Icon positions in SVG coordinates (based on HTML):
    // pumpGreen: x="50" y="-25" width="44" height="44" -> center: (50 + 22, -25 + 22) = (72, -3)
    // stitGreen: x="130" y="-10" width="30" height="36" -> center: (130 + 15, -10 + 18) = (145, 8)
    // tireGreen: x="210" y="10" width="34" height="34" -> center: (210 + 17, 10 + 17) = (227, 27)
    // fastfoodGreen: x="275" y="30" width="38" height="38" -> center: (275 + 19, 30 + 19) = (294, 49)
    
    const iconPositions = [
      { x: 72, y: -3 },      // pump
      { x: 145, y: 8 },      // stit
      { x: 227, y: 27 },     // tire
      { x: 294, y: 49 }      // fastfood
    ];
    
    const hideDistance = 50; // Distance in SVG units when to hide icon
    
    icons.forEach((icon, index) => {
      if (!icon) return;
      
      const iconPos = iconPositions[index];
      const dist = Math.sqrt(
        Math.pow(point.x - iconPos.x, 2) + 
        Math.pow(point.y - iconPos.y, 2)
      );
      
      if (dist < hideDistance) {
        // Car is near - hide icon
        icon.style.opacity = '0';
        icon.style.transition = 'opacity 0.3s ease';
      } else {
        // Car is far - show icon
        icon.style.opacity = '1';
        icon.style.transition = 'opacity 0.4s ease';
      }
    });
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
