// Fixed scenes for screenshots: ?shot=cover shows the cover alone,
// ?shot=editor shows the editor with photos loaded. Each scene names a
// layout, grade, lettering and caption, plus which sample goes in each
// of the four photo slots. window.__shotReady is set once painted.
export const SHOT_SCENES = {
  cover: {
    layout: 'hero-top', grade: 'vice-sunset', lettering: 'block',
    title: 'VICE LIGHTS', subtitle: 'one night in vice city', badge: 'VICE CITY • 2026',
    size: 'wide', sampleSlots: [5, 0, 2, 3],
  },
  editor: {
    layout: 'nine-grid', grade: 'neon-night', lettering: 'neon',
    title: 'NIGHT SHIFT', subtitle: 'the city never sleeps', badge: 'VICE CITY • 2026',
    size: 'square', sampleSlots: [0, 2, 3, 5],
  },
  portrait: {
    layout: 'hero-left', grade: 'heat-haze', lettering: 'retro',
    title: 'GOLDEN GETAWAY', subtitle: 'sunset on the boulevard', badge: 'LEONIDA • 2026',
    size: 'portrait', sampleSlots: [2, 3, 5, 0],
  },
  square: {
    layout: 'sunset-strip', grade: 'golden-hour', lettering: 'block',
    title: 'PIER PRESSURE', subtitle: 'golden hour on the boardwalk', badge: 'GOLDEN HOUR',
    size: 'square', sampleSlots: [1, 5, 3, 0],
  },
};

export async function runShot(shot, apply) {
  const scene = SHOT_SCENES[shot] || SHOT_SCENES.cover;
  await apply(scene);
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
