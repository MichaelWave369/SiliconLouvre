export const exhibition = Object.freeze({
  id: '001',
  title: 'The Stillness That Moves',
  subtitle: 'Six studies in perception, pattern, and the motion we invent.',
  curatorialNote: 'These are still images. Their repeating contrasts and spatial cues can produce apparent motion or depth. Responses vary by person, display, and viewing conditions. They are not medical or stress tests.',
});

export const artworks = Object.freeze([
  {
    id: 'gold-in-the-fold', number: '01', title: 'Gold in the Fold',
    variant: 'honeycomb', category: 'Depth', year: '2026',
    medium: 'Generative SVG / Optical study',
    description: 'A golden lattice folds around an impossible blue chamber. In front of it, a patterned sphere asks your eyes to decide which surface is nearer.',
    lookFor: 'Shift your attention between the orb and the narrow center of the lattice.',
    technique: 'Repeated hexagonal cells, perspective warping, occlusion and luminance gradients.',
  },
  {
    id: 'peripheral-bloom', number: '02', title: 'Peripheral Bloom',
    variant: 'mandala', category: 'Apparent motion', year: '2026',
    medium: 'Generative SVG / Optical study',
    description: 'Hundreds of high-contrast petals suggest rotation in a completely stationary flower of geometry.',
    lookFor: 'Look slightly away from the center, then return your gaze.',
    technique: 'Radial repetition, directional contrast and alternating dark-to-light edges.',
  },
  {
    id: 'event-horizon', number: '03', title: 'Event Horizon',
    variant: 'checker', category: 'Depth', year: '2026',
    medium: 'Generative SVG / Optical study',
    description: 'A checkerboard seems to cave into itself. Flat squares bend toward a center that has no physical depth.',
    lookFor: 'Trace one row of tiles from the edge toward the middle.',
    technique: 'Nonlinear grid transformation, strong color contrast and vignette.',
  },
  {
    id: 'eyes-of-the-atrium', number: '04', title: 'Eyes of the Atrium',
    variant: 'eyes', category: 'Perception', year: '2026',
    medium: 'Generative SVG / Optical study',
    description: 'A council of eyes surrounds a single center. Familiar biological forms transform into an almost architectural pattern.',
    lookFor: 'Notice how the outer eyes seem larger and closer than those near the iris.',
    technique: 'Radial scale gradients, repetition, figure-ground ambiguity and nested forms.',
  },
  {
    id: 'undertow', number: '05', title: 'Undertow',
    variant: 'tides', category: 'Apparent motion', year: '2026',
    medium: 'Generative SVG / Optical study',
    description: 'Colored ribbons and small orbiting disks make a static sea appear to flow around unseen currents.',
    lookFor: 'Move your gaze slowly between the upper-left and lower-right corners.',
    technique: 'Nested sinusoidal curves, offset circular motifs and contrast sequences.',
  },
  {
    id: 'architecture-of-elsewhere', number: '06', title: 'Architecture of Elsewhere',
    variant: 'funnel', category: 'Depth', year: '2026',
    medium: 'Generative SVG / Optical study',
    description: 'A field of blue diamonds collapses into a vanishing point, turning two dimensions into an imaginary room.',
    lookFor: 'Follow the smallest diamonds into the dark central opening.',
    technique: 'Nested rhombus tiles, perspective scaling, convergent geometry and shading.',
  },
]);

export const categories = Object.freeze(['All works', 'Apparent motion', 'Depth', 'Perception']);
export const attribution = Object.freeze({
  studio: 'The Silicon Louvre Studio',
  method: 'Original, code-generated SVG compositions with human-directed curatorial design and AI coding assistance.',
  status: 'No third-party artist attribution is implied.',
});
