// Fixed scenes for screenshots: ?shot=cover shows the exported cover alone,
// ?shot=editor shows the editor with photos loaded, ?shot=portrait and
// ?shot=square show covers in the other two post sizes. Each scene picks its
// own layout, grade, lettering, caption and sample photos, waits for the OFL
// fonts and the photos, paints once, then sets window.__shotReady.

const SCENES = {
  cover: {
    layout: 'hero-top', grade: 'vice-sunset', lettering: 'vice-block',
    title: 'VICE LIGHTS', subtitle: 'one night in vice city', badge: 'VICE CITY • 2026',
    size: '1920x1080', samples: ['boulevard', 'rooftop-man', 'neon-friends', 'skater'],
  },
  editor: {
    layout: 'nine-grid', grade: 'neon-pink', lettering: 'neon-glow',
    title: 'NIGHT SHIFT', subtitle: 'the city never sleeps', badge: 'VICE CITY • 2026',
    size: '1920x1080', samples: ['boulevard', 'rooftop-man', 'neon-friends', 'skater'],
  },
  portrait: {
    layout: 'hero-left', grade: 'golden-hour', lettering: 'vice-block',
    title: 'GOLDEN GETAWAY', subtitle: 'sunset on the boulevard', badge: 'LEONIDA • 2026',
    size: '1080x1350', samples: ['boulevard', 'rooftop-man', 'neon-friends', 'skater'],
  },
  square: {
    layout: 'skyline', grade: 'golden-hour', lettering: 'vice-block',
    title: 'PIER PRESSURE', subtitle: 'golden hour on the boardwalk', badge: 'GOLDEN HOUR',
    size: '1080x1080', samples: ['boulevard', 'rooftop-man', 'neon-friends', 'skater'],
  },
};

export async function runShot(shot, query, state, helpers) {
  const scene = SCENES[shot] || SCENES.cover;
  if (shot !== 'editor') document.body.classList.add('shot-cover');
  state.layout = scene.layout;
  state.grade = scene.grade;
  state.lettering = scene.lettering;
  state.title = scene.title;
  state.subtitle = scene.subtitle;
  state.badge = scene.badge;
  state.size = scene.size;
  state.sampleSet = [...scene.samples];
  await Promise.all(scene.samples.map((id, i) => helpers.loadSample(i, id)));
  helpers.syncInputs();
  // Wait for Anton + Pacifico before painting, so the lettering is real.
  try {
    await Promise.all([
      document.fonts.load('80px Anton'),
      document.fonts.load('40px Pacifico'),
      document.fonts.ready,
    ]);
  } catch (err) {
    // Fonts still fall back to the vendored files on the next paint.
  }
  helpers.redraw();
  helpers.refreshPhotoSlots();
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.__shotReady = true;
}
