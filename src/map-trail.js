const section = document.querySelector('.map-trail-section');
if (!section) {
  console.warn('map-trail: section not found');
} else {
  const svg = section.querySelector('#mapTrailSvg');
  const path = svg && svg.querySelector('#trailPath');
  const car = document.getElementById('mapCar');
  const VB_W = 1165;
  const VB_H = 2130;
  
  if (!svg || !path || !car) {
    console.warn('map-trail: missing elements');
  } else {
    let pathLength = path.getTotalLength();
    let svgRect = svg.getBoundingClientRect();
    const DEBUG = true;
    let debugCircle = null;

    function updateRects() {
      svgRect = svg.getBoundingClientRect();
      pathLength = path.getTotalLength();
    }

    function clamp(v, a = 0, b = 1) {
      return Math.max(a, Math.min(b, v));
    }

    async function autoTrace() {
      try {
        console.log('🚀 Spouštím trackování...');
        
        const imgEl = svg.querySelector('image');
        if (!imgEl) throw new Error('Image not found');
        
        const src = imgEl.getAttribute('href') || imgEl.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
        if (!src) throw new Error('Image href not found');

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        await new Promise((res, rej) => { 
          img.onload = res; 
          img.onerror = rej; 
          img.src = src; 
        });

        console.log('✓ Obrázek načten');

        const canvas = document.createElement('canvas');
        canvas.width = VB_W;
        canvas.height = VB_H;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, VB_W, VB_H);
        const imageData = ctx.getImageData(0, 0, VB_W, VB_H);
        const data = imageData.data;

        // Vytvoř binární masku
        const mask = new Uint8Array(VB_W * VB_H);
        for (let y = 0; y < VB_H; y++) {
          for (let x = 0; x < VB_W; x++) {
            const idx = (y * VB_W + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            mask[y * VB_W + x] = (r > 200 && g > 200 && b > 200) ? 1 : 0;
          }
        }

        function isWhite(x, y) {
          if (x < 0 || x >= VB_W || y < 0 || y >= VB_H) return false;
          return mask[Math.floor(y) * VB_W + Math.floor(x)] === 1;
        }

        console.log('✓ Maska vytvořena');

        // Najdi start
        let startX = -1, startY = -1;
        for (let y = 0; y < VB_H && startY === -1; y++) {
          const whiteInRow = [];
          for (let x = 0; x < VB_W; x++) {
            if (isWhite(x, y)) whiteInRow.push(x);
          }
          if (whiteInRow.length > 10) {
            startX = whiteInRow[Math.floor(whiteInRow.length / 2)];
            startY = y;
          }
        }

        if (startX === -1) throw new Error('Start nenalezen');
        console.log(`✓ Start: (${startX}, ${startY})`);

        // Sleduj cestu s malým krokem - HUSTŠÍ BODY
        const points = [{x: startX, y: startY}];
        const step = 1;
        
        for (let y = startY + step; y < VB_H; y += step) {
          const lastPoint = points[points.length - 1];
          
          const whitePixels = [];
          for (let x = 0; x < VB_W; x++) {
            if (isWhite(x, y)) whitePixels.push(x);
          }
          
          if (whitePixels.length < 3) continue;
          
          // Rozděl na segmenty
          const segments = [];
          let seg = [whitePixels[0]];
          for (let i = 1; i < whitePixels.length; i++) {
            if (whitePixels[i] - whitePixels[i-1] <= 4) {
              seg.push(whitePixels[i]);
            } else {
              if (seg.length > 3) segments.push(seg);
              seg = [whitePixels[i]];
            }
          }
          if (seg.length > 3) segments.push(seg);
          
          if (segments.length === 0) continue;
          
          // Vážený střed každého segmentu
          const segmentCenters = segments.map(s => {
            let sumX = 0, sumWeight = 0;
            const mid = s.length / 2;
            
            for (let i = 0; i < s.length; i++) {
              const distFromMid = Math.abs(i - mid);
              const weight = Math.exp(-(distFromMid * distFromMid) / (s.length * s.length / 4));
              sumX += s[i] * weight;
              sumWeight += weight;
            }
            
            return {
              center: sumX / sumWeight,
              width: s.length
            };
          });
          
          // Najdi nejbližší segment
          let bestSeg = null;
          let bestScore = Infinity;
          
          for (const seg of segmentCenters) {
            const dist = Math.abs(seg.center - lastPoint.x);
            const widthBonus = Math.max(0, 50 - seg.width) * 0.1;
            const score = dist + widthBonus;
            
            if (dist < 250 && score < bestScore) {
              bestScore = score;
              bestSeg = seg;
            }
          }
          
          if (!bestSeg) {
            for (const seg of segmentCenters) {
              const dist = Math.abs(seg.center - lastPoint.x);
              if (dist < bestScore) {
                bestScore = dist;
                bestSeg = seg;
              }
            }
          }
          
          if (bestSeg) {
            points.push({x: bestSeg.center, y: y});
          }
        }

        console.log(`✓ Nalezeno ${points.length} bodů`);

        if (points.length < 50) throw new Error('Příliš málo bodů');

        // Jemnější vyhlazení
        function smoothPass(pts, radius) {
          const result = [];
          for (let i = 0; i < pts.length; i++) {
            let sumX = 0, sumY = 0, totalWeight = 0;
            for (let j = Math.max(0, i - radius); j <= Math.min(pts.length - 1, i + radius); j++) {
              const dist = Math.abs(i - j);
              const weight = Math.exp(-(dist * dist) / (2 * radius * radius / 2));
              sumX += pts[j].x * weight;
              sumY += pts[j].y * weight;
              totalWeight += weight;
            }
            result.push({x: sumX / totalWeight, y: sumY / totalWeight});
          }
          return result;
        }

        let smoothed = points;
        smoothed = smoothPass(smoothed, 3);
        smoothed = smoothPass(smoothed, 3);
        smoothed = smoothPass(smoothed, 2);

        console.log('✓ Vyhlazení dokončeno');

        // ŽÁDNÁ DECIMACE - použij všechny body nebo velmi konzervativní decimaci
        const decimated = [smoothed[0]];
        for (let i = 1; i < smoothed.length - 1; i++) {
          const last = decimated[decimated.length - 1];
          const curr = smoothed[i];
          const dist = Math.sqrt((curr.x - last.x)**2 + (curr.y - last.y)**2);
          // VELMI MALÁ VZDÁLENOST - zachová téměř všechny body
          if (dist >= 2) decimated.push(curr);
        }
        decimated.push(smoothed[smoothed.length - 1]);

        console.log(`✓ Po decimaci: ${decimated.length} bodů`);

        // Použij kvadratické Bézierovy křivky místo kubických pro menší odklon
        function makePath(pts) {
          if (pts.length < 2) return '';
          let d = `M ${pts[0].x} ${pts[0].y}`;
          
          for (let i = 0; i < pts.length - 1; i++) {
            const p1 = pts[i];
            const p2 = pts[i + 1];
            
            // Kontrolní bod uprostřed (méně agresivní zakřivení)
            const cpx = (p1.x + p2.x) / 2;
            const cpy = (p1.y + p2.y) / 2;
            
            d += ` Q ${cpx} ${cpy}, ${p2.x} ${p2.y}`;
          }
          return d;
        }

        const pathD = makePath(decimated);
        path.setAttribute('d', pathD);
        
        updateRects();
        
        console.log('✅ HOTOVO!');
        console.log(`📏 Path délka: ${pathLength.toFixed(0)}px`);

        if (DEBUG) {
          path.style.stroke = 'rgba(255,30,30,0.95)';
          path.style.strokeWidth = '3';
          path.style.fill = 'none';
        }

      } catch (e) {
        console.error('❌ Chyba:', e);
        alert('Chyba: ' + e.message);
      }
    }

    // === ANIMACE ===
    function getProgress() {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = vh + rect.height;
      return clamp((vh - rect.top) / total, 0, 1);
    }

    function updateCar() {
      updateRects();
      const prog = getProgress();
      if (prog < 0.05) {
        car.style.opacity = '0';
        return;
      }
      car.style.opacity = '1';

      const raw = clamp((prog - 0.05) / 0.95, 0, 1);
      const eased = Math.pow(raw, 2.2);
      const mult = 1 + 0.8 * (1 - Math.pow(raw, 6));
      const eff = clamp(eased * mult, 0, 1);
      const dist = eff * pathLength;
      
      if (!pathLength || isNaN(dist)) return;

      const point = path.getPointAtLength(dist);
      let x = point.x, y = point.y;
      
      try {
        const ctm = svg.getScreenCTM && svg.getScreenCTM();
        if (ctm) {
          const pt = svg.createSVGPoint();
          pt.x = point.x;
          pt.y = point.y;
          const screen = pt.matrixTransform(ctm);
          x = screen.x;
          y = screen.y;
        }
      } catch (err) {
        const scaleX = svgRect.width / VB_W || 1;
        const scaleY = svgRect.height / VB_H || 1;
        x = svgRect.left + point.x * scaleX;
        y = svgRect.top + point.y * scaleY;
      }

      let rot = 0;
      if (!isNaN(dist) && pathLength > 0) {
        const step = Math.max(1, pathLength * 0.002);
        const p2 = path.getPointAtLength(Math.min(pathLength, dist + step));
        const p1 = path.getPointAtLength(Math.max(0, dist - step));
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        const blend = raw > 0.55 ? Math.pow((raw - 0.55) / 0.45, 3) : 0;
        rot = angle * blend;
      }

      car.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg)`;

      if (DEBUG && debugCircle) {
        debugCircle.setAttribute('cx', point.x);
        debugCircle.setAttribute('cy', point.y);
      }
    }

    function tick() {
      updateCar();
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', updateRects);
    updateRects();
    requestAnimationFrame(tick);

    // UI
    if (DEBUG) {
      debugCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      debugCircle.setAttribute('r', '5');
      debugCircle.setAttribute('fill', '#0f0');
      svg.appendChild(debugCircle);

      // UI buttons removed: TRACKOVAT and EXPORT were removed per user request.
      // Kept auto-run and debug elements.

      setTimeout(autoTrace, 800);
    }
  }
}