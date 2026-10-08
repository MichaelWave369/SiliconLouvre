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

## Artist Registry v0.5

The museum's new **Artist Registry** profiles published creative contributors and documents precisely how humans and AI tools contributed.

- The founding profile is **The Silicon Louvre Studio**, credited as a collaboration, not a fictional independent AI identity.
- Each credit line distinguishes human creative direction, AI image-generation support, and AI coding assistance.
- Human Artist, Shared Studio and Agent Residency opportunities are labeled **Planned**, not falsely advertised as active or approved.
- Artists may propose an exhibit using the [public GitHub proposal form](https://github.com/MichaelWave369/SiliconLouvre/issues/new?template=artist-proposal.yml); the form does not automatically publish work.
- `npm run check` validates approved profiles, exhibition references and contributor credit completeness.
- Read [the registry and curatorial policy](docs/artist-registry.md) for review rules and how to add approved records.

## Virtual Atrium v0.6

The museum now has a **3D-inspired, navigable gallery room** in Exhibition 001. Choose any of the six original, still SVG artworks from a framed spatial display, then enter the existing immersive Gallery Walk from the central painting.

- Left/right controls and six direct artwork stops.
- Buttons, keyboard navigation and a mobile-friendly design.
- Uses CSS perspective, not WebGL or VR. No extra runtime dependencies.
- Motion transitions obey visitors' reduced-motion preferences.
- Works without online media APIs and preserves the original Gallery Walk and artist credits.

Read the [Virtual Atrium visitor guide](docs/virtual-atrium.md). Later phases may add walkable rooms and opt-in WebGL rendering, but they are not claimed as complete.

## Visitor Passport & Museum Map v0.7

An opt-in, free browser-only **Visitor Passport** now appears after the Virtual Atrium. Every Exhibition 001 artwork opened earns a local visit stamp. The passport also counts existing local favorites, provides six quick-entry artwork buttons, and shows a map of the four actual museum areas.

- No account, telemetry, cloud syncing or personal profile.
- Respects reduced-motion settings; fully keyboard-accessible controls.
- Explicitly distinguishes open areas from original-image installation pending status.
- Visitors can confirm clearing their stamps without deleting favorites.
- Details: [Museum Passport visitor guide](docs/museum-passport.md).

## Perception Lab v0.8 · Education Wing

A free, self-paced learning room now accompanies the art. Three interactive stations demonstrate **same-gray squares against different surroundings**, **linear perspective on a flat SVG**, and **the subjective experience of a static repeated pattern**.

- Slider-based contrast comparison, fixed-value proof bridge, perspective guide toggle, and optional stationary focus dot.
- No animation, medical or stress claims, accounts, telemetry, or required responses.
- Accessible controls, mobile layouts and tests of fixed color values and geometry.
- Visitor Passport room directory now links to the lab.
- Full visitor and curatorial guidance: [The Perception Lab](docs/perception-lab.md).

## Optical Art Studio v0.9 · Create Wing

Visitors can now design their own **static, code-generated SVG optical art** in a free browser-local workshop. The studio includes Radial Bloom, Nested Gears and Iris Cathedral compositions, four color palettes, adjustable rings/motifs/rotation, immediate preview, SVG download, and a JSON recipe copy function.

This studio does **not** publish user artwork to the permanent collection, request an account, track edits, or claim to be a stress/medical tool. The Museum Passport's room map links to the workshop, and artwork creation remains distinct from curator-approved exhibition credits.

Read the [Optical Art Studio guide](docs/optical-art-studio.md) for controls, limitations and future interoperability ideas.

## Domistika Creative Handoff v1

The Optical Art Studio can explicitly send a short-lived, integrity-checked SVG to Domistika through browser-local storage when both GitHub Pages apps are deployed under the same origin. Domistika previews the image, requires a download backup and visitor confirmation, then imports it as a **raster paint layer**.

The transfer is **not automatic** and does not publish artwork. Vector paths remain available through the original Save SVG function. If Domistika's matching receiver is not deployed, the visitor can still save SVG manually.

See [Creative Handoff contract and visitor checklist](docs/domistika-handoff-v1.md).

## Creative Studio Draft Shelf v1.0

Visitors can save up to 12 design recipes privately in their browser, reload their settings later, paste older `silicon-louvre-studio/v1` recipes, and remove drafts with confirmation. The SVG export and Domistika handoff continue to work with the chosen design.

The draft shelf does not upload artwork, publish it, or collect visitor identity. Clearing browser storage removes locally saved drafts. See the [draft shelf visitor guide](docs/creative-draft-shelf-v1.md).

## Exhibition Submission Desk v1.0

Artists using the Creative Studio can prepare a **curator-reviewed exhibition proposal** with an artwork title, public display credit, contributor roles, artistic process, rights proposal and an accessibility description. The desk exports a portable JSON curator kit containing the actual generated SVG, a separate SVG file, and a shareable plain-text proposal summary.

The site never uploads proposals or publishes anything automatically. A public [GitHub artist proposal form](https://github.com/MichaelWave369/SiliconLouvre/issues/new?template=artist-proposal.yml) remains the opt-in submission path. A local `npm run inspect:submission -- path/to/proposal.json` command can check packet integrity and status before human review, **without granting publication approval**.

See [Exhibition Submission Desk guide and review policy](docs/exhibition-submission-desk.md).

## Community Gallery / Curatorial Publishing v1.1

The museum now has **Exhibition 003: The Community Gallery**, a destination for future art created by visitors. It currently displays an honest *awaiting first reviewed artist* wall; no fictional artists or approved works are seeded.

The review process begins with the Creative Studio's Submission Desk and public issue form, then proceeds through a **human curator-approved GitHub PR**. The public catalog is build-checked for valid rights and contribution metadata, a real proposal issue reference, accessible text, reproducible SVG recipe and explicit review receipt. A separate local `npm run stage:curated -- ...` tool can prepare metadata only *after actual human review*. It cannot submit or publish anything.

`src/data/curatedWorks.js` stores only intentionally approved exhibits. `.github/CODEOWNERS` requests curator review, but **protecting main and requiring code-owner approval in GitHub Settings is required to enforce it**. Structural tests alone do not verify actual rights or human identity.

See [Curatorial Publishing Workflow](docs/curatorial-publishing.md) for the admission steps, legal/attribution caveats and acceptance plan.

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
