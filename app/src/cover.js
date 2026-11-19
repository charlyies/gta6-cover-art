// Neon Coast cover engine: draws a multi-panel Vice City poster onto a
// canvas from the editor state and the loaded photos. Every drawing here is
// original vector art (sunset sky, striped sun, skyline and palm silhouettes)
// plus the user's own photos — no Rockstar artwork, logo or font anywhere.

/** The six poster layouts: panels as fractions of the cover, plus the title zone. */
export const LAYOUTS = {
  'nine-panel': {
    label: 'Nine-Panel',
    panels: [
      { x: 0.0, y: 0.0, w: 0.333, h: 0.333 }, { x: 0.333, y: 0.0, w: 0.334, h: 0.333 },
      { x: 0.667, y: 0.0, w: 0.333, h: 0.333 }, { x: 0.0, y: 0.333, w: 0.333, h: 0.334 },
      { x: 0.667, y: 0.333, w: 0.333, h: 0.334 }, { x: 0.0, y: 0.667, w: 0.333, h: 0.333 },
      { x: 0.333, y: 0.667, w: 0.334, h: 0.333 }, { x: 0.667, y: 0.667, w: 0.333, h: 0.333 },
    ],
    title: { x: 0.333, y: 0.333, w: 0.334, h: 0.334, align: 'center' },
    titleBlock: true,
  },
  'hero-trio': {
    label: 'Hero + Trio',
    panels: [
      { x: 0.0, y: 0.0, w: 0.62, h: 1.0 },
      { x: 0.62, y: 0.0, w: 0.38, h: 0.333 }, { x: 0.62, y: 0.333, w: 0.38, h: 0.334 },
      { x: 0.62, y: 0.667, w: 0.38, h: 0.333 },
    ],
    title: { x: 0.0, y: 0.72, w: 0.62, h: 0.28, align: 'left' },
    titleBlock: false,
  },
  'sunset-strip': {
    label: 'Sunset Strip',
    panels: [
      { x: 0.0, y: 0.0, w: 1.0, h: 0.58 },
      { x: 0.0, y: 0.58, w: 0.333, h: 0.42 }, { x: 0.333, y: 0.58, w: 0.334, h: 0.42 },
      { x: 0.667, y: 0.58, w: 0.333, h: 0.42 },
    ],
    title: { x: 0.0, y: 0.06, w: 1.0, h: 0.24, align: 'center' },
    titleBlock: false,
  },
  tilted: {
    label: 'Tilted Snapshots',
    panels: [
      { x: 0.06, y: 0.08, w: 0.42, h: 0.52, rot: -4 },
      { x: 0.52, y: 0.06, w: 0.42, h: 0.52, rot: 3 },
      { x: 0.29, y: 0.42, w: 0.42, h: 0.4, rot: -1.5 },
    ],
    title: { x: 0.0, y: 0.82, w: 1.0, h: 0.18, align: 'center' },
    titleBlock: false,
  },
  'full-bleed': {
    label: 'Full Bleed',
    panels: [
      { x: 0.0, y: 0.0, w: 1.0, h: 1.0 },
      { x: 0.05, y: 0.66, w: 0.28, h: 0.26 }, { x: 0.36, y: 0.66, w: 0.28, h: 0.26 },
      { x: 0.67, y: 0.66, w: 0.28, h: 0.26 },
    ],
    title: { x: 0.0, y: 0.05, w: 1.0, h: 0.22, align: 'center' },
    titleBlock: false,
  },
  'duo-split': {
    label: 'Duo Split',
    panels: [
      { x: 0.0, y: 0.0, w: 0.5, h: 0.52 }, { x: 0.5, y: 0.0, w: 0.5, h: 0.52 },
      { x: 0.0, y: 0.52, w: 1.0, h: 0.48 },
    ],
    title: { x: 0.0, y: 0.56, w: 1.0, h: 0.3, align: 'center' },
    titleBlock: false,
  },
};

/** The five colour grades: sky, sun, photo filter, tint and title colours. */
export const GRADES = {
  sunset: {
    label: 'Vice Sunset', sky: ['#2b1055', '#ff5e7a', '#ff9e57', '#ffd166'],
    sun: '#fff3b0', filter: 'saturate(1.35) contrast(1.08) brightness(1.02)',
    tint: 'rgba(255, 94, 122, 0.16)', title: ['#ffffff', '#ffd166'], accent: '#ff5e7a',
  },
  neon: {
    label: 'Neon Night', sky: ['#0b1035', '#7b2ff7', '#f107a3', '#ff5e7a'],
    sun: '#ff9de2', filter: 'saturate(1.5) contrast(1.12) hue-rotate(-12deg)',
    tint: 'rgba(123, 47, 247, 0.20)', title: ['#ffffff', '#ff9de2'], accent: '#00e5ff',
  },
  golden: {
    label: 'Golden Hour', sky: ['#3d1e0a', '#c96f1e', '#f2a541', '#ffe08a'],
    sun: '#fff8d6', filter: 'saturate(1.3) contrast(1.05) sepia(0.18)',
    tint: 'rgba(242, 165, 65, 0.16)', title: ['#ffffff', '#ffe08a'], accent: '#ff7b00',
  },
  palm: {
    label: 'Palm Teal', sky: ['#062a33', '#0f766e', '#2dd4bf', '#fde68a'],
    sun: '#fef3c7', filter: 'saturate(1.4) contrast(1.08) hue-rotate(8deg)',
    tint: 'rgba(45, 212, 191, 0.14)', title: ['#ffffff', '#a7f3d0'], accent: '#2dd4bf',
  },
  noir: {
    label: 'Noir Pink', sky: ['#12041f', '#4c1d95', '#db2777', '#f472b6'],
    sun: '#fbcfe8', filter: 'saturate(1.25) contrast(1.15) brightness(0.96)',
    tint: 'rgba(219, 39, 119, 0.18)', title: ['#ffffff', '#f9a8d4'], accent: '#f472b6',
  },
};

/** The three export sizes, in pixels. */
export const SIZES = {
  square: { label: '1080 × 1080', w: 1080, h: 1080 },
  portrait: { label: '1080 × 1350', w: 1080, h: 1350 },
  wide: { label: '1920 × 1080', w: 1920, h: 1080 },
};

/** A fresh editor state: two sample photos fill the panels by default. */
export function defaultState() {
  return {
    layout: 'nine-panel',
    grade: 'sunset',
    size: 'wide',
    title: 'NEON COAST',
    subtitle: 'one night in vice city',
    badge: 'VICE CITY • 2026',
    titleStyle: 'sunset',
    grain: true,
    vignette: true,
    showSun: true,
    panels: [
      { photo: 0, zoom: 1.15, x: 0, y: 0 }, { photo: 1, zoom: 1.25, x: 0.2, y: 0 },
      { photo: 0, zoom: 1.4, x: 0, y: 0.3 }, { photo: 1, zoom: 1.2, x: -0.2, y: 0 },
      { photo: 0, zoom: 1.3, x: 0, y: -0.2 }, { photo: 1, zoom: 1.5, x: 0, y: 0.2 },
      { photo: 0, zoom: 1.35, x: 0.3, y: 0 }, { photo: 1, zoom: 1.3, x: 0.1, y: 0 },
    ],
  };
}

/** Panels for a layout, padded or trimmed to the state's panel list. */
export function layoutPanels(state) {
  const layout = LAYOUTS[state.layout] ?? LAYOUTS['nine-panel'];
  return layout.panels.map((rect, i) => ({
    rect,
    crop: state.panels[i] ?? { photo: i % 2, zoom: 1.15, x: 0, y: 0 },
    index: i,
  }));
}

/** Deterministic pseudo-random numbers, so grain looks the same every render. */
function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Draws one palm-tree silhouette (trunk + drooping fronds) at (x, y), height h. */
export function drawPalm(ctx, x, y, h, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2, h * 0.045);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + h * 0.06, y - h * 0.55, x + h * 0.14, y - h * 0.92);
  ctx.stroke();
  const topX = x + h * 0.14;
  const topY = y - h * 0.92;
  // Fronds: five arcs fanning out and drooping from the crown.
  const spread = [-0.95, -0.55, -0.15, 0.3, 0.75];
  for (const s of spread) {
    const len = h * 0.45;
    const endX = topX + s * len;
    const endY = topY - h * 0.12 + Math.abs(s) * h * 0.22;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(topX + s * len * 0.7, topY - h * 0.22, endX, endY);
    ctx.stroke();
  }
  ctx.restore();
}

/** Draws a dark skyline silhouette along the bottom of a rectangle. */
export function drawSkyline(ctx, x, y, w, h, color) {
  ctx.save();
  ctx.fillStyle = color;
  const rand = seededRandom(7);
  let cx = x;
  while (cx < x + w) {
    const bw = w * (0.05 + rand() * 0.07);
    const bh = h * (0.35 + rand() * 0.6);
    ctx.fillRect(cx, y + h - bh, bw, bh);
    if (rand() > 0.6) ctx.fillRect(cx + bw * 0.3, y + h - bh - h * 0.18, bw * 0.4, h * 0.18);
    cx += bw + w * 0.012;
  }
  ctx.restore();
}

/** Draws the striped sunset sun: a disc cut by horizontal sky-coloured gaps. */
export function drawSun(ctx, cx, cy, r, color, skyBottom) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = skyBottom;
  let y = cy - r * 0.1;
  let gap = r * 0.045;
  while (y < cy + r) {
    ctx.fillRect(cx - r - 2, y, r * 2 + 4, gap);
    y += gap + r * 0.16;
    gap *= 1.35;
  }
  ctx.restore();
}

/** Draws one photo into a panel rect, cover-fit, with the panel's zoom and pan. */
export function drawPanelPhoto(ctx, photo, rect, crop, grade) {
  if (!photo) return false;
  const px = rect.x;
  const py = rect.y;
  const pw = rect.w;
  const ph = rect.h;
  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();
  const scale = Math.max(pw / photo.naturalWidth, ph / photo.naturalHeight) * (crop.zoom || 1);
  const dw = photo.naturalWidth * scale;
  const dh = photo.naturalHeight * scale;
  const dx = px + (pw - dw) / 2 + (crop.x || 0) * pw * 0.4;
  const dy = py + (ph - dh) / 2 + (crop.y || 0) * ph * 0.4;
  ctx.filter = grade.filter;
  ctx.drawImage(photo, dx, dy, dw, dh);
  ctx.filter = 'none';
  ctx.fillStyle = grade.tint;
  ctx.fillRect(px, py, pw, ph);
  ctx.restore();
  return true;
}

/** Fits a font size so `text` fits `maxWidth`, starting from `startSize`. */
export function fitFont(ctx, text, maxWidth, startSize, weight = 900) {
  let size = startSize;
  ctx.font = `${weight} ${size}px "Arial Black", "Archivo Black", sans-serif`;
  try { ctx.letterSpacing = '2px'; } catch { /* older canvas: no letter-spacing */ }
  while (size > 10 && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = `${weight} ${size}px "Arial Black", "Archivo Black", sans-serif`;
  }
  return size;
}

/** Draws the title, subtitle and badge into the layout's title zone. */
export function drawTitleBlock(ctx, state, grade, zone, w, h) {
  const layout = LAYOUTS[state.layout] ?? LAYOUTS['nine-panel'];
  const zx = zone.x * w;
  const zy = zone.y * h;
  const zw = zone.w * w;
  const zh = zone.h * h;
  if (layout.titleBlock) {
    const g = ctx.createLinearGradient(zx, zy, zx, zy + zh);
    g.addColorStop(0, grade.sky[0]);
    g.addColorStop(1, grade.sky[1]);
    ctx.fillStyle = g;
    ctx.fillRect(zx, zy, zw, zh);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = Math.max(2, w * 0.004);
    ctx.strokeRect(zx + 2, zy + 2, zw - 4, zh - 4);
  }
  const pad = zw * 0.06;
  const title = (state.title || 'NEON COAST').trim().toUpperCase();
  const cx = zone.align === 'left' ? zx + pad : zx + zw / 2;
  const titleSize = fitFont(ctx, title, zw - pad * 2, zh * (layout.titleBlock ? 0.3 : 0.42));
  ctx.textAlign = zone.align === 'left' ? 'left' : 'center';
  ctx.textBaseline = 'middle';
  const ty = zy + zh * (layout.titleBlock ? 0.38 : 0.44);
  let fill;
  if (state.titleStyle === 'white') {
    fill = '#ffffff';
  } else if (state.titleStyle === 'neon') {
    fill = ctx.createLinearGradient(zx, ty - titleSize / 2, zx, ty + titleSize / 2);
    fill.addColorStop(0, '#ffffff');
    fill.addColorStop(0.55, grade.accent);
    fill.addColorStop(1, '#ff2e88');
  } else {
    fill = ctx.createLinearGradient(zx, ty - titleSize / 2, zx, ty + titleSize / 2);
    fill.addColorStop(0, grade.title[0]);
    fill.addColorStop(1, grade.title[1]);
  }
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = titleSize * 0.18;
  ctx.shadowOffsetY = titleSize * 0.05;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(20,5,30,0.9)';
  ctx.lineWidth = Math.max(3, titleSize * 0.09);
  ctx.strokeText(title, cx, ty);
  ctx.fillStyle = fill;
  ctx.fillText(title, cx, ty);
  ctx.restore();
  const sub = (state.subtitle || '').trim();
  if (sub) {
    const subSize = Math.max(12, zh * (layout.titleBlock ? 0.11 : 0.13));
    ctx.font = `italic 700 ${subSize}px Georgia, serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = subSize * 0.3;
    ctx.fillText(sub, cx, ty + titleSize * 0.58 + subSize * 0.5);
    ctx.shadowBlur = 0;
  }
  const badge = (state.badge || '').trim().toUpperCase();
  if (badge) {
    const bSize = Math.max(10, zh * 0.085);
    ctx.font = `800 ${bSize}px "Arial Black", sans-serif`;
    const bw = ctx.measureText(badge).width + bSize * 1.6;
    const bx = zone.align === 'left' ? zx + pad : cx - bw / 2;
    const by = zy + zh - bSize * 2.0;
    ctx.fillStyle = grade.accent;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bSize * 1.7, bSize * 0.85);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(badge, bx + bSize * 0.8, by + bSize * 0.88);
    ctx.textAlign = zone.align === 'left' ? 'left' : 'center';
  }
  // Heat-meter stars sit above the badge in the title block.
  if (layout.titleBlock) {
    ctx.font = `${Math.max(12, zh * 0.08)}px sans-serif`;
    ctx.fillStyle = '#ffd166';
    ctx.textAlign = 'center';
    ctx.fillText('★ ★ ★ ★ ★', zx + zw / 2, zy + zh * 0.68);
  }
}

/** Draws the whole cover onto `canvas` at its own pixel size. */
export function drawCover(canvas, photos, state) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const grade = GRADES[state.grade] ?? GRADES.sunset;
  const layout = LAYOUTS[state.layout] ?? LAYOUTS['nine-panel'];
  const gutter = Math.max(4, w * 0.006);

  // Sunset sky background.
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  grade.sky.forEach((c, i) => sky.addColorStop(i / (grade.sky.length - 1), c));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Striped sun + skyline + palms behind the panels.
  if (state.showSun) {
    const sunR = Math.min(w, h) * 0.22;
    drawSun(ctx, w * 0.5, h * 0.34, sunR, grade.sun, grade.sky[2]);
  }
  ctx.globalAlpha = 0.5;
  drawSkyline(ctx, 0, h * 0.86, w, h * 0.14, 'rgba(15,5,25,0.85)');
  ctx.globalAlpha = 1;
  drawPalm(ctx, w * 0.03, h * 0.99, h * 0.2, 'rgba(12,4,20,0.9)');
  drawPalm(ctx, w * 0.97, h * 0.99, h * 0.17, 'rgba(12,4,20,0.9)');

  // Panels, in layout order, with white gutters between them.
  const panels = layoutPanels(state);
  for (const { rect, crop, index } of panels) {
    const px = rect.x * w + (rect.x > 0 ? gutter / 2 : 0);
    const py = rect.y * h + (rect.y > 0 ? gutter / 2 : 0);
    const pw = rect.w * w - (rect.x > 0 ? gutter / 2 : 0) - (rect.x + rect.w < 1 ? gutter / 2 : 0);
    const ph = rect.h * h - (rect.y > 0 ? gutter / 2 : 0) - (rect.y + rect.h < 1 ? gutter / 2 : 0);
    ctx.save();
    ctx.translate(px, py);
    if (rect.rot) {
      ctx.translate(pw / 2, ph / 2);
      ctx.rotate((rect.rot * Math.PI) / 180);
      ctx.translate(-pw / 2, -ph / 2);
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = w * 0.02;
      ctx.shadowOffsetY = w * 0.008;
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-gutter / 2, -gutter / 2, pw + gutter, ph + gutter);
    const photo = photos[crop.photo] ?? null;
    const drawn = drawPanelPhoto(ctx, photo, { x: 0, y: 0, w: pw, h: ph }, crop, grade);
    if (!drawn) {
      const pg = ctx.createLinearGradient(0, 0, pw, ph);
      pg.addColorStop(0, grade.sky[1]);
      pg.addColorStop(1, grade.sky[2]);
      ctx.fillStyle = pg;
      ctx.fillRect(0, 0, pw, ph);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = `800 ${Math.max(14, pw * 0.06)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`PANEL ${index + 1}`, pw / 2, ph / 2);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = Math.max(2, w * 0.002);
    ctx.strokeRect(0, 0, pw, ph);
    ctx.restore();
  }

  // Title zone on top of everything.
  drawTitleBlock(ctx, state, grade, layout.title, w, h);

  // Grain + vignette finish.
  if (state.grain) {
    const rand = seededRandom(1234);
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = '#ffffff';
    const dots = Math.floor((w * h) / 900);
    for (let i = 0; i < dots; i++) {
      ctx.fillRect(rand() * w, rand() * h, 1.5, 1.5);
    }
    ctx.restore();
  }
  if (state.vignette) {
    const vg = ctx.createRadialGradient(
      w / 2, h / 2, Math.min(w, h) * 0.42, w / 2, h / 2, Math.max(w, h) * 0.75,
    );
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(10,2,18,0.42)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }
  return { panels: panels.map((p) => p.rect), layout: state.layout, grade: state.grade };
}
