# Silicon Louvre XR: opt-in Quest Field Check v1

The XR museum now has a visitor-operated **QUEST FIELD CHECK** panel. It gathers a small, reproducible, local software observation when testing on a real headset. It is not a performance certification, diagnostic upload, GPU profiler or claim that the headset meets a specific FPS target.

## How to use it

1. In Quest 3 Browser, open the HTTPS XR museum page.
2. Before entering VR, open QUEST FIELD CHECK and press START CHECK.
3. Close the panel, enter immersive VR, and visit one of the four approved Domistika Dialogues painting portals.
4. Visit threshold, origins gallery, sculpture chamber and inner horizon via the in-world signs. Confirm RETURN TO ATRIUM remains reachable.
5. Return to the museum, visit another painting, and open/close Gen.E.Wrist to test input capture.
6. Exit VR. Open QUEST FIELD CHECK and press STOP CHECK, then COPY REPORT. If clipboard access is blocked, select the report text and copy manually.

The report is never uploaded, stored or sent automatically. It resets on refresh or each new START CHECK. It excludes device IDs, camera/microphone data, controller poses, arbitrary artwork text, environment maps, network identity and private state.

## Observations available

- Counts of WebXR session starts, ends and hidden-session events during the opt-in window.
- Counts of completed painting portal entries/exits and the last reviewed realm ID.
- Number of immersive renderer callbacks and minimum/average/maximum JavaScript callback intervals. These are not guaranteed displayed frames and are not GPU frame timings.
- Latest and peak Three.js renderer.info counters: geometries, textures and per-frame draw calls. These are renderer-maintained values, not comprehensive GPU/VRAM measurements.

Stats are kept in the page's process memory only. The panel refreshes at most once per 1.5 seconds when open. When inactive, it discards samples.

## Verification

CI verifies the pure recording logic, opt-in requirement, finite counts, frame interval handling, allowlisted events and live XR lifecycle call sites. Existing curation and wrist permission tests remain unchanged.

Physical Quest 3 testing remains required for comfort, controller tracking, aim, text legibility, thermal/battery effects and repeated visits. Renderer counters may change due to asynchronous image loads or internal caches and are not automatically proof of a memory leak.

This feature adds no external dependencies, app permissions, remote analytics, localStorage or modifications to the approved source artworks.
