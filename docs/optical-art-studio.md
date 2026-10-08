# Optical Art Studio · Visitor Creation Workshop v0.9

The Silicon Louvre invites visitors to create their own generative optical artwork directly in the browser. This is a simple, free creative tool rather than an automated exhibition submission service.

## Start creating

Navigate to **CREATE** in the museum navigation, select a starting design, choose a color palette, and adjust the sliders. The preview refreshes instantly as you work.

The studio offers three deterministic compositions:

- **Radial Bloom**: repeated colored petals in concentric rings.
- **Nested Gears**: interlocking-looking polygon teeth and concentric outlines.
- **Iris Cathedral**: nested eye motifs arranged in radial formations.

Select from four palettes: Gilded Nocturne, Electric Garden, Aurora Glass, or Ember Cathedral. Adjust **concentric rings (2–9)**, **motifs per ring (6–36)** and **rotational offset (-90° to 90°)**.

Use **Save Your SVG Artwork** to export an 800×800 scalable-vector drawing that can be opened locally in common browsers and vector design tools. The SVG is rendered directly by code and has no embedded scripts, animation, external images, or remote URL dependencies.

Use **Copy Design Recipe** to copy a JSON description of your settings. The recipe is useful for manually recreating a setting. This release does **not** yet support importing a recipe, saving a draft on the website, or publishing directly into the collection.

## Privacy and permissions

- Every change is computed inside your own browser session.
- The preview is not uploaded to any server. No account, API key, microphone, camera, or permission request is necessary.
- No user-generated work is automatically added to permanent exhibitions or represented as official artwork.
- The export is your locally generated SVG composition. Publication in the museum requires human curatorial review and appropriate permissions.
- There is no stress score, vision test, or health inference.

## Technical details

- `src/lib/studio.js` contains deterministic SVG generation and a strict validated settings schema.
- `src/lib/studio.test.js` checks all three modes, visual motif counts, safe value bounds, and resistance to markup injection from user settings.
- `src/OpticalArtStudio.jsx` implements the creative interface, live preview, SVG export and recipe copy.
- `src/styles/studio.css` provides responsive gallery styling and reduced-motion support.
- The Museum Passport directory links directly to the workshop.

The image is static. A repeated optical pattern can appear active to certain observers, but the art itself has no motion or timed frames.

## Future creative bridges

Possible later work includes approved exporting/importing between this workshop and Domistika, Auralith, or PixelForge, plus a human-led submission review pipeline. Those integrations **do not exist** in this release.
