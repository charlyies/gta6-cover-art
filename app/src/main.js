// Vice Lights — editor wiring, written fresh for round 2.
// Owns the page state: up to 4 photos, per-panel crop (drag + sliders),
// layout / grade / lettering pickers, undo-redo history, randomise,
// and PNG export in the three post sizes. The preview canvas is the
// cover itself, so what you see is exactly what the PNG will be.

import { drawCover, GRADES, LAYOUTS, LETTERINGS } from './cover.js';
import { runShot } from './shots.js';

export const SAMPLE_PHOTOS = [
  { file: 'samples/boulevard.jpg', label: 'Boulevard' },
  { file: 'samples/pier.jpg', label: 'Pier' },
  { file: 'samples/media-generation-rooftop-man-0-204e0dc3-eba5-423f-b8ca-f844922cd80f.jpg', label: 'Rooftop' },
  { file: 'samples/media-generation-neon-friends-0-fcd26729-9a3b-4da4-a323-bbd8b1113557.jpg', label: 'Neon night' },
  { file: 'samples/media-generation-rooftop-woman-0-1032df4f-9657-42b0-b7d5-324bb31e4781.jpg', label: 'Convertible' },
  { file: 'samples/media-generation-skater-sunset-0-4fca6ec1-f251-498c-a1c2-c2325b8cea49.jpg', label: 'Skater' },
];

export const EXPORT_SIZES = [
  { id: 'square', name: 'Square 1080 x 1080', w: 1080, h: 1080 },
  { id: 'portrait', name: 'Portrait 1080 x 1350', w: 1080, h: 1350 },
  { id: 'wide', name: 'Wide 1920 x 1080', w: 1920, h: 1080 },
];

const $ = (id) => document.getElementById(id);
const canvas = $('preview');
const statusEl = $('status');

export function blankPhoto() {
  return { img: null, name: '', zoom: 1, ox: 0, oy: 0 };
}

export function defaultState() {
  return {
    layout: 'hero-left',
    grade: 'vice-sunset',
    lettering: 'block',
    title: 'VICE LIGHTS',
    subtitle: 'one night in vice city',
    badge: 'VICE CITY • 2026',
    size: 'square',
    photos: [blankPhoto(), blankPhoto(), blankPhoto(), blankPhoto()],
    slots: [0, 1, 2, 3, 0, 1, 2, 3],
    selectedPanel: 0,
    selectedPhoto: 0,
  };
}

let state = defaultState();
let past = [];
let future = [];
let panels = [];
let drag = null;

export function snapshotState() {
  return JSON.stringify({
    layout: state.layout, grade: state.grade, lettering: state.lettering,
    title: state.title, subtitle: state.subtitle, badge: state.badge,
    size: state.size, slots: state.slots,
    photos: state.photos.map((p) => ({ name: p.name, zoom: p.zoom, ox: p.ox, oy: p.oy })),
  });
}

function pushHistory() {
  past.push(snapshotState());
  if (past.length > 60) past.shift();
  future = [];
  refreshHistoryButtons();
}

function restoreSnapshot(json) {
  const s = JSON.parse(json);
  const imgs = state.photos.map((p) => p.img);
  state.layout = s.layout; state.grade = s.grade; state.lettering = s.lettering;
  state.title = s.title; state.subtitle = s.subtitle; state.badge = s.badge;
  state.size = s.size; state.slots = s.slots;
  state.photos = s.photos.map((p, i) => ({ ...p, img: imgs[i] || null }));
  syncInputs();
  redraw();
}

function refreshHistoryButtons() {
  $('undo').disabled = past.length === 0;
  $('redo').disabled = future.length === 0;
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load ' + url));
    img.src = url;
  });
}

async function loadSampleInto(slot, sample) {
  const img = await loadImage(sample.file);
  state.photos[slot] = { img, name: sample.label, zoom: 1, ox: 0, oy: 0 };
}

export async function loadAllSamples() {
  pushHistory();
  // Four different people/scenes, one per slot — no repeated face.
  const picks = [SAMPLE_PHOTOS[0], SAMPLE_PHOTOS[2], SAMPLE_PHOTOS[3], SAMPLE_PHOTOS[5]];
  for (let i = 0; i < 4; i++) await loadSampleInto(i, picks[i]);
  state.slots = [0, 1, 2, 3, 0, 1, 2, 3];
  syncInputs();
  redraw();
  setStatus('Loaded 4 sample photos — four different scenes.');
}

export async function shuffleSamples() {
  pushHistory();
  const order = [...SAMPLE_PHOTOS].sort(() => Math.random() - 0.5).slice(0, 4);
  for (let i = 0; i < 4; i++) await loadSampleInto(i, order[i]);
  syncInputs();
  redraw();
  setStatus('Shuffled in 4 fresh sample photos.');
}

function setStatus(text) {
  statusEl.textContent = text;
}

function sizeFor(stateSize) {
  return EXPORT_SIZES.find((s) => s.id === stateSize) || EXPORT_SIZES[0];
}

export function redraw() {
  const size = sizeFor(state.size);
  if (canvas.width !== size.w || canvas.height !== size.h) {
    canvas.width = size.w;
    canvas.height = size.h;
  }
  panels = drawCover(canvas, state);
  highlightSelectedPanel();
}

function highlightSelectedPanel() {
  // A dashed outline on the selected panel, drawn on the overlay canvas.
  const overlay = $('overlay');
  const octx = overlay.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  overlay.width = rect.width;
  overlay.height = rect.height;
  octx.clearRect(0, 0, overlay.width, overlay.height);
  const panel = panels[state.selectedPanel];
  if (!panel || panel.kind !== 'photo') return;
  const sx = overlay.width / canvas.width;
  const sy = overlay.height / canvas.height;
  octx.save();
  octx.strokeStyle = '#00e5ff';
  octx.lineWidth = 2;
  octx.setLineDash([8, 6]);
  octx.strokeRect(panel.x * sx, panel.y * sy, panel.w * sx, panel.h * sy);
  octx.restore();
}

function syncInputs() {
  $('title').value = state.title;
  $('subtitle').value = state.subtitle;
  $('badge').value = state.badge;
  document.querySelectorAll('#layouts button').forEach((b) => b.classList.toggle('active', b.dataset.layout === state.layout));
  document.querySelectorAll('#grades button').forEach((b) => b.classList.toggle('active', b.dataset.grade === state.grade));
  document.querySelectorAll('#letterings button').forEach((b) => b.classList.toggle('active', b.dataset.lettering === state.lettering));
  document.querySelectorAll('#sizes button').forEach((b) => b.classList.toggle('active', b.dataset.size === state.size));
  const photo = state.photos[state.selectedPhoto];
  $('zoom').value = photo ? photo.zoom : 1;
  $('panx').value = photo ? photo.ox : 0;
  $('pany').value = photo ? photo.oy : 0;
  $('zoomVal').textContent = `${Math.round((photo ? photo.zoom : 1) * 100)}%`;
  document.querySelectorAll('#photoSlots .slot').forEach((el, i) => {
    const p = state.photos[i];
    el.classList.toggle('filled', !!p.img);
    el.classList.toggle('active', i === state.selectedPhoto);
    el.querySelector('.slot-name').textContent = p.img ? `Photo ${i + 1} ✓ ${p.name}` : `Photo ${i + 1} — empty`;
  });
  $('panelLabel').textContent = `Panel ${state.selectedPanel + 1} of ${panels.length} — click the preview to pick a panel`;
}

function buildPickers() {
  const layoutsEl = $('layouts');
  LAYOUTS.forEach((l) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.layout = l.id;
    b.textContent = l.name;
    b.title = l.blurb;
    b.addEventListener('click', () => { pushHistory(); state.layout = l.id; state.selectedPanel = 0; syncInputs(); redraw(); });
    layoutsEl.appendChild(b);
  });
  const gradesEl = $('grades');
  GRADES.forEach((g) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.grade = g.id;
    b.textContent = g.name;
    b.style.background = `linear-gradient(135deg, ${g.sky[1]}, ${g.sky[2]})`;
    b.addEventListener('click', () => { pushHistory(); state.grade = g.id; syncInputs(); redraw(); });
    gradesEl.appendChild(b);
  });
  const letterEl = $('letterings');
  LETTERINGS.forEach((l) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.lettering = l.id;
    b.textContent = l.name;
    b.addEventListener('click', () => { pushHistory(); state.lettering = l.id; syncInputs(); redraw(); });
    letterEl.appendChild(b);
  });
  const sizesEl = $('sizes');
  EXPORT_SIZES.forEach((s) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.size = s.id;
    b.textContent = s.name;
    b.addEventListener('click', () => { pushHistory(); state.size = s.id; syncInputs(); redraw(); });
    sizesEl.appendChild(b);
  });
  const slotsEl = $('photoSlots');
  for (let i = 0; i < 4; i++) {
    const wrap = document.createElement('div');
    wrap.className = 'slot';
    wrap.innerHTML = `<span class="slot-name">Photo ${i + 1} — empty</span>
      <label class="slot-pick">Add photo <input type="file" accept="image/*" data-slot="${i}"></label>`;
    wrap.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') return;
      state.selectedPhoto = i;
      syncInputs();
    });
    slotsEl.appendChild(wrap);
  }
  slotsEl.querySelectorAll('input[type=file]').forEach((input) => {
    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const slot = Number(e.target.dataset.slot);
      pushHistory();
      state.photos[slot] = { img: await loadImage(URL.createObjectURL(file)), name: file.name.slice(0, 18), zoom: 1, ox: 0, oy: 0 };
      state.selectedPhoto = slot;
      syncInputs();
      redraw();
      setStatus(`Photo ${slot + 1} loaded from your machine — never uploaded.`);
    });
  });
}

function bindControls() {
  $('title').addEventListener('input', (e) => { state.title = e.target.value; redraw(); });
  $('subtitle').addEventListener('input', (e) => { state.subtitle = e.target.value; redraw(); });
  $('badge').addEventListener('input', (e) => { state.badge = e.target.value; redraw(); });
  $('title').addEventListener('change', pushHistory);
  $('subtitle').addEventListener('change', pushHistory);
  $('badge').addEventListener('change', pushHistory);
  $('loadSamples').addEventListener('click', loadAllSamples);
  $('shuffleSamples').addEventListener('click', shuffleSamples);
  $('randomise').addEventListener('click', () => {
    pushHistory();
    state.layout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)].id;
    state.grade = GRADES[Math.floor(Math.random() * GRADES.length)].id;
    state.lettering = LETTERINGS[Math.floor(Math.random() * LETTERINGS.length)].id;
    state.slots = panels.map((p, i) => (p.kind === 'photo' ? Math.floor(Math.random() * 4) : p.slot));
    state.selectedPanel = 0;
    syncInputs();
    redraw();
    setStatus('Randomised layout, grade, lettering and panel photos.');
  });
  $('undo').addEventListener('click', () => {
    if (!past.length) return;
    future.push(snapshotState());
    restoreSnapshot(past.pop());
    refreshHistoryButtons();
  });
  $('redo').addEventListener('click', () => {
    if (!future.length) return;
    past.push(snapshotState());
    restoreSnapshot(future.pop());
    refreshHistoryButtons();
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); $('undo').click(); }
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) { e.preventDefault(); $('redo').click(); }
  });
  $('assignPhoto').addEventListener('click', () => {
    pushHistory();
    if (!state.slots) state.slots = [];
    state.slots[state.selectedPanel] = state.selectedPhoto;
    redraw();
    setStatus(`Panel ${state.selectedPanel + 1} now shows Photo ${state.selectedPhoto + 1}.`);
  });
  $('cyclePhoto').addEventListener('click', () => {
    pushHistory();
    const cur = state.slots[state.selectedPanel] ?? 0;
    state.slots[state.selectedPanel] = (cur + 1) % 4;
    redraw();
  });
  const crop = (key) => (e) => {
    const photo = state.photos[state.selectedPhoto];
    if (!photo || !photo.img) return;
    photo[key] = Number(e.target.value);
    if (key === 'zoom') $('zoomVal').textContent = `${Math.round(photo.zoom * 100)}%`;
    redraw();
  };
  $('zoom').addEventListener('input', crop('zoom'));
  $('panx').addEventListener('input', crop('ox'));
  $('pany').addEventListener('input', crop('oy'));
  $('zoom').addEventListener('change', pushHistory);
  $('panx').addEventListener('change', pushHistory);
  $('pany').addEventListener('change', pushHistory);
  $('exportPng').addEventListener('click', () => exportCover(false));
  $('exportAll').addEventListener('click', () => exportCover(true));
  // Drag on the preview: click picks a panel, drag pans its photo.
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    const idx = panels.findIndex((p) => x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h);
    if (idx < 0) return;
    state.selectedPanel = idx;
    const slot = state.slots[idx] ?? panels[idx].slot ?? 0;
    state.selectedPhoto = slot;
    drag = { x: e.clientX, y: e.clientY, ox: state.photos[slot]?.ox || 0, oy: state.photos[slot]?.oy || 0, slot, moved: false };
    canvas.setPointerCapture(e.pointerId);
    syncInputs();
    redraw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const rect = canvas.getBoundingClientRect();
    const photo = state.photos[drag.slot];
    if (!photo || !photo.img) return;
    const dx = (e.clientX - drag.x) / rect.width;
    const dy = (e.clientY - drag.y) / rect.height;
    if (Math.abs(dx) + Math.abs(dy) > 0.005) drag.moved = true;
    photo.ox = Math.max(-0.6, Math.min(0.6, drag.ox + dx));
    photo.oy = Math.max(-0.6, Math.min(0.6, drag.oy + dy));
    $('panx').value = photo.ox;
    $('pany').value = photo.oy;
    redraw();
  });
  canvas.addEventListener('pointerup', () => {
    if (drag && drag.moved) pushHistory();
    drag = null;
  });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const photo = state.photos[state.selectedPhoto];
    if (!photo || !photo.img) return;
    photo.zoom = Math.max(1, Math.min(3, photo.zoom * (e.deltaY < 0 ? 1.08 : 0.93)));
    $('zoom').value = photo.zoom;
    $('zoomVal').textContent = `${Math.round(photo.zoom * 100)}%`;
    redraw();
  }, { passive: false });
  window.addEventListener('resize', highlightSelectedPanel);
}

export function exportCover(allSizes) {
  const list = allSizes ? EXPORT_SIZES : [sizeFor(state.size)];
  list.forEach((size) => {
    const off = document.createElement('canvas');
    off.width = size.w;
    off.height = size.h;
    drawCover(off, state);
    off.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `vice-lights-${size.w}x${size.h}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }, 'image/png');
  });
  setStatus(allSizes ? 'Exported all 3 sizes as PNG.' : `Exported ${sizeFor(state.size).w} x ${sizeFor(state.size).h} PNG.`);
  window.__exported = true;
}

export function applyShotScene(scene) {
  // scene: { layout, grade, lettering, title, subtitle, badge, size,
  //   sampleSlots: [sampleIndex per photo slot] }
  if (scene.layout) state.layout = scene.layout;
  if (scene.grade) state.grade = scene.grade;
  if (scene.lettering) state.lettering = scene.lettering;
  if (scene.title) state.title = scene.title;
  if (scene.subtitle) state.subtitle = scene.subtitle;
  if (scene.badge) state.badge = scene.badge;
  if (scene.size) state.size = scene.size;
  return (scene.sampleSlots || [0, 2, 3, 5]).map((sampleIdx, slot) => loadSampleInto(slot, SAMPLE_PHOTOS[sampleIdx]));
}

buildPickers();
bindControls();
syncInputs();
refreshHistoryButtons();

const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, async (scene) => {
    await Promise.all(applyShotScene(scene));
    state.slots = [0, 1, 2, 3, 0, 1, 2, 3];
    syncInputs();
    redraw();
    if (shot !== 'editor') document.body.classList.add('shot-cover');
  });
} else {
  redraw();
  loadAllSamples();
}
