// Vice Lights cover renderer: turns photos + a caption into a multi-panel
// Vice City style poster on any canvas. Everything here is drawn by hand on
// a 2D context — no image is fetched, no Rockstar art is used, and the only
// fonts are the OFL Anton and Pacifico files vendored under app/fonts/.

export const LAYOUTS = [
  { id: 'nine-grid', name: 'Nine Grid', blurb: '3 x 3 panels, title in the middle' },
  { id: 'hero-top', name: 'Hero Top', blurb: 'Wide hero photo, three panels below' },
  { id: 'hero-left', name: 'Hero Left', blurb: 'Tall hero on the left, stack on the right' },
  { id: 'hero-right', name: 'Hero Right', blurb: 'Tall hero on the right, stack on the left' },
  { id: 'skyline', name: 'Skyline', blurb: 'Drawn sunset skyline over three photos' },
  { id: 'full-bleed', name: 'Full Bleed', blurb: 'One photo edge to edge, title band' },
  { id: 'four-split', name: 'Four Split', blurb: 'Four quarters, title band below' },
  { id: 'diagonal', name: 'Diagonal', blurb: 'Slanted hero, two panels beside it' },
];

export const GRADES = [
  { id: 'vice-sunset', name: 'Vice Sunset', sky: ['#ff9a3d', '#ff5e7a', '#7b2f8e'], tint: 'rgba(255,94,122,0.20)', title: ['#fff3c4', '#ffb03a'], badge: '#ff2e88', frame: '#ffffff', glow: '#ff2e88' },
  { id: 'neon-pink', name: 'Neon Pink', sky: ['#ff7ad9', '#c026d3', '#1e1b4b'], tint: 'rgba(217,70,239,0.24)', title: ['#ffffff', '#ff7ad9'], badge: '#00e5ff', frame: '#ffffff', glow: '#ff2ee6' },
  { id: 'golden-hour', name: 'Golden Hour', sky: ['#ffd166', '#f4841f', '#7c2d12'], tint: 'rgba(245,158,11,0.20)', title: ['#fff7d6', '#f59e0b'], badge: '#f59e0b', frame: '#fff7ed', glow: '#fbbf24' },
  { id: 'miami-teal', name: 'Miami Teal', sky: ['#5eead4', '#0ea5a4', '#134e4a'], tint: 'rgba(45,212,191,0.20)', title: ['#ecfeff', '#5eead4'], badge: '#06b6d4', frame: '#ecfeff', glow: '#22d3ee' },
  { id: 'purple-haze', name: 'Purple Haze', sky: ['#c4b5fd', '#7c3aed', '#2e1065'], tint: 'rgba(139,92,246,0.26)', title: ['#f5f3ff', '#c4b5fd'], badge: '#8b5cf6', frame: '#ede9fe', glow: '#a78bfa' },
  { id: 'noir', name: 'Noir', sky: ['#e5e7eb', '#6b7280', '#111827'], tint: 'rgba(17,24,39,0.30)', title: ['#ffffff', '#d1d5db'], badge: '#111827', frame: '#f9fafb', glow: '#9ca3af' },
  { id: 'hot-coral', name: 'Hot Coral', sky: ['#fda4af', '#f43f5e', '#7f1d1d'], tint: 'rgba(244,63,94,0.22)', title: ['#fff1f2', '#fb7185'], badge: '#f43f5e', frame: '#fff1f2', glow: '#fb7185' },
];

export const LETTERINGS = [
  { id: 'vice-block', name: 'Vice Block', blurb: 'Anton capitals, sunset gradient fill' },
  { id: 'neon-glow', name: 'Neon Glow', blurb: 'White Anton with a hot pink glow' },
  { id: 'outline-pop', name: 'Outline Pop', blurb: 'Hollow Anton, thick white stroke' },
  { id: 'script-pop', name: 'Script Pop', blurb: 'Pacifico script title, Anton badge' },
];

export const SAMPLES = [
  { id: 'boulevard', file: 'samples/boulevard.jpg', label: 'Boulevard' },
  { id: 'rooftop-woman', file: 'samples/rooftop-woman.jpg', label: 'Rooftop' },
  { id: 'rooftop-man', file: 'samples/rooftop-man.jpg', label: 'Rooftop' },
  { id: 'neon-friends', file: 'samples/neon-friends.jpg', label: 'Neon night' },
  { id: 'skater', file: 'samples/skater.jpg', label: 'Skater' },
  { id: 'pier', file: 'samples/pier.jpg', label: 'Pier' },
];

export const SIZES = [
  { id: '1920x1080', w: 1920, h: 1080, name: 'Wide 1920 x 1080' },
  { id: '1080x1350', w: 1080, h: 1350, name: 'Portrait 1080 x 1350' },
  { id: '1080x1080', w: 1080, h: 1080, name: 'Square 1080 x 1080' },
];

// Panel plan for one layout: photo panels in fractions of the cover, plus the
// rectangle the title block sits in. `photo` is the slot index a panel draws.
export function layoutPanels(layout, W, H) {
  const g = 0.008 * Math.min(W, H); // gutter, scales with the cover
  const f = (x, y, w, h, photo, art = false) => ({ x: x * W, y: y * H, w: w * W, h: h * H, photo, art });
  switch (layout) {
    case 'nine-grid':
      return {
        panels: [
          f(0, 0, 1 / 3, 1 / 3, 0), f(1 / 3, 0, 1 / 3, 1 / 3, 1), f(2 / 3, 0, 1 / 3, 1 / 3, 2),
          f(0, 1 / 3, 1 / 3, 1 / 3, 3), f(2 / 3, 1 / 3, 1 / 3, 1 / 3, 0),
          f(0, 2 / 3, 1 / 3, 1 / 3, 1), f(1 / 3, 2 / 3, 1 / 3, 1 / 3, 2), f(2 / 3, 2 / 3, 1 / 3, 1 / 3, 3),
        ],
        title: { x: W / 3, y: H / 3, w: W / 3, h: H / 3, align: 'center' },
        gutter: g,
      };
    case 'hero-top':
      return {
        panels: [
          f(0, 0, 1, 0.58, 3), f(0, 0.58, 1 / 3, 0.42, 0), f(1 / 3, 0.58, 1 / 3, 0.42, 1), f(2 / 3, 0.58, 1 / 3, 0.42, 2),
        ],
        title: { x: 0, y: H * 0.58, w: W, h: H * 0.42, align: 'center' },
        gutter: g,
      };
    case 'hero-left':
      return {
        panels: [
          f(0, 0, 0.55, 1, 1), f(0.55, 0, 0.45, 1 / 3, 2), f(0.55, 1 / 3, 0.45, 1 / 3, 3), f(0.55, 2 / 3, 0.45, 1 / 3, 0),
        ],
        title: { x: 0, y: H * 0.62, w: W * 0.55, h: H * 0.38, align: 'center' },
        gutter: g,
      };
    case 'hero-right':
      return {
        panels: [
          f(0.45, 0, 0.55, 1, 1), f(0, 0, 0.45, 1 / 3, 0), f(0, 1 / 3, 0.45, 1 / 3, 2), f(0, 2 / 3, 0.45, 1 / 3, 3),
        ],
        title: { x: W * 0.45, y: H * 0.62, w: W * 0.55, h: H * 0.38, align: 'center' },
        gutter: g,
      };
    case 'skyline':
      return {
        panels: [
          f(0, 0, 1, 0.46, -1, true), f(0, 0.46, 1 / 3, 0.54, 3), f(1 / 3, 0.46, 1 / 3, 0.54, 2), f(2 / 3, 0.46, 1 / 3, 0.54, 0),
        ],
        title: { x: 0, y: H * 0.46, w: W, h: H * 0.54, align: 'center' },
        gutter: g,
      };
    case 'full-bleed':
      return {
        panels: [f(0, 0, 1, 1, 0)],
        title: { x: 0, y: H * 0.60, w: W, h: H * 0.40, align: 'center' },
        gutter: 0,
      };
    case 'four-split':
      return {
        panels: [
          f(0, 0, 0.5, 0.38, 0), f(0.5, 0, 0.5, 0.38, 1), f(0, 0.38, 0.5, 0.38, 2), f(0.5, 0.38, 0.5, 0.38, 3),
        ],
        title: { x: 0, y: H * 0.76, w: W, h: H * 0.24, align: 'center', band: true },
        gutter: g,
      };
    case 'diagonal':
    default:
      return {
        panels: [
          f(0, 0, 0.62, 1, 0, false), f(0.62, 0, 0.38, 0.5, 1), f(0.62, 0.5, 0.38, 0.5, 2),
        ],
        title: { x: 0, y: H * 0.64, w: W * 0.62, h: H * 0.36, align: 'center' },
        gutter: g,
        diagonal: true,
      };
  }
}

function gradeById(id) {
  return GRADES.find((g) => g.id === id) || GRADES[0];
}

// Cover-fit draw of one photo into a rectangle, with a per-photo zoom and pan.
function drawPhotoInto(ctx, img, rect, crop) {
  const zoom = crop?.zoom ?? 1;
  const ox = crop?.ox ?? 0;
  const oy = crop?.oy ?? 0;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const base = Math.max(rect.w / iw, rect.h / ih) * zoom;
  const pw = iw * base;
  const ph = ih * base;
  const dx = rect.x + (rect.w - pw) / 2 + ox * rect.w * 0.25;
  const dy = rect.y + (rect.h - ph) / 2 + oy * rect.h * 0.25;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, pw, ph);
  ctx.restore();
}

// The drawn sunset skyline: gradient sky, slatted sun, building silhouettes
// with lit windows, palm silhouettes and a dark water band. All vector art.
export function drawSkylineArt(ctx, rect, grade) {
  const { x, y, w, h } = rect;
  const sky = ctx.createLinearGradient(0, y, 0, y + h);
  sky.addColorStop(0, grade.sky[0]);
  sky.addColorStop(0.55, grade.sky[1]);
  sky.addColorStop(1, grade.sky[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);
  // Slatted sun, high in the sky so it clears the rooftops.
  const sunR = h * 0.36;
  const sunX = x + w * 0.5;
  const sunY = y + h * 0.36;
  ctx.save();
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.clip();
  const sun = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
  sun.addColorStop(0, '#fff7ae');
  sun.addColorStop(1, '#ffb03a');
  ctx.fillStyle = sun;
  ctx.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);
  ctx.fillStyle = grade.sky[1];
  for (let i = 0; i < 4; i++) {
    const sy = sunY + sunR * (0.05 + i * 0.16);
    ctx.fillRect(sunX - sunR, sy, sunR * 2, sunR * (0.03 + i * 0.02));
  }
  ctx.restore();
  // Buildings, deterministic from a tiny seeded sequence so every export matches.
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const horizon = y + h * 0.74;
  ctx.fillStyle = 'rgba(24,10,40,0.92)';
  let bx = x;
  while (bx < x + w) {
    const bw = w * (0.06 + rnd() * 0.09);
    const bh = h * (0.10 + rnd() * 0.24);
    ctx.fillRect(bx, horizon - bh, bw, bh);
    ctx.fillStyle = 'rgba(255,176,58,0.9)';
    for (let wy = horizon - bh + h * 0.03; wy < horizon - h * 0.02; wy += h * 0.055) {
      for (let wx = bx + bw * 0.18; wx < bx + bw * 0.85; wx += bw * 0.32) {
        if (rnd() > 0.55) ctx.fillRect(wx, wy, Math.max(2, w * 0.004), Math.max(2, h * 0.012));
      }
    }
    ctx.fillStyle = 'rgba(24,10,40,0.92)';
    bx += bw + w * 0.012;
  }
  // Dark water band under the skyline, with the sun's reflection in it.
  const water = ctx.createLinearGradient(0, horizon, 0, y + h);
  water.addColorStop(0, 'rgba(20,8,36,0.95)');
  water.addColorStop(1, 'rgba(10,4,24,1)');
  ctx.fillStyle = water;
  ctx.fillRect(x, horizon, w, y + h - horizon);
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#ffb03a';
  for (let i = 0; i < 5; i++) {
    const rw = w * (0.10 - i * 0.012);
    ctx.fillRect(sunX - rw / 2, horizon + (y + h - horizon) * (0.12 + i * 0.18), rw, Math.max(2, h * 0.02));
  }
  ctx.restore();
  // Palm silhouettes at both edges.
  drawPalm(ctx, x + w * 0.045, horizon, h * 0.30);
  drawPalm(ctx, x + w * 0.955, horizon, h * 0.26);
}

function drawPalm(ctx, px, groundY, size) {
  ctx.save();
  ctx.strokeStyle = 'rgba(16,6,28,0.95)';
  ctx.fillStyle = 'rgba(16,6,28,0.95)';
  ctx.lineWidth = Math.max(2, size * 0.03);
  ctx.beginPath();
  ctx.moveTo(px, groundY);
  ctx.quadraticCurveTo(px + size * 0.06, groundY - size * 0.6, px + size * 0.16, groundY - size);
  ctx.stroke();
  const topX = px + size * 0.16;
  const topY = groundY - size;
  for (let i = 0; i < 7; i++) {
    const a = (-Math.PI * 0.95) + (i * Math.PI * 0.32);
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(
      topX + Math.cos(a) * size * 0.35, topY + Math.sin(a) * size * 0.35 - size * 0.12,
      topX + Math.cos(a) * size * 0.55, topY + Math.sin(a) * size * 0.55 + size * 0.22,
    );
    ctx.stroke();
  }
  ctx.restore();
}

// Seeded film grain, tiled over the cover at low opacity.
let grainTile = null;
function grainCanvas() {
  if (grainTile) return grainTile;
  const t = document.createElement('canvas');
  t.width = 140;
  t.height = 140;
  const c = t.getContext('2d');
  const img = c.createImageData(140, 140);
  let seed = 20261119;
  for (let i = 0; i < img.data.length; i += 4) {
    seed = (seed * 16807) % 2147483647;
    const v = seed % 256;
    img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  c.putImageData(img, 0, 0);
  grainTile = t;
  return t;
}

function drawStars(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  const gap = size * 1.5;
  for (let i = -2; i <= 2; i++) {
    const sx = cx + i * gap;
    const sy = cy;
    const r = size / 2;
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const ang = -Math.PI / 2 + (k * Math.PI) / 5;
      const rad = k % 2 === 0 ? r : r * 0.45;
      const px = sx + Math.cos(ang) * rad;
      const py = sy + Math.sin(ang) * rad;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function fitFont(ctx, text, maxWidth, startPx, family, weight = '') {
  let px = startPx;
  ctx.font = `${weight} ${px}px ${family}`.trim();
  while (ctx.measureText(text).width > maxWidth && px > 10) {
    px -= 2;
    ctx.font = `${weight} ${px}px ${family}`.trim();
  }
  return px;
}

// The title block: stars, big title, script subtitle, pill badge.
function drawTitleBlock(ctx, zone, state, grade) {
  const { title, subtitle, badge, lettering } = state;
  const cx = zone.x + zone.w / 2;
  const pad = zone.w * 0.04;
  // Soft dark wash so lettering reads on any photo.
  if (!zone.band) {
    const wash = ctx.createLinearGradient(0, zone.y, 0, zone.y + zone.h);
    wash.addColorStop(0, 'rgba(10,4,24,0)');
    wash.addColorStop(1, 'rgba(10,4,24,0.62)');
    ctx.fillStyle = wash;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
  } else {
    ctx.fillStyle = 'rgba(12,5,28,0.96)';
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
  }
  const titleText = (title || 'VICE LIGHTS').trim().toUpperCase();
  const subText = (subtitle || '').trim();
  const badgeText = (badge || '').trim().toUpperCase();
  const starY = zone.y + zone.h * 0.16;
  const starSize = Math.min(zone.w, zone.h) * 0.055;
  drawStars(ctx, cx, starY, starSize, grade.title[1]);
  // Title.
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleMax = zone.w - pad * 2;
  let titlePx;
  let titleY = zone.y + zone.h * 0.48;
  if (lettering === 'script-pop') {
    titlePx = fitFont(ctx, titleText, titleMax, zone.h * 0.34, 'Pacifico');
    ctx.font = `${titlePx}px Pacifico`;
    ctx.fillStyle = grade.title[0];
    ctx.shadowColor = grade.glow;
    ctx.shadowBlur = titlePx * 0.25;
    ctx.fillText(titleText.charAt(0) + titleText.slice(1).toLowerCase(), cx, titleY);
    ctx.shadowBlur = 0;
  } else if (lettering === 'neon-glow') {
    titlePx = fitFont(ctx, titleText, titleMax, zone.h * 0.30, 'Anton');
    ctx.font = `${titlePx}px Anton`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = grade.glow;
    ctx.shadowBlur = titlePx * 0.45;
    ctx.fillText(titleText, cx, titleY);
    ctx.fillText(titleText, cx, titleY);
    ctx.shadowBlur = 0;
  } else if (lettering === 'outline-pop') {
    titlePx = fitFont(ctx, titleText, titleMax, zone.h * 0.30, 'Anton');
    ctx.font = `${titlePx}px Anton`;
    ctx.lineWidth = Math.max(2, titlePx * 0.06);
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = grade.glow;
    ctx.shadowBlur = titlePx * 0.18;
    ctx.strokeText(titleText, cx, titleY);
    ctx.shadowBlur = 0;
  } else {
    titlePx = fitFont(ctx, titleText, titleMax, zone.h * 0.30, 'Anton');
    ctx.font = `${titlePx}px Anton`;
    const grad = ctx.createLinearGradient(0, titleY - titlePx * 0.55, 0, titleY + titlePx * 0.55);
    grad.addColorStop(0, grade.title[0]);
    grad.addColorStop(1, grade.title[1]);
    ctx.lineWidth = Math.max(2, titlePx * 0.07);
    ctx.strokeStyle = 'rgba(20,6,32,0.9)';
    ctx.lineJoin = 'round';
    ctx.strokeText(titleText, cx, titleY);
    ctx.fillStyle = grad;
    ctx.fillText(titleText, cx, titleY);
  }
  // Subtitle in Pacifico script.
  if (subText) {
    const subPx = fitFont(ctx, subText, titleMax, zone.h * 0.13, 'Pacifico');
    ctx.font = `${subPx}px Pacifico`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = subPx * 0.2;
    ctx.fillText(subText, cx, zone.y + zone.h * 0.74);
    ctx.shadowBlur = 0;
  }
  // Badge pill.
  if (badgeText) {
    const badgePx = Math.max(10, zone.h * 0.085);
    ctx.font = `${badgePx}px Anton`;
    const bw = ctx.measureText(badgeText).width + badgePx * 2.4;
    const bh = badgePx * 2.1;
    const bx = cx - bw / 2;
    const by = zone.y + zone.h * 0.84;
    ctx.fillStyle = grade.badge;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, bh / 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `${badgePx}px Anton`;
    ctx.fillText(badgeText, cx, by + bh / 2 + badgePx * 0.06);
  }
}

// Draws the whole cover for a state onto the canvas at its own pixel size.
// Returns the panel rectangles in canvas pixels (for click / drag hit tests).
export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const grade = gradeById(state.grade);
  const plan = layoutPanels(state.layout, W, H);
  ctx.fillStyle = '#0d0518';
  ctx.fillRect(0, 0, W, H);
  const photos = state.photos || [];
  const fallback = photos.find((p) => p && p.img) || null;
  for (const panel of plan.panels) {
    const rect = {
      x: panel.x + plan.gutter / 2,
      y: panel.y + plan.gutter / 2,
      w: panel.w - plan.gutter,
      h: panel.h - plan.gutter,
    };
    if (panel.art) {
      drawSkylineArt(ctx, rect, grade);
    } else {
      const slot = photos[panel.photo] && photos[panel.photo].img ? photos[panel.photo] : fallback;
      if (slot && slot.img) {
        drawPhotoInto(ctx, slot.img, rect, slot);
        // Grade tint over the photo.
        ctx.fillStyle = grade.tint;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      } else {
        const g2 = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
        g2.addColorStop(0, grade.sky[1]);
        g2.addColorStop(1, grade.sky[2]);
        ctx.fillStyle = g2;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      }
    }
    // White frame line around each panel.
    ctx.strokeStyle = grade.frame;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = Math.max(2, Math.min(W, H) * 0.004);
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.globalAlpha = 1;
    panel.rect = rect;
  }
  // Diagonal layout: slant the hero's right edge.
  if (plan.diagonal) {
    const hero = plan.panels[0];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(hero.rect.x + hero.rect.w, hero.rect.y);
    ctx.lineTo(hero.rect.x + hero.rect.w + W * 0.03, hero.rect.y + hero.rect.h);
    ctx.lineTo(hero.rect.x + hero.rect.w, hero.rect.y + hero.rect.h);
    ctx.closePath();
    ctx.fillStyle = '#0d0518';
    ctx.fill();
    ctx.restore();
  }
  drawTitleBlock(ctx, plan.title, state, grade);
  // Film grain + vignette finish.
  const tile = grainCanvas();
  const pattern = ctx.createPattern(tile, 'repeat');
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const vig = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.45, W / 2, H / 2, Math.max(W, H) * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(8,2,20,0.38)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
  // Outer frame.
  ctx.strokeStyle = grade.frame;
  ctx.lineWidth = Math.max(3, Math.min(W, H) * 0.006);
  ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, W - ctx.lineWidth, H - ctx.lineWidth);
  return plan.panels.map((p) => ({ ...p.rect, photo: p.photo, art: p.art }));
}
