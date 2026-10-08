# THE SILICON LOUVRE

### A museum without walls. A canvas without borders.

The Silicon Louvre is a public, independent digital museum celebrating imagination, optical art, and human–AI collaboration.

**Opening exhibition: 001 — The Stillness That Moves**

Six original, code-generated SVG optical-art studies invite visitors to consider the space between what an image *does* and what an observer *sees*. These six programmatic pieces are **not** the previously generated AI images; their media can be added in a later, provenance-preserving import.

## Visit

After enabling GitHub Pages with **GitHub Actions** as the deployment source:

https://michaelwave369.github.io/SiliconLouvre/

Build status and source: https://github.com/MichaelWave369/SiliconLouvre

## Latest: Gallery Walk v0.2

- **Self-paced six-stop tour** with large, framed optical-art presentations and individual museum plaques.
- **Artwork Only** option for a more immersive, distraction-free display; restore the plaque at any time.
- Tour entry buttons, numbered stops, guided navigation and keyboard shortcuts (← →, G, F, Esc).
- Same artwork details, direct links, local favorites and provenance data; nothing autoplays or emits sound.
- Responsive display for phones and tablets.
- See the [Visitor Guide](docs/visitor-guide.md) for viewing instructions, accessibility and credits.

## Foundation: v0.1

- Responsive museum entrance and inaugural exhibition with six deterministic SVG images.
- Filter by theme (apparent motion, depth, perception).
- Artwork details, descriptions, technique, and explicitly stated provenance.
- Per-artwork focus guide, previous/next keyboard navigation, and direct-link sharing.
- Local-only favorite list (localStorage); no accounts, analytics or tracking.
- Accessibility: semantic headings, keyboard-accessible controls, dialog focus trap, reduced-motion support.
- Three clearly marked *planned* wings, not simulated live features.
- Automated tests, Vite build, and GitHub Pages deployment workflow.

## Exhibition 002: Founding Masters

The six original **image-generated** illusion artworks from the founding creative session have a curated, provenance-checked import path. They are **not** the SVGs in Exhibition 001.

- The Founding Masters wing appears in a graceful "awaiting installation" state until artwork files are imported.
- After importing the six approved `.webp` files into `src/assets/masters/`, Vite discovers them automatically at build time; individual artwork cards, full-view museum plaques, keyboard navigation, and deep-link sharing become available.
- A local integrity script checks the original WebP derivatives' SHA-256 fingerprints before every release build.
- Full-resolution PNG originals stay in the standalone preservation pack and are not sent to site visitors unless separately published.
- See [Founding Masters import guide](docs/founding-masters-import.md) for exact steps.

## Run locally

Requires Node.js 22 or newer:

```bash
npm install
npm run dev
```

Run validation:

```bash
npm run check
```

Build production site:

```bash
npm run build
npm run preview
```

The production base path in `vite.config.js` is configured for GitHub Pages at `/SiliconLouvre/`.

## Publishing

Merge a passing release pull request into `main`. In **Settings → Pages → Build and deployment**, select **GitHub Actions**. The workflow tests every PR and deploys built assets from `main` to GitHub Pages. The first deployment may require manual Pages approval or enabling Actions in repository settings.

## Exhibition data

Curated exhibit records are in `src/data/artworks.js`. Artwork renderers are in `src/art/IllusionArt.jsx`. Publishing future artist submissions is intentionally **not** an open unauthenticated endpoint: future ingestion should require ownership/consent metadata, human curator approval and clear agent attribution.

When importing generated image assets later, include creator direction, model/tool used (when known), permission status, original artwork files and explicit usage terms. Never misattribute work or confuse static apparent motion with animation.

## Curatorial and accessibility statement

The images are still. Some people may experience illusory motion or depth; others may not. This is **not** a diagnostic, medical, or stress test. Avoid claiming that movement perception measures emotional state. Effects can vary by display, attention and vision. Visitors can use a fixed focus point. No autoplay animation or flashing is used.

## License and name

The website **source code** is available under [MIT](LICENSE). Artwork is separately credited and future submissions may carry their own rights; MIT should not be read as blanket permission to reuse every exhibition image.

This is an **independent project**, not associated with or endorsed by the Musée du Louvre in Paris. Check trademark and naming requirements before adopting a commercial brand, domain or merchandise.

Built to celebrate human and AI creativity, with real human responsibility for publication.
