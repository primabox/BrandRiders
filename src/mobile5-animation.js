// mobile5-animation.js

// Get sections
const section1 = document.querySelector('.map-step-mobile-1');
const section2 = document.querySelector('.map-step-mobile-2');
const section3 = document.querySelector('.map-step-mobile-3');
const section4 = document.querySelector('.map-step-mobile-4');
const section5 = document.querySelector('.map-step-mobile-5');

if (!section1 || !section2 || !section3 || !section4 || !section5) {
  console.warn('Mobile5: One or more sections not found');
}

// Get SVG elements
const svg = document.getElementById('mobile5Svg');
const path = document.getElementById('mobile5Path');
const car = document.getElementById('mobile5Car');

if (!svg || !path || !car) {
  console.warn('Mobile5: SVG elements not found');
}

// Get path length
const pathLength = path ? path.getTotalLength() : 0;

// Configuration
const CONFIG = {
  startOffset: 0.65,  // Start at 65% of combined scroll (even earlier)
  endOffset: 0.85,    // End at 85% of combined scroll (faster)
  pathStart: 1,       // Start from end of path (right)
  pathEnd: 0          // End at beginning of path (left)
};

let carImageChanged = false; // Track if car image has been changed

function updateCar() {
  if (!section1 || !section2 || !section3 || !section4 || !section5 || !svg || !path || !car) return;

  const rect1 = section1.getBoundingClientRect();
  const rect2 = section2.getBoundingClientRect();
  const rect3 = section3.getBoundingClientRect();
  const rect4 = section4.getBoundingClientRect();
  const rect5 = section5.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate combined scroll progress
  const topSection = Math.min(rect1.top, rect2.top, rect3.top, rect4.top, rect5.top);
  const bottomSection = Math.max(rect1.bottom, rect2.bottom, rect3.bottom, rect4.bottom, rect5.bottom);
  const combinedHeight = bottomSection - topSection;

  // Raw progress: 0 when top of combined sections enters bottom of viewport
  //               1 when bottom of combined sections exits top of viewport
  const rawProgress = (windowHeight - topSection) / (windowHeight + combinedHeight);

  // Adjust progress to our start/end offsets
  const adjustedProgress = Math.max(0, Math.min(1, 
    (rawProgress - CONFIG.startOffset) / (CONFIG.endOffset - CONFIG.startOffset)
  ));

  // Calculate distance along path
  const pathProgress = CONFIG.pathStart + (CONFIG.pathEnd - CONFIG.pathStart) * adjustedProgress;
  const distance = pathLength * pathProgress;

  // Get point on path
  const point = path.getPointAtLength(distance);

  // Get car position in SVG coordinates
  const carSVGX = point.x;
  const carSVGY = point.y;
  
  // WaterHouse position: x="-20" y="80" width="94" height="94" -> center: (-20 + 47, 80 + 47) = (27, 127)
  const waterHousePos = { x: 27, y: 127 };
  
  // Change car to carpiggybank when passing waterHouse
  if (!carImageChanged && carSVGY > waterHousePos.y) {
    car.setAttribute('href', 'img/map/carpiggybank.png');
    car.setAttribute('width', '40');
    car.setAttribute('height', '40');
    carImageChanged = true;
  }

  // Position car (center it on the point)
  let carWidth = carImageChanged ? 40 : 33;
  let carHeight = carImageChanged ? 40 : 30;
  car.setAttribute('x', point.x - carWidth / 2);
  car.setAttribute('y', point.y - carHeight / 2);

  // Show/hide car based on progress
  if (adjustedProgress > 0 && adjustedProgress < 1) {
    car.style.opacity = '1';
  } else {
    car.style.opacity = '0';
  }
}

// Throttle updates using requestAnimationFrame
let ticking = false;
function requestUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateCar();
      ticking = false;
    });
    ticking = true;
  }
}

// Listen to scroll and resize
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate, { passive: true });

// Initial update
updateCar();
