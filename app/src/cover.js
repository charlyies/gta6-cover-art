// Vice Lights — cover renderer, written fresh for round 2.
// Draws a multi-panel Vice City style cover on any 2D canvas: a vector
// sunset backdrop (striped sun, skyline, palms), photo panels with a
// colour grade, and a big gradient title block. No network, no assets
// beyond the photos the caller hands in. All art here is drawn in code.

export const GRADES = [
  { id: 'vice-sunset', name: 'Vice Sunset', sky: ['#2b1055', '#ff6a3d', '#ffc46b'], tint: '#ff5e78', tintAlpha: 0.16, title: ['#fff7d6', '#ffb347'], accent: '#ff2e88', glow: '#ff7a18' },
  { id: 'neon-night', name: 'Neon Night', sky: ['#0b0620', '#3b0f6e', '#ff2e88'], tint: '#7b2fff', tintAlpha: 0.20, title: ['#ffffff', '#ff9de2'], accent: '#00e5ff', glow: '#ff2e88' },
  { id: 'golden-hour', name: 'Golden Hour', sky: ['#3d1c02', '#ff8c1a', '#ffe08a'], tint: '#ff9a1f', tintAlpha: 0.14, title: ['#fffbe8', '#ffb347'], accent: '#ff6a00', glow: '#ffd166' },
  { id: 'palm-teal', name: 'Palm Teal', sky: ['#04263b', '#0e7c7b', '#7fe3c0'], tint: '#00b3a6', tintAlpha: 0.16, title: ['#f2fffb', '#8ef5d2'], accent: '#ffb347', glow: '#00e5ff' },
  { id: 'noir-pink', name: 'Noir Pink', sky: ['#160a1e', '#5c1030', '#ff5e8a'], tint: '#ff4d6d', tintAlpha: 0.18, title: ['#ffffff', '#ffc2d4'], accent: '#ff8fa3', glow: '#ff2e88' },
  { id: 'miami-vice', name: 'Miami Vice', sky: ['#02131f', '#0aa6a6', '#ff4fd8'], tint: '#00d5ff', tintAlpha: 0.15, title: ['#eaffff', '#ff8ae2'], accent: '#ff4fd8', glow: '#00e5ff' },
  { id: 'heat-haze', name: 'Heat Haze', sky: ['#2a0505', '#c81d25', '#ff9e57'], tint: '#ff3b1f', tintAlpha: 0.17, title: ['#fff3d6', '#ff7a45'], accent: '#ffd166', glow: '#ff3b1f' },
];

export const LAYOUTS = [
  { id: 'nine-grid', name: 'Nine Grid', blurb: '3 x 3 grid, title in the middle' },
  { id: 'hero-left', name: 'Hero Left', blurb: 'Tall hero photo, three stacked' },
  { id: 'hero-top', name: 'Hero Top', blurb: 'Wide hero photo, three below' },
  { id: 'sunset-strip', name: 'Sunset Strip', blurb: 'Wide sunset band, trio below' },
  { id: 'tilted', name: 'Tilted Polaroids', blurb: 'Rotated snapshots on a sunset' },
  { id: 'full-bleed', name: 'Full Bleed', blurb: 'One photo, title band' },
  { id: 'duo-split', name: 'Duo Split', blurb: 'Two tall halves, title bar' },
  { id: 'comic-strip', name: 'Comic Strip', blurb: 'Four vertical strips' },
];

export const LETTERINGS = [
  { id: 'block', name: 'Block' },
  { id: 'outline', name: 'Outline' },
  { id: 'neon', name: 'Neon Glow' },
  { id: 'retro', name: 'Retro Stack' },
];

// Panel rectangles for a layout, in fractions of the canvas. Each panel
// names a photo slot (0..3); 'title' panels are painted as title blocks.
export function layoutPanels(layoutId, w, h) {
  const g = 0.012; // gutter, as a fraction of the short side
  const pad = Math.min(w, h) * g;
  const full = { x: 0, y: 0, w, h };
  const third = (w - pad * 4) / 3;
  const thirdH = (h - pad * 4) / 3;
  switch (layoutId) {
    case 'nine-grid': {
      const cells = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const x = pad + c * (third + pad);
          const y = pad + r * (thirdH + pad);
          if (r === 1 && c === 1) cells.push({ x, y, w: third, h: thirdH, kind: 'title' });
          else cells.push({ x, y, w: third, h: thirdH, kind: 'photo', slot: (r * 3 + c) % 4 });
        }
      }
      return cells;
    }
    case 'hero-left': {
      const heroW = w * 0.58 - pad * 1.5;
      const sideW = w - heroW - pad * 3;
      const sideH = (h - pad * 4) / 3;
      return [
        { x: pad, y: pad, w: heroW, h: h - pad * 2, kind: 'photo', slot: 0 },
        { x: heroW + pad * 2, y: pad, w: sideW, h: sideH, kind: 'photo', slot: 1 },
        { x: heroW + pad * 2, y: pad * 2 + sideH, w: sideW, h: sideH, kind: 'photo', slot: 2 },
        { x: heroW + pad * 2, y: pad * 3 + sideH * 2, w: sideW, h: sideH, kind: 'photo', slot: 3 },
      ];
    }
    case 'hero-top': {
      const heroH = h * 0.58 - pad * 1.5;
      const botH = h - heroH - pad * 3;
      const botW = (w - pad * 4) / 3;
      return [
        { x: pad, y: pad, w: w - pad * 2, h: heroH, kind: 'photo', slot: 0 },
        { x: pad, y: heroH + pad * 2, w: botW, h: botH, kind: 'photo', slot: 1 },
        { x: pad * 2 + botW, y: heroH + pad * 2, w: botW, h: botH, kind: 'photo', slot: 2 },
        { x: pad * 3 + botW * 2, y: heroH + pad * 2, w: botW, h: botH, kind: 'photo', slot: 3 },
      ];
    }
    case 'sunset-strip': {
      const bandH = h * 0.46;
      const botH = h - bandH - pad * 3;
      const botW = (w - pad * 4) / 3;
      return [
        { x: pad, y: pad, w: w - pad * 2, h: bandH, kind: 'art' },
        { x: pad, y: bandH + pad * 2, w: botW, h: botH, kind: 'photo', slot: 0 },
        { x: pad * 2 + botW, y: bandH + pad * 2, w: botW, h: botH, kind: 'photo', slot: 1 },
        { x: pad * 3 + botW * 2, y: bandH + pad * 2, w: botW, h: botH, kind: 'photo', slot: 2 },
      ];
    }
    case 'tilted': {
      const cw = w * 0.42;
      const ch = h * 0.42;
      return [
        { x: w * 0.06, y: h * 0.05, w: cw, h: ch, kind: 'photo', slot: 0, tilt: -0.07 },
        { x: w * 0.52, y: h * 0.08, w: cw, h: ch, kind: 'photo', slot: 1, tilt: 0.06 },
        { x: w * 0.09, y: h * 0.52, w: cw, h: ch, kind: 'photo', slot: 2, tilt: 0.05 },
        { x: w * 0.50, y: h * 0.50, w: cw, h: ch, kind: 'photo', slot: 3, tilt: -0.05 },
      ];
    }
    case 'full-bleed':
      return [{ ...full, kind: 'photo', slot: 0 }];
    case 'duo-split': {
      const halfW = (w - pad * 3) / 2;
      return [
        { x: pad, y: pad, w: halfW, h: h - pad * 2, kind: 'photo', slot: 0 },
        { x: pad * 2 + halfW, y: pad, w: halfW, h: h - pad * 2, kind: 'photo', slot: 1 },
      ];
    }
    case 'comic-strip': {
      const stripW = (w - pad * 5) / 4;
      return [0, 1, 2, 3].map((i) => ({
        x: pad + i * (stripW + pad), y: pad, w: stripW, h: h - pad * 2, kind: 'photo', slot: i,
      }));
    }
    default:
      return [{ ...full, kind: 'photo', slot: 0 }];
  }
}

function hashSeed(text) {
  let s = 2166136261;
  for (let i = 0; i < text.length; i++) { s ^= text.charCodeAt(i); s = Math.imul(s, 16777619); }
  return s >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gradeById(id) {
  return GRADES.find((g) => g.id === id) || GRADES[0];
}

// A palm silhouette, drawn in code: curved trunk + drooping fronds.
function drawPalm(ctx, x, y, size, colour) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.strokeStyle = colour;
  ctx.fillStyle = colour;
  ctx.lineWidth = 0.06;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(0.12, -0.55, 0.05, -1);
  ctx.stroke();
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI * (0.08 + i * 0.13);
    const len = 0.85 - Math.abs(i - 3) * 0.07;
    const tx = Math.cos(a) * len;
    const ty = Math.sin(a) * len * 0.55 - 1;
    ctx.beginPath();
    ctx.moveTo(0.05, -1);
    ctx.quadraticCurveTo(tx * 0.6, -1 + ty * 0.4, tx, ty);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSkyline(ctx, w, h, grade, rnd) {
  const base = h * 0.78;
  ctx.fillStyle = 'rgba(20, 6, 40, 0.85)';
  let x = 0;
  while (x < w) {
    const bw = w * (0.05 + rnd() * 0.09);
    const bh = h * (0.10 + rnd() * 0.22);
    ctx.fillRect(x, base - bh, bw, bh + h);
    if (rnd() > 0.5) {
      ctx.fillStyle = grade.accent;
      for (let wy = base - bh + 6; wy < base - 6; wy += 14) {
        if (rnd() > 0.6) ctx.fillRect(x + 4, wy, 5, 7);
      }
      ctx.fillStyle = 'rgba(20, 6, 40, 0.85)';
    }
    x += bw + w * 0.012;
  }
  ctx.fillStyle = 'rgba(20, 6, 40, 0.9)';
  ctx.fillRect(0, base, w, h - base);
}

// The vector sunset backdrop: gradient sky, striped sun, skyline, palms.
export function drawSunsetBackdrop(ctx, w, h, grade, seedText) {
  const rnd = mulberry32(hashSeed(seedText || 'vice'));
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, grade.sky[0]);
  sky.addColorStop(0.55, grade.sky[1]);
  sky.addColorStop(1, grade.sky[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  // Striped sun.
  const cx = w * 0.5;
  const cy = h * 0.42;
  const r = Math.min(w, h) * 0.26;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const sun = ctx.createLinearGradient(0, cy - r, 0, cy + r);
  sun.addColorStop(0, '#fff3b0');
  sun.addColorStop(0.5, grade.glow);
  sun.addColorStop(1, grade.accent);
  ctx.fillStyle = sun;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.fillStyle = grade.sky[0];
  for (let i = 0; i < 5; i++) {
    const y = cy + r * (0.05 + i * 0.16);
    ctx.fillRect(cx - r, y, r * 2, r * (0.03 + i * 0.02));
  }
  ctx.restore();
  drawSkyline(ctx, w, h, grade, rnd);
  drawPalm(ctx, w * 0.06, h * 0.82, Math.min(w, h) * 0.22, 'rgba(12, 4, 26, 0.95)');
  drawPalm(ctx, w * 0.94, h * 0.80, Math.min(w, h) * 0.18, 'rgba(12, 4, 26, 0.95)');
}

// Cover-fit draw of one photo into a rect, with zoom and pan offsets.
function drawPhotoInto(ctx, img, rect, zoom, ox, oy) {
  if (!img || !img.naturalWidth) return false;
  const scale = Math.max(rect.w / img.naturalWidth, rect.h / img.naturalHeight) * (zoom || 1);
  const pw = img.naturalWidth * scale;
  const ph = img.naturalHeight * scale;
  const dx = rect.x + (rect.w - pw) / 2 + (ox || 0) * rect.w;
  const dy = rect.y + (rect.h - ph) / 2 + (oy || 0) * rect.h;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, pw, ph);
  ctx.restore();
  return true;
}

function gradeWash(ctx, rect, grade) {
  ctx.save();
  ctx.globalAlpha = grade.tintAlpha;
  ctx.fillStyle = grade.tint;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
  const shade = ctx.createLinearGradient(0, rect.y, 0, rect.y + rect.h);
  shade.addColorStop(0, 'rgba(0,0,0,0)');
  shade.addColorStop(1, 'rgba(10,0,30,0.28)');
  ctx.fillStyle = shade;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
}

function framePanel(ctx, rect, w) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.lineWidth = Math.max(2, w * 0.004);
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

// Big title lettering. 'Anton' is the display stack, bundled as an SIL OFL
// font file in app/fonts/ and wired up by the @font-face rule in style.css.
function drawTitleBlock(ctx, w, h, state, grade, zone) {
  const { x, y, w: zw, h: zh } = zone;
  const title = (state.title || '').trim().toUpperCase() || 'VICE LIGHTS';
  const sub = (state.subtitle || '').trim();
  const badge = (state.badge || '').trim();
  const fontStack = `'Anton','Archivo Black','Arial Black',sans-serif`;
  const scriptStack = `'Pacifico','Segoe Script',cursive`;
  let size = zh * 0.42;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const measure = (s) => { ctx.font = `900 ${s}px ${fontStack}`; return ctx.measureText(title).width; };
  while (measure(size) > zw * 0.94 && size > 10) size -= 2;
  // Title / subtitle / badge are stacked with real gaps: subtitle and badge
  // are each shrunk to fit the zone, so a narrow zone (e.g. the nine-grid
  // title cell) can never spill text across neighbouring panels, and the
  // badge pill can never sit on top of the subtitle's descenders.
  const ty = y + zh * (sub || badge ? 0.34 : 0.5);
  const grad = ctx.createLinearGradient(0, ty - size * 0.6, 0, ty + size * 0.6);
  grad.addColorStop(0, grade.title[0]);
  grad.addColorStop(1, grade.title[1]);
  if (state.lettering === 'outline') {
    ctx.font = `900 ${size}px ${fontStack}`;
    ctx.lineWidth = Math.max(2, size * 0.06);
    ctx.strokeStyle = grade.title[0];
    ctx.strokeText(title, x + zw / 2, ty);
    ctx.lineWidth = Math.max(1, size * 0.02);
    ctx.strokeStyle = grade.accent;
    ctx.strokeText(title, x + zw / 2, ty);
  } else if (state.lettering === 'neon') {
    ctx.font = `900 ${size}px ${fontStack}`;
    ctx.shadowColor = grade.glow;
    ctx.shadowBlur = size * 0.35;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(title, x + zw / 2, ty);
    ctx.shadowBlur = size * 0.12;
    ctx.fillStyle = grad;
    ctx.fillText(title, x + zw / 2, ty);
    ctx.shadowBlur = 0;
  } else if (state.lettering === 'retro') {
    ctx.font = `900 ${size}px ${fontStack}`;
    ctx.fillStyle = grade.accent;
    ctx.fillText(title, x + zw / 2 + size * 0.06, ty + size * 0.07);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillText(title, x + zw / 2 + size * 0.03, ty + size * 0.035);
    ctx.fillStyle = grad;
    ctx.fillText(title, x + zw / 2, ty);
  } else {
    ctx.font = `900 ${size}px ${fontStack}`;
    ctx.lineWidth = Math.max(2, size * 0.09);
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(10,0,25,0.9)';
    ctx.strokeText(title, x + zw / 2, ty);
    ctx.fillStyle = grad;
    ctx.fillText(title, x + zw / 2, ty);
  }
  if (sub) {
    let ss = Math.max(11, zh * 0.15);
    const subWidth = (s) => { ctx.font = `italic 700 ${s}px ${scriptStack}`; return ctx.measureText(sub).width; };
    while (subWidth(ss) > zw * 0.94 && ss > 10) ss -= 1;
    ctx.font = `italic 700 ${ss}px ${scriptStack}`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = ss * 0.3;
    ctx.fillText(sub, x + zw / 2, y + zh * 0.66);
    ctx.shadowBlur = 0;
  }
  if (badge) {
    let bs = Math.max(10, zh * 0.11);
    const badgeWidth = (s) => { ctx.font = `800 ${s}px ${fontStack}`; return ctx.measureText(badge).width + s * 2.2; };
    while (badgeWidth(bs) > zw * 0.94 && bs > 9) bs -= 1;
    ctx.font = `800 ${bs}px ${fontStack}`;
    const bw = ctx.measureText(badge).width + bs * 2.2;
    const bx = x + zw / 2 - bw / 2;
    const by = y + zh * 0.88 - bs;
    ctx.fillStyle = grade.accent;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bs * 2, bs);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(badge, x + zw / 2, by + bs);
  }
  ctx.restore();
}

function drawGrain(ctx, w, h, seedText) {
  const rnd = mulberry32(hashSeed(seedText + ':grain'));
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = '#ffffff';
  const n = Math.floor((w * h) / 9000);
  for (let i = 0; i < n; i++) ctx.fillRect(rnd() * w, rnd() * h, 1.6, 1.6);
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#000000';
  for (let i = 0; i < n; i++) ctx.fillRect(rnd() * w, rnd() * h, 1.6, 1.6);
  ctx.restore();
  const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.75);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.32)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

function drawStars(ctx, x, y, size, grade) {
  ctx.save();
  ctx.fillStyle = grade.accent;
  ctx.font = `${size}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('★★★★★', x, y);
  ctx.restore();
}

// Main entry: paint the whole cover for `state` onto `canvas`.
// state: { layout, grade, title, subtitle, badge, lettering, photos,
//   slots } — photos are [{img, zoom, ox, oy}], slots maps panel index
// to a photo index (defaults to the panel's own slot).
export function drawCover(canvas, state) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const grade = gradeById(state.grade);
  const panels = layoutPanels(state.layout, w, h);
  const isTilted = state.layout === 'tilted';
  // Backdrop first: it shows through the gutters and behind tilted shots.
  drawSunsetBackdrop(ctx, w, h, grade, state.title || 'vice');
  const titlePanel = panels.find((p) => p.kind === 'title');
  panels.forEach((panel, i) => {
    const slot = state.slots && state.slots[i] != null ? state.slots[i] : panel.slot;
    if (panel.kind === 'title') {
      ctx.save();
      ctx.fillStyle = 'rgba(16,4,38,0.88)';
      ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
      framePanel(ctx, panel, w);
      drawTitleBlock(ctx, w, h, state, grade, panel);
      ctx.restore();
      return;
    }
    if (panel.kind === 'art') {
      ctx.save();
      ctx.beginPath();
      ctx.rect(panel.x, panel.y, panel.w, panel.h);
      ctx.clip();
      ctx.translate(panel.x, panel.y);
      drawSunsetBackdrop(ctx, panel.w, panel.h, grade, (state.title || 'vice') + ':band');
      ctx.restore();
      framePanel(ctx, panel, w);
      return;
    }
    const photo = (state.photos || [])[slot];
    ctx.save();
    if (panel.tilt) {
      ctx.translate(panel.x + panel.w / 2, panel.y + panel.h / 2);
      ctx.rotate(panel.tilt);
      ctx.translate(-panel.w / 2, -panel.h / 2);
    }
    const rect = panel.tilt ? { x: 0, y: 0, w: panel.w, h: panel.h } : panel;
    const drew = photo ? drawPhotoInto(ctx, photo.img, rect, photo.zoom, photo.ox, photo.oy) : false;
    if (!drew) {
      ctx.fillStyle = 'rgba(30,8,52,0.75)';
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = `700 ${Math.max(12, rect.h * 0.09)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ADD A PHOTO', rect.x + rect.w / 2, rect.y + rect.h / 2);
    } else {
      gradeWash(ctx, rect, grade);
    }
    // White polaroid frame for tilted shots, thin frame otherwise.
    ctx.fillStyle = '#ffffff';
    if (panel.tilt) {
      const f = Math.max(6, w * 0.008);
      ctx.fillRect(rect.x - f, rect.y - f, rect.w + f * 2, f);
      ctx.fillRect(rect.x - f, rect.y + rect.h, rect.w + f * 2, f);
      ctx.fillRect(rect.x - f, rect.y - f, f, rect.h + f * 2);
      ctx.fillRect(rect.x + rect.w, rect.y - f, f, rect.h + f * 2);
    } else {
      framePanel(ctx, rect, w);
    }
    ctx.restore();
  });
  // Title band for every layout except the nine-grid (it has a title cell).
  if (!titlePanel) {
    const bandH = h * (isTilted ? 0.2 : 0.24);
    const bandY = h - bandH;
    const band = ctx.createLinearGradient(0, bandY, 0, h);
    band.addColorStop(0, 'rgba(12,2,32,0)');
    band.addColorStop(0.35, 'rgba(12,2,32,0.82)');
    band.addColorStop(1, 'rgba(12,2,32,0.94)');
    ctx.fillStyle = band;
    ctx.fillRect(0, bandY, w, bandH);
    drawTitleBlock(ctx, w, h, state, grade, { x: w * 0.04, y: bandY + bandH * 0.06, w: w * 0.92, h: bandH * 0.88 });
    drawStars(ctx, w * 0.045, bandY + bandH * 0.14, Math.max(12, h * 0.022), grade);
  }
  drawGrain(ctx, w, h, state.title || 'vice');
  return panels;
}
