# The Perception Lab (Education Wing)

The Silicon Louvre includes free, interactive demonstrations alongside its optical-art exhibitions. These activities invite visitors to compare their own observations with basic concepts in visual perception. **They are not tests of vision, mental health, stress, attention, or intelligence.**

## Three stations

### 01 · One shade, two surroundings

Two squares are drawn with the **exact same RGB value: 146, 146, 146** (`#929292`).

The surrounding left and right backgrounds change as you move the slider. At zero, both backgrounds and centers are identical. At full contrast, the left background becomes `#121212` while the right becomes `#ffffff`. The squares' fill values never change. Visitors can reveal a connecting strip of the same gray to verify the equality visually.

This demonstrates the concept of **simultaneous lightness contrast**: a region's surrounding context can influence its apparent brightness. People's individual experiences vary.

### 02 · Depth on a flat screen

The drawn perspective floor uses ordinary, straight SVG lines and horizontal crossbars that converge toward a common point. The scene can appear to recede, despite being a flat vector illustration.

The **Reveal the vanishing point** button draws the construction guide. It does not change the underlying lines or simulate an actual 3D model.

### 03 · Stillness, felt differently

A still version of the museum's existing *Peripheral Bloom* SVG fills the observation panel. Visitors can show a stationary center focus marker.

Repeated patterns and contrast sometimes create impressions of apparent motion. This particular drawing is **not validated as a laboratory-grade peripheral-drift stimulus**, and not everyone will perceive motion. The illustration contains no moving frames.

## Controls and accessibility

- The context experiment uses a native range input with a visible numeric value, adjustable with keyboard arrows and pointer input.
- Each optional overlay has a labelled button with an accessible pressed state.
- All experiments are self-paced: no autoplay, flashing, sound, webcam, tracking, or behavioral measurement.
- Visitors may leave at any time; reduced-motion preferences are honored.
- Every effect is explained in text so visual perception differences do not prevent learning.

## Scientific restraint

These experiments illustrate well-established ideas (surrounding context, linear perspective, repeated high-contrast patterns). They do **not** establish an individual diagnosis, imply that looking at an image measures stress, or claim that any particular person must experience the same illusion.

The museum does not save slider positions, record observation reports, or collect health information.

## Implementation

- `src/PerceptionLab.jsx` holds the self-contained three-station exhibit.
- `src/lib/perception.js` provides deterministic grayscale and SVG geometry helpers.
- `src/lib/perception.test.js` verifies same-value square fills, clamping and convergence geometry.
- `src/styles/perception.css` provides responsive gallery styling.

The education wing is accessible from Exhibition 001 and the Museum Passport directory.

## Further museum research

A future version could add curatorial reference cards, optional image comparisons, and documented accessibility evaluation with multiple devices. Any new scientific claim should have a precise supporting reference and be worded within what the underlying research actually establishes.
