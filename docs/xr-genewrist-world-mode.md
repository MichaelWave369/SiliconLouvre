# Silicon Louvre XR to Gen.E.Wrist World Mode v1

This is a host integration, not a fork of Gen.E.Wrist. Silicon Louvre owns rendering, scene transitions and museum assets. Gen.E.Wrist owns universal navigation, WorldAdapter validation, capability grants and lifecycle. The original 3–6–9 rings are unchanged.

## Dependency

The @phi369/genewrist Git dependency is pinned to exact commit d492425ee2316a94f5564dd91400e745536e53cf (SDK 0.3.0). Vite bundles this dependency into the same XR page, so visitors do not load the GitHub source at runtime. Updating the pin requires independent review and regression testing.

## Host state and commands

The WorldAdapter API 1 module src/xr/louvreWorldAdapter.js declares two real contexts:
- ATRIUM: title, selected station and total; previous/next, explicit portal entry and recenter.
- ARTWORK: current work and procedural environment; return to atrium and recenter.

Status comes only from museum-owned runtime events. Subscriptions are disposed on disconnect. Actions invoke only preexisting museum callbacks. Grants start empty. Visitors may separately grant or revoke navigate-paintings, enter-portals and view-position. The wrist does not have access to curation, publishing, private documents or arbitrary websites.

## Desktop and XR

On desktop, the OPEN GEN.E.WRIST button or G key toggles the embedded World panel. It uses the reviewed Gen.E.Wrist presentation with persistent Home, Back, Universal and World navigation. Closing releases host input capture, so normal scene controls resume.

In an active WebXR session, a floating GEN.E.WRIST plaque can be selected by controller ray. Squeeze is a secondary toggle on compatible controllers. An actual Gen.E.Wrist Canvas surface is mapped onto an in-scene plane using the Louvre's existing Three.js renderer and XRSession, not a second session. Target selection uses the canvas's reviewed hit rectangles, not a recreated host button list. While open, the wrist owns inputs and museum painting-selection controls are suppressed. Session end releases capture.

There is no claim of automatic pixels-to-3D conversion, multi-user worlds, new artwork publication, controller walking or cross-site in-session portals.

## Acceptance checklist

1. CI: npm install && npm run check, including Gen.E.Wrist WorldAdapter tests and Vite build.
2. Desktop: Open/close and G hotkey; navigate Home/Back/Universal/World; grant and revoke capabilities; check host actions and disabled actions. When open, painting selection and WASD do not move the museum. When closed, original controls work.
3. Quest 3: enter WebXR, aim controller at the floating plaque and press trigger; grant action access, navigate painting, enter and return. Check secondary squeeze toggle, legibility, input capture, rendering performance and comfort.
4. End headset session; verify no stale capture and that the standard website and curated artworks remain intact.

Software/CI green does not establish Quest device behavior, performance or comfort. Those require a physical acceptance pass.

## Context handoff safeguard

Gen.E.Wrist requestWorldAction deliberately checks that the original context is still active after a handler returns. Enter and Return therefore enqueue the actual portal scene mutation for the next browser task, after Gen.E.Wrist has completed that check. The queued mutation validates the host scene and AbortSignal again, and only one portal transition can be pending. This keeps the upstream fail-closed behavior intact instead of weakening permission validation. Review future asynchronous host commands against this boundary.
