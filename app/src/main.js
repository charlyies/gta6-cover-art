// Vice Lights editor wiring: photo slots, caption fields, layout / grade /
// lettering pickers, drag-to-crop on the preview, undo + redo, randomise,
// sample photos and PNG export in the three post sizes. Shot scenes live in
// ./shots.js; the drawing itself lives in ./cover.js.
import { LAYOUTS, GRADES, LETTERINGS, SAMPLES, SIZES, drawCover } from './cover.js';
import { runShot } from './shots.js';

const $ = (id) => document.getElementById(id);
const canvas = $('cover');
const statusEl = $('status');

const DEFAULT_SAMPLES = ['boulevard', 'rooftop-man', 'neon-friends', 'skater'];

function freshState() {
  return {
    layout: 'nine-grid',
    grade: 'vice-sunset',
    lettering: 'vice-block',
    title: 'VICE LIGHTS',
    subtitle: 'one night in vice city',
    badge: 'VICE CITY • 2026',
    size: '1920x1080',
    photos: [null, null, null, null],
    sampleSet: [...DEFAULT_SAMPLES],
  };
}

let state = freshState();
let history = [];
let future = [];
let selectedPanel = -1;
let lastPanels = [];
let dragging = null;

// Snapshot the undoable part of the state (images stay referenced by slot).
function snapshot() {
  return JSON.stringify({
    layout: state.layout, grade: state.grade, lettering: state.lettering,
    title: state.title, subtitle: state.subtitle, badge: state.badge, size: state.size,
    photos: state.photos.map((p) => (p ? { zoom: p.zoom, ox: p.ox, oy: p.oy, src: p.src } : null)),
    sampleSet: state.sampleSet,
  });
}

function pushHistory() {
  history.push(snapshot());
  if (history.length > 40) history.shift();
  future = [];
  updateUndoButtons();
}

function restore(json) {
  const data = JSON.parse(json);
  const oldPhotos = state.photos;
  state = { ...state, ...data };
  state.photos = data.photos.map((p, i) => {
    if (!p) return null;
    const keep = oldPhotos[i] && oldPhotos[i].src === p.src ? oldPhotos[i] : null;
    return { ...(keep || { img: null, src: p.src }), zoom: p.zoom, ox: p.ox, oy: p.oy, src: p.src };
  });
  syncInputs();
  redraw();
}

function updateUndoButtons() {
  $('undo').disabled = history.length === 0;
  $('redo').disabled = future.length === 0;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function loadSample(slot, sampleId) {
  const sample = SAMPLES.find((s) => s.id === sampleId);
  if (!sample) return;
  const img = await loadImage(sample.file);
  state.photos[slot] = { img, zoom: 1, ox: 0, oy: 0, src: sample.file };
}

async function loadDefaultSamples() {
  await Promise.all(state.sampleSet.map((id, i) => loadSample(i, id)));
  redraw();
  refreshPhotoSlots();
}

function sizeOf() {
  return SIZES.find((s) => s.id === state.size) || SIZES[0];
}

function redraw() {
  const size = sizeOf();
  const scale = Math.min(920 / size.w, 640 / size.h);
  canvas.width = Math.round(size.w * scale);
  canvas.height = Math.round(size.h * scale);
  lastPanels = drawCover(canvas, state);
  drawSelection();
}

function drawSelection() {
  if (selectedPanel < 0 || !lastPanels[selectedPanel]) return;
  const ctx = canvas.getContext('2d');
  const r = lastPanels[selectedPanel];
  ctx.save();
  ctx.setLineDash([10, 6]);
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 3;
  ctx.strokeRect(r.x + 2, r.y + 2, r.w - 4, r.h - 4);
  ctx.restore();
}

// ---- photo slots ---------------------------------------------------------
function refreshPhotoSlots() {
  const wrap = $('photo-slots');
  wrap.innerHTML = '';
  state.photos.forEach((photo, i) => {
    const slot = document.createElement('div');
    slot.className = 'photo-slot' + (photo ? ' loaded' : '');
    const sample = SAMPLES.find((s) => photo && s.file === photo.src);
    slot.innerHTML = `<span class="slot-name">Photo ${i + 1}${sample ? ' ✓ ' + sample.label : photo ? ' ✓ yours' : ''}</span>`;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('aria-label', `Add photo ${i + 1}`);
    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      pushHistory();
      const img = await loadImage(URL.createObjectURL(file));
      state.photos[i] = { img, zoom: 1, ox: 0, oy: 0, src: 'upload:' + file.name };
      refreshPhotoSlots();
      redraw();
      statusEl.textContent = `Photo ${i + 1} loaded — drag it in the preview to crop.`;
    });
    const label = document.createElement('label');
    label.className = 'slot-add';
    label.textContent = photo ? 'Replace photo' : 'Add photo';
    label.appendChild(input);
    slot.appendChild(label);
    wrap.appendChild(slot);
  });
}

function buildPicker(wrapId, items, current, onPick, swatch) {
  const wrap = $(wrapId);
  wrap.innerHTML = '';
  items.forEach((item) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick' + (item.id === current ? ' active' : '');
    b.textContent = item.name;
    if (swatch) b.style.setProperty('--sw', swatch(item));
    b.title = item.blurb || item.name;
    b.addEventListener('click', () => {
      pushHistory();
      onPick(item.id);
      buildPicker(wrapId, items, item.id, onPick, swatch);
      redraw();
    });
    wrap.appendChild(b);
  });
}

function buildPickers() {
  buildPicker('layout-picks', LAYOUTS, state.layout, (id) => { state.layout = id; });
  buildPicker('grade-picks', GRADES, state.grade, (id) => { state.grade = id; }, (g) => `linear-gradient(135deg, ${g.sky[0]}, ${g.sky[1]})`);
  buildPicker('lettering-picks', LETTERINGS, state.lettering, (id) => { state.lettering = id; });
}

function syncInputs() {
  $('title').value = state.title;
  $('subtitle').value = state.subtitle;
  $('badge').value = state.badge;
  $('size').value = state.size;
  buildPickers();
  refreshPhotoSlots();
}

// ---- caption + size inputs ----------------------------------------------
$('title').addEventListener('input', (e) => { state.title = e.target.value; redraw(); });
$('subtitle').addEventListener('input', (e) => { state.subtitle = e.target.value; redraw(); });
$('badge').addEventListener('input', (e) => { state.badge = e.target.value; redraw(); });
$('size').addEventListener('change', (e) => { pushHistory(); state.size = e.target.value; redraw(); });

$('undo').addEventListener('click', () => {
  if (!history.length) return;
  future.push(snapshot());
  restore(history.pop());
  updateUndoButtons();
});
$('redo').addEventListener('click', () => {
  if (!future.length) return;
  history.push(snapshot());
  restore(future.pop());
  updateUndoButtons();
});

$('random').addEventListener('click', () => {
  pushHistory();
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  state.layout = pick(LAYOUTS).id;
  state.grade = pick(GRADES).id;
  state.lettering = pick(LETTERINGS).id;
  shuffleSamples(false);
  syncInputs();
  redraw();
  statusEl.textContent = 'Shuffled — a fresh cover, same photos.';
});

function shuffleSamples(record = true) {
  if (record) pushHistory();
  const pool = [...SAMPLES.map((s) => s.id)];
  const picked = [];
  while (picked.length < 4 && pool.length) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  state.sampleSet = picked;
  loadDefaultSamples();
}

$('try-samples').addEventListener('click', () => { pushHistory(); state.sampleSet = [...DEFAULT_SAMPLES]; loadDefaultSamples(); });
$('shuffle-samples').addEventListener('click', () => shuffleSamples(true));

// ---- drag to crop + wheel to zoom on the preview -------------------------
function panelAt(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  const x = ((clientX - r.left) / r.width) * canvas.width;
  const y = ((clientY - r.top) / r.height) * canvas.height;
  for (let i = 0; i < lastPanels.length; i++) {
    const p = lastPanels[i];
    if (x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) return i;
  }
  return -1;
}

canvas.addEventListener('pointerdown', (e) => {
  const i = panelAt(e.clientX, e.clientY);
  selectedPanel = i;
  if (i >= 0 && !lastPanels[i].art) {
    const slot = state.photos[lastPanels[i].photo] || state.photos.find((p) => p && p.img);
    if (slot) {
      dragging = { slot, startX: e.clientX, startY: e.clientY, ox: slot.ox, oy: slot.oy, moved: false };
      canvas.setPointerCapture(e.pointerId);
    }
  }
  redraw();
});

canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const r = canvas.getBoundingClientRect();
  const dx = (e.clientX - dragging.startX) / r.width;
  const dy = (e.clientY - dragging.startY) / r.height;
  if (Math.abs(dx) + Math.abs(dy) > 0.01) dragging.moved = true;
  dragging.slot.ox = Math.max(-1, Math.min(1, dragging.ox + dx * 2));
  dragging.slot.oy = Math.max(-1, Math.min(1, dragging.oy + dy * 2));
  redraw();
});

canvas.addEventListener('pointerup', () => {
  if (dragging && dragging.moved) pushHistory();
  dragging = null;
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const i = panelAt(e.clientX, e.clientY);
  if (i < 0 || lastPanels[i].art) return;
  const slot = state.photos[lastPanels[i].photo] || state.photos.find((p) => p && p.img);
  if (!slot) return;
  slot.zoom = Math.max(1, Math.min(3, slot.zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
  redraw();
}, { passive: false });

// ---- export ---------------------------------------------------------------
$('export').addEventListener('click', () => {
  const size = sizeOf();
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  drawCover(off, state);
  off.toBlob((blob) => {
    if (!blob) { statusEl.textContent = 'Export failed — try again.'; return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vice-lights-${size.w}x${size.h}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    statusEl.textContent = `Saved vice-lights-${size.w}x${size.h}.png — a real PNG, ${size.w} x ${size.h}.`;
  }, 'image/png');
});

// ---- boot ------------------------------------------------------------------
buildPickers();
syncInputs();
updateUndoButtons();

const query = new URLSearchParams(location.search);
const shot = query.get('shot');
if (shot) {
  runShot(shot, query, state, { loadSample, loadImage, redraw, refreshPhotoSlots, syncInputs });
} else {
  loadDefaultSamples();
}
