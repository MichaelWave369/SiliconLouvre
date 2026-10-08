export const foundingMastersExhibition = Object.freeze({
  id: '002',
  title: 'The Founding Masters',
  subtitle: 'Six original human-directed, AI-generated still artworks.',
  context: 'These are image-generated original artworks, not the programmatic SVG studies in Exhibition 001. Their geometric designs can suggest movement or depth, but the files themselves are static.',
  status: 'Curated import collection',
});

export const foundingMasters = Object.freeze([
  {
    id: 'gold-in-the-fold', number: '01', title: 'Gold in the Fold',
    file: 'gold-in-the-fold.webp',
    original: 'golden_honeycomb_vortex_with_floating_orb.png',
    sha256: 'e7a7906ec443832fd5c23de078732fcc964ca02b6f505ca04424aaa453356612',
    description: 'A golden honeycomb vessel curves toward infinity, while a patterned sphere appears to emerge from its depths.',
    alt: 'Golden honeycomb lattice bending around a blue tunnel and yellow hexagonal orb.',
    technique: 'Depth cues, repetition, high-contrast color boundaries.',
  },
  {
    id: 'peripheral-bloom', number: '02', title: 'Peripheral Bloom',
    file: 'peripheral-bloom.webp',
    original: 'psychedelic_radial_mandala_illusion.png',
    sha256: '350c04976272eedf48699f6c943d1937fad9ac7236fe4f982c1123b21aca9f49',
    description: 'Petals of yellow, orange and midnight blue grow toward the edges of a motionless, hypnotic bloom.',
    alt: 'Concentric orange, yellow, white and deep blue teardrop petals surrounding a small center.',
    technique: 'Radial repetition, directionality, alternating luminance.',
  },
  {
    id: 'event-horizon', number: '03', title: 'Event Horizon',
    file: 'event-horizon.webp',
    original: 'psychedelic_hourglass_checkerboard_tunnel.png',
    sha256: 'a6630b294b69e48ca8acad99d497c2afc436323071782a58e7ef8ee97917e6a3',
    description: 'A saturated checkerboard folds inward, presenting an impossible hourglass passage made entirely of pixels.',
    alt: 'Purple, blue, white, gold and black checkerboard bending inward at the image center.',
    technique: 'Distorted grid, contrast, perspective and perceived curvature.',
  },
  {
    id: 'eyes-of-the-atrium', number: '04', title: 'Eyes of the Atrium',
    file: 'eyes-of-the-atrium.webp',
    original: 'hypnotic_purple_and_gold_eye_mandala.png',
    sha256: '04df675e305969c884d9c08885527802d59f3a71f7c9b874860d4a5538bc924f',
    description: 'An impossible architecture of nested violet eyes spirals around a single, watchful iris.',
    alt: 'Golden and violet nested eye shapes arranged around a central purple iris.',
    technique: 'Scale variation, pattern density, visual attention.',
  },
  {
    id: 'undertow', number: '05', title: 'Undertow',
    file: 'undertow.webp',
    original: 'psychedelic_swirling_orb_op_art.png',
    sha256: 'd1b4dd52bf5b20aca5b27edf203a72954f413880f6a67bd144629b7ede5798f5',
    description: 'Blue and gold ribbons swirl around a constellation of still, patterned orbs.',
    alt: 'Curving yellow, blue, white and black bands weaving among circular striped orbs.',
    technique: 'Curved contrast bands, radial motifs and visual flow.',
  },
  {
    id: 'architecture-of-elsewhere', number: '06', title: 'Architecture of Elsewhere',
    file: 'architecture-of-elsewhere.webp',
    original: 'symmetrical_op_art_geometric_vortex.png',
    sha256: '348add725d8c5749bca1214e3924487db81ae3ff9aef13dfe4d234d32c162fce',
    description: 'Gold-edged diamonds seem to fall into a blue tunnel, turning a flat surface into impossible architecture.',
    alt: 'Blue and turquoise diamonds in golden zigzag lattice converging toward a dark tunnel.',
    technique: 'Convergent geometry, repeated tiling, depth illusion.',
  },
]);

export const foundingMastersProvenance = Object.freeze({
  artist: 'The Silicon Louvre founding collaboration',
  direction: 'Human-directed creative collaboration initiated by the museum founder.',
  generation: 'OpenAI image generation, 2026.',
  preservation: 'Full-resolution PNG masters preserved separately; optimized WebP exhibition derivatives are delivered by the museum.',
  disclaimer: 'Independent work, not affiliated with or endorsed by the Musée du Louvre. These images are static artworks and are not stress tests.',
});
