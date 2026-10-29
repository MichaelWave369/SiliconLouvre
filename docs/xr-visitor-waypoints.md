# Silicon Louvre XR · Realm Wiring + Comfort Waypoints

This release closes a wiring gap in PR #22: the curated realm blueprints and instanced sculpture renderer existed in source but were not invoked by the live XR page. The existing tests only exercised the generator, and the green CI run did not establish scene integration. The XR main entry now explicitly calls both modules; a static regression test guards the actual call sites.

## Four unique worlds

The Gear Cathedral, Trickster Chorus, Hinge Observatory, and Blooming Iris are still **procedural interpretations** of curated Domistika Dialogues drawings. The paintings and their separate author credits remain unchanged. The world renderer uses bounded instanced primitives and is not a pixel-to-mesh converter.

## Comfortable exploration (experimental)

The headset starts at a static portal threshold. With the wrist closed, visitors may select in-world NEXT STOP or PREVIOUS STOP plaques to **teleport without motion animation** between four fixed, reviewed positions: threshold, gallery, sculptures, inner horizon. The desktop page also exposes Previous/Next Stop buttons; bracket keys are additional desktop shortcuts. Movement is discrete, within the existing museum floor, and disabled outside a painting or when Gen.E.Wrist owns controller input. Recenter restores the current stop; returning to the atrium resets the stop index.

No thumbstick locomotion, turning, object collisions, camera head-pose overrides, or smooth zoom are introduced. All VR movement requires an explicit selection. Natural room-scale headset movement remains owned by the browser's WebXR reference space.

## QA

- CI: blueprint and live-entry wiring tests, numeric waypoint limits, step clamping, wrist-capture guard, and Vite production build.
- Desktop: enter each of four paintings, confirm unique geometry and titles, step forward/back, return/reenter and verify the threshold reset; check pointer/keyboard controls.
- Quest 3: confirm each in-world waypoint plaque raycast, no unexpected movement when wrist is expanded, no teleport while in atrium, scene placement, floor height, eye comfort, and reentry after several cycles.
- Verify that the ORIGINAL and INSPIRED paintings remain separately credited and that museum and Gen.E.Wrist navigation have not changed.

A green software build is **not** a physical Quest 3 acceptance result.


## Quest interaction reliability rung

The original return-to-atrium plaque lived inside the world near the portal threshold. After jumping deep into a sculpture chamber, visitors could be more than twenty metres away from it. The return plaque is now mounted on the visitor rig, independently of world geometry, so it can be reached at every waypoint without overriding the headset's tracked physical head pose.

The shared interactionRouting.js module resolves hits with one deterministic priority: while expanded, Gen.E.Wrist captures all rays (including missed panels); otherwise its launcher is preferred, followed by the nearest applicable return/waypoint target inside artwork or an artwork frame in the atrium. Desktop click and controller trigger use the same semantic routing. Mint controller beams signal a target; gold beams indicate no actionable selection.

While the wrist captures input, normal HTML movement and portal controls are also disabled. When headset visibility becomes hidden, the wrist closes and releases its captured input. Controller disconnect hides its beam. These are browser safeguards, not proof of physical Quest compatibility.

Tests cover action priority, wrist miss suppression, hidden travel targets, visitor-relative exit raycasts at every reviewed waypoint, and the live software integration. No smooth locomotion, automatic publication, external image requests, or changes to curatorial history are added.

**Physical acceptance still required:** controller aim readability, immediate return from the inner horizon, headset pause/resume, repeat entry/exit performance, input capture and comfort.
