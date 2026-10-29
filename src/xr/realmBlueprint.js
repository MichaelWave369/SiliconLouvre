/**
 * Curator-reviewed visual interpretations of the four approved Domistika
 * Dialogues paintings. Deterministic descriptions: not pixel-to-mesh conversion.
 *
 * Each batch is a GPU-instanced motif. Geometry is bounded for standalone XR.
 * No randomness, remote assets, executable manifest content, or user uploads.
 */
const DESIGNS = Object.freeze({
  'chromatic-gear-cathedral': Object.freeze({
    name: 'The Gear Cathedral',
    motif: 'cathedral',
    accent: '#eac586',
    background: '#080d1a',
    palette: Object.freeze(['#eac586', '#66c8db', '#af94ef']),
    description: 'Clockwork chapels, jewel towers and alternating 24 / 48-fold radial gearwork.',
  }),
  'the-ninefold-trickster': Object.freeze({
    name: 'The Trickster Chorus',
    motif: 'trickster',
    accent: '#ef86bf',
    background: '#1b0d24',
    palette: Object.freeze(['#ef86bf', '#7cded5', '#f5c36d']),
    description: 'Nine theatrical geometric masks repeated inside an angular chorus.',
  }),
  'orbit-of-a-thousand-hinges': Object.freeze({
    name: 'The Hinge Observatory',
    motif: 'orbit',
    accent: '#7adfe4',
    background: '#0a1826',
    palette: Object.freeze(['#7adfe4', '#e6b987', '#a7a0f5']),
    description: 'Suspended orbital paths, bars, joint spheres and nested mechanical intervals.',
  }),
  'the-eye-that-blooms': Object.freeze({
    name: 'The Blooming Iris',
    motif: 'bloom',
    accent: '#f18b9c',
    background: '#1c0c1c',
    palette: Object.freeze(['#f18b9c', '#efc76c', '#9dbee9']),
    description: 'Concentric petal mandalas framing an impossible floating iris.',
  }),
});

const p = (x, y, z, rotation = 0, scale = [1, 1, 1]) => ({
  position: [x, y, z],
  rotation: [0, 0, rotation],
  scale,
});
function radial(count, radius, z, mapper) {
  return Array.from({ length: count }, (_, index) => {
    const angle = index * Math.PI * 2 / count;
    return mapper({ index, angle, x: Math.cos(angle) * radius, y: 2.7 + Math.sin(angle) * radius, z });
  });
}
function batch(shape, color, instances) {
  return { shape, color, instances };
}
function hoop(radius, z, color, speed = 0, y = 2.7) {
  return { radius, position: [0, y, z], color, speed };
}
function cathedral(colors) {
  const batches = [
    batch('octahedron', colors[0], [
      ...radial(48, 3.2, -13, ({ x, y, z, angle }) => p(x, y, z, angle, [.17, .75, .22])),
      ...radial(48, 2.5, -23, ({ x, y, z, angle }) => p(x, y, z, angle, [.12, .6, .2])),
    ]),
    batch('box', colors[1], [
      ...radial(24, 3.75, -17, ({ x, y, z, angle }) => p(x, y, z, angle, [.12, .9, .2])),
      ...radial(24, 3.75, -27, ({ x, y, z, angle }) => p(x, y, z, angle, [.12, .9, .2])),
    ]),
    batch('cone', colors[2],
      Array.from({ length: 12 }, (_, i) => p((i % 6 - 2.5) * 2, 1.9 + (i % 2) * 1.05, -12 - Math.floor(i / 6) * 16,
        0, [.7, 2 + (i % 2), .7]))),
  ];
  return {
    batches, hoops: [hoop(4.25, -13, colors[0], .008), hoop(2.75, -23, colors[1], -.006), hoop(4.3, -27, colors[2], .007)],
    landmark: 'CLOCKWORK CHAPEL',
  };
}
function trickster(colors) {
  const sites = radial(9, 4.0, -17, ({ x, y, z, angle }) => ({ x, y, z, angle }));
  const distant = radial(24, 3.1, -28, ({ x, y, z, angle }) => ({ x, y, z, angle }));
  const all = [...sites, ...distant];
  return {
    batches: [
      batch('octahedron', colors[0], all.map(({ x, y, z, angle }) => p(x, y, z, angle, [.65, .85, .3]))),
      batch('tetrahedron', colors[2], all.flatMap(({ x, y, z, angle }) =>
        [p(x - .32, y + .56, z + .06, angle, [.26, .4, .25]), p(x + .32, y + .56, z + .06, angle, [.26, .4, .25])])),
      batch('sphere', colors[1], all.flatMap(({ x, y, z }) =>
        [p(x - .22, y + .1, z + .31, 0, [.09, .12, .08]), p(x + .22, y + .1, z + .31, 0, [.09, .12, .08])])),
      batch('box', '#1d162c', all.map(({ x, y, z }) => p(x, y - .33, z + .35, 0, [.37, .06, .09]))),
    ],
    hoops: [hoop(4.5, -17, colors[1], .004), hoop(3.45, -28, colors[0], -.004)],
    landmark: 'THE NINEFOLD CHORUS',
  };
}
function orbit(colors) {
  return {
    batches: [
      batch('box', colors[0], [
        ...radial(48, 4.1, -16, ({ x, y, z, angle }) => p(x, y, z, angle + .5, [.14, .77, .14])),
        ...radial(48, 2.75, -25, ({ x, y, z, angle }) => p(x, y, z, angle + .7, [.12, .58, .12])),
      ]),
      batch('sphere', colors[1], [
        ...radial(48, 4.1, -16, ({ x, y, z }) => p(x, y, z, 0, [.23, .23, .23])),
        ...radial(48, 2.75, -25, ({ x, y, z }) => p(x, y, z, 0, [.17, .17, .17])),
      ]),
      batch('octahedron', colors[2], radial(24, 3.6, -33, ({ x, y, z, angle }) => p(x, y, z, angle, [.25, .5, .25]))),
    ],
    hoops: [
      hoop(4.1, -16, colors[0], .012),
      hoop(2.75, -25, colors[1], -.014),
      hoop(3.6, -33, colors[2], .009),
    ],
    landmark: 'THE HINGE OBSERVATORY',
  };
}
function bloom(colors) {
  return {
    batches: [
      batch('cone', colors[0], [
        ...radial(48, 4.1, -16, ({ x, y, z, angle }) => p(x, y, z, angle - Math.PI / 2, [.48, 1.05, .3])),
        ...radial(24, 2.6, -24, ({ x, y, z, angle }) => p(x, y, z, angle - Math.PI / 2, [.35, .8, .24])),
      ]),
      batch('octahedron', colors[1], radial(48, 3.25, -25, ({ x, y, z, angle }) => p(x, y, z, angle, [.2, .42, .24]))),
      batch('sphere', colors[2], [p(0, 2.7, -16, 0, [1.3, 1.3, .55]), p(0, 2.7, -25, 0, [.95, .95, .48])]),
      batch('sphere', '#111126', [p(0, 2.7, -15.6, 0, [.62, .62, .22]), p(0, 2.7, -24.6, 0, [.46, .46, .22])]),
    ],
    hoops: [hoop(4.5, -16, colors[1], .004), hoop(3.0, -24.9, colors[0], -.005), hoop(1.6, -16.2, colors[2], 0)],
    landmark: 'THE BLOOMING IRIS',
  };
}
const FACTORIES = { cathedral, trickster, orbit, bloom };

/** Data are generated only from a curated, known artwork ID. Unknown means no realm. */
export function realmBlueprintFor(id) {
  const design = DESIGNS[id];
  if (!design) return null;
  const plan = FACTORIES[design.motif](design.palette);
  return {
    id, name: design.name, motif: design.motif, accent: design.accent,
    background: design.background, palette: [...design.palette],
    description: design.description, landmark: plan.landmark,
    batches: plan.batches, hoops: plan.hoops,
  };
}
export function realmBudget(blueprint) {
  if (!blueprint) return { instances: 0, batches: 0, hoops: 0 };
  return {
    instances: blueprint.batches.reduce((n, b) => n + b.instances.length, 0),
    batches: blueprint.batches.length,
    hoops: blueprint.hoops.length,
  };
}
