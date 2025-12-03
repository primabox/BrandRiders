/**
 * Simple car animation along SVG path based on scroll
 */
(function() {
  'use strict';

  const section = document.querySelector('.map-trail-section');
  const svg = document.querySelector('#mapTrailSvg');
  const path = document.querySelector('#trailPath');
  const car = document.getElementById('mapCar');
  
  // Get all icons in the mapStepIcons group
  const iconPump = document.getElementById('icon-pump');
  const iconStit = document.getElementById('icon-stit');
  const iconTire = document.getElementById('icon-tire');
  const iconFastfood = document.getElementById('icon-fastfood');
  const icons = [iconPump, iconStit, iconTire, iconFastfood].filter(Boolean);

  if (!section || !svg || !path || !car) {
    console.warn('Map trail: Missing elements');
    return;
  }

  let pathLength = path.getTotalLength();
  let carImageChanged = false; // Track if car image has been changed
  let carImageChangedToPiggyBank = false; // Track if car changed to piggy bank

  // Configuration: Adjust these to control scroll-to-path synchronization
  const CONFIG = {
    // When to start the animation (0 = when section enters viewport, 1 = when section is fully visible)
    startOffset: 0.15,
    // When to end the animation (0 = when section starts exiting, 1 = when fully scrolled past)
    endOffset: 0.85,
    // Path start position (0 = beginning of path, 1 = end of path) - start later to appear from cottage
    pathStart: 0.02,
    // Path end position (0 = beginning of path, 1 = end of path)
    pathEnd: 0.99
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
    
    // Animate icons: hide them one by one as car passes based on SVG coordinates
    // Get car position in SVG coordinates
    const carSVGX = point.x;
    const carSVGY = point.y;
    
    // Villa position: x="-30" y="1060" (approximate center considering width/height)
    const villaPos = { x: -30 + 155/2, y: 1060 + 155/2 }; // center of villa image
    const distToVilla = Math.sqrt(
      Math.pow(carSVGX - villaPos.x, 2) + 
      Math.pow(carSVGY - villaPos.y, 2)
    );
    
    // Change car image to red after passing villa
    if (!carImageChanged && carSVGY > villaPos.y) {
      car.src = 'img/map/carRed.png';
      car.style.transition = 'opacity 0.3s ease';
      carImageChanged = true;
    } else if (carImageChanged && carSVGY <= villaPos.y) {
      // Reset to original if scrolling back up
      car.src = 'img/map/car.png';
      car.style.transition = 'opacity 0.3s ease';
      carImageChanged = false;
    }
    
    // Corporate half position: transform="translate(820,1440)" + x="120" y="70"
    const corpHalfPos = { x: 820 + 120 + 133/2, y: 1440 + 70 + 197/2 }; // center of corp-half image
    
    // Change car image to piggy bank after passing corporate half
    if (!carImageChangedToPiggyBank && carSVGY > corpHalfPos.y) {
      car.src = 'img/map/carpiggyBank.png';
      car.style.transition = 'opacity 0.3s ease';
      carImageChangedToPiggyBank = true;
    } else if (carImageChangedToPiggyBank && carSVGY <= corpHalfPos.y) {
      // Reset to red car if scrolling back up (but still past villa)
      if (carSVGY > villaPos.y) {
        car.src = 'img/map/carRed.png';
      }
      carImageChangedToPiggyBank = false;
    }
    
    // Water house position: x="220" y="2020"
    const waterHousePos = { x: 220 + 182/2, y: 2020 + 182/2 }; // center of water house image
    
    // Hide car when reaching water house
    if (carSVGY > waterHousePos.y - 100) {
      car.style.opacity = '0';
      return;
    }
    
    // Icon group is at transform="translate(740,420)", so icons are at:
    // icon-pump: 740+50=790, 420+0=420
    // icon-stit: 740+180=920, 420+30=450
    // icon-tire: 740+280=1020, 420+90=510
    // icon-fastfood: 740+350=1090, 420+155=575
    
    const iconSVGPositions = [
      { x: 790, y: 420 },   // pump
      { x: 920, y: 450 },   // stit
      { x: 1020, y: 510 },  // tire
      { x: 1090, y: 575 }   // fastfood
    ];
    
    const hideDistance = 100; // Distance in SVG units when to hide icon (increased for better detection)
    
    icons.forEach((icon, index) => {
      if (!icon) return;
      
      const iconPos = iconSVGPositions[index];
      const dist = Math.sqrt(
        Math.pow(carSVGX - iconPos.x, 2) + 
        Math.pow(carSVGY - iconPos.y, 2)
      );
      
      // Debug: log when car is near tire icon
      if (index === 2 && dist < 150) {
        console.log(`Tire icon - Car distance: ${dist.toFixed(0)}, Car pos: (${carSVGX.toFixed(0)}, ${carSVGY.toFixed(0)})`);
      }
      
      if (dist < hideDistance) {
        // Car is near - completely hide icon
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