// Neon Coast editor wiring: photos in, layout + grade + caption, PNG out.
// Photos are read on this machine only (object URLs / local sample files);
// nothing is uploaded anywhere. `?shot=` sets up a fixed scene for a
// screenshot instead (see shots.js).
import { drawCover, defaultState, LAYOUTS, GRADES, SIZES, layoutPanels } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const statusEl = document.getElementById('status');
const panelLabel = document.getElementById('panelLabel');
const state = defaultState();
let photos = [null, null, null];
let selectedPanel = 0;
let history = [];
let future = [];

function snapshot() {
  return JSON.stringify(state);
}
function pushHistory() {
  history.push(snapshot());
  if (history.length > 40) history.shift();
  future = [];
  updateUndoButtons();
}
function restore(json) {
  const parsed = JSON.parse(json);
  Object.keys(state).forEach((k) => delete state[k]);
  Object.assign(state, parsed);
  syncControls();
  redraw();
}
function updateUndoButtons() {
  document.getElementById('undo').disabled = history.length === 0;
  document.getElementById('redo').disabled = future.length === 0;
}

function redraw() {
  const size = SIZES[state.size] ?? SIZES.wide;
  if (canvas.width !== size.w || canvas.height !== size.h) {
    canvas.width = size.w;
    canvas.height = size.h;
  }
  drawCover(canvas, photos, state);
  const panels = layoutPanels(state);
  const crop = state.panels[selectedPanel] ?? state.panels[0];
  panelLabel.textContent = `Panel ${selectedPanel + 1} of ${panels.length} — photo ${crop ? crop.photo + 1 : '—'}`;
  document.getElementById('panelPhoto').value = String(crop ? crop.photo : 0);
  document.getElementById('zoom').value = String(crop ? crop.zoom : 1.15);
  document.getElementById('panX').value = String(crop ? crop.x : 0);
  document.getElementById('panY').value = String(crop ? crop.y : 0);
  document.getElementById('zoomOut').textContent = `${Math.round((crop ? crop.zoom : 1.15) * 100)}%`;
}

function syncControls() {
  document.querySelectorAll('[data-layout]').forEach((b) => b.classList.toggle('active', b.dataset.layout === state.layout));
  document.querySelectorAll('[data-grade]').forEach((b) => b.classList.toggle('active', b.dataset.grade === state.grade));
  document.querySelectorAll('[data-size]').forEach((b) => b.classList.toggle('active', b.dataset.size === state.size));
  document.querySelectorAll('[data-titlestyle]').forEach((b) => b.classList.toggle('active', b.dataset.titlestyle === state.titleStyle));
  document.getElementById('title').value = state.title;
  document.getElementById('subtitle').value = state.subtitle;
  document.getElementById('badge').value = state.badge;
  document.getElementById('grain').checked = state.grain;
  document.getElementById('vignette').checked = state.vignette;
  document.getElementById('showSun').checked = state.showSun;
}

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${url}`));
    img.src = url;
  });
}

function setStatus(text) {
  statusEl.textContent = text;
}

function setPhoto(slot, img) {
  photos[slot] = img;
  document.getElementById(`thumb${slot + 1}`).textContent = img ? `Photo ${slot + 1} ✓` : `Photo ${slot + 1} — empty`;
  document.getElementById(`thumb${slot + 1}`).classList.toggle('loaded', Boolean(img));
  redraw();
}

/** Loads the two built-in sample photos (image-model art, free to use). */
export async function loadSamples() {
  try {
    setPhoto(0, await loadImage('samples/boulevard.jpg'));
    setPhoto(1, await loadImage('samples/pier.jpg'));
    setStatus('Sample photos loaded — replace them with your own any time.');
  } catch (err) {
    setStatus(`Samples did not load: ${err.message}`);
  }
}

function exportPng(sizeKey) {
  const size = SIZES[sizeKey];
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  drawCover(off, photos, { ...state, size: sizeKey });
  off.toBlob((blob) => {
    if (!blob) { setStatus('Export failed — try again.'); return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `neon-coast-${size.w}x${size.h}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    setStatus(`Saved neon-coast-${size.w}x${size.h}.png — share it anywhere.`);
  }, 'image/png');
}

function randomise() {
  pushHistory();
  const layoutKeys = Object.keys(LAYOUTS);
  const gradeKeys = Object.keys(GRADES);
  state.layout = layoutKeys[Math.floor(Math.random() * layoutKeys.length)];
  state.grade = gradeKeys[Math.floor(Math.random() * gradeKeys.length)];
  state.panels.forEach((p) => { p.zoom = 1.1 + Math.random() * 0.5; p.x = (Math.random() - 0.5) * 0.3; p.y = (Math.random() - 0.5) * 0.3; });
  syncControls();
  redraw();
  setStatus('Shuffled layout, grade and crops — export the one you like.');
}

// --- controls ---------------------------------------------------------------
document.querySelectorAll('[data-layout]').forEach((b) => b.addEventListener('click', () => {
  if (state.layout === b.dataset.layout) return;
  pushHistory();
  state.layout = b.dataset.layout;
  selectedPanel = 0;
  syncControls();
  redraw();
}));
document.querySelectorAll('[data-grade]').forEach((b) => b.addEventListener('click', () => {
  if (state.grade === b.dataset.grade) return;
  pushHistory();
  state.grade = b.dataset.grade;
  syncControls();
  redraw();
}));
document.querySelectorAll('[data-size]').forEach((b) => b.addEventListener('click', () => {
  if (state.size === b.dataset.size) return;
  state.size = b.dataset.size;
  syncControls();
  redraw();
  setStatus(`Preview is now ${SIZES[state.size].label} — export matches it exactly.`);
}));
document.querySelectorAll('[data-titlestyle]').forEach((b) => b.addEventListener('click', () => {
  pushHistory();
  state.titleStyle = b.dataset.titlestyle;
  syncControls();
  redraw();
}));

for (const key of ['title', 'subtitle', 'badge']) {
  document.getElementById(key).addEventListener('input', (e) => {
    state[key] = e.target.value;
    redraw();
  });
}
for (const key of ['grain', 'vignette', 'showSun']) {
  document.getElementById(key).addEventListener('change', (e) => {
    pushHistory();
    state[key] = e.target.checked;
    redraw();
  });
}

document.getElementById('panelPhoto').addEventListener('change', (e) => {
  pushHistory();
  const crop = state.panels[selectedPanel];
  if (crop) crop.photo = Number(e.target.value);
  redraw();
});
document.getElementById('zoom').addEventListener('input', (e) => {
  const crop = state.panels[selectedPanel];
  if (crop) crop.zoom = Number(e.target.value);
  redraw();
});
document.getElementById('zoom').addEventListener('change', pushHistory);
document.getElementById('panX').addEventListener('input', (e) => {
  const crop = state.panels[selectedPanel];
  if (crop) crop.x = Number(e.target.value);
  redraw();
});
document.getElementById('panY').addEventListener('input', (e) => {
  const crop = state.panels[selectedPanel];
  if (crop) crop.y = Number(e.target.value);
  redraw();
});
document.getElementById('fillAll').addEventListener('click', () => {
  pushHistory();
  const photo = Number(document.getElementById('panelPhoto').value);
  state.panels.forEach((p) => { p.photo = photo; });
  redraw();
  setStatus(`Every panel now uses photo ${photo + 1}.`);
});
document.getElementById('shuffleCrops').addEventListener('click', () => {
  pushHistory();
  state.panels.forEach((p) => { p.photo = Math.floor(Math.random() * 2); });
  redraw();
});

canvas.addEventListener('click', (e) => {
  const r = canvas.getBoundingClientRect();
  const fx = (e.clientX - r.left) / r.width;
  const fy = (e.clientY - r.top) / r.height;
  const panels = layoutPanels(state);
  const hit = panels.findIndex(({ rect }) => fx >= rect.x && fx <= rect.x + rect.w && fy >= rect.y && fy <= rect.y + rect.h);
  if (hit >= 0) {
    selectedPanel = hit;
    redraw();
    setStatus(`Selected panel ${hit + 1} — zoom, pan or swap its photo below.`);
  }
});

for (let slot = 0; slot < 3; slot++) {
  document.getElementById(`photo${slot + 1}`).addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setPhoto(slot, await loadImage(URL.createObjectURL(file)));
      setStatus(`Photo ${slot + 1} loaded from your machine — never uploaded.`);
    } catch {
      setStatus(`Photo ${slot + 1} could not be read — try a JPG or PNG.`);
    }
  });
}
document.getElementById('loadSamples').addEventListener('click', loadSamples);
document.getElementById('randomise').addEventListener('click', randomise);
document.getElementById('undo').addEventListener('click', () => {
  if (!history.length) return;
  future.push(snapshot());
  restore(history.pop());
  updateUndoButtons();
});
document.getElementById('redo').addEventListener('click', () => {
  if (!future.length) return;
  history.push(snapshot());
  restore(future.pop());
  updateUndoButtons();
});
document.getElementById('export').addEventListener('click', () => exportPng(state.size));
document.getElementById('exportAll').addEventListener('click', () => {
  for (const key of Object.keys(SIZES)) exportPng(key);
  setStatus('Exporting all three sizes — check your downloads.');
});

// --- start ------------------------------------------------------------------
const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), {
    state, photos, setPhoto, loadImage, redraw, syncControls, setStatus,
  });
} else {
  syncControls();
  updateUndoButtons();
  loadSamples().then(() => redraw());
  redraw();
}
