// Fixed scenes for screenshots: ?shot=cover shows the cover alone at the
// export size; ?shot=editor shows the editor with a sample photo loaded.
// Query params: layout, grade, size, title, subtitle, badge, titlestyle.
// window.__shotReady is set once the scene has painted.
import { SIZES } from './cover.js';

export async function runShot(shot, query, api) {
  const { state, setPhoto, loadImage, redraw, syncControls } = api;
  state.layout = query.get('layout') ?? 'nine-panel';
  state.grade = query.get('grade') ?? 'sunset';
  state.size = query.get('size') ?? 'wide';
  state.title = query.get('title') ?? 'NEON COAST';
  state.subtitle = query.get('subtitle') ?? 'one night in vice city';
  state.badge = query.get('badge') ?? 'VICE CITY • 2026';
  state.titleStyle = query.get('titlestyle') ?? 'sunset';
  if (query.get('panels')) {
    const photos = query.get('panels').split('').map((c) => Number(c));
    state.panels.forEach((p, i) => { if (photos[i] !== undefined) p.photo = photos[i]; });
  }
  await setPhoto(0, await loadImage('samples/boulevard.jpg'));
  await setPhoto(1, await loadImage('samples/pier.jpg'));
  syncControls();
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    const size = SIZES[state.size] ?? SIZES.wide;
    const canvas = document.getElementById('cover');
    canvas.width = size.w;
    canvas.height = size.h;
  }
  redraw();
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
