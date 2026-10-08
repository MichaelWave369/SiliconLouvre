# Virtual Atrium v0.6

**A navigable, 3D-inspired gallery room inside The Silicon Louvre.**

Exhibition 001, *The Stillness That Moves*, now has an optional spatial viewing experience. The room uses pure CSS perspective and the existing six still SVG artworks. It is not free-roaming 3D, WebGL or VR; visitors select a painting to focus, then enter the original Gallery Walk.

## How to visit

1. Open the **Atrium** link in the museum navigation, or choose **Explore the Virtual Atrium** from the inaugural exhibition.
2. Use the left/right arrow buttons to change the central framed work, or click an adjacent painting to focus it.
3. Use the six numbered stops under the room to jump directly to any piece.
4. Click the central painting or press **Enter Artwork** to open it in the existing full Gallery Walk.
5. Within the atrium region, the keyboard left/right arrows move between works. All functionality is available by button, and the room is navigable via Tab.

### Viewing comfort

- Artwork files are static, with no deliberate flicker or autoplay movement.
- CSS perspective effects are limited to visitor-chosen selection changes, with transitions switched off under `prefers-reduced-motion`.
- The room is not an eye-stress or medical test. Different visitors perceive illusions differently.
- No motion sensor, camera, microphone, account, or third-party API is used.
- The underlying Exhibit 001 collection cards and detail views remain available if spatial perspective is uncomfortable.

## Implementation

- `src/VirtualAtrium.jsx`: spatial viewer, keyboard controls and connection to the existing Gallery Walk.
- `src/styles/atrium.css`: museum architecture and mobile/responsive design.
- `src/lib/atrium.js` and `src/lib/atrium.test.js`: pure wraparound navigation and adjacency logic with unit tests.
- The visitor clicks on each piece; no agent chooses, manipulates or publishes artwork.

## The next architecture rung

This is Phase I of a potential physical-style museum navigation system:

- **Phase II:** dedicated museum rooms with door-to-door movement, optional touch joysticks and map.
- **Phase III:** optional WebGL/WebGPU rooms, performance profiling and asset streaming on supported devices.
- **Phase IV:** cross-device immersive mode with accessibility fallback and permissions-based collaborative events.

The basic website and editorial exhibition should remain usable on ordinary laptops and phones. These phases are design intentions, not currently shipping features.

## Exhibitions and asset status

Exhibition 002, *The Founding Masters*, relies on separately uploading six curated WebP images from the verified founding image archive. This atrium release neither installs nor alters those original image files.
